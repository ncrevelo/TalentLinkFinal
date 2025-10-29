'use client';

import React, { useState, useEffect } from 'react';
import { useProfileUpdate } from '../hooks/useProfile';
import { HirerProfile, ColombiaDepartment, ProjectType, BudgetRange } from '@/modules/onboarding/types';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent, Alert } from '@/components/ui';

// Datos estáticos para departamentos de Colombia
const DEPARTMENTS = [
  { value: ColombiaDepartment.ANTIOQUIA, label: 'Antioquia' },
  { value: ColombiaDepartment.ATLANTICO, label: 'Atlántico' },
  { value: ColombiaDepartment.CUNDINAMARCA, label: 'Bogotá D.C.' },
  { value: ColombiaDepartment.BOLIVAR, label: 'Bolívar' },
  { value: ColombiaDepartment.BOYACA, label: 'Boyacá' },
  { value: ColombiaDepartment.CALDAS, label: 'Caldas' },
  { value: ColombiaDepartment.CAQUETA, label: 'Caquetá' },
  { value: ColombiaDepartment.CASANARE, label: 'Casanare' },
  { value: ColombiaDepartment.CAUCA, label: 'Cauca' },
  { value: ColombiaDepartment.CESAR, label: 'Cesar' },
  { value: ColombiaDepartment.CHOCO, label: 'Chocó' },
  { value: ColombiaDepartment.CORDOBA, label: 'Córdoba' },
  { value: ColombiaDepartment.CUNDINAMARCA, label: 'Cundinamarca' },
  { value: ColombiaDepartment.GUAINIA, label: 'Guainía' },
  { value: ColombiaDepartment.GUAVIARE, label: 'Guaviare' },
  { value: ColombiaDepartment.HUILA, label: 'Huila' },
  { value: ColombiaDepartment.LA_GUAJIRA, label: 'La Guajira' },
  { value: ColombiaDepartment.MAGDALENA, label: 'Magdalena' },
  { value: ColombiaDepartment.META, label: 'Meta' },
  { value: ColombiaDepartment.NARINO, label: 'Nariño' },
  { value: ColombiaDepartment.NORTE_DE_SANTANDER, label: 'Norte de Santander' },
  { value: ColombiaDepartment.PUTUMAYO, label: 'Putumayo' },
  { value: ColombiaDepartment.QUINDIO, label: 'Quindío' },
  { value: ColombiaDepartment.RISARALDA, label: 'Risaralda' },
  { value: ColombiaDepartment.SAN_ANDRES, label: 'San Andrés y Providencia' },
  { value: ColombiaDepartment.SANTANDER, label: 'Santander' },
  { value: ColombiaDepartment.SUCRE, label: 'Sucre' },
  { value: ColombiaDepartment.TOLIMA, label: 'Tolima' },
  { value: ColombiaDepartment.VALLE_DEL_CAUCA, label: 'Valle del Cauca' },
  { value: ColombiaDepartment.VAUPES, label: 'Vaupés' },
  { value: ColombiaDepartment.VICHADA, label: 'Vichada' },
];

const PROJECT_TYPES = [
  { value: ProjectType.SHORT_FILM, label: 'Cortometraje' },
  { value: ProjectType.FEATURE_FILM, label: 'Largometraje' },
  { value: ProjectType.TV_SERIES, label: 'Serie de TV' },
  { value: ProjectType.TV_COMMERCIAL, label: 'Comercial de TV' },
  { value: ProjectType.MUSIC_VIDEO, label: 'Video Musical' },
  { value: ProjectType.CORPORATE_VIDEO, label: 'Video Corporativo' },
  { value: ProjectType.DOCUMENTARY, label: 'Documental' },
  { value: ProjectType.THEATER_PLAY, label: 'Obra de Teatro' },
  { value: ProjectType.PHOTOSHOOT, label: 'Sesión de Fotos' },
  { value: ProjectType.LIVE_EVENT, label: 'Evento en Vivo' },
  { value: ProjectType.STREAMING_CONTENT, label: 'Contenido para Streaming' },
];

