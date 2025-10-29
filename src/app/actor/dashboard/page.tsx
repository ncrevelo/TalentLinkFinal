'use client';

import React, { useCallback } from 'react';
import { ActorApplicationsList, ActorDashboardHeader, ActorMessageCenter } from '@/modules/actor/components';
import { useActorApplications, useActorDashboardMetrics } from '@/modules/actor/hooks';
import { Card, CardContent } from '@/components/ui/Card';

export default function ActorDashboardPage() {
  const {
    metrics,
    loading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics
  } = useActorDashboardMetrics();

  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
    refetch: refetchApplications
  } = useActorApplications();

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchMetrics(), refetchApplications()]);
  }, [refetchMetrics, refetchApplications]);

  return (
    <div className="space-y-10">
      <ActorDashboardHeader
        metrics={metrics}
        loading={metricsLoading}
        onRefresh={handleRefresh}
      />

      {metricsError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-sm text-red-600">
            {metricsError}
          </CardContent>
        </Card>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Mis progresos</h2>
          <p className="text-sm text-gray-500">Revisa el estado y las novedades de tus postulaciones.</p>
        </div>
        <ActorApplicationsList
          applications={applications}
          loading={applicationsLoading}
          error={applicationsError}
          onRetry={refetchApplications}
        />
      </section>

      <ActorMessageCenter />
    </div>
  );
}
