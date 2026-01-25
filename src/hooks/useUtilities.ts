// ============================================================================
// ADDITIONAL UTILITY HOOKS (FIXED & MODERNIZED)
// ============================================================================

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';

// ============================================================================
// useOnClickOutside - Detect clicks outside element
// ============================================================================

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>, // Fixed type to allow null
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// ============================================================================
// useInterval - Declarative setInterval
// ============================================================================

export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// ============================================================================
// useScrollPosition - Track scroll position (Optimized with debounce)
// ============================================================================

export function useScrollPosition(): { scrollX: number; scrollY: number } {
  const [position, setPosition] = useState({ scrollX: 0, scrollY: 0 });

  useEffect(() => {
    let ticking = false;

    const updatePosition = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setPosition({
            scrollX: window.scrollX,
            scrollY: window.scrollY,
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updatePosition, { passive: true });
    updatePosition(); // Initial check

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return position;
}

// ============================================================================
// useHover - Detect element hover state
// ============================================================================

export function useHover<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T | null>,
  boolean
] {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []); // Ref never changes, so empty deps is fine

  return [ref, isHovered];
}

// ============================================================================
// usePrevious - Get previous value of state
// FIXED: React 19 safe (no reading refs during render)
// ============================================================================

export function usePrevious<T>(value: T): T | undefined {
  const [tuple, setTuple] = useState<[T | undefined, T]>([undefined, value]);

  if (tuple[1] !== value) {
    setTuple([tuple[1], value]);
  }

  return tuple[0];
}

// ============================================================================
// useToggle - Boolean state toggle helper
// ============================================================================

export function useToggle(
  initialValue = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  return [value, toggle, setValue];
}

// ============================================================================
// useAsync - Async operation state management
// ============================================================================

export function useAsync<T>(
  asyncFunction: () => Promise<T>
): {
  execute: () => Promise<void>;
  loading: boolean;
  error: Error | null;
  data: T | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  
  // Safe state updates
  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      if (isMounted.current) setData(result);
    } catch (err) {
      if (isMounted.current) setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [asyncFunction]);

  return { execute, loading, error, data };
}

// ============================================================================
// useKeyPress - Detect keyboard key press
// ============================================================================

export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) setKeyPressed(true);
    };

    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) setKeyPressed(false);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

// ============================================================================
// useIsMounted - Check if component is mounted
// ============================================================================

export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

// ============================================================================
// useCopyToClipboard - Copy text to clipboard
// ============================================================================

export function useCopyToClipboard(): [
  string | null,
  (text: string) => Promise<boolean>
] {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
      return true;
    } catch (error) {
      console.warn('Copy failed:', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return [copiedText, copy];
}

// ============================================================================
// useNetworkStatus - Online/offline detection
// FIXED: Uses useSyncExternalStore for strict mode compatibility
// ============================================================================

export function useNetworkStatus(): boolean {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => (typeof navigator !== 'undefined' ? navigator.onLine : true),
    () => true // Assume online during SSR
  );
}