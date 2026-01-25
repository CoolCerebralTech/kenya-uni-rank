// ============================================================================
// useRealtime - Live Vote Subscriptions (FIXED)
// Manages Supabase realtime subscriptions for live updates
// ============================================================================

import { useEffect, useState, useRef, useMemo } from 'react';
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

  // Stable callback ref to prevent effect re-runs
  const callbackRef = useRef(onVoteReceived);
  useEffect(() => {
    callbackRef.current = onVoteReceived;
  }, [onVoteReceived]);

  useEffect(() => {
    // 1. If disabled/invalid, do nothing. 
    // The cleanup function from the previous run has already set isConnected(false),
    // or the default state is false. No need to call setState here.
    if (!enabled || !pollId) {
      return;
    }

    let active = true;
    let unsubscribe: (() => void) | null = null;

    const setupSubscription = () => {
      try {
        console.log('[useRealtime] Subscribing to poll:', pollId);
        
        const handler = () => {
          if (!active) return;
          console.log('[useRealtime] New vote received for poll:', pollId);
          
          setLastVoteTime(new Date());
          setVoteCount((prev) => prev + 1);
          invalidatePollResultsCache(pollId);
          callbackRef.current?.();
        };

        unsubscribe = subscribeToPollVotes(pollId, handler);
        
        if (active) {
          setIsConnected(true);
          setError(null);
        }
      } catch (err) {
        if (active) {
          console.error('[useRealtime] Subscription error:', err);
          setError(err instanceof Error ? err : new Error('Subscription failed'));
          setIsConnected(false);
        }
      }
    };

    setupSubscription();

    // Cleanup: This handles resetting state when pollId changes or component unmounts
    return () => {
      active = false;
      if (unsubscribe) {
        unsubscribe();
      }
      setIsConnected(false);
    };
  }, [pollId, enabled]);

  return {
    isConnected,
    lastVoteTime,
    voteCount,
    error,
  };
}

/**
 * Hook to subscribe to multiple polls at once
 */
export function useMultipleRealtime(
  pollIds: string[],
  enabled = true
): Record<string, UseRealtimeResult> {
  const [results, setResults] = useState<Record<string, UseRealtimeResult>>({});
  
  // Serialize dependencies to prevent loops
  const serializedPollIds = useMemo(() => pollIds.sort().join(','), [pollIds]);

  useEffect(() => {
    if (!enabled || pollIds.length === 0) return;

    const unsubscribers: (() => void)[] = [];

    pollIds.forEach((pollId) => {
      try {
        const unsubscribe = subscribeToPollVotes(pollId, () => {
          setResults(prev => ({
            ...prev,
            [pollId]: {
              isConnected: true,
              lastVoteTime: new Date(),
              voteCount: (prev[pollId]?.voteCount || 0) + 1,
              error: null
            },
          }));
        });
        unsubscribers.push(unsubscribe);
      } catch (err) {
        console.error(`[useMultipleRealtime] Error subscribing to ${pollId}:`, err);
      }
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedPollIds, enabled]);

  return results;
}

export default useRealtime;