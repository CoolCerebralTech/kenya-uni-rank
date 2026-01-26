// ============================================================================
// INSIGHTS SERVICE - PHASE 2 PRODUCTION
// University profiles, trends, strengths/weaknesses analysis
// ============================================================================

import { supabase } from '../lib/supabase';
import type { 
  PollCategory, 
  UniversityProfile, 
  UniversityTrend 
} from '../types/models';
import { getCurrentCycleMonth, getPreviousCycleMonth } from './poll.service';
import type { DatabaseResponse } from './database.service';

// ============================================================================
// UNIVERSITY PROFILE ANALYSIS
// ============================================================================

/**
 * Get university performance profile (strengths & weaknesses)
 */
export async function getUniversityProfile(
  universityId: string
): Promise<DatabaseResponse<UniversityProfile>> {
  try {
    const currentMonth = getCurrentCycleMonth();

    const { data, error } = await supabase
      .from('poll_results')
      .select('*')
      .eq('university_id', universityId)
      .eq('cycle_month', currentMonth);

    if (error) {
      console.error('[Insights] Error fetching university profile:', error);
      return { success: false, data: null, error: error.message };
    }

    // NEW: Handle the "No Votes Yet" case gracefully
    if (!data || data.length === 0) {
      return {
        success: true, // Mark as success so the page doesn't crash
        data: {
          universityId,
          strengths: [],
          weaknesses: [],
          sentimentScore: 0,
          totalVotesReceived: 0,
          lastUpdated: new Date().toISOString(),
        },
        error: null,
      };
    }

    // ... (rest of the mapping logic remains the same)
    const categoryPerformance = new Map<PollCategory, { totalRank: number; count: number; totalPercentage: number }>();
    data.forEach((result) => {
      const category = result.category as PollCategory;
      const current = categoryPerformance.get(category) || { totalRank: 0, count: 0, totalPercentage: 0 };
      categoryPerformance.set(category, {
        totalRank: current.totalRank + result.rank,
        count: current.count + 1,
        totalPercentage: current.totalPercentage + result.percentage,
      });
    });

    const categoryStats = Array.from(categoryPerformance.entries()).map(([category, stats]) => ({
      category,
      avgRank: stats.totalRank / stats.count,
      avgPercentage: stats.totalPercentage / stats.count,
      trend: 'stable' as const,
    }));

    categoryStats.sort((a, b) => a.avgRank - b.avgRank);
    const strengths = categoryStats.slice(0, 3);
    const weaknesses = categoryStats.slice(-3).reverse();
    const totalVotesReceived = data.reduce((sum, item) => sum + item.votes, 0);
    const avgPercentage = data.reduce((sum, item) => sum + item.percentage, 0) / data.length;

    return {
      success: true,
      data: {
        universityId,
        strengths,
        weaknesses,
        sentimentScore: Math.round(avgPercentage),
        totalVotesReceived,
        lastUpdated: new Date().toISOString(),
      },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: 'Failed to generate profile' };
  }
}

/**
 * Get top universities in a specific category
 */
export async function getTopUniversitiesInCategory(
  category: PollCategory,
  limit = 3
): Promise<DatabaseResponse<Array<{
  universityId: string;
  universityName: string;
  universityColor: string;
  avgPercentage: number;
  pollsWon: number;
}>>> {
  try {
    const currentMonth = getCurrentCycleMonth();

    const { data, error } = await supabase
      .from('poll_results')
      .select('*')
      .eq('category', category)
      .eq('cycle_month', currentMonth)
      .eq('rank', 1); // Only first-place finishes

    if (error) {
      console.error('[Insights] Error fetching top universities:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: [],
        error: null,
      };
    }

    // Count wins per university
    const universityWins = new Map<
      string,
      { name: string; color: string; wins: number; totalPercentage: number }
    >();

    data.forEach((result) => {
      const current = universityWins.get(result.university_id) || {
        name: result.university_name,
        color: result.university_color,
        wins: 0,
        totalPercentage: 0,
      };

      universityWins.set(result.university_id, {
        name: current.name,
        color: current.color,
        wins: current.wins + 1,
        totalPercentage: current.totalPercentage + result.percentage,
      });
    });

    const rankings = Array.from(universityWins.entries())
      .map(([id, stats]) => ({
        universityId: id,
        universityName: stats.name,
        universityColor: stats.color,
        avgPercentage: stats.totalPercentage / stats.wins,
        pollsWon: stats.wins,
      }))
      .sort((a, b) => b.pollsWon - a.pollsWon)
      .slice(0, limit);

    console.log(`[Insights] Top ${limit} universities in ${category}:`, rankings.length);

    return {
      success: true,
      data: rankings,
      error: null,
    };
  } catch (err) {
    console.error('[Insights] Unexpected error fetching top universities:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch top universities',
    };
  }
}

// ============================================================================
// TREND ANALYSIS
// ============================================================================

/**
 * Get university trend over time (month-over-month)
 */
