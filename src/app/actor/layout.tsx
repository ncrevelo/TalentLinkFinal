'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, Layout } from '@/components/layout';
import { useAuth } from '@/modules/auth';
import { UserRole } from '@/modules/onboarding/types';
import { ROUTES } from '@/shared/constants';

const loadingFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Preparando tu experiencia como talento...</p>
    </div>
  </div>
);

export default function ActorLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading, needsOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace(ROUTES.AUTH.LOGIN);
      return;
    }

    if (needsOnboarding) {
      router.replace('/onboarding');
      return;
    }

    if (userProfile?.role !== UserRole.ACTOR) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, userProfile, loading, needsOnboarding, router]);

  if (loading || needsOnboarding || userProfile?.role !== UserRole.ACTOR) {
    return loadingFallback;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="TalentLink Artistas" />
      <Layout>{children}</Layout>
    </div>
  );
}
