import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Spinner } from './Spinner';

export const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-medium outline-none transition-colors duration-700 disabled:opacity-50 disabled:pointer-events-none overflow-hidden';
    
    // Premium SaaS styles with pill shape and soft glowing shadows
    const variants = {
      primary: 'bg-[#4F7CFF] text-white hover:bg-[#74A6FF] shadow-[0_4px_16px_rgba(79,124,255,0.25)] hover:shadow-[0_8px_24px_rgba(79,124,255,0.4)] border border-[#4F7CFF]/50',
      secondary: 'glass-panel text-white hover:bg-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-white/20 hover:border-white/30',
      outline: 'border border-white/20 text-white hover:bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]',
      ghost: 'text-white/70 hover:text-white hover:bg-white/5',
      danger: 'bg-error-500 text-white hover:bg-error-500/90 shadow-[0_4px_16px_rgba(239,68,68,0.25)] border border-error-500/50',
    };

    // Rounded-full (pill) for all sizes
    const sizes = {
      sm: 'px-5 py-2 text-sm rounded-full',
      md: 'px-7 py-3 text-sm rounded-full',
      lg: 'px-9 py-4 text-base rounded-full',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02, y: disabled || isLoading ? 0 : -2 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="mr-2 border-current" />}
        {!isLoading && icon && <span className="mr-2 flex items-center">{icon}</span>}
        <span className="relative z-10 font-semibold tracking-wide">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
