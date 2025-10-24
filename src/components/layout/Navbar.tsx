"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { UserRole } from '../../modules/onboarding/types';
import { Button } from '../ui';
import { ROUTES } from '../../shared/constants';

interface NavbarProps {
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title = 'TalentLink' }) => {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isActor = userProfile?.role === UserRole.ACTOR;
  const isHirer = userProfile?.role === UserRole.HIRER;
  const profileLink = isActor
    ? ROUTES.ACTOR.PROFILE
    : isHirer
    ? ROUTES.HIRER.PROFILE
    : ROUTES.PROFILE;

  const navLinks = useMemo(() => {
    if (!user) {
      return [];
    }

    if (isActor) {
      return [
        { label: 'Inicio', href: ROUTES.ACTOR.DASHBOARD },
        { label: 'Empleos', href: ROUTES.ACTOR.JOBS },
        { label: 'Perfil', href: profileLink }
      ];
    }

    if (isHirer) {
      return [
        { label: 'Dashboard', href: ROUTES.HIRER.DASHBOARD },
        { label: 'Talento', href: ROUTES.TALENT.LIST },
        { label: 'Perfil', href: profileLink }
      ];
    }

    return [
      { label: 'Dashboard', href: ROUTES.DASHBOARD },
      { label: 'Talento', href: ROUTES.TALENT.LIST },
      { label: 'Perfil', href: profileLink }
    ];
  }, [user, isActor, isHirer, profileLink]);

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`);

    if (isActor) {
      return `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        isActive
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
      }`;
    }

    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-gray-700 hover:text-indigo-600'
    }`;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-indigo-600">{title}</h1>
            </div>
          </div>

          {/* Menú de navegación */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={getLinkClasses(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Usuario y acciones */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user.photoURL ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.photoURL}
                        alt={user.displayName || 'Usuario'}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-700 hidden sm:block">
                      {user.displayName || user.email}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Cerrar sesión
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
