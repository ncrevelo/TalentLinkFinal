'use client';

import React from 'react';
import { useActorMessages } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ActorMessageCenter: React.FC = () => {
  const { messages, loading, error, unreadCount, markAsRead } = useActorMessages();

  if (loading && messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          Cargando mensajes...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>Centro de mensajes</CardTitle>
          <p className="text-sm text-gray-500">Mensajes enviados por contratantes sobre tus postulaciones.</p>
        </div>
        <div className="text-sm text-indigo-600 font-medium">
          {unreadCount} mensajes sin leer
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {messages.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 py-8">
            Aún no tienes mensajes. Los contratantes pueden contactarte una vez revisen tu postulación.
          </div>
        )}

        {messages.map(message => {
          const jobTitle = message.job?.title ?? 'Oferta no disponible';
          const jobDepartment = message.job?.department ?? 'Departamento no disponible';
          const jobModality = message.job?.workModality
            ? message.job.workModality === 'remote'
              ? 'Remoto'
              : message.job.workModality === 'on_site'
              ? 'Presencial'
              : 'Híbrido'
            : 'Modalidad no disponible';

          return (
            <div
              key={message.id}
              className={`border rounded-lg px-4 py-3 ${message.readAt ? 'bg-white border-gray-200' : 'bg-indigo-50 border-indigo-200'}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {jobTitle}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {jobDepartment} • {jobModality}
                  </p>
                </div>
              {!message.readAt && (
                <Button size="sm" variant="outline" onClick={() => markAsRead(message.id)}>
                  Marcar como leído
                </Button>
              )}
            </div>
            <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">{message.body}</p>
            <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-2">
              <span>Enviado el {message.createdAt.toLocaleString()}</span>
              {message.readAt && <span>• Leído el {message.readAt.toLocaleString()}</span>}
            </div>
          </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
