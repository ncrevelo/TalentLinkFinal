'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '../../../shared/config/firebase';
import { AuthService } from '../services/AuthService';
import { UserProfileService } from '../../onboarding/services/UserProfileService';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkOnboardingStatus = async (user: User) => {
    try {
      const needsOnboardingCheck = await UserProfileService.needsOnboarding(user.uid);
      setNeedsOnboarding(needsOnboardingCheck);
      return !needsOnboardingCheck; // Return true if profile is complete
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setNeedsOnboarding(true);
      return false;
    }
  };

  const refreshOnboardingStatus = async () => {
    if (user) {
      await checkOnboardingStatus(user);
    }
  };

  useEffect(() => {
    // Solo inicializar en el cliente
    if (typeof window === 'undefined') {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await checkOnboardingStatus(user);
      } else {
        setNeedsOnboarding(false);
      }
      
      setLoading(false);
      setInitialized(true);
    });

    return unsubscribe;
  }, []);

  // Redirección automática para onboarding
  useEffect(() => {
    if (!loading && initialized && user) {
      if (needsOnboarding) {
        // Solo redirigir si no está ya en la página de onboarding
        if (pathname !== '/onboarding') {
          router.push('/onboarding');
        }
      } else {
        // Si el perfil está completo y está en onboarding, redirigir al dashboard
        if (pathname === '/onboarding') {
          router.push('/dashboard');
        }
      }
    }
  }, [user, needsOnboarding, loading, initialized, pathname, router]);

  // Si estamos en el servidor, renderizar inmediatamente
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    await AuthService.signInWithEmail(email, password);
  };

  const signUp = async (email: string, password: string) => {
    await AuthService.signUpWithEmail(email, password);
  };

  const signInWithGoogle = async () => {
    await AuthService.signInWithGoogle();
  };

  const signOut = async () => {
    await AuthService.signOut();
  };

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  const value = {
    user,
    loading: loading || !initialized,
    needsOnboarding,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshOnboardingStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
