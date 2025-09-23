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
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  
                  <h1 className="text-xl font-semibold text-white">
                    Panel del Contratante
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGoToHome}
                  className="border-white/30 text-black hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-200"
                >
                  Ir a Inicio
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-red-400 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 backdrop-blur-sm transition-all duration-200"
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
