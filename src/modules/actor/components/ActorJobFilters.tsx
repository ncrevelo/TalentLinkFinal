'use client';

import React, { useMemo } from 'react';
import { ActorJobFilters } from '../types';
import { Department, ExperienceLevel, JobType, WorkModality } from '@/modules/jobs/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface ActorJobFiltersProps {
  filters: ActorJobFilters;
  onChange: (filters: ActorJobFilters) => void;
  onReset?: () => void;
}

const createOptions = (values: string[], formatter?: (value: string) => string): SelectOption[] =>
  values.map(value => ({
    value,
    label: formatter ? formatter(value) : value
  }));

const humanize = (value: string): string =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

export const ActorJobFiltersForm: React.FC<ActorJobFiltersProps> = ({ filters, onChange, onReset }) => {
  const departmentOptions = useMemo(
    () => createOptions(Object.values(Department)),
    []
  );

  const jobTypeOptions = useMemo(
    () => createOptions(Object.values(JobType), humanize),
    []
  );

  const modalityOptions = useMemo(
    () => createOptions(Object.values(WorkModality), humanize),
    []
  );

  const experienceOptions = useMemo(
    () => createOptions(Object.values(ExperienceLevel), humanize),
    []
  );

  const sortOptions: SelectOption[] = useMemo(
    () => [
      { value: 'recent', label: 'Más recientes' },
      { value: 'deadline', label: 'Próximas a cerrar' },
      { value: 'salary', label: 'Mejor remuneradas' }
    ],
    []
  );

  const handleSelectChange = (field: keyof ActorJobFilters) => (value: string | string[]) => {
    onChange({
      ...filters,
      [field]: value === '' ? undefined : value
    });
  };

  const handleInputChange = (field: keyof ActorJobFilters) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange({
      ...filters,
      [field]: value === '' ? undefined : Number(value)
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      searchTerm: event.target.value
    });
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Filtrar oportunidades</CardTitle>
            <p className="text-sm text-gray-500">Refina los resultados para encontrar el proyecto ideal.</p>
          </div>
          {onReset && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Buscar"
          placeholder="Título, tags o palabras clave"
          value={filters.searchTerm || ''}
          onChange={handleSearchChange}
        />
        <Select
          label="Departamento"
          placeholder="Todos"
          options={departmentOptions}
          value={filters.department || ''}
          onChange={handleSelectChange('department')}
          searchable
        />
        <Select
          label="Tipo de trabajo"
          placeholder="Todos"
          options={jobTypeOptions}
          value={filters.jobType || ''}
          onChange={handleSelectChange('jobType')}
        />
        <Select
          label="Modalidad"
          placeholder="Todas"
          options={modalityOptions}
          value={filters.workModality || ''}
          onChange={handleSelectChange('workModality')}
        />
        <Select
          label="Experiencia"
          placeholder="Todas"
          options={experienceOptions}
          value={filters.experienceLevel || ''}
          onChange={handleSelectChange('experienceLevel')}
        />
        <Input
          label="Salario mínimo"
          type="number"
          min={0}
          value={filters.minSalary?.toString() || ''}
          onChange={handleInputChange('minSalary')}
        />
        <Input
          label="Salario máximo"
          type="number"
          min={0}
          value={filters.maxSalary?.toString() || ''}
          onChange={handleInputChange('maxSalary')}
        />
        <Select
          label="Ordenar por"
          options={sortOptions}
          value={filters.sortBy || 'recent'}
          onChange={handleSelectChange('sortBy')}
        />
      </CardContent>
    </Card>
  );
};
