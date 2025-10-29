'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent, Alert } from '@/components/ui';
import {
  ActorProfile,
  ActorCategory,
  ColombiaDepartment,
  ProjectType,
  Language
} from '@/modules/onboarding/types';
import { useProfileUpdate } from '../hooks/useProfile';
import { ActorPortfolioMediaSection, PortfolioPhoto } from './ActorPortfolioMediaSection';
import { ActorCvUploadSection } from './ActorCvUploadSection';

const DEPARTMENTS = Object.values(ColombiaDepartment).map(value => ({
  value,
  label: value
}));

const CATEGORY_OPTIONS = Object.values(ActorCategory).map(value => ({
  value,
  label: value.replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}));

const PROJECT_OPTIONS = Object.values(ProjectType).map(value => ({
  value,
  label: value.replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}));

type ActorProfileFormState = {
  displayName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: ActorProfile['actorData']['gender'];
  nationality: string;
  department: string;
  city: string;
  country: string;
  phone: string;
  height: string;
  weight: string;
  eyeColor: string;
  hairColor: string;
  categories: ActorCategory[];
  yearsOfExperience: string;
  specialSkills: string;
  languages: string;
  reel: string;
  resume: string;
  photos: PortfolioPhoto[];
  isAvailable: boolean;
  preferredProjects: ProjectType[];
  workingRadius: string;
  canTravel: boolean;
  instagram: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  hasAgent: boolean;
  agentContact: string;
};

const toDateValue = (value: unknown): string => {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }

  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as any).toDate === 'function') {
    const asDate = (value as { toDate: () => Date }).toDate();
    return asDate.toISOString().split('T')[0];
  }

  const parsed = new Date(value as string);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return '';
};

const stringifyLanguages = (languages: Language[] = []): string => {
  if (!Array.isArray(languages) || languages.length === 0) {
    return '';
  }

  return languages
    .map(language => `${language.name}${language.level ? ` - ${language.level}` : ''}`)
    .join('\n');
};

const stringifySpecialSkills = (skills: string[] = []): string => {
  if (!skills.length) {
    return '';
  }

  return skills.join('\n');
};

const createInitialState = (profile: ActorProfile): ActorProfileFormState => {
  const { actorData } = profile;

  return {
    displayName: profile.displayName || '',
    firstName: actorData.firstName || '',
    lastName: actorData.lastName || '',
    dateOfBirth: toDateValue(actorData.dateOfBirth),
    gender: actorData.gender,
    nationality: actorData.nationality || '',
    department: actorData.location?.department || '',
    city: actorData.location?.city || '',
    country: actorData.location?.country || 'Colombia',
    phone: actorData.phone || '',
    height: actorData.height ? String(actorData.height) : '',
    weight: actorData.weight ? String(actorData.weight) : '',
    eyeColor: actorData.eyeColor || '',
    hairColor: actorData.hairColor || '',
    categories: actorData.experience?.categories || [],
    yearsOfExperience: actorData.experience?.yearsOfExperience ? String(actorData.experience.yearsOfExperience) : '',
    specialSkills: stringifySpecialSkills(actorData.experience?.specialSkills),
    languages: stringifyLanguages(actorData.experience?.languages),
    reel: actorData.portfolio?.reel || '',
    resume: actorData.portfolio?.resume || '',
    photos: mapExistingPhotos(actorData.portfolio?.photos),
    isAvailable: actorData.availability?.isAvailable ?? true,
    preferredProjects: actorData.availability?.preferredProjects || [],
    workingRadius: actorData.availability?.workingRadius ? String(actorData.availability.workingRadius) : '',
    canTravel: actorData.availability?.canTravel ?? false,
    instagram: actorData.socialMedia?.instagram || '',
    tiktok: actorData.socialMedia?.tiktok || '',
    youtube: actorData.socialMedia?.youtube || '',
    linkedin: actorData.socialMedia?.linkedin || '',
    hasAgent: actorData.hasAgent ?? false,
    agentContact: actorData.agentContact || ''
  };
};

const parseLanguages = (input: string): Language[] => {
  if (!input.trim()) {
    return [];
  }

  const validLevels: Language['level'][] = ['basico', 'intermedio', 'avanzado', 'nativo'];

  return input
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [namePart, levelPart] = line.split('-').map(part => part.trim());
      const name = namePart || '';
      const normalizedLevel = (levelPart || 'intermedio').toLowerCase();
      const level = validLevels.includes(normalizedLevel as Language['level'])
        ? (normalizedLevel as Language['level'])
        : 'intermedio';
      const code = name.slice(0, 2).toLowerCase() || 'es';

      return {
        code,
        name,
        level
      } satisfies Language;
    });
};

const parseList = (input: string): string[] => {
  return input
    .split(/\r?\n|,/)
    .map(item => item.trim())
    .filter(Boolean);
};

const mapExistingPhotos = (photos: string[] = []): PortfolioPhoto[] => {
  return photos
    .map(url => url.trim())
    .filter(Boolean)
    .map(url => ({ url }));
};

const isValidYouTubeUrl = (url: string): boolean => {
  if (!url.trim()) {
    return true;
  }

  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[^\s]+$/i;
  return pattern.test(url.trim());
};

function removeUndefinedValues<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(item => removeUndefinedValues(item)) as unknown as T;
  }

  if (input && typeof input === 'object') {
    if (input instanceof Date) {
      return input;
    }

    const entries = Object.entries(input as Record<string, unknown>)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, removeUndefinedValues(value)] as const);

    return Object.fromEntries(entries) as T;
  }

  return input;
}

const parseNumberField = (value: string, fallback: number): number => {
  if (!value.trim()) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return fallback;
};

interface ActorProfileEditFormProps {
  profile: ActorProfile;
  onSuccess?: (profile: ActorProfile) => void;
  onCancel?: () => void;
}

export const ActorProfileEditForm: React.FC<ActorProfileEditFormProps> = ({
  profile,
  onSuccess,
  onCancel
}) => {
  const { updateProfile, updating, error, success, resetState } = useProfileUpdate();

  const initialState = useMemo(() => createInitialState(profile), [profile]);
  const [formData, setFormData] = useState<ActorProfileFormState>(initialState);
  const [originalData, setOriginalData] = useState<ActorProfileFormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData(initialState);
    setOriginalData(initialState);
    setErrors({});
    resetState();
  }, [initialState, resetState]);

  useEffect(() => {
    const normalize = (data: ActorProfileFormState) => ({
      ...data,
      categories: [...data.categories].sort(),
      preferredProjects: [...data.preferredProjects].sort(),
      photos: [...data.photos.map(photo => photo.url)].sort()
    });

    const originalString = JSON.stringify(normalize(originalData));
    const currentString = JSON.stringify(normalize(formData));

    setHasChanges(originalString !== currentString);
  }, [formData, originalData]);

  useEffect(() => {
    if (success) {
      onSuccess?.(profile);
    }
  }, [success, onSuccess, profile]);

  const handleInputChange = <K extends keyof ActorProfileFormState>(field: K, value: ActorProfileFormState[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field as string]: ''
      }));
    }
  };

  const portfolioErrors = useMemo(() => {
    const result: { photos?: string; reel?: string; resume?: string } = {};
    if (errors.photos) {
      result.photos = errors.photos;
    }
    if (errors.reel) {
      result.reel = errors.reel;
    }
    if (errors.resume) {
      result.resume = errors.resume;
    }
    return Object.keys(result).length ? result : undefined;
  }, [errors.photos, errors.reel, errors.resume]);

  const toggleSelection = <T extends string>(current: T[], value: T): T[] => {
    return current.includes(value) ? current.filter(item => item !== value) : [...current, value];
  };

  const validateForm = (): boolean => {
    const validationErrors: Record<string, string> = {};

    if (!formData.displayName.trim()) {
      validationErrors.displayName = 'El nombre público es requerido';
    }

    if (!formData.firstName.trim()) {
      validationErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      validationErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.department) {
      validationErrors.department = 'El departamento es requerido';
    }

    if (!formData.city.trim()) {
      validationErrors.city = 'La ciudad es requerida';
    }

    if (formData.categories.length === 0) {
      validationErrors.categories = 'Selecciona al menos una categoría';
    }

    if (!formData.preferredProjects.length) {
      validationErrors.preferredProjects = 'Selecciona al menos un tipo de proyecto preferido';
    }

    const workingRadiusValue = Number(formData.workingRadius);
    if (formData.workingRadius && (Number.isNaN(workingRadiusValue) || workingRadiusValue < 0)) {
      validationErrors.workingRadius = 'El radio de trabajo debe ser un número positivo';
    }

    if (formData.yearsOfExperience && Number(formData.yearsOfExperience) < 0) {
      validationErrors.yearsOfExperience = 'Los años de experiencia deben ser un número positivo';
    }

    if (formData.reel && !isValidYouTubeUrl(formData.reel)) {
      validationErrors.reel = 'Ingresa un enlace válido de YouTube.';
    }

    if (formData.photos.length > 5) {
      validationErrors.photos = 'Puedes guardar máximo cinco fotos.';
    }

    const hasEmptyPhoto = formData.photos.some(photo => !photo.url.trim());
    if (hasEmptyPhoto) {
      validationErrors.photos = 'Cada foto debe tener una URL válida.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleReset = () => {
    setFormData(originalData);
    setErrors({});
    resetState();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      onCancel?.();
      return;
    }

    const actorData = profile.actorData;

    const updatedActorData: ActorProfile['actorData'] = {
      ...actorData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : actorData.dateOfBirth,
      gender: formData.gender,
      nationality: formData.nationality.trim() || actorData.nationality,
      location: {
        ...actorData.location,
        department: formData.department,
        city: formData.city.trim(),
        country: formData.country.trim() || actorData.location.country
      },
      phone: formData.phone.trim(),
      height: parseNumberField(formData.height, actorData.height ?? 0),
      weight: parseNumberField(formData.weight, actorData.weight ?? 0),
      eyeColor: formData.eyeColor.trim(),
      hairColor: formData.hairColor.trim(),
      experience: {
        ...actorData.experience,
        yearsOfExperience: parseNumberField(formData.yearsOfExperience, actorData.experience?.yearsOfExperience ?? 0),
        categories: formData.categories,
        specialSkills: parseList(formData.specialSkills),
        languages: parseLanguages(formData.languages)
      },
      portfolio: {
        ...actorData.portfolio,
        reel: formData.reel.trim() || undefined,
        resume: formData.resume.trim() || undefined,
        photos: formData.photos.map(photo => photo.url)
      },
      availability: {
        ...actorData.availability,
        isAvailable: formData.isAvailable,
        preferredProjects: formData.preferredProjects,
        workingRadius: parseNumberField(formData.workingRadius, actorData.availability?.workingRadius ?? 0),
        canTravel: formData.canTravel
      },
      socialMedia: {
        instagram: formData.instagram.trim() || undefined,
        tiktok: formData.tiktok.trim() || undefined,
        youtube: formData.youtube.trim() || undefined,
        linkedin: formData.linkedin.trim() || undefined
      },
      hasAgent: formData.hasAgent,
      agentContact: formData.hasAgent ? (formData.agentContact.trim() || undefined) : undefined
    };

    const sanitizedActorData = removeUndefinedValues(updatedActorData);
    const payload = removeUndefinedValues({
      displayName: formData.displayName.trim(),
      actorData: sanitizedActorData
    });

    try {
      await updateProfile(profile.uid, payload);
    } catch (submitError) {
      console.error('Error updating actor profile:', submitError);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Perfil de Actor</CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Perfil creado: {profile.createdAt.toLocaleDateString('es-CO')} |
            {' '}
            Última actualización: {profile.updatedAt.toLocaleDateString('es-CO')}
          </p>
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
            El perfil se ha actualizado correctamente.
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información básica */}
          <section className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Nombre público"
                value={formData.displayName}
                onChange={event => handleInputChange('displayName', event.target.value)}
                error={errors.displayName}
                required
              />
              <Input
                label="Nombre"
                value={formData.firstName}
                onChange={event => handleInputChange('firstName', event.target.value)}
                error={errors.firstName}
                required
              />
              <Input
                label="Apellido"
                value={formData.lastName}
                onChange={event => handleInputChange('lastName', event.target.value)}
                error={errors.lastName}
                required
              />
              <Input
                label="Teléfono"
                value={formData.phone}
                onChange={event => handleInputChange('phone', event.target.value)}
                error={errors.phone}
                required
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Input
                label="Fecha de nacimiento"
                type="date"
                value={formData.dateOfBirth}
                onChange={event => handleInputChange('dateOfBirth', event.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                <select
                  value={formData.gender}
                  onChange={event => handleInputChange('gender', event.target.value as ActorProfileFormState['gender'])}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
              </div>
              <Input
                label="Nacionalidad"
                value={formData.nationality}
                onChange={event => handleInputChange('nationality', event.target.value)}
                placeholder="Colombiana"
              />
            </div>
          </section>

          {/* Ubicación */}
          <section className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Select
                label="Departamento"
                options={DEPARTMENTS}
                value={formData.department}
                onChange={value => handleInputChange('department', value as string)}
                required
                searchable
                error={errors.department}
              />
              <Input
                label="Ciudad"
                value={formData.city}
                onChange={event => handleInputChange('city', event.target.value)}
                error={errors.city}
                required
              />
              <Input
                label="País"
                value={formData.country}
                onChange={event => handleInputChange('country', event.target.value)}
              />
            </div>
          </section>

          {/* Características físicas */}
          <section className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900">Características Físicas</h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Input
                label="Altura (cm)"
                type="number"
                value={formData.height}
                onChange={event => handleInputChange('height', event.target.value)}
                min="0"
              />
              <Input
                label="Peso (kg)"
                type="number"
                value={formData.weight}
                onChange={event => handleInputChange('weight', event.target.value)}
                min="0"
              />
              <Input
                label="Color de ojos"
                value={formData.eyeColor}
                onChange={event => handleInputChange('eyeColor', event.target.value)}
              />
              <Input
                label="Color de cabello"
                value={formData.hairColor}
                onChange={event => handleInputChange('hairColor', event.target.value)}
              />
            </div>
          </section>

          {/* Experiencia */}
          <section className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900">Experiencia</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Años de experiencia"
                type="number"
                value={formData.yearsOfExperience}
                onChange={event => handleInputChange('yearsOfExperience', event.target.value)}
                min="0"
                error={errors.yearsOfExperience}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorías de actuación <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CATEGORY_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={formData.categories.includes(option.value as ActorCategory)}
                        onChange={() =>
                          handleInputChange(
                            'categories',
                            toggleSelection(formData.categories, option.value as ActorCategory)
                          )
                        }
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.categories && (
                  <p className="mt-2 text-sm text-red-600">{errors.categories}</p>
                )}
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habilidades especiales
                </label>
                <textarea
                  value={formData.specialSkills}
                  onChange={event => handleInputChange('specialSkills', event.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Escribe una habilidad por línea"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idiomas (formato: Español - nativo)
                </label>
                <textarea
                  value={formData.languages}
                  onChange={event => handleInputChange('languages', event.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Un idioma por línea"
                />
              </div>
            </div>
          </section>

          {/* Portafolio */}
          <section className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900">Portafolio</h3>
            <ActorCvUploadSection
              cvUrl={formData.resume}
              onCvChange={url => handleInputChange('resume', url)}
              errors={portfolioErrors}
            />
            <ActorPortfolioMediaSection
              photos={formData.photos}
              onPhotosChange={photos => handleInputChange('photos', photos)}
              youtubeUrl={formData.reel}
              onYoutubeUrlChange={value => handleInputChange('reel', value)}
              errors={portfolioErrors}
            />
          </section>

          {/* Disponibilidad */}
          <section className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900">Disponibilidad</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={event => handleInputChange('isAvailable', event.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                  Estoy disponible actualmente
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="canTravel"
                  checked={formData.canTravel}
                  onChange={event => handleInputChange('canTravel', event.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="canTravel" className="text-sm font-medium text-gray-700">
                  Puedo viajar
                </label>
              </div>
              <Input
                label="Radio de trabajo (km)"
                type="number"
                value={formData.workingRadius}
                onChange={event => handleInputChange('workingRadius', event.target.value)}
                min="0"
                error={errors.workingRadius}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proyectos preferidos <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROJECT_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={formData.preferredProjects.includes(option.value as ProjectType)}
                      onChange={() =>
                        handleInputChange(
                          'preferredProjects',
                          toggleSelection(formData.preferredProjects, option.value as ProjectType)
                        )
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.preferredProjects && (
                <p className="mt-2 text-sm text-red-600">{errors.preferredProjects}</p>
              )}
            </div>
          </section>

          {/* Redes sociales */}
          <section className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900">Redes Sociales</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Instagram"
                value={formData.instagram}
                onChange={event => handleInputChange('instagram', event.target.value)}
                placeholder="https://instagram.com/usuario"
              />
              <Input
                label="TikTok"
                value={formData.tiktok}
                onChange={event => handleInputChange('tiktok', event.target.value)}
                placeholder="https://tiktok.com/@usuario"
              />
              <Input
                label="YouTube"
                value={formData.youtube}
                onChange={event => handleInputChange('youtube', event.target.value)}
                placeholder="https://youtube.com/usuario"
              />
              <Input
                label="LinkedIn"
                value={formData.linkedin}
                onChange={event => handleInputChange('linkedin', event.target.value)}
                placeholder="https://linkedin.com/in/usuario"
              />
            </div>
          </section>

          {/* Representación */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Representación</h3>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasAgent"
                checked={formData.hasAgent}
                onChange={event => handleInputChange('hasAgent', event.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="hasAgent" className="text-sm font-medium text-gray-700">
                Tengo representante o agencia
              </label>
            </div>
            {formData.hasAgent && (
              <Input
                label="Contacto del representante"
                value={formData.agentContact}
                onChange={event => handleInputChange('agentContact', event.target.value)}
                placeholder="Nombre, teléfono o correo"
              />
            )}
          </section>

          {/* Acciones */}
          <div className="flex justify-between items-center pt-6 border-t">
            {hasChanges && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={updating}
              >
                Revertir cambios
              </Button>
            )}

            <div className="ml-auto flex items-center space-x-4">
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
                {updating ? 'Guardando...' : hasChanges ? 'Guardar cambios' : 'Sin cambios'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
