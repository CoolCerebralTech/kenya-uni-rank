import React, { useState } from 'react';
import type { Poll } from '../../types/models';
import { PollCard } from './PollCard';
import { Input } from '../ui/Input';
import { EmptyState } from '../ui/EmptyState';
import { Search } from 'lucide-react';
import { RacingSkeleton } from '../ui/RacingSkeleton';

interface PollListProps {
  polls: Poll[];
  isLoading: boolean;
  votedPollIds: string[]; // IDs the user has already voted on
  onVote: (pollId: string) => void;
  onViewResults: (pollId: string) => void;
}

export const PollList: React.FC<PollListProps> = ({
  polls,
  isLoading,
  votedPollIds,
  onVote,
  onViewResults
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'voted'>('all');

  // Filter Logic
  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.question.toLowerCase().includes(search.toLowerCase());
    const isVoted = votedPollIds.includes(poll.id);
    
    if (!matchesSearch) return false;
    if (filter === 'active') return !isVoted;
    if (filter === 'voted') return isVoted;
    return true;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => <RacingSkeleton key={i} count={1} />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:w-64">
          <Input 
            placeholder="Search polls..." 
            leftIcon={<Search size={16} />} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
          {(['all', 'active', 'voted'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all
                ${filter === f ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredPolls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map(poll => {
            // FIXED: Use a deterministic calculation instead of Math.random()
            // This ensures the value is stable across renders based on the ID
            const idSum = poll.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const isMockTrending = idSum % 5 === 0; // Approx 20% chance to be trending

            return (
              <PollCard
                key={poll.id}
                poll={poll}
                hasVoted={votedPollIds.includes(poll.id)}
                totalVotes={1250} // Mock total for list view
                isTrending={isMockTrending} 
                onVote={() => onVote(poll.id)}
                onViewResults={() => onViewResults(poll.id)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState 
          title="No polls found" 
          description={filter === 'voted' ? "You haven't voted in any polls yet." : "Try adjusting your search filters."} 
        />
      )}
    </div>
  );
};