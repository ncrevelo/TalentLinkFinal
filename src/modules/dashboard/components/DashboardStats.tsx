'use client';

import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Card, CardContent, CardTitle } from '../../../components/ui';
import { formatDateTime } from '../../../shared/utils';

export const DashboardStats: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Candidatos',
      value: '24',
      change: '+2 esta semana',
      changeType: 'positive' as const
    },
    {
      title: 'Procesos Activos',
      value: '8',
      change: '+1 nuevo proceso',
      changeType: 'positive' as const
    },
    {
      title: 'Entrevistas Programadas',
      value: '12',
      change: '3 esta semana',
      changeType: 'neutral' as const
    },
    {
      title: 'Posiciones Abiertas',
      value: '5',
      change: '-1 posición cerrada',
      changeType: 'negative' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <Card>
        <CardContent>
          <div className="flex items-center space-x-4">
            {user?.photoURL ? (
              <img
                className="h-16 w-16 rounded-full"
                src={user.photoURL}
                alt={user.displayName || 'Usuario'}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-xl font-medium text-white">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                ¡Bienvenido, {user?.displayName || user?.email}!
              </h2>
              <p className="text-gray-600">
                Último acceso: {user?.metadata.lastSignInTime ? formatDateTime(user.metadata.lastSignInTime) : 'Primer acceso'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 truncate">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
