import React from 'react';
import { Trophy, Award, Medal } from 'lucide-react';
import type { PollResult } from '../../types';

interface PollResultListProps {
  results: PollResult[];
  totalVotes: number;
  showRankBadges?: boolean;
}

export const PollResultList: React.FC<PollResultListProps> = ({ 
  results, 
  totalVotes,
  showRankBadges = true 
}) => {
  // Sort by votes descending (High -> Low)
  const sorted = [...results].sort((a, b) => b.votes - a.votes);

  // Helper to get rank icons
  const getRankIcon = (index: number) => {
    if (!showRankBadges) return null;
    
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-500" size={18} />;
      case 1:
        return <Award className="text-gray-400" size={18} />;
      case 2:
        return <Medal className="text-orange-600" size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3 animate-slide-up">
      {sorted.map((item, index) => {
        // Calculate current percentage (Integer)
        const percent = totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0;
        
        // Calculate margin (lead over the next person)
        const nextItem = sorted[index + 1];
        const nextItemPercentage = nextItem ? (nextItem.votes / totalVotes) * 100 : 0;
        // Fix: Do math on numbers, then round
        const leadMargin = Math.round(percent - nextItemPercentage);

        const isTopThree = index < 3;
        const hasRunnerUp = !!nextItem; // Only show lead if there is someone behind
        
        return (
          <div 
            key={item.universityId} 
            className="relative group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Background Container */}
            <div className={`
              relative flex h-16 w-full items-center justify-between overflow-hidden 
              rounded-xl bg-white dark:bg-slate-800 border transition-all duration-300
              ${isTopThree 
                ? 'border-2 border-blue-100 dark:border-blue-900 shadow-lg group-hover:shadow-xl' 
                : 'border border-gray-100 dark:border-gray-700 shadow-sm group-hover:shadow-md'
              }
              group-hover:scale-[1.02]
            `}>
              
              {/* Animated Progress Bar */}
              <div 
                className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out opacity-20"
                style={{ 
                  width: `${percent}%`, 
                  backgroundColor: item.universityColor || '#cbd5e1',
                }}
              />
              
              {/* Left Color Stripe */}
              <div 
                className="absolute left-0 top-0 h-full w-1.5"
                style={{ 
                  backgroundColor: item.universityColor || '#cbd5e1',
                }}
              />

              {/* Content Container */}
              <div className="z-10 flex w-full items-center justify-between px-5">
                {/* Left: Rank & Name */}
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm
                    ${isTopThree 
                      ? 'bg-linear-to-br from-yellow-50 to-orange-100 text-orange-700 dark:from-yellow-900 dark:to-orange-900 dark:text-orange-100 shadow-sm' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {getRankIcon(index) || `#${index + 1}`}
                  </div>
                  
                  {/* University Info */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.universityName}
                    </span>
                    {isTopThree && hasRunnerUp && leadMargin > 0 && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Leading by {leadMargin}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Stats */}
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {percent}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.votes.toLocaleString()} votes
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary Footer */}
      {sorted.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {sorted.length} universities competing
          </span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Total: {totalVotes.toLocaleString()} votes
          </span>
        </div>
      )}
    </div>
  );
};