'use client';

import React, { useMemo, useState } from 'react';
import { ApplicationStatus } from '@/modules/actor/types';
import { Button, Badge, Card, CardContent, CardHeader, Modal, ModalBody, ModalFooter, Alert, Select } from '@/components/ui';
import { Job, HIRING_STAGES, HiringStage } from '../types';
import { useJobApplications } from '../hooks';
import type { HirerJobApplication } from '../services/JobApplicationService';
import { UserProfileService } from '@/modules/onboarding/services/UserProfileService';
import {
  ActorProfile,
  ActorCategory,
  ProjectType,
  Language,
  UserRole
} from '@/modules/onboarding/types';

interface JobApplicationsManagerProps {
  job: Job;
  onDataChanged?: () => void;
}

type ApplicationFilter = 'all' | ApplicationStatus;

const statusLabels: Record<ApplicationStatus, { label: string; variant: 'info' | 'success' | 'warning' | 'error' | 'primary' | 'secondary' }> = {
  [ApplicationStatus.APPLIED]: { label: 'Postulado', variant: 'primary' },
  [ApplicationStatus.IN_REVIEW]: { label: 'En revisión', variant: 'info' },
  [ApplicationStatus.INTERVIEW]: { label: 'Entrevista', variant: 'info' },
  [ApplicationStatus.OFFER]: { label: 'Oferta', variant: 'success' },
  [ApplicationStatus.HIRED]: { label: 'Contratado', variant: 'success' },
  [ApplicationStatus.REJECTED]: { label: 'No seleccionado', variant: 'secondary' },
  [ApplicationStatus.WITHDRAWN]: { label: 'Retirada', variant: 'warning' }
};

const statusOptions = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.IN_REVIEW,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.HIRED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN
];

const statusSelectOptions = statusOptions.map((status) => ({
  value: status,
  label: statusLabels[status].label,
  disabled: status === ApplicationStatus.APPLIED || status === ApplicationStatus.WITHDRAWN
}));

const normalizeDate = (value: Date | { toDate: () => Date } | string | number | null | undefined): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }

  if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
    try {
      return (value as { toDate: () => Date }).toDate();
    } catch {
      return null;
    }
  }

  return null;
};

const formatDateTime = (date: Date | { toDate: () => Date } | string | number | null | undefined): string => {
  const normalized = normalizeDate(date);
  if (!normalized) {
    return 'Sin registro';
  }

  return normalized.toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDate = (date: Date | { toDate: () => Date } | string | number | null | undefined): string => {
  const normalized = normalizeDate(date);
  if (!normalized) {
    return 'Sin fecha';
  }
  return normalized.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const categoryLabels: Record<ActorCategory, string> = {
  [ActorCategory.FILM]: 'Cine',
  [ActorCategory.TV]: 'Televisión',
  [ActorCategory.THEATER]: 'Teatro',
  [ActorCategory.COMMERCIAL]: 'Comercial',
  [ActorCategory.VOICE_OVER]: 'Voz en off',
  [ActorCategory.MODEL]: 'Modelo',
  [ActorCategory.DANCER]: 'Bailarín/a',
  [ActorCategory.SINGER]: 'Cantante',
  [ActorCategory.EXTRA]: 'Extra',
  [ActorCategory.STUNT]: 'Doble de acción'
};

const projectTypeLabels: Record<ProjectType, string> = {
  [ProjectType.SHORT_FILM]: 'Cortometraje',
  [ProjectType.FEATURE_FILM]: 'Largometraje',
  [ProjectType.TV_SERIES]: 'Serie de TV',
  [ProjectType.TV_COMMERCIAL]: 'Comercial de TV',
  [ProjectType.MUSIC_VIDEO]: 'Video musical',
  [ProjectType.CORPORATE_VIDEO]: 'Video corporativo',
  [ProjectType.DOCUMENTARY]: 'Documental',
  [ProjectType.THEATER_PLAY]: 'Obra de teatro',
  [ProjectType.PHOTOSHOOT]: 'Sesión fotográfica',
  [ProjectType.LIVE_EVENT]: 'Evento en vivo',
  [ProjectType.STREAMING_CONTENT]: 'Contenido streaming'
};

const languageLevelLabels: Record<Language['level'], string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  nativo: 'Nativo'
};

const toTitleCase = (value: string) => value
  .replace(/[-_]/g, ' ')
  .split(' ')
  .filter(Boolean)
  .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
  .join(' ');

const formatBoolean = (value: boolean | undefined) => (value ? 'Sí' : 'No');

const formatCategoryList = (categories?: ActorCategory[]) => {
  if (!categories?.length) {
    return 'No especificado';
  }
  return categories.map((category) => categoryLabels[category] ?? toTitleCase(category)).join(', ');
};

const formatProjectTypeList = (projects?: ProjectType[]) => {
  if (!projects?.length) {
    return 'No especificado';
  }
  return projects.map((project) => projectTypeLabels[project] ?? toTitleCase(project)).join(', ');
};

const formatLanguagesList = (languages?: Language[]) => {
  if (!languages?.length) {
    return 'No especificado';
  }
  return languages
    .map((language) => `${language.name} (${languageLevelLabels[language.level] ?? toTitleCase(language.level)})`)
    .join(', ');
};

const formatStringList = (items?: string[]) => {
  if (!items || items.length === 0) {
    return 'No especificado';
  }
  return items.join(', ');
};

export const JobApplicationsManager: React.FC<JobApplicationsManagerProps> = ({ job, onDataChanged }) => {
  const {
    applications,
    loading,
    error,
    actionError,
    refresh,
    updateStatus,
    rejectApplication,
    sendMessage,
    clearActionError
  } = useJobApplications(job.id);

  const [activeFilter, setActiveFilter] = useState<ApplicationFilter>('all');
  const [selectedApplication, setSelectedApplication] = useState<HirerJobApplication | null>(null);
  const [messageTarget, setMessageTarget] = useState<HirerJobApplication | null>(null);
  const [messageBody, setMessageBody] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<HirerJobApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [pendingActions, setPendingActions] = useState<Record<string, boolean>>({});
  const [profileModal, setProfileModal] = useState<{
    isOpen: boolean;
    loading: boolean;
    error: string | null;
    profile: ActorProfile | null;
    actorName: string;
    actorId: string | null;
  }>({
    isOpen: false,
    loading: false,
    error: null,
    profile: null,
    actorName: 'Talento',
    actorId: null
  });

  const counts = useMemo(() => {
    const baseCounts: Record<ApplicationFilter, number> & Record<ApplicationStatus, number> = {
      all: applications.length,
      [ApplicationStatus.APPLIED]: 0,
      [ApplicationStatus.IN_REVIEW]: 0,
      [ApplicationStatus.INTERVIEW]: 0,
      [ApplicationStatus.OFFER]: 0,
      [ApplicationStatus.HIRED]: 0,
      [ApplicationStatus.REJECTED]: 0,
      [ApplicationStatus.WITHDRAWN]: 0
    };

    applications.forEach((application) => {
      baseCounts[application.status] = (baseCounts[application.status] || 0) + 1;
    });

    return baseCounts;
  }, [applications]);

  const actorProfileData = profileModal.profile?.actorData;

  const filteredApplications = useMemo(() => {
    if (activeFilter === 'all') {
      return applications;
    }
    return applications.filter((application) => application.status === activeFilter);
  }, [activeFilter, applications]);

  const setPending = (applicationId: string, isPending: boolean) => {
    setPendingActions((prev) => {
      const next = { ...prev };
      if (isPending) {
        next[applicationId] = true;
      } else {
        delete next[applicationId];
      }
      return next;
    });
  };

  const closeProfileModal = () => {
    setProfileModal((prev) => ({
      ...prev,
      isOpen: false,
      loading: false,
      profile: null,
      error: null
    }));
  };

  const openProfileModal = async (application: HirerJobApplication) => {
    const actorName = application.actorSnapshot?.name ?? 'Talento';
    const actorId = application.actorSnapshot?.uid ?? null;

    setProfileModal({
      isOpen: true,
      loading: true,
      error: null,
      profile: null,
      actorName,
      actorId
    });

    if (!actorId) {
      setProfileModal((prev) => ({
        ...prev,
        loading: false,
        error: 'No se encontró el identificador del talento para cargar el perfil completo.'
      }));
      return;
    }

    try {
      const profile = await UserProfileService.getUserProfile(actorId);

      if (!profile) {
        setProfileModal((prev) => ({
          ...prev,
          loading: false,
          error: 'No se encontró el perfil completo del talento en la plataforma.'
        }));
        return;
      }

      if (profile.role !== UserRole.ACTOR) {
        setProfileModal((prev) => ({
          ...prev,
          loading: false,
          error: 'El perfil recuperado no corresponde a un talento.'
        }));
        return;
      }

      setProfileModal((prev) => ({
        ...prev,
        loading: false,
        profile: profile as ActorProfile,
        error: null
      }));
    } catch (profileError: any) {
      setProfileModal((prev) => ({
        ...prev,
        loading: false,
        error: profileError?.message ?? 'Ocurrió un error al cargar el perfil del talento.'
      }));
    }
  };

  const handleStatusChange = async (application: HirerJobApplication, value: string | string[]) => {
    if (Array.isArray(value)) {
      return;
    }

    const nextStatus = value as ApplicationStatus;
    if (nextStatus === application.status) {
      return;
    }

    setPending(application.id, true);
    const updated = await updateStatus(application.id, nextStatus);
    setPending(application.id, false);

    if (updated) {
      onDataChanged?.();
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectionReason.trim()) {
      return;
    }

    setPending(rejectTarget.id, true);
    const updated = await rejectApplication(rejectTarget.id, rejectionReason.trim());
    setPending(rejectTarget.id, false);

    if (updated) {
      setRejectTarget(null);
      setRejectionReason('');
      onDataChanged?.();
    }
  };

  const handleSendMessage = async () => {
    if (!messageTarget || !messageBody.trim()) {
      return;
    }

    setMessageSending(true);
    const sent = await sendMessage(messageTarget, messageBody.trim());
    setMessageSending(false);

    if (sent) {
      setMessageTarget(null);
      setMessageBody('');
    }
  };

  const closeMessageModal = () => {
    setMessageTarget(null);
    setMessageBody('');
  };

  const closeRejectModal = () => {
    setRejectTarget(null);
    setRejectionReason('');
  };

  const currentStageInfo = HIRING_STAGES[job.progress.currentStage ?? HiringStage.RECEIVING_APPLICATIONS];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Postulaciones recibidas</h3>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {currentStageInfo?.label ?? 'Proceso' }
              </Badge>
              <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-800">Postulaciones totales</span>
              <div>{job.progress.applicationsReceived}</div>
            </div>
            <div>
              <span className="font-medium text-gray-800">En revisión</span>
              <div>{job.progress.applicationsReviewed}</div>
            </div>
            <div>
              <span className="font-medium text-gray-800">Entrevistas</span>
              <div>{job.progress.interviewsScheduled}</div>
            </div>
            <div>
              <span className="font-medium text-gray-800">Contratados</span>
              <div>{job.progress.hiredCandidates}</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeFilter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setActiveFilter('all')}
          >
            Todas ({counts.all})
          </Button>
          {statusOptions.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={activeFilter === status ? 'primary' : 'secondary'}
              onClick={() => setActiveFilter(status)}
            >
              {statusLabels[status].label} ({counts[status] || 0})
            </Button>
          ))}
        </div>

        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        {actionError && (
          <Alert type="error">
            <div className="flex items-center justify-between">
              <span>{actionError}</span>
              <Button size="sm" variant="secondary" onClick={clearActionError}>
                Entendido
              </Button>
            </div>
          </Alert>
        )}

        {loading && applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Cargando postulaciones...
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay postulaciones en esta categoría.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const statusInfo = statusLabels[application.status];
              const isPending = !!pendingActions[application.id];
              const actorName = application.actorSnapshot?.name || 'Talento sin nombre';
              const location = application.actorSnapshot?.location;
              const experience = application.actorSnapshot?.experience;

              return (
                <div key={application.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-200 transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">{actorName}</h4>
                        <Badge variant={statusInfo.variant} size="sm">
                          {statusInfo.label}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Aplicó el {formatDate(application.submittedAt)}
                        </span>
                      </div>

                      {location && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Ubicación:</span>{' '}
                          {location.city}, {location.department}
                        </div>
                      )}

                      {experience && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Experiencia:</span>{' '}
                          {experience.yearsOfExperience} años · {experience.categories.length} categorías
                        </div>
                      )}

                      {application.coverLetter && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">Mensaje:</span>{' '}
                          <span className="block text-gray-700 mt-1 whitespace-pre-wrap line-clamp-3">{application.coverLetter}</span>
                        </div>
                      )}

                      {application.rejectionReason && (
                        <div className="text-sm text-red-600">
                          Motivo de rechazo: {application.rejectionReason}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                        <div>
                          <span className="block text-xs uppercase tracking-wide text-gray-500">Última actualización</span>
                          <span className="text-sm text-gray-700">{formatDateTime(application.updatedAt)}</span>
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wide text-gray-500">Último mensaje</span>
                          <span className="text-sm text-gray-700">{formatDateTime(application.lastMessageAt ?? null)}</span>
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wide text-gray-500">Portafolio</span>
                          {application.portfolioLinks.length > 0 ? (
                            <a
                              href={application.portfolioLinks[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Ver enlace
                            </a>
                          ) : (
                            <span className="text-sm text-gray-700">Sin enlaces</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:w-48">
                      <Select
                        options={statusSelectOptions.map((option) => ({
                          ...option,
                          disabled: option.disabled || option.value === application.status
                        }))}
                        value={application.status}
                        onChange={(value) => handleStatusChange(application, value)}
                        disabled={isPending}
                        placeholder="Actualizar estado"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                        }}
                      >
                        Ver detalle
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openProfileModal(application)}
                      >
                        Revisar perfil
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setMessageTarget(application);
                          setMessageBody('');
                        }}
                      >
                        Enviar mensaje
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setRejectTarget(application);
                          setRejectionReason('');
                          clearActionError();
                        }}
                        disabled={isPending}
                      >
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Application detail modal */}
      <Modal
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        title={selectedApplication ? `Detalle de ${selectedApplication.actorSnapshot?.name ?? 'Talento'}` : 'Postulación'}
        size="lg"
      >
        <ModalBody className="space-y-4 max-h-[70vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900">Información general</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-800">Estado actual:</span>{' '}
                    {statusLabels[selectedApplication.status].label}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Última actualización:</span>{' '}
                    {formatDateTime(selectedApplication.updatedAt)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">En proceso desde:</span>{' '}
                    {formatDateTime(selectedApplication.submittedAt)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Proceso actual:</span>{' '}
                    {currentStageInfo?.label}
                  </div>
                </div>
              </div>

              {selectedApplication.coverLetter && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900">Carta de presentación</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-lg p-3">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              )}

              {selectedApplication.portfolioLinks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-semibold text-gray-900">Portafolio</h4>
                  <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                    {selectedApplication.portfolioLinks.map((link, index) => (
                      <li key={index}>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedApplication.timeline.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900">Historial del proceso</h4>
                  <div className="space-y-3 mt-2">
                    {selectedApplication.timeline
                      .slice()
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .map((event) => (
                        <div key={event.id} className="border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{event.title}</span>
                            <span className="text-xs text-gray-500">{formatDateTime(event.createdAt)}</span>
                          </div>
                          {event.description && (
                            <p className="mt-2 text-gray-600">{event.description}</p>
                          )}
                          <div className="mt-2 text-xs text-gray-500">
                            Etapa: {HIRING_STAGES[event.stage]?.label ?? event.stage}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setSelectedApplication(null)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Actor profile modal */}
      <Modal
        isOpen={profileModal.isOpen}
        onClose={closeProfileModal}
        title={`Perfil de ${profileModal.actorName}`}
        size="xl"
      >
        <ModalBody className="space-y-6 max-h-[70vh] overflow-y-auto">
          {profileModal.loading && (
            <div className="text-center py-6 text-gray-500">Cargando perfil completo...</div>
          )}

          {!profileModal.loading && profileModal.error && (
            <Alert type="error">{profileModal.error}</Alert>
          )}

          {!profileModal.loading && !profileModal.error && actorProfileData && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900">Información personal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-800">Nombre de perfil:</span>{' '}
                    {profileModal.profile?.displayName || 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Correo:</span>{' '}
                    {profileModal.profile?.email ?? 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Nombre completo:</span>{' '}
                    {`${actorProfileData.firstName} ${actorProfileData.lastName}`}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Fecha de nacimiento:</span>{' '}
                    {formatDate(actorProfileData.dateOfBirth)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Género:</span>{' '}
                    {toTitleCase(actorProfileData.gender)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Nacionalidad:</span>{' '}
                    {actorProfileData.nationality}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Ubicación:</span>{' '}
                    {`${actorProfileData.location.city}, ${actorProfileData.location.department} (${actorProfileData.location.country})`}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Teléfono:</span>{' '}
                    {actorProfileData.phone}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Perfil completo:</span>{' '}
                    {formatBoolean(profileModal.profile?.isProfileComplete)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Última actualización:</span>{' '}
                    {profileModal.profile?.updatedAt ? formatDateTime(profileModal.profile.updatedAt) : 'Sin registro'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900">Características físicas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-800">Altura:</span>{' '}
                    {`${actorProfileData.height} cm`}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Peso:</span>{' '}
                    {`${actorProfileData.weight} kg`}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Color de ojos:</span>{' '}
                    {actorProfileData.eyeColor}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Color de cabello:</span>{' '}
                    {actorProfileData.hairColor}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900">Experiencia y habilidades</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-800">Años de experiencia:</span>{' '}
                    {actorProfileData.experience.yearsOfExperience}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Categorías:</span>{' '}
                    {formatCategoryList(actorProfileData.experience.categories)}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-800">Idiomas:</span>{' '}
                    {formatLanguagesList(actorProfileData.experience.languages)}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-800">Habilidades especiales:</span>{' '}
                    {formatStringList(actorProfileData.experience.specialSkills)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900">Disponibilidad</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-800">Disponible actualmente:</span>{' '}
                    {formatBoolean(actorProfileData.availability.isAvailable)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Puede viajar:</span>{' '}
                    {formatBoolean(actorProfileData.availability.canTravel)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Radio de trabajo:</span>{' '}
                    {`${actorProfileData.availability.workingRadius} km`}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Proyectos preferidos:</span>{' '}
                    {formatProjectTypeList(actorProfileData.availability.preferredProjects)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900">Representación</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-800">Tiene representante:</span>{' '}
                    {formatBoolean(actorProfileData.hasAgent)}
                  </div>
                  {actorProfileData.hasAgent && actorProfileData.agentContact && (
                    <div>
                      <span className="font-medium text-gray-800">Contacto del representante:</span>{' '}
                      {actorProfileData.agentContact}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900">Portafolio</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-800">Reel:</span>{' '}
                    {actorProfileData.portfolio.reel ? (
                      <a href={actorProfileData.portfolio.reel} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Ver reel
                      </a>
                    ) : (
                      'No especificado'
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Currículum:</span>{' '}
                    {actorProfileData.portfolio.resume ? (
                      <a href={actorProfileData.portfolio.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Ver CV
                      </a>
                    ) : (
                      'No especificado'
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Galería de fotos:</span>
                    {actorProfileData.portfolio.photos?.length ? (
                      <ul className="list-disc list-inside space-y-1 text-blue-600">
                        {actorProfileData.portfolio.photos.map((photoUrl, index) => (
                          <li key={index}>
                            <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {`Foto ${index + 1}`}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="block text-gray-700">No se adjuntaron fotos</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-900">Redes sociales</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-800">Instagram:</span>{' '}
                    {actorProfileData.socialMedia.instagram ? (
                      <a href={actorProfileData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {actorProfileData.socialMedia.instagram}
                      </a>
                    ) : 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">TikTok:</span>{' '}
                    {actorProfileData.socialMedia.tiktok ? (
                      <a href={actorProfileData.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {actorProfileData.socialMedia.tiktok}
                      </a>
                    ) : 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">YouTube:</span>{' '}
                    {actorProfileData.socialMedia.youtube ? (
                      <a href={actorProfileData.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {actorProfileData.socialMedia.youtube}
                      </a>
                    ) : 'No especificado'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">LinkedIn:</span>{' '}
                    {actorProfileData.socialMedia.linkedin ? (
                      <a href={actorProfileData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {actorProfileData.socialMedia.linkedin}
                      </a>
                    ) : 'No especificado'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!profileModal.loading && !profileModal.error && !actorProfileData && (
            <div className="text-center py-6 text-gray-500">
              No se encontraron datos detallados para este talento.
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={closeProfileModal}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Message modal */}
      <Modal
        isOpen={!!messageTarget}
        onClose={closeMessageModal}
        title={messageTarget ? `Mensaje para ${messageTarget.actorSnapshot?.name ?? 'talento'}` : 'Mensaje'}
        size="md"
      >
        <ModalBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              placeholder="Comparte información relevante, coordina entrevistas o brinda retroalimentación."
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={closeMessageModal} disabled={messageSending}>
            Cancelar
          </Button>
          <Button onClick={handleSendMessage} disabled={messageSending || messageBody.trim().length === 0}>
            {messageSending ? 'Enviando...' : 'Enviar mensaje'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Reject modal */}
      <Modal
        isOpen={!!rejectTarget}
        onClose={closeRejectModal}
        title={rejectTarget ? `Rechazar a ${rejectTarget.actorSnapshot?.name ?? 'talento'}` : 'Rechazar postulación'}
        size="sm"
      >
        <ModalBody className="space-y-4">
          <p className="text-sm text-gray-700">
            Explica brevemente el motivo del rechazo para ayudar al talento a comprender el resultado del proceso.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Ej. Perfil no se ajusta a los requisitos del personaje."
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={closeRejectModal}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={!rejectionReason.trim() || (rejectTarget ? pendingActions[rejectTarget.id] : false)}
          >
            {rejectTarget && pendingActions[rejectTarget.id] ? 'Procesando...' : 'Rechazar'}
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};
