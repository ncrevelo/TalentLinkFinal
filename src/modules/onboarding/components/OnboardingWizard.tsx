'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../auth/hooks/useAuth';
import { useOnboarding } from '../hooks/useOnboarding';
import { UserRole, OnboardingFormData } from '../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Alert } from '../../../components/ui/Alert';

// Step Components
import RoleSelection from './steps/RoleSelection';
import ActorForm from './steps/ActorForm';
import HirerForm from './steps/HirerForm';
import Confirmation from './steps/Confirmation';

const OnboardingWizard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { 
    loading, 
    error, 
    currentStep, 
    selectedRole, 
    setSelectedRole,
    nextStep,
    previousStep,
    submitOnboarding,
    clearError
  } = useOnboarding();

  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    nextStep();
  };

  const handleFormSubmit = async (data: any) => {
    if (!selectedRole || !user.uid) return;

    const onboardingData: OnboardingFormData = {
      uid: user.uid,
      role: selectedRole,
      ...(selectedRole === UserRole.ACTOR ? { actorData: data } : { hirerData: data })
    };

    try {
      await submitOnboarding(onboardingData);
      nextStep(); // Ir a confirmación
    } catch (error) {
      // El error se maneja en el hook
    }
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleSelection 
            onRoleSelect={handleRoleSelect}
            selectedRole={selectedRole}
          />
        );
      case 2:
        if (selectedRole === UserRole.ACTOR) {
          return (
            <ActorForm 
              onSubmit={handleFormSubmit}
              onBack={previousStep}
              loading={loading}
            />
          );
        } else if (selectedRole === UserRole.HIRER) {
          return (
            <HirerForm 
              onSubmit={handleFormSubmit}
              onBack={previousStep}
              loading={loading}
            />
          );
        }
        return null;
      case 3:
        return (
          <Confirmation 
            role={selectedRole}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a TalentLink!
          </h1>
          <p className="text-gray-600">
            Completa tu perfil para empezar a conectar talentos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div 
                    className={`
                      w-20 h-1 ml-4
                      ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-16">
            <span className={`text-sm ${currentStep >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              Seleccionar Rol
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              Completar Perfil
            </span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              Confirmación
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <Alert 
              type="error" 
              message={error}
              onClose={clearError}
            />
          </div>
        )}

        {/* Main Content */}
        <Card className="p-8">
          {renderStep()}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          ¿Necesitas ayuda? <a href="#" className="text-blue-600 hover:underline">Contacta soporte</a>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
