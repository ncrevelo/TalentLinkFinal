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
}

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);

export const ActorJobCard: React.FC<ActorJobCardProps> = ({ job, onApply, disabled = false, isApplying = false }) => {
  const salaryLabel = `${formatCurrency(job.salaryRange.min, job.salaryRange.currency)} - ${formatCurrency(job.salaryRange.max, job.salaryRange.currency)}${job.salaryRange.negotiable ? ' · Negociable' : ''}`;
  const deadlineLabel = job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Sin fecha límite';

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
            disabled={disabled}
            isLoading={isApplying}
          >
            Postularme
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
