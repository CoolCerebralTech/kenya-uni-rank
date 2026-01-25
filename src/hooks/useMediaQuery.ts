// ============================================================================
// useMediaQuery - Responsive Helper Hook
// Detects screen size and device type for responsive UI
// ============================================================================

import { useState, useEffect } from 'react';

/**
 * Hook to detect if a media query matches
 * Returns true/false based on current screen size
 * 
 * @param query - CSS media query string
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)');
 * 
 * if (isMobile) {
 *   return <MobileNav />;
 * }
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Update on change
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } 
    // Legacy browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

/**
 * Hook to get current breakpoint (mobile, tablet, desktop)
 * 
 * @example
 * const breakpoint = useBreakpoint();
 * 
 * if (breakpoint === 'mobile') {
 *   return <MobileLayout />;
 * }
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
 * 
 * @example
 * const prefersDark = usePrefersDarkMode();
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Hook to detect if user prefers reduced motion
 * Important for accessibility (disable animations)
 * 
 * @example
 * const prefersReducedMotion = usePrefersReducedMotion();
 * 
 * if (prefersReducedMotion) {
 *   return <StaticChart />;
 * }
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook to detect touch device
 * 
 * @example
 * const isTouch = useIsTouch();
 * 
 * if (isTouch) {
 *   return <TouchOptimizedNav />;
 * }
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });

    return () => {
      window.removeEventListener('touchstart', checkTouch);
    };
  }, []);

  return isTouch;
}

/**
 * Hook to get window dimensions
 * 
 * @example
 * const { width, height } = useWindowSize();
 * 
 * if (width < 768) {
 *   return <MobileView />;
 * }
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

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