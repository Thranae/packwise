import { useEffect } from 'react';

/**
 * Intelligently preloads heavy route chunks in the background 
 * when the user is idle, so navigation feels instantaneous.
 */
export function useRoutePreload(delayMs = 2000) {
  useEffect(() => {
    // Wait until the main thread is idle (or timeout)
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => preloadHeavyRoutes());
      } else {
        preloadHeavyRoutes();
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);
}

function preloadHeavyRoutes() {
  try {
    // Eagerly fetch the OverviewPage (which fetches vendor-3d and vendor-map)
    import('@/pages/overview/OverviewPage');
    // Eagerly fetch the Assistant builder
    import('@/pages/assistant/AssistantPage');
  } catch (err) {
    // Ignore preload errors (e.g. offline)
  }
}
