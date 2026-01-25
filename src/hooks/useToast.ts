// ============================================================================
// useToast - Toast Notification Manager (FIXED & MODERNIZED)
// Global toast system using useSyncExternalStore (React 18+)
// ============================================================================

import { useSyncExternalStore } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

// --- GLOBAL STATE ENGINE ---

let toastsState: Toast[] = [];
const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach(listener => listener());
};

// 1. Core Remove Function
const dispatchRemoveToast = (id: string) => {
  toastsState = toastsState.filter(t => t.id !== id);
  emitChange();
};

// 2. Core Add Function
const dispatchAddToast = (toast: Omit<Toast, 'id'>): string => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const duration = toast.duration ?? 5000;

  const newToast: Toast = {
    ...toast,
    id,
    duration,
  };

  toastsState = [...toastsState, newToast];
  emitChange();

  // Auto-dismiss logic
  if (duration > 0) {
    setTimeout(() => {
      dispatchRemoveToast(id);
    }, duration);
  }

  return id;
};

// 3. Core Clear Function
const dispatchClearAll = () => {
  toastsState = [];
  emitChange();
};

// --- REACT HOOK ---

/**
 * Hook to consume toast notifications
 * Uses useSyncExternalStore to subscribe to global state without useEffect errors
 */
export function useToast(): ToastContextValue {
  const toasts = useSyncExternalStore(
    // 1. Subscribe method
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    // 2. Get client snapshot
    () => toastsState,
    // 3. Get server snapshot (empty for SSR safety)
    () => []
  );

  return {
    toasts,
    showToast: dispatchAddToast,
    hideToast: dispatchRemoveToast,
    clearAllToasts: dispatchClearAll,
  };
}

// --- UTILITIES ---

/**
 * Convenience functions for common toast types
 */
export const toast = {
  success: (message: string, title?: string, duration = 3000) => {
    return dispatchAddToast({ type: 'success', message, title, duration });
  },

  error: (message: string, title?: string, duration = 5000) => {
    return dispatchAddToast({ type: 'error', message, title, duration });
  },

  warning: (message: string, title?: string, duration = 4000) => {
    return dispatchAddToast({ type: 'warning', message, title, duration });
  },

  info: (message: string, title?: string, duration = 3000) => {
    return dispatchAddToast({ type: 'info', message, title, duration });
  },
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export default useToast;