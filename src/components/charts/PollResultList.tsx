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
  // Sort by votes desc
  const sorted = [...results].sort((a, b) => b.votes - a.votes);

  // Get rank icon
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
        const percent = totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0;
        const isTopThree = index < 3;
        
        return (
          <div 
            key={item.universityId} 
            className="relative group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Background Container */}
            <div className={`
              relative flex h-16 w-full items-center justify-between overflow-hidden 
              rounded-xl bg-white dark:bg-background-elevated border transition-all duration-300
              ${isTopThree 
                ? 'border-2 shadow-lg group-hover:shadow-xl' 
                : 'border border-border-light dark:border-border shadow-sm group-hover:shadow-md'
              }
              group-hover:scale-[1.02]
            `}>
              
              {/* Animated Progress Bar */}
              <div 
                className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${percent}%`, 
                  background: `linear-gradient(to right, ${item.universityColor}20, transparent)`,
                }}
              />
              
              {/* Left Color Stripe */}
              <div 
                className="absolute left-0 top-0 h-full w-1.5"
                style={{ 
                  backgroundColor: item.universityColor,
                  boxShadow: `0 0 8px ${item.universityColor}60`
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
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md' 
                      : 'bg-gray-100 dark:bg-background-subtle text-text-subtle dark:text-gray-400'
                    }
                  `}>
                    {getRankIcon(index) || `#${index + 1}`}
                  </div>
                  
                  {/* University Info */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-text dark:text-white">
                      {item.universityName}
                    </span>
                    {isTopThree && (
                      <span className="text-xs text-text-subtle dark:text-gray-400">
                        Leading by {percent - (sorted[index + 1]?.percentage || 0).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Stats */}
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-text dark:text-white">
                    {percent}%
                  </span>
                  <span className="text-xs text-text-subtle dark:text-gray-400">
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
        <div className="mt-6 pt-4 border-t border-border-light dark:border-border flex justify-between items-center text-sm">
          <span className="text-text-subtle dark:text-gray-400">
            {sorted.length} universities competing
          </span>
          <span className="font-semibold text-text dark:text-white">
            Total: {totalVotes.toLocaleString()} votes
          </span>
        </div>
      )}
    </div>
  );
};