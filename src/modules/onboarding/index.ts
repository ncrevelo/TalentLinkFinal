// Types
export * from './types';

// Services
export { UserProfileService } from './services/UserProfileService';

// Hooks
export { useOnboarding } from './hooks/useOnboarding';

// Components
export { default as OnboardingWizard } from './components/OnboardingWizard';
export { default as RoleSelection } from './components/steps/RoleSelection';
export { default as ActorForm } from './components/steps/ActorForm';
export { default as HirerForm } from './components/steps/HirerForm';
export { default as Confirmation } from './components/steps/Confirmation';
