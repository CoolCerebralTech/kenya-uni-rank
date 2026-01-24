import { useMemo } from 'react';

const generateRandomWidths = () => {
  return [...Array(5)].map(() => Math.random() * 60 + 20);
};

export function RacingSkeleton() {
  const randomWidths = useMemo(() => generateRandomWidths(), []);

  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Poll Question Skeleton */}
      <div className="space-y-2">
        <div className="h-6 bg-slate-700/50 rounded-lg w-3/4" />
        <div className="h-4 bg-slate-700/30 rounded w-1/4" />
      </div>

      {/* Racing Bars Skeleton */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="relative h-14 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/30">
          {/* Animated Shimmer */}
          <div 
            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-700/20 to-transparent"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
          
          {/* Fake Progress Bar */}
          <div 
            className="absolute inset-y-0 left-0 bg-slate-700/40"
            style={{ width: `${randomWidths[i]}%` }}
          />

          {/* Content Placeholder */}
          <div className="relative z-10 h-full flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700/50 rounded-full" />
              <div className="h-4 w-20 bg-slate-700/50 rounded" />
            </div>
            <div className="h-5 w-16 bg-slate-700/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="relative p-6 bg-slate-800/30 rounded-2xl border border-slate-700/30 space-y-4 animate-pulse"
        >
          {/* Icon Placeholder */}
          <div className="w-12 h-12 bg-slate-700/50 rounded-full" />
          
          {/* Text Placeholders */}
          <div className="space-y-2">
            <div className="h-5 bg-slate-700/50 rounded w-3/4" />
            <div className="h-4 bg-slate-700/30 rounded w-full" />
          </div>

          {/* Shimmer Effect */}
          <div 
            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-700/10 to-transparent rounded-2xl"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        </div>
      ))}
    </div>
  );
}

export function UniversityGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 space-y-3 animate-pulse"
        >
          {/* University Logo Placeholder */}
          <div className="w-12 h-12 bg-slate-700/50 rounded-full mx-auto" />
          
          {/* Name Placeholder */}
          <div className="space-y-2">
            <div className="h-3 bg-slate-700/50 rounded w-full" />
            <div className="h-2 bg-slate-700/30 rounded w-2/3 mx-auto" />
          </div>

          {/* Shimmer */}
          <div 
            className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-700/10 to-transparent rounded-xl"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        </div>
      ))}
    </div>
  );
}

export function StatsBarSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="text-center space-y-2">
          <div className="h-8 bg-slate-700/50 rounded w-16 mx-auto" />
          <div className="h-3 bg-slate-700/30 rounded w-20 mx-auto" />
        </div>
      ))}
    </div>
  );
}

// Global CSS needed:
/*
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
*/