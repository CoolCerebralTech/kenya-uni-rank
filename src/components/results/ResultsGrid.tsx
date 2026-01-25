import React, { useState } from 'react';
import type { PollResult, PollCategory } from '../../types/models';
import { Input } from '../ui/Input';
import { Search } from 'lucide-react';
import { Tabs } from '../ui/Tabs';
import { RaceTrack } from '../racing/RaceTrack';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

interface ResultsGridProps {
  polls: Array<{
    id: string;
    question: string;
    category: PollCategory;
    totalVotes: number;
    results: PollResult[];
  }>;
  onViewDetails: (pollId: string) => void;
  userVotedPollIds: string[];
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ 
  polls, 
  onViewDetails, 
  userVotedPollIds 
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Sectors' },
    { id: 'vibes', label: 'Vibes' },
    { id: 'academics', label: 'Academics' },
    { id: 'sports', label: 'Sports' },
    { id: 'facilities', label: 'Facilities' },
  ];

  const filtered = polls.filter(p => {
    const matchesSearch = p.question.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center sticky top-16 z-30 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800/50">
        <Tabs 
          tabs={categories} 
          activeTab={activeCategory} 
          onChange={setActiveCategory} 
          className="w-full md:w-auto overflow-x-auto"
        />
        
        <div className="w-full md:w-64">
          <Input 
            placeholder="Search results..." 
            leftIcon={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(poll => (
            <div key={poll.id} className="flex flex-col h-full">
              <div className="flex justify-between items-end mb-2 px-1">
                <h3 className="font-bold text-white text-lg line-clamp-1" title={poll.question}>
                  {poll.question}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewDetails(poll.id)}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Full Analysis
                </Button>
              </div>
              
              <RaceTrack 
                results={poll.results.slice(0, 5)} // Show top 5 in grid
                totalVotes={poll.totalVotes}
                userHasVoted={userVotedPollIds.includes(poll.id)}
                onVoteClick={() => {}} // Usually redirects to vote page
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No results found" 
          description="Adjust your filters to see more data." 
        />
      )}
      
      {filtered.length > 0 && (
        <div className="flex justify-center pt-8">
          <Button variant="secondary" size="lg">
            Load More Archives
          </Button>
        </div>
      )}
    </div>
  );
};