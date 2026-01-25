// ============================================================================
// useToast - Toast Notification Manager
// Global toast system for success/error/info messages
// ============================================================================

import { useState, useCallback, useEffect } from 'react';

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

// Global toast state (shared across all components)
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toastsState: Toast[] = [];

const notifyListeners = () => {
  toastListeners.forEach(listener => listener(toastsState));
};

/**
 * Hook to manage toast notifications
 * Use this in any component to show toasts
 * 
 * @example
 * const { showToast } = useToast();
 * 
 * showToast({
 *   type: 'success',
 *   message: 'Vote submitted successfully!',
 *   duration: 3000,
 * });
 */
export function useToast(): ToastContextValue {
  const [toasts, setToasts] = useState<Toast[]>(toastsState);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToasts(newToasts);
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duration = toast.duration || 5000;

    const newToast: Toast = {
      ...toast,
      id,
      duration,
    };

    toastsState = [...toastsState, newToast];
    notifyListeners();

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    toastsState = toastsState.filter(t => t.id !== id);
    notifyListeners();
  }, []);

  const clearAllToasts = useCallback(() => {
    toastsState = [];
    notifyListeners();
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
  };
}

/**
 * Convenience functions for common toast types
 */
export const toast = {
  success: (message: string, title?: string, duration = 3000) => {
    const { showToast } = useToast();
    return showToast({ type: 'success', message, title, duration });
  },

  error: (message: string, title?: string, duration = 5000) => {
    const { showToast } = useToast();
    return showToast({ type: 'error', message, title, duration });
  },

  warning: (message: string, title?: string, duration = 4000) => {
    const { showToast } = useToast();
    return showToast({ type: 'warning', message, title, duration });
  },

  info: (message: string, title?: string, duration = 3000) => {
    const { showToast } = useToast();
    return showToast({ type: 'info', message, title, duration });
  },
};

/**
 * Shorthand toast functions (use outside React components)
 */
export const showSuccessToast = (message: string) => {
  const id = `toast-${Date.now()}`;
  const newToast: Toast = {
    id,
    type: 'success',
    message,
    duration: 3000,
  };

  toastsState = [...toastsState, newToast];
  notifyListeners();

  setTimeout(() => {
    toastsState = toastsState.filter(t => t.id !== id);
    notifyListeners();
  }, 3000);
};

export const showErrorToast = (message: string) => {
  const id = `toast-${Date.now()}`;
  const newToast: Toast = {
    id,
    type: 'error',
    message,
    duration: 5000,
  };

  toastsState = [...toastsState, newToast];
  notifyListeners();

  setTimeout(() => {
    toastsState = toastsState.filter(t => t.id !== id);
    notifyListeners();
  }, 5000);
};

export default useToast;