import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SearchBar } from '../components/search/SearchBar';
import { CategoryFilter } from '../components/search/CategoryFilter';
import { FilterPanel, type SearchFilters } from '../components/search/FilterPanel';
import { PollCard } from '../components/voting/PollCard';
import { RacingSkeleton } from '../components/ui/RacingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { SlidersHorizontal, Search as SearchIcon } from 'lucide-react';

// Services
import { getActivePolls } from '../services/poll.service';
import { searchUniversities } from '../services/university.service';
import { getVotedPolls } from '../services/storage.service';
import type { Poll, University, PollCategory } from '../types/models';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = (searchParams.get('category') as PollCategory | 'all') || 'all';

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    category: 'all',   // ✅ fixed casing
    status: 'all'
  });

  // --- DATA FETCHING ---
  const performSearch = useCallback(async (query: string, category: string) => {
    setIsLoading(true);
    try {
      // 1. Fetch Polls
      const targetCategory = category === 'all' ? undefined : (category as PollCategory);
      const pollRes = await getActivePolls(targetCategory);
      
      // 2. Fetch Universities
      const uniResults = searchUniversities(query);
      setUniversities(uniResults);

      if (pollRes.success && pollRes.data) {
        // Filter polls client-side based on query
        const filteredPolls = pollRes.data.filter(p => 
          p.question.toLowerCase().includes(query.toLowerCase())
        );
        setPolls(filteredPolls);
      }
      
      setVotedIds(getVotedPolls());
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync state with URL and fetch
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch(queryParam, categoryParam);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [queryParam, categoryParam, performSearch]);

  // --- HANDLERS ---
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
    setFilters({ type: [], category: 'all', status: 'all' }); // ✅ fixed casing
    setSearchParams({});
  };

  // --- RENDERING LOGIC ---
  const hasResults = polls.length > 0 || universities.length > 0;

  return (
    <AppLayout>
      <div className="bg-slate-950 min-h-screen">
        <PageContainer maxWidth="xl" title="Global Search">
          
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center gap-4">
              <SearchBar onSearch={handleSearch} initialValue={queryParam} />
              <Button 
                variant="secondary" 
                className="shrink-0"
                leftIcon={<SlidersHorizontal size={18} />}
                onClick={() => setIsFilterOpen(true)}
              >
                Filters
              </Button>
            </div>

            <CategoryFilter 
              activeCategory={categoryParam} 
              onSelect={handleCategorySelect}
              counts={{
                all: polls.length,
                [categoryParam]: polls.length // Simplified for display
              }}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <RacingSkeleton key={i} count={1} />)}
            </div>
          ) : hasResults ? (
            <div className="space-y-12">
              
              {/* University Matches */}
              {universities.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Universities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {universities.map(uni => (
                      <button 
                        key={uni.id}
                        onClick={() => window.location.href = `/university/${uni.id}`}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all text-center group"
                      >
                        <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center text-white font-bold" style={{ backgroundColor: uni.color }}>
                          {uni.shortName}
                        </div>
                        <div className="text-xs font-bold text-white truncate">{uni.name}</div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Poll Matches */}
              {polls.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Battlefields</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {polls.map(poll => (
                      <PollCard 
                        key={poll.id}
                        poll={poll}
                        hasVoted={votedIds.includes(poll.id)}
                        totalVotes={0} // ✅ added required prop
                        onVote={() => window.location.href = `/vote/${poll.category}`}
                        onViewResults={() => window.location.href = `/poll/${poll.slug}`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <EmptyState 
              title="Intelligence Gap" 
              description={`No matches found for "${queryParam}". Try searching for categories like "Vibes" or unis like "Strathmore".`}
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

        </PageContainer>
      </div>
    </AppLayout>
  );
};
