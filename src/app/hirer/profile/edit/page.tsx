'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileEditForm } from '@/modules/profile';
import { useAuth } from '@/modules/auth';
import { Alert } from '@/components/ui';
import { HirerProfile, UserRole } from '@/modules/onboarding/types';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    // Redirect if not logged in or not a hirer
    if (!loading && (!user || !userProfile || userProfile.role !== UserRole.HIRER)) {
      router.push('/auth/login');
    }
  }, [user, userProfile, loading, router]);

  const handleSuccess = (updatedProfile: HirerProfile) => {
    // Navigate back to hirer dashboard
    router.push('/hirer/dashboard');
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

  if (userProfile.role !== UserRole.HIRER) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert type="error" className="mb-6">
            No tienes permisos para acceder a esta página
          </Alert>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Esta página es solo para contratantes.
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => router.push('/hirer/dashboard')}
              className="hover:text-blue-600"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-gray-900">Editar Perfil</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Perfil
          </h1>
          <p className="text-gray-600 mt-2">
            Actualiza la información de tu perfil de contratante
          </p>
        </div>

        <ProfileEditForm
          profile={userProfile as HirerProfile}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}