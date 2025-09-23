'use client';

import React from 'react';
import { HirerDashboardStats } from '@/modules/jobs';
import { useAuth } from '@/modules/auth';
import { Card, CardContent, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function HirerDashboardPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleCreateJob = () => {
    router.push('/hirer/jobs/create');
  };

  const handleManageJobs = () => {
    router.push('/hirer/jobs/manage');
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  // Función para formatear fecha de registro
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para formatear fecha de último acceso
  const formatLastAccess = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompanyName = () => {
    if (userProfile?.hirerData?.companyName) {
      return userProfile.hirerData.companyName;
    }
    return user?.email || 'Usuario';
  };

  const getMemberSince = () => {
    if (userProfile?.createdAt) {
      try {
        // Si es un timestamp de Firebase, convertirlo
        const date = userProfile.createdAt.toDate ? userProfile.createdAt.toDate() : new Date(userProfile.createdAt);
        return formatDate(date);
      } catch (error) {
        console.error('Error parsing createdAt:', error);
        return 'Fecha no disponible';
      }
    }
    return 'Fecha no disponible';
  };

  const getLastAccess = () => {
    if (userProfile?.lastAccess) {
      try {
        // Si es un timestamp de Firebase, convertirlo
        const date = userProfile.lastAccess.toDate ? userProfile.lastAccess.toDate() : new Date(userProfile.lastAccess);
        return formatLastAccess(date);
      } catch (error) {
        console.error('Error parsing lastAccess:', error);
        return 'Fecha no disponible';
      }
    }
    return 'Primera sesión';
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header personalizado */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 space-y-3 sm:space-y-0">
          <div className="flex items-center">
            <span className="text-3xl sm:text-4xl mr-3">🎬</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                ¡Hola, {getCompanyName()}! 🎬
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Dashboard de Contratante
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de perfil */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold mx-auto sm:mx-0">
                  🎬
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {getCompanyName()}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">Contratante</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Miembro desde {getMemberSince()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Último acceso: {getLastAccess()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleCreateJob}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  Crear Trabajo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleManageJobs}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                >
                  Gestionar Trabajos
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Editar Perfil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de bienvenida oculto como solicitado */}
        {/* 
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            ¡Bienvenido, {getCompanyName()}!
          </h3>
          <p className="text-blue-700 text-sm">
            Último acceso: {getLastAccess()}
          </p>
        </div>
        */}
      </div>

      {/* Estadísticas del dashboard */}
      <HirerDashboardStats />
    </div>
  );
}
