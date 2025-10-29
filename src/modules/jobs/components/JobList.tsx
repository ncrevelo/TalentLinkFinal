'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useJobs, useJobUpdate } from '../hooks/useJobs';
import { Job, JobFilters, JobStatus, JobType, Department, ExperienceLevel, WorkModality, HIRING_STAGES } from '../types';
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  CardHeader, 
  CardContent, 
  Badge, 
  StatusBadge, 
  JobTypeBadge,
  Modal,
  ModalBody,
  ModalFooter,
  Progress,
  Alert
} from '../../../components/ui';

interface JobListProps {
  onEditJob?: (job: Job) => void;
  onViewJob?: (job: Job) => void;
  onManageStages?: (job: Job) => void;
  refreshKey?: number;
}

export const JobList: React.FC<JobListProps> = ({ onEditJob, onViewJob, onManageStages, refreshKey }) => {
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<Job | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  
  const { jobs, loading, error, hasMore, loadMore, updateFilters, refetch } = useJobs(filters);
  const { deleteJob, toggleStatus, updating } = useJobUpdate();

  useEffect(() => {
    if (typeof refreshKey !== 'number' || refreshKey === 0) {
      return;
    }
    refetch();
  }, [refreshKey, refetch]);

  // Filter options
  const statusOptions = [
    { value: JobStatus.ACTIVE, label: 'Activo' },
    { value: JobStatus.DRAFT, label: 'Borrador' },
    { value: JobStatus.PAUSED, label: 'Pausado' },
    { value: JobStatus.FILLED, label: 'Completado' },
    { value: JobStatus.EXPIRED, label: 'Expirado' },
    { value: JobStatus.CANCELLED, label: 'Cancelado' },
  ];

  const departmentOptions = Object.values(Department).map(dept => ({
    value: dept,
    label: dept
  }));

  const jobTypeOptions = [
    { value: JobType.FULL_TIME, label: 'Tiempo Completo' },
    { value: JobType.PART_TIME, label: 'Medio Tiempo' },
    { value: JobType.CONTRACT, label: 'Contrato' },
    { value: JobType.FREELANCE, label: 'Freelance' },
    { value: JobType.INTERNSHIP, label: 'Prácticas' },
    { value: JobType.TEMPORARY, label: 'Temporal' },
  ];

  const workModalityOptions = [
    { value: WorkModality.ON_SITE, label: 'Presencial' },
    { value: WorkModality.REMOTE, label: 'Remoto' },
    { value: WorkModality.HYBRID, label: 'Híbrido' },
  ];

  // Apply local search filter
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    
    const query = searchQuery.toLowerCase();
    return jobs.filter(job => 
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.department.toLowerCase().includes(query) ||
      job.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [jobs, searchQuery]);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleToggleStatus = async (jobId: string) => {
    const success = await toggleStatus(jobId);
    if (success) {
      refetch();
    }
  };

  const handleDeleteJob = async () => {
    if (!showDeleteModal) return;
    
    const success = await deleteJob(showDeleteModal.id, deleteReason.trim() || undefined);
    if (success) {
      setShowDeleteModal(null);
      setDeleteReason('');
      refetch();
    }
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

  const getProgressPercentage = (job: Job) => {
    if (job.positionsAvailable === 0) return 0;
    return Math.round((job.positionsFilled / job.positionsAvailable) * 100);
  };

  const isExpired = (job: Job) => {
    return new Date(job.deadline) < new Date();
  };

  if (error) {
    return (
      <Alert type="error">
        Error al cargar las postulaciones: {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Filtrar Postulaciones</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Buscar por título, descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Select
              placeholder="Estado"
              options={statusOptions}
              value={filters.status?.[0] || ''}
              onChange={(value) => handleFilterChange('status', value ? [value as JobStatus] : undefined)}
            />
            
            <Select
              placeholder="Departamento"
              options={departmentOptions}
              value={filters.department?.[0] || ''}
              onChange={(value) => handleFilterChange('department', value ? [value as Department] : undefined)}
              searchable
            />
            
            <Select
              placeholder="Tipo de trabajo"
              options={jobTypeOptions}
              value={filters.jobType?.[0] || ''}
              onChange={(value) => handleFilterChange('jobType', value ? [value as JobType] : undefined)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              placeholder="Modalidad"
              options={workModalityOptions}
              value={filters.workModality?.[0] || ''}
              onChange={(value) => handleFilterChange('workModality', value ? [value as WorkModality] : undefined)}
            />
            
            <Input
              type="number"
              placeholder="Salario mínimo"
              value={filters.salaryMin || ''}
              onChange={(e) => handleFilterChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
            />
            
            <Input
              type="number"
              placeholder="Salario máximo"
              value={filters.salaryMax || ''}
              onChange={(e) => handleFilterChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {loading && jobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando postulaciones...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No se encontraron postulaciones que coincidan con los filtros.</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {job.title}
                      </h3>
                      <StatusBadge status={job.status} />
                      {isExpired(job) && job.status === JobStatus.ACTIVE && (
                        <Badge variant="error" size="sm">Expirado</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <JobTypeBadge type={job.jobType} />
                      <Badge variant="info" size="sm">{job.department}</Badge>
                      <Badge variant="secondary" size="sm">
                        {job.workModality === WorkModality.ON_SITE ? 'Presencial' :
                         job.workModality === WorkModality.REMOTE ? 'Remoto' : 'Híbrido'}
                      </Badge>
                      {job.progress?.currentStage && (
                        <Badge variant="primary" size="sm">
                          {HIRING_STAGES[job.progress.currentStage]?.label || 'Estado desconocido'}
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Salario:</span>
                        <br />
                        {formatSalary(job)}
                      </div>
                      <div>
                        <span className="font-medium">Puestos:</span>
                        <br />
                        {job.positionsFilled}/{job.positionsAvailable}
                      </div>
                      <div>
                        <span className="font-medium">Aplicaciones:</span>
                        <br />
                        {job.progress.applicationsReceived}
                      </div>
                      <div>
                        <span className="font-medium">Fecha límite:</span>
                        <br />
                        {new Date(job.deadline).toLocaleDateString('es-CO')}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Progreso de contratación
                        </span>
                        <span className="text-sm text-gray-600">
                          {getProgressPercentage(job)}%
                        </span>
                      </div>
                      <Progress 
                        value={getProgressPercentage(job)} 
                        variant={job.status === JobStatus.FILLED ? 'success' : 'default'}
                        size="sm"
                      />
                    </div>

                    {/* Tags */}
                    {job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {job.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {job.tags.length > 3 && (
                          <Badge variant="secondary" size="sm">
                            +{job.tags.length - 3} más
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onViewJob?.(job)}
                    >
                      Ver Detalles
                    </Button>

                    {onManageStages && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onManageStages(job)}
                      >
                        Gestionar Proceso
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEditJob?.(job)}
                    >
                      Editar
                    </Button>

                    <Button
                      size="sm"
                      variant={job.status === JobStatus.ACTIVE ? 'secondary' : 'primary'}
                      onClick={() => handleToggleStatus(job.id)}
                      disabled={updating}
                    >
                      {job.status === JobStatus.ACTIVE ? 'Pausar' : 'Activar'}
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setShowDeleteModal(job)}
                      disabled={updating}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="text-center py-4">
            <Button
              variant="secondary"
              onClick={loadMore}
              disabled={loading}
            >
              Cargar más postulaciones
            </Button>
          </div>
        )}

        {/* Loading More */}
        {loading && jobs.length > 0 && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        title="Eliminar Postulación"
      >
        <ModalBody>
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar la postulación "{showDeleteModal?.title}"?
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Esta acción moverá la postulación al archivo de eliminados y no será visible para los candidatos.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razón de eliminación (opcional)
            </label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ej: Posición ya cubierta, cambio en requisitos, etc."
            />
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(null)}
            disabled={updating}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteJob}
            disabled={updating}
          >
            {updating ? 'Eliminando...' : 'Eliminar Postulación'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
