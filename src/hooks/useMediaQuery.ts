// ============================================================================
// useMediaQuery - Responsive Helper Hook (FIXED & MODERNIZED)
// Detects screen size and device type for responsive UI
// Uses useSyncExternalStore for React 18+ performance & SSR safety
// ============================================================================

import { useState, useEffect, useSyncExternalStore, useCallback } from 'react';

/**
 * Hook to detect if a media query matches
 * Returns true/false based on current screen size
 * 
 * @param query - CSS media query string
 */
export function useMediaQuery(query: string): boolean {
  // 1. Define how to subscribe to external changes
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);
      
      // Modern browsers
      if (matchMedia.addEventListener) {
        matchMedia.addEventListener('change', callback);
        return () => matchMedia.removeEventListener('change', callback);
      }
      // Legacy fallback
      else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (matchMedia as any).addListener(callback);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return () => (matchMedia as any).removeListener(callback);
      }
    },
    [query]
  );

  // 2. Get current value on client
  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  // 3. Get server-side value (hydration safe)
  const getServerSnapshot = () => {
    return false;
  };

  // useSyncExternalStore handles the React lifecycle perfectly without useEffect errors
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Hook to get current breakpoint (mobile, tablet, desktop)
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' | 'wide' {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
  const isWide = useMediaQuery('(min-width: 1280px)');

  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  if (isDesktop) return 'desktop';
  if (isWide) return 'wide';
  
  return 'desktop'; // Fallback
}

/**
 * Hook to detect if user prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook to detect touch device
 * Fixed: logic moved to initializer to avoid setState in effect
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  useEffect(() => {
    // We only need to listen for the event to catch edge cases
    // where touch capability might be attached later (rare, but possible)
    const handleTouch = () => setIsTouch(true);
    
    window.addEventListener('touchstart', handleTouch, { once: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  return isTouch;
}

/**
 * Hook to get window dimensions
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default useMediaQuery;