// ============================================================================
// DATABASE SERVICE - PHASE 2 PRODUCTION (TYPE-SAFE)
// Handles all Supabase interactions with proper error handling and type safety
// ============================================================================

import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { Poll, PollResult, University, PollCategory } from '../types/models';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================================================
// TYPE ALIASES FOR CLEANER CODE
// ============================================================================

type DbPoll = Database['public']['Tables']['polls']['Row'];
type DbUniversity = Database['public']['Tables']['universities']['Row'];
type DbVoteInsert = Database['public']['Tables']['votes']['Insert'];
type DbPollResult = Database['public']['Views']['poll_results']['Row'];
type VoteInsertPayload = Database['public']['Tables']['votes']['Insert'] & { created_at: string };

// ============================================================================
// RESPONSE WRAPPER TYPES
// ============================================================================

export interface DatabaseResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PollWithResults {
  poll: Poll | null;
  results: PollResult[];
  totalVotes: number;
}

// ============================================================================
// DATABASE VIEW TYPES (Match SQL exactly)
// ============================================================================

export interface TrendingPoll {
  id: string;
  question: string;
  slug: string;
  category: string;
  cycle_month: string | null;
  total_votes: number;
  universities_competing: number;
  last_vote_time: string;
  competition_level: 'high' | 'medium' | 'low';
}

export interface UniversityLeaderboardEntry {
  id: string;
  name: string;
  short_name: string;
  type: 'Public' | 'Private';
  color: string;
  location: string;
  total_votes_received: number;
  polls_participated: number;
  first_place_finishes: number;
}

export interface RecentActivity {
  created_at: string;
  poll_question: string;
  poll_slug: string;
  category: string;
  university_name: string;
  university_short_name: string;
  university_color: string;
  university_type: 'Public' | 'Private';
  voter_type: string | null;
}

export interface CategoryInsight {
  category: string;
  total_polls: number;
  total_votes: number;
  universities_active: number;
  recent_activity_percentage: number;
  is_trending: boolean;
}

// ============================================================================
// UTILITY: DATABASE ROW CONVERTERS (snake_case → camelCase)
// ============================================================================

function convertDbPollToPoll(dbPoll: DbPoll): Poll {
  return {
    id: dbPoll.id,
    question: dbPoll.question,
    slug: dbPoll.slug,
    category: dbPoll.category as PollCategory,
    isActive: dbPoll.is_active,
    startsAt: dbPoll.starts_at,
    endsAt: dbPoll.ends_at,
    cycleMonth: dbPoll.cycle_month,
    description: dbPoll.description ?? undefined,
    displayOrder: dbPoll.display_order,
    createdAt: dbPoll.created_at,
    updatedAt: dbPoll.updated_at,
  };
}

function convertDbUniversityToUniversity(dbUni: DbUniversity): University {
  return {
    id: dbUni.id,
    slug: dbUni.slug,
    name: dbUni.name,
    shortName: dbUni.short_name,
    type: dbUni.type,
    location: dbUni.location,
    color: dbUni.color,
    description: dbUni.description ?? undefined,
    established: dbUni.established ?? undefined,
    website: dbUni.website ?? undefined,
    studentPopulation: dbUni.student_population ?? undefined,
    campusSize: dbUni.campus_size ?? undefined,
  };
}

function convertDbResultToPollResult(dbResult: DbPollResult): PollResult {
  return {
    pollId: dbResult.poll_id,
    pollQuestion: dbResult.poll_question,
    category: dbResult.category as PollCategory,
    cycleMonth: dbResult.cycle_month,
    universityId: dbResult.university_id,
    universityName: dbResult.university_name,
    universityShortName: dbResult.university_short_name,
    universityColor: dbResult.university_color,
    universityType: dbResult.university_type as 'Public' | 'Private',
    votes: dbResult.votes,
    percentage: dbResult.percentage,
    rank: dbResult.rank,
  };
}

// ============================================================================
// UTILITY: CYCLE MONTH HELPER
// ============================================================================

export function getCurrentCycleMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// ============================================================================
// POLLS API
// ============================================================================

/**
 * Fetch all active polls for current cycle
 */
export async function getActivePolls(
  category?: PollCategory
): Promise<DatabaseResponse<Poll[]>> {
  try {
    const currentMonth = getCurrentCycleMonth();
    
    let query = supabase
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .eq('cycle_month', currentMonth)
      .order('display_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[DB] Error fetching active polls:', error);
      return { data: null, error: error.message, success: false };
    }

    const polls = (data || []).map(convertDbPollToPoll);
    return { data: polls, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching polls:', err);
    return { 
      data: null, 
      error: 'Failed to fetch polls. Please try again.', 
      success: false 
    };
  }
}

/**
 * Fetch a single poll by slug
 */
export async function getPollBySlug(
  slug: string
): Promise<DatabaseResponse<Poll>> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('[DB] Error fetching poll by slug:', error);
      return { data: null, error: error.message, success: false };
    }

    if (!data) {
      return { data: null, error: 'Poll not found', success: false };
    }

    return { data: convertDbPollToPoll(data), error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching poll:', err);
    return { 
      data: null, 
      error: 'Failed to fetch poll. Please try again.', 
      success: false 
    };
  }
}

/**
 * Fetch a single poll by ID
 */
export async function getPollById(
  id: string
): Promise<DatabaseResponse<Poll>> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[DB] Error fetching poll by ID:', error);
      return { data: null, error: error.message, success: false };
    }

    if (!data) {
      return { data: null, error: 'Poll not found', success: false };
    }

    return { data: convertDbPollToPoll(data), error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching poll:', err);
    return { 
      data: null, 
      error: 'Failed to fetch poll. Please try again.', 
      success: false 
    };
  }
}

/**
 * Fetch a poll with its aggregated results
 */
export async function getPollWithResults(
  slug: string
): Promise<DatabaseResponse<PollWithResults>> {
  try {
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('slug', slug)
      .single();

    if (pollError || !pollData) {
      console.error('[DB] Error fetching poll for results:', pollError);
      return { 
        data: null, 
        error: pollError?.message || 'Poll not found', 
        success: false 
      };
    }

    const { data: resultsData, error: resultsError } = await supabase
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollData.id)
      .order('votes', { ascending: false });

    if (resultsError) {
      console.error('[DB] Error fetching poll results:', resultsError);
      return { 
        data: { 
          poll: convertDbPollToPoll(pollData), 
          results: [], 
          totalVotes: 0 
        }, 
        error: resultsError.message, 
        success: false 
      };
    }

    const results = (resultsData || []).map(convertDbResultToPollResult);
    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

    return {
      data: {
        poll: convertDbPollToPoll(pollData),
        results,
        totalVotes,
      },
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('[DB] Unexpected error fetching poll with results:', err);
    return { 
      data: null, 
      error: 'Failed to load poll results. Please try again.', 
      success: false 
    };
  }
}

/**
 * Get trending polls (uses database view)
 */
