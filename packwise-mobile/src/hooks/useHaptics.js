import { useCallback } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const useHaptics = () => {
  const isNative = Capacitor.isNativePlatform();
  const isSupported = isNative || (typeof window !== 'undefined' && 'vibrate' in navigator);

  const vibrateFallback = useCallback((pattern) => {
    if (!isSupported || isNative) return;
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore errors
    }
  }, [isSupported, isNative]);

  // Very light, barely noticeable tap (good for typing/minor toggles)
  const lightTap = useCallback(async () => {
    if (isNative) await Haptics.impact({ style: ImpactStyle.Light });
    else vibrateFallback(10);
  }, [isNative, vibrateFallback]);
  
  // Standard UI tap (good for buttons, tabs)
  const mediumTap = useCallback(async () => {
    if (isNative) await Haptics.impact({ style: ImpactStyle.Medium });
    else vibrateFallback(25);
  }, [isNative, vibrateFallback]);
  
  // Heavy tap (good for important actions, destructive actions)
  const heavyTap = useCallback(async () => {
    if (isNative) await Haptics.impact({ style: ImpactStyle.Heavy });
    else vibrateFallback(50);
  }, [isNative, vibrateFallback]);
  
  // Success pattern (like iOS double-tap)
  const successTap = useCallback(async () => {
    if (isNative) await Haptics.notification({ type: NotificationType.Success });
    else vibrateFallback([30, 60, 40]);
  }, [isNative, vibrateFallback]);
  
  // Error pattern (three quick pulses)
  const errorTap = useCallback(async () => {
    if (isNative) await Haptics.notification({ type: NotificationType.Error });
    else vibrateFallback([40, 50, 40, 50, 60]);
  }, [isNative, vibrateFallback]);

  return {
    lightTap,
    mediumTap,
    heavyTap,
    successTap,
    errorTap,
    isSupported
  };
};
