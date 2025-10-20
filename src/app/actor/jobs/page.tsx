'use client';

import React from 'react';
import { ActorActiveJobsSection } from '@/modules/actor/components';

export default function ActorJobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Oportunidades disponibles</h1>
        <p className="text-sm text-gray-600">Explora los proyectos activos que están buscando talento como tú.</p>
      </div>
      <ActorActiveJobsSection />
    </div>
  );
}
