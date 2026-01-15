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
            className="overflow-hidden rounded-2xl bg-white dark:bg-background-elevated shadow-md border border-border-light dark:border-border animate-pulse"
          >
            {/* Header */}
            <div className="border-b border-border-light dark:border-border px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-24 bg-background-subtle dark:bg-background-hover rounded-full" />
                <div className="h-6 w-16 bg-background-subtle dark:bg-background-hover rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-background-subtle dark:bg-background-hover rounded-lg mb-2" />
              <div className="h-4 w-1/2 bg-background-subtle dark:bg-background-hover rounded-lg" />
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i}
                  className="h-16 bg-background-subtle dark:bg-background-hover rounded-xl"
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
            className="h-16 bg-background-subtle dark:bg-background-hover rounded-xl"
          />
        ))}
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="rounded-xl bg-white dark:bg-background-elevated shadow-md border border-border-light dark:border-border p-6 animate-pulse">
      <div className="h-6 w-1/3 bg-background-subtle dark:bg-background-hover rounded-lg mb-4" />
      <div className="h-4 w-full bg-background-subtle dark:bg-background-hover rounded-lg mb-2" />
      <div className="h-4 w-2/3 bg-background-subtle dark:bg-background-hover rounded-lg" />
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
          className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-background-elevated border border-border-light dark:border-border"
        >
          <div className="h-12 w-12 bg-background-subtle dark:bg-background-hover rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 bg-background-subtle dark:bg-background-hover rounded-lg" />
            <div className="h-3 w-1/3 bg-background-subtle dark:bg-background-hover rounded-lg" />
          </div>
          <div className="h-8 w-16 bg-background-subtle dark:bg-background-hover rounded-lg" />
        </div>
      ))}
    </div>
  );
};

// Specialized skeleton for charts
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="h-80 w-full rounded-xl bg-white dark:bg-background-elevated border border-border-light dark:border-border p-6 animate-pulse">
      <div className="h-6 w-1/4 bg-background-subtle dark:bg-background-hover rounded-lg mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-8 w-24 bg-background-subtle dark:bg-background-hover rounded" />
            <div 
              className="h-8 bg-background-subtle dark:bg-background-hover rounded"
              style={{ width: `${Math.random() * 60 + 20}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};