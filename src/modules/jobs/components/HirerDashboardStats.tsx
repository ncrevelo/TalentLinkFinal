'use client';

import React from 'react';
import { useJobStats } from '../hooks/useJobs';
import { Card, CardHeader, CardTitle, CardContent, CircularProgress, Badge, Alert } from '../../../components/ui';
import { JobStatus, Department } from '../types';

interface HirerDashboardStatsProps {
  className?: string;
}

export const HirerDashboardStats: React.FC<HirerDashboardStatsProps> = ({ className = '' }) => {
  const { stats, loading, error } = useJobStats();

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" className={className}>
        Error al cargar las estadísticas: {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert type="info" className={className}>
        No hay datos de estadísticas disponibles.
      </Alert>
    );
  }

  const activeJobsPercentage = stats.totalJobs > 0 ? Math.round((stats.activeJobs / stats.totalJobs) * 100) : 0;
  const avgApplicationsPerJob = Math.round(stats.averageApplicationsPerJob || 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Postulaciones</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Postulaciones Activas</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeJobs}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Aplicaciones</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalApplications}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas este Mes</p>
                <p className="text-3xl font-bold text-orange-600">{stats.jobsFilledThisMonth}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Postulaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <CircularProgress
                value={activeJobsPercentage}
                size={120}
                label="Activas"
                variant="success"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Activas</span>
                <Badge variant="success">{stats.activeJobs}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pausadas</span>
                <Badge variant="warning">{stats.pausedJobs}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completadas</span>
                <Badge variant="secondary">{stats.filledJobs}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expiradas</span>
                <Badge variant="error">{stats.expiredJobs}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Promedio Aplicaciones/Trabajo</span>
                  <span className="text-lg font-semibold text-blue-600">{avgApplicationsPerJob}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((avgApplicationsPerJob / 50) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Objetivo: 50 aplicaciones por trabajo</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Tasa de Finalización</span>
                  <span className="text-lg font-semibold text-green-600">
                    {stats.totalJobs > 0 ? Math.round((stats.filledJobs / stats.totalJobs) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${stats.totalJobs > 0 ? (stats.filledJobs / stats.totalJobs) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Porcentaje de trabajos completados exitosamente</p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen Rápido</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-600">{stats.totalApplications}</div>
                    <div className="text-blue-700">Aplicaciones</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">{stats.jobsFilledThisMonth}</div>
                    <div className="text-green-700">Este Mes</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Departments */}
      {stats.topPerformingDepartments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Departamentos con Mejor Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPerformingDepartments.slice(0, 5).map((dept, index) => (
                <div key={dept.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{dept.department}</h4>
                      <p className="text-sm text-gray-600">
                        {dept.jobCount} trabajos, {dept.applicationCount} aplicaciones
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {dept.jobCount > 0 ? Math.round(dept.applicationCount / dept.jobCount) : 0}
                    </div>
                    <div className="text-sm text-gray-600">aplicaciones/trabajo</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
