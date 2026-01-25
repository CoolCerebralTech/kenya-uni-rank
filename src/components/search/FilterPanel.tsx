import React from 'react';
import { Filter, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-slate-900 border-l border-slate-800 shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-white">
          <Filter size={18} className="text-cyan-400" /> Filters
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* University Type */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">University Type</h4>
          <div className="space-y-2">
            {['Public', 'Private'].map((type) => (
              <label key={type} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.type?.includes(type) ? 'bg-cyan-600 border-cyan-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                  {filters.type?.includes(type) && <Check size={12} className="text-white" />}
                </div>
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Category</h4>
          <div className="grid grid-cols-2 gap-2">
            {['General', 'Vibes', 'Academics', 'Sports', 'Social', 'Facilities'].map((cat) => (
              <button
                key={cat}
                onClick={() => onFilterChange({ ...filters, category: cat })} // Simplified logic
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  filters.category === cat 
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Status</h4>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            value={filters.status}
            onChange={(e) => onFilterChange({...filters, status: e.target.value})}
          >
            <option value="all">All Polls</option>
            <option value="active">Active (Voting Open)</option>
            <option value="closed">Closed (Results Only)</option>
            <option value="voted">Voted</option>
          </select>
        </div>

      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900 flex gap-3">
        <Button variant="ghost" fullWidth onClick={onReset}>Reset</Button>
        <Button variant="primary" fullWidth onClick={onClose}>Apply Filters</Button>
      </div>
    </div>
  );
};