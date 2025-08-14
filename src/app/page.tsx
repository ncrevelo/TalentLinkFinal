'use client';

import { useAuth } from "../modules/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "../shared/constants";
import { ClientOnly } from "../shared/hooks";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push(ROUTES.DASHBOARD);
      } else {
        router.push(ROUTES.AUTH.LOGIN);
      }
    }
  }, [user, loading, router]);

  const LoadingComponent = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando TalentLink...</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <ClientOnly fallback={<LoadingComponent />}>
      <LoadingComponent />
    </ClientOnly>
  );
}
