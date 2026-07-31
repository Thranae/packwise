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

  const suitcaseGlowId = `suitcase-glow-${id}`;
  const pinGlowId = `pin-glow-${id}`;

  return (
    <svg 
      viewBox="-8 -8 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn('shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[8deg] group-hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]', isHoverSimulated && 'rotate-[8deg] scale-110', sizes[size], className)}
    >
      <defs>
        <linearGradient id={metallicId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id={pinGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Subtle feathered white glow for suitcase */}
        <filter id={suitcaseGlowId} x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feFlood floodColor="#ffffff" floodOpacity="0.35" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle feathered sky blue glow for map pin */}
        <filter id={pinGlowId} x="-80%" y="-80%" width="260%" height="260%" filterUnits="objectBoundingBox">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feFlood floodColor="#7dd3fc" floodOpacity="0.5" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Suitcase Group — SVG filter glow on animation */}
      <g filter={isHoverSimulated ? `url(#${suitcaseGlowId})` : undefined}>
        {/* Telescopic Handle Poles (Animate up on hover) */}
        <path d="M18 12V6 M30 12V6" stroke={`url(#${metallicId})`} strokeWidth="2.5" strokeLinecap="round" className={cn("transition-transform duration-700 group-hover:-translate-y-1", isHoverSimulated && "-translate-y-1")} />
        
        {/* Handle Grip (Animate up on hover) */}
        <path d="M15 6H33" stroke={`url(#${metallicId})`} strokeWidth="3.5" strokeLinecap="round" className={cn("transition-transform duration-700 group-hover:-translate-y-1", isHoverSimulated && "-translate-y-1")} />
        
        {/* Suitcase Body */}
        <rect x="10" y="12" width="28" height="30" rx="4" stroke={`url(#${metallicId})`} strokeWidth="3" strokeLinejoin="round" />
        
        {/* Vertical Ribs (Rimowa style) */}
        <path d="M16 18V36 M32 18V36" stroke={`url(#${metallicId})`} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        {/* Wheels */}
        <circle cx="15" cy="44" r="2" fill={`url(#${metallicId})`} />
        <circle cx="33" cy="44" r="2" fill={`url(#${metallicId})`} />
      </g>

      {/* Location Pin — SVG filter blue glow on animation */}
      <g 
        className={cn("transition-transform duration-700 delay-75 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom group-hover:-translate-y-3", isHoverSimulated && "-translate-y-3")}
        filter={isHoverSimulated ? `url(#${pinGlowId})` : undefined}
      >
        <path d="M24 16C27.3137 16 30 18.6863 30 22C30 26 24 32 24 32C24 32 18 26 18 22C18 18.6863 20.6863 16 24 16Z" fill={`url(#${pinGradId})`} className="transition-all duration-700" />
        <circle cx="24" cy="22" r="2.5" fill="white" />
      </g>
    </svg>
  );
};

export function useLogoDoubleTap(onClick) {
  const [isHoverSimulated, setIsHoverSimulated] = React.useState(false);
  const { mediumTap } = useHaptics();
  const lastTapRef = React.useRef(0);
  const clickTimeoutRef = React.useRef(null);
  const hoverTimeoutRef = React.useRef(null);

  const handlePointerDown = (e) => {
    // Only handle primary touches/clicks
    if (e.button !== undefined && e.button !== 0) return;
    
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap detected — simulate hover state
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      lastTapRef.current = 0;
      
      mediumTap();
      setIsHoverSimulated(true);
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHoverSimulated(false);
      }, 900);
    } else {
      // Single Tap candidate
      lastTapRef.current = now;
      if (onClick) {
        clickTimeoutRef.current = setTimeout(() => {
          onClick(e);
        }, DOUBLE_TAP_DELAY);
      }
    }
  };

  return { isHoverSimulated, handlePointerDown };
}

export const Logo = ({ size = 'md', className, showText = true, onClick }) => {
  const { isHoverSimulated, handlePointerDown } = useLogoDoubleTap(onClick);

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
