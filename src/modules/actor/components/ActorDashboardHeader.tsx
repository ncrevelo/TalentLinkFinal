'use client';

import React from 'react';
import { ActorDashboardMetrics } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';

interface ActorDashboardHeaderProps {
  metrics: ActorDashboardMetrics;
  loading?: boolean;
  onRefresh?: () => void;
}

const MetricCard: React.FC<{ label: string; value: number | string; helper?: string; accent?: string }> = ({
  label,
  value,
  helper,
  accent = 'text-indigo-600'
}) => (
  <Card className="border-none shadow-sm bg-gradient-to-br from-white to-indigo-50">
    <CardHeader className="mb-2">
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-semibold ${accent}`}>{value}</div>
      {helper && <p className="mt-2 text-xs text-gray-500">{helper}</p>}
    </CardContent>
  </Card>
);

export const ActorDashboardHeader: React.FC<ActorDashboardHeaderProps> = ({ metrics, loading = false, onRefresh }) => {
  const progressValue = metrics.totalActiveJobs === 0
    ? 0
    : Math.min(Math.round((metrics.applicationsSubmitted / metrics.totalActiveJobs) * 100), 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de talento</h1>
          <p className="text-sm text-gray-600">
            Seguimiento integral de tus oportunidades y comunicaciones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={loading}
          >
            Actualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          label="Postulaciones enviadas"
          value={metrics.applicationsSubmitted}
          helper="Total de oportunidades a las que te has postulado"
        />
        <MetricCard
          label="Procesos activos"
          value={metrics.totalActiveJobs}
          helper="Ofertas abiertas disponibles para aplicar"
          accent="text-emerald-600"
        />
        <MetricCard
          label="Entrevistas"
          value={metrics.interviewsScheduled}
          helper="Procesos en etapa de entrevistas"
          accent="text-blue-600"
        />
        <MetricCard
          label="Mensajes sin leer"
          value={metrics.unreadMessages}
          helper="Actualizaciones nuevas de contratantes"
          accent="text-rose-600"
        />
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tu avance en postulaciones</h2>
              <p className="text-sm text-gray-600">
                {metrics.applicationsSubmitted === 0
                  ? 'Aún no te has postulado. Explora las ofertas disponibles y encuentra tu próximo proyecto.'
                  : `Has aplicado a ${metrics.applicationsSubmitted} oportunidades. Mantente atento a las actualizaciones.`}
              </p>
            </div>
            {metrics.nextDeadline && (
              <div className="text-sm bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md">
                Próxima fecha límite: {metrics.nextDeadline.toLocaleDateString()}
              </div>
            )}
          </div>
          <div>
            <Progress value={progressValue} />
            <p className="mt-2 text-xs text-gray-500">
              {progressValue}% de tus postulaciones frente a las ofertas activas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
