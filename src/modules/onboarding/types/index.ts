// Tipos para el módulo de onboarding de usuarios

export enum UserRole {
  ACTOR = 'actor',
  HIRER = 'hirer',
  ADMIN = 'admin'
}

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional',
  EXPERT = 'expert'
}

export interface BaseUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Datos específicos para Actores (Talento)
export interface ActorProfile extends BaseUserProfile {
  role: UserRole.ACTOR;
  actorData: {
    // Información personal
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    nationality: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
    
    // Información física
    height: number; // en cm
    weight: number; // en kg
    eyeColor: string;
    hairColor: string;
    
    // Experiencia y habilidades
    experience: {
      yearsOfExperience: number;
      categories: ActorCategory[];
      languages: Language[];
      specialSkills: string[];
    };
    
    // Portfolio
    portfolio: {
      reel?: string; // URL del reel
      photos: string[]; // URLs de fotos
      resume?: string; // URL del CV
    };
    
    // Disponibilidad
    availability: {
      isAvailable: boolean;
      preferredProjects: ProjectType[];
      workingRadius: number; // km desde su ubicación
      canTravel: boolean;
    };
    
    // Redes sociales y contacto
    socialMedia: {
      instagram?: string;
      tiktok?: string;
      youtube?: string;
      linkedin?: string;
    };
    phone: string;
    
    // Representación
    hasAgent: boolean;
    agentContact?: string;
  };
}

// Datos específicos para Contratantes
export interface HirerProfile extends BaseUserProfile {
  role: UserRole.HIRER;
  hirerData: {
    // Información de la empresa/persona
    companyName?: string;
    isIndividual: boolean;
    firstName: string;
    lastName: string;
    
    // Información de contacto
    phone: string;
    website?: string;
    
    // Ubicación
    location: {
      address: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    
    // Información profesional
    industry: string;
    companySize?: 'individual' | 'small' | 'medium' | 'large' | 'enterprise';
    yearsInBusiness?: number;
    
    // Tipo de proyectos que maneja
    projectTypes: ProjectType[];
    averageBudget: BudgetRange;
    
    // Verificación
    isVerified: boolean;
    taxId?: string; // NIT o equivalente
    
    // Descripción
    description: string;
    
    // Redes sociales
    socialMedia: {
      linkedin?: string;
      website?: string;
      instagram?: string;
    };
  };
}

export type UserProfile = ActorProfile | HirerProfile;

export interface Language {
  code: string; // 'es', 'en', 'fr', etc.
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'native';
}

export enum ActorCategory {
  FILM = 'film',
  TV = 'television',
  THEATER = 'theater',
  COMMERCIAL = 'commercial',
  VOICE_OVER = 'voice_over',
  MODEL = 'model',
  DANCER = 'dancer',
  SINGER = 'singer',
  EXTRA = 'extra',
  STUNT = 'stunt'
}

export enum ProjectType {
  SHORT_FILM = 'short_film',
  FEATURE_FILM = 'feature_film',
  TV_SERIES = 'tv_series',
  TV_COMMERCIAL = 'tv_commercial',
  MUSIC_VIDEO = 'music_video',
  CORPORATE_VIDEO = 'corporate_video',
  DOCUMENTARY = 'documentary',
  THEATER_PLAY = 'theater_play',
  PHOTOSHOOT = 'photoshoot',
  LIVE_EVENT = 'live_event',
  STREAMING_CONTENT = 'streaming_content'
}

export enum BudgetRange {
  UNDER_1M = 'under_1m',
  BETWEEN_1M_5M = '1m_5m',
  BETWEEN_5M_10M = '5m_10m',
  BETWEEN_10M_25M = '10m_25m',
  OVER_25M = 'over_25m',
  PROJECT_BASED = 'project_based'
}

// Datos del formulario de onboarding
export interface OnboardingFormData {
  uid: string;
  role: UserRole;
  actorData?: ActorProfile['actorData'];
  hirerData?: HirerProfile['hirerData'];
}
