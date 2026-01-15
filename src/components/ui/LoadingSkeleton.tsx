import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'poll' | 'result' | 'card';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'poll',
  count = 1 
}) => {
  if (variant === 'poll') {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index}
            className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-gray-100 dark:border-gray-700 animate-pulse"
          >
            {/* Header */}
            <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 rounded-full" />
                <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-slate-700 rounded-lg mb-2" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded-lg" />
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i}
                  className="h-16 bg-gray-100 dark:bg-slate-700/50 rounded-xl"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'result') {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: count }).map((_, index) => (
          <div 
            key={index}
            className="h-16 bg-gray-100 dark:bg-slate-700/50 rounded-xl"
          />
        ))}
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 shadow-md border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4" />
      <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded-lg mb-2" />
      <div className="h-4 w-2/3 bg-gray-200 dark:bg-slate-700 rounded-lg" />
    </div>
  );
};

// Specialized skeleton for leaderboard
export const LeaderboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div 
          key={index}
          className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700"
        >
          <div className="h-12 w-12 bg-gray-200 dark:bg-slate-700 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded-lg" />
            <div className="h-3 w-1/3 bg-gray-200 dark:bg-slate-700 rounded-lg" />
          </div>
          <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

// Specialized skeleton for charts
export const ChartSkeleton: React.FC = () => {
  // Pre-defined widths to simulate randomness without breaking purity
  const widths = ['60%', '45%', '75%', '30%', '80%', '50%'];

  return (
    <div className="h-80 w-full rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
      <div className="h-6 w-1/4 bg-gray-200 dark:bg-slate-700 rounded-lg mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
            <div 
              className="h-8 bg-blue-100 dark:bg-blue-900/30 rounded"
              // Use deterministic width based on index (modulo to prevent overflow if length changes)
              style={{ width: widths[index % widths.length] }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};