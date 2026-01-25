import React from 'react';
import { motion } from 'framer-motion';

export const XPBar: React.FC<{
  currentXP: number;
  maxXP: number;
  level: number;
}> = ({ currentXP, maxXP, level }) => {
  const percentage = Math.min(100, (currentXP / maxXP) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)]">
            {level}
          </div>
          <span className="text-sm font-bold text-cyan-400">Level</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">{currentXP} / {maxXP} XP</span>
      </div>
      <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};