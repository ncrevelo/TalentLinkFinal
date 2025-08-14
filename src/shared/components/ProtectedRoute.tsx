'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo,
  fallback = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verificando acceso...</p>
      </div>
    </div>
  )
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo || ROUTES.AUTH.LOGIN);
      } else if (!requireAuth && user) {
        router.push(redirectTo || ROUTES.DASHBOARD);
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <>{fallback}</>;
  }

  // Si requiere autenticación y no hay usuario
  if (requireAuth && !user) {
    return <>{fallback}</>;
  }

  // Si NO requiere autenticación pero hay usuario
  if (!requireAuth && user) {
    return <>{fallback}</>;
  }

  // Renderizar el contenido protegido
  return <>{children}</>;
};
