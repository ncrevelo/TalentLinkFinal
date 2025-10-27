'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { actorJobService } from '../services';
import { ActorJobFilters, JobApplicationPayload } from '../types';
import { Job } from '@/modules/jobs/types';
import { useAuth } from '@/modules/auth';
import { UserRole } from '@/modules/onboarding/types';

interface UseActorJobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

interface UseActorJobsReturn extends UseActorJobsState {
  filters: ActorJobFilters;
  updateFilters: (filters: ActorJobFilters) => void;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  applying: boolean;
  applicationError: string | null;
  applicationSuccess: boolean;
  applyToJob: (jobId: string, payload: JobApplicationPayload) => Promise<void>;
  resetApplicationState: () => void;
  appliedJobIds: string[];
  refreshAppliedJobs: () => Promise<void>;
}

const defaultState: UseActorJobsState = {
  jobs: [],
  loading: false,
  error: null,
  hasMore: false
};

export const useActorJobs = (initialFilters: ActorJobFilters = {}): UseActorJobsReturn => {
  const { user, userProfile } = useAuth();
  const [state, setState] = useState<UseActorJobsState>(defaultState);
  const [filters, setFilters] = useState<ActorJobFilters>(initialFilters);
  const [applying, setApplying] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const lastVisibleRef = useRef<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);

  const refreshAppliedJobs = useCallback(async () => {
    if (!user?.uid || userProfile?.role !== UserRole.ACTOR) {
      setAppliedJobIds([]);
      return;
    }

    const jobIds = await actorJobService.getActorAppliedJobIds(user.uid);
    setAppliedJobIds(jobIds);
  }, [user?.uid, userProfile?.role]);

  const fetchJobs = useCallback(async (reset = false) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const cursor = reset ? undefined : lastVisibleRef.current;
      if (reset) {
        lastVisibleRef.current = undefined;
      }

      const { jobs, hasMore, lastVisible } = await actorJobService.getActiveJobs(filters, cursor);

      lastVisibleRef.current = lastVisible;

      setState(prev => ({
        jobs: reset ? jobs : [...prev.jobs, ...jobs],
        hasMore,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'No fue posible cargar las ofertas',
        hasMore: false
      }));
    }
  }, [filters]);

  const refetch = useCallback(() => fetchJobs(true), [fetchJobs]);

  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.loading) {
      return;
    }
    await fetchJobs(false);
  }, [fetchJobs, state.hasMore, state.loading]);

  const updateFilters = useCallback((nextFilters: ActorJobFilters) => {
    setFilters(nextFilters);
    lastVisibleRef.current = undefined;
    setState(prev => ({ ...prev, jobs: [], hasMore: false }));
  }, []);

  const applyToJob = useCallback(async (jobId: string, payload: JobApplicationPayload) => {
    if (!userProfile || userProfile.role !== UserRole.ACTOR) {
      setApplicationError('Debes completar tu perfil de actor antes de postularte.');
      return;
    }

    try {
      setApplying(true);
      setApplicationError(null);
      setApplicationSuccess(false);

      await actorJobService.applyToJob(jobId, userProfile, payload);

      setAppliedJobIds((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
      setApplicationSuccess(true);
    } catch (error) {
      setApplicationError(error instanceof Error ? error.message : 'No fue posible completar la postulación.');
    } finally {
      setApplying(false);
    }
  }, [userProfile]);

  const resetApplicationState = useCallback(() => {
    setApplying(false);
    setApplicationError(null);
    setApplicationSuccess(false);
  }, []);

  useEffect(() => {
    fetchJobs(true);
  }, [filters, fetchJobs]);

  useEffect(() => {
    refreshAppliedJobs();
  }, [refreshAppliedJobs]);

  const memoizedState = useMemo(() => ({
    ...state,
    filters,
    updateFilters,
    refetch,
    loadMore,
    applying,
    applicationError,
    applicationSuccess,
    applyToJob,
    resetApplicationState,
    appliedJobIds,
    refreshAppliedJobs
  }), [
    state,
    filters,
    updateFilters,
    refetch,
    loadMore,
    applying,
    applicationError,
    applicationSuccess,
    applyToJob,
    resetApplicationState,
    appliedJobIds,
    refreshAppliedJobs
  ]);

  return memoizedState;
};
