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
  getVotedPolls,
  getVoteDetails,
  getCachedPollResultsBySlug,
} from './storage.service';
import { getActivePolls, getPollBySlug } from './poll.service';
import { supabase } from '../lib/supabase';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
export interface PollWithStatus extends Poll {
  userHasVoted: boolean;
  userVotedFor?: string | null;
}

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
// UTILITY: RESOLVE SLUG TO UUID
// ============================================================================

/**
 * 🔥 CRITICAL FIX: Resolve slug or ID to UUID
 * Handles both slugs ("best-sports-facilities") and UUIDs
 */
async function resolvePollId(pollIdOrSlug: string): Promise<string | null> {
  // Check if it's already a UUID (contains dashes in UUID format)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (uuidRegex.test(pollIdOrSlug)) {
    console.log('[Voting] Already a UUID:', pollIdOrSlug);
    return pollIdOrSlug; // Already a UUID
  }
  
  // It's a slug, fetch the poll to get UUID
  console.log('[Voting] Resolving slug to UUID:', pollIdOrSlug);
  const pollRes = await getPollBySlug(pollIdOrSlug);
  
  if (!pollRes.success || !pollRes.data) {
    console.error('[Voting] Could not resolve slug to UUID:', pollIdOrSlug);
    return null;
  }
  
  console.log('[Voting] Resolved to UUID:', pollRes.data.id);
  return pollRes.data.id;
}

// ============================================================================
// MAIN VOTING OPERATIONS
// ============================================================================

/**
 * Cast a vote with automatic fingerprinting and validation
 * This is the main function components should call
 */
export async function castVote(
  pollIdOrSlug: string,
  universityId: string,
  voterType?: 'student' | 'alumni' | 'applicant' | 'other'
): Promise<VoteResponse> {
  try {
    console.log('[Voting] Attempting to cast vote:', { pollIdOrSlug, universityId });

    // 🔥 FIX: Resolve to UUID first
    const pollId = await resolvePollId(pollIdOrSlug);
    if (!pollId) {
      return {
        success: false,
        error: 'Poll not found',
      };
    }

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
 * 🔥 FIXED: Now handles both slugs and UUIDs
 */
export async function checkIfVoted(pollIdOrSlug: string): Promise<boolean> {
  try {
    // 🔥 FIX: Resolve to UUID first
    const pollId = await resolvePollId(pollIdOrSlug);
    if (!pollId) {
      console.error('[Voting] Cannot check vote status - poll not found');
      return false;
    }

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
    return false;
  }
}

/**
 * Validate if a vote can be submitted
 * 🔥 FIXED: Now handles both slugs and UUIDs
 */
export async function canVote(pollIdOrSlug: string): Promise<VoteValidation> {
  try {
    // 🔥 FIX: Resolve to UUID first
    const pollId = await resolvePollId(pollIdOrSlug);
    if (!pollId) {
      return {
        canVote: false,
        reason: 'Poll not found',
      };
    }

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
 * 🔥 FIXED: Better slug handling
 */
export async function getPollWithResults(
  slug: string,
): Promise<DatabaseResponse<{
  poll: Poll | null;
  results: PollResult[];
  totalVotes: number;
}>> {
  try {
    // Check cache by slug before hitting DB
    const cached = getCachedPollResultsBySlug(slug);
    if (cached) {
      console.log('[Voting] Using cached results for slug:', slug);
      return {
        success: true,
        data: {
          poll: null, // Note: Cache doesn't store full poll object
          results: cached.results,
          totalVotes: cached.totalVotes
        },
        error: null
      };
    }

    console.log('[Voting] Fetching fresh results for:', slug);
    const response = await dbGetPollWithResults(slug);

    if (response.success && response.data && response.data.poll) {
      const { poll, results, totalVotes } = response.data;
      
      const aggregate: PollResultsAggregate & { pollSlug: string } = {
        pollId: poll.id,
        pollSlug: slug, // Store slug for mapping
        pollQuestion: poll.question,
        category: poll.category,
        totalVotes: totalVotes,
        results: results,
        lastUpdated: new Date().toISOString(),
        cycleMonth: poll.cycleMonth,
      };

      cachePollResults(poll.id, aggregate);
    }

    return response;
  } catch (err) {
    console.error('[Voting] Unexpected error getting poll results:', err);
    return { success: false, data: null, error: 'Failed to fetch poll results' };
  }
}

/**
 * Get poll results by ID (with caching)
 * 🔥 FIXED: Now handles both slugs and UUIDs
 */
export async function getPollResultsById(
  pollIdOrSlug: string,
  useCache: boolean = true
): Promise<DatabaseResponse<PollResultsAggregate>> {
  try {
    // 🔥 FIX: Resolve to UUID first
    const pollId = await resolvePollId(pollIdOrSlug);
    if (!pollId) {
      return { success: false, data: null, error: 'Poll not found' };
    }

    if (useCache) {
      const cached = getCachedPollResults(pollId);
      if (cached) return { success: true, data: cached, error: null };
    }

    // Fetch from database using standard supabase client
    const { data: resultsData, error } = await supabase
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollId)
      .order('votes', { ascending: false });

    if (error) throw error;
    if (!resultsData || resultsData.length === 0) {
      return { success: false, data: null, error: 'No results found' };
    }

    const totalVotes = resultsData.reduce((sum, r) => sum + (r.votes || 0), 0);
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
      pollQuestion: resultsData[0].poll_question,
      category: resultsData[0].category as PollCategory,
      totalVotes,
      results,
      lastUpdated: new Date().toISOString(),
      cycleMonth: resultsData[0].cycle_month,
    };

    cachePollResults(pollId, aggregate);
    return { success: true, data: aggregate, error: null };
  } catch (err) {
    console.error('[Voting] Error fetching results:', err);
    return { success: false, data: null, error: 'Failed to fetch results' };
  }
}

/**
 * PRODUCTION-READY FUNCTION
 * Gets all active polls for a category and enriches them with the user's voting status.
 */
export async function getPollsForVoting(
  category: PollCategory
): Promise<DatabaseResponse<PollWithStatus[]>> {
  try {
    const pollsResponse = await getActivePolls(category);
    
    if (!pollsResponse.success || !pollsResponse.data) {
      return { success: false, data: null, error: pollsResponse.error || 'No polls.' };
    }

    const votedPollIds = getVotedPolls();
    const voteDetails = getVoteDetails();

    const pollsWithStatus: PollWithStatus[] = pollsResponse.data.map(poll => {
      const hasVoted = votedPollIds.includes(poll.id);
      return {
        ...poll,
        userHasVoted: hasVoted,
        userVotedFor: hasVoted ? (voteDetails[poll.id]?.universityId || null) : null,
      };
    });

    return { success: true, data: pollsWithStatus, error: null };
  } catch {
    return { success: false, data: null, error: 'Session initialization failed.' };
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