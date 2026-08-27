import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useHaptics } from '@/hooks/useHaptics';

/**
 * GlassButton — Apple Liquid Glass button primitive.
 * Spring scale on press, haptic feedback, edge highlights.
 * 
 * Variants:
 *   primary  — solid white, dark text
 *   secondary — translucent glass, light text
 *   ghost    — transparent, subtle border
 */
export function GlassButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  ...props 
}) {
  const { mediumTap } = useHaptics();

  const handlePress = (e) => {
    if (disabled) return;
    mediumTap();
    onClick?.(e);
  };

  const sizeClasses = {
    sm: 'py-2.5 px-4 text-xs',
    md: 'py-3.5 px-6 text-sm',
    lg: 'py-4 px-8 text-base',
  };

  const variantClasses = {
    primary: 'bg-white text-black font-bold',
    secondary: cn(
      'bg-white/[0.06] backdrop-blur-xl border border-white/10',
      'text-white font-bold',
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
    ),
    ghost: 'bg-transparent border border-white/10 text-white/80 font-semibold',
  };

  return (
    <motion.button
      className={cn(
        'relative flex items-center justify-center rounded-2xl tracking-wide overflow-hidden',
        'transition-colors duration-200',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={handlePress}
      disabled={disabled}
      {...props}
    >
      {/* Specular top highlight for glass variants */}
      {variant !== 'primary' && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      )}
      {children}
    </motion.button>
  );
}
