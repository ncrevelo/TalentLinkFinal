'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { JobEditForm } from '@/modules/jobs';
import { useJobById } from '@/modules/jobs/hooks/useJobs';
import { Alert } from '@/components/ui';
import { Job } from '@/modules/jobs/types';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { job, loading, error } = useJobById(jobId);

  const handleSuccess = (updatedJob: Job) => {
    // Navigate back to manage jobs page
    router.push('/hirer/jobs/manage');
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              No se pudo cargar la información del trabajo.
            </p>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Alert type="error" className="mb-6">
            Trabajo no encontrado
          </Alert>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              El trabajo que intentas editar no existe o ha sido eliminado.
            </p>
            <button
              onClick={() => router.push('/hirer/jobs/manage')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Ir a gestionar trabajos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => router.push('/hirer/dashboard')}
              className="hover:text-blue-600"
            >
              Dashboard
            </button>
            <span>/</span>
            <button
              onClick={() => router.push('/hirer/jobs/manage')}
              className="hover:text-blue-600"
            >
              Gestionar Trabajos
            </button>
            <span>/</span>
            <span className="text-gray-900">Editar Trabajo</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Postulación
          </h1>
          <p className="text-gray-600 mt-2">
            Modifica los detalles de tu casting: "{job.title}"
          </p>
        </div>

        <JobEditForm
          job={job}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
