import React, { useState } from 'react';
import type { University } from '../../types/models';
import { UniversityCard } from './UniversityCard';
import { EmptyState } from '../ui/EmptyState';
import { Search } from 'lucide-react';

interface UniversityGridProps {
  universities: University[];
  selectedId: string | null;
  voteStates?: Record<string, 'idle' | 'loading' | 'success' | 'error' | 'disabled'>;
  onSelect: (id: string) => void;
  onVote?: (id: string) => void;
}

// UniPulse v3 — refined voting grid.
// Filter bar is a translucent pill, not a sticky slate block. Grid is denser
// on mobile (2-up) and tighter on desktop (3-up at md, 4-up at lg).
export const UniversityGrid: React.FC<UniversityGridProps> = ({
  universities,
  selectedId,
  voteStates = {},
  onSelect,
  onVote,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Public' | 'Private'>('All');

  const filtered = universities.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.shortName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || u.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-5">
      {/* Filter / search pill */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative sm:w-64 flex-grow">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search universities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-slate-900/60 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/40 focus:bg-slate-900 transition-colors"
          />
        </div>

        {/* Type segmented control */}
        <div className="flex bg-slate-900/60 rounded-lg p-1 border border-slate-800 text-[11px] font-bold uppercase tracking-wider self-start sm:self-auto">
          {(['All', 'Public', 'Private'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                typeFilter === type
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((uni) => (
            <UniversityCard
              key={uni.id}
              university={uni}
              isSelected={selectedId === uni.id}
              voteState={voteStates[uni.id] || 'idle'}
              onSelect={() => onSelect(uni.id)}
              onVote={() => onVote?.(uni.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No universities found"
          description="Try adjusting your search filters."
        />
      )}
    </div>
  );
};
