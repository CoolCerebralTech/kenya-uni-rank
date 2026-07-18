import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { SearchBar } from '../components/search/SearchBar';
import { CategoryFilter } from '../components/search/CategoryFilter';
import { FilterPanel, type SearchFilters } from '../components/search/FilterPanel';
import { PollCard } from '../components/voting/PollCard';
import { RacingSkeleton } from '../components/ui/RacingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SlidersHorizontal, Search as SearchIcon } from 'lucide-react';

// Services
import { getActivePolls } from '../services/poll.service';
import { searchUniversities } from '../services/university.service';
import { getVotedPolls } from '../services/storage.service';
import type { Poll, University, PollCategory } from '../types/models';

// Demo fallback
import { DEMO_POLLS } from '../lib/demoData';
import { isPureDemo } from '../lib/demoFallback';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = (searchParams.get('category') as PollCategory | 'all') || 'all';

  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    category: 'all',
    status: 'all',
  });

  const performSearch = useCallback(async (query: string, category: string) => {
    setIsLoading(true);
    try {
      const targetCategory = category === 'all' ? undefined : (category as PollCategory);

      // University search is local, always works
      const uniResults = searchUniversities(query);
      setUniversities(uniResults);

      // Polls
      const pollRes = await getActivePolls(targetCategory);
      if (pollRes.success && pollRes.data && pollRes.data.length > 0) {
        const filtered = pollRes.data.filter(p =>
          p.question.toLowerCase().includes(query.toLowerCase())
        );
        setPolls(filtered);
      } else if (isPureDemo) {
        // Fall back to demo polls
        const demoFiltered = DEMO_POLLS.filter(p =>
          (targetCategory ? p.category === targetCategory : true) &&
          p.question.toLowerCase().includes(query.toLowerCase())
        );
        setPolls(demoFiltered);
      } else {
        setPolls([]);
      }

      setVotedIds(getVotedPolls());
    } catch (error) {
      console.error('Search failed:', error);
      // Final fallback
      const demoFiltered = DEMO_POLLS.filter(p =>
        p.question.toLowerCase().includes(query.toLowerCase())
      );
      setPolls(demoFiltered);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch(queryParam, categoryParam);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [queryParam, categoryParam, performSearch]);

  const handleSearch = (q: string) => {
    setSearchParams(prev => {
      if (q) prev.set('q', q);
      else prev.delete('q');
      return prev;
    });
  };

  const handleCategorySelect = (cat: PollCategory | 'all') => {
    setSearchParams(prev => {
      if (cat !== 'all') prev.set('category', cat);
      else prev.delete('category');
      return prev;
    });
  };

  const resetFilters = () => {
    setFilters({ type: [], category: 'all', status: 'all' });
    setSearchParams({});
  };

  const hasResults = polls.length > 0 || universities.length > 0;

  return (
    <AppLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">

        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto">
          <Badge variant="neon" className="mb-3">Search the truth</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
            Find a Battle
          </h1>
          <p className="text-slate-400 text-sm">
            Search across polls and universities.
          </p>
        </header>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SearchBar onSearch={handleSearch} initialValue={queryParam} />
          <Button
            variant="secondary"
            className="shrink-0"
            leftIcon={<SlidersHorizontal size={16} />}
            onClick={() => setIsFilterOpen(true)}
          >
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>

        {/* CATEGORY FILTER */}
        <div>
          <CategoryFilter
            activeCategory={categoryParam}
            onSelect={handleCategorySelect}
            counts={{
              all: polls.length,
              [categoryParam]: polls.length,
            }}
          />
        </div>

        {/* RESULTS */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <RacingSkeleton key={i} count={1} />)}
          </div>
        ) : hasResults ? (
          <div className="space-y-10">

            {/* Universities */}
            {universities.length > 0 && (
              <section>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-4">
                  Universities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {universities.map(uni => (
                    <button
                      key={uni.id}
                      onClick={() => navigate(`/university/${uni.id}`)}
                      className="group p-4 rounded-xl glass border border-slate-800/60 hover:border-cyan-500/40 transition-all text-center hover:-translate-y-0.5"
                    >
                      <div
                        className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: uni.color }}
                      >
                        {uni.shortName}
                      </div>
                      <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {uni.name}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Polls */}
            {polls.length > 0 && (
              <section>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-4">
                  Battlefields
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {polls.map(poll => (
                    <PollCard
                      key={poll.id}
                      poll={poll}
                      hasVoted={votedIds.includes(poll.id)}
                      totalVotes={0}
                      onVote={() => navigate(`/vote/${poll.category}`)}
                      onViewResults={() => navigate(`/poll/${poll.slug}`)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <EmptyState
            title="No matches found"
            description={`Nothing matched "${queryParam}". Try searching for categories like "Vibes" or unis like "Strathmore".`}
            icon={<SearchIcon size={48} className="text-slate-700" />}
            actionLabel="Clear Search"
            onAction={resetFilters}
          />
        )}

        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
        />
      </div>
    </AppLayout>
  );
};
