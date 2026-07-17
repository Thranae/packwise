import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Input = forwardRef(
  (
    { label, error, icon, className, id, ...props },
    ref
  ) => {
    const inputId = id || props.name;

    return (
      <div className="w-full flex flex-col items-start text-left">
        {label && (
          <label htmlFor={inputId} className="mb-2 pl-1 text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative w-full">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-secondary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'glass-input block w-full px-5 py-3.5 text-text-primary placeholder:text-text-secondary/60 outline-none transition-all duration-700',
              icon && 'pl-11',
              error 
                ? 'border-error-500 focus-within:border-error-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.15),0_0_12px_rgba(239,68,68,0.1)]'
                : 'border-transparent focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(79,125,255,0.15),0_0_12px_rgba(79,125,255,0.1)]',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-2 pl-1 text-xs font-medium text-error-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