export async function getTrendingPolls(): Promise<DatabaseResponse<TrendingPoll[]>> {
  try {
    const { data, error } = await supabase
      .from('trending_polls')
      .select('*')
      .limit(10);

    if (error) {
      console.error('[DB] Error fetching trending polls:', error);
      return { data: null, error: error.message, success: false };
    }

    // Ensure each item in data has the correct competition_level type
    const trendingPolls: TrendingPoll[] = (data || []).map((poll) => ({
      ...poll,
      competition_level:
        poll.competition_level === 'high' ||
        poll.competition_level === 'medium' ||
        poll.competition_level === 'low'
          ? poll.competition_level
          : 'medium', // fallback value if unexpected string
    }));

    return { data: trendingPolls, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching trending polls:', err);
    return { 
      data: null, 
      error: 'Failed to fetch trending polls.', 
      success: false 
    };
  }
}

/**
 * PHASE 2: Check poll status (uses database function)
 */
export async function getPollStatus(pollId: string): Promise<DatabaseResponse<{
  isActive: boolean;
  isInCycle: boolean;
  startsAt: string | null;
  endsAt: string | null;
}>> {
  try {
    const { data, error } = await supabase.rpc('get_poll_status', {
      p_poll_id: pollId,
    });

    if (error) {
      console.error('[DB] Error checking poll status:', error);
      return { data: null, error: error.message, success: false };
    }

    // RPC returns array, get first result
    const status = Array.isArray(data) && data.length > 0 ? data[0] : null;

    if (!status) {
      return { 
        data: null, 
        error: 'Poll status unavailable', 
        success: false 
      };
    }

    return {
      data: {
        isActive: status.is_active,
        isInCycle: status.is_in_cycle,
        startsAt: status.starts_at,
        endsAt: status.ends_at,
      },
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('[DB] Unexpected error checking poll status:', err);
    return { 
      data: null, 
      error: 'Failed to check poll status.', 
      success: false 
    };
  }
}

// ============================================================================
// UNIVERSITIES API
// ============================================================================

export async function getUniversities(
  type?: 'Public' | 'Private'
): Promise<DatabaseResponse<University[]>> {
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
      console.error('[DB] Error fetching universities:', error);
      return { data: null, error: error.message, success: false };
    }

    const universities = (data || []).map(convertDbUniversityToUniversity);
    return { data: universities, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching universities:', err);
    return { 
      data: null, 
      error: 'Failed to fetch universities.', 
      success: false 
    };
  }
}

export async function getUniversityLeaderboard(): Promise<
  DatabaseResponse<UniversityLeaderboardEntry[]>
> {
  try {
    const { data, error } = await supabase
      .from('university_leaderboard')
      .select('*')
      .limit(20);

    if (error) {
      console.error('[DB] Error fetching leaderboard:', error);
      return { data: null, error: error.message, success: false };
    }

    // Ensure the `type` property is cast to the correct type
    const leaderboard = (data || []).map((entry) => ({
      ...entry,
      type: entry.type === 'Public' ? 'Public' : 'Private'
    })) as UniversityLeaderboardEntry[];
    return { data: leaderboard, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching leaderboard:', err);
    return { 
      data: null, 
      error: 'Failed to fetch leaderboard.', 
      success: false 
    };
  }
}

// ============================================================================
// VOTING API
// ============================================================================

export async function submitVote(
  pollId: string,
  universityId: string,
  fingerprintHash: string,
  ipHash?: string,
  voterType?: 'student' | 'alumni' | 'applicant' | 'other',
  userAgent?: string
): Promise<DatabaseResponse<{ voteId: string }>> {
  
  if (!fingerprintHash) {
    return { data: null, error: 'Identity verification failed', success: false };
  }

  try {
    const voteData: DbVoteInsert = {
      poll_id: pollId,
      university_id: universityId,
      fingerprint_hash: fingerprintHash,
      ip_hash: ipHash || null,
      voter_type: voterType || null,
      user_agent: userAgent || null,
    };

    const { data, error } = await supabase
      .from('votes')
      .insert(voteData)
      .select('id')
      .single();

    if (error) {
      // 23505 is Supabase/PostgreSQL code for "Unique Violation" (Already Voted)
      if (error.code === '23505') {
        return { 
          data: null, 
          error: 'You have already submitted your intelligence for this battle.', 
          success: false 
        };
      }
      
      console.error('[DB] Error submitting vote:', error);
      return { 
        data: null, 
        error: error.message || 'Failed to submit vote', 
        success: false 
      };
    }

    return { 
      data: { voteId: data.id }, 
      error: null, 
      success: true 
    };
  } catch (err) {
    console.error('[DB] Unexpected error:', err);
    return { 
      data: null, 
      error: 'The Truth Engine is temporarily offline.', 
      success: false 
    };
  }
}

export async function hasUserVoted(
  pollId: string,
  fingerprintHash: string
): Promise<DatabaseResponse<boolean>> {
  try {
    const { data, error } = await supabase.rpc('has_user_voted', {
      p_poll_id: pollId,
      p_fingerprint: fingerprintHash,
    });

    if (error) {
      console.error('[DB] Error checking vote status:', error);
      return { data: null, error: error.message, success: false };
    }

    return { data: data === true, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error checking vote status:', err);
    return { 
      data: null, 
      error: 'Failed to check vote status.', 
      success: false 
    };
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

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
        console.log('[Realtime] New vote received for poll:', pollId);
        onVoteAdded();
      }
    )
    .subscribe();

  console.log('[Realtime] Subscribed to poll:', pollId);

  return () => {
    console.log('[Realtime] Unsubscribing from poll:', pollId);
    supabase.removeChannel(channel);
  };
}

export function subscribeToAllVotes(
  onVoteAdded: (payload: { new: VoteInsertPayload }) => void
): { subscription: RealtimeChannel; unsubscribe: () => void } {
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
        console.log('[Realtime] New vote received:', payload);
        // FIX: Pass the entire payload, which includes the 'new' record
        onVoteAdded(payload as unknown as { new: VoteInsertPayload });
      }
    )
    .subscribe();

  console.log('[Realtime] Subscribed to all votes');
  
  const unsubscribe = () => {
    console.log('[Realtime] Unsubscribing from all votes');
    supabase.removeChannel(channel);
  };

  return { subscription: channel, unsubscribe };
}

// ============================================================================
// ANALYTICS & ACTIVITY
// ============================================================================

export async function getRecentActivity(): Promise<
  DatabaseResponse<RecentActivity[]>
> {
  try {
    const { data, error } = await supabase
      .from('recent_activity')
      .select('*')
      .limit(100);

    if (error) {
      console.error('[DB] Error fetching recent activity:', error);
      return { data: null, error: error.message, success: false };
    }

    // Ensure the types from the database are mapped to match RecentActivity,
    // with university_type as 'Public' or 'Private'
    const mappedData = (data || []).map((item) => ({
      ...item,
      university_type:
        item.university_type === 'Public' || item.university_type === 'Private'
          ? item.university_type
          : (item.university_type === 'public' ? 'Public' : 'Private'),
    }))
    // Fix typing: ensure university_type is always the correct literal type
    .map((item) => ({
      ...item,
      university_type: item.university_type === 'Public' ? 'Public' : 'Private'
    }));

    return { data: mappedData as RecentActivity[], error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching recent activity:', err);
    return { 
      data: null, 
      error: 'Failed to fetch recent activity.', 
      success: false 
    };
  }
}

export async function getCategoryInsights(): Promise<
  DatabaseResponse<CategoryInsight[]>
> {
  try {
    const { data, error } = await supabase
      .from('category_insights')
      .select('*');

    if (error) {
      console.error('[DB] Error fetching category insights:', error);
      return { data: null, error: error.message, success: false };
    }

    return { data: data || [], error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching category insights:', err);
    return { 
      data: null, 
      error: 'Failed to fetch category insights.', 
      success: false 
    };
  }
}

export async function getPollCategoryCounts(): Promise<
  DatabaseResponse<Array<{ category: PollCategory; count: number }>>
> {
  try {
    const currentMonth = getCurrentCycleMonth();
    
    const { data, error } = await supabase
      .from('polls')
      .select('category')
      .eq('is_active', true)
      .eq('cycle_month', currentMonth);

    if (error) {
      console.error('[DB] Error fetching category counts:', error);
      return { data: null, error: error.message, success: false };
    }

    const categoryMap = new Map<PollCategory, number>();
    (data || []).forEach((item) => {
      const category = item.category as PollCategory;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const counts = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));

    return { data: counts, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching category counts:', err);
    return { 
      data: null, 
      error: 'Failed to fetch category counts.', 
      success: false 
    };
  }
}
/**
 * Add an email to the Phase 2 waitlist
 */
export async function joinWaitlist(email: string): Promise<DatabaseResponse<null>> {
  try {
    const { error } = await supabase
      .from('waitlist')
      .insert({ email });

    if (error) {
      // Error code 23505 means "Unique Violation" (Email already exists)
      if (error.code === '23505') {
        return { success: true, data: null, error: null }; // Treat as success for the user
      }
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: null, error: null };
  } catch {
    return { success: false, data: null, error: 'Network error' };
  }
}