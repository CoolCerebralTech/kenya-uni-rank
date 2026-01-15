import { supabase } from '../lib/supabase';
import type { Poll, PollResult, University } from '../types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================================================
// TYPE DEFINITIONS FOR DATABASE VIEWS
// ============================================================================

export interface TrendingPoll {
  id: string;
  question: string;
  slug: string;
  category: string;
  total_votes: number;
  universities_voted: number;
  last_vote_time: string;
}

export interface UniversityLeaderboardEntry {
  id: string;
  name: string;
  short_name: string;
  type: 'Public' | 'Private';
  color: string;
  total_votes_received: number;
  polls_participated: number;
}

export interface RecentActivity {
  created_at: string;
  poll_question: string;
  poll_slug: string;
  category: string;
  university_name: string;
  university_short_name: string;
  university_color: string;
}

export interface VotePayload {
  poll_id: string;
  university_id: string;
  fingerprint_hash: string;
  ip_hash?: string;
}

export interface RealtimeVotePayload {
  new: {
    id: string;
    poll_id: string;
    university_id: string;
    created_at: string;
  };
}

// ============================================================================
// POLLS
// ============================================================================

/**
 * Fetch all active polls
 * @param category - Optional category filter ('vibes', 'sports', etc.)
 */
export async function getActivePolls(category?: string): Promise<Poll[]> {
  try {
    let query = supabase
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

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
 * Fetch a single poll by slug
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
 * Fetch a single poll by ID
 */
export async function getPollById(id: string): Promise<Poll | null> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('id', id)
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
 * Fetch a single poll with its aggregated results
 * This is the MAIN function for displaying poll data
 */
export async function getPollWithResults(slug: string): Promise<{
  poll: Poll | null;
  results: PollResult[];
  totalVotes: number;
}> {
  try {
    // Get the poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('slug', slug)
      .single();

    if (pollError || !pollData) {
      console.error('Error fetching poll:', pollError);
      return { poll: null, results: [], totalVotes: 0 };
    }

    // Get aggregated results from the view (NOT raw votes)
    const { data: resultsData, error: resultsError } = await supabase
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollData.id);

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

    // Sort by votes descending
    results.sort((a, b) => b.votes - a.votes);

    return {
      poll: pollData as Poll,
      results,
      totalVotes,
    };
  } catch (err) {
    console.error('Unexpected error fetching poll with results:', err);
    return { poll: null, results: [], totalVotes: 0 };
  }
}

/**
 * Get trending polls (most voted)
 */
export async function getTrendingPolls(): Promise<TrendingPoll[]> {
  try {
    const { data, error } = await supabase
      .from('trending_polls')
      .select('*');

    if (error) {
      console.error('Error fetching trending polls:', error);
      return [];
    }

    return (data || []) as TrendingPoll[];
  } catch (err) {
    console.error('Unexpected error fetching trending polls:', err);
    return [];
  }
}

// ============================================================================
// UNIVERSITIES
// ============================================================================

/**
 * Get all universities
 * @param type - Optional filter by 'Public' or 'Private'
 */
export async function getUniversities(type?: 'Public' | 'Private'): Promise<University[]> {
  try {
    let query = supabase
      .from('universities')
      .select('*')
      .order('name');

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching universities:', error);
      return [];
    }

    return data as University[];
  } catch (err) {
    console.error('Unexpected error fetching universities:', err);
    return [];
  }
}

/**
 * Get university leaderboard (overall rankings)
 */
export async function getUniversityLeaderboard(): Promise<UniversityLeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('university_leaderboard')
      .select('*');

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return (data || []) as UniversityLeaderboardEntry[];
  } catch (err) {
    console.error('Unexpected error fetching leaderboard:', err);
    return [];
  }
}

// ============================================================================
// VOTING
// ============================================================================

/**
 * Submit a vote
 * @param pollId - UUID of the poll
 * @param universityId - ID of the university being voted for
 * @param fingerprint - Browser fingerprint hash
 * @param ipHash - Optional IP hash for additional security
 */
export async function submitVote(
  pollId: string,
  universityId: string,
  fingerprint: string,
  ipHash?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const voteData: VotePayload = {
      poll_id: pollId,
      university_id: universityId,
      fingerprint_hash: fingerprint,
    };

    if (ipHash) {
      voteData.ip_hash = ipHash;
    }

    const { error } = await supabase.from('votes').insert(voteData);

    if (error) {
      // Check if it's a duplicate vote error (PostgreSQL unique constraint)
      if (error.code === '23505') {
        return { 
          success: false, 
          error: 'You have already voted in this poll' 
        };
      }
      
      console.error('Error submitting vote:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to submit vote' 
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error submitting vote:', err);
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}

/**
 * Check if user has already voted in a poll
 * Uses the database function for security
 */
export async function hasUserVoted(
  pollId: string,
  fingerprint: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('has_user_voted', {
        p_poll_id: pollId,
        p_fingerprint: fingerprint,
      });

    if (error) {
      console.error('Error checking vote status:', error);
      return false;
    }

    return data === true;
  } catch (err) {
    console.error('Unexpected error checking vote status:', err);
    return false;
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS 🔴 LIVE
// ============================================================================

/**
 * Subscribe to real-time vote updates for a specific poll
 * Returns a cleanup function to unsubscribe
 */
export function subscribeToPollVotes(
  pollId: string,
  onVoteAdded: () => void
): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`poll:${pollId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'votes',
        filter: `poll_id=eq.${pollId}`,
      },
      () => {
        // New vote detected! Trigger callback to refresh results
        onVoteAdded();
      }
    )
    .subscribe();

  // Return cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to all vote activity (for activity feed)
 */
export function subscribeToAllVotes(
  onVoteAdded: (payload: RealtimeVotePayload) => void
): () => void {
  const channel: RealtimeChannel = supabase
    .channel('all-votes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'votes',
      },
      (payload) => {
        onVoteAdded(payload as unknown as RealtimeVotePayload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ============================================================================
// ACTIVITY & ANALYTICS
// ============================================================================

/**
 * Get recent voting activity (last 50 votes)
 */
export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    const { data, error } = await supabase
      .from('recent_activity')
      .select('*');

    if (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }

    return (data || []) as RecentActivity[];
  } catch (err) {
    console.error('Unexpected error fetching recent activity:', err);
    return [];
  }
}

/**
 * Get poll categories with counts
 */
export async function getPollCategories(): Promise<
  Array<{ category: string; count: number }>
> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('category')
      .eq('is_active', true);

    if (error || !data) {
      console.error('Error fetching categories:', error);
      return [];
    }

    // Count polls per category
    const categoryMap = new Map<string, number>();
    data.forEach((item) => {
      const count = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, count + 1);
    });

    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  } catch (err) {
    console.error('Unexpected error fetching categories:', err);
    return [];
  }
}