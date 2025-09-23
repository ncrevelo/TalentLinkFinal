'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobList, HiringStageManager } from '@/modules/jobs';
import { Job, HIRING_STAGES } from '@/modules/jobs/types';
import { Button, Modal, ModalBody, ModalFooter } from '@/components/ui';

export default function ManageJobsPage() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStageManager, setShowStageManager] = useState(false);

  const handleEditJob = (job: Job) => {
    // Navigate to edit page (we could create this later)
    router.push(`/hirer/jobs/edit/${job.id}`);
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleManageStages = (job: Job) => {
    setSelectedJob(job);
    setShowStageManager(true);
  };

  const handleCreateNew = () => {
    router.push('/hirer/jobs/create');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (job: Job) => {
    if (!job.salaryRange.min && !job.salaryRange.max) return 'Salario a convenir';
    
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: job.salaryRange.currency,
      minimumFractionDigits: 0,
    });

    if (job.salaryRange.min && job.salaryRange.max) {
      return `${formatter.format(job.salaryRange.min)} - ${formatter.format(job.salaryRange.max)}`;
    } else if (job.salaryRange.min) {
      return `Desde ${formatter.format(job.salaryRange.min)}`;
    } else if (job.salaryRange.max) {
      return `Hasta ${formatter.format(job.salaryRange.max)}`;
    }
    
    return 'Salario a convenir';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestionar Postulaciones</h1>
          <p className="text-gray-600 mt-2">
            Administra todas tus ofertas de trabajo, edita detalles y revisa aplicaciones.
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          Crear Nueva Postulación
        </Button>
      </div>

      <JobList
        onEditJob={handleEditJob}
        onViewJob={handleViewJob}
        onManageStages={handleManageStages}
      />

      {/* Job Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={selectedJob?.title || 'Detalles del Trabajo'}
        size="lg"
      >
        <ModalBody>
          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Departamento:</span> {selectedJob.department}</div>
                    <div><span className="font-medium">Tipo:</span> {selectedJob.jobType}</div>
                    <div><span className="font-medium">Modalidad:</span> {selectedJob.workModality}</div>
                    <div><span className="font-medium">Experiencia:</span> {selectedJob.experienceLevel}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detalles</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Salario:</span> {formatSalary(selectedJob)}</div>
                    <div><span className="font-medium">Puestos:</span> {selectedJob.positionsFilled}/{selectedJob.positionsAvailable}</div>
                    <div><span className="font-medium">Fecha límite:</span> {formatDate(selectedJob.deadline)}</div>
                    <div><span className="font-medium">Estado:</span> {selectedJob.status}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              {selectedJob.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Requisitos</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.benefits.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Beneficios</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Estadísticas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-600">{selectedJob.progress.applicationsReceived}</div>
                    <div className="text-blue-700">Aplicaciones</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">{selectedJob.progress.applicationsReviewed}</div>
                    <div className="text-green-700">Revisadas</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="font-semibold text-purple-600">{selectedJob.progress.interviewsScheduled}</div>
                    <div className="text-purple-700">Entrevistas</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <div className="font-semibold text-orange-600">{selectedJob.progress.hiredCandidates}</div>
                    <div className="text-orange-700">Contratados</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Cerrar
          </Button>
          {selectedJob && (
            <Button onClick={() => handleEditJob(selectedJob)}>
              Editar Trabajo
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Hiring Stage Management Modal */}
      <Modal
        isOpen={showStageManager}
        onClose={() => setShowStageManager(false)}
        title={`Gestionar Proceso: ${selectedJob?.title || ''}`}
        size="lg"
      >
        <ModalBody>
          {selectedJob && (
            <HiringStageManager
              job={selectedJob}
              onStageChanged={() => {
                setShowStageManager(false);
                // You might want to refresh the job list here
              }}
            />
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowStageManager(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
