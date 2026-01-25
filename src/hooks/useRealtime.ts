// ============================================================================
// useRealtime - Live Vote Subscriptions
// Manages Supabase realtime subscriptions for live updates
// ============================================================================

import { useEffect, useState, useCallback } from 'react';
import { subscribeToPollVotes } from '../services/database.service';
import { invalidatePollResultsCache } from '../services/storage.service';

interface UseRealtimeOptions {
  pollId: string;
  enabled?: boolean;
  onVoteReceived?: () => void;
}

interface UseRealtimeResult {
  isConnected: boolean;
  lastVoteTime: Date | null;
  voteCount: number;
  error: Error | null;
}

/**
 * Hook to subscribe to real-time vote updates for a poll
 * Automatically invalidates cache and triggers refresh
 * 
 * @example
 * const { isConnected, voteCount } = useRealtime({
 *   pollId: poll.id,
 *   enabled: hasVoted,
 *   onVoteReceived: () => refreshResults(),
 * });
 */
export function useRealtime({
  pollId,
  enabled = true,
  onVoteReceived,
}: UseRealtimeOptions): UseRealtimeResult {
  const [isConnected, setIsConnected] = useState(false);
  const [lastVoteTime, setLastVoteTime] = useState<Date | null>(null);
  const [voteCount, setVoteCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const handleVoteReceived = useCallback(() => {
    console.log('[useRealtime] New vote received for poll:', pollId);
    
    // Update state
    setLastVoteTime(new Date());
    setVoteCount(prev => prev + 1);
    
    // Invalidate cache
    invalidatePollResultsCache(pollId);
    
    // Trigger callback
    onVoteReceived?.();
  }, [pollId, onVoteReceived]);

  useEffect(() => {
    if (!enabled || !pollId) {
      console.log('[useRealtime] Subscription disabled or no pollId');
      return;
    }

    console.log('[useRealtime] Subscribing to poll:', pollId);
    setIsConnected(true);

    try {
      // Subscribe to vote updates
      const unsubscribe = subscribeToPollVotes(pollId, handleVoteReceived);

      // Cleanup
      return () => {
        console.log('[useRealtime] Unsubscribing from poll:', pollId);
        setIsConnected(false);
        unsubscribe();
      };
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Subscription failed');
      console.error('[useRealtime] Subscription error:', err);
      setError(errorObj);
      setIsConnected(false);
    }
  }, [pollId, enabled, handleVoteReceived]);

  return {
    isConnected,
    lastVoteTime,
    voteCount,
    error,
  };
}

/**
 * Hook to subscribe to multiple polls at once
 * Useful for results pages showing many polls
 */
export function useMultipleRealtime(
  pollIds: string[],
  enabled = true
): Record<string, UseRealtimeResult> {
  const [results, setResults] = useState<Record<string, UseRealtimeResult>>({});

  useEffect(() => {
    if (!enabled || pollIds.length === 0) return;

    const unsubscribers: (() => void)[] = [];

    pollIds.forEach((pollId) => {
      const unsubscribe = subscribeToPollVotes(pollId, () => {
        setResults(prev => ({
          ...prev,
          [pollId]: {
            ...prev[pollId],
            lastVoteTime: new Date(),
            voteCount: (prev[pollId]?.voteCount || 0) + 1,
          },
        }));
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [pollIds, enabled]);

  return results;
}

export default useRealtime;