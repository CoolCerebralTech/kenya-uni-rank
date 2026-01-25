import React, { useEffect } from 'react';
import { Badge as BadgeIcon, X } from 'lucide-react';

interface AchievementToastProps {
  name: string;
  icon: React.ReactNode;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ name, icon, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-24 right-4 z-50 w-full max-w-xs pointer-events-auto animate-in slide-in-from-right-10 fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl flex items-center gap-3 relative overflow-hidden">
        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />

        <div className="bg-slate-800 p-2 rounded-md text-cyan-400 border border-slate-700">
          {icon || <BadgeIcon size={20} />}
        </div>
        
        <div className="flex-1">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            Achievement Unlocked
          </p>
          <p className="text-sm font-bold text-white">{name}</p>
        </div>

        <button onClick={onDismiss} className="text-slate-500 hover:text-white">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};