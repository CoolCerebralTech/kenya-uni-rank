import React, { useState } from 'react';
import { X, Info, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AlertBanner: React.FC<{
  type?: 'info' | 'warning' | 'error' | 'success';
  message: string | React.ReactNode;
  isSticky?: boolean;
  action?: { label: string; onClick: () => void };
}> = ({ type = 'info', message, isSticky = false, action }) => {
  const [isVisible, setIsVisible] = useState(true);

  const styles = {
    info:    { border: 'border-blue-500/50',    bg: 'bg-blue-950/30',    icon: Info,          iconColor: 'text-blue-400' },
    warning: { border: 'border-amber-500/50',   bg: 'bg-amber-950/30',   icon: AlertTriangle, iconColor: 'text-amber-400' },
    error:   { border: 'border-red-500/50',     bg: 'bg-red-950/30',     icon: AlertOctagon,  iconColor: 'text-red-400' },
    success: { border: 'border-emerald-500/50', bg: 'bg-emerald-950/30', icon: CheckCircle,   iconColor: 'text-emerald-400' },
  };
  const style = styles[type];
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, padding: 0, margin: 0, transition: { duration: 0.3 } }}
          className={`${isSticky ? 'sticky top-16 z-30' : 'relative'} w-full`} // Sticky below header
        >
          <div className={`text-white px-4 py-3 shadow-lg flex items-center justify-between gap-4 border-l-4 ${style.border} ${style.bg}`}>
            <div className="flex items-center gap-3 text-sm font-medium">
              <Icon size={20} className={`shrink-0 ${style.iconColor}`} />
              <span className="text-slate-200">{message}</span>
            </div>
            <div className="flex items-center gap-4">
              {action && (
                <button onClick={action.onClick} className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap">
                  {action.label}
                </button>
              )}
              <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10">
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};