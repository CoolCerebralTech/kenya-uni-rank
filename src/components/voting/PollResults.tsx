import React, { useEffect, useState, useCallback } from 'react';
import { getPollWithResults, subscribeToPollVotes } from '../../services';
import type { PollResult } from '../../types';
import { PollResultList } from '../charts/PollResultList';
import { Loader2, RefreshCw, TrendingUp } from 'lucide-react';

interface PollResultsProps {
  pollId: string;
  autoRefresh?: boolean;
  enableRealtime?: boolean;
}

export const PollResults: React.FC<PollResultsProps> = ({ 
  pollId, 
  autoRefresh = true,
  enableRealtime = true 
}) => {
  const [results, setResults] = useState<PollResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch results from database
  const fetchResults = useCallback(async () => {
    try {
      const { results: pollResults, totalVotes: total } = await getPollWithResults(pollId);
      
      setResults(pollResults);
      setTotalVotes(total);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load results', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pollId]);

  // Initial load
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Auto-refresh interval (Backup for realtime)
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchResults();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchResults]);

  // Real-time subscription
  useEffect(() => {
    if (!enableRealtime) return;

    const unsubscribe = subscribeToPollVotes(pollId, () => {
      // New vote detected, refresh results
      fetchResults();
    });

    return unsubscribe;
  }, [enableRealtime, pollId, fetchResults]);

  // Manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchResults();
  };

  // Calculate time since last update string
  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400 animate-fade-in">
        <Loader2 className="animate-spin mb-3 text-blue-600" size={32} />
        <span className="text-sm">Loading results...</span>
      </div>
    );
  }

  if (totalVotes === 0) {
    return (
      <div className="py-8 text-center animate-fade-in">
        <TrendingUp size={48} className="mx-auto mb-3 text-gray-300 opacity-50" />
        <p className="text-gray-500 dark:text-gray-400 mb-1">
          No votes yet
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Be the first to vote!
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-gray-900 dark:text-white">Live Results</h4>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold border border-green-200 dark:border-green-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </span>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
      
      {/* Results List */}
      <PollResultList results={results} totalVotes={totalVotes} />
      
      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
        <span className="text-gray-400 dark:text-gray-500">
          Updated {getTimeSinceUpdate()}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 dark:text-gray-400">
            Total: <span className="font-bold text-gray-900 dark:text-white">{totalVotes.toLocaleString()}</span> votes
          </span>
          <span className="text-gray-400 dark:text-gray-500">
            {results.length} universities
          </span>
        </div>
      </div>
    </div>
  );
};