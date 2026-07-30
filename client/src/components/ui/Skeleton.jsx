import React from 'react';
import { cn } from '@/utils/cn';

/**
 * A beautiful, glassmorphic shimmering skeleton component for PWA loading states.
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/5",
        "relative overflow-hidden before:absolute before:inset-0",
        "before:-translate-x-full before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}
