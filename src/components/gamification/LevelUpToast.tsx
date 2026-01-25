import React, { useEffect } from 'react';
import { Trophy, ChevronRight, X } from 'lucide-react';

interface LevelUpToastProps {
  category: string;
  xpGained: number;
  nextCategory?: string;
  onDismiss: () => void;
  onNext?: () => void;
}

export const LevelUpToast: React.FC<LevelUpToastProps> = ({
  category,
  xpGained,
  nextCategory,
  onDismiss,
  onNext
}) => {
  useEffect(() => {
    // Sound effect trigger would go here
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] w-full max-w-sm animate-in slide-in-from-top-10 fade-in duration-300">
      <div className="relative bg-slate-900 border border-yellow-500/50 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.2)] p-4 overflow-hidden">
        {/* Confetti Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        
        {/* Close Button */}
        <button 
          onClick={onDismiss}
          className="absolute top-2 right-2 text-slate-500 hover:text-white z-20"
        >
          <X size={16} />
        </button>

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500 text-yellow-500 animate-bounce">
            <Trophy size={24} />
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-white text-lg leading-tight mb-1">
              {category} Conquered!
            </h4>
            <p className="text-yellow-400 text-sm font-bold mb-2">
              +{xpGained} XP Earned
            </p>
            
            {nextCategory && (
              <button 
                onClick={onNext}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                Next: {nextCategory} <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};