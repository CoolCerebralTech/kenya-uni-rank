// ============================================================================
// UNIPULSE HOOKS - COMPLETE EXPORT INDEX
// All custom React hooks for the application
// ============================================================================

// Core Application Hooks
export { useFingerprint } from './useFingerprint';
export { useVotingFlow } from './useVotingFlow';
export { useRealtime, useMultipleRealtime } from './useRealtime';

// Storage Hooks
export { 
  useLocalStorage, 
  useSessionStorage 
} from './useLocalStorage';

// Performance Hooks
export { 
  useDebounce, 
  useDebouncedCallback,
  useThrottle 
} from './useDebounce';

// Responsive Hooks
export { 
  useMediaQuery,
  useBreakpoint,
  usePrefersDarkMode,
  usePrefersReducedMotion,
  useIsTouch,
  useWindowSize 
} from './useMediaQuery';

// UI State Hooks
export { 
  useToast,
  toast
} from './useToast';

// Utility Hooks
export {
  useOnClickOutside,
  useInterval,
  useScrollPosition,
  useHover,
  usePrevious,
  useToggle,
  useAsync,
  useKeyPress,
  useIsMounted,
  useCopyToClipboard,
  useNetworkStatus,
} from './useUtilities';