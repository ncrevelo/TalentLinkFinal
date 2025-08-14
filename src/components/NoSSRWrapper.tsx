'use client';

import React from 'react';
import { ClientOnly } from '../shared/hooks';

interface NoSSRWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const NoSSRWrapper: React.FC<NoSSRWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  return (
    <ClientOnly fallback={fallback}>
      {children}
    </ClientOnly>
  );
};
