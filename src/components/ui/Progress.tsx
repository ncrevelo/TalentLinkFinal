'use client';

import React from 'react';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  className = '',
  animated = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'md':
        return 'h-3';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-600';
      case 'info':
        return 'bg-blue-600';
      default:
        return 'bg-blue-600';
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();
  const animatedClasses = animated ? 'transition-all duration-300 ease-in-out' : '';

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Progreso'}
          </span>
          {showLabel && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses}`}>
        <div
          className={`h-full ${variantClasses} ${animatedClasses} rounded-full`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

// Circular progress component
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return '#10b981'; // green-500
      case 'warning':
        return '#f59e0b'; // yellow-500
      case 'error':
        return '#ef4444'; // red-500
      case 'info':
        return '#3b82f6'; // blue-500
      default:
        return '#3b82f6'; // blue-500
    }
  };

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb" // gray-200
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getVariantColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {showLabel && (
            <div className="text-2xl font-semibold text-gray-700">
              {Math.round(percentage)}%
            </div>
          )}
          {label && (
            <div className="text-sm text-gray-500 mt-1">
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Step progress for multi-step processes
export interface StepProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  className = '',
  variant = 'default',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return {
          active: 'bg-green-600 border-green-600',
          completed: 'bg-green-600 border-green-600',
          line: 'bg-green-600'
        };
      case 'warning':
        return {
          active: 'bg-yellow-500 border-yellow-500',
          completed: 'bg-yellow-500 border-yellow-500',
          line: 'bg-yellow-500'
        };
      case 'error':
        return {
          active: 'bg-red-600 border-red-600',
          completed: 'bg-red-600 border-red-600',
          line: 'bg-red-600'
        };
      default:
        return {
          active: 'bg-blue-600 border-blue-600',
          completed: 'bg-blue-600 border-blue-600',
          line: 'bg-blue-600'
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium
                  ${index < currentStep 
                    ? `${variantClasses.completed} text-white`
                    : index === currentStep
                    ? `${variantClasses.active} text-white`
                    : 'bg-white border-gray-300 text-gray-500'
                  }
                `}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-xs text-center text-gray-600 max-w-20">
                {step}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-4 mb-6
                  ${index < currentStep ? variantClasses.line : 'bg-gray-300'}
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
