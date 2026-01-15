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
    <div className="space-y-3">
      {sorted.map((item, index) => {
        const percent = totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0;
        
        return (
          <div key={item.universityId} className="relative">
            {/* The Background Bar Container */}
            <div className="group relative flex h-12 w-full items-center justify-between overflow-hidden rounded-lg bg-gray-50 px-4 ring-1 ring-inset ring-gray-200">
              
              {/* The "Progress" Bar (Animated) */}
              <div 
                className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${percent}%`, 
                  backgroundColor: `${item.universityColor}15` // 15 = 15% opacity hex
                }}
              />
              
              {/* The Color Stripe Indicator */}
              <div 
                className="absolute left-0 top-0 h-full w-1"
                style={{ backgroundColor: item.universityColor }}
              />

              {/* Text Content (Sitting on top) */}
              <div className="z-10 flex flex-col">
                <span className="font-semibold text-gray-900">
                  {index + 1}. {item.universityName}
                </span>
              </div>

              {/* Stats */}
              <div className="z-10 flex flex-col items-end">
                <span className="font-bold text-gray-900">{percent}%</span>
                <span className="text-xs text-gray-500">{item.votes} votes</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};