'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { JobCreateForm } from '@/modules/jobs';
import { Job } from '@/modules/jobs/types';

export default function CreateJobPage() {
  const router = useRouter();

  const handleSuccess = (job: Job) => {
    // Redirect to the job management page after successful creation
    router.push('/hirer/jobs/manage');
  };

  const handleCancel = () => {
    // Go back to the previous page or to job management
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Postulación</h1>
        <p className="text-gray-600 mt-2">
          Completa la información para publicar una nueva oportunidad de trabajo.
        </p>
      </div>

      <JobCreateForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
