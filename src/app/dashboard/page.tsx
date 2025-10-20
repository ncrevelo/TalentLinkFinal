'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserProfileService } from '../../modules/onboarding/services/UserProfileService';
import { UserProfile, UserRole } from '../../modules/onboarding/types';
import { Navbar, Layout, PageHeader } from '../../components/layout';
import { DashboardStats } from '../../modules/dashboard/components/DashboardStats';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ClientOnly } from '../../shared/hooks';
import { ROUTES } from '../../shared/constants';

export default function Dashboard() {
  const { user, loading: authLoading, needsOnboarding } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && user && needsOnboarding) {
      router.push('/onboarding');
    }
  }, [user, authLoading, needsOnboarding, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || needsOnboarding) return;
      
      try {
        setProfileLoading(true);
        const userProfile = await UserProfileService.getUserProfile(user.uid);
        setProfile(userProfile);
      } catch (err: any) {
        console.error('Error loading profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    if (user && !authLoading && !needsOnboarding) {
      loadProfile();
    }
  }, [user, authLoading, needsOnboarding]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || needsOnboarding) {
    return null;
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ACTOR:
        return '🎭';
      case UserRole.HIRER:
        return '🎬';
      case UserRole.ADMIN:
        return '⚙️';
      default:
        return '👤';
    }
  };

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case UserRole.ACTOR:
        return 'Actor/Talento';
      case UserRole.HIRER:
        return 'Contratante';
      case UserRole.ADMIN:
        return 'Administrador';
      default:
        return 'Usuario';
    }
  };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Layout>
          {profile && (
            <>
              <PageHeader
                title={`¡Hola, ${profile.displayName || 'Usuario'}! ${getRoleIcon(profile.role)}`}
                subtitle={`Dashboard de ${getRoleTitle(profile.role)}`}
              />
              
              {/* Profile Summary Card */}
              <Card className="mb-6 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{getRoleIcon(profile.role)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profile.displayName || 'Usuario'}
                      </h3>
                      <p className="text-gray-600">{getRoleTitle(profile.role)}</p>
                      <p className="text-sm text-gray-500">
                        Miembro desde {profile.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      Editar Perfil
                    </Button>
                    {profile.role === UserRole.HIRER && (
                      <Button size="sm">
                        Publicar Oferta
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Quick Actions for Actors */}
              {profile.role === UserRole.ACTOR && (
                <Card className="mb-6 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Acciones Rápidas para Actores
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => router.push(ROUTES.ACTOR.JOBS)}
                    >
                      📋 Ver Ofertas de Trabajo
                    </Button>
                    <Button variant="outline" className="justify-start">
                      📸 Actualizar Portafolio
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => router.push(ROUTES.ACTOR.APPLICATIONS)}
                    >
                      📅 Gestionar Disponibilidad
                    </Button>
                  </div>
                </Card>
              )}

              {/* Quick Actions for Hirers */}
              {profile.role === UserRole.HIRER && (
                <Card className="mb-6 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Acciones Rápidas para Contratantes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      className="justify-start"
                      onClick={() => router.push(ROUTES.HIRER.JOBS.CREATE)}
                    >
                      ➕ Publicar Nueva Oferta
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => router.push(ROUTES.HIRER.JOBS.MANAGE)}
                    >
                      � Gestionar Ofertas
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => router.push(ROUTES.HIRER.DASHBOARD)}
                    >
                      � Dashboard Completo
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}
          
          <DashboardStats />
        </Layout>
      </div>
    </ClientOnly>
  );
}
