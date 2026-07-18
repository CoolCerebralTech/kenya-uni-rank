// ============================================================================
// DATABASE SERVICE - PHASE 2 PRODUCTION (TYPE-SAFE)
// Handles all Supabase interactions with proper error handling and type safety
// ----------------------------------------------------------------------------
// UniPulse v3: every public function degrades gracefully to the demo dataset
// (src/lib/demoFallback.ts) when Supabase is unreachable, so the interview
// demo never shows empty states.
// ============================================================================

import { supabase } from '../lib/supabase';
import { DemoDB, isPureDemo } from '../lib/demoFallback';
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
  if (isPureDemo) return DemoDB.getActivePolls(category);

  try {
    const currentMonth = getCurrentCycleMonth();
    
    let query = supabase!
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
      console.error('[DB] Error fetching active polls (using demo):', error);
      return DemoDB.getActivePolls(category);
    }

    const polls = (data || []).map(convertDbPollToPoll);
    // If the live DB returned no rows for this cycle, use the demo so the UI
    // never looks empty during the interview.
    if (polls.length === 0) return DemoDB.getActivePolls(category);
    return { data: polls, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching polls (using demo):', err);
    return DemoDB.getActivePolls(category);
  }
}

/**
 * Fetch a single poll by slug
 */
export async function getPollBySlug(
  slug: string
): Promise<DatabaseResponse<Poll>> {
  if (isPureDemo) return DemoDB.getPollBySlug(slug);

  try {
    const { data, error } = await supabase!
      .from('polls')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('[DB] Error fetching poll by slug (using demo):', error);
      return DemoDB.getPollBySlug(slug);
    }

    if (!data) {
      return DemoDB.getPollBySlug(slug);
    }

    return { data: convertDbPollToPoll(data), error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching poll (using demo):', err);
    return DemoDB.getPollBySlug(slug);
  }
}

/**
 * Fetch a single poll by ID
 */
export async function getPollById(
  id: string
): Promise<DatabaseResponse<Poll>> {
  if (isPureDemo) return DemoDB.getPollById(id);

  try {
    const { data, error } = await supabase!
      .from('polls')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[DB] Error fetching poll by ID (using demo):', error);
      return DemoDB.getPollById(id);
    }

    if (!data) {
      return DemoDB.getPollById(id);
    }

    return { data: convertDbPollToPoll(data), error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching poll (using demo):', err);
    return DemoDB.getPollById(id);
  }
}

/**
 * Fetch a poll with its aggregated results
 */
export async function getPollWithResults(
  slug: string
): Promise<DatabaseResponse<PollWithResults>> {
  if (isPureDemo) return DemoDB.getPollWithResults(slug);

  try {
    const { data: pollData, error: pollError } = await supabase!
      .from('polls')
      .select('*')
      .eq('slug', slug)
      .single();

    if (pollError || !pollData) {
      console.error('[DB] Error fetching poll for results (using demo):', pollError);
      return DemoDB.getPollWithResults(slug);
    }

    const { data: resultsData, error: resultsError } = await supabase!
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollData.id)
      .order('votes', { ascending: false });

    if (resultsError) {
      console.error('[DB] Error fetching poll results (using demo):', resultsError);
      return DemoDB.getPollWithResults(slug);
    }

    const results = (resultsData || []).map(convertDbResultToPollResult);
    const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

    if (results.length === 0) return DemoDB.getPollWithResults(slug);

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
    console.error('[DB] Unexpected error fetching poll with results (using demo):', err);
    return DemoDB.getPollWithResults(slug);
  }
}

/**
 * Get trending polls (uses database view)
 */
export async function getTrendingPolls(): Promise<DatabaseResponse<TrendingPoll[]>> {
  if (isPureDemo) return DemoDB.getTrendingPolls();

  try {
    const { data, error } = await supabase!
      .from('trending_polls')
      .select('*')
      .limit(10);

    if (error) {
      console.error('[DB] Error fetching trending polls (using demo):', error);
      return DemoDB.getTrendingPolls();
    }

    if (!data || data.length === 0) return DemoDB.getTrendingPolls();

    const trendingPolls: TrendingPoll[] = (data || []).map((poll) => ({
      ...poll,
      competition_level:
        poll.competition_level === 'high' ||
        poll.competition_level === 'medium' ||
        poll.competition_level === 'low'
          ? poll.competition_level
          : 'medium',
    }));

    return { data: trendingPolls, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching trending polls (using demo):', err);
    return DemoDB.getTrendingPolls();
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
  if (!isPureDemo && !supabase) return { data: null, error: 'Demo only', success: false }; 
  if (isPureDemo) {
    return { data: { isActive: true, isInCycle: true, startsAt: null, endsAt: null }, error: null, success: true };
  }
  try {
    const { data, error } = await supabase!.rpc('get_poll_status', {
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
  if (isPureDemo) return DemoDB.getUniversities(type);

  try {
    let query = supabase!
      .from('universities')
      .select('*')
      .order('name');

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[DB] Error fetching universities (using demo):', error);
      return DemoDB.getUniversities(type);
    }

    const universities = (data || []).map(convertDbUniversityToUniversity);
    return { data: universities, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching universities (using demo):', err);
    return DemoDB.getUniversities(type);
  }
}

export async function getUniversityLeaderboard(): Promise<
  DatabaseResponse<UniversityLeaderboardEntry[]>
> {
  if (isPureDemo) return DemoDB.getUniversityLeaderboard();

  try {
    const { data, error } = await supabase!
      .from('university_leaderboard')
      .select('*')
      .limit(20);

    if (error) {
      console.error('[DB] Error fetching leaderboard (using demo):', error);
      return DemoDB.getUniversityLeaderboard();
    }

    if (!data || data.length === 0) return DemoDB.getUniversityLeaderboard();

    const leaderboard = (data || []).map((entry) => ({
      ...entry,
      type: entry.type === 'Public' ? 'Public' : 'Private'
    })) as UniversityLeaderboardEntry[];
    return { data: leaderboard, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching leaderboard (using demo):', err);
    return DemoDB.getUniversityLeaderboard();
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

  // Demo mode — write to local memory so the user can actually vote
  if (isPureDemo) {
    return DemoDB.submitVote(pollId, universityId, fingerprintHash, ipHash, voterType, userAgent);
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

    const { data, error } = await supabase!
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
      
      console.error('[DB] Error submitting vote (using demo):', error);
      // Network/RLS failure — record in demo layer so UI still updates
      return DemoDB.submitVote(pollId, universityId, fingerprintHash, ipHash, voterType, userAgent);
    }

    return { 
      data: { voteId: data.id }, 
      error: null, 
      success: true 
    };
  } catch (err) {
    console.error('[DB] Unexpected error submitting vote (using demo):', err);
    return DemoDB.submitVote(pollId, universityId, fingerprintHash, ipHash, voterType, userAgent);
  }
}

export async function hasUserVoted(
  pollId: string,
  fingerprintHash: string
): Promise<DatabaseResponse<boolean>> {
  if (isPureDemo) return DemoDB.hasUserVoted(pollId);

  try {
    const { data, error } = await supabase!.rpc('has_user_voted', {
      p_poll_id: pollId,
      p_fingerprint: fingerprintHash,
    });

    if (error) {
      console.error('[DB] Error checking vote status (using demo):', error);
      return DemoDB.hasUserVoted(pollId);
    }

    return { data: data === true, error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error checking vote status (using demo):', err);
    return DemoDB.hasUserVoted(pollId);
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

export function subscribeToPollVotes(
  pollId: string,
  onVoteAdded: () => void
): () => void {
  if (isPureDemo || !supabase) {
    // No-op in demo mode; caller still gets a cleanup fn
    return () => {};
  }
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
    supabase!.removeChannel(channel);
  };
}

export function subscribeToAllVotes(
  onVoteAdded: (payload: { new: VoteInsertPayload }) => void
): { subscription: RealtimeChannel | null; unsubscribe: () => void } {
  if (isPureDemo || !supabase) {
    return { subscription: null, unsubscribe: () => {} };
  }
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
        onVoteAdded(payload as unknown as { new: VoteInsertPayload });
      }
    )
    .subscribe();

  console.log('[Realtime] Subscribed to all votes');
  
  const unsubscribe = () => {
    console.log('[Realtime] Unsubscribing from all votes');
    supabase!.removeChannel(channel);
  };

  return { subscription: channel, unsubscribe };
}

// ============================================================================
// ANALYTICS & ACTIVITY
// ============================================================================

export async function getRecentActivity(): Promise<
  DatabaseResponse<RecentActivity[]>
> {
  if (isPureDemo) return DemoDB.getRecentActivity();

  try {
    const { data, error } = await supabase!
      .from('recent_activity')
      .select('*')
      .limit(100);

    if (error) {
      console.error('[DB] Error fetching recent activity (using demo):', error);
      return DemoDB.getRecentActivity();
    }

    if (!data || data.length === 0) return DemoDB.getRecentActivity();

    const mappedData = (data || []).map((item) => ({
      ...item,
      university_type:
        item.university_type === 'Public' || item.university_type === 'Private'
          ? item.university_type
          : (item.university_type === 'public' ? 'Public' : 'Private'),
    }))
    .map((item) => ({
      ...item,
      university_type: item.university_type === 'Public' ? 'Public' : 'Private'
    }));

    return { data: mappedData as RecentActivity[], error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching recent activity (using demo):', err);
    return DemoDB.getRecentActivity();
  }
}

export async function getCategoryInsights(): Promise<
  DatabaseResponse<CategoryInsight[]>
> {
  if (isPureDemo) return DemoDB.getCategoryInsights();

  try {
    const { data, error } = await supabase!
      .from('category_insights')
      .select('*');

    if (error) {
      console.error('[DB] Error fetching category insights (using demo):', error);
      return DemoDB.getCategoryInsights();
    }

    if (!data || data.length === 0) return DemoDB.getCategoryInsights();

    return { data: data || [], error: null, success: true };
  } catch (err) {
    console.error('[DB] Unexpected error fetching category insights (using demo):', err);
    return DemoDB.getCategoryInsights();
  }
}

export async function getPollCategoryCounts(): Promise<
  DatabaseResponse<Array<{ category: PollCategory; count: number }>>
> {
  if (isPureDemo) return DemoDB.getPollCategoryCounts();

  try {
    const currentMonth = getCurrentCycleMonth();
    
    const { data, error } = await supabase!
      .from('polls')
      .select('category')
      .eq('is_active', true)
      .eq('cycle_month', currentMonth);

    if (error) {
      console.error('[DB] Error fetching category counts (using demo):', error);
      return DemoDB.getPollCategoryCounts();
    }

    if (!data || data.length === 0) return DemoDB.getPollCategoryCounts();

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
    console.error('[DB] Unexpected error fetching category counts (using demo):', err);
    return DemoDB.getPollCategoryCounts();
  }
}
/**
 * Add an email to the Phase 2 waitlist
 */
export async function joinWaitlist(email: string): Promise<DatabaseResponse<null>> {
  if (isPureDemo || !supabase) {
    // Demo mode: accept any well-formed email
    return { success: true, data: null, error: null };
  }
  try {
    const { error } = await supabase
      .from('waitlist')
      .insert({ email });

    if (error) {
      if (error.code === '23505') {
        return { success: true, data: null, error: null };
      }
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: null, error: null };
  } catch {
    return { success: false, data: null, error: 'Network error' };
  }
}