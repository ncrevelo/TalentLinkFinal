'use client';

import { useState, useCallback } from 'react';
import { UserProfileService } from '@/modules/onboarding/services/UserProfileService';
import { HirerProfile } from '@/modules/onboarding/types';
import { useAuth } from '@/modules/auth';

export interface ProfileUpdateRequest {
  displayName?: string;
  hirerData?: Partial<HirerProfile['hirerData']>;
}

export const useProfileUpdate = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { refreshOnboardingStatus } = useAuth();

  const updateProfile = useCallback(async (uid: string, updates: ProfileUpdateRequest) => {
    try {
      setUpdating(true);
      setError(null);
      setSuccess(false);

      await UserProfileService.updateProfile(uid, updates);
      
      // Refresh the auth context to get the updated profile
      await refreshOnboardingStatus();
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [refreshOnboardingStatus]);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    updateProfile,
    updating,
    error,
    success,
    resetState
  };
};

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<HirerProfile | null>(null);

  const getProfile = useCallback(async (uid: string) => {
    try {
      setLoading(true);
      setError(null);

      const userProfile = await UserProfileService.getUserProfile(uid);
      
      if (!userProfile) {
        setError('Perfil no encontrado');
        return;
      }

      setProfile(userProfile as HirerProfile);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getProfile,
    profile,
    loading,
    error
  };
};