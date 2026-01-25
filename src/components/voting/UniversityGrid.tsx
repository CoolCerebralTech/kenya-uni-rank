import React, { useState } from 'react';
import type { University } from '../../types/models';
import { UniversityCard } from './UniversityCard';
import { Input } from '../ui/Input';
import { Search } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

interface UniversityGridProps {
  universities: University[];
  selectedId: string | null;
  voteStates: Record<string, 'idle' | 'loading' | 'success' | 'error' | 'disabled'>;
  onSelect: (id: string) => void;
  onVote: (id: string) => void;
}

export const UniversityGrid: React.FC<UniversityGridProps> = ({
  universities,
  selectedId,
  voteStates,
  onSelect,
  onVote
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Public' | 'Private'>('All');

  const filtered = universities.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.shortName.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'All' || u.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sticky top-[4.5rem] z-30 bg-slate-950/80 backdrop-blur-md p-4 -mx-4 sm:mx-0 rounded-xl border border-slate-800/50">
        <div className="w-full sm:w-72">
          <Input 
            placeholder="Search universities..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          {(['All', 'Public', 'Private'] as const).map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`
                px-4 py-2 text-xs font-medium rounded-md transition-all
                ${typeFilter === type ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(uni => (
            <UniversityCard
              key={uni.id}
              university={uni}
              isSelected={selectedId === uni.id}
              voteState={voteStates[uni.id] || 'idle'}
              onSelect={() => onSelect(uni.id)}
              onVote={() => onVote(uni.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No universities found" description="Try adjusting your search filters." />
      )}
    </div>
  );
};