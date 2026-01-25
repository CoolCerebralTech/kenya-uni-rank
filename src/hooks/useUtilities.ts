// ============================================================================
// ADDITIONAL UTILITY HOOKS
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// useOnClickOutside - Detect clicks outside element
// ============================================================================

/**
 * Hook to detect clicks outside a ref element
 * Perfect for closing modals and dropdowns
 * 
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useOnClickOutside(ref, () => setIsOpen(false));
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
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

/**
 * Hook for declarative setInterval
 * Automatically cleans up on unmount
 * 
 * @example
 * useInterval(() => {
 *   fetchLatestVotes();
 * }, 5000); // Refresh every 5 seconds
 */
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
// useScrollPosition - Track scroll position
// ============================================================================

/**
 * Hook to track window scroll position
 * 
 * @example
 * const { scrollY } = useScrollPosition();
 * const isScrolled = scrollY > 100;
 */
export function useScrollPosition(): { scrollX: number; scrollY: number } {
  const [position, setPosition] = useState({ scrollX: 0, scrollY: 0 });

  useEffect(() => {
    const updatePosition = () => {
      setPosition({
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      });
    };

    window.addEventListener('scroll', updatePosition, { passive: true });
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return position;
}

// ============================================================================
// useHover - Detect element hover state
// ============================================================================

/**
 * Hook to detect if element is hovered
 * 
 * @example
 * const [hoverRef, isHovered] = useHover<HTMLDivElement>();
 * 
 * <div ref={hoverRef}>
 *   {isHovered ? 'Hovering!' : 'Not hovering'}
 * </div>
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T>,
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
  }, []);

  return [ref, isHovered];
}

// ============================================================================
// usePrevious - Get previous value of state
// ============================================================================

/**
 * Hook to get previous value of a variable
 * Useful for comparing old vs new state
 * 
 * @example
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * 
 * console.log(`Changed from ${prevCount} to ${count}`);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ============================================================================
// useToggle - Boolean state toggle helper
// ============================================================================

/**
 * Hook for boolean toggle state
 * 
 * @example
 * const [isOpen, toggleOpen] = useToggle(false);
 * 
 * <button onClick={toggleOpen}>Toggle</button>
 */
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

/**
 * Hook to manage async operations (loading, error, data)
 * 
 * @example
 * const { execute, loading, error, data } = useAsync(fetchPolls);
 * 
 * useEffect(() => {
 *   execute();
 * }, []);
 */
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

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  return { execute, loading, error, data };
}

// ============================================================================
// useKeyPress - Detect keyboard key press
// ============================================================================

/**
 * Hook to detect specific key press
 * 
 * @example
 * const enterPressed = useKeyPress('Enter');
 * 
 * if (enterPressed) {
 *   submitForm();
 * }
 */
export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
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

/**
 * Hook to check if component is still mounted
 * Prevents state updates on unmounted components
 * 
 * @example
 * const isMounted = useIsMounted();
 * 
 * const fetchData = async () => {
 *   const data = await api.fetch();
 *   if (isMounted()) {
 *     setState(data);
 *   }
 * };
 */
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

/**
 * Hook to copy text to clipboard
 * 
 * @example
 * const [copiedText, copy] = useCopyToClipboard();
 * 
 * <button onClick={() => copy('https://unipulse.ke/results')}>
 *   Copy Link
 * </button>
 */
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
// ============================================================================

/**
 * Hook to detect network status
 * 
 * @example
 * const isOnline = useNetworkStatus();
 * 
 * if (!isOnline) {
 *   return <OfflineMessage />;
 * }
 */
export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}