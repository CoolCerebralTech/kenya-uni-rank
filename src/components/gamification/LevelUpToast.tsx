import React, { useEffect } from 'react';
import { Trophy, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const LevelUpToast: React.FC<{
  category: string;
  onDismiss: () => void;
  onNext?: () => void;
}> = ({ category, onDismiss, onNext }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      layout
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] w-full max-w-sm"
    >
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-yellow-500/50 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.2)] p-4 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
        <button onClick={onDismiss} className="absolute top-2 right-2 text-slate-500 hover:text-white z-20"><X size={16} /></button>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500 text-yellow-500">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-yellow-400">CATEGORY CONQUERED</p>
            <h4 className="font-bold text-white text-lg">{category}</h4>
          </div>
        </div>
        {onNext && (
          <button onClick={onNext} className="mt-3 w-full text-center py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-300 transition-colors">
            Continue Race <ChevronRight size={14} className="inline" />
          </button>
        )}
      </div>
    </motion.div>
  );
};