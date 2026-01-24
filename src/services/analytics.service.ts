// ============================================================================
// ANALYTICS SERVICE - PHASE 2 PRODUCTION
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
import type { PollCategory } from '../types/models';

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

/**
 * Get top trending polls
 */
export async function getTopTrendingPolls(
  limit = 10
): Promise<DatabaseResponse<TrendingPoll[]>> {
  try {
    const response = await getTrendingPolls();
    
    if (!response.success || !response.data) {
      return response;
    }
    
    const limited = response.data.slice(0, limit);
    console.log(`[Analytics] Fetched ${limited.length} trending polls`);
    
    return {
      success: true,
      data: limited,
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error fetching top trending polls:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch trending polls',
    };
  }
}

/**
 * Get university rankings (leaderboard)
 */
export async function getUniversityRankings(
  limit?: number
): Promise<DatabaseResponse<UniversityLeaderboardEntry[]>> {
  try {
    const response = await getUniversityLeaderboard();
    
    if (!response.success || !response.data) {
      return response;
    }
    
    const rankings = limit ? response.data.slice(0, limit) : response.data;
    console.log(`[Analytics] Fetched ${rankings.length} university rankings`);
    
    return {
      success: true,
      data: rankings,
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error fetching university rankings:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch rankings',
    };
  }
}

/**
 * Get top 3 universities (podium)
 */
export async function getTopThreeUniversities(): Promise<
  DatabaseResponse<UniversityLeaderboardEntry[]>
> {
  return getUniversityRankings(3);
}

// ============================================================================
// ACTIVITY TRACKING
// ============================================================================

/**
 * Get recent voting activity
 */
export async function getLatestVotes(
  limit = 50
): Promise<DatabaseResponse<RecentActivity[]>> {
  try {
    const response = await getRecentActivity();
    
    if (!response.success || !response.data) {
      return response;
    }
    
    const recent = response.data.slice(0, limit);
    console.log(`[Analytics] Fetched ${recent.length} recent votes`);
    
    return {
      success: true,
      data: recent,
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error fetching latest votes:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch recent activity',
    };
  }
}

// ============================================================================
// CATEGORY ANALYTICS
// ============================================================================

/**
 * Get category statistics with percentages
 */
export async function getCategoryStats(): Promise<
  DatabaseResponse<CategoryStats[]>
> {
  try {
    const response = await getPollCategoryCounts();
    
    if (!response.success || !response.data) {
      return {
        success: false,
        data: null,
        error: response.error,
      };
    }
    
    const total = response.data.reduce((sum, cat) => sum + cat.count, 0);

    const stats: CategoryStats[] = response.data.map((cat) => ({
      category: cat.category,
      count: cat.count,
      percentage: total > 0 ? (cat.count / total) * 100 : 0,
    }));
    
    console.log('[Analytics] Calculated category stats');
    
    return {
      success: true,
      data: stats,
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error fetching category stats:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to calculate category stats',
    };
  }
}

/**
 * Get most active category (by votes)
 */
export async function getMostActiveCategory(): Promise<
  DatabaseResponse<PollCategory>
> {
  try {
    const trendingResponse = await getTrendingPolls();
    
    if (!trendingResponse.success || !trendingResponse.data || trendingResponse.data.length === 0) {
      return {
        success: false,
        data: null,
        error: 'No trending polls available',
      };
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
      if (votes > maxVotes) {
        maxVotes = votes;
        topCategory = category;
      }
    });

    if (!topCategory) {
      return {
        success: false,
        data: null,
        error: 'Could not determine most active category',
      };
    }
    
    console.log('[Analytics] Most active category:', topCategory);
    
    return {
      success: true,
      data: topCategory,
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error finding most active category:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to find most active category',
    };
  }
}

/**
 * Get most competitive categories
 */
export async function getMostCompetitiveCategories(
  limit = 3
): Promise<DatabaseResponse<CompetitiveCategory[]>> {
  try {
    const response = await getCategoryInsights();
    
    if (!response.success || !response.data) {
      return {
        success: false,
        data: null,
        error: response.error,
      };
    }
    
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
    
    console.log(`[Analytics] Found ${competitive.length} competitive categories`);
    
    return {
      success: true,
      data: competitive,
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error fetching competitive categories:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch competitive categories',
    };
  }
}

/**
 * Get trending categories (high recent activity)
 */
export async function getTrendingCategories(): Promise<
  DatabaseResponse<PollCategory[]>
> {
  try {
    const response = await getCategoryInsights();
    
    if (!response.success || !response.data) {
      return {
        success: false,
        data: null,
        error: response.error,
      };
    }
    
    const trending = response.data
      .filter((item) => item.is_trending)
      .map((item) => item.category as PollCategory);
    
    console.log('[Analytics] Found trending categories:', trending);
    
    return {
      success: true,
      data: trending,
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error fetching trending categories:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch trending categories',
    };
  }
}

