'use client';

import React from 'react';
import { ActorActiveJobsSection } from '@/modules/actor/components';

export default function ActorJobsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Empleos</h1>
        <p className="text-sm text-gray-600">
          Explora las oportunidades abiertas y usa los filtros para encontrar el proyecto ideal.
        </p>
      </div>
      <ActorActiveJobsSection />
    </div>
  );
}
