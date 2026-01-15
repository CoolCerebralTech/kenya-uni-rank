import React, { useEffect, useState } from 'react';
import { getActivePolls, getPollCategories } from '../../services';
import type { Poll } from '../../types';
import { PollCard } from './PollCard';
import { CategoryFilter } from './CategoryFilter';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Search, AlertCircle, Sparkles } from 'lucide-react';

export const PollList: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Fetch polls on mount
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [pollsData, categoriesData] = await Promise.all([
          getActivePolls(),
          getPollCategories()
        ]);
        
        setPolls(pollsData);
        
        // Build category counts map
        const counts: Record<string, number> = {};
        categoriesData.forEach(cat => {
          counts[cat.category] = cat.count;
        });
        setCategoryCounts(counts);
        
      } catch (err) {
        console.error('Failed to load polls', err);
        setError('Failed to load polls. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Filter polls based on category and search
  useEffect(() => {
    let filtered = polls;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(poll => 
        poll.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(poll =>
        poll.question.toLowerCase().includes(query) ||
        poll.category.toLowerCase().includes(query)
      );
    }

    setFilteredPolls(filtered);
  }, [polls, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-64 bg-background-subtle dark:bg-background-hover rounded-xl animate-pulse" />
        </div>
        <LoadingSkeleton variant="poll" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-danger/10 dark:bg-danger/20 border-2 border-danger/30 p-8 text-center animate-fade-in">
        <AlertCircle size={48} className="mx-auto mb-4 text-danger" />
        <h3 className="text-xl font-bold text-danger mb-2">Oops!</h3>
        <p className="text-text-subtle dark:text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-danger text-white rounded-lg hover:bg-danger-dark transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-background-elevated border border-border-light dark:border-border p-12 text-center shadow-md animate-fade-in">
        <Sparkles size={48} className="mx-auto mb-4 text-brand-primary opacity-50" />
        <h3 className="text-xl font-bold text-text dark:text-white mb-2">
          No Active Polls Yet
        </h3>
        <p className="text-text-subtle dark:text-gray-400">
          Check back soon for new polls!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative animate-fade-in-up">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
        <input
          type="text"
          placeholder="Search polls..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border-light dark:border-border bg-white dark:bg-background-elevated text-text dark:text-white placeholder:text-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
        />
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <p className="text-sm text-text-subtle dark:text-gray-400">
          Showing <span className="font-bold text-text dark:text-white">{filteredPolls.length}</span> {filteredPolls.length === 1 ? 'poll' : 'polls'}
          {selectedCategory && (
            <span className="ml-1">
              in <span className="font-semibold text-brand-primary">{selectedCategory}</span>
            </span>
          )}
        </p>
        {(selectedCategory || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className="text-sm text-brand-primary hover:text-brand-primary-hover font-medium transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Poll Cards */}
      {filteredPolls.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-background-elevated border border-border-light dark:border-border p-12 text-center shadow-md animate-fade-in">
          <Search size={48} className="mx-auto mb-4 text-text-muted opacity-50" />
          <h3 className="text-xl font-bold text-text dark:text-white mb-2">
            No Polls Found
          </h3>
          <p className="text-text-subtle dark:text-gray-400 mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
          >
            Show All Polls
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPolls.map((poll, index) => (
            <div 
              key={poll.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PollCard poll={poll} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};