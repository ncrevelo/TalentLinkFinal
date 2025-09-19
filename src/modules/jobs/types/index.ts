// Job Types and Interfaces
export interface Job {
  id: string;
  title: string;
  description: string;
  department: Department;
  salaryRange: SalaryRange;
  jobType: JobType;
  workModality: WorkModality;
  deadline: Date;
  positionsAvailable: number;
  positionsFilled: number;
  status: JobStatus;
  progress: JobProgress;
  requirements: string[];
  benefits: string[];
  experienceLevel: ExperienceLevel;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  
  // Search optimization fields
  searchTerms: string[];
  tags: string[];
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: 'COP' | 'USD';
  negotiable: boolean;
}

export interface JobProgress {
  applicationsReceived: number;
  applicationsReviewed: number;
  interviewsScheduled: number;
  offersExtended: number;
  hiredCandidates: number;
  progressPercentage: number; // 0-100
}

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  FILLED = 'filled',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  TEMPORARY = 'temporary'
}

export enum WorkModality {
  REMOTE = 'remote',
  ON_SITE = 'on_site',
  HYBRID = 'hybrid'
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive'
}

export enum Department {
  ANTIOQUIA = 'Antioquia',
  ATLANTICO = 'Atlántico',
  BOGOTA = 'Bogotá D.C.',
  BOLIVAR = 'Bolívar',
  BOYACA = 'Boyacá',
  CALDAS = 'Caldas',
  CAQUETA = 'Caquetá',
  CASANARE = 'Casanare',
  CAUCA = 'Cauca',
  CESAR = 'Cesar',
  CHOCO = 'Chocó',
  CORDOBA = 'Córdoba',
  CUNDINAMARCA = 'Cundinamarca',
  GUAINIA = 'Guainía',
  GUAVIARE = 'Guaviare',
  HUILA = 'Huila',
  LA_GUAJIRA = 'La Guajira',
  MAGDALENA = 'Magdalena',
  META = 'Meta',
  NARINO = 'Nariño',
  NORTE_SANTANDER = 'Norte de Santander',
  PUTUMAYO = 'Putumayo',
  QUINDIO = 'Quindío',
  RISARALDA = 'Risaralda',
  SAN_ANDRES = 'San Andrés y Providencia',
  SANTANDER = 'Santander',
  SUCRE = 'Sucre',
  TOLIMA = 'Tolima',
  VALLE_DEL_CAUCA = 'Valle del Cauca',
  VAUPES = 'Vaupés',
  VICHADA = 'Vichada'
}

export interface JobFilters {
  status?: JobStatus[];
  department?: Department[];
  jobType?: JobType[];
  workModality?: WorkModality[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  createdAfter?: Date;
  createdBefore?: Date;
  searchQuery?: string;
  tags?: string[];
  sortBy?: JobSortField;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export enum JobSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DEADLINE = 'deadline',
  TITLE = 'title',
  SALARY_MIN = 'salaryRange.min',
  APPLICATIONS_COUNT = 'progress.applicationsReceived'
}

export interface JobCreateRequest {
  title: string;
  description: string;
  department: Department;
  salaryRange: SalaryRange;
  jobType: JobType;
  workModality: WorkModality;
  deadline: Date;
  positionsAvailable: number;
  requirements: string[];
  benefits: string[];
  experienceLevel: ExperienceLevel;
  tags?: string[];
}

export interface JobUpdateRequest extends Partial<JobCreateRequest> {
  status?: JobStatus;
  progress?: Partial<JobProgress>;
}

export interface DeletedJob {
  id: string;
  originalJob: Job;
  deletedAt: Date;
  deletedBy: string;
  reason?: string;
  archivedApplicationsCount: number;
}

// Dashboard Statistics
export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  pausedJobs: number;
  filledJobs: number;
  expiredJobs: number;
  totalApplications: number;
  averageApplicationsPerJob: number;
  jobsFilledThisMonth: number;
  topPerformingDepartments: Array<{
    department: Department;
    jobCount: number;
    applicationCount: number;
  }>;
}

// Form validation schemas
export interface JobValidationErrors {
  title?: string;
  description?: string;
  department?: string;
  salaryRange?: {
    min?: string;
    max?: string;
  };
  jobType?: string;
  workModality?: string;
  deadline?: string;
  positionsAvailable?: string;
  requirements?: string;
  benefits?: string;
  experienceLevel?: string;
}
