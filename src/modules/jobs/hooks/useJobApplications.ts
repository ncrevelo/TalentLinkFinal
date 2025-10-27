'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApplicationStatus } from '@/modules/actor/types';
import { actorJobService } from '@/modules/actor/services/ActorJobService';
import { useAuth } from '@/modules/auth';
import { HiringStage } from '../types';
import { jobApplicationService, type HirerJobApplication } from '../services/JobApplicationService';

interface UseJobApplicationsState {
  applications: HirerJobApplication[];
  loading: boolean;
  error: string | null;
  actionError: string | null;
}

interface UpdateApplicationOptions {
  notes?: string;
  stage?: HiringStage;
  rejectionReason?: string;
}

interface UseJobApplicationsReturn extends UseJobApplicationsState {
  refresh: () => Promise<void>;
  updateStatus: (applicationId: string, status: ApplicationStatus, options?: UpdateApplicationOptions) => Promise<boolean>;
  rejectApplication: (applicationId: string, reason: string, notes?: string, stage?: HiringStage) => Promise<boolean>;
  sendMessage: (application: HirerJobApplication, body: string, metadata?: Record<string, unknown>) => Promise<boolean>;
  clearActionError: () => void;
}

const initialState: UseJobApplicationsState = {
  applications: [],
  loading: false,
  error: null,
  actionError: null
};

export const useJobApplications = (jobId?: string | null): UseJobApplicationsReturn => {
  const { user } = useAuth();
  const [state, setState] = useState<UseJobApplicationsState>(initialState);

  const fetchApplications = useCallback(async () => {
    if (!jobId) {
      setState((prev) => ({ ...prev, applications: [], loading: false, error: null }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const applications = await jobApplicationService.getJobApplications(jobId);
      setState((prev) => ({ ...prev, applications, loading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'No fue posible cargar las postulaciones.'
      }));
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const refresh = useCallback(async () => {
    await fetchApplications();
  }, [fetchApplications]);

  const updateStatus = useCallback(
    async (applicationId: string, status: ApplicationStatus, options: UpdateApplicationOptions = {}) => {
      if (!jobId) {
        return false;
      }

      setState((prev) => ({ ...prev, actionError: null }));

      try {
        await jobApplicationService.updateApplicationStatus({
          jobId,
          applicationId,
          newStatus: status,
          notes: options.notes,
          stage: options.stage,
          rejectionReason: options.rejectionReason
        });
        await fetchApplications();
        return true;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          actionError: error instanceof Error ? error.message : 'No fue posible actualizar la postulación.'
        }));
        return false;
      }
    },
    [fetchApplications, jobId]
  );

  const rejectApplication = useCallback(
    async (applicationId: string, reason: string, notes?: string, stage?: HiringStage) => {
      if (!jobId) {
        return false;
      }

      setState((prev) => ({ ...prev, actionError: null }));

      try {
        await jobApplicationService.rejectApplication({
          jobId,
          applicationId,
          reason,
          notes,
          stage
        });
        await fetchApplications();
        return true;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          actionError: error instanceof Error ? error.message : 'No fue posible rechazar la postulación.'
        }));
        return false;
      }
    },
    [fetchApplications, jobId]
  );

  const sendMessage = useCallback(
    async (application: HirerJobApplication, body: string, metadata?: Record<string, unknown>) => {
      if (!user?.uid) {
        setState((prev) => ({ ...prev, actionError: 'Usuario no autenticado.' }));
        return false;
      }

      try {
        await actorJobService.sendMessageToActor({
          jobId: application.jobId,
          applicationId: application.id,
          actorId: application.actorId,
          hirerId: user.uid,
          body,
          metadata
        });
        await fetchApplications();
        return true;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          actionError: error instanceof Error ? error.message : 'No fue posible enviar el mensaje.'
        }));
        return false;
      }
    },
    [fetchApplications, user?.uid]
  );

  const clearActionError = useCallback(() => {
    setState((prev) => ({ ...prev, actionError: null }));
  }, []);

  return {
    ...state,
    refresh,
    updateStatus,
    rejectApplication,
    sendMessage,
    clearActionError
  };
};
