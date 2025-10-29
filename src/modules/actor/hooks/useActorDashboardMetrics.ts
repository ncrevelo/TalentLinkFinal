'use client';

import { useCallback, useEffect, useState } from 'react';
import { actorJobService } from '../services';
import { ActorDashboardMetrics } from '../types';
import { useAuth } from '@/modules/auth';
import { UserRole } from '@/modules/onboarding/types';

const defaultMetrics: ActorDashboardMetrics = {
  totalActiveJobs: 0,
  applicationsSubmitted: 0,
  interviewsScheduled: 0,
  offersReceived: 0,
  unreadMessages: 0,
  nextDeadline: null
};

interface UseActorDashboardMetricsState {
  metrics: ActorDashboardMetrics;
  loading: boolean;
  error: string | null;
}

interface UseActorDashboardMetricsReturn extends UseActorDashboardMetricsState {
  refetch: () => Promise<void>;
}

export const useActorDashboardMetrics = (): UseActorDashboardMetricsReturn => {
  const { user, userProfile } = useAuth();
  const [state, setState] = useState<UseActorDashboardMetricsState>({
    metrics: defaultMetrics,
    loading: false,
    error: null
  });

  const fetchMetrics = useCallback(async () => {
    if (!user?.uid || userProfile?.role !== UserRole.ACTOR) {
      setState({ metrics: defaultMetrics, loading: false, error: null });
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const metrics = await actorJobService.getDashboardMetrics(user.uid);
      setState({ metrics, loading: false, error: null });
    } catch (error) {
      setState({
        metrics: defaultMetrics,
        loading: false,
        error: error instanceof Error ? error.message : 'No fue posible cargar las métricas.'
      });
    }
  }, [user?.uid, userProfile?.role]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    ...state,
    refetch: fetchMetrics
  };
};
