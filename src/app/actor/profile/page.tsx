'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui';
import { ActorProfileEditForm } from '@/modules/profile';
import { useAuth } from '@/modules/auth';
import { ActorProfile, UserRole } from '@/modules/onboarding/types';

export default function ActorProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !userProfile || userProfile.role !== UserRole.ACTOR)) {
      router.push('/auth/login');
    }
  }, [loading, user, userProfile, router]);

  const handleSuccess = () => {
    router.push('/actor/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert type="error" className="mb-6">
            No se pudo cargar la información del usuario
          </Alert>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Por favor, inicia sesión para acceder a esta página.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userProfile.role !== UserRole.ACTOR) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert type="error" className="mb-6">
            No tienes permisos para acceder a esta página
          </Alert>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Esta página está disponible únicamente para perfiles de actor.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Ir al dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const actorProfile = userProfile as ActorProfile;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => router.push('/actor/dashboard')}
              className="hover:text-blue-600"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-gray-900">Editar perfil</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
          <p className="text-gray-600 mt-2">
            Mantén tu información actualizada para que los casting managers te encuentren más fácil.
          </p>
        </div>

        <ActorProfileEditForm
          profile={actorProfile}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
