import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search polls, unis, or categories...",
  initialValue = ""
}) => {
  const [query, setQuery] = useState(initialValue);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recent_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (CMD/CTRL + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (val: string) => {
    setQuery(val);
    onSearch(val); // Parent handles debounce
  };

  const submitSearch = (val: string) => {
    if (!val.trim()) return;
    onSearch(val);
    setQuery(val);
    setIsFocused(false);
    
    // Save to recent
    setRecentSearches(prev => {
      const updated = [val, ...prev.filter(s => s !== val)].slice(0, 5);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="relative w-full group">
      <div className="relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={(e) => e.key === 'Enter' && submitSearch(query)}
          placeholder={placeholder}
          leftIcon={<Search className="text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={18} />}
          className="bg-slate-900/50 backdrop-blur-sm border-slate-700 focus:border-cyan-500/50"
        />
        
        {query && (
          <button 
            type="button"
            onClick={() => { setQuery(''); onSearch(''); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
            aria-label="Clear search"
            title="Clear"
          >
            <X size={16} />
          </button>
        )}
        
        {!query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center gap-1">
             <kbd className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 font-sans">⌘K</kbd>
          </div>
        )}
      </div>

      {isFocused && !query && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
           <div className="px-4 py-2 text-[10px] uppercase font-bold text-slate-500 bg-slate-950/50">
             Recent Searches
           </div>
           {recentSearches.map((term, i) => (
             <button
               key={i}
               type="button"
               onClick={() => submitSearch(term)}
               className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left group/item"
               aria-label={`Search for ${term}`}
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