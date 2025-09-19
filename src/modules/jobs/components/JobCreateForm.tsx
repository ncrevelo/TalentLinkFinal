'use client';

import React, { useState } from 'react';
import { useJobCreate } from '../hooks/useJobs';
import { Job, JobType, JobStatus, Department, ExperienceLevel, WorkModality, JobCreateRequest } from '../types';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent, Alert } from '../../../components/ui';

// Datos estáticos para departamentos de Colombia
const DEPARTMENTS = [
  { value: Department.ANTIOQUIA, label: 'Antioquia' },
  { value: Department.ATLANTICO, label: 'Atlántico' },
  { value: Department.BOGOTA, label: 'Bogotá D.C.' },
  { value: Department.BOLIVAR, label: 'Bolívar' },
  { value: Department.BOYACA, label: 'Boyacá' },
  { value: Department.CALDAS, label: 'Caldas' },
  { value: Department.CAQUETA, label: 'Caquetá' },
  { value: Department.CASANARE, label: 'Casanare' },
  { value: Department.CAUCA, label: 'Cauca' },
  { value: Department.CESAR, label: 'Cesar' },
  { value: Department.CHOCO, label: 'Chocó' },
  { value: Department.CORDOBA, label: 'Córdoba' },
  { value: Department.CUNDINAMARCA, label: 'Cundinamarca' },
  { value: Department.GUAINIA, label: 'Guainía' },
  { value: Department.GUAVIARE, label: 'Guaviare' },
  { value: Department.HUILA, label: 'Huila' },
  { value: Department.LA_GUAJIRA, label: 'La Guajira' },
  { value: Department.MAGDALENA, label: 'Magdalena' },
  { value: Department.META, label: 'Meta' },
  { value: Department.NARINO, label: 'Nariño' },
  { value: Department.NORTE_SANTANDER, label: 'Norte de Santander' },
  { value: Department.PUTUMAYO, label: 'Putumayo' },
  { value: Department.QUINDIO, label: 'Quindío' },
  { value: Department.RISARALDA, label: 'Risaralda' },
  { value: Department.SAN_ANDRES, label: 'San Andrés y Providencia' },
  { value: Department.SANTANDER, label: 'Santander' },
  { value: Department.SUCRE, label: 'Sucre' },
  { value: Department.TOLIMA, label: 'Tolima' },
  { value: Department.VALLE_DEL_CAUCA, label: 'Valle del Cauca' },
  { value: Department.VAUPES, label: 'Vaupés' },
  { value: Department.VICHADA, label: 'Vichada' },
];

const JOB_TYPES = [
  { value: JobType.FULL_TIME, label: 'Tiempo Completo' },
  { value: JobType.PART_TIME, label: 'Medio Tiempo' },
  { value: JobType.CONTRACT, label: 'Contrato' },
  { value: JobType.FREELANCE, label: 'Freelance' },
  { value: JobType.INTERNSHIP, label: 'Prácticas' },
  { value: JobType.TEMPORARY, label: 'Temporal' },
];

const WORK_MODALITIES = [
  { value: WorkModality.ON_SITE, label: 'Presencial' },
  { value: WorkModality.REMOTE, label: 'Remoto' },
  { value: WorkModality.HYBRID, label: 'Híbrido' },
];

const EXPERIENCE_LEVELS = [
  { value: ExperienceLevel.ENTRY, label: 'Sin experiencia / Debutante' },
  { value: ExperienceLevel.JUNIOR, label: 'Junior (1-2 años)' },
  { value: ExperienceLevel.MID, label: 'Intermedio (3-5 años)' },
  { value: ExperienceLevel.SENIOR, label: 'Senior (5-8 años)' },
  { value: ExperienceLevel.LEAD, label: 'Protagonista (8+ años)' },
  { value: ExperienceLevel.EXECUTIVE, label: 'Ejecutivo/Directivo' },
];

interface JobCreateFormProps {
  onSuccess?: (job: Job) => void;
  onCancel?: () => void;
}

export const JobCreateForm: React.FC<JobCreateFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { createJob, creating, error } = useJobCreate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    department: '' as Department | '',
    jobType: '' as JobType | '',
    workModality: WorkModality.ON_SITE,
    experienceLevel: '' as ExperienceLevel | '',
    salaryMin: '',
    salaryMax: '',
    currency: 'COP' as 'COP' | 'USD',
    positions: '1',
    deadlineDate: '',
    skills: '',
    tags: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 10) {
      newErrors.title = 'El título debe tener al menos 10 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 50) {
      newErrors.description = 'La descripción debe tener al menos 50 caracteres';
    }

    if (!formData.department) {
      newErrors.department = 'El departamento es requerido';
    }

    if (!formData.jobType) {
      newErrors.jobType = 'El tipo de trabajo es requerido';
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'El nivel de experiencia es requerido';
    }

    if (!formData.deadlineDate) {
      newErrors.deadlineDate = 'La fecha límite es requerida';
    } else {
      const deadline = new Date(formData.deadlineDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadline <= today) {
        newErrors.deadlineDate = 'La fecha límite debe ser mayor a hoy';
      }
    }

    if (formData.salaryMin && formData.salaryMax) {
      const min = parseFloat(formData.salaryMin);
      const max = parseFloat(formData.salaryMax);
      
      if (min >= max) {
        newErrors.salaryMax = 'El salario máximo debe ser mayor al mínimo';
      }
    }

    const positions = parseInt(formData.positions);
    if (isNaN(positions) || positions < 1 || positions > 100) {
      newErrors.positions = 'El número de puestos debe estar entre 1 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const jobData: JobCreateRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        department: formData.department as Department,
        salaryRange: {
          min: formData.salaryMin ? parseFloat(formData.salaryMin) : 0,
          max: formData.salaryMax ? parseFloat(formData.salaryMax) : 0,
          currency: formData.currency,
          negotiable: !formData.salaryMin || !formData.salaryMax
        },
        jobType: formData.jobType as JobType,
        workModality: formData.workModality,
        deadline: new Date(formData.deadlineDate),
        positionsAvailable: parseInt(formData.positions),
        requirements: formData.requirements ? formData.requirements.split('\n').filter(Boolean) : [],
        benefits: formData.benefits ? formData.benefits.split('\n').filter(Boolean) : [],
        experienceLevel: formData.experienceLevel as ExperienceLevel,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };

      const jobId = await createJob(jobData);
      if (jobId) {
        // Since createJob returns the ID, we'll assume success
        onSuccess?.({} as Job); // Pass a placeholder - the parent can handle the actual job data
      }
    } catch (err) {
      console.error('Error creating job:', err);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nueva Postulación de Casting</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <Input
                label="Título del personaje o proyecto"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
                required
                placeholder="ej. Protagonista masculino para cortometraje de drama"
                maxLength={100}
              />
            </div>

            <Select
              label="Departamento"
              options={DEPARTMENTS}
              value={formData.department}
              onChange={(value) => handleInputChange('department', value as string)}
              error={errors.department}
              required
              searchable
              placeholder="Seleccionar departamento"
            />

            <Select
              label="Tipo de proyecto"
              options={JOB_TYPES}
              value={formData.jobType}
              onChange={(value) => handleInputChange('jobType', value as string)}
              error={errors.jobType}
              required
            />

            <Select
              label="Modalidad de trabajo"
              options={WORK_MODALITIES}
              value={formData.workModality}
              onChange={(value) => handleInputChange('workModality', value as string)}
              required
            />

            <Select
              label="Nivel de experiencia"
              options={EXPERIENCE_LEVELS}
              value={formData.experienceLevel}
              onChange={(value) => handleInputChange('experienceLevel', value as string)}
              error={errors.experienceLevel}
              required
            />

            <Input
              label="Número de roles a cubrir"
              type="number"
              value={formData.positions}
              onChange={(e) => handleInputChange('positions', e.target.value)}
              error={errors.positions}
              required
              min="1"
              max="100"
            />

            <Input
              label="Fecha límite para audición/envío de material"
              type="date"
              value={formData.deadlineDate}
              onChange={(e) => handleInputChange('deadlineDate', e.target.value)}
              error={errors.deadlineDate}
              required
              min={today}
            />
          </div>

          {/* Información Salarial */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Remuneración (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Mínimo por proyecto/jornada"
                type="number"
                value={formData.salaryMin}
                onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                placeholder="ej. 2000000"
                min="0"
              />
              
              <Input
                label="Máximo por proyecto/jornada"
                type="number"
                value={formData.salaryMax}
                onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                error={errors.salaryMax}
                placeholder="ej. 3000000"
                min="0"
              />

              <Select
                label="Moneda"
                options={[
                  { value: 'COP', label: 'Pesos Colombianos (COP)' },
                  { value: 'USD', label: 'Dólares (USD)' },
                ]}
                value={formData.currency}
                onChange={(value) => handleInputChange('currency', value as string)}
              />
            </div>
          </div>

          {/* Descripciones */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Descripción del Casting</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción del personaje/proyecto <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
                placeholder="Describe el personaje, la trama del proyecto, la vibra del equipo, etc."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsabilidades y deberes (opcional)
              </label>
              <textarea
                value={formData.responsibilities}
                onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="• Participar en ensayos&#10;• Memorizar guion&#10;• Trabajar con el director en la interpretación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requisitos del perfil (opcional)
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="• Rango de edad (ej. 25-35 años)&#10;• Habilidad para improvisar&#10;• Portafolio o reel de actuación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habilidades (separadas por comas)
              </label>
              <Input
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="ej. teatro, cine, drama, comedia, voz en off, canto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficios/Detalles del proyecto (opcional)
              </label>
              <textarea
                value={formData.benefits}
                onChange={(e) => handleInputChange('benefits', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="• Equipo profesional&#10;• Oportunidad de crecer en la industria&#10;• Alimentación y transporte cubiertos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas (separadas por comas)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="ej. casting, audición, cine, teatro, serie, anuncio"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={creating}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={creating}
              className="min-w-32"
            >
              {creating ? 'Guardando...' : 'Publicar Casting'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};