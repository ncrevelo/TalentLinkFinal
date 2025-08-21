'use client';

import { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { HirerProfile, ProjectType, BudgetRange } from '../../types';

interface HirerFormProps {
  onSubmit: (data: HirerProfile['hirerData']) => void;
  onBack: () => void;
  loading: boolean;
}

const HirerForm = ({ onSubmit, onBack, loading }: HirerFormProps) => {
  const [formData, setFormData] = useState<Partial<HirerProfile['hirerData']>>({
    companyName: '',
    isIndividual: true,
    firstName: '',
    lastName: '',
    phone: '',
    website: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'Colombia',
      postalCode: ''
    },
    industry: '',
    companySize: 'individual',
    yearsInBusiness: 0,
    projectTypes: [],
    averageBudget: BudgetRange.PROJECT_BASED,
    isVerified: false,
    taxId: '',
    description: '',
    socialMedia: {
      linkedin: '',
      website: '',
      instagram: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        const [parent, child] = keys;
        const parentValue = prev[parent as keyof typeof prev];
        return {
          ...prev,
          [parent]: {
            ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
            [child]: value
          }
        };
      }
      return prev;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors['firstName'] = 'El nombre es requerido';
    }

    if (!formData.lastName?.trim()) {
      newErrors['lastName'] = 'El apellido es requerido';
    }

    if (!formData.phone?.trim()) {
      newErrors['phone'] = 'El teléfono es requerido';
    }

    if (!formData.location?.city?.trim()) {
      newErrors['location.city'] = 'La ciudad es requerida';
    }

    if (!formData.industry?.trim()) {
      newErrors['industry'] = 'La industria es requerida';
    }

    if (!formData.description?.trim()) {
      newErrors['description'] = 'La descripción es requerida';
    }

    if (!formData.projectTypes || formData.projectTypes.length === 0) {
      newErrors['projectTypes'] = 'Selecciona al menos un tipo de proyecto';
    }

    if (!formData.isIndividual && !formData.companyName?.trim()) {
      newErrors['companyName'] = 'El nombre de la empresa es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData as HirerProfile['hirerData']);
  };

  const projectTypes = Object.values(ProjectType);
  const budgetRanges = Object.values(BudgetRange);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Información del Contratante
        </h2>
        <p className="text-gray-600">
          Completa tu perfil para poder publicar ofertas y conectar con talentos
        </p>
      </div>

      {/* Tipo de Contratante */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Tipo de Contratante
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="isIndividual"
              checked={formData.isIndividual}
              onChange={() => handleInputChange('isIndividual', true)}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <div className="font-medium">Individual</div>
              <div className="text-sm text-gray-500">Director independiente, freelancer</div>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="isIndividual"
              checked={!formData.isIndividual}
              onChange={() => handleInputChange('isIndividual', false)}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <div className="font-medium">Empresa</div>
              <div className="text-sm text-gray-500">Productora, agencia, empresa</div>
            </div>
          </label>
        </div>
      </div>

      {/* Información Personal/Empresa */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          {formData.isIndividual ? 'Información Personal' : 'Información de la Empresa'}
        </h3>
        
        {!formData.isIndividual && (
          <Input
            label="Nombre de la Empresa *"
            value={formData.companyName || ''}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            error={errors['companyName']}
            placeholder="Nombre de tu empresa"
          />
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            value={formData.firstName || ''}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            error={errors['firstName']}
            placeholder="Tu nombre"
          />
          <Input
            label="Apellido *"
            value={formData.lastName || ''}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            error={errors['lastName']}
            placeholder="Tu apellido"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Teléfono *"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors['phone']}
            placeholder="Tu número de teléfono"
          />
          <Input
            label="Sitio Web"
            value={formData.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://tu-sitio.com"
          />
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Ubicación
        </h3>
        
        <Input
          label="Dirección"
          value={formData.location?.address || ''}
          onChange={(e) => handleInputChange('location.address', e.target.value)}
          placeholder="Dirección completa"
        />

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Ciudad *"
            value={formData.location?.city || ''}
            onChange={(e) => handleInputChange('location.city', e.target.value)}
            error={errors['location.city']}
            placeholder="Tu ciudad"
          />
          <Input
            label="Departamento/Estado"
            value={formData.location?.state || ''}
            onChange={(e) => handleInputChange('location.state', e.target.value)}
            placeholder="Departamento"
          />
          <Input
            label="Código Postal"
            value={formData.location?.postalCode || ''}
            onChange={(e) => handleInputChange('location.postalCode', e.target.value)}
            placeholder="Código postal"
          />
        </div>
      </div>

      {/* Información Profesional */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Información Profesional
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Industria *"
            value={formData.industry || ''}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            error={errors['industry']}
            placeholder="Ej: Entretenimiento, Publicidad"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamaño de la Empresa
            </label>
            <select
              value={formData.companySize || 'individual'}
              onChange={(e) => handleInputChange('companySize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="individual">Individual</option>
              <option value="small">Pequeña (1-10 empleados)</option>
              <option value="medium">Mediana (11-50 empleados)</option>
              <option value="large">Grande (51-200 empleados)</option>
              <option value="enterprise">Empresa (200+ empleados)</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Años en el Negocio"
            type="number"
            value={formData.yearsInBusiness || 0}
            onChange={(e) => handleInputChange('yearsInBusiness', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
          <Input
            label="NIT/Tax ID"
            value={formData.taxId || ''}
            onChange={(e) => handleInputChange('taxId', e.target.value)}
            placeholder="Número de identificación fiscal"
          />
        </div>
      </div>

      {/* Tipos de Proyecto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Tipos de Proyectos *
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {projectTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.projectTypes?.includes(type) || false}
                onChange={(e) => {
                  const currentTypes = formData.projectTypes || [];
                  if (e.target.checked) {
                    handleInputChange('projectTypes', [...currentTypes, type]);
                  } else {
                    handleInputChange('projectTypes', currentTypes.filter(t => t !== type));
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {type.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
        {errors['projectTypes'] && (
          <p className="text-red-500 text-sm">{errors['projectTypes']}</p>
        )}
      </div>

      {/* Presupuesto Promedio */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Rango de Presupuesto Promedio
        </h3>
        <div>
          <select
            value={formData.averageBudget || BudgetRange.PROJECT_BASED}
            onChange={(e) => handleInputChange('averageBudget', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range.replace('_', ' ').charAt(0).toUpperCase() + range.replace('_', ' ').slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Descripción *
        </h3>
        <div>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe tu empresa, experiencia y el tipo de proyectos que manejas..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors['description'] && (
            <p className="text-red-500 text-sm mt-1">{errors['description']}</p>
          )}
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Redes Sociales (Opcional)
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="LinkedIn"
            value={formData.socialMedia?.linkedin || ''}
            onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
            placeholder="Perfil de LinkedIn"
          />
          <Input
            label="Instagram"
            value={formData.socialMedia?.instagram || ''}
            onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
            placeholder="@tu_empresa"
          />
          <Input
            label="Sitio Web Adicional"
            value={formData.socialMedia?.website || ''}
            onChange={(e) => handleInputChange('socialMedia.website', e.target.value)}
            placeholder="https://otro-sitio.com"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
        >
          Atrás
        </Button>
        <Button
          type="submit"
          isLoading={loading}
          disabled={loading}
        >
          Continuar
        </Button>
      </div>
    </form>
  );
};

export default HirerForm;
