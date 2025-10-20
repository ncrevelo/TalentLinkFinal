'use client';

import React, { useCallback } from 'react';
import { ActorApplicationsList } from '@/modules/actor/components';
import { useActorApplications } from '@/modules/actor/hooks';
import { ApplicationStatus } from '@/modules/actor/types';

export default function ActorApplicationsPage() {
  const {
    loading,
    error,
    refetch,
    groupedByStatus
  } = useActorApplications();

  const activeApplications = groupedByStatus[ApplicationStatus.APPLIED]
    .concat(groupedByStatus[ApplicationStatus.IN_REVIEW])
    .concat(groupedByStatus[ApplicationStatus.INTERVIEW])
    .concat(groupedByStatus[ApplicationStatus.OFFER]);

  const archiveApplications = groupedByStatus[ApplicationStatus.HIRED]
    .concat(groupedByStatus[ApplicationStatus.REJECTED])
    .concat(groupedByStatus[ApplicationStatus.WITHDRAWN]);

  const handleRetry = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis postulaciones</h1>
        <p className="text-sm text-gray-600">
          Lleva el seguimiento de cada proceso y conoce en qué etapa te encuentras.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Procesos activos</h2>
        <ActorApplicationsList
          applications={activeApplications}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Historial</h2>
        <ActorApplicationsList
          applications={archiveApplications}
          loading={false}
          error={null}
        />
      </section>
    </div>
  );
}
