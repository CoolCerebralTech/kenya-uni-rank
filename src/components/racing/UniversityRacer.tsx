import React from 'react';
import type { PollResult } from '../../types/models';
import { Crown } from 'lucide-react';

interface UniversityRacerProps {
  result: PollResult;
  isLeader?: boolean;
  isLocked?: boolean; // If locked, we hide exact numbers/colors
  onClick?: () => void;
}

export const UniversityRacer: React.FC<UniversityRacerProps> = ({
  result,
  isLeader = false,
  isLocked = false,
  onClick,
}) => {
  // In locked mode, we randomize the width slightly or blur it to prevent guessing
  // But usually, GhostMode covers this. If visible behind GhostMode:
  const displayPercentage = isLocked ? Math.max(10, result.percentage) : result.percentage;
  
  return (
    <div 
      className={`relative w-full group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Label Row (Above Bar) */}
      <div className="flex justify-between items-end mb-1 text-sm">
        <div className="flex items-center gap-2">
          {isLeader && <Crown size={14} className="text-yellow-400 fill-yellow-400 animate-bounce" />}
          <span className={`font-bold ${isLeader ? 'text-white' : 'text-slate-300'}`}>
            {result.rank}. {result.universityName}
          </span>
        </div>
        
        {/* Hide numbers if locked */}
        <div className={`font-mono text-xs ${isLocked ? 'blur-sm text-slate-600' : 'text-slate-400'}`}>
          {!isLocked && (
            <>
              <span className="font-bold text-white mr-1">{result.percentage.toFixed(1)}%</span>
              <span className="opacity-50">({result.votes})</span>
            </>
          )}
          {isLocked && "??%"}
        </div>
      </div>

      {/* Track Background */}
      <div className="h-10 w-full bg-slate-900 rounded-md overflow-hidden border border-slate-800 relative">
        
        {/* The Racer Bar */}
        <div
          className={`h-full relative transition-all duration-1000 ease-out flex items-center px-3
            ${isLeader ? 'shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''}
          `}
          style={{
            width: `${displayPercentage}%`,
            backgroundColor: isLocked ? '#334155' : result.universityColor,
            filter: isLocked ? 'grayscale(100%)' : 'none',
          }}
        >
          {/* Shine Effect */}
          {!isLocked && (
            <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
          )}

          {/* Logo/ShortName inside bar if wide enough */}
          {displayPercentage > 15 && (
            <span className="text-white font-bold text-xs tracking-wider uppercase drop-shadow-md truncate">
              {result.universityShortName}
            </span>
          )}
        </div>
        
        {/* ShortName outside bar if too narrow */}
        {displayPercentage <= 15 && (
           <div className="absolute left-0 top-0 bottom-0 flex items-center pl-2" style={{ left: `${displayPercentage}%` }}>
              <span className="text-slate-400 text-xs font-bold ml-2">
                {result.universityShortName}
              </span>
           </div>
        )}
      </div>
    </div>
  );
};