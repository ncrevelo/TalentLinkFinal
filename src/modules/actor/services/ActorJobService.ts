import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  updateDoc,
  increment,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  Unsubscribe,
  onSnapshot,
  getCountFromServer
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db } from '@/shared/config/firebase';
import {
  Job,
  JobStatus,
  HiringStage
} from '@/modules/jobs/types';
import { ActorProfile } from '@/modules/onboarding/types';
import {
  ActorDashboardMetrics,
  ActorJobFilters,
  ActorMessage,
  ActorMessageType,
  ApplicationStatus,
  JobApplication,
  JobApplicationPayload
} from '../types';

const JOBS_COLLECTION = 'jobs';
const APPLICATIONS_COLLECTION = 'jobApplications';
const MESSAGES_COLLECTION = 'jobMessages';

const DEFAULT_PAGE_SIZE = 10;

const isMissingIndexError = (error: unknown): boolean => {
  return error instanceof FirebaseError && error.code === 'failed-precondition';
};

const toDate = (value: any): Date => {
  if (!value) {
    return new Date();
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value?.toDate) {
    return value.toDate();
  }
  return new Date(value);
};

const mapJobDocument = (docData: any): Job => {
  const progress = docData.progress || {};
  const stageHistory = Array.isArray(progress.stageHistory)
    ? progress.stageHistory.map((item: any, index: number) => ({
        fromStage: item.fromStage ?? null,
        toStage: item.toStage ?? HiringStage.RECEIVING_APPLICATIONS,
        transitionDate: toDate(item.transitionDate),
        performedBy: item.performedBy ?? '',
        notes: item.notes || ''
      }))
    : [];

  return {
    id: docData.id,
    title: docData.title,
    description: docData.description,
    department: docData.department,
    salaryRange: docData.salaryRange,
    jobType: docData.jobType,
    workModality: docData.workModality,
    deadline: toDate(docData.deadline),
    positionsAvailable: docData.positionsAvailable,
    positionsFilled: docData.positionsFilled ?? 0,
    status: docData.status,
    progress: {
      applicationsReceived: progress.applicationsReceived ?? 0,
      applicationsReviewed: progress.applicationsReviewed ?? 0,
      interviewsScheduled: progress.interviewsScheduled ?? 0,
      offersExtended: progress.offersExtended ?? 0,
      hiredCandidates: progress.hiredCandidates ?? 0,
      progressPercentage: progress.progressPercentage ?? 0,
      currentStage: progress.currentStage ?? HiringStage.RECEIVING_APPLICATIONS,
      stageHistory
    },
    requirements: docData.requirements ?? [],
    benefits: docData.benefits ?? [],
    experienceLevel: docData.experienceLevel,
    createdAt: toDate(docData.createdAt),
    updatedAt: toDate(docData.updatedAt),
    createdBy: docData.createdBy,
    isActive: docData.isActive,
    isDeleted: docData.isDeleted ?? false,
    deletedAt: docData.deletedAt ? toDate(docData.deletedAt) : undefined,
    searchTerms: docData.searchTerms ?? [],
    tags: docData.tags ?? []
  } as Job;
};

const mapApplicationDocument = (docSnap: QueryDocumentSnapshot<DocumentData>): JobApplication => {
  const data = docSnap.data();
  const timeline = Array.isArray(data.timeline)
    ? data.timeline.map((entry: any, index: number) => ({
        id: entry.id || `${docSnap.id}-event-${index}`,
        title: entry.title ?? 'Actualización',
        description: entry.description || '',
        createdAt: toDate(entry.createdAt),
        stage: entry.stage ?? HiringStage.RECEIVING_APPLICATIONS
      }))
    : [];

  return {
    id: docSnap.id,
    jobId: data.jobId,
    actorId: data.actorId,
    hirerId: data.hirerId,
    status: data.status,
    currentStage: data.currentStage ?? HiringStage.RECEIVING_APPLICATIONS,
    submittedAt: toDate(data.submittedAt),
    updatedAt: toDate(data.updatedAt),
    coverLetter: data.coverLetter || undefined,
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    portfolioLinks: Array.isArray(data.portfolioLinks) ? data.portfolioLinks : [],
    notes: data.notes || undefined,
    timeline,
    lastMessageAt: data.lastMessageAt ? toDate(data.lastMessageAt) : null,
    unreadMessages: typeof data.unreadMessagesForActor === 'number' ? Math.max(data.unreadMessagesForActor, 0) : 0
  };
};

const mapMessageDocument = (docSnap: QueryDocumentSnapshot<DocumentData>): ActorMessage => {
  const data = docSnap.data();
  const jobSnapshot = data.jobSnapshot || {};

  return {
    id: docSnap.id,
    jobId: data.jobId,
    applicationId: data.applicationId,
    actorId: data.actorId,
    hirerId: data.hirerId,
    senderRole: data.senderRole ?? 'hirer',
    type: data.type ?? ActorMessageType.TEXT,
    body: data.body,
    createdAt: toDate(data.createdAt),
    readAt: data.readAt ? toDate(data.readAt) : null,
    metadata: data.metadata || undefined,
    job: jobSnapshot?.id
      ? {
          id: jobSnapshot.id,
          title: jobSnapshot.title,
          department: jobSnapshot.department,
          workModality: jobSnapshot.workModality,
          deadline: jobSnapshot.deadline ? toDate(jobSnapshot.deadline) : undefined
        }
      : undefined
  };
};

export class ActorJobService {
  async getActiveJobs(
    filters: ActorJobFilters = {},
    lastVisible?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ jobs: Job[]; hasMore: boolean; lastVisible?: QueryDocumentSnapshot<DocumentData> }> {
    try {
      const constraints = [
        where('isDeleted', '==', false),
        where('isActive', '==', true),
        where('status', '==', JobStatus.ACTIVE)
      ];

      if (filters.department) {
        constraints.push(where('department', '==', filters.department));
      }

      if (filters.jobType) {
        constraints.push(where('jobType', '==', filters.jobType));
      }

      if (filters.workModality) {
        constraints.push(where('workModality', '==', filters.workModality));
      }

      if (filters.experienceLevel) {
        constraints.push(where('experienceLevel', '==', filters.experienceLevel));
      }

      if (typeof filters.minSalary === 'number') {
        constraints.push(where('salaryRange.min', '>=', filters.minSalary));
      }

      if (typeof filters.maxSalary === 'number') {
        constraints.push(where('salaryRange.max', '<=', filters.maxSalary));
      }

      if (filters.searchTerm) {
        const tokens = filters.searchTerm
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 10);
        if (tokens.length > 0) {
          constraints.push(where('searchTerms', 'array-contains-any', tokens));
        }
      }

      let orderField: string;
      let orderDirection: 'asc' | 'desc' = 'desc';

      switch (filters.sortBy) {
        case 'deadline':
          orderField = 'deadline';
          orderDirection = 'asc';
          break;
        case 'salary':
          orderField = 'salaryRange.max';
          orderDirection = 'desc';
          break;
        default:
          orderField = 'updatedAt';
          orderDirection = 'desc';
      }

      const pageSize = DEFAULT_PAGE_SIZE;

      const baseQuery = query(
        collection(db, JOBS_COLLECTION),
        ...constraints,
        orderBy(orderField, orderDirection),
        limit(pageSize + 1)
      );

      const paginatedQuery = lastVisible
        ? query(baseQuery, startAfter(lastVisible))
        : baseQuery;

      const snapshot = await getDocs(paginatedQuery);
      const jobs: Job[] = [];
      let newLastVisible: QueryDocumentSnapshot<DocumentData> | undefined;

      snapshot.docs.forEach((docSnap, index) => {
        if (index < pageSize) {
          jobs.push(mapJobDocument({ id: docSnap.id, ...docSnap.data() }));
          newLastVisible = docSnap;
        }
      });

      const hasMore = snapshot.docs.length > pageSize;

      return { jobs, hasMore, lastVisible: newLastVisible };
    } catch (error) {
      if (isMissingIndexError(error)) {
        return this.getActiveJobsFallback(filters);
      }
      console.error('Error fetching active jobs for actors:', error);
      throw new Error('No fue posible cargar las ofertas activas.');
    }
  }

  private async getActiveJobsFallback(
    filters: ActorJobFilters
  ): Promise<{ jobs: Job[]; hasMore: boolean; lastVisible?: QueryDocumentSnapshot<DocumentData> }> {
    try {
      const fallbackSnapshot = await getDocs(
        query(collection(db, JOBS_COLLECTION), where('status', '==', JobStatus.ACTIVE))
      );

      let jobs = fallbackSnapshot.docs.map(docSnap => mapJobDocument({ id: docSnap.id, ...docSnap.data() }));

      jobs = jobs
        .filter(job => job.isActive && !job.isDeleted)
        .filter(job => {
          const salaryRange = job.salaryRange;
          if (filters.department && job.department !== filters.department) {
            return false;
          }
          if (filters.jobType && job.jobType !== filters.jobType) {
            return false;
          }
          if (filters.workModality && job.workModality !== filters.workModality) {
            return false;
          }
          if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) {
            return false;
          }
          if (typeof filters.minSalary === 'number' && salaryRange?.min < filters.minSalary) {
            return false;
          }
          if (typeof filters.maxSalary === 'number' && salaryRange?.max > filters.maxSalary) {
            return false;
          }
          if (filters.searchTerm) {
            const tokens = filters.searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
            const haystack = `${job.title} ${job.description} ${job.tags.join(' ')}`.toLowerCase();
            return tokens.every(token => haystack.includes(token));
          }
          return true;
        });

      const sortBy = filters.sortBy || 'recent';
      jobs.sort((a, b) => {
        switch (sortBy) {
          case 'deadline':
            return (a.deadline?.getTime() ?? 0) - (b.deadline?.getTime() ?? 0);
          case 'salary':
            return (b.salaryRange.max ?? 0) - (a.salaryRange.max ?? 0);
          default:
            return b.updatedAt.getTime() - a.updatedAt.getTime();
        }
      });

      const sliced = jobs.slice(0, DEFAULT_PAGE_SIZE);

      return {
        jobs: sliced,
        hasMore: false,
        lastVisible: undefined
      };
    } catch (fallbackError) {
      console.error('Error fetching active jobs fallback:', fallbackError);
      throw new Error('No fue posible cargar las ofertas activas.');
    }
  }

  async applyToJob(jobId: string, actorProfile: ActorProfile, payload: JobApplicationPayload): Promise<string> {
    try {
      const jobRef = doc(db, JOBS_COLLECTION, jobId);
      const jobSnap = await getDoc(jobRef);

      if (!jobSnap.exists()) {
        throw new Error('La oferta ya no está disponible.');
      }

      const job = mapJobDocument({ id: jobSnap.id, ...jobSnap.data() });

      if (!job.isActive || job.status !== JobStatus.ACTIVE) {
        throw new Error('Esta oferta no acepta más postulaciones.');
      }

      const existingApplication = await getDocs(
        query(
          collection(db, APPLICATIONS_COLLECTION),
          where('jobId', '==', jobId),
          where('actorId', '==', actorProfile.uid),
          limit(1)
        )
      );

      if (!existingApplication.empty) {
        throw new Error('Ya te postulaste a esta oferta.');
      }

      const now = new Date();
      const timeline = [
        {
          id: 'submitted',
          title: 'Postulación enviada',
          description: 'Postulación creada desde TalentLink Actores.',
          createdAt: Timestamp.fromDate(now),
          stage: HiringStage.RECEIVING_APPLICATIONS
        }
      ];

      const applicationRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
        jobId,
        actorId: actorProfile.uid,
        hirerId: job.createdBy,
        status: ApplicationStatus.APPLIED,
        currentStage: job.progress.currentStage ?? HiringStage.RECEIVING_APPLICATIONS,
        submittedAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        coverLetter: payload.coverLetter || null,
        attachments: payload.attachments || [],
        portfolioLinks: payload.portfolioLinks || [],
        notes: null,
        timeline,
        actorSnapshot: {
          uid: actorProfile.uid,
          name: `${actorProfile.actorData.firstName} ${actorProfile.actorData.lastName}`.trim(),
          location: actorProfile.actorData.location,
          experience: actorProfile.actorData.experience,
          availability: actorProfile.actorData.availability
        },
        jobSnapshot: {
          id: job.id,
          title: job.title,
          department: job.department,
          workModality: job.workModality,
          deadline: job.deadline ? Timestamp.fromDate(job.deadline) : null
        },
        unreadMessagesForActor: 0,
        lastMessageAt: null
      });

      await updateDoc(jobRef, {
        'progress.applicationsReceived': increment(1),
        updatedAt: Timestamp.fromDate(now)
      });

      return applicationRef.id;
    } catch (error) {
      console.error('Error applying to job:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('No fue posible completar tu postulación.');
    }
  }

  async getApplications(actorId: string): Promise<JobApplication[]> {
    try {
      const applicationsQuery = query(
        collection(db, APPLICATIONS_COLLECTION),
        where('actorId', '==', actorId),
        orderBy('submittedAt', 'desc')
      );

      const snapshot = await getDocs(applicationsQuery);
      const applications = snapshot.docs.map(mapApplicationDocument);

      const jobIds = Array.from(new Set(applications.map(app => app.jobId)));
      const jobMap = new Map<string, Job>();

      await Promise.all(
        jobIds.map(async jobId => {
          try {
            const jobSnap = await getDoc(doc(db, JOBS_COLLECTION, jobId));
            if (jobSnap.exists()) {
              jobMap.set(jobId, mapJobDocument({ id: jobSnap.id, ...jobSnap.data() }));
            }
          } catch (error) {
            console.warn(`No se pudo cargar la oferta ${jobId}:`, error);
          }
        })
      );

      return applications.map(app => ({
        ...app,
        job: jobMap.get(app.jobId)
      }));
    } catch (error) {
      console.error('Error fetching actor applications:', error);
      throw new Error('No fue posible cargar tus postulaciones.');
    }
  }

  async getDashboardMetrics(actorId: string): Promise<ActorDashboardMetrics> {
    try {
      const [applications, activeJobsCountSnap, unreadMessagesSnap] = await Promise.all([
        this.getApplications(actorId),
        getCountFromServer(
          query(
            collection(db, JOBS_COLLECTION),
            where('isDeleted', '==', false),
            where('isActive', '==', true),
            where('status', '==', JobStatus.ACTIVE)
          )
        ),
        getCountFromServer(
          query(
            collection(db, MESSAGES_COLLECTION),
            where('actorId', '==', actorId),
            where('readAt', '==', null)
          )
        )
      ]);

      const interviewsScheduled = applications.filter(app =>
        app.currentStage === HiringStage.INTERVIEWS ||
        app.status === ApplicationStatus.INTERVIEW
      ).length;

      const offersReceived = applications.filter(app =>
        app.status === ApplicationStatus.OFFER ||
        app.status === ApplicationStatus.HIRED
      ).length;

      const now = new Date();
      const nextDeadlines = applications
        .map(app => app.job?.deadline)
        .filter((deadline): deadline is Date => !!deadline && deadline >= now)
        .sort((a, b) => a.getTime() - b.getTime());

      return {
        totalActiveJobs: Number(activeJobsCountSnap.data().count || 0),
        applicationsSubmitted: applications.length,
        interviewsScheduled,
        offersReceived,
        unreadMessages: Number(unreadMessagesSnap.data().count || 0),
        nextDeadline: nextDeadlines[0] ?? null
      };
    } catch (error) {
      console.error('Error calculating actor dashboard metrics:', error);
      return {
        totalActiveJobs: 0,
        applicationsSubmitted: 0,
        interviewsScheduled: 0,
        offersReceived: 0,
        unreadMessages: 0,
        nextDeadline: null
      };
    }
  }

  subscribeToMessages(
    actorId: string,
    callback: (messages: ActorMessage[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const messagesQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('actorId', '==', actorId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      messagesQuery,
      snapshot => {
        const messages = snapshot.docs.map(mapMessageDocument);
        callback(messages);
      },
      error => {
        console.error('Error listening to actor messages:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    );
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
      const messageSnap = await getDoc(messageRef);

      if (!messageSnap.exists()) {
        return;
      }

      const data = messageSnap.data();
      if (data.readAt) {
        return;
      }

      await updateDoc(messageRef, {
        readAt: serverTimestamp()
      });

      if (data.applicationId) {
        const applicationRef = doc(db, APPLICATIONS_COLLECTION, data.applicationId);
        await updateDoc(applicationRef, {
          unreadMessagesForActor: increment(-1)
        });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  async sendMessageToActor(params: {
    jobId: string;
    applicationId: string;
    actorId: string;
    hirerId: string;
    body: string;
    type?: ActorMessageType;
    senderRole?: 'hirer' | 'system';
    metadata?: Record<string, unknown>;
  }): Promise<string> {
    const { jobId, applicationId, actorId, hirerId, body, metadata, senderRole = 'hirer', type = ActorMessageType.TEXT } = params;

    try {
      const jobSnap = await getDoc(doc(db, JOBS_COLLECTION, jobId));
      if (!jobSnap.exists()) {
        throw new Error('La oferta asociada no existe.');
      }

      const now = new Date();
      const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
        jobId,
        applicationId,
        actorId,
        hirerId,
        body,
        metadata: metadata || {},
        senderRole,
        type,
        createdAt: Timestamp.fromDate(now),
        readAt: null,
        jobSnapshot: {
          id: jobSnap.id,
          title: jobSnap.data().title,
          department: jobSnap.data().department,
          workModality: jobSnap.data().workModality,
          deadline: jobSnap.data().deadline ?? null
        }
      });

      if (applicationId) {
        const applicationRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
        await updateDoc(applicationRef, {
          lastMessageAt: Timestamp.fromDate(now),
          unreadMessagesForActor: increment(1),
          updatedAt: Timestamp.fromDate(now)
        });
      }

      return messageRef.id;
    } catch (error) {
      console.error('Error sending message to actor:', error);
      throw new Error('No fue posible enviar el mensaje al talento.');
    }
  }
}

export const actorJobService = new ActorJobService();
