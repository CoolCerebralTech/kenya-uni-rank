// ============================================================================
// POLL SERVICE - PHASE 2 PRODUCTION
// Business logic for poll management and monthly cycles
// ============================================================================

import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { Poll, PollCategory, PollFilters } from '../types/models';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type PollRow = Database['public']['Tables']['polls']['Row'];
type PollStatusResult = Database['public']['Functions']['get_poll_status']['Returns'][0];

export interface PollServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// ============================================================================
// UTILITY: ROW MAPPER (snake_case → camelCase)
// ============================================================================

function mapPollToModel(row: PollRow): Poll {
  return {
    id: row.id,
    question: row.question,
    slug: row.slug,
    category: row.category as PollCategory,
    isActive: row.is_active,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    cycleMonth: row.cycle_month,
    displayOrder: row.display_order ?? 0,
    description: row.description ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================================================
// POLL STATUS (MONTHLY CYCLE LOGIC)
// ============================================================================

/**
 * Check poll status using database RPC function
 * Determines if poll is active and within cycle dates
 */
export async function getPollStatus(pollId: string): Promise<PollServiceResponse<{
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
      console.error('[Poll Service] Error fetching poll status:', error);
      return { 
        data: null, 
        error: error.message, 
        success: false 
      };
    }

    // RPC returns array, extract first result
    const statusArray = data as unknown as PollStatusResult[] | null;
    
    if (!statusArray || !Array.isArray(statusArray) || statusArray.length === 0) {
      return { 
        data: null, 
        error: 'Poll status not found', 
        success: false 
      };
    }

    const status = statusArray[0];
    
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
  } catch (error) {
    console.error('[Poll Service] Unexpected error in getPollStatus:', error);
    return { 
      data: null, 
      error: 'Failed to check poll status', 
      success: false 
    };
  }
}

// ============================================================================
// POLL FETCHING
// ============================================================================

/**
 * Get all active polls for the current cycle
 */
export async function getActivePolls(
  category?: PollCategory
): Promise<PollServiceResponse<Poll[]>> {
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
      console.error('[Poll Service] Error fetching active polls:', error);
      return { 
        data: null, 
        error: error.message, 
        success: false 
      };
    }

    const pollsData = data as PollRow[] | null;
    const polls = (pollsData || []).map(mapPollToModel);
    
    console.log(`[Poll Service] Fetched ${polls.length} active polls${category ? ` in category: ${category}` : ''}`);
    return { data: polls, error: null, success: true };
  } catch (error) {
    console.error('[Poll Service] Unexpected error in getActivePolls:', error);
    return { 
      data: null, 
      error: 'Failed to fetch polls', 
      success: false 
    };
  }
}

/**
 * Get a single poll by slug
 */
export async function getPollBySlug(
  slug: string
): Promise<PollServiceResponse<Poll>> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('[Poll Service] Error fetching poll by slug:', error);
      }
      return { 
        data: null, 
        error: error.message, 
        success: false 
      };
    }

    if (!data) {
      return { 
        data: null, 
        error: 'Poll not found', 
        success: false 
      };
    }

    const pollData = data as PollRow;
    const poll = mapPollToModel(pollData);
    
    console.log('[Poll Service] Fetched poll:', poll.slug);
    return { data: poll, error: null, success: true };
  } catch (error) {
    console.error('[Poll Service] Unexpected error in getPollBySlug:', error);
    return { 
      data: null, 
      error: 'Failed to fetch poll', 
      success: false 
    };
  }
}

/**
 * Get polls with advanced filters
 */
export async function getPolls(
  filters: PollFilters = {}
): Promise<PollServiceResponse<Poll[]>> {
  try {
    let query = supabase.from('polls').select('*');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }
    if (filters.cycleMonth) {
      query = query.eq('cycle_month', filters.cycleMonth);
    }

    query = query.order('display_order', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('[Poll Service] Error fetching filtered polls:', error);
      return { 
        data: null, 
        error: error.message, 
        success: false 
      };
    }

    const pollsData = data as PollRow[] | null;
    const polls = (pollsData || []).map(mapPollToModel);
    
    console.log(`[Poll Service] Fetched ${polls.length} polls with filters:`, filters);
    return { data: polls, error: null, success: true };
  } catch (error) {
    console.error('[Poll Service] Unexpected error in getPolls:', error);
    return { 
      data: null, 
      error: 'Failed to fetch polls', 
      success: false 
    };
  }
}

/**
 * Get polls grouped by category for UI display
 */
export async function getPollsByCategory(): Promise<PollServiceResponse<Record<PollCategory, Poll[]>>> {
  try {
    const response = await getActivePolls();
    
    if (!response.success || !response.data) {
      return { 
        data: null, 
        error: response.error, 
        success: false 
      };
    }

    const grouped: Record<PollCategory, Poll[]> = {
      general: [],
      vibes: [],
      academics: [],
      sports: [],
      social: [],
      facilities: [],
    };
    
    response.data.forEach(poll => {
      if (grouped[poll.category]) {
        grouped[poll.category].push(poll);
      }
    });
    
    console.log('[Poll Service] Grouped polls by category:', 
      Object.entries(grouped).map(([cat, polls]) => `${cat}: ${polls.length}`)
    );
    
    return { data: grouped, error: null, success: true };
  } catch (error) {
    console.error('[Poll Service] Unexpected error in getPollsByCategory:', error);
    return { 
      data: null, 
      error: 'Failed to group polls by category', 
      success: false 
    };
  }
}

// ============================================================================
// CYCLE MANAGEMENT
// ============================================================================

/**
 * Get current cycle month (YYYY-MM format)
 */
export function getCurrentCycleMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get previous cycle month
 */
export function getPreviousCycleMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  if (month === 0) {
    return `${year - 1}-12`;
  }
  
  const prevMonth = String(month).padStart(2, '0');
  return `${year}-${prevMonth}`;
}

/**
 * Get all available cycle months from database
 */
export async function getAvailableCycles(): Promise<PollServiceResponse<string[]>> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('cycle_month')
      .order('cycle_month', { ascending: false });

    if (error) {
      console.error('[Poll Service] Error fetching cycles:', error);
      return { 
        data: null, 
        error: error.message, 
        success: false 
      };
    }
    
    if (!data) {
      return { data: [], error: null, success: true };
    }
    
    const cyclesData = data as Array<{ cycle_month: string | null }>;
    
    // Filter unique, non-null cycles
    const cycles = new Set<string>(
      cyclesData
        .map(p => p.cycle_month)
        .filter((m): m is string => typeof m === 'string' && m.trim() !== '')
    );
    
    const sortedCycles = Array.from(cycles).sort().reverse();
    console.log('[Poll Service] Available cycles:', sortedCycles);
    
    return { data: sortedCycles, error: null, success: true };
  } catch (error) {
    console.error('[Poll Service] Unexpected error in getAvailableCycles:', error);
    return { 
      data: null, 
      error: 'Failed to fetch available cycles', 
      success: false 
    };
  }
}

// ============================================================================
// POLL CYCLE VALIDATION
// ============================================================================

/**
 * Check if poll cycle has ended
 */
export function isPollCycleEnded(poll: Poll): boolean {
  if (!poll.endsAt) return false;
  
  try {
    return new Date() > new Date(poll.endsAt);
  } catch (error) {
    console.error('[Poll Service] Invalid end date:', poll.endsAt, error);
    return false;
  }
}

/**
 * Check if poll cycle has started
 */
export function isPollCycleStarted(poll: Poll): boolean {
  if (!poll.startsAt) return true; // No start date = always started
  
  try {
    return new Date() >= new Date(poll.startsAt);
  } catch (error) {
    console.error('[Poll Service] Invalid start date:', poll.startsAt, error);
    return false;
  }
}

/**
 * Check if poll is currently in cycle
 */
export function isPollInCycle(poll: Poll): boolean {
  return isPollCycleStarted(poll) && !isPollCycleEnded(poll);
}

/**
 * Get time remaining in poll cycle (milliseconds)
 */
export function getPollTimeRemaining(poll: Poll): number | null {
  if (!poll.endsAt) return null;
  
  try {
    const endDate = new Date(poll.endsAt);
    const now = new Date();
    return Math.max(0, endDate.getTime() - now.getTime());
  } catch (error) {
    console.error('[Poll Service] Invalid date for time remaining:', error);
    return null;
  }
}

/**
 * Format time remaining as human-readable string
 */
export function formatTimeRemaining(poll: Poll): string {
  const ms = getPollTimeRemaining(poll);
  
  if (ms === null) return 'No end date';
  if (ms === 0) return 'Ended';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
  return `${seconds} second${seconds > 1 ? 's' : ''} remaining`;
}

// ============================================================================
// UI CONSTANTS & HELPERS
// ============================================================================

export const CATEGORY_LABELS: Record<PollCategory, string> = {
  general: 'General',
  vibes: 'Campus Vibes',
  academics: 'Academics',
  sports: 'Sports',
  social: 'Social & Community',
  facilities: 'Facilities',
};

export const CATEGORY_EMOJIS: Record<PollCategory, string> = {
  general: '🎓',
  vibes: '✨',
  academics: '📚',
  sports: '⚽',
  social: '🤝',
  facilities: '🏛️',
};

export const CATEGORY_DESCRIPTIONS: Record<PollCategory, string> = {
  general: 'Overall university experience and recommendations',
  vibes: 'Campus culture, lifestyle, and social atmosphere',
  academics: 'Learning quality, programs, and research opportunities',
  sports: 'Athletics, facilities, and competitive spirit',
  social: 'Community, networking, and student life',
  facilities: 'Infrastructure, amenities, and campus services',
};

export const CATEGORY_COLORS: Record<PollCategory, string> = {
  general: '#4F46E5',
  vibes: '#EC4899',
  academics: '#10B981',
  sports: '#F59E0B',
  social: '#8B5CF6',
  facilities: '#6366F1',
};

/**
 * Get category color for UI theming
 */
export function getCategoryColor(category: PollCategory): string {
  return CATEGORY_COLORS[category];
}

/**
 * Get category label for display
 */
export function getCategoryLabel(category: PollCategory): string {
  return CATEGORY_LABELS[category];
}

/**
 * Get category emoji for display
 */
export function getCategoryEmoji(category: PollCategory): string {
  return CATEGORY_EMOJIS[category];
}

/**
 * Get category description for tooltips
 */
export function getCategoryDescription(category: PollCategory): string {
  return CATEGORY_DESCRIPTIONS[category];
}

// ============================================================================
// ANALYTICS & STATS
// ============================================================================

/**
 * Get poll count by category
 */
export async function getPollCountsByCategory(): Promise<PollServiceResponse<Record<PollCategory, number>>> {
  try {
    const response = await getActivePolls();
    
    if (!response.success || !response.data) {
      return { 
        data: null, 
        error: response.error, 
        success: false 
      };
    }

    const counts: Record<PollCategory, number> = {
      general: 0,
      vibes: 0,
      academics: 0,
      sports: 0,
      social: 0,
      facilities: 0,
    };
    
    response.data.forEach(poll => {
      counts[poll.category]++;
    });
    
    console.log('[Poll Service] Poll counts by category:', counts);
    return { data: counts, error: null, success: true };
  } catch (error) {
    console.error('[Poll Service] Unexpected error in getPollCountsByCategory:', error);
    return { 
      data: null, 
      error: 'Failed to count polls by category', 
      success: false 
    };
  }
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  getPollStatus,
  getActivePolls,
  getPollBySlug,
  getPolls,
  getPollsByCategory,
  getCurrentCycleMonth,
  getPreviousCycleMonth,
  getAvailableCycles,
  isPollCycleEnded,
  isPollCycleStarted,
  isPollInCycle,
  getPollTimeRemaining,
  formatTimeRemaining,
  getCategoryColor,
  getCategoryLabel,
  getCategoryEmoji,
  getCategoryDescription,
  getPollCountsByCategory,
};