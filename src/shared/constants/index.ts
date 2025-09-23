// Constantes globales de la aplicación

export const APP_CONFIG = {
  name: 'TalentLink',
  version: '1.0.0',
  description: 'Sistema de gestión de talento humano'
} as const;

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password'
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  TALENT: {
    LIST: '/talent',
    CREATE: '/talent/create',
    EDIT: '/talent/edit',
    VIEW: '/talent/view'
  },
  HIRER: {
    DASHBOARD: '/hirer/dashboard',
    JOBS: {
      CREATE: '/hirer/jobs/create',
      MANAGE: '/hirer/jobs/manage',
      EDIT: '/hirer/jobs/edit',
      VIEW: '/hirer/jobs/view'
    }
  },
  ADMIN: {
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
    REPORTS: '/admin/reports'
  }
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  CANDIDATE: 'candidate'
} as const;

export const PERMISSIONS = {
  TALENT: {
    CREATE: 'talent:create',
    READ: 'talent:read',
    UPDATE: 'talent:update',
    DELETE: 'talent:delete'
  },
  USER: {
    CREATE: 'user:create',
    READ: 'user:read',
    UPDATE: 'user:update',
    DELETE: 'user:delete'
  },
  ADMIN: {
    ACCESS: 'admin:access',
    SETTINGS: 'admin:settings',
    REPORTS: 'admin:reports'
  }
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh'
  },
  USERS: '/api/users',
  TALENT: '/api/talent',
  PROFILES: '/api/profiles'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]{10,}$/
} as const;
