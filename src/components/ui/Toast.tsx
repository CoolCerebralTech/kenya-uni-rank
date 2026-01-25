import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onDismiss: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, onDismiss, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const config = {
    success: { icon: CheckCircle, bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
    error: { icon: XCircle, bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
    warning: { icon: AlertTriangle, bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
    info: { icon: Info, bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  };

  const style = config[type];
  const Icon = style.icon;

  return (
    <div className={`flex items-start w-full max-w-sm overflow-hidden rounded-lg border ${style.bg} ${style.border} shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-right-full duration-300 pointer-events-auto`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${style.text}`} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-slate-200">{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={() => onDismiss(id)}
              className="inline-flex rounded-md text-slate-400 hover:text-white focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Container to place in App.tsx
export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
    {children}
  </div>
);