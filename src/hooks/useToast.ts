// ============================================================================
// useToast - Toast Notification Manager
// ============================================================================

import React, { createContext, useContext } from 'react';
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

// Interface for what the hook returns
interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
}

// --- GLOBAL STATE ENGINE ---

let toastsState: Toast[] = [];
const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach(listener => listener());
};

const dispatchRemoveToast = (id: string) => {
  toastsState = toastsState.filter(t => t.id !== id);
  emitChange();
};

const dispatchAddToast = (toast: Omit<Toast, 'id'>): string => {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const duration = toast.duration ?? 5000;

  const newToast: Toast = { ...toast, id, duration };

  toastsState = [...toastsState, newToast];
  emitChange();

  if (duration > 0) {
    setTimeout(() => {
      dispatchRemoveToast(id);
    }, duration);
  }

  return id;
};

const dispatchClearAll = () => {
  toastsState = [];
  emitChange();
};

// --- REACT HOOK ---

export function useToast(): ToastContextValue {
  const toasts = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => toastsState,
    () => []
  );

  const showSuccessToast = (message: string) =>
    dispatchAddToast({ type: 'success', message });

  const showErrorToast = (message: string) =>
    dispatchAddToast({ type: 'error', message });

  return {
    toasts,
    showToast: dispatchAddToast,
    hideToast: dispatchRemoveToast,
    clearAllToasts: dispatchClearAll,
    showSuccessToast,
    showErrorToast,
  };
}

// --- CONTEXT PROVIDER ---

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => { const toastApi = useToast(); return React.createElement( ToastContext.Provider, { value: toastApi }, children ); };

export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return ctx;
};

// --- STANDALONE EXPORTS (Optional) ---
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

export default useToast;
