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
    <Card className="relative overflow-hidden min-h-[280px] flex flex-col" padding="none" variant="glass">

      {/* Header */}
      <div className="flex justify-between items-center px-4 sm:px-5 py-3 border-b border-slate-800/60 relative z-10">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">
          Live Standings
        </span>
        <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[11px] text-slate-400 font-mono tabular">
             {totalVotes.toLocaleString()} votes
           </span>
        </div>
      </div>

      {/* Race */}
      <div className="relative p-4 sm:p-5 flex-1">
        {/* Particle effects */}
        <RaceParticles active={userHasVoted && sortedResults.length > 0} color="#22d3ee" />

        <RaceAnimation enableEffects={userHasVoted} raceMode="turbo">
          <div className="space-y-2.5 relative z-10">
            {sortedResults.map((result) => (
              <div
                key={result.universityId}
                data-race-key={result.universityId}
                className="animate-fade-in-up"
                style={{ animationDelay: `${result.rank * 0.08}s` }}
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