import React from 'react';
import type { PollResult } from '../../types/models';
import { Trophy, Medal } from 'lucide-react';

interface PodiumViewProps {
  results: PollResult[]; // Expects sorted results
}

export const PodiumView: React.FC<PodiumViewProps> = ({ results }) => {
  if (results.length < 3) return null;

  const [first, second, third] = results;

  const PodiumStep = ({ result, place, height }: { result: PollResult, place: 1 | 2 | 3, height: string }) => (
    <div className="flex flex-col items-center justify-end group">
      {/* Medal Icon */}
      <div className={`mb-2 transform transition-transform duration-300 group-hover:-translate-y-2`}>
        {place === 1 && <Trophy className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce-slow" />}
        {place === 2 && <Medal className="w-6 h-6 text-slate-300 fill-slate-300" />}
        {place === 3 && <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />}
      </div>

      {/* University Logo/Avatar Placeholder */}
      <div 
        className="w-12 h-12 rounded-full border-2 border-slate-900 shadow-lg mb-2 flex items-center justify-center text-xs font-bold text-white z-10"
        style={{ backgroundColor: result.universityColor }}
      >
        {result.universityShortName}
      </div>

      {/* The Block */}
      <div 
        className={`w-full ${height} rounded-t-lg relative flex items-end justify-center pb-2`}
        style={{ 
          backgroundColor: place === 1 ? '#1e293b' : '#0f172a',
          borderTop: `4px solid ${result.universityColor}`
        }}
      >
        <div className="text-center">
          <span className={`block text-lg font-bold ${place === 1 ? 'text-white' : 'text-slate-400'}`}>
            {result.percentage.toFixed(0)}%
          </span>
        </div>
        
        {/* Shine effect for 1st */}
        {place === 1 && (
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent rounded-t-lg" />
        )}
      </div>
      
      <span className="mt-2 text-xs font-medium text-slate-500 max-w-[80px] truncate text-center">
        {result.universityName}
      </span>
    </div>
  );

  return (
    <div className="flex items-end justify-center gap-2 h-64 pt-8 pb-4">
      {/* 2nd Place */}
      <div className="w-1/3 max-w-[100px] h-full flex items-end">
        <PodiumStep result={second} place={2} height="h-[60%]" />
      </div>

      {/* 1st Place */}
      <div className="w-1/3 max-w-[120px] h-full flex items-end z-10">
        <PodiumStep result={first} place={1} height="h-[85%]" />
      </div>

      {/* 3rd Place */}
      <div className="w-1/3 max-w-[100px] h-full flex items-end">
        <PodiumStep result={third} place={3} height="h-[45%]" />
      </div>
    </div>
  );
};