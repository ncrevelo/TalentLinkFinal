import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  writeBatch,
  increment,
  QueryDocumentSnapshot,
  DocumentData,
  WhereFilterOp
} from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import {
  Job,
  JobCreateRequest,
  JobUpdateRequest,
  JobFilters,
  JobStatus,
  JobProgress,
  DeletedJob,
  JobStats,
  JobSortField,
  Department,
  HiringStage,
  StageTransition,
  HIRING_STAGES
} from '../types';

export class JobService {
  private readonly JOBS_COLLECTION = 'jobs';
  private readonly DELETED_JOBS_COLLECTION = 'deletedJobs';
  private readonly JOB_STATS_COLLECTION = 'jobStats';

  /**
   * Create a new job posting
   */
  async createJob(jobData: JobCreateRequest, userId: string): Promise<string> {
    try {
      const now = new Date();
      const searchTerms = this.generateSearchTerms(jobData);
      
      const job: Omit<Job, 'id'> = {
        ...jobData,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        isActive: true,
        isDeleted: false,
        status: JobStatus.DRAFT,
        positionsFilled: 0,
        progress: {
          applicationsReceived: 0,
          applicationsReviewed: 0,
          interviewsScheduled: 0,
          offersExtended: 0,
          hiredCandidates: 0,
          progressPercentage: 0,
          currentStage: HiringStage.RECEIVING_APPLICATIONS,
          stageHistory: [{
            fromStage: null,
            toStage: HiringStage.RECEIVING_APPLICATIONS,
            transitionDate: now,
            performedBy: userId,
            notes: 'Trabajo creado'
          }]
        },
        searchTerms,
        tags: jobData.tags || []
      };

      const docRef = await addDoc(collection(db, this.JOBS_COLLECTION), {
        ...job,
        createdAt: Timestamp.fromDate(job.createdAt),
        updatedAt: Timestamp.fromDate(job.updatedAt),
        deadline: Timestamp.fromDate(job.deadline)
      });

      // Update user stats
      await this.updateUserJobStats(userId, 'create');

      return docRef.id;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job posting');
    }
  }

  /**
   * Get job by ID
   */
  async getJobById(jobId: string): Promise<Job | null> {
    try {
      const docRef = doc(db, this.JOBS_COLLECTION, jobId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return this.convertFirestoreJob({ id: docSnap.id, ...docSnap.data() } as any);
    } catch (error) {
      console.error('Error getting job:', error);
      throw new Error('Failed to fetch job');
    }
  }

  /**
   * Update job
   */
  async updateJob(jobId: string, updates: JobUpdateRequest, userId: string): Promise<void> {
    try {
      const docRef = doc(db, this.JOBS_COLLECTION, jobId);
      const job = await this.getJobById(jobId);
      
      if (!job || job.createdBy !== userId) {
        throw new Error('Job not found or unauthorized');
      }

      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      };

      // Handle date fields
      if (updates.deadline) {
        updateData.deadline = Timestamp.fromDate(updates.deadline);
      }

      // Update search terms if relevant fields changed
      if (updates.title || updates.description || updates.tags) {
        const searchableData = {
          title: updates.title || job.title,
          description: updates.description || job.description,
          tags: updates.tags || job.tags
        };
        updateData.searchTerms = this.generateSearchTerms(searchableData);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating job:', error);
      throw new Error('Failed to update job');
    }
  }

  /**
   * Update job progress
   */
  async updateJobProgress(jobId: string, progress: Partial<JobProgress>, userId: string): Promise<void> {
    try {
      const job = await this.getJobById(jobId);
      
      if (!job || job.createdBy !== userId) {
        throw new Error('Job not found or unauthorized');
      }

      const updatedProgress = { ...job.progress, ...progress };
      
      // Calculate progress percentage
      const total = updatedProgress.applicationsReceived;
      if (total > 0) {
        const processed = updatedProgress.applicationsReviewed + 
                         updatedProgress.interviewsScheduled + 
                         updatedProgress.offersExtended + 
                         updatedProgress.hiredCandidates;
        updatedProgress.progressPercentage = Math.round((processed / total) * 100);
      }

      // Auto-update status based on progress
      let newStatus = job.status;
      if (updatedProgress.hiredCandidates >= job.positionsAvailable) {
        newStatus = JobStatus.FILLED;
      } else if (job.deadline < new Date()) {
        newStatus = JobStatus.EXPIRED;
      }

      await updateDoc(doc(db, this.JOBS_COLLECTION, jobId), {
        progress: updatedProgress,
        status: newStatus,
        positionsFilled: updatedProgress.hiredCandidates,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating job progress:', error);
      throw new Error('Failed to update job progress');
    }
  }

  /**
   * Get jobs with filters and pagination
   */
  async getJobs(
    userId: string,
    filters: JobFilters = {},
    lastVisible?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ jobs: Job[]; hasMore: boolean; lastVisible?: QueryDocumentSnapshot<DocumentData> }> {
    try {
      let q = query(
        collection(db, this.JOBS_COLLECTION),
        where('createdBy', '==', userId),
        where('isDeleted', '==', false)
      );

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        q = query(q, where('status', 'in', filters.status));
      }

      if (filters.department && filters.department.length > 0) {
        q = query(q, where('department', 'in', filters.department));
      }

      if (filters.jobType && filters.jobType.length > 0) {
        q = query(q, where('jobType', 'in', filters.jobType));
      }

      if (filters.workModality && filters.workModality.length > 0) {
        q = query(q, where('workModality', 'in', filters.workModality));
      }

      if (filters.experienceLevel && filters.experienceLevel.length > 0) {
        q = query(q, where('experienceLevel', 'in', filters.experienceLevel));
      }

      if (filters.salaryMin) {
        q = query(q, where('salaryRange.min', '>=', filters.salaryMin));
      }

      if (filters.salaryMax) {
        q = query(q, where('salaryRange.max', '<=', filters.salaryMax));
      }

      if (filters.createdAfter) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.createdAfter)));
      }

      if (filters.createdBefore) {
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.createdBefore)));
      }

      if (filters.tags && filters.tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', filters.tags));
      }

      // Apply search query
      if (filters.searchQuery) {
        const searchTerms = filters.searchQuery.toLowerCase().split(' ');
        q = query(q, where('searchTerms', 'array-contains-any', searchTerms));
      }

      // Apply sorting
      const sortField = filters.sortBy || JobSortField.CREATED_AT;
      const sortOrder = filters.sortOrder || 'desc';
      q = query(q, orderBy(sortField, sortOrder));

      // Apply pagination
      const pageLimit = filters.limit || 10;
      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }
      q = query(q, limit(pageLimit + 1)); // Get one extra to check if there are more

      const querySnapshot = await getDocs(q);
      const jobs: Job[] = [];
      let newLastVisible: QueryDocumentSnapshot<DocumentData> | undefined;

      querySnapshot.docs.forEach((doc, index) => {
        if (index < pageLimit) {
          jobs.push(this.convertFirestoreJob({ id: doc.id, ...doc.data() } as any));
          newLastVisible = doc;
        }
      });

      const hasMore = querySnapshot.docs.length > pageLimit;

      return { jobs, hasMore, lastVisible: newLastVisible };
    } catch (error) {
      console.error('Error getting jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }

  /**
   * Soft delete a job (move to deleted collection)
   */
  async deleteJob(jobId: string, userId: string, reason?: string): Promise<void> {
    try {
      const job = await this.getJobById(jobId);
      
      if (!job || job.createdBy !== userId) {
        throw new Error('Job not found or unauthorized');
      }

      const batch = writeBatch(db);
      const now = new Date();

      // Create deleted job record
      const deletedJob: Omit<DeletedJob, 'id'> = {
        originalJob: job,
        deletedAt: now,
        deletedBy: userId,
        reason,
        archivedApplicationsCount: job.progress.applicationsReceived
      };

      const deletedJobRef = doc(collection(db, this.DELETED_JOBS_COLLECTION));
      batch.set(deletedJobRef, {
        ...deletedJob,
        deletedAt: Timestamp.fromDate(deletedJob.deletedAt)
      });

      // Mark original job as deleted
      const jobRef = doc(db, this.JOBS_COLLECTION, jobId);
      batch.update(jobRef, {
        isDeleted: true,
        deletedAt: Timestamp.fromDate(now),
        status: JobStatus.CANCELLED,
        updatedAt: Timestamp.fromDate(now)
      });

      await batch.commit();

      // Update user stats
      await this.updateUserJobStats(userId, 'delete');
    } catch (error) {
      console.error('Error deleting job:', error);
      throw new Error('Failed to delete job');
    }
  }

  /**
   * Get job statistics for dashboard
   */
  async getJobStats(userId: string): Promise<JobStats> {
    try {
      const { jobs } = await this.getJobs(userId, { limit: 1000 }); // Get all jobs for stats
      
      const stats: JobStats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === JobStatus.ACTIVE).length,
        pausedJobs: jobs.filter(job => job.status === JobStatus.PAUSED).length,
        filledJobs: jobs.filter(job => job.status === JobStatus.FILLED).length,
        expiredJobs: jobs.filter(job => job.status === JobStatus.EXPIRED).length,
        totalApplications: jobs.reduce((sum, job) => sum + job.progress.applicationsReceived, 0),
        averageApplicationsPerJob: 0,
        jobsFilledThisMonth: 0,
        topPerformingDepartments: []
      };

      // Calculate averages
      if (stats.totalJobs > 0) {
        stats.averageApplicationsPerJob = Math.round(stats.totalApplications / stats.totalJobs);
      }

      // Jobs filled this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      stats.jobsFilledThisMonth = jobs.filter(job => 
        job.status === JobStatus.FILLED && 
        job.updatedAt >= thisMonth
      ).length;

      // Top performing departments
      const departmentStats = new Map<Department, { jobCount: number; applicationCount: number }>();
      
      jobs.forEach(job => {
        const existing = departmentStats.get(job.department) || { jobCount: 0, applicationCount: 0 };
        departmentStats.set(job.department, {
          jobCount: existing.jobCount + 1,
          applicationCount: existing.applicationCount + job.progress.applicationsReceived
        });
      });

      stats.topPerformingDepartments = Array.from(departmentStats.entries())
        .map(([department, data]) => ({ department, ...data }))
        .sort((a, b) => b.applicationCount - a.applicationCount)
        .slice(0, 5);

      return stats;
    } catch (error) {
      console.error('Error getting job stats:', error);
      throw new Error('Failed to fetch job statistics');
    }
  }

  /**
   * Get deleted jobs for archive view
   */
  async getDeletedJobs(userId: string): Promise<DeletedJob[]> {
    try {
      const q = query(
        collection(db, this.DELETED_JOBS_COLLECTION),
        where('deletedBy', '==', userId),
        orderBy('deletedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        deletedAt: doc.data().deletedAt.toDate()
      } as DeletedJob));
    } catch (error) {
      console.error('Error getting deleted jobs:', error);
      throw new Error('Failed to fetch deleted jobs');
    }
  }

  /**
   * Helper methods
   */
  private generateSearchTerms(data: { title?: string; description?: string; tags?: string[] }): string[] {
    const terms: string[] = [];
    
    if (data.title) {
      terms.push(...data.title.toLowerCase().split(' '));
    }
    
    if (data.description) {
      terms.push(...data.description.toLowerCase().split(' '));
    }
    
    if (data.tags) {
      terms.push(...data.tags.map(tag => tag.toLowerCase()));
    }

    // Remove duplicates and empty strings
    return [...new Set(terms.filter(term => term.length > 2))];
  }

  private convertFirestoreJob(data: any): Job {
    // Ensure progress has the correct structure for backward compatibility
    const progress = {
      applicationsReceived: data.progress?.applicationsReceived || 0,
      applicationsReviewed: data.progress?.applicationsReviewed || 0,
      interviewsScheduled: data.progress?.interviewsScheduled || 0,
      offersExtended: data.progress?.offersExtended || 0,
      hiredCandidates: data.progress?.hiredCandidates || 0,
      progressPercentage: data.progress?.progressPercentage || 0,
      currentStage: data.progress?.currentStage || HiringStage.RECEIVING_APPLICATIONS,
      stageHistory: data.progress?.stageHistory?.map((transition: any) => ({
        ...transition,
        transitionDate: transition.transitionDate.toDate()
      })) || [{
        fromStage: null,
        toStage: HiringStage.RECEIVING_APPLICATIONS,
        transitionDate: data.createdAt.toDate(),
        performedBy: data.createdBy,
        notes: 'Trabajo creado'
      }]
    };

    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      deadline: data.deadline.toDate(),
      deletedAt: data.deletedAt ? data.deletedAt.toDate() : undefined,
      progress
    } as Job;
  }

  private async updateUserJobStats(userId: string, action: 'create' | 'delete'): Promise<void> {
    try {
      const statsRef = doc(db, this.JOB_STATS_COLLECTION, userId);
      const incrementValue = action === 'create' ? 1 : -1;
      
      await updateDoc(statsRef, {
        totalJobs: increment(incrementValue),
        lastUpdated: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      // Stats update is not critical, just log the error
      console.warn('Failed to update user job stats:', error);
    }
  }

  /**
   * Activate/Deactivate job
   */
  async toggleJobStatus(jobId: string, userId: string): Promise<void> {
    try {
      const job = await this.getJobById(jobId);
      
      if (!job || job.createdBy !== userId) {
        throw new Error('Job not found or unauthorized');
      }

      let newStatus: JobStatus;
      if (job.status === JobStatus.ACTIVE) {
        newStatus = JobStatus.PAUSED;
      } else if (job.status === JobStatus.PAUSED || job.status === JobStatus.DRAFT) {
        newStatus = JobStatus.ACTIVE;
      } else {
        throw new Error('Cannot toggle status for this job');
      }

      await updateDoc(doc(db, this.JOBS_COLLECTION, jobId), {
        status: newStatus,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error toggling job status:', error);
      throw new Error('Failed to toggle job status');
    }
  }

  /**
   * Advance hiring stage
   */
  async advanceHiringStage(jobId: string, newStage: HiringStage, userId: string, notes?: string): Promise<void> {
    try {
      const job = await this.getJobById(jobId);
      
      if (!job || job.createdBy !== userId) {
        throw new Error('Job not found or unauthorized');
      }

      const currentStage = job.progress.currentStage;
      const currentStageInfo = HIRING_STAGES[currentStage];
      const newStageInfo = HIRING_STAGES[newStage];

      // Validate stage progression (can only advance, not go backwards)
      if (newStageInfo.order <= currentStageInfo.order) {
        throw new Error('Cannot move to a previous stage');
      }

      const now = new Date();
      const newTransition: StageTransition = {
        fromStage: currentStage,
        toStage: newStage,
        transitionDate: now,
        performedBy: userId,
        notes
      };

      // Update the job progress
      const updatedProgress = {
        ...job.progress,
        currentStage: newStage,
        stageHistory: [...job.progress.stageHistory, newTransition]
      };

      // Update job status based on stage
      let newStatus = job.status;
      if (newStage === HiringStage.CLOSED) {
        newStatus = JobStatus.FILLED;
      } else if (newStage === HiringStage.RECEIVING_APPLICATIONS) {
        newStatus = JobStatus.ACTIVE;
      }

      await updateDoc(doc(db, this.JOBS_COLLECTION, jobId), {
        progress: updatedProgress,
        status: newStatus,
        updatedAt: Timestamp.fromDate(now)
      });
    } catch (error) {
      console.error('Error advancing hiring stage:', error);
      throw new Error('Failed to advance hiring stage');
    }
  }

  /**
   * Get jobs visible to candidates (only those in receiving applications stage)
   */
  async getPublicJobs(filters: JobFilters = {}): Promise<{ jobs: Job[]; hasMore: boolean }> {
    try {
      let q = query(
        collection(db, this.JOBS_COLLECTION),
        where('isDeleted', '==', false),
        where('status', '==', JobStatus.ACTIVE),
        where('progress.currentStage', '==', HiringStage.RECEIVING_APPLICATIONS)
      );

      // Apply common filters
      if (filters.department && filters.department.length > 0) {
        q = query(q, where('department', 'in', filters.department));
      }

      if (filters.jobType && filters.jobType.length > 0) {
        q = query(q, where('jobType', 'in', filters.jobType));
      }

      // Check deadline hasn't passed
      const now = new Date();
      q = query(q, where('deadline', '>', Timestamp.fromDate(now)));

      // Apply sorting
      const sortField = filters.sortBy || JobSortField.CREATED_AT;
      const sortOrder = filters.sortOrder || 'desc';
      q = query(q, orderBy(sortField, sortOrder));

      // Apply limit
      const pageLimit = filters.limit || 20;
      q = query(q, limit(pageLimit));

      const querySnapshot = await getDocs(q);
      const jobs: Job[] = [];

      querySnapshot.docs.forEach((doc) => {
        jobs.push(this.convertFirestoreJob({ id: doc.id, ...doc.data() } as any));
      });

      return { jobs, hasMore: false }; // Simplified for public view
    } catch (error) {
      console.error('Error getting public jobs:', error);
      throw new Error('Failed to fetch public jobs');
    }
  }
}

export const jobService = new JobService();
