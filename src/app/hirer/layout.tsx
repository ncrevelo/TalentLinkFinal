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
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Panel del Contratante
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGoToHome}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Ir a Inicio
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="text-red-600 border-red-300 hover:bg-red-50"
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