export async function getUniversityTrend(
  universityId: string,
  months = 6
): Promise<DatabaseResponse<UniversityTrend[]>> {
  try {
    const query = supabase
      .from('monthly_aggregates')
      .select('*')
      .eq('university_id', universityId)
      .order('cycle_month', { ascending: false })
      .limit(months);

    // Note: Category filtering would require poll_id lookup first
    // Skipping category filter for now to avoid complex joins

    const { data, error } = await query;

    if (error) {
      console.error('[Insights] Error fetching university trend:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    if (!data) {
      return {
        success: true,
        data: [],
        error: null,
      };
    }

    const trends: UniversityTrend[] = data.map((item) => ({
      universityId: item.university_id,
      pollId: item.poll_id,
      category: 'general' as PollCategory, // TODO: Join with polls table
      cycleMonth: item.cycle_month,
      votes: item.votes,
      percentage: item.percentage,
      rank: item.rank,
      totalVotes: item.total_votes,
    }));

    console.log(`[Insights] Fetched ${trends.length} trend data points`);

    return {
      success: true,
      data: trends,
      error: null,
    };
  } catch (err) {
    console.error('[Insights] Unexpected error fetching trend:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch university trend',
    };
  }
}

/**
 * Compare two universities across all categories
 */
export async function compareUniversities(
  universityId1: string,
  universityId2: string
): Promise<DatabaseResponse<{
  university1: UniversityProfile | null;
  university2: UniversityProfile | null;
  headToHead: Array<{
    category: PollCategory;
    uni1Wins: number;
    uni2Wins: number;
    winner: string | null;
  }>;
}>> {
  try {
    // Fetch both profiles
    const [profile1Res, profile2Res] = await Promise.all([
      getUniversityProfile(universityId1),
      getUniversityProfile(universityId2),
    ]);

    const profile1 = profile1Res.success ? profile1Res.data : null;
    const profile2 = profile2Res.success ? profile2Res.data : null;

    // Fetch head-to-head comparison
    const currentMonth = getCurrentCycleMonth();

    const { data, error } = await supabase
      .from('poll_results')
      .select('*')
      .in('university_id', [universityId1, universityId2])
      .eq('cycle_month', currentMonth);

    if (error || !data) {
      return {
        success: true,
        data: {
          university1: profile1,
          university2: profile2,
          headToHead: [],
        },
        error: error?.message || null,
      };
    }

    // Calculate head-to-head wins by category
    const categoryComparison = new Map<
      PollCategory,
      { uni1Wins: number; uni2Wins: number }
    >();

    data.forEach((result) => {
      const category = result.category as PollCategory;
      const current = categoryComparison.get(category) || {
        uni1Wins: 0,
        uni2Wins: 0,
      };

      if (result.university_id === universityId1 && result.rank === 1) {
        current.uni1Wins++;
      } else if (result.university_id === universityId2 && result.rank === 1) {
        current.uni2Wins++;
      }

      categoryComparison.set(category, current);
    });

    const headToHead = Array.from(categoryComparison.entries()).map(
      ([category, stats]) => ({
        category,
        uni1Wins: stats.uni1Wins,
        uni2Wins: stats.uni2Wins,
        winner:
          stats.uni1Wins > stats.uni2Wins
            ? universityId1
            : stats.uni2Wins > stats.uni1Wins
            ? universityId2
            : null,
      })
    );

    console.log('[Insights] Comparison generated:', {
      uni1: universityId1,
      uni2: universityId2,
      categories: headToHead.length,
    });

    return {
      success: true,
      data: {
        university1: profile1,
        university2: profile2,
        headToHead,
      },
      error: null,
    };
  } catch (err) {
    console.error('[Insights] Unexpected error comparing universities:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to compare universities',
    };
  }
}

// ============================================================================
// SENTIMENT ANALYSIS
// ============================================================================

/**
 * Calculate overall sentiment score for a university
 */
export async function calculateSentimentScore(
  universityId: string
): Promise<DatabaseResponse<number>> {
  try {
    const currentMonth = getCurrentCycleMonth();

    const { data, error } = await supabase
      .from('poll_results')
      .select('percentage, rank')
      .eq('university_id', universityId)
      .eq('cycle_month', currentMonth);

    if (error) {
      console.error('[Insights] Error calculating sentiment:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: 0,
        error: null,
      };
    }

    const avgPercentage =
      data.reduce((sum, item) => sum + item.percentage, 0) / data.length;

    const avgRank = data.reduce((sum, item) => sum + item.rank, 0) / data.length;

    // Weight: 70% percentage, 30% rank (inverted)
    const percentageScore = avgPercentage;
    const rankScore = Math.max(0, 100 - avgRank * 10);

    const sentimentScore = percentageScore * 0.7 + rankScore * 0.3;

    const finalScore = Math.round(Math.min(100, Math.max(0, sentimentScore)));

    console.log('[Insights] Sentiment score calculated:', finalScore);

    return {
      success: true,
      data: finalScore,
      error: null,
    };
  } catch (err) {
    console.error('[Insights] Unexpected error calculating sentiment:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to calculate sentiment score',
    };
  }
}

/**
 * Get rising universities (positive trend month-over-month)
 */
export async function getRisingUniversities(
  limit = 5
): Promise<DatabaseResponse<Array<{
  universityId: string;
  universityName: string;
  trendScore: number;
}>>> {
  try {
    const currentMonth = getCurrentCycleMonth();
    const lastMonth = getPreviousCycleMonth();

    const [currentData, previousData] = await Promise.all([
      supabase
        .from('poll_results')
        .select('university_id, university_name, percentage')
        .eq('cycle_month', currentMonth),
      supabase
        .from('poll_results')
        .select('university_id, percentage')
        .eq('cycle_month', lastMonth),
    ]);

    if (currentData.error || !currentData.data) {
      return {
        success: false,
        data: null,
        error: currentData.error?.message || 'Failed to fetch current data',
      };
    }

    const previousResults = previousData.data || [];

    // Calculate averages for each university
    const currentAvg = new Map<
      string,
      { name: string; avg: number; count: number }
    >();
    const previousAvg = new Map<string, { avg: number; count: number }>();

    currentData.data.forEach((item) => {
      const current = currentAvg.get(item.university_id) || {
        name: item.university_name,
        avg: 0,
        count: 0,
      };
      currentAvg.set(item.university_id, {
        name: current.name,
        avg: current.avg + item.percentage,
        count: current.count + 1,
      });
    });

    previousResults.forEach((item) => {
      const current = previousAvg.get(item.university_id) || {
        avg: 0,
        count: 0,
      };
      previousAvg.set(item.university_id, {
        avg: current.avg + item.percentage,
        count: current.count + 1,
      });
    });

    // Calculate trend scores
    const trends = Array.from(currentAvg.entries())
      .map(([id, current]) => {
        const currentScore = current.avg / current.count;
        const previous = previousAvg.get(id);
        const previousScore = previous ? previous.avg / previous.count : 0;
        const trendScore = currentScore - previousScore;

        return {
          universityId: id,
          universityName: current.name,
          trendScore,
        };
      })
      .filter((t) => t.trendScore > 0)
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);

    console.log(`[Insights] Found ${trends.length} rising universities`);

    return {
      success: true,
      data: trends,
      error: null,
    };
  } catch (err) {
    console.error('[Insights] Unexpected error finding rising universities:', err);
    return {
      success: false,
      data: null,
      error: 'Failed to find rising universities',
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format sentiment score with description
 */
export function formatSentimentScore(score: number): {
  score: number;
  label: string;
  color: string;
} {
  if (score >= 80) {
    return { score, label: 'Excellent', color: '#10b981' };
  }
  if (score >= 60) {
    return { score, label: 'Good', color: '#3b82f6' };
  }
  if (score >= 40) {
    return { score, label: 'Average', color: '#f59e0b' };
  }
  if (score >= 20) {
    return { score, label: 'Below Average', color: '#ef4444' };
  }
  return { score, label: 'Poor', color: '#991b1b' };
}
/**
 * Get aggregated sentiment stats for multiple universities.
 * This is the missing function for the UniversityComparison component.
 */
export async function getUniversitySentimentStats(
  universityIds: string[]
): Promise<DatabaseResponse<{ [key: string]: { [key: string]: number } }>> {
  try {
    const currentMonth = getCurrentCycleMonth();

    const { data, error } = await supabase
      .from('poll_results')
      .select('university_id, category, percentage')
      .in('university_id', universityIds)
      .eq('cycle_month', currentMonth);

    if (error) {
      console.error('[Insights] Error fetching sentiment stats:', error);
      return { success: false, data: null, error: error.message };
    }
    if (!data) {
      return { success: true, data: {}, error: null };
    }

    // Process the data into the required shape: { uniId: { category: avg_percentage, ... }, ... }
    const result: { [key: string]: { [key: string]: { total: number, count: number } } } = {};

    data.forEach(item => {
      if (!result[item.university_id]) {
        result[item.university_id] = {};
      }
      if (!result[item.university_id][item.category]) {
        result[item.university_id][item.category] = { total: 0, count: 0 };
      }
      result[item.university_id][item.category].total += item.percentage;
      result[item.university_id][item.category].count += 1;
    });
    
    // Calculate averages
    const finalStats: { [key: string]: { [key: string]: number } } = {};
    for (const uniId in result) {
      finalStats[uniId] = {};
      for (const category in result[uniId]) {
        const stats = result[uniId][category];
        finalStats[uniId][category] = stats.total / stats.count;
      }
    }

    return { success: true, data: finalStats, error: null };
  } catch (err) {
    console.error('[Insights] Unexpected error in getUniversitySentimentStats:', err);
    return { success: false, data: null, error: 'Failed to process sentiment stats' };
  }
}
// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  getUniversityProfile,
  getTopUniversitiesInCategory,
  getUniversityTrend,
  compareUniversities,
  calculateSentimentScore,
  getRisingUniversities,
  formatSentimentScore,
};