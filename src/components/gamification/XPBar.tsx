import React from 'react';

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, maxXP, level }) => {
  const percentage = Math.min(100, (currentXP / maxXP) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-bold">
            {level}
          </div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
            Level
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {currentXP} / {maxXP} XP
        </span>
      </div>

      <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* Shine */}
        <div className="absolute inset-0 bg-white/5 bg-[length:10px_10px] bg-stripes opacity-20" />
      </div>
    </div>
  );
};