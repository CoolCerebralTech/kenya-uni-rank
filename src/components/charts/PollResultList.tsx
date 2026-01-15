import React from 'react';
import type { PollResult } from '../../types';

interface PollResultListProps {
  results: PollResult[];
  totalVotes: number;
}

export const PollResultList: React.FC<PollResultListProps> = ({ results, totalVotes }) => {
  // Sort by votes desc
  const sorted = [...results].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-3 animate-slide-up">
      {sorted.map((item, index) => {
        const percent = totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0;
        
        return (
          <div key={item.universityId} className="relative group">
            {/* The Background Bar Container */}
            <div className="relative flex h-12 w-full items-center justify-between overflow-hidden rounded-lg bg-background-card dark:bg-background-elevated border border-border-light dark:border-border shadow-card transition-all group-hover:shadow-glow-blue group-hover:scale-[1.01]">
              
              {/* The "Progress" Bar (Animated) */}
              <div 
                className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${percent}%`, 
                  background: `linear-gradient(to right, ${item.universityColor}33, transparent)` // Gradient for engagement
                }}
              />
              
              {/* The Color Stripe Indicator */}
              <div 
                className="absolute left-0 top-0 h-full w-1.5 shadow-glow"
                style={{ backgroundColor: item.universityColor }}
              />

              {/* Text Content (Sitting on top) */}
              <div className="z-10 flex flex-col pl-4">
                <span className="font-semibold text-text dark:text-inverted">
                  {index + 1}. {item.universityName}
                </span>
              </div>

              {/* Stats */}
              <div className="z-10 flex flex-col items-end pr-4">
                <span className="font-bold text-text dark:text-inverted">{percent}%</span>
                <span className="text-xs text-text-subtle dark:text-text-muted">{item.votes} votes</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};