const BUDGET_RANGES = [
  { value: BudgetRange.UNDER_1M, label: 'Menos de $1,000,000' },
  { value: BudgetRange.BETWEEN_1M_5M, label: '$1,000,000 - $5,000,000' },
  { value: BudgetRange.BETWEEN_5M_10M, label: '$5,000,000 - $10,000,000' },
  { value: BudgetRange.BETWEEN_10M_25M, label: '$10,000,000 - $25,000,000' },
  { value: BudgetRange.OVER_25M, label: 'Más de $25,000,000' },
  { value: BudgetRange.PROJECT_BASED, label: 'Basado en el proyecto' },
];

const COMPANY_SIZES = [
  { value: 'individual', label: 'Individual/Freelancer' },
  { value: 'pequena', label: 'Pequeña (1-10 empleados)' },
  { value: 'mediana', label: 'Mediana (11-50 empleados)' },
  { value: 'grande', label: 'Grande (51-200 empleados)' },
  { value: 'empresa', label: 'Empresa (200+ empleados)' },
];

interface ProfileEditFormProps {
  profile: HirerProfile;
  onSuccess?: (profile: HirerProfile) => void;
  onCancel?: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profile,
  onSuccess,
  onCancel,
}) => {
  const { updateProfile, updating, error, success } = useProfileUpdate();
  
  const [formData, setFormData] = useState({
    displayName: profile.displayName || '',
    companyName: profile.hirerData?.companyName || '',
    isIndividual: profile.hirerData?.isIndividual || false,
    firstName: profile.hirerData?.firstName || '',
    lastName: profile.hirerData?.lastName || '',
    phone: profile.hirerData?.phone || '',
    website: profile.hirerData?.website || '',
    address: profile.hirerData?.location?.address || '',
    city: profile.hirerData?.location?.city || '',
    department: profile.hirerData?.location?.department || '',
    country: profile.hirerData?.location?.country || 'Colombia',
    postalCode: profile.hirerData?.location?.postalCode || '',
    industry: profile.hirerData?.industry || '',
    companySize: profile.hirerData?.companySize || 'individual',
    yearsInBusiness: profile.hirerData?.yearsInBusiness ? profile.hirerData.yearsInBusiness.toString() : '',
    projectTypes: profile.hirerData?.projectTypes || [],
    averageBudget: profile.hirerData?.averageBudget || BudgetRange.PROJECT_BASED,
    taxId: profile.hirerData?.taxId || '',
    description: profile.hirerData?.description || '',
    linkedin: profile.hirerData?.socialMedia?.linkedin || '',
    websiteContact: profile.hirerData?.socialMedia?.website || '',
    instagram: profile.hirerData?.socialMedia?.instagram || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes
  useEffect(() => {
    const originalData = {
      displayName: profile.displayName || '',
      companyName: profile.hirerData?.companyName || '',
      isIndividual: profile.hirerData?.isIndividual || false,
      firstName: profile.hirerData?.firstName || '',
      lastName: profile.hirerData?.lastName || '',
      phone: profile.hirerData?.phone || '',
      website: profile.hirerData?.website || '',
      address: profile.hirerData?.location?.address || '',
      city: profile.hirerData?.location?.city || '',
      department: profile.hirerData?.location?.department || '',
      country: profile.hirerData?.location?.country || 'Colombia',
      postalCode: profile.hirerData?.location?.postalCode || '',
      industry: profile.hirerData?.industry || '',
      companySize: profile.hirerData?.companySize || 'individual',
      yearsInBusiness: profile.hirerData?.yearsInBusiness ? profile.hirerData.yearsInBusiness.toString() : '',
      projectTypes: profile.hirerData?.projectTypes || [],
      averageBudget: profile.hirerData?.averageBudget || BudgetRange.PROJECT_BASED,
      taxId: profile.hirerData?.taxId || '',
      description: profile.hirerData?.description || '',
      linkedin: profile.hirerData?.socialMedia?.linkedin || '',
      websiteContact: profile.hirerData?.socialMedia?.website || '',
      instagram: profile.hirerData?.socialMedia?.instagram || '',
    };

    const currentDataString = JSON.stringify(formData);
    const originalDataString = JSON.stringify(originalData);
    setHasChanges(currentDataString !== originalDataString);
  }, [formData, profile]);

  // Handle success
  useEffect(() => {
    if (success) {
      onSuccess?.(profile);
    }
  }, [success, profile, onSuccess]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProjectTypesChange = (selectedTypes: string[]) => {
    setFormData(prev => ({ ...prev, projectTypes: selectedTypes as ProjectType[] }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'El nombre de usuario es requerido';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.department) {
      newErrors.department = 'El departamento es requerido';
    }

    if (!formData.industry.trim()) {
      newErrors.industry = 'La industria es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 50) {
      newErrors.description = 'La descripción debe tener al menos 50 caracteres';
    }

    if (formData.projectTypes.length === 0) {
      newErrors.projectTypes = 'Selecciona al menos un tipo de proyecto';
    }

    if (formData.yearsInBusiness && isNaN(parseInt(formData.yearsInBusiness))) {
      newErrors.yearsInBusiness = 'Los años en el negocio deben ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      onCancel?.();
      return;
    }

    try {
      const updateData = {
        displayName: formData.displayName.trim(),
        hirerData: {
          companyName: formData.companyName.trim() || undefined,
          isIndividual: formData.isIndividual,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          website: formData.website.trim() || undefined,
          location: {
            address: formData.address.trim(),
            city: formData.city.trim(),
            department: formData.department,
            country: formData.country,
            postalCode: formData.postalCode.trim(),
          },
          industry: formData.industry.trim(),
          companySize: formData.companySize as any,
          yearsInBusiness: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : undefined,
          projectTypes: formData.projectTypes,
          averageBudget: formData.averageBudget,
          isVerified: profile.hirerData?.isVerified || false,
          taxId: formData.taxId.trim() || undefined,
          description: formData.description.trim(),
          socialMedia: {
            linkedin: formData.linkedin.trim() || undefined,
            website: formData.websiteContact.trim() || undefined,
            instagram: formData.instagram.trim() || undefined,
          },
        }
      };

      await updateProfile(profile.uid, updateData);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleReset = () => {
    setFormData({
      displayName: profile.displayName || '',
      companyName: profile.hirerData?.companyName || '',
      isIndividual: profile.hirerData?.isIndividual || false,
      firstName: profile.hirerData?.firstName || '',
      lastName: profile.hirerData?.lastName || '',
      phone: profile.hirerData?.phone || '',
      website: profile.hirerData?.website || '',
      address: profile.hirerData?.location?.address || '',
      city: profile.hirerData?.location?.city || '',
      department: profile.hirerData?.location?.department || '',
      country: profile.hirerData?.location?.country || 'Colombia',
      postalCode: profile.hirerData?.location?.postalCode || '',
      industry: profile.hirerData?.industry || '',
      companySize: profile.hirerData?.companySize || 'individual',
      yearsInBusiness: profile.hirerData?.yearsInBusiness ? profile.hirerData.yearsInBusiness.toString() : '',
      projectTypes: profile.hirerData?.projectTypes || [],
      averageBudget: profile.hirerData?.averageBudget || BudgetRange.PROJECT_BASED,
      taxId: profile.hirerData?.taxId || '',
      description: profile.hirerData?.description || '',
      linkedin: profile.hirerData?.socialMedia?.linkedin || '',
      websiteContact: profile.hirerData?.socialMedia?.website || '',
      instagram: profile.hirerData?.socialMedia?.instagram || '',
    });
    setErrors({});
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Perfil de Contratante</CardTitle>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Perfil creado: {profile.createdAt.toLocaleDateString('es-CO')} | 
            Última actualización: {profile.updatedAt.toLocaleDateString('es-CO')}
          </div>
          {hasChanges && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Cambios sin guardar
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {success && (
          <Alert type="success" className="mb-6">
            El perfil se ha actualizado exitosamente.
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Nombre de usuario público"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                error={errors.displayName}
                required
                placeholder="Nombre que verán otros usuarios"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isIndividual"
                  checked={formData.isIndividual}
                  onChange={(e) => handleInputChange('isIndividual', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isIndividual" className="text-sm font-medium text-gray-700">
                  Soy un contratante individual (no empresa)
                </label>
              </div>

              {!formData.isIndividual && (
                <Input
                  label="Nombre de la empresa"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Nombre de tu empresa o productora"
                />
              )}

              <Input
                label="Nombre"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                required
                placeholder="Tu nombre"
              />

              <Input
                label="Apellido"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                required
                placeholder="Tu apellido"
              />

              <Input
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                required
                placeholder="Número de contacto"
              />
            </div>
          </div>

          {/* Ubicación */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Dirección"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Dirección completa"
              />

              <Input
                label="Ciudad"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={errors.city}
                required
                placeholder="Ciudad donde operas"
              />

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

              <Input
                label="Código postal"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="Código postal"
              />
            </div>
          </div>

          {/* Información Profesional */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Profesional</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Industria"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                error={errors.industry}
                required
                placeholder="ej. Cine, Televisión, Publicidad"
              />

              <Select
                label="Tamaño de la empresa"
                options={COMPANY_SIZES}
                value={formData.companySize}
                onChange={(value) => handleInputChange('companySize', value as string)}
                required
              />

              <Input
                label="Años en el negocio"
                type="number"
                value={formData.yearsInBusiness}
                onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                error={errors.yearsInBusiness}
                placeholder="ej. 5"
                min="0"
                max="50"
              />

              <Select
                label="Rango de presupuesto promedio"
                options={BUDGET_RANGES}
                value={formData.averageBudget}
                onChange={(value) => handleInputChange('averageBudget', value as string)}
                required
              />

              <Input
                label="NIT o ID Tributario"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="Para verificación (opcional)"
              />

              <Input
                label="Sitio web"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://tusitio.com"
              />
            </div>

            {/* Tipos de proyectos */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipos de proyectos que manejas <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {PROJECT_TYPES.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={type.value}
                      checked={formData.projectTypes.includes(type.value)}
                      onChange={(e) => {
                        const currentTypes = formData.projectTypes;
                        if (e.target.checked) {
                          handleProjectTypesChange([...currentTypes, type.value]);
                        } else {
                          handleProjectTypesChange(currentTypes.filter(t => t !== type.value));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={type.value} className="text-sm text-gray-700">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.projectTypes && (
                <p className="mt-1 text-sm text-red-600">{errors.projectTypes}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Descripción</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de tu empresa/perfil <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
                placeholder="Describe tu empresa, experiencia, tipos de proyectos, filosofía de trabajo, etc."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociales y Contacto</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="LinkedIn"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/tuperfil"
              />

              <Input
                label="Instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="https://instagram.com/tuempresa"
              />

              <Input
                label="Sitio web adicional"
                value={formData.websiteContact}
                onChange={(e) => handleInputChange('websiteContact', e.target.value)}
                placeholder="https://tuportafolio.com"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex space-x-2">
              {hasChanges && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  disabled={updating}
                >
                  Revertir Cambios
                </Button>
              )}
            </div>
            
            <div className="flex space-x-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={updating}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={updating || !hasChanges}
                className="min-w-32"
              >
                {updating ? 'Guardando...' : hasChanges ? 'Guardar Cambios' : 'Sin Cambios'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};