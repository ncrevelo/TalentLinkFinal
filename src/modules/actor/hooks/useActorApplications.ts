'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { actorJobService } from '../services';
import { ApplicationStatus, JobApplication } from '../types';
import { HiringStage } from '@/modules/jobs/types';
import { useAuth } from '@/modules/auth';
import { UserRole } from '@/modules/onboarding/types';

interface UseActorApplicationsState {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
}

interface UseActorApplicationsReturn extends UseActorApplicationsState {
  refetch: () => Promise<void>;
  groupedByStatus: Record<ApplicationStatus, JobApplication[]>;
  upcomingInterviews: JobApplication[];
}

const defaultState: UseActorApplicationsState = {
  applications: [],
  loading: false,
  error: null
};

export const useActorApplications = (): UseActorApplicationsReturn => {
  const { user, userProfile } = useAuth();
  const [state, setState] = useState<UseActorApplicationsState>(defaultState);

  const fetchApplications = useCallback(async () => {
    if (!user?.uid || userProfile?.role !== UserRole.ACTOR) {
      setState(defaultState);
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const applications = await actorJobService.getApplications(user.uid);
      setState({ applications, loading: false, error: null });
    } catch (error) {
      setState({
        applications: [],
        loading: false,
        error: error instanceof Error ? error.message : 'No fue posible cargar tus postulaciones.'
      });
    }
  }, [user?.uid, userProfile?.role]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const groupedByStatus = useMemo(() => {
    return state.applications.reduce<Record<ApplicationStatus, JobApplication[]>>((acc, application) => {
      const bucket = application.status ?? ApplicationStatus.APPLIED;
      if (!acc[bucket]) {
        acc[bucket] = [];
      }
      acc[bucket].push(application);
      return acc;
    }, {
      [ApplicationStatus.APPLIED]: [],
      [ApplicationStatus.IN_REVIEW]: [],
      [ApplicationStatus.INTERVIEW]: [],
      [ApplicationStatus.OFFER]: [],
      [ApplicationStatus.HIRED]: [],
      [ApplicationStatus.REJECTED]: [],
      [ApplicationStatus.WITHDRAWN]: []
    });
  }, [state.applications]);

  const upcomingInterviews = useMemo(() => {
    return state.applications
      .filter(application => application.currentStage === HiringStage.INTERVIEWS || application.status === ApplicationStatus.INTERVIEW)
      .sort((a, b) => (a.updatedAt?.getTime() ?? 0) - (b.updatedAt?.getTime() ?? 0));
  }, [state.applications]);

  return {
    ...state,
    refetch: fetchApplications,
    groupedByStatus,
    upcomingInterviews
  };
};
