// ============================================================================
// ANALYTICS SERVICE - PHASE 2 PRODUCTION (FULLY RESTORED)
// Provides insights, trends, and aggregate data
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
import type { PollCategory, PollResult } from '../types/models';
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
  } catch {
    return { success: false, data: null, error: 'Failed to fetch trending polls' };
  }
}

export async function getUniversityRankings(limit?: number): Promise<DatabaseResponse<UniversityLeaderboardEntry[]>> {
  try {
    const response = await getUniversityLeaderboard();
    if (!response.success || !response.data) return response;
    const rankings = limit ? response.data.slice(0, limit) : response.data;
    return { success: true, data: rankings, error: null };
  } catch{
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
/**
 * PRODUCTION-READY: Fetch all results for an entire category in one hit.
 * Strictly typed to avoid "any" errors.
 */
export async function getCategoryResults(category: PollCategory): Promise<DatabaseResponse<PollResult[]>> {
  try {
    const { data, error } = await supabase
      .from('poll_results')
      .select('*')
      .eq('category', category)
      .order('poll_id');

    if (error) throw error;

    const results: PollResult[] = (data || []).map(r => ({
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

    return { success: true, data: results, error: null };
  } catch (err) {
    console.error('[Analytics] Category fetch failed:', err);
    return { success: false, data: null, error: 'Failed to fetch sector results' };
  }
}

export async function getCategoryStats(): Promise<DatabaseResponse<CategoryStats[]>> {
  try {
    const response = await getPollCategoryCounts();
    if (!response.success || !response.data) return { success: false, data: null, error: response.error };
    const total = response.data.reduce((sum, cat) => sum + cat.count, 0);
    const stats: CategoryStats[] = response.data.map((cat) => ({
      category: cat.category as PollCategory,
      count: cat.count,
      percentage: total > 0 ? (cat.count / total) * 100 : 0,
    }));
    return { success: true, data: stats, error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to calculate category stats' };
  }
}

/** RESTORED: Find most active category based on current vote volume */
export async function getMostActiveCategory(): Promise<DatabaseResponse<PollCategory>> {
  try {
    const trendingResponse = await getTrendingPolls();
    if (!trendingResponse.success || !trendingResponse.data || trendingResponse.data.length === 0) {
      return { success: false, data: null, error: 'No data available' };
    }
    const categoryVotes = new Map<PollCategory, number>();
    trendingResponse.data.forEach((poll) => {
      const category = poll.category as PollCategory;
      const current = categoryVotes.get(category) || 0;
      categoryVotes.set(category, current + poll.total_votes);
    });
    let maxVotes = 0;
    let topCategory: PollCategory | null = null;
    categoryVotes.forEach((votes, category) => {
      if (votes > maxVotes) { maxVotes = votes; topCategory = category; }
    });
    return topCategory 
      ? { success: true, data: topCategory, error: null }
      : { success: false, data: null, error: 'Calculation failed' };
  } catch {
    return { success: false, data: null, error: 'Failed to find active category' };
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

/** RESTORED: Get categories that are currently "Trending" in the DB */
export async function getTrendingCategories(): Promise<DatabaseResponse<PollCategory[]>> {
  try {
    const response = await getCategoryInsights();
    if (!response.success || !response.data) return { success: false, data: null, error: response.error };
    const trending = response.data
      .filter((item) => item.is_trending)
      .map((item) => item.category as PollCategory);
    return { success: true, data: trending, error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to fetch trending categories' };
  }
}

// ============================================================================
// PLATFORM STATISTICS & ENGAGEMENT
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

/** RESTORED: Calculate engagement metrics */
export async function getEngagementMetrics(): Promise<DatabaseResponse<EngagementMetrics>> {
  try {
    const [trendingRes, leaderboardRes] = await Promise.all([getTrendingPolls(), getUniversityLeaderboard()]);
    const trending = trendingRes.success ? trendingRes.data || [] : [];
    const leaderboard = leaderboardRes.success ? leaderboardRes.data || [] : [];
    if (trending.length === 0) {
      return { success: true, data: { averageVotesPerPoll: 0, averageVotesPerUniversity: 0, mostPopularPoll: null, leastPopularPoll: null }, error: null };
    }
    const totalVotes = trending.reduce((sum, poll) => sum + poll.total_votes, 0);
    const totalUniVotes = leaderboard.reduce((sum, uni) => sum + uni.total_votes_received, 0);
    const sortedByVotes = [...trending].sort((a, b) => b.total_votes - a.total_votes);
    return {
      success: true,
      data: {
        averageVotesPerPoll: Math.round((totalVotes / trending.length) * 100) / 100,
        averageVotesPerUniversity: leaderboard.length > 0 ? Math.round((totalUniVotes / leaderboard.length) * 100) / 100 : 0,
        mostPopularPoll: sortedByVotes[0] || null,
        leastPopularPoll: sortedByVotes[sortedByVotes.length - 1] || null,
      },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: 'Failed to calculate engagement' };
  }
}

/** RESTORED: Get the poll with the most recent vote */
export async function getHottestPoll(): Promise<DatabaseResponse<TrendingPoll>> {
  try {
    const response = await getTrendingPolls();
    if (!response.success || !response.data || response.data.length === 0) return { success: false, data: null, error: 'No polls' };
    const sorted = [...response.data].sort((a, b) => new Date(b.last_vote_time).getTime() - new Date(a.last_vote_time).getTime());
    return { success: true, data: sorted[0], error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to find hottest poll' };
  }
}

// ============================================================================
// --- ADVANCED POLL DATA (For PollDetailPage) ---
// ============================================================================

export async function getPollVoteHistory(pollId: string, days = 30): Promise<DatabaseResponse<{ label: string; value: number }[]>> {
  try {
    const { data, error } = await supabase.rpc('get_daily_vote_counts', { p_poll_id: pollId, p_days: days });
    if (error) return { success: false, data: null, error: error.message };
    const chartData = (data || []).map(item => ({
      label: new Date(item.vote_day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: item.vote_count,
    }));
    return { success: true, data: chartData, error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to fetch history' };
  }
}

export async function getPollVoterDemographics(pollId: string): Promise<DatabaseResponse<{ label: string; value: number; color: string }[]>> {
  try {
    const { data, error } = await supabase.rpc('get_voter_demographics', { p_poll_id: pollId });
    if (error) return { success: false, data: null, error: error.message };
    const colorMap: Record<string, string> = { student: '#3b82f6', alumni: '#8b5cf6', applicant: '#10b981', other: '#64748b' };
    const chartData = (data || []).map(item => ({
      label: item.voter_type ? (item.voter_type.charAt(0).toUpperCase() + item.voter_type.slice(1)) : 'Other',
      value: item.count,
      color: colorMap[item.voter_type] || colorMap['other'],
    }));
    return { success: true, data: chartData, error: null };
  } catch {
    return { success: false, data: null, error: 'Failed to fetch demographics' };
  }
}

// ============================================================================
// UTILITY FUNCTIONS (RESTORED)
// ============================================================================

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
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

/** RESTORED: Simple percentage formatter */
export function formatPercentage(num: number, decimals = 1): string {
  return `${num.toFixed(decimals)}%`;
}

/** RESTORED: Get UI color for competition badges */
export function getCompetitionLevelColor(level: 'high' | 'medium' | 'low'): string {
  const colors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
  return colors[level];
}

/** RESTORED: Get readable label for competition */
export function getCompetitionLevelLabel(level: 'high' | 'medium' | 'low'): string {
  const labels = { high: 'Highly Competitive', medium: 'Moderately Competitive', low: 'Less Competitive' };
  return labels[level];
}

/** RESTORED: Calculate change between two periods */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/** RESTORED: Formatted sign (+/-) percentage */
export function formatPercentageChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  getTopTrendingPolls,
  getUniversityRankings,
  getTopThreeUniversities,
  getLatestVotes,
  getCategoryStats,
  getMostActiveCategory,
  getMostCompetitiveCategories,
  getTrendingCategories,
  getPlatformStats,
  getEngagementMetrics,
  getHottestPoll,
  getPollVoteHistory,
  getPollVoterDemographics,
  formatNumber,
  timeAgo,
  formatPercentage,
  getCompetitionLevelColor,
  getCompetitionLevelLabel,
  calculatePercentageChange,
  formatPercentageChange,
};