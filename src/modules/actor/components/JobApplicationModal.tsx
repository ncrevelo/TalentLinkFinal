'use client';

import React, { useEffect, useState } from 'react';
import { Job } from '@/modules/jobs/types';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { JobApplicationPayload } from '../types';

interface JobApplicationModalProps {
  job?: Job;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: JobApplicationPayload) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
  success?: boolean;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  success
}) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioLinks, setPortfolioLinks] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCoverLetter('');
      setPortfolioLinks('');
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload: JobApplicationPayload = {
      coverLetter: coverLetter.trim() || undefined,
      portfolioLinks: portfolioLinks
        .split(/\n|,/)
        .map(link => link.trim())
        .filter(Boolean)
    };

    await onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={job ? `Postularme a ${job.title}` : 'Postularme'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carta de presentación (opcional)
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={6}
              placeholder="Comparte por qué eres ideal para este proyecto, menciona tu experiencia y disponibilidad."
              value={coverLetter}
              onChange={event => setCoverLetter(event.target.value)}
            />
            <p className="mt-2 text-xs text-gray-500">Resalta tus logros recientes, habilidades clave o enlaces a material audiovisual.</p>
          </div>
          <Input
            label="Portafolio o enlaces a reels (separados por coma o salto de línea)"
            placeholder="https://..."
            value={portfolioLinks}
            onChange={event => setPortfolioLinks(event.target.value)}
          />
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              Tu postulación fue enviada correctamente.
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Enviar postulación
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
