'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
  onClick,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'primary':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-2.5 py-1.5 text-sm';
      case 'lg':
        return 'px-3 py-2 text-base';
      default:
        return 'px-2.5 py-1.5 text-sm';
    }
  };

  const baseClasses = 'inline-flex items-center font-medium border';
  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  const clickableClasses = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  const allClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${roundedClasses} ${clickableClasses} ${className}`;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={allClasses}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <span className={allClasses}>
      {children}
    </span>
  );
};

// Predefined status badges for common use cases
export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const getStatusProps = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'activo':
      case 'published':
      case 'publicado':
        return { variant: 'success' as const, children: 'Activo' };
      case 'draft':
      case 'borrador':
        return { variant: 'warning' as const, children: 'Borrador' };
      case 'paused':
      case 'pausado':
        return { variant: 'warning' as const, children: 'Pausado' };
      case 'closed':
      case 'cerrado':
      case 'finished':
      case 'finalizado':
        return { variant: 'secondary' as const, children: 'Finalizado' };
      case 'deleted':
      case 'eliminado':
        return { variant: 'error' as const, children: 'Eliminado' };
      default:
        return { variant: 'default' as const, children: status };
    }
  };

  const props = getStatusProps(status);
  
  return (
    <Badge variant={props.variant} className={className}>
      {props.children}
    </Badge>
  );
};

// Job type badges
export const JobTypeBadge: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  const getTypeProps = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time':
      case 'tiempo-completo':
        return { variant: 'primary' as const, children: 'Tiempo Completo' };
      case 'part-time':
      case 'medio-tiempo':
        return { variant: 'info' as const, children: 'Medio Tiempo' };
      case 'contract':
      case 'contrato':
        return { variant: 'warning' as const, children: 'Contrato' };
      case 'freelance':
        return { variant: 'secondary' as const, children: 'Freelance' };
      case 'internship':
      case 'practicas':
        return { variant: 'info' as const, children: 'Prácticas' };
      default:
        return { variant: 'default' as const, children: type };
    }
  };

  const props = getTypeProps(type);
  
  return (
    <Badge variant={props.variant} className={className}>
      {props.children}
    </Badge>
  );
};
