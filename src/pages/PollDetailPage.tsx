import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { getPollWithResults } from '../services';
import type { Poll, PollResult } from '../types';
import { 
  PollResults,
  UniversityBarChart,
  CategoryPieChart,
  LoadingSkeleton 
} from '../components';

export const PollDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'bar' | 'pie'>('list');

  useEffect(() => {
    const loadPoll = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await getPollWithResults(slug);
        
        setPoll(data.poll);
        setResults(data.results);
        setTotalVotes(data.totalVotes);
      } catch (error) {
        console.error('Failed to load poll:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPoll();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-48 bg-background-subtle dark:bg-background-hover rounded-lg animate-pulse" />
        <LoadingSkeleton variant="poll" count={1} />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <TrendingUp size={48} className="mx-auto mb-4 text-text-muted opacity-50" />
        <h2 className="text-2xl font-bold text-text dark:text-white mb-2">
          Poll Not Found
        </h2>
        <p className="text-text-subtle dark:text-gray-400 mb-6">
          This poll might have been removed or doesn't exist
        </p>
        <Link
          to="/polls"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary-hover transition-colors"
        >
          <ArrowLeft size={20} />
          Browse All Polls
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/polls"
        className="inline-flex items-center gap-2 text-text-subtle dark:text-gray-400 hover:text-brand-primary transition-colors animate-fade-in"
      >
        <ArrowLeft size={20} />
        <span>Back to Polls</span>
      </Link>

      {/* Poll Header */}
      <div className="rounded-2xl bg-white dark:bg-background-elevated border border-border-light dark:border-border p-8 animate-fade-in-up">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full uppercase tracking-wide">
            {poll.category}
          </span>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
            </span>
            <span className="font-semibold text-success">Live</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-text dark:text-white mb-4">
          {poll.question}
        </h1>

        <div className="flex items-center gap-6 text-sm text-text-subtle dark:text-gray-400">
          <span className="flex items-center gap-2">
            <TrendingUp size={16} />
            {totalVotes.toLocaleString()} total votes
          </span>
          <span>•</span>
          <span>{results.length} universities</span>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <span className="text-sm font-semibold text-text dark:text-white mr-2">View:</span>
        {[
          { id: 'list', label: 'List', icon: BarChart3 },
          { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
          { id: 'pie', label: 'Pie Chart', icon: PieChartIcon }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as typeof viewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              viewMode === mode.id
                ? 'bg-brand-primary text-white shadow-lg'
                : 'bg-white dark:bg-background-elevated text-text-subtle dark:text-gray-400 border border-border-light dark:border-border hover:border-brand-primary/50'
            }`}
          >
            <mode.icon size={16} />
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Results Display */}
      <div className="rounded-2xl bg-white dark:bg-background-elevated border border-border-light dark:border-border p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        {viewMode === 'list' && (
          <PollResults pollId={poll.id} enableRealtime={true} />
        )}

        {viewMode === 'bar' && results.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-text dark:text-white mb-6">
              Vote Distribution
            </h3>
            <UniversityBarChart data={results} />
          </div>
        )}

        {viewMode === 'pie' && results.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-text dark:text-white mb-6">
              Vote Share
            </h3>
            <CategoryPieChart data={results} />
          </div>
        )}

        {results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-subtle dark:text-gray-400">
              No votes yet. Be the first to vote!
            </p>
          </div>
        )}
      </div>

      {/* Share CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary p-8 text-white text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h3 className="text-xl font-bold mb-2">
          Share This Poll
        </h3>
        <p className="text-white/90 mb-4">
          Help others discover this poll and share their opinion
        </p>
        <button
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
          }}
          className="px-6 py-3 bg-white text-brand-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
};