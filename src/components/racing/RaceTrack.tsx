import React, { useMemo } from 'react';
import type { PollResult } from '../../types/models';
import { UniversityRacer } from './UniversityRacer';
import { GhostMode } from './GhostMode';
import { Card } from '../ui/Card';
import { RaceAnimation, RaceParticles } from './RaceAnimation';

interface RaceTrackProps {
  results: PollResult[];
  totalVotes: number;
  userHasVoted: boolean;
  onVoteClick?: () => void;
  isLoading?: boolean;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({
  results,
  totalVotes,
  userHasVoted,
  onVoteClick,
  isLoading = false,
}) => {
  // Memoize sort to keep object references stable if data hasn't changed
  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => a.rank - b.rank);
  }, [results]);

  return (
    <Card className="relative overflow-hidden min-h-[300px] flex flex-col" padding="none">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 relative z-10">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Live Standings
        </span>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
           <span className="text-xs text-slate-400 font-mono">
             {totalVotes.toLocaleString()} VOTES
           </span>
        </div>
      </div>

      {/* 🎨 EPIC RACE ANIMATION WRAPPER */}
      <div className="relative p-4 flex-1 bg-slate-950/30">
        
        {/* Particle effects (only when voted) */}
        <RaceParticles active={userHasVoted && sortedResults.length > 0} color="#06b6d4" />

        {/* 
           FIX: Removed key={animationKey} to stop forced re-renders. 
           RaceAnimation uses useLayoutEffect to detect DOM position changes automatically.
        */}
        <RaceAnimation 
          enableEffects={userHasVoted} 
          raceMode="turbo"
        >
          <div className="space-y-3 relative z-10">
            {sortedResults.map((result) => (
              <div 
                key={result.universityId} 
                data-race-key={result.universityId}
              >
                <UniversityRacer 
                  result={result}
                  isLeader={result.rank === 1}
                  isLocked={!userHasVoted}
                />
              </div>
            ))}
          </div>
        </RaceAnimation>

        {/* Ghost mode overlay */}
        {!userHasVoted && !isLoading && onVoteClick && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <GhostMode onVote={onVoteClick} />
          </div>
        )}
      </div>
    </Card>
  );
};