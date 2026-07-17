import React from 'react';
import { cn } from '@/utils/cn';

export const Spinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary-500 border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
};

export const FullPageSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-950">
    <Spinner size="lg" />
  </div>
);
