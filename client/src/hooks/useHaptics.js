import { useCallback } from 'react';

export const useHaptics = () => {
  // Check if vibration is supported
  const isSupported = typeof window !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback((pattern) => {
    if (!isSupported) return;
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore errors (e.g., if user hasn't interacted with page yet)
    }
  }, [isSupported]);

  // Very light, barely noticeable tap (good for typing/minor toggles)
  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  
  // Standard UI tap (good for buttons, tabs)
  const mediumTap = useCallback(() => vibrate(25), [vibrate]);
  
  // Heavy tap (good for important actions, destructive actions)
  const heavyTap = useCallback(() => vibrate(50), [vibrate]);
  
  // Success pattern (like iOS double-tap)
  const successTap = useCallback(() => vibrate([30, 60, 40]), [vibrate]);
  
  // Error pattern (three quick pulses)
  const errorTap = useCallback(() => vibrate([40, 50, 40, 50, 60]), [vibrate]);

  return {
    lightTap,
    mediumTap,
    heavyTap,
    successTap,
    errorTap,
    isSupported
  };
};
