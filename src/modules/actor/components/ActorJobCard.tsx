'use client';

import React from 'react';
import { Job } from '@/modules/jobs/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ActorJobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  disabled?: boolean;
  isApplying?: boolean;
  hasApplied?: boolean;
  isDeadlinePassed?: boolean;
  allowsApplications?: boolean;
}

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);

const MONTH_LABELS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const formatDeadline = (deadline?: Date | null) => {
  if (!deadline) {
    return 'Sin fecha límite';
  }

  const day = deadline.getDate();
  const month = MONTH_LABELS[deadline.getMonth()] ?? '';
  const year = deadline.getFullYear();

  return `${day} de ${month} de ${year}`;
};

export const ActorJobCard: React.FC<ActorJobCardProps> = ({
  job,
  onApply,
  disabled = false,
  isApplying = false,
  hasApplied = false,
  isDeadlinePassed = false,
  allowsApplications = true
}) => {
  const salaryLabel = `${formatCurrency(job.salaryRange.min, job.salaryRange.currency)} - ${formatCurrency(job.salaryRange.max, job.salaryRange.currency)}${job.salaryRange.negotiable ? ' · Negociable' : ''}`;
  const deadlineLabel = formatDeadline(job.deadline);

  const buttonDisabled = disabled || hasApplied || isDeadlinePassed || !allowsApplications;
  const buttonVariant = hasApplied || isDeadlinePassed || !allowsApplications ? 'outline' : 'primary';

  let buttonLabel = 'Postularme';
  if (hasApplied) {
    buttonLabel = 'Ya te postulaste';
  } else if (isDeadlinePassed) {
    buttonLabel = 'Fecha límite vencida';
  } else if (!allowsApplications) {
    buttonLabel = 'Proceso cerrado';
  }

  const buttonTitle = hasApplied
    ? 'Ya enviaste tu postulación para esta oferta.'
    : isDeadlinePassed
      ? 'La fecha límite de envío de material ya pasó.'
      : !allowsApplications
        ? 'El proceso está cerrado para nuevas postulaciones.'
        : 'Enviar postulación';

  return (
    <Card className="border border-transparent hover:border-indigo-200 transition-colors shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <CardTitle className="text-xl text-indigo-900">{job.title}</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
              <span>{job.department}</span>
              <span>•</span>
              <span>{job.workModality === 'on_site' ? 'Presencial' : job.workModality === 'remote' ? 'Remoto' : 'Híbrido'}</span>
              <span>•</span>
              <span>{salaryLabel}</span>
            </div>
          </div>
          <Button
            onClick={() => onApply(job)}
            disabled={buttonDisabled}
            isLoading={isApplying}
            variant={buttonVariant}
            title={buttonTitle}
          >
            {buttonLabel}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">Experiencia: {job.experienceLevel}</Badge>
          <Badge variant="primary">Tipo: {job.jobType}</Badge>
          <Badge variant="secondary">Cierra: {deadlineLabel}</Badge>
          <Badge variant="secondary">Vacantes: {Math.max(job.positionsAvailable - job.positionsFilled, 0)}</Badge>
        </div>
        {job.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 6).map(tag => (
              <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
