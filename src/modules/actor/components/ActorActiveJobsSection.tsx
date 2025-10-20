'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActorJobFilters } from '../types';
import { useActorJobs } from '../hooks';
import { ActorJobFiltersForm } from './ActorJobFilters';
import { ActorJobCard } from './ActorJobCard';
import { JobApplicationModal } from './JobApplicationModal';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Job } from '@/modules/jobs/types';

const DEFAULT_FILTERS: ActorJobFilters = {
  sortBy: 'recent'
};

export const ActorActiveJobsSection: React.FC = () => {
  const {
    jobs,
    loading,
    error,
    hasMore,
    filters,
    updateFilters,
    refetch,
    loadMore,
    applying,
    applicationError,
    applicationSuccess,
    applyToJob,
    resetApplicationState
  } = useActorJobs(DEFAULT_FILTERS);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    resetApplicationState();
  }, [resetApplicationState]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedJob(null);
    resetApplicationState();
  }, [resetApplicationState]);

  const handleSubmitApplication = useCallback(async (payload: Parameters<typeof applyToJob>[1]) => {
    if (!selectedJob) {
      return;
    }

    await applyToJob(selectedJob.id, payload);
  }, [applyToJob, selectedJob]);

  useEffect(() => {
    if (applicationSuccess) {
      refetch();
      const timeoutId = setTimeout(() => {
        handleCloseModal();
      }, 1200);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [applicationSuccess, handleCloseModal, refetch]);

  const handleResetFilters = useCallback(() => {
    updateFilters(DEFAULT_FILTERS);
    refetch();
  }, [updateFilters, refetch]);

  const jobsSummary = useMemo(() => {
    if (loading && jobs.length === 0) {
      return 'Buscando oportunidades activas...';
    }

    if (jobs.length === 0) {
      return 'No encontramos resultados con los filtros actuales.';
    }

    return `${jobs.length} oportunidades listas para talento.`;
  }, [jobs.length, loading]);

  return (
    <section className="space-y-6">
      <ActorJobFiltersForm
        filters={filters}
        onChange={updateFilters}
        onReset={handleResetFilters}
      />

      {error && (
        <Alert type="error" title="No pudimos cargar las ofertas" message={error} />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Ofertas activas para talento</h2>
        <p className="text-sm text-gray-500">{jobsSummary}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map(job => (
          <ActorJobCard
            key={job.id}
            job={job}
            onApply={handleApplyClick}
            disabled={applying && selectedJob?.id === job.id}
            isApplying={applying && selectedJob?.id === job.id}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={loadMore} isLoading={loading}>
            Cargar más oportunidades
          </Button>
        </div>
      )}

      {jobs.length === 0 && !loading && !error && (
        <div className="text-center py-12 bg-white border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-600">Ajusta los filtros o vuelve más tarde para ver nuevas oportunidades.</p>
          <Button className="mt-4" variant="outline" onClick={refetch}>
            Reintentar búsqueda
          </Button>
        </div>
      )}

      <JobApplicationModal
        job={selectedJob ?? undefined}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitApplication}
        isSubmitting={applying}
        error={applicationError}
        success={applicationSuccess}
      />
    </section>
  );
};
