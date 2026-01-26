import React, { useState, useMemo } from 'react';
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

  const categories = useMemo(() => [
    { id: 'all', label: 'All Sectors' },
    { id: 'vibes', label: 'Vibes' },
    { id: 'academics', label: 'Academics' },
    { id: 'sports', label: 'Sports' },
    { id: 'social', label: 'Social' },
    { id: 'facilities', label: 'Facilities' },
  ], []);

  // 🔥 Memoize filtered results
  const filtered = useMemo(() => {
    return polls.filter(p => {
      const matchesSearch = p.question.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [polls, search, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center sticky top-16 z-30 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800/50 rounded-lg px-4">
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

      {/* Grid with stagger animation */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((poll, index) => (
            <div 
              key={poll.id} 
              className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 50}ms`,
                animationDuration: '500ms',
                animationFillMode: 'backwards'
              }}
            >
              {/* Poll Header */}
              <div className="flex justify-between items-start mb-3 px-1">
                <div className="flex-1 pr-4">
                  <h3 
                    className="font-bold text-white text-lg line-clamp-2 hover:text-cyan-400 transition-colors cursor-pointer" 
                    title={poll.question}
                    onClick={() => onViewDetails(poll.id)}
                  >
                    {poll.question}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 uppercase tracking-wide">
                      {poll.category}
                    </span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {poll.totalVotes.toLocaleString()} votes
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewDetails(poll.id)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 whitespace-nowrap flex-shrink-0"
                >
                  Full Analysis →
                </Button>
              </div>
              
              {/* Race Track with Animation */}
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
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <EmptyState 
            title="No results found" 
            description="Adjust your filters to see more data." 
          />
        </div>
      )}
      
      {/* Load More */}
      {filtered.length > 0 && filtered.length >= 10 && (
        <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Button 
            variant="secondary" 
            size="lg"
            className="group"
          >
            <span className="mr-2">Load More Archives</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Button>
        </div>
      )}
    </div>
  );
};