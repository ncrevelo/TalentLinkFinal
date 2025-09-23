'use client';

import React from 'react';
import { useAuth } from '@/modules/auth';
import { ProtectedRoute } from '@/shared/components';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

export default function HirerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleGoToHome = () => {
    router.push('/');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header específico para contratantes */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-auto sm:h-16 py-3 sm:py-0 space-y-3 sm:space-y-0">
              <div className="flex items-center justify-center sm:justify-start">
                <div className="flex items-center space-x-3">
                  <h1 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">
                    Panel del Contratante
                  </h1>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGoToHome}
                  className="border-white/30 text-black hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-200 w-full sm:w-auto"
                >
                  Ir a Inicio
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-red-400 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 backdrop-blur-sm transition-all duration-200 w-full sm:w-auto"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
