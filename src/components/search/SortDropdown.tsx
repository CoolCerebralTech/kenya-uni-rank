import React from 'react';
import { ArrowDownUp, TrendingUp, Clock, BarChart2, Type } from 'lucide-react';

interface SortDropdownProps {
  value: string;
  onChange: (val: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white hover:border-slate-500 transition-all">
        <ArrowDownUp size={16} />
        <span className="hidden sm:inline">Sort by:</span>
        <span className="font-bold text-white capitalize">{value.replace('-', ' ')}</span>
      </button>

      <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
        {[
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'most-voted', label: 'Most Voted', icon: BarChart2 },
          { id: 'newest', label: 'Newest', icon: Clock },
          { id: 'alpha', label: 'A-Z', icon: Type },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-slate-800 transition-colors ${
              value === opt.id ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-400'
            }`}
          >
            <opt.icon size={14} />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};