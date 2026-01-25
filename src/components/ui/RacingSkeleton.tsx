import React from 'react';

// A specialized skeleton loader that looks like racing bars
export const RacingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="relative h-12 w-full bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800">
          {/* Label placeholder */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
            <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
          </div>
          
          {/* Moving Bar */}
          <div 
            className="absolute inset-y-0 left-0 bg-slate-800/30 animate-pulse"
            style={{ 
              width: `${Math.random() * 40 + 30}%`,
              animationDuration: `${Math.random() * 1 + 1}s` 
            }}
          />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      ))}
    </div>
  );
};