import { supabase } from '../lib/supabase';
import type { Poll, PollResult } from '../types';
import { getFingerprint } from './fingerprint.service';
import { 
  submitVote as dbSubmitVote, 
  hasUserVoted as dbHasUserVoted,
  subscribeToPollVotes 
} from './database.service';

// ============================================================================
// VOTING SERVICE - High-level voting operations
// ============================================================================

/**
 * Cast a vote with automatic fingerprinting
 * This is the main function components should call
 */
export async function castVote(
  pollId: string,
  universityId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get browser fingerprint automatically
    const fingerprint = await getFingerprint();
    
    // Submit vote to database
    const result = await dbSubmitVote(pollId, universityId, fingerprint);
    
    return result;
  } catch (err) {
    console.error('Error casting vote:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Check if current user has already voted in a poll
 */
export async function checkIfVoted(pollId: string): Promise<boolean> {
  try {
    const fingerprint = await getFingerprint();
    return await dbHasUserVoted(pollId, fingerprint);
  } catch (err) {
    console.error('Error checking vote status:', err);
    return false;
  }
}

/**
 * Get a poll with its current results
 */
export async function getPollWithResults(pollId: string): Promise<{
  poll: Poll | null;
  results: PollResult[];
  totalVotes: number;
}> {
  try {
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single();

    if (pollError || !pollData) {
      console.error('Error fetching poll:', pollError);
      return { poll: null, results: [], totalVotes: 0 };
    }

    const { data: resultsData, error: resultsError } = await supabase
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollId)
      .order('vote_count', { ascending: false });

    if (resultsError) {
      console.error('Error fetching results:', resultsError);
      return { poll: pollData as Poll, results: [], totalVotes: 0 };
    }

    // Calculate total votes and percentages
    const totalVotes = resultsData.reduce((sum, item) => sum + item.vote_count, 0);

    const results: PollResult[] = resultsData.map((item) => ({
      universityId: item.university_id,
      universityName: item.university_name,
      universityColor: item.university_color,
      votes: item.vote_count,
      percentage: totalVotes > 0 ? (item.vote_count / totalVotes) * 100 : 0,
    }));

    return {
      poll: pollData as Poll,
      results,
      totalVotes,
    };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { poll: null, results: [], totalVotes: 0 };
  }
}

/**
 * Get all active polls
 */
export async function getActivePolls(): Promise<Poll[]> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching polls:', error);
      return [];
    }

    return data as Poll[];
  } catch (err) {
    console.error('Unexpected error fetching polls:', err);
    return [];
  }
}

/**
 * Get polls by category
 */
export async function getPollsByCategory(category: string): Promise<Poll[]> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching polls by category:', error);
      return [];
    }

    return data as Poll[];
  } catch (err) {
    console.error('Unexpected error fetching polls by category:', err);
    return [];
  }
}

/**
 * Get a single poll by slug
 */
export async function getPollBySlug(slug: string): Promise<Poll | null> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Error fetching poll:', error);
      return null;
    }

    return data as Poll;
  } catch (err) {
    console.error('Unexpected error fetching poll:', err);
    return null;
  }
}

/**
 * Subscribe to real-time vote updates for a poll
 * Returns cleanup function
 */
export function subscribeToVotes(
  pollId: string,
  onUpdate: () => void
): () => void {
  return subscribeToPollVotes(pollId, onUpdate);
}

// ============================================================================
// VOTE VALIDATION (Client-side helpers)
// ============================================================================

/**
 * Validate if a vote can be submitted
 */
export async function canVote(pollId: string): Promise<{
  canVote: boolean;
  reason?: string;
}> {
  // Check if already voted
  const hasVoted = await checkIfVoted(pollId);
  
  if (hasVoted) {
    return {
      canVote: false,
      reason: 'You have already voted in this poll',
    };
  }

  return { canVote: true };
}

// ============================================================================
// BATCH OPERATIONS (For performance)
// ============================================================================

/**
 * Get multiple polls with their results at once
 * Useful for dashboard/homepage
 */
export async function getMultiplePollsWithResults(
  pollIds: string[]
): Promise<Array<{
  poll: Poll;
  results: PollResult[];
  totalVotes: number;
}>> {
  try {
    const promises = pollIds.map((id) => getPollWithResults(id));
    const results = await Promise.all(promises);
    
    // Filter out failed fetches
    return results.filter((r) => r.poll !== null) as Array<{
      poll: Poll;
      results: PollResult[];
      totalVotes: number;
    }>;
  } catch (err) {
    console.error('Error fetching multiple polls:', err);
    return [];
  }
}