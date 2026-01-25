import React from 'react';
import { Flame } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

interface StreakCounterProps {
  days: number;
  nextMilestone: number; // e.g., 7
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ days, nextMilestone }) => {
  const progress = (days / nextMilestone) * 100;

  return (
    <Tooltip content={`Vote daily to keep the fire alive! Next goal: ${nextMilestone} days.`}>
      <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-full px-3 py-1 cursor-help group">
        <div className="relative">
          <Flame 
            className={`w-5 h-5 transition-all duration-500 ${days > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-slate-600'}`} 
          />
          {days > 3 && (
            <div className="absolute inset-0 bg-orange-500/30 blur-md rounded-full animate-pulse" />
          )}
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white leading-none">
            {days} <span className="text-[10px] text-slate-500 uppercase">Streak</span>
          </span>
          {/* Micro Progress Bar */}
          <div className="w-full h-0.5 bg-slate-800 mt-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};