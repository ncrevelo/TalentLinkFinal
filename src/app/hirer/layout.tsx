'use client';

import React from 'react';
import { useAuth } from '@/modules/auth';
import { ProtectedRoute } from '@/shared/components';

export default function HirerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header específico para contratantes */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Panel del Contratante
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Bienvenido, {user?.displayName || user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-8">
              <a
                href="/hirer/dashboard"
                className="py-4 px-1 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 font-medium text-sm"
              >
                Dashboard
              </a>
              <a
                href="/hirer/jobs/create"
                className="py-4 px-1 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 font-medium text-sm"
              >
                Crear Trabajo
              </a>
              <a
                href="/hirer/jobs/manage"
                className="py-4 px-1 border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 font-medium text-sm"
              >
                Gestionar Trabajos
              </a>
            </nav>
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
