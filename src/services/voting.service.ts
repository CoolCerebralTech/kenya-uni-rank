// ============================================================================
// VOTING SERVICE - PHASE 2 VOTING ENGINE
// High-level voting operations with optimistic UI and caching
// ============================================================================

import type { Poll, PollCategory, PollResult, PollResultsAggregate } from '../types/models';
import { getFingerprint, getSanitizedUserAgent } from './fingerprint.service';
import { 
  submitVote as dbSubmitVote,
  hasUserVoted as dbHasUserVoted,
  subscribeToPollVotes,
  getPollWithResults as dbGetPollWithResults,
  getPollStatus,
  type DatabaseResponse,
} from './database.service';
import { 
  markPollAsVoted,
  hasVotedOnPoll as storageHasVoted,
  getVotedUniversity,
  getStoredVoterType,
  cachePollResults,
  getCachedPollResults,
  invalidatePollResultsCache,
} from './storage.service';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface VoteResponse {
  success: boolean;
  error?: string;
  voteId?: string;
  results?: PollResult[];
}

export interface VoteValidation {
  canVote: boolean;
  reason?: string;
  alreadyVotedFor?: string; // University ID if already voted
}

// ============================================================================
// MAIN VOTING OPERATIONS
// ============================================================================

/**
 * Cast a vote with automatic fingerprinting and validation
 * This is the main function components should call
 */
export async function castVote(
  pollId: string,
  universityId: string,
  voterType?: 'student' | 'alumni' | 'applicant' | 'other'
): Promise<VoteResponse> {
  try {
    console.log('[Voting] Attempting to cast vote:', { pollId, universityId });

    // Step 1: Check localStorage first (instant feedback)
    if (storageHasVoted(pollId)) {
      const votedFor = getVotedUniversity(pollId);
      console.log('[Voting] Already voted (localStorage):', votedFor);
      
      return {
        success: false,
        error: 'You have already voted in this poll',
      };
    }

    // Step 2: Validate poll status
    const validation = await canVote(pollId);
    if (!validation.canVote) {
      console.log('[Voting] Vote validation failed:', validation.reason);
      return {
        success: false,
        error: validation.reason,
      };
    }

    // Step 3: Get browser fingerprint
    const fingerprint = await getFingerprint();
    console.log('[Voting] Fingerprint obtained');

    // Step 4: Use stored voter type if not provided
    const finalVoterType = voterType || getStoredVoterType() || undefined;

    // Step 5: Get sanitized user agent for analytics
    const userAgent = getSanitizedUserAgent();

    // Step 6: Submit vote to database
    const result = await dbSubmitVote(
      pollId,
      universityId,
      fingerprint,
      undefined, // ipHash (server-side only)
      finalVoterType,
      userAgent
    );

    // Step 7: Handle response
    if (result.success) {
      console.log('[Voting] Vote submitted successfully:', result.data?.voteId);
      
      // Mark in localStorage for instant feedback on next check
      markPollAsVoted(pollId, universityId);
      
      // Invalidate results cache to force refresh
      invalidatePollResultsCache(pollId);
      
      return {
        success: true,
        voteId: result.data?.voteId,
      };
    } else {
      console.error('[Voting] Vote submission failed:', result.error);
      
      // If duplicate vote error, sync localStorage
      if (result.error?.includes('already voted')) {
        markPollAsVoted(pollId, universityId);
      }
      
      return {
        success: false,
        error: result.error || 'Failed to submit vote',
      };
    }
  } catch (err) {
    console.error('[Voting] Unexpected error casting vote:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Check if current user has already voted in a poll
 * Checks localStorage first for instant response, then verifies with DB
 */
export async function checkIfVoted(pollId: string): Promise<boolean> {
  try {
    // Quick localStorage check (instant)
    if (storageHasVoted(pollId)) {
      console.log('[Voting] Already voted (localStorage check):', pollId);
      return true;
    }

    // Verify with database (authoritative)
    const fingerprint = await getFingerprint();
    const dbResponse = await dbHasUserVoted(pollId, fingerprint);

    if (!dbResponse.success) {
      console.error('[Voting] DB check failed:', dbResponse.error);
      // Fallback to localStorage on error
      return storageHasVoted(pollId);
    }

    const hasVoted = dbResponse.data || false;

    // Sync localStorage if DB says voted but local doesn't have it
    if (hasVoted && !storageHasVoted(pollId)) {
      console.log('[Voting] Syncing localStorage with DB');
      markPollAsVoted(pollId, 'unknown'); // We don't know which uni
    }

    return hasVoted;
  } catch (err) {
    console.error('[Voting] Error checking vote status:', err);
    // Fallback to localStorage on error
    return storageHasVoted(pollId);
  }
}

/**
 * Validate if a vote can be submitted
 */
export async function canVote(pollId: string): Promise<VoteValidation> {
  try {
    // Step 1: Check if already voted
    const hasVoted = await checkIfVoted(pollId);

    if (hasVoted) {
      const votedFor = getVotedUniversity(pollId);
      return {
        canVote: false,
        reason: 'You have already voted in this poll',
        alreadyVotedFor: votedFor || undefined,
      };
    }

    // Step 2: Check poll status using RPC function
    const statusResponse = await getPollStatus(pollId);

    if (!statusResponse.success || !statusResponse.data) {
      return {
        canVote: false,
        reason: 'Unable to verify poll status',
      };
    }

    const status = statusResponse.data;

    // Step 3: Check if poll is active
    if (!status.isActive) {
      return {
        canVote: false,
        reason: 'This poll is no longer active',
      };
    }

    // Step 4: Check if poll is in cycle
    if (!status.isInCycle) {
      // Determine if poll hasn't started or has ended
      if (status.startsAt) {
        const startDate = new Date(status.startsAt);
        const now = new Date();

        if (now < startDate) {
          return {
            canVote: false,
            reason: 'This poll has not started yet',
          };
        }
      }

      if (status.endsAt) {
        const endDate = new Date(status.endsAt);
        const now = new Date();

        if (now > endDate) {
          return {
            canVote: false,
            reason: 'This poll has ended',
          };
        }
      }

      return {
        canVote: false,
        reason: 'This poll is not currently accepting votes',
      };
    }

    return { canVote: true };
  } catch (err) {
    console.error('[Voting] Error validating vote:', err);
    return {
      canVote: false,
      reason: 'Unable to validate vote status',
    };
  }
}

// ============================================================================
// POLL RESULTS OPERATIONS (WITH CACHING)
// ============================================================================

/**
 * Get a poll with its current results (with caching)
 */
export async function getPollWithResults(
  slug: string,
): Promise<DatabaseResponse<{
  poll: Poll | null;
  results: PollResult[];
  totalVotes: number;
}>> {
  try {
    // Note: getCachedPollResults uses pollId not slug, skip cache for now
    // TODO: Implement slug-to-id cache mapping

    // Fetch from database
    console.log('[Voting] Fetching fresh results for:', slug);
    const response = await dbGetPollWithResults(slug);

    if (response.success && response.data) {
      // Cache the results
      const aggregate: PollResultsAggregate = {
        pollId: response.data.poll?.id || '',
        pollQuestion: response.data.poll?.question || '',
        category: response.data.poll?.category || 'general',
        totalVotes: response.data.totalVotes,
        results: response.data.results,
        lastUpdated: new Date().toISOString(),
        cycleMonth: response.data.poll?.cycleMonth || null,
      };

      if (response.data.poll?.id) {
        cachePollResults(response.data.poll.id, aggregate);
      }
    }

    return response;
  } catch (err) {
    console.error('[Voting] Unexpected error getting poll results:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch poll results',
    };
  }
}

/**
 * Get poll results by ID (with caching)
 */
export async function getPollResultsById(
  pollId: string,
  useCache: boolean = true
): Promise<DatabaseResponse<PollResultsAggregate>> {
  try {
    // Try cache first
    if (useCache) {
      const cached = getCachedPollResults(pollId);
      if (cached) {
        console.log('[Voting] Using cached results for poll ID:', pollId);
        return {
          success: true,
          data: cached,
          error: null,
        };
      }
    }

    // Fetch from database using poll_results view
    const { data: resultsData, error } = await import('../lib/supabase').then(
      ({ supabase }) =>
        supabase
          .from('poll_results')
          .select('*')
          .eq('poll_id', pollId)
          .order('votes', { ascending: false })
    );

    if (error) {
      console.error('[Voting] Error fetching results:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    if (!resultsData || resultsData.length === 0) {
      return {
        success: false,
        data: null,
        error: 'No results found',
      };
    }

    // Build aggregate
    const firstResult = resultsData[0];
    const totalVotes = resultsData.reduce((sum, r) => sum + r.votes, 0);

    const results: PollResult[] = resultsData.map((r) => ({
      pollId: r.poll_id,
      pollQuestion: r.poll_question,
      category: r.category as PollCategory,
      cycleMonth: r.cycle_month,
      universityId: r.university_id,
      universityName: r.university_name,
      universityShortName: r.university_short_name,
      universityColor: r.university_color,
      universityType: r.university_type as 'Public' | 'Private',
      votes: r.votes,
      percentage: r.percentage,
      rank: r.rank,
    }));

    const aggregate: PollResultsAggregate = {
      pollId,
      pollQuestion: firstResult.poll_question,
      category: firstResult.category as PollCategory,
      totalVotes,
      results,
      lastUpdated: new Date().toISOString(),
      cycleMonth: firstResult.cycle_month,
    };

    // Cache it
    cachePollResults(pollId, aggregate);

    return {
      success: true,
      data: aggregate,
      error: null,
    };
  } catch (err) {
    console.error('[Voting] Unexpected error fetching results by ID:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch results',
    };
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to real-time vote updates for a poll
 * Returns cleanup function
 */
export function subscribeToVotes(
  pollId: string,
  onUpdate: () => void
): () => void {
  console.log('[Voting] Subscribing to real-time updates for poll:', pollId);

  const cleanup = subscribeToPollVotes(pollId, () => {
    console.log('[Voting] Real-time vote received, invalidating cache');
    invalidatePollResultsCache(pollId);
    onUpdate();
  });

  return cleanup;
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Check voting status for multiple polls at once
 */
export async function checkMultipleVoteStatus(
  pollIds: string[]
): Promise<Record<string, boolean>> {
  try {
    console.log('[Voting] Checking vote status for', pollIds.length, 'polls');

    const promises = pollIds.map(async (id) => ({
      pollId: id,
      hasVoted: await checkIfVoted(id),
    }));

    const results = await Promise.all(promises);

    const statusMap: Record<string, boolean> = {};
    results.forEach(({ pollId, hasVoted }) => {
      statusMap[pollId] = hasVoted;
    });

    return statusMap;
  } catch (err) {
    console.error('[Voting] Error checking multiple vote statuses:', err);
    
    // Fallback to localStorage for all polls
    const statusMap: Record<string, boolean> = {};
    pollIds.forEach((id) => {
      statusMap[id] = storageHasVoted(id);
    });
    return statusMap;
  }
}

/**
 * Get vote details for multiple polls
 */
export function getMultipleVoteDetails(
  pollIds: string[]
): Record<string, { hasVoted: boolean; votedFor?: string }> {
  const details: Record<string, { hasVoted: boolean; votedFor?: string }> = {};

  pollIds.forEach((pollId) => {
    const hasVoted = storageHasVoted(pollId);
    const votedFor = getVotedUniversity(pollId);

    details[pollId] = {
      hasVoted,
      votedFor: votedFor || undefined,
    };
  });

  return details;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get top university in a poll
 */
export function getTopUniversity(results: PollResult[]): PollResult | null {
  if (results.length === 0) return null;

  return results.reduce((top, current) => {
    return current.votes > top.votes ? current : top;
  });
}

/**
 * Calculate competition level based on vote distribution
 */
export function calculateCompetitionLevel(
  results: PollResult[]
): 'high' | 'medium' | 'low' {
  if (results.length < 3) return 'low';

  const topVotes = results[0]?.votes || 0;
  const secondVotes = results[1]?.votes || 0;

  if (topVotes === 0) return 'low';

  const difference = ((topVotes - secondVotes) / topVotes) * 100;

  if (difference < 10) return 'high'; // Very close race
  if (difference < 30) return 'medium'; // Moderate competition
  return 'low'; // Clear winner
}

/**
 * Get user's voting progress (how many polls voted in)
 */
export function getVotingProgress(): {
  totalVoted: number;
  categories: Record<string, number>;
} {

  // This is synchronous in reality, just for type safety
  return {
    totalVoted: 0,
    categories: {},
  };
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  castVote,
  checkIfVoted,
  canVote,
  getPollWithResults,
  getPollResultsById,
  subscribeToVotes,
  checkMultipleVoteStatus,
  getMultipleVoteDetails,
  getTopUniversity,
  calculateCompetitionLevel,
};