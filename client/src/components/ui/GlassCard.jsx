import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * GlassCard — Apple Liquid Glass surface primitive.
 * Multi-layer translucency with edge highlights, specular top border,
 * internal ambient light, and spring-scale touch feedback.
 */
export function GlassCard({ 
  children, 
  className, 
  as: Component = 'div',
  pressable = false,
  onClick,
  radius = '32px',
  blur = '20px',
  ...props 
}) {
  const Wrapper = pressable ? motion.div : Component;

  const baseClasses = cn(
    'relative overflow-hidden',
    'bg-white/[0.04] backdrop-saturate-[180%]',
    'border border-white/[0.08]',
    'shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]',
    className
  );

  const style = {
    borderRadius: radius,
    backdropFilter: `blur(${blur})`,
    WebkitBackdropFilter: `blur(${blur})`,
  };

  if (pressable) {
    return (
      <Wrapper
        className={cn(baseClasses, 'active:scale-[0.98] transition-transform duration-200')}
        style={style}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={onClick}
        {...props}
      >
        {/* Specular top-edge highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        {/* Soft ambient glow */}
        <div className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 bg-gradient-to-br from-blue-400/[0.06] to-transparent rounded-full blur-2xl pointer-events-none" />
        {children}
      </Wrapper>
    );
  }

  return (
    <Component className={baseClasses} style={style} onClick={onClick} {...props}>
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      <div className="absolute -top-1/3 -left-1/4 w-2/3 h-2/3 bg-gradient-to-br from-blue-400/[0.06] to-transparent rounded-full blur-2xl pointer-events-none" />
      {children}
    </Component>
  );
}
