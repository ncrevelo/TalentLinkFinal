import { useState, useCallback } from 'react';
import { UserRole, OnboardingFormData } from '../types';
import { UserProfileService } from '../services/UserProfileService';

interface UseOnboardingReturn {
  loading: boolean;
  error: string | null;
  currentStep: number;
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole) => void;
  nextStep: () => void;
  previousStep: () => void;
  submitOnboarding: (formData: OnboardingFormData) => Promise<void>;
  clearError: () => void;
}

const TOTAL_STEPS = 3; // 1: Rol, 2: Datos, 3: Confirmación

export const useOnboarding = (): UseOnboardingReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const nextStep = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const submitOnboarding = useCallback(async (formData: OnboardingFormData) => {
    if (!selectedRole) {
      setError('Debe seleccionar un rol');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (selectedRole === UserRole.ACTOR) {
        if (!formData.actorData) {
          throw new Error('Datos de actor requeridos');
        }
        await UserProfileService.completeActorOnboarding(formData.uid, formData.actorData);
      } else if (selectedRole === UserRole.HIRER) {
        if (!formData.hirerData) {
          throw new Error('Datos de contratante requeridos');
        }
        await UserProfileService.completeHirerOnboarding(formData.uid, formData.hirerData);
      }

      // El onboarding se completó exitosamente
      // El AuthProvider detectará automáticamente el cambio
    } catch (err: any) {
      setError(err.message || 'Error al completar el onboarding');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  return {
    loading,
    error,
    currentStep,
    selectedRole,
    setSelectedRole,
    nextStep,
    previousStep,
    submitOnboarding,
    clearError
  };
};
