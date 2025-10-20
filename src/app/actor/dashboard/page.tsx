'use client';

import React, { useCallback } from 'react';
import { ActorActiveJobsSection, ActorApplicationsList, ActorDashboardHeader, ActorMessageCenter } from '@/modules/actor/components';
import { useActorApplications, useActorDashboardMetrics } from '@/modules/actor/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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
    refetch: refetchApplications,
    upcomingInterviews
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

      {upcomingInterviews.length > 0 && (
        <Card className="bg-white shadow-sm border-l-4 border-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 text-lg">Próximos hitos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            {upcomingInterviews.slice(0, 3).map(application => (
              <div key={application.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{application.job?.title ?? 'Oferta no disponible'}</p>
                  <p className="text-xs text-gray-500">Actualizado el {application.updatedAt.toLocaleDateString()}</p>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                  Entrevista
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <ActorActiveJobsSection />

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
