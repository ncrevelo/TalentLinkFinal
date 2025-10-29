'use client';

import React from 'react';
import { ApplicationStatus, JobApplication } from '../types';
import { HiringStage } from '@/modules/jobs/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ActorApplicationsListProps {
  applications: JobApplication[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const statusLabels: Record<ApplicationStatus, { label: string; variant: 'info' | 'success' | 'warning' | 'error' | 'primary' | 'secondary' }> = {
  [ApplicationStatus.APPLIED]: { label: 'Postulado', variant: 'primary' },
  [ApplicationStatus.IN_REVIEW]: { label: 'En revisión', variant: 'info' },
  [ApplicationStatus.INTERVIEW]: { label: 'Entrevista', variant: 'info' },
  [ApplicationStatus.OFFER]: { label: 'Oferta', variant: 'success' },
  [ApplicationStatus.HIRED]: { label: 'Contratado', variant: 'success' },
  [ApplicationStatus.REJECTED]: { label: 'No seleccionado', variant: 'secondary' },
  [ApplicationStatus.WITHDRAWN]: { label: 'Retirada', variant: 'warning' }
};

const stageLabels: Record<HiringStage, string> = {
  [HiringStage.RECEIVING_APPLICATIONS]: 'Recibiendo postulaciones',
  [HiringStage.REVIEWING_APPLICATIONS]: 'Revisión',
  [HiringStage.INTERVIEWS]: 'Entrevistas',
  [HiringStage.BACKGROUND_CHECK]: 'Verificación',
  [HiringStage.HIRING_PROCESS]: 'Proceso de contratación',
  [HiringStage.CLOSED]: 'Cerrado'
};

const timelineMessage = (application: JobApplication): string => {
  if (!application.timeline.length) {
    return 'Sin actualizaciones adicionales.';
  }
  const latest = application.timeline[application.timeline.length - 1];
  return `${latest.title} • ${latest.createdAt.toLocaleDateString()}`;
};

export const ActorApplicationsList: React.FC<ActorApplicationsListProps> = ({ applications, loading, error, onRetry }) => {
  if (loading && applications.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center text-gray-500">
          Cargando tus postulaciones...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-red-700 underline"
            >
              Reintentar
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (applications.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center text-gray-500">
          Aún no te has postulado a ninguna oferta.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map(application => {
        const statusInfo = statusLabels[application.status] ?? statusLabels[ApplicationStatus.APPLIED];
        return (
          <Card key={application.id} className="shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg text-indigo-900">{application.job?.title ?? 'Oferta no disponible'}</CardTitle>
                  <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-2 items-center">
                    <span>{application.job?.department}</span>
                    {application.job?.workModality && (
                      <span>• {application.job.workModality === 'remote' ? 'Remoto' : application.job.workModality === 'on_site' ? 'Presencial' : 'Híbrido'}</span>
                    )}
                    {application.job?.deadline && (
                      <span>• Cierra {application.job.deadline.toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  {application.unreadMessages && application.unreadMessages > 0 && (
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                      {application.unreadMessages} mensajes nuevos
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="text-sm text-gray-700">
                Etapa actual: {stageLabels[application.currentStage]}
              </div>
              <div className="text-sm text-gray-500">
                {timelineMessage(application)}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>Postulado el {application.submittedAt.toLocaleDateString()}</span>
                <span>• Última actualización {application.updatedAt.toLocaleDateString()}</span>
                {application.lastMessageAt && (
                  <span>• Último mensaje {application.lastMessageAt.toLocaleDateString()}</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
