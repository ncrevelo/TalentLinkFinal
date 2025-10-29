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
  currentStage: HiringStage;
  stageHistory: StageTransition[];
}

export enum JobStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  FILLED = 'filled',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

// Nuevos enums para el proceso de contratación
export enum HiringStage {
  RECEIVING_APPLICATIONS = 'receiving_applications', // 1. Postulación activa
  REVIEWING_APPLICATIONS = 'reviewing_applications', // 2. Revisión
  INTERVIEWS = 'interviews', // 3. Entrevistas
  BACKGROUND_CHECK = 'background_check', // 4. Revisión antecedentes/finalistas
  HIRING_PROCESS = 'hiring_process', // 5. Contratación
  CLOSED = 'closed' // 6. Cerrado
}

export interface StageTransition {
  fromStage: HiringStage | null;
  toStage: HiringStage;
  transitionDate: Date;
  performedBy: string; // User ID
  notes?: string;
}

export interface HiringStageInfo {
  stage: HiringStage;
  label: string;
  description: string;
  allowsApplications: boolean;
  isVisible: boolean;
  order: number;
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
  currentStage?: HiringStage;
}

// Constantes para las etapas del proceso de contratación
export const HIRING_STAGES: Record<HiringStage, HiringStageInfo> = {
  [HiringStage.RECEIVING_APPLICATIONS]: {
    stage: HiringStage.RECEIVING_APPLICATIONS,
    label: 'Postulación Activa',
    description: 'Se mantiene activo y se reciben usuarios hasta la fecha de cierre o envío de material',
    allowsApplications: true,
    isVisible: true,
    order: 1
  },
  [HiringStage.REVIEWING_APPLICATIONS]: {
    stage: HiringStage.REVIEWING_APPLICATIONS,
    label: 'Revisión',
    description: 'Se dejan de recibir ofertas de actores. El proceso no se muestra para nuevos usuarios',
    allowsApplications: false,
    isVisible: false,
    order: 2
  },
  [HiringStage.INTERVIEWS]: {
    stage: HiringStage.INTERVIEWS,
    label: 'Entrevistas',
    description: 'El hirer escoge los usuarios que van a realizar la entrevista',
    allowsApplications: false,
    isVisible: false,
    order: 3
  },
  [HiringStage.BACKGROUND_CHECK]: {
    stage: HiringStage.BACKGROUND_CHECK,
    label: 'Revisión Antecedentes/Finalistas',
    description: 'Se revisan los datos adicionales del usuario como antecedentes penales y demás',
    allowsApplications: false,
    isVisible: false,
    order: 4
  },
  [HiringStage.HIRING_PROCESS]: {
    stage: HiringStage.HIRING_PROCESS,
    label: 'Contratación',
    description: 'Los usuarios están en proceso de contratación',
    allowsApplications: false,
    isVisible: false,
    order: 5
  },
  [HiringStage.CLOSED]: {
    stage: HiringStage.CLOSED,
    label: 'Cerrado',
    description: 'El proceso deja de estar activo y ya no se muestra para ningún usuario',
    allowsApplications: false,
    isVisible: false,
    order: 6
  }
};

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
