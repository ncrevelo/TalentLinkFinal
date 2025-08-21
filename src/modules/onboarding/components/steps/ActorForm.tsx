'use client';

import { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { ActorProfile, ActorCategory } from '../../types';

interface ActorFormProps {
  onSubmit: (data: ActorProfile['actorData']) => void;
  onBack: () => void;
  loading: boolean;
}

const ActorForm = ({ onSubmit, onBack, loading }: ActorFormProps) => {
  const [formData, setFormData] = useState<Partial<ActorProfile['actorData']>>({
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    gender: 'prefer-not-to-say',
    nationality: '',
    location: {
      city: '',
      state: '',
      country: 'Colombia'
    },
    phone: '',
    height: 0,
    weight: 0,
    eyeColor: '',
    hairColor: '',
    experience: {
      yearsOfExperience: 0,
      categories: [],
      languages: [],
      specialSkills: []
    },
    portfolio: {
      photos: []
    },
    availability: {
      isAvailable: true,
      preferredProjects: [],
      workingRadius: 50,
      canTravel: false
    },
    socialMedia: {
      instagram: '',
      youtube: '',
      tiktok: '',
      linkedin: ''
    },
    hasAgent: false
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

    if (!formData.experience?.categories || formData.experience.categories.length === 0) {
      newErrors['experience.categories'] = 'Selecciona al menos una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData as ActorProfile['actorData']);
  };

  const categories = Object.values(ActorCategory);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Información del Actor
        </h2>
        <p className="text-gray-600">
          Completa tu perfil para que los directores de casting puedan encontrarte
        </p>
      </div>

      {/* Información Personal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Información Personal
        </h3>
        
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

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Fecha de Nacimiento"
            type="date"
            value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ''}
            onChange={(e) => handleInputChange('dateOfBirth', new Date(e.target.value))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              value={formData.gender || 'prefer-not-to-say'}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
              <option value="prefer-not-to-say">Prefiero no decir</option>
            </select>
          </div>
          <Input
            label="Nacionalidad"
            value={formData.nationality || ''}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            placeholder="Ej: Colombiana"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Ciudad *"
            value={formData.location?.city || ''}
            onChange={(e) => handleInputChange('location.city', e.target.value)}
            error={errors['location.city']}
            placeholder="Tu ciudad"
          />
          <Input
            label="Teléfono *"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors['phone']}
            placeholder="Tu número de teléfono"
          />
        </div>
      </div>

      {/* Información Física */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Características Físicas
        </h3>
        
        <div className="grid md:grid-cols-4 gap-4">
          <Input
            label="Altura (cm)"
            type="number"
            value={formData.height || ''}
            onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
            placeholder="175"
          />
          <Input
            label="Peso (kg)"
            type="number"
            value={formData.weight || ''}
            onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
            placeholder="70"
          />
          <Input
            label="Color de Ojos"
            value={formData.eyeColor || ''}
            onChange={(e) => handleInputChange('eyeColor', e.target.value)}
            placeholder="Ej: Café"
          />
          <Input
            label="Color de Cabello"
            value={formData.hairColor || ''}
            onChange={(e) => handleInputChange('hairColor', e.target.value)}
            placeholder="Ej: Negro"
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Categorías de Actuación *
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.experience?.categories?.includes(category) || false}
                onChange={(e) => {
                  const currentCategories = formData.experience?.categories || [];
                  if (e.target.checked) {
                    handleInputChange('experience.categories', [...currentCategories, category]);
                  } else {
                    handleInputChange('experience.categories', currentCategories.filter((c: ActorCategory) => c !== category));
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {category.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
        {errors['experience.categories'] && (
          <p className="text-red-500 text-sm">{errors['experience.categories']}</p>
        )}
      </div>

      {/* Experiencia */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Experiencia
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Años de Experiencia"
            type="number"
            value={formData.experience?.yearsOfExperience || 0}
            onChange={(e) => handleInputChange('experience.yearsOfExperience', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ¿Tienes agente?
            </label>
            <select
              value={formData.hasAgent ? 'yes' : 'no'}
              onChange={(e) => handleInputChange('hasAgent', e.target.value === 'yes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="no">No</option>
              <option value="yes">Sí</option>
            </select>
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Redes Sociales (Opcional)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Instagram"
            value={formData.socialMedia?.instagram || ''}
            onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
            placeholder="@tu_usuario"
          />
          <Input
            label="YouTube"
            value={formData.socialMedia?.youtube || ''}
            onChange={(e) => handleInputChange('socialMedia.youtube', e.target.value)}
            placeholder="Canal de YouTube"
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

export default ActorForm;
