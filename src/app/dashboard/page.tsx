'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Navbar, Layout, PageHeader } from '../../components/layout';
import { DashboardStats } from '../../modules/dashboard/components/DashboardStats';
import { ROUTES } from '../../shared/constants';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Layout>
        <PageHeader
          title="Dashboard"
          subtitle="Resumen de la actividad de TalentLink"
        />
        <DashboardStats />
      </Layout>
    </div>
  );
}
