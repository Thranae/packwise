import React from 'react';
import { cn } from '@/utils/cn';
import { useHaptics } from '@/hooks/useHaptics';

/**
 * Official Voyage Genie Logo (Suitcase + Location Pin)
 * Minimal, premium, simple outline.
 */
export const LogoIcon = ({ className, size = 'md', isHoverSimulated = false }) => {
  const rawId = React.useId();
  // useId contains colons which can break CSS url() in some browsers, strip them
  const id = rawId.replace(/:/g, '');
  const metallicId = `metallic-${id}`;
  const pinGradId = `pin-grad-${id}`;

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };

  return (
    <div 
      className={cn('group flex items-center gap-3 cursor-pointer', className)}
      onPointerDown={handlePointerDown}
    >
      <LogoIcon size={size} className="text-text-primary" isHoverSimulated={isHoverSimulated} />
      {showText && (
        <span className={cn('font-extrabold tracking-tight text-text-primary transition-all duration-700 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#4F7CFF]', isHoverSimulated && 'text-transparent bg-clip-text bg-gradient-to-r from-white to-[#4F7CFF]', textSizes[size])}>
          Voyage Genie<span className={cn("inline-block transition-transform duration-700 text-[var(--color-accent)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-125", isHoverSimulated && "translate-x-1 -translate-y-1 scale-125")}>.</span>
        </span>
      )}
    </div>
  );
};

/**
 * Circular Suitcase Icon (Used above Auth forms)
 */
export const AuthWelcomeIcon = ({ className }) => (
  <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-full border border-border-subtle bg-bg-surface shadow-sm", className)}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F7CFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="9" width="14" height="11" rx="2" />
      <path d="M9 9V6C9 4.89543 9.89543 4 11 4H13C14.1046 4 15 4.89543 15 6V9" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  </div>
);
