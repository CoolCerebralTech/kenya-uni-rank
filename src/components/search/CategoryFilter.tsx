import React from 'react';
import type { PollCategory } from '../../types/models';

interface CategoryFilterProps {
  activeCategory: PollCategory | 'all';
  counts?: Record<string, number>;
  onSelect: (cat: PollCategory | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  counts = {}, 
  onSelect 
}) => {
  const categories: (PollCategory | 'all')[] = ['all', 'general', 'vibes', 'academics', 'sports', 'social', 'facilities'];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 sticky top-0 bg-slate-950/90 backdrop-blur z-20 border-b border-slate-800/50">
      <div className="flex gap-2 px-4 min-w-max">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border
              ${activeCategory === cat 
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
              }
            `}
          >
            <span className="capitalize">{cat}</span>
            {counts[cat] !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeCategory === cat ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}>
                {counts[cat]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};