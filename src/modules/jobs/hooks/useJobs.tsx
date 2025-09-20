import { useState, useEffect, useCallback } from 'react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { jobService } from '../services';
import { Job, JobFilters, JobStats, DeletedJob } from '../types';
import { useAuth } from '@/modules/auth';

interface UseJobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  lastVisible?: QueryDocumentSnapshot<DocumentData>;
}

interface UseJobsReturn extends UseJobsState {
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  updateFilters: (filters: JobFilters) => void;
  filters: JobFilters;
}

export const useJobs = (initialFilters: JobFilters = {}): UseJobsReturn => {
  const { user } = useAuth();
  const [state, setState] = useState<UseJobsState>({
    jobs: [],
    loading: true,
    error: null,
    hasMore: false,
    lastVisible: undefined
  });
  const [filters, setFilters] = useState<JobFilters>(initialFilters);

  const fetchJobs = useCallback(async (reset = false) => {
    if (!user?.uid) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const lastVisible = reset ? undefined : state.lastVisible;
      const result = await jobService.getJobs(user.uid, filters, lastVisible);
      
      setState(prev => ({
        ...prev,
        jobs: reset ? result.jobs : [...prev.jobs, ...result.jobs],
        hasMore: result.hasMore,
        lastVisible: result.lastVisible,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
        loading: false
      }));
    }
  }, [user?.uid, filters, state.lastVisible]);

  const refetch = useCallback(() => fetchJobs(true), [fetchJobs]);
  const loadMore = useCallback(() => fetchJobs(false), [fetchJobs]);

  const updateFilters = useCallback((newFilters: JobFilters) => {
    setFilters(newFilters);
    setState(prev => ({ ...prev, lastVisible: undefined }));
  }, []);

  useEffect(() => {
    if (user?.uid) {
      refetch();
    }
  }, [user?.uid, filters]);

  return {
    ...state,
    refetch,
    loadMore,
    updateFilters,
    filters
  };
};

interface UseJobCreateState {
  creating: boolean;
  error: string | null;
  success: boolean;
}

interface UseJobCreateReturn extends UseJobCreateState {
  createJob: (jobData: any) => Promise<string | null>;
  reset: () => void;
}

export const useJobCreate = (): UseJobCreateReturn => {
  const { user } = useAuth();
  const [state, setState] = useState<UseJobCreateState>({
    creating: false,
    error: null,
    success: false
  });

  const createJob = useCallback(async (jobData: any): Promise<string | null> => {
    if (!user?.uid) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return null;
    }

    try {
      setState(prev => ({ ...prev, creating: true, error: null, success: false }));
      
      const jobId = await jobService.createJob(jobData, user.uid);
      
      setState(prev => ({ ...prev, creating: false, success: true }));
      return jobId;
    } catch (error) {
      setState(prev => ({
        ...prev,
        creating: false,
        error: error instanceof Error ? error.message : 'Failed to create job'
      }));
      return null;
    }
  }, [user?.uid]);

  const reset = useCallback(() => {
    setState({ creating: false, error: null, success: false });
  }, []);

  return { ...state, createJob, reset };
};

interface UseJobUpdateState {
  updating: boolean;
  error: string | null;
  success: boolean;
}

interface UseJobUpdateReturn extends UseJobUpdateState {
  updateJob: (jobId: string, updates: any) => Promise<boolean>;
  updateProgress: (jobId: string, progress: any) => Promise<boolean>;
  toggleStatus: (jobId: string) => Promise<boolean>;
  deleteJob: (jobId: string, reason?: string) => Promise<boolean>;
  reset: () => void;
}

export const useJobUpdate = (): UseJobUpdateReturn => {
  const { user } = useAuth();
  const [state, setState] = useState<UseJobUpdateState>({
    updating: false,
    error: null,
    success: false
  });

  const updateJob = useCallback(async (jobId: string, updates: any): Promise<boolean> => {
    if (!user?.uid) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, updating: true, error: null, success: false }));
      
      await jobService.updateJob(jobId, updates, user.uid);
      
      setState(prev => ({ ...prev, updating: false, success: true }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        updating: false,
        error: error instanceof Error ? error.message : 'Failed to update job'
      }));
      return false;
    }
  }, [user?.uid]);

  const updateProgress = useCallback(async (jobId: string, progress: any): Promise<boolean> => {
    if (!user?.uid) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, updating: true, error: null, success: false }));
      
      await jobService.updateJobProgress(jobId, progress, user.uid);
      
      setState(prev => ({ ...prev, updating: false, success: true }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        updating: false,
        error: error instanceof Error ? error.message : 'Failed to update progress'
      }));
      return false;
    }
  }, [user?.uid]);

  const toggleStatus = useCallback(async (jobId: string): Promise<boolean> => {
    if (!user?.uid) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, updating: true, error: null, success: false }));
      
      await jobService.toggleJobStatus(jobId, user.uid);
      
      setState(prev => ({ ...prev, updating: false, success: true }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        updating: false,
        error: error instanceof Error ? error.message : 'Failed to toggle status'
      }));
      return false;
    }
  }, [user?.uid]);

  const deleteJob = useCallback(async (jobId: string, reason?: string): Promise<boolean> => {
    if (!user?.uid) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, updating: true, error: null, success: false }));
      
      await jobService.deleteJob(jobId, user.uid, reason);
      
      setState(prev => ({ ...prev, updating: false, success: true }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        updating: false,
        error: error instanceof Error ? error.message : 'Failed to delete job'
      }));
      return false;
    }
  }, [user?.uid]);

  const reset = useCallback(() => {
    setState({ updating: false, error: null, success: false });
  }, []);

  return {
    ...state,
    updateJob,
    updateProgress,
    toggleStatus,
    deleteJob,
    reset
  };
};

interface UseJobStatsState {
  stats: JobStats | null;
  loading: boolean;
  error: string | null;
}

interface UseJobStatsReturn extends UseJobStatsState {
  refetch: () => Promise<void>;
}

export const useJobStats = (): UseJobStatsReturn => {
  const { user } = useAuth();
  const [state, setState] = useState<UseJobStatsState>({
    stats: null,
    loading: true,
    error: null
  });

  const fetchStats = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const stats = await jobService.getJobStats(user.uid);
      
      setState(prev => ({ ...prev, stats, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
        loading: false
      }));
    }
  }, [user?.uid]);

  const refetch = useCallback(() => fetchStats(), [fetchStats]);

  useEffect(() => {
    if (user?.uid) {
      fetchStats();
    }
  }, [user?.uid]);

  return { ...state, refetch };
};

interface UseJobState {
  job: Job | null;
  loading: boolean;
  error: string | null;
}

interface UseJobReturn extends UseJobState {
  refetch: () => Promise<void>;
}

export const useJob = (jobId: string): UseJobReturn => {
  const [state, setState] = useState<UseJobState>({
    job: null,
    loading: true,
    error: null
  });

  const fetchJob = useCallback(async () => {
    if (!jobId) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const job = await jobService.getJobById(jobId);
      
      setState(prev => ({ ...prev, job, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch job',
        loading: false
      }));
    }
  }, [jobId]);

  const refetch = useCallback(() => fetchJob(), [fetchJob]);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  return { ...state, refetch };
};

// Alias for useJob for backward compatibility and clarity
export const useJobById = useJob;

interface UseDeletedJobsState {
  deletedJobs: DeletedJob[];
  loading: boolean;
  error: string | null;
}

interface UseDeletedJobsReturn extends UseDeletedJobsState {
  refetch: () => Promise<void>;
}

export const useDeletedJobs = (): UseDeletedJobsReturn => {
  const { user } = useAuth();
  const [state, setState] = useState<UseDeletedJobsState>({
    deletedJobs: [],
    loading: true,
    error: null
  });

  const fetchDeletedJobs = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const deletedJobs = await jobService.getDeletedJobs(user.uid);
      
      setState(prev => ({ ...prev, deletedJobs, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch deleted jobs',
        loading: false
      }));
    }
  }, [user?.uid]);

  const refetch = useCallback(() => fetchDeletedJobs(), [fetchDeletedJobs]);

  useEffect(() => {
    if (user?.uid) {
      fetchDeletedJobs();
    }
  }, [user?.uid]);

  return { ...state, refetch };
};
