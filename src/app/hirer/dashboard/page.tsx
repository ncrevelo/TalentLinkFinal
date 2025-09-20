'use client';

import React from 'react';
import { HirerDashboardStats } from '@/modules/jobs';

export default function HirerDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard del Contratante</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus postulaciones de trabajo y revisa el rendimiento de tu reclutamiento.
        </p>
      </div>

      <HirerDashboardStats />
    </div>
  );
}
