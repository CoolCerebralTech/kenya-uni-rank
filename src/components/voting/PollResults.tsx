import React, { useEffect, useState, useCallback } from 'react';
import { VotingService } from '../../services/voting';
import type { PollResult } from '../../types';
import { PollResultList } from '../charts/PollResultList';
import { Loader2, RefreshCw } from 'lucide-react';

interface PollResultsProps {
  pollId: string;
  autoRefresh?: boolean;
}

export const PollResults: React.FC<PollResultsProps> = ({ pollId, autoRefresh = true }) => {
  const [results, setResults] = useState<PollResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Wrap fetchResults in useCallback to make it stable
  const fetchResults = useCallback(async () => {
    try {
      const data = await VotingService.getPollResults(pollId);
      setResults(data);
    } catch (error) {
      console.error('Failed to load results', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pollId]); // pollId is the only dependency

  useEffect(() => {
    fetchResults();
    
    if (autoRefresh) {
      // Refresh every 30 seconds
      const interval = setInterval(fetchResults, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchResults, autoRefresh]); // Now includes fetchResults

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResults();
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-gray-400">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  const totalVotes = results.reduce((acc, curr) => acc + curr.votes, 0);

  if (totalVotes === 0) {
    return (
      <div className="py-6 text-center text-sm text-gray-500">
        No votes yet. Be the first!
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-medium text-gray-700">Live Results</h4>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <PollResultList results={results} totalVotes={totalVotes} />
      
      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>Updated just now</span>
        <span>Total votes: {totalVotes.toLocaleString()}</span>
      </div>
    </div>
  );
};