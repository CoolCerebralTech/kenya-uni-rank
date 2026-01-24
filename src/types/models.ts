// models.ts - UPDATED VERSION
// ============================================================================
// UNIPULSE TYPES - PHASE 2
// Database-first type definitions for sentiment tracking and insights
// ============================================================================

// --- 1. CORE ENTITIES ---

export interface University {
  id: string; // e.g. "uon" (Primary Key)
  slug: string; // e.g. "uon"
  name: string;
  shortName: string;
  type: 'Public' | 'Private';
  location: string;
  color: string; // For UI branding
  website?: string;
  // Phase 2: Extended profile data
  description?: string;
  established?: number; // Year founded
  studentPopulation?: number;
  campusSize?: string; // e.g. "500 acres"
  accreditation?: string[];
}

// Phase 2: Category type with explicit values
export type PollCategory = 'general' | 'vibes' | 'academics' | 'sports' | 'social' | 'facilities';

export interface Poll {
  id: string; // UUID
  question: string; // e.g. "Which uni has the best sports?"
  slug: string; // e.g. "best-sports"
  category: PollCategory;
  isActive: boolean; // Updated to camelCase for consistency
  
  // Phase 2: Monthly Voting Cycles
  startsAt: string | null; // ISO timestamp - when poll opens
  endsAt: string | null; // ISO timestamp - when poll closes (null = no end)
  cycleMonth: string | null; // e.g. "2026-01" for tracking historical data
  
  // Metadata
  description?: string; // Extended question context
  displayOrder?: number; // Display order within category
  createdAt: string;
  updatedAt: string;
}

// --- 2. VOTING LOGIC ---

export interface Vote {
  id: string; // UUID
  pollId: string; // Match database column name
  universityId: string; // The uni the user CHOSE
  fingerprintHash: string; // Browser fingerprint to prevent spam
  
  // Phase 2: Enhanced metadata for insights
  ipHash?: string | null; // IP-based tracking (hashed for privacy)
  userAgent?: string | null; // Browser info (for analytics)
  voterType?: 'student' | 'alumni' | 'applicant' | 'other' | null; // Self-reported
  
  createdAt: string; // Supabase returns ISO strings, not Date objects
}

// Phase 2: Vote tracking state
export interface VoteStatus {
  pollId: string;
  hasVoted: boolean;
  votedAt?: string;
  universityId?: string; // What they voted for (for "Already Voted" UI)
}

// --- 3. UI/RESULTS ---

// This is what we use to display the charts (real-time)
export interface PollResult {
  pollId: string;
  pollQuestion: string;
  category: PollCategory;
  cycleMonth: string | null;
  universityId: string;
  universityName: string;
  universityShortName: string;
  universityColor: string;
  universityType: 'Public' | 'Private'; // Added to match database view
  votes: number;
  percentage: number;
  rank: number; // 1st, 2nd, 3rd etc.
}

// Phase 2: Aggregated results per poll (for caching)
export interface PollResultsAggregate {
  pollId: string;
  pollQuestion: string;
  category: PollCategory;
  totalVotes: number;
  results: PollResult[];
  lastUpdated: string;
  cycleMonth: string | null;
}

// --- 4. PHASE 2: INSIGHTS & TRENDS ---

// Historical tracking: How a university performed over time
export interface UniversityTrend {
  universityId: string;
  pollId: string;
  category: PollCategory;
  cycleMonth: string; // e.g. "2026-01"
  votes: number;
  percentage: number;
  rank: number;
  totalVotes: number; // Total votes in that poll cycle
}

// University profile with strengths/weaknesses
export interface UniversityProfile {
  universityId: string;
  
  // Computed strengths (top 3 categories)
  strengths: {
    category: PollCategory;
    avgRank: number;
    avgPercentage: number;
    trend: 'rising' | 'stable' | 'falling';
  }[];
  
  // Computed weaknesses (bottom 3 categories)
  weaknesses: {
    category: PollCategory;
    avgRank: number;
    avgPercentage: number;
    trend: 'rising' | 'stable' | 'falling';
  }[];
  
  // Overall sentiment score (0-100)
  sentimentScore: number;
  
  // Participation data
  totalVotesReceived: number;
  lastUpdated: string;
}

// Category-specific insights
export interface CategoryInsight {
  category: PollCategory;
  topUniversity: {
    id: string;
    name: string;
    percentage: number;
  };
  competitionLevel: 'high' | 'medium' | 'low'; // Based on vote distribution
  totalVotes: number;
  trending: boolean; // Is this category getting more votes than average?
}

// --- 5. CACHING & STORAGE ---

// LocalStorage schema for offline-first experience
export interface CachedData {
  polls: {
    active: Poll[];
    fetchedAt: string;
  };
  results: {
    [pollId: string]: PollResultsAggregate;
  };
  voteStatus: {
    [pollId: string]: VoteStatus;
  };
  version: string; // Cache version for invalidation
}

// --- 6. ANALYTICS & TRACKING ---

export interface AnalyticsEvent {
  event: 'page_view' | 'vote_submitted' | 'poll_viewed' | 'results_shared' | 'category_browsed';
  pollId?: string;
  universityId?: string;
  category?: PollCategory;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// User session data (anonymous, no PII)
export interface SessionData {
  sessionId: string; // Generated client-side
  fingerprintHash: string;
  voterType?: 'student' | 'alumni' | 'applicant' | 'other';
  votesInSession: number;
  categoriesViewed: PollCategory[];
  startedAt: string;
  lastActiveAt: string;
}

// --- 7. API RESPONSE TYPES ---

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  timestamp: string;
}

export interface VoteSubmissionResponse {
  success: boolean;
  voteId?: string;
  pollResults?: PollResult[];
  error?: string;
}

// --- 8. PHASE 2: MONTHLY AGGREGATES (Performance optimization) ---

// Pre-computed monthly results (for historical queries)
export interface MonthlyAggregate {
  id: string;
  pollId: string;
  universityId: string;
  cycleMonth: string; // e.g. "2026-01"
  votes: number;
  percentage: number;
  rank: number;
  totalVotes: number;
  createdAt: string;
  updatedAt: string;
}

// --- 9. UTILITY TYPES ---

// For filtering and querying
export interface PollFilters {
  category?: PollCategory;
  isActive?: boolean;
  cycleMonth?: string;
}

export interface UniversityFilters {
  type?: 'Public' | 'Private';
  location?: string;
  search?: string;
}

// For sorting results
export type SortOrder = 'asc' | 'desc';
export type PollSortBy = 'votes' | 'percentage' | 'rank';

// --- 10. CONSTANTS ---

export const POLL_CATEGORIES: readonly PollCategory[] = [
  'general',
  'vibes',
  'academics',
  'sports',
  'social',
  'facilities',
] as const;

export const VOTER_TYPES = [
  'student',
  'alumni',
  'applicant',
  'other',
] as const;

export const UNIVERSITY_TYPES = ['Public', 'Private'] as const;

// Cache configuration
export const CACHE_CONFIG = {
  POLL_TTL: 1000 * 60 * 5, // 5 minutes
  RESULTS_TTL: 1000 * 60 * 2, // 2 minutes (real-time updates)
  PROFILE_TTL: 1000 * 60 * 30, // 30 minutes
  VERSION: '2.0.0',
} as const;