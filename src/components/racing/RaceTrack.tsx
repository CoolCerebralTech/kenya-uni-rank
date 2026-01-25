import React from 'react';
import { PollResult } from '../../types/models';
import { UniversityRacer } from './UniversityRacer';
import { GhostMode } from './GhostMode';
import { Card } from '../ui/Card';

interface RaceTrackProps {
  results: PollResult[];
  totalVotes: number;
  userHasVoted: boolean;
  onVoteClick: () => void;
  isLoading?: boolean;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({
  results,
  totalVotes,
  userHasVoted,
  onVoteClick,
  isLoading = false,
}) => {
  // Sort results by rank (just to be safe)
  const sortedResults = [...results].sort((a, b) => a.rank - b.rank);

  return (
    <Card className="relative overflow-hidden min-h-[300px] flex flex-col" padding="none">
      
      {/* Header / Meta */}
      <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
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

      {/* The Track */}
      <div className="relative p-4 flex-1 space-y-3 bg-slate-950/30">
        
        {/* Render Bars */}
        {sortedResults.map((result, index) => (
          <UniversityRacer 
            key={result.universityId}
            result={result}
            isLeader={index === 0}
            isLocked={!userHasVoted}
          />
        ))}

        {/* Ghost Mode Overlay - Only if user hasn't voted and not loading */}
        {!userHasVoted && !isLoading && (
          <GhostMode onVote={onVoteClick} />
        )}
      </div>
    </Card>
  );
};