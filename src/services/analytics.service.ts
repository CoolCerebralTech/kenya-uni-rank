// ============================================================================
// ANALYTICS SERVICE - PHASE 2 PRODUCTION
// ============================================================================

import { 
  getTrendingPolls, 
  getUniversityLeaderboard, 
  getRecentActivity,
  getPollCategoryCounts,
  getCategoryInsights,
  type DatabaseResponse,
  type TrendingPoll,
  type UniversityLeaderboardEntry,
  type RecentActivity,
} from './database.service';
import type { PollCategory } from '../types/models';
import { supabase } from '../lib/supabase';

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface PlatformStats {
  totalPolls: number;
  totalVotes: number;
  totalUniversities: number;
  categoriesCount: number;
}

export interface CategoryStats {
  category: PollCategory;
  count: number;
  percentage: number;
}

export interface EngagementMetrics {
  averageVotesPerPoll: number;
  averageVotesPerUniversity: number;
  mostPopularPoll: TrendingPoll | null;
  leastPopularPoll: TrendingPoll | null;
}

export interface CompetitiveCategory {
  category: PollCategory;
  universitiesActive: number;
  totalVotes: number;
  competitionLevel: 'high' | 'medium' | 'low';
}

// ============================================================================
// TRENDING & LEADERBOARDS
// ============================================================================

export async function getTopTrendingPolls(limit = 10): Promise<DatabaseResponse<TrendingPoll[]>> {
  try {
    const response = await getTrendingPolls();
    if (!response.success || !response.data) return response;
    return { success: true, data: response.data.slice(0, limit), error: null };
  } catch{
    return { success: false, data: null, error: 'Failed to fetch trending polls' };
  }
}

export async function getUniversityRankings(limit?: number): Promise<DatabaseResponse<UniversityLeaderboardEntry[]>> {
  try {
    const response = await getUniversityLeaderboard();
    if (!response.success || !response.data) return response;
    const rankings = limit ? response.data.slice(0, limit) : response.data;
    return { success: true, data: rankings, error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to fetch rankings' };
  }
}

export async function getTopThreeUniversities(): Promise<DatabaseResponse<UniversityLeaderboardEntry[]>> {
  return getUniversityRankings(3);
}

// ============================================================================
// ACTIVITY TRACKING
// ============================================================================

export async function getLatestVotes(limit = 50): Promise<DatabaseResponse<RecentActivity[]>> {
  try {
    const response = await getRecentActivity();
    if (!response.success || !response.data) return response;
    return { success: true, data: response.data.slice(0, limit), error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to fetch recent activity' };
  }
}

// ============================================================================
// CATEGORY ANALYTICS
// ============================================================================

export async function getCategoryStats(): Promise<DatabaseResponse<CategoryStats[]>> {
  try {
    const response = await getPollCategoryCounts();
    if (!response.success || !response.data) return { success: false, data: null, error: response.error };
    const total = response.data.reduce((sum, cat) => sum + cat.count, 0);
    const stats: CategoryStats[] = response.data.map((cat) => ({
      ...cat,
      percentage: total > 0 ? (cat.count / total) * 100 : 0,
    }));
    return { success: true, data: stats, error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to calculate category stats' };
  }
}

export async function getMostCompetitiveCategories(limit = 3): Promise<DatabaseResponse<CompetitiveCategory[]>> {
  try {
    const response = await getCategoryInsights();
    if (!response.success || !response.data) return { success: false, data: null, error: response.error };
    const competitive: CompetitiveCategory[] = response.data
      .map((insight) => ({
        category: insight.category as PollCategory,
        universitiesActive: insight.universities_active,
        totalVotes: insight.total_votes,
        competitionLevel: 
          insight.universities_active >= 15 ? 'high' as const
          : insight.universities_active >= 8 ? 'medium' as const
          : 'low' as const,
      }))
      .sort((a, b) => b.universitiesActive - a.universitiesActive)
      .slice(0, limit);
    return { success: true, data: competitive, error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to fetch competitive categories' };
  }
}

// ============================================================================
// PLATFORM STATISTICS
// ============================================================================

export async function getPlatformStats(): Promise<DatabaseResponse<PlatformStats>> {
  try {
    const [trendingRes, leaderboardRes, categoryRes] = await Promise.all([
      getTrendingPolls(), getUniversityLeaderboard(), getPollCategoryCounts(),
    ]);
    const trending = trendingRes.success ? trendingRes.data || [] : [];
    const leaderboard = leaderboardRes.success ? leaderboardRes.data || [] : [];
    const categories = categoryRes.success ? categoryRes.data || [] : [];
    const totalVotes = leaderboard.reduce((sum, uni) => sum + uni.total_votes_received, 0);
    const stats: PlatformStats = {
      totalPolls: trending.length, totalVotes, totalUniversities: leaderboard.length, categoriesCount: categories.length,
    };
    return { success: true, data: stats, error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to fetch platform statistics' };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ============================================================================
// --- ADDED FOR POLL DETAIL PAGE ---
// ============================================================================

/**
 * Get historical daily vote counts for a specific poll to power trend charts.
 * This calls a Supabase RPC function.
 */
export async function getPollVoteHistory(
  pollId: string,
  days = 30
): Promise<DatabaseResponse<{ label: string; value: number }[]>> {
  try {
    const { data, error } = await supabase.rpc('get_daily_vote_counts', {
      p_poll_id: pollId,
      p_days: days,
    });

    if (error) {
      console.error('[Analytics] Error fetching poll history:', error);
      return { success: false, data: null, error: error.message };
    }

    const chartData = (data || []).map(item => ({
      label: new Date(item.vote_day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: item.vote_count,
    }));

    return { success: true, data: chartData, error: null };
  } catch (err) {
    console.error('[Analytics] Unexpected error in getPollVoteHistory:', err);
    return { success: false, data: null, error: 'Failed to fetch poll history' };
  }
}

/**
 * Get the breakdown of voter types (student, alumni, etc.) for a specific poll.
 * This calls a Supabase RPC function.
 */
export async function getPollVoterDemographics(
  pollId: string
): Promise<DatabaseResponse<{ label: string; value: number; color: string }[]>> {
  try {
    const { data, error } = await supabase.rpc('get_voter_demographics', {
      p_poll_id: pollId,
    });

    if (error) {
      console.error('[Analytics] Error fetching demographics:', error);
      return { success: false, data: null, error: error.message };
    }

    const colorMap: Record<string, string> = {
      student: '#3b82f6',   // blue
      alumni: '#8b5cf6',   // purple
      applicant: '#10b981', // green
      other: '#64748b',    // slate
    };

    const chartData = (data || []).map(item => ({
      label: item.voter_type ? (item.voter_type.charAt(0).toUpperCase() + item.voter_type.slice(1)) : 'Other',
      value: item.count,
      color: colorMap[item.voter_type] || colorMap['other'],
    }));

    return { success: true, data: chartData, error: null };
  } catch (err) {
    console.error('[Analytics] Unexpected error in getPollVoterDemographics:', err);
    return { success: false, data: null, error: 'Failed to fetch demographics' };
  }
}

// ============================================================================
// EXPORT ALL (Make sure to include new functions)
// ============================================================================

export default {
  getTopTrendingPolls,
  getUniversityRankings,
  getTopThreeUniversities,
  getLatestVotes,
  getCategoryStats,
  getMostCompetitiveCategories,
  getPlatformStats,
  formatNumber,
  timeAgo,
  // Added functions
  getPollVoteHistory,
  getPollVoterDemographics,
};