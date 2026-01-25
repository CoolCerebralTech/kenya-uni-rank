import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search polls, unis, or categories..." 
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
    
    // Keyboard shortcut (CMD/CTRL + K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (val: string) => {
    setQuery(val);
    
    // Debounce handled by parent usually, but we trigger immediate here
    const timer = setTimeout(() => onSearch(val), 300);
    return () => clearTimeout(timer);
  };

  const submitSearch = (val: string) => {
    if (!val.trim()) return;
    onSearch(val);
    setQuery(val);
    setIsFocused(false);
    
    // Save to recent
    const updated = [val, ...recentSearches.filter(s => s !== val)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  return (
    <div className="relative w-full group">
      <div className="relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicks
          onKeyDown={(e) => e.key === 'Enter' && submitSearch(query)}
          placeholder={placeholder}
          leftIcon={<Search className="text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={18} />}
          className="bg-slate-900/50 backdrop-blur-sm border-slate-700 focus:border-cyan-500/50"
        />
        
        {/* Clear Button */}
        {query && (
          <button 
            onClick={() => { setQuery(''); onSearch(''); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
        
        {/* Shortcut Hint */}
        {!query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center gap-1">
             <kbd className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
          </div>
        )}
      </div>

      {/* Recent Searches Dropdown */}
      {isFocused && !query && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
           <div className="px-4 py-2 text-[10px] uppercase font-bold text-slate-500 bg-slate-950/50">
             Recent Searches
           </div>
           {recentSearches.map((term, i) => (
             <button
               key={i}
               onClick={() => submitSearch(term)}
               className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left group/item"
             >
               <Clock size={14} className="text-slate-500 group-hover/item:text-cyan-400" />
               {term}
               <ArrowRight size={14} className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
             </button>
           ))}
        </div>
      )}
    </div>
  );
};