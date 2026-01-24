import React, { useState, useEffect } from 'react';
import type { PollResult } from '../types/models';

interface RaceTrackProps {
  results: PollResult[];
  isLocked?: boolean;
  pollQuestion: string;
  totalVotes: number;
  onUniversityClick?: (universityId: string) => void;
}

export function RaceTrack({ 
  results, 
  isLocked = false, 
  pollQuestion,
  totalVotes,
  onUniversityClick 
}: RaceTrackProps) {
  const [animatedResults, setAnimatedResults] = useState<PollResult[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => {
      setAnimatedResults(results);
    }, 100);
    return () => clearTimeout(timer);
  }, [results]);

  // Sort by votes for ranking
  const sortedResults = [...animatedResults].sort((a, b) => b.votes - a.votes);
  const topThree = sortedResults.slice(0, 3);

  return (
    <div className="w-full space-y-4">
      {/* Poll Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">
          {pollQuestion}
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>{totalVotes.toLocaleString()} votes</span>
          </div>
          {!isLocked && (
            <span className="text-green-400">• Live</span>
          )}
        </div>
      </div>

      {/* Racing Bars */}
      <div className="space-y-3">
        {sortedResults.map((result, index) => {
          const width = result.percentage || 0;
          const isTop3 = index < 3;
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

          return (
            <div
              key={result.universityId}
              className={`group relative transition-all duration-300 ${
                onUniversityClick ? 'cursor-pointer hover:scale-[1.02]' : ''
              } ${isLocked ? 'opacity-50 blur-sm' : ''}`}
              onClick={() => !isLocked && onUniversityClick?.(result.universityId)}
            >
              {/* Rank Badge */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                #{result.rank}
              </div>

              {/* Racing Bar Container */}
              <div className="relative h-14 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
                {/* Animated Progress Bar */}
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-1000 ease-out"
                  style={{
                    width: showAnimation ? `${Math.max(width, 2)}%` : '0%',
                    backgroundColor: result.universityColor,
                    opacity: isTop3 ? 0.9 : 0.6,
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 h-full flex items-center justify-between px-4">
                  {/* Left: University Info */}
                  <div className="flex items-center gap-3">
                    {medal && (
                      <span className="text-2xl animate-bounce-slow">
                        {medal}
                      </span>
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm leading-tight">
                        {result.universityShortName}
                      </span>
                      <span className="text-xs text-slate-400">
                        {result.universityType}
                      </span>
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {result.votes.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">
                        {result.percentage.toFixed(1)}%
                      </div>
                    </div>
                    
                    {/* Live Pulse for top 3 */}
                    {isTop3 && !isLocked && (
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: result.universityColor }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              {!isLocked && onUniversityClick && (
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `0 0 20px ${result.universityColor}40`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl">
          <div className="text-center space-y-3">
            <div className="text-4xl">🔒</div>
            <div className="text-white font-bold">Vote to Unlock Reality</div>
            <div className="text-sm text-slate-400">
              Cast your vote to see real standings
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Animation keyframes in global CSS:
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// @keyframes bounce-slow {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-10px); }
// }