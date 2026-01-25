import React, { useState } from 'react';
import { X, Info, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

interface AlertBannerProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  message: string;
  isSticky?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ 
  type = 'info', 
  message, 
  isSticky = false,
  action 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const styles = {
    info: { bg: 'bg-blue-600', icon: Info },
    warning: { bg: 'bg-amber-600', icon: AlertTriangle },
    error: { bg: 'bg-red-600', icon: AlertOctagon },
    success: { bg: 'bg-green-600', icon: CheckCircle },
  };

  const Style = styles[type];
  const Icon = Style.icon;

  return (
    <div className={`
      ${isSticky ? 'sticky top-0 z-[60]' : 'relative'}
      ${Style.bg} text-white px-4 py-3 shadow-lg flex items-center justify-between gap-4
    `}>
      <div className="flex items-center gap-3 text-sm font-medium">
        <Icon size={18} className="shrink-0" />
        <span>{message}</span>
      </div>

      <div className="flex items-center gap-4">
        {action && (
          <button 
            onClick={action.onClick}
            className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            {action.label}
          </button>
        )}
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};