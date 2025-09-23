'use client';

import React from 'react';
import { HirerDashboardStats } from '@/modules/jobs';
import { useAuth } from '@/modules/auth';
import { Card, CardContent, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function HirerDashboardPage() {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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
      return formatDate(userProfile.createdAt);
    }
    return formatDate(new Date());
  };

  const getLastAccess = () => {
    if (userProfile?.lastAccess) {
      return formatLastAccess(userProfile.lastAccess);
    }
    return formatLastAccess(new Date());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header personalizado */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-4xl mr-3">🎬</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola, {getCompanyName()}! 🎬
              </h1>
              <p className="text-gray-600 mt-1">
                Dashboard de Contratante
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSignOut}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Cerrar Sesión
          </Button>
        </div>

        {/* Tarjeta de perfil */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  🎬
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {getCompanyName()}
                  </h2>
                  <p className="text-gray-600">Contratante</p>
                  <p className="text-sm text-gray-500">
                    Miembro desde {getMemberSince()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleCreateJob}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Crear Trabajo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleManageJobs}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Gestionar Trabajos
                </Button>
                <Button variant="secondary" size="sm">
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
