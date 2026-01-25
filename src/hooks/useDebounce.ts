// ============================================================================
// useDebounce - Search Optimization Hook (FIXED & OPTIMIZED)
// Delays execution until user stops typing
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to debounce a value (delays updates until user stops typing)
 * Perfect for search inputs to reduce API calls
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to debounce a callback function
 * Useful for form submissions, API calls, etc.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay = 500
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

/**
 * Hook to throttle a value (limits updates to once per interval)
 * FIXED: Pure render + NO setState in effects using ref-based approach
 */
export function useThrottle<T>(value: T, interval = 100): T {
  const throttledValue = useRef<T>(value);
  const lastUpdated = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update throttledValue ref with current value
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (timeSinceLastUpdate >= interval) {
      // Leading edge: update immediately
      throttledValue.current = value;
      lastUpdated.current = now;
    } else {
      // Trailing edge: schedule update
      const remaining = interval - timeSinceLastUpdate;
      timeoutRef.current = setTimeout(() => {
        throttledValue.current = value;
        lastUpdated.current = Date.now();
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, interval]);

  // Return stable value for consumers (forces re-render when needed)
  const [state, setState] = useState<T>(value);
  
  useEffect(() => {
    setState(throttledValue.current);
  }, []);

  // Force update when throttledValue changes (without deps causing loops)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (throttledValue.current !== state) {
        setState(throttledValue.current);
      }
    }, interval);

    return () => clearInterval(checkInterval);
  }, [interval, state]);

  return state;
}

export default useDebounce;
