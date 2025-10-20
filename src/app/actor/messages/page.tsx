'use client';

import React from 'react';
import { ActorMessageCenter } from '@/modules/actor/components';

export default function ActorMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
        <p className="text-sm text-gray-600">Revisa las comunicaciones que recibes de los contratantes.</p>
      </div>
      <ActorMessageCenter />
    </div>
  );
}
