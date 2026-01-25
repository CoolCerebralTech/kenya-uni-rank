import React, { useState, useEffect } from 'react';

// Pre-computed random values (PURE - no Math.random() during render)
const BAR_WIDTHS = [35, 42, 38, 45, 32, 40, 37];
const ANIM_DURS = [1.2, 1.8, 1.4, 1.6, 1.3, 1.7, 1.5];

export const RacingSkeleton: React.FC = () => {
  const [barIndex, setBarIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBarIndex((prev) => (prev + 1) % BAR_WIDTHS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-4 p-4">
      {[1, 2, 3, 4, 5].map((i) => {
        const idx = (i + barIndex) % BAR_WIDTHS.length;
        return (
          <div 
            key={i} 
            className="relative h-12 w-full bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800"
          >
            {/* Label placeholder */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
              <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
              <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
            </div>
            
            {/* Moving Bar - PURE VALUES */}
            <div 
              className="absolute inset-y-0 left-0 bg-slate-800/30 animate-pulse"
              style={{ 
                width: `${BAR_WIDTHS[idx]}%`,
                animationDuration: `${ANIM_DURS[idx]}s`
              }}
            />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        );
      })}
    </div>
  );
};
