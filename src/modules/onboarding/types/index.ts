// Tipos para el módulo de onboarding de usuarios

export enum UserRole {
  ACTOR = 'actor',
  HIRER = 'contratante',
  ADMIN = 'administrador'
}

export enum ColombiaDepartment {
  AMAZONAS = 'Amazonas',
  ANTIOQUIA = 'Antioquia',
  ARAUCA = 'Arauca',
  ATLANTICO = 'Atlántico',
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
  NORTE_DE_SANTANDER = 'Norte de Santander',
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

export enum ExperienceLevel {
  BEGINNER = 'principiante',
  INTERMEDIATE = 'intermedio',
  ADVANCED = 'avanzado',
  PROFESSIONAL = 'profesional',
  EXPERT = 'experto'
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
    gender: 'masculino' | 'femenino' | 'otro' | 'prefiero-no-decir';
    nationality: string;
    location: {
      department: string;
      city: string;
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
      department: string;
      country: string;
      postalCode: string;
    };
    
    // Información profesional
    industry: string;
    companySize?: 'individual' | 'pequena' | 'mediana' | 'grande' | 'empresa';
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
  level: 'basico' | 'intermedio' | 'avanzado' | 'nativo';
}

export enum ActorCategory {
  FILM = 'cine',
  TV = 'television',
  THEATER = 'teatro',
  COMMERCIAL = 'comercial',
  VOICE_OVER = 'voz_en_off',
  MODEL = 'modelo',
  DANCER = 'bailarin',
  SINGER = 'cantante',
  EXTRA = 'extra',
  STUNT = 'doble_de_accion'
}

export enum ProjectType {
  SHORT_FILM = 'cortometraje',
  FEATURE_FILM = 'largometraje',
  TV_SERIES = 'serie_tv',
  TV_COMMERCIAL = 'comercial_tv',
  MUSIC_VIDEO = 'video_musical',
  CORPORATE_VIDEO = 'video_corporativo',
  DOCUMENTARY = 'documental',
  THEATER_PLAY = 'obra_teatro',
  PHOTOSHOOT = 'sesion_fotos',
  LIVE_EVENT = 'evento_en_vivo',
  STREAMING_CONTENT = 'contenido_streaming'
}

export enum BudgetRange {
  UNDER_1M = 'menos_1m',
  BETWEEN_1M_5M = '1m_5m',
  BETWEEN_5M_10M = '5m_10m',
  BETWEEN_10M_25M = '10m_25m',
  OVER_25M = 'mas_25m',
  PROJECT_BASED = 'basado_en_proyecto'
}

// Datos del formulario de onboarding
export interface OnboardingFormData {
  uid: string;
  role: UserRole;
  actorData?: ActorProfile['actorData'];
  hirerData?: HirerProfile['hirerData'];
}
