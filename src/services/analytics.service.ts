import { 
  getTrendingPolls, 
  getUniversityLeaderboard, 
  getRecentActivity,
  getPollCategories,
  type TrendingPoll,
  type UniversityLeaderboardEntry,
  type RecentActivity
} from './database.service';

// ============================================================================
// ANALYTICS SERVICE
// Provides insights, trends, and aggregate data
// ============================================================================

/**
 * Get top trending polls
 * @param limit - Number of polls to return (default: 10)
 */
export async function getTopTrendingPolls(limit = 10): Promise<TrendingPoll[]> {
  try {
    const trending = await getTrendingPolls();
    return trending.slice(0, limit);
  } catch (err) {
    console.error('Error fetching top trending polls:', err);
    return [];
  }
}

/**
 * Get university rankings (leaderboard)
 * @param limit - Number of universities to return (default: all)
 */
export async function getUniversityRankings(
  limit?: number
): Promise<UniversityLeaderboardEntry[]> {
  try {
    const leaderboard = await getUniversityLeaderboard();
    return limit ? leaderboard.slice(0, limit) : leaderboard;
  } catch (err) {
    console.error('Error fetching university rankings:', err);
    return [];
  }
}

/**
 * Get top 3 universities (podium)
 */
export async function getTopThreeUniversities(): Promise<UniversityLeaderboardEntry[]> {
  return getUniversityRankings(3);
}

/**
 * Get recent voting activity
 * @param limit - Number of recent votes to return (default: 50)
 */
export async function getLatestVotes(limit = 50): Promise<RecentActivity[]> {
  try {
    const activity = await getRecentActivity();
    return activity.slice(0, limit);
  } catch (err) {
    console.error('Error fetching latest votes:', err);
    return [];
  }
}

/**
 * Get category statistics
 */
export async function getCategoryStats(): Promise<
  Array<{ category: string; count: number; percentage: number }>
> {
  try {
    const categories = await getPollCategories();
    const total = categories.reduce((sum, cat) => sum + cat.count, 0);

    return categories.map((cat) => ({
      category: cat.category,
      count: cat.count,
      percentage: total > 0 ? (cat.count / total) * 100 : 0,
    }));
  } catch (err) {
    console.error('Error fetching category stats:', err);
    return [];
  }
}

/**
 * Get platform statistics
 */
export async function getPlatformStats(): Promise<{
  totalPolls: number;
  totalVotes: number;
  totalUniversities: number;
  categoriesCount: number;
}> {
  try {
    const [trending, leaderboard, categories] = await Promise.all([
      getTrendingPolls(),
      getUniversityLeaderboard(),
      getPollCategories(),
    ]);

    const totalVotes = leaderboard.reduce(
      (sum, uni) => sum + uni.total_votes_received,
      0
    );

    return {
      totalPolls: trending.length,
      totalVotes,
      totalUniversities: leaderboard.length,
      categoriesCount: categories.length,
    };
  } catch (err) {
    console.error('Error fetching platform stats:', err);
    return {
      totalPolls: 0,
      totalVotes: 0,
      totalUniversities: 0,
      categoriesCount: 0,
    };
  }
}

/**
 * Get most active category (by votes)
 */
export async function getMostActiveCategory(): Promise<string | null> {
  try {
    const trending = await getTrendingPolls();
    
    if (trending.length === 0) return null;

    // Group by category and sum votes
    const categoryVotes = new Map<string, number>();
    
    trending.forEach((poll) => {
      const current = categoryVotes.get(poll.category) || 0;
      categoryVotes.set(poll.category, current + poll.total_votes);
    });

    // Find category with most votes
    let maxVotes = 0;
    let topCategory: string | null = null;

    categoryVotes.forEach((votes, category) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        topCategory = category;
      }
    });

    return topCategory;
  } catch (err) {
    console.error('Error finding most active category:', err);
    return null;
  }
}

/**
 * Get hottest poll (most recent votes)
 */
export async function getHottestPoll(): Promise<TrendingPoll | null> {
  try {
    const trending = await getTrendingPolls();
    
    if (trending.length === 0) return null;

    // Sort by last vote time (most recent first)
    const sorted = [...trending].sort((a, b) => {
      const timeA = new Date(a.last_vote_time).getTime();
      const timeB = new Date(b.last_vote_time).getTime();
      return timeB - timeA;
    });

    return sorted[0];
  } catch (err) {
    console.error('Error finding hottest poll:', err);
    return null;
  }
}

/**
 * Get engagement metrics
 */
export async function getEngagementMetrics(): Promise<{
  averageVotesPerPoll: number;
  averageVotesPerUniversity: number;
  mostPopularPoll: TrendingPoll | null;
  leastPopularPoll: TrendingPoll | null;
}> {
  try {
    const trending = await getTrendingPolls();

    if (trending.length === 0) {
      return {
        averageVotesPerPoll: 0,
        averageVotesPerUniversity: 0,
        mostPopularPoll: null,
        leastPopularPoll: null,
      };
    }

    const totalVotes = trending.reduce((sum, poll) => sum + poll.total_votes, 0);
    const averageVotesPerPoll = totalVotes / trending.length;

    const leaderboard = await getUniversityLeaderboard();
    const totalUniVotes = leaderboard.reduce(
      (sum, uni) => sum + uni.total_votes_received,
      0
    );
    const averageVotesPerUniversity =
      leaderboard.length > 0 ? totalUniVotes / leaderboard.length : 0;

    // Sort by votes to find most/least popular
    const sortedByVotes = [...trending].sort(
      (a, b) => b.total_votes - a.total_votes
    );

    return {
      averageVotesPerPoll: Math.round(averageVotesPerPoll * 100) / 100,
      averageVotesPerUniversity:
        Math.round(averageVotesPerUniversity * 100) / 100,
      mostPopularPoll: sortedByVotes[0] || null,
      leastPopularPoll: sortedByVotes[sortedByVotes.length - 1] || null,
    };
  } catch (err) {
    console.error('Error calculating engagement metrics:', err);
    return {
      averageVotesPerPoll: 0,
      averageVotesPerUniversity: 0,
      mostPopularPoll: null,
      leastPopularPoll: null,
    };
  }
}

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