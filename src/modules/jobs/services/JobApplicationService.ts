import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
  runTransaction,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import {
  ApplicationStatus,
  type ApplicationTimelineEvent,
  type ApplicationActorSnapshot,
  type ApplicationJobSnapshot
} from '@/modules/actor/types';
import { HiringStage, JobStatus } from '../types';

export interface HirerJobApplication {
  id: string;
  jobId: string;
  actorId: string;
  hirerId: string;
  status: ApplicationStatus;
  currentStage: HiringStage;
  submittedAt: Date;
  updatedAt: Date;
  coverLetter?: string;
  attachments: string[];
  portfolioLinks: string[];
  notes?: string | null;
  timeline: ApplicationTimelineEvent[];
  actorSnapshot: ApplicationActorSnapshot | null;
  jobSnapshot: ApplicationJobSnapshot | null;
  rejectionReason?: string | null;
  rejectionDate?: Date | null;
  lastMessageAt?: Date | null;
  unreadMessagesForActor?: number;
}

const APPLICATIONS_COLLECTION = 'jobApplications';
const JOBS_COLLECTION = 'jobs';

const statusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: 'Enviada',
  [ApplicationStatus.IN_REVIEW]: 'En revisión',
  [ApplicationStatus.INTERVIEW]: 'Entrevista',
  [ApplicationStatus.OFFER]: 'Oferta',
  [ApplicationStatus.HIRED]: 'Contratado',
  [ApplicationStatus.REJECTED]: 'Rechazada',
  [ApplicationStatus.WITHDRAWN]: 'Retirada'
};

const statusOrder: Record<ApplicationStatus, number> = {
  [ApplicationStatus.APPLIED]: 0,
  [ApplicationStatus.IN_REVIEW]: 1,
  [ApplicationStatus.INTERVIEW]: 2,
  [ApplicationStatus.OFFER]: 3,
  [ApplicationStatus.HIRED]: 4,
  [ApplicationStatus.REJECTED]: 1,
  [ApplicationStatus.WITHDRAWN]: 0
};

const progressThresholds: Record<'applicationsReviewed' | 'interviewsScheduled' | 'offersExtended' | 'hiredCandidates', number> = {
  applicationsReviewed: 1,
  interviewsScheduled: 2,
  offersExtended: 3,
  hiredCandidates: 4
};

const toDate = (value: any): Date => {
  if (!value) {
    return new Date();
  }
  if (value instanceof Date) {
    return value;
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value?.toDate) {
    return value.toDate();
  }
  return new Date(value);
};

const toTimestamp = (value: any): Timestamp => {
  if (!value) {
    return Timestamp.fromDate(new Date());
  }
  if (value instanceof Timestamp) {
    return value;
  }
  if (value instanceof Date) {
    return Timestamp.fromDate(value);
  }
  if (value?.toDate) {
    return Timestamp.fromDate(value.toDate());
  }
  return Timestamp.fromDate(new Date(value));
};

const normalizeTimeline = (timeline: any[] | undefined, fallbackStage: HiringStage): Array<Omit<ApplicationTimelineEvent, 'createdAt'> & { createdAt: Timestamp }> => {
  if (!Array.isArray(timeline)) {
    return [];
  }
  return timeline.map((entry, index) => ({
    id: entry?.id || `event-${index}`,
    title: entry?.title || 'Actualización',
    description: entry?.description || '',
    createdAt: toTimestamp(entry?.createdAt),
    stage: entry?.stage ?? fallbackStage
  }));
};

class JobApplicationService {
  private mapApplication(data: DocumentData, id: string): HirerJobApplication {
    const currentStage: HiringStage = data.currentStage ?? HiringStage.RECEIVING_APPLICATIONS;
    const timeline = normalizeTimeline(data.timeline, currentStage).map((entry) => ({
      ...entry,
      createdAt: entry.createdAt.toDate()
    }));

    return {
      id,
      jobId: data.jobId,
      actorId: data.actorId,
      hirerId: data.hirerId,
      status: data.status,
      currentStage,
      submittedAt: toDate(data.submittedAt),
      updatedAt: toDate(data.updatedAt),
      coverLetter: data.coverLetter || undefined,
      attachments: Array.isArray(data.attachments) ? data.attachments : [],
      portfolioLinks: Array.isArray(data.portfolioLinks) ? data.portfolioLinks : [],
      notes: data.notes ?? null,
      timeline,
      actorSnapshot: data.actorSnapshot
        ? {
            uid: data.actorSnapshot.uid,
            name: data.actorSnapshot.name || undefined,
            location: data.actorSnapshot.location || undefined,
            experience: data.actorSnapshot.experience || undefined,
            availability: data.actorSnapshot.availability || undefined
          }
        : null,
      jobSnapshot: data.jobSnapshot
        ? {
            id: data.jobSnapshot.id,
            title: data.jobSnapshot.title,
            department: data.jobSnapshot.department,
            workModality: data.jobSnapshot.workModality,
            deadline: data.jobSnapshot.deadline ? toDate(data.jobSnapshot.deadline) : null
          }
        : null,
      rejectionReason: data.rejectionReason || null,
      rejectionDate: data.rejectionDate ? toDate(data.rejectionDate) : null,
      lastMessageAt: data.lastMessageAt ? toDate(data.lastMessageAt) : null,
      unreadMessagesForActor: typeof data.unreadMessagesForActor === 'number' ? Math.max(data.unreadMessagesForActor, 0) : 0
    };
  }

  private mapApplicationDocument(docSnap: QueryDocumentSnapshot<DocumentData>): HirerJobApplication {
    return this.mapApplication(docSnap.data(), docSnap.id);
  }

  async getJobApplications(jobId: string): Promise<HirerJobApplication[]> {
    const applicationsQuery = query(
      collection(db, APPLICATIONS_COLLECTION),
      where('jobId', '==', jobId),
      orderBy('submittedAt', 'desc')
    );

    const snapshot = await getDocs(applicationsQuery);
    return snapshot.docs.map((doc) => this.mapApplicationDocument(doc));
  }

  async getApplication(applicationId: string): Promise<HirerJobApplication | null> {
    const applicationRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    const snap = await getDoc(applicationRef);
    if (!snap.exists()) {
      return null;
    }
    return this.mapApplication(snap.data() as DocumentData, snap.id);
  }

  async updateApplicationStatus(params: {
    jobId: string;
    applicationId: string;
    newStatus: ApplicationStatus;
    notes?: string;
    stage?: HiringStage;
    rejectionReason?: string;
  }): Promise<HirerJobApplication> {
    const { jobId, applicationId, newStatus, notes, stage, rejectionReason } = params;

    await runTransaction(db, async (transaction) => {
      const applicationRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
      const jobRef = doc(db, JOBS_COLLECTION, jobId);

      const applicationSnap = await transaction.get(applicationRef);
      if (!applicationSnap.exists()) {
        throw new Error('Postulación no encontrada.');
      }

      const jobSnap = await transaction.get(jobRef);
      if (!jobSnap.exists()) {
        throw new Error('Oferta no encontrada.');
      }

      const applicationData = applicationSnap.data();
      const jobData = jobSnap.data();
      const previousStatus: ApplicationStatus = applicationData.status;
      const now = new Date();

      const currentStage: HiringStage = stage ?? applicationData.currentStage ?? jobData.progress?.currentStage ?? HiringStage.RECEIVING_APPLICATIONS;
      const timeline = normalizeTimeline(applicationData.timeline, currentStage);

      const timelineEntry = {
        id: `${applicationId}-status-${now.getTime()}`,
        title: `Estado actualizado: ${statusLabels[newStatus]}`,
        description: newStatus === ApplicationStatus.REJECTED
          ? rejectionReason || notes || 'Postulación rechazada'
          : notes || '',
        createdAt: Timestamp.fromDate(now),
        stage: currentStage
      };

      timeline.push(timelineEntry);

      const nextData: Record<string, unknown> = {
        status: newStatus,
        currentStage,
        updatedAt: Timestamp.fromDate(now),
        timeline,
      };

      if (typeof notes === 'string') {
        nextData.notes = notes.trim() === '' ? null : notes;
      }

      if (newStatus === ApplicationStatus.REJECTED) {
        nextData.rejectionReason = (rejectionReason || notes || '').trim() || null;
        nextData.rejectionDate = Timestamp.fromDate(now);
      } else {
        nextData.rejectionReason = null;
        nextData.rejectionDate = null;
      }

      transaction.update(applicationRef, nextData);

      const progress = {
        applicationsReceived: Number(jobData.progress?.applicationsReceived ?? 0),
        applicationsReviewed: Number(jobData.progress?.applicationsReviewed ?? 0),
        interviewsScheduled: Number(jobData.progress?.interviewsScheduled ?? 0),
        offersExtended: Number(jobData.progress?.offersExtended ?? 0),
        hiredCandidates: Number(jobData.progress?.hiredCandidates ?? 0),
        progressPercentage: Number(jobData.progress?.progressPercentage ?? 0),
        currentStage: jobData.progress?.currentStage ?? HiringStage.RECEIVING_APPLICATIONS,
        stageHistory: Array.isArray(jobData.progress?.stageHistory) ? jobData.progress.stageHistory : []
      };

      const prevOrder = statusOrder[previousStatus] ?? 0;
      const newOrder = statusOrder[newStatus] ?? 0;

      (Object.entries(progressThresholds) as Array<[keyof typeof progressThresholds, number]>).forEach(([field, threshold]) => {
        const alreadyReached = prevOrder >= threshold;
        const reachesNow = newOrder >= threshold;
        if (alreadyReached === reachesNow) {
          return;
        }
        const key = field as keyof typeof progress;
        const currentValue = typeof progress[key] === 'number' ? (progress[key] as number) : 0;
        progress[key] = Math.max(0, currentValue + (reachesNow ? 1 : -1));
      });

      const totalApplications = progress.applicationsReceived || 0;
      const processed =
        (progress.applicationsReviewed || 0) +
        (progress.interviewsScheduled || 0) +
        (progress.offersExtended || 0) +
        (progress.hiredCandidates || 0);

      progress.progressPercentage = totalApplications > 0
        ? Math.min(100, Math.max(0, Math.round((processed / totalApplications) * 100)))
        : 0;

      if (typeof jobData.positionsAvailable === 'number') {
        progress.hiredCandidates = Math.min(progress.hiredCandidates || 0, jobData.positionsAvailable);
      } else {
        progress.hiredCandidates = progress.hiredCandidates || 0;
      }

      const jobUpdate: Record<string, unknown> = {
        progress,
        positionsFilled: progress.hiredCandidates ?? 0,
        updatedAt: Timestamp.fromDate(now)
      };

      if (typeof jobData.positionsAvailable === 'number' && progress.hiredCandidates >= jobData.positionsAvailable) {
        jobUpdate.status = JobStatus.FILLED;
      } else if (jobData.status === JobStatus.FILLED && typeof jobData.positionsAvailable === 'number' && progress.hiredCandidates < jobData.positionsAvailable) {
        jobUpdate.status = JobStatus.ACTIVE;
      }

      transaction.update(jobRef, jobUpdate);
    });

    const refreshed = await this.getApplication(applicationId);
    if (!refreshed) {
      throw new Error('No fue posible refrescar la postulación actualizada.');
    }
    return refreshed;
  }

  async rejectApplication(params: {
    jobId: string;
    applicationId: string;
    reason: string;
    notes?: string;
    stage?: HiringStage;
  }): Promise<HirerJobApplication> {
    const { jobId, applicationId, reason, notes, stage } = params;
    return this.updateApplicationStatus({
      jobId,
      applicationId,
      newStatus: ApplicationStatus.REJECTED,
      rejectionReason: reason,
      notes,
      stage
    });
  }
}

export const jobApplicationService = new JobApplicationService();
