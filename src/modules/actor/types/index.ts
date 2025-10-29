import { Job, HiringStage, Department, JobType, WorkModality, ExperienceLevel } from '@/modules/jobs/types';
import type { ActorProfile } from '@/modules/onboarding/types';

export enum ApplicationStatus {
  APPLIED = 'applied',
  IN_REVIEW = 'in_review',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export interface ApplicationTimelineEvent {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  stage: HiringStage;
}

export interface ApplicationActorSnapshot {
  uid: string;
  name?: string;
  location?: ActorProfile['actorData']['location'];
  experience?: ActorProfile['actorData']['experience'];
  availability?: ActorProfile['actorData']['availability'];
}

export interface ApplicationJobSnapshot {
  id: Job['id'];
  title: Job['title'];
  department: Job['department'];
  workModality: Job['workModality'];
  deadline?: Date | null;
}

export interface ActorJobFilters {
  searchTerm?: string;
  department?: Department;
  jobType?: JobType;
  workModality?: WorkModality;
  experienceLevel?: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  sortBy?: 'recent' | 'deadline' | 'salary';
}

export interface JobApplicationPayload {
  coverLetter?: string;
  attachments?: string[];
  portfolioLinks?: string[];
}

export interface JobApplication {
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
  notes?: string;
  job?: Job;
  timeline: ApplicationTimelineEvent[];
  actorSnapshot?: ApplicationActorSnapshot | null;
  jobSnapshot?: ApplicationJobSnapshot | null;
  rejectionReason?: string | null;
  rejectionDate?: Date | null;
  lastMessageAt?: Date | null;
  unreadMessages?: number;
}

export enum ActorMessageType {
  TEXT = 'text',
  INVITATION = 'invitation',
  UPDATE = 'update'
}

export interface ActorMessage {
  id: string;
  jobId: string;
  applicationId: string;
  actorId: string;
  hirerId: string;
  senderRole: 'hirer' | 'system';
  type: ActorMessageType;
  body: string;
  createdAt: Date;
  readAt?: Date | null;
  metadata?: Record<string, unknown>;
  job?: {
    id: Job['id'];
    title: Job['title'];
    department: Job['department'];
    workModality: Job['workModality'];
    deadline?: Job['deadline'];
  };
}

export interface ActorDashboardMetrics {
  totalActiveJobs: number;
  applicationsSubmitted: number;
  interviewsScheduled: number;
  offersReceived: number;
  unreadMessages: number;
  nextDeadline?: Date | null;
}