// ============================================================================
// PLATFORM STATISTICS
// ============================================================================

/**
 * Get overall platform statistics
 */
export async function getPlatformStats(): Promise<
  DatabaseResponse<PlatformStats>
> {
  try {
    const [trendingRes, leaderboardRes, categoryRes] = await Promise.all([
      getTrendingPolls(),
      getUniversityLeaderboard(),
      getPollCategoryCounts(),
    ]);

    // Handle errors gracefully
    const trending = trendingRes.success ? trendingRes.data || [] : [];
    const leaderboard = leaderboardRes.success ? leaderboardRes.data || [] : [];
    const categories = categoryRes.success ? categoryRes.data || [] : [];

    const totalVotes = leaderboard.reduce(
      (sum, uni) => sum + uni.total_votes_received,
      0
    );

    const stats: PlatformStats = {
      totalPolls: trending.length,
      totalVotes,
      totalUniversities: leaderboard.length,
      categoriesCount: categories.length,
    };
    
    console.log('[Analytics] Platform stats:', stats);
    
    return {
      success: true,
      data: stats,
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error fetching platform stats:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch platform statistics',
    };
  }
}

// ============================================================================
// ENGAGEMENT METRICS
// ============================================================================

/**
 * Get engagement metrics across the platform
 */
export async function getEngagementMetrics(): Promise<
  DatabaseResponse<EngagementMetrics>
> {
  try {
    const [trendingRes, leaderboardRes] = await Promise.all([
      getTrendingPolls(),
      getUniversityLeaderboard(),
    ]);

    const trending = trendingRes.success ? trendingRes.data || [] : [];
    const leaderboard = leaderboardRes.success ? leaderboardRes.data || [] : [];

    if (trending.length === 0) {
      return {
        success: true,
        data: {
          averageVotesPerPoll: 0,
          averageVotesPerUniversity: 0,
          mostPopularPoll: null,
          leastPopularPoll: null,
        },
        error: null,
      };
    }

    const totalVotes = trending.reduce((sum, poll) => sum + poll.total_votes, 0);
    const averageVotesPerPoll = totalVotes / trending.length;

    const totalUniVotes = leaderboard.reduce(
      (sum, uni) => sum + uni.total_votes_received,
      0
    );
    const averageVotesPerUniversity =
      leaderboard.length > 0 ? totalUniVotes / leaderboard.length : 0;

    const sortedByVotes = [...trending].sort(
      (a, b) => b.total_votes - a.total_votes
    );

    const metrics: EngagementMetrics = {
      averageVotesPerPoll: Math.round(averageVotesPerPoll * 100) / 100,
      averageVotesPerUniversity:
        Math.round(averageVotesPerUniversity * 100) / 100,
      mostPopularPoll: sortedByVotes[0] || null,
      leastPopularPoll: sortedByVotes[sortedByVotes.length - 1] || null,
    };
    
    console.log('[Analytics] Engagement metrics calculated');
    
    return {
      success: true,
      data: metrics,
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error calculating engagement metrics:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to calculate engagement metrics',
    };
  }
}

/**
 * Get hottest poll (most recent activity)
 */
export async function getHottestPoll(): Promise<
  DatabaseResponse<TrendingPoll>
> {
  try {
    const response = await getTrendingPolls();
    
    if (!response.success || !response.data || response.data.length === 0) {
      return {
        success: false,
        data: null,
        error: 'No polls available',
      };
    }

    const sorted = [...response.data].sort((a, b) => {
      const timeA = new Date(a.last_vote_time).getTime();
      const timeB = new Date(b.last_vote_time).getTime();
      return timeB - timeA;
    });

    console.log('[Analytics] Hottest poll:', sorted[0].question);
    
    return {
      success: true,
      data: sorted[0],
      error: null,
    };
  } catch (err) {
    console.error('[Analytics] Error finding hottest poll:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to find hottest poll',
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format large numbers with K/M suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Calculate time ago from timestamp
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

/**
 * Format percentage with precision
 */
export function formatPercentage(num: number, decimals = 1): string {
  return `${num.toFixed(decimals)}%`;
}

/**
 * Get competition level color
 */
export function getCompetitionLevelColor(
  level: 'high' | 'medium' | 'low'
): string {
  const colors = {
    high: '#ef4444', // red - fierce competition
    medium: '#f59e0b', // orange - moderate
    low: '#10b981', // green - clear winner
  };
  return colors[level];
}

/**
 * Get competition level label
 */
export function getCompetitionLevelLabel(
  level: 'high' | 'medium' | 'low'
): string {
  const labels = {
    high: 'Highly Competitive',
    medium: 'Moderately Competitive',
    low: 'Less Competitive',
  };
  return labels[level];
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format percentage change with sign
 */
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
  formatNumber,
  timeAgo,
  formatPercentage,
  getCompetitionLevelColor,
  getCompetitionLevelLabel,
  calculatePercentageChange,
  formatPercentageChange,
};