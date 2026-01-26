// ============================================================================
// STORAGE SERVICE - PHASE 2 CACHING LAYER
// Handles localStorage, sessionStorage, and caching to solve "long wait" problem
// ============================================================================

import { CACHE_CONFIG, type Poll, type PollResultsAggregate } from '../types/models';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  FINGERPRINT: 'unipulse_fingerprint',
  VOTED_POLLS: 'unipulse_voted_polls',
  VOTE_DETAILS: 'unipulse_vote_details', // NEW: Store what they voted for
  THEME: 'unipulse_theme',
  LAST_VISIT: 'unipulse_last_visit',
  FAVORITES: 'unipulse_favorites',
  VIEWED_POLLS: 'unipulse_viewed_polls',
  VOTER_TYPE: 'unipulse_voter_type', // NEW: Phase 2 analytics
  CACHE_VERSION: 'unipulse_cache_version',
} as const;

const SESSION_KEYS = {
  ACTIVE_POLLS: 'unipulse_session_active_polls',
  POLL_RESULTS: 'unipulse_session_poll_results',
  UNIVERSITY_DATA: 'unipulse_session_universities',
} as const;

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

const CACHE_EXPIRY = {
  FINGERPRINT: 7 * 24 * 60 * 60 * 1000, // 7 days
  ACTIVE_POLLS: 5 * 60 * 1000, // 5 minutes
  POLL_RESULTS: 30 * 1000, // 30 seconds (real-time updates)
  UNIVERSITIES: 24 * 60 * 60 * 1000, // 24 hours (static data)
} as const;

const CURRENT_CACHE_VERSION = '2.0.0';

// ============================================================================
// CACHE DATA STRUCTURES
// ============================================================================

interface CacheData<T> {
  value: T;
  timestamp: number;
  expiry: number;
  version: string;
}

interface VoteDetail {
  pollId: string;
  universityId: string;
  votedAt: number;
}

// ============================================================================
// STORAGE AVAILABILITY CHECK
// ============================================================================

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    console.warn('[Storage] localStorage not available');
    return false;
  }
}

/**
 * Check if sessionStorage is available
 */
export function isSessionStorageAvailable(): boolean {
  try {
    const test = '__session_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    console.warn('[Storage] sessionStorage not available');
    return false;
  }
}

// ============================================================================
// FINGERPRINT STORAGE
// ============================================================================

/**
 * Store fingerprint in localStorage with expiry
 */
export function storeFingerprint(fingerprint: string): void {
  if (!isStorageAvailable()) return;
  
  try {
    const data: CacheData<string> = {
      value: fingerprint,
      timestamp: Date.now(),
      expiry: CACHE_EXPIRY.FINGERPRINT,
      version: CURRENT_CACHE_VERSION,
    };
    localStorage.setItem(STORAGE_KEYS.FINGERPRINT, JSON.stringify(data));
    console.log('[Storage] Fingerprint stored');
  } catch (err) {
    console.error('[Storage] Error storing fingerprint:', err);
  }
}

/**
 * Get stored fingerprint if not expired
 */
export function getStoredFingerprint(): string | null {
  if (!isStorageAvailable()) return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FINGERPRINT);
    if (!stored) return null;

    const data = JSON.parse(stored) as CacheData<string>;
    const age = Date.now() - data.timestamp;

    // Check version mismatch
    if (data.version !== CURRENT_CACHE_VERSION) {
      localStorage.removeItem(STORAGE_KEYS.FINGERPRINT);
      return null;
    }

    // Check if expired
    if (age > data.expiry) {
      localStorage.removeItem(STORAGE_KEYS.FINGERPRINT);
      return null;
    }

    return data.value;
  } catch (err) {
    console.error('[Storage] Error retrieving fingerprint:', err);
    return null;
  }
}

// ============================================================================
// VOTED POLLS TRACKING (CRITICAL FOR ANTI-SPAM)
// ============================================================================

/**
 * Mark a poll as voted with details
 */
export function markPollAsVoted(
  pollId: string,
  universityId: string
): void {
  if (!isStorageAvailable()) return;
  
  try {
    // Update voted polls list
    const voted = getVotedPolls();
    if (!voted.includes(pollId)) {
      voted.push(pollId);
      localStorage.setItem(STORAGE_KEYS.VOTED_POLLS, JSON.stringify(voted));
    }

    // Store vote details
    const details = getVoteDetails();
    details[pollId] = {
      pollId,
      universityId,
      votedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.VOTE_DETAILS, JSON.stringify(details));
    
    console.log('[Storage] Poll marked as voted:', pollId);
  } catch (err) {
    console.error('[Storage] Error marking poll as voted:', err);
  }
}

/**
 * Check if a poll has been voted on (instant local check)
 */
export function hasVotedOnPoll(pollId: string): boolean {
  if (!isStorageAvailable()) return false;
  
  try {
    const voted = getVotedPolls();
    return voted.includes(pollId);
  } catch (err) {
    console.error('[Storage] Error checking voted status:', err);
    return false;
  }
}

/**
 * Get what university the user voted for in a poll
 */
export function getVotedUniversity(pollId: string): string | null {
  if (!isStorageAvailable()) return null;
  
  try {
    const details = getVoteDetails();
    return details[pollId]?.universityId || null;
  } catch (err) {
    console.error('[Storage] Error getting voted university:', err);
    return null;
  }
}

/**
 * Get all voted poll IDs
 */
export function getVotedPolls(): string[] {
  if (!isStorageAvailable()) return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VOTED_POLLS);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('[Storage] Error retrieving voted polls:', err);
    return [];
  }
}

/**
 * Get all vote details
 */
export function getVoteDetails(): Record<string, VoteDetail> {
  if (!isStorageAvailable()) return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VOTE_DETAILS);
    return stored ? JSON.parse(stored) : {};
  } catch (err) {
    console.error('[Storage] Error retrieving vote details:', err);
    return {};
  }
}

/**
 * Clear voted polls (useful for testing)
 */
export function clearVotedPolls(): void {
  if (!isStorageAvailable()) return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.VOTED_POLLS);
    localStorage.removeItem(STORAGE_KEYS.VOTE_DETAILS);
    console.log('[Storage] Voted polls cleared');
  } catch (err) {
    console.error('[Storage] Error clearing voted polls:', err);
  }
}

// ============================================================================
// VOTER TYPE STORAGE (PHASE 2 ANALYTICS)
// ============================================================================

/**
 * Store user's self-reported voter type
 */
export function storeVoterType(
  voterType: 'student' | 'alumni' | 'applicant' | 'other'
): void {
  if (!isStorageAvailable()) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.VOTER_TYPE, voterType);
    console.log('[Storage] Voter type stored:', voterType);
  } catch (err) {
    console.error('[Storage] Error storing voter type:', err);
  }
}

/**
 * Get stored voter type
 */
export function getStoredVoterType(): 'student' | 'alumni' | 'applicant' | 'other' | null {
  if (!isStorageAvailable()) return null;
  
  try {
    const voterType = localStorage.getItem(STORAGE_KEYS.VOTER_TYPE);
    return voterType as 'student' | 'alumni' | 'applicant' | 'other' | null;
  } catch (err) {
    console.error('[Storage] Error retrieving voter type:', err);
    return null;
  }
}

// ============================================================================
// SESSION CACHE (SOLVES "LONG WAIT" PROBLEM)
// ============================================================================

/**
 * Cache active polls in session storage
 */
export function cacheActivePolls(polls: Poll[]): void {
  if (!isSessionStorageAvailable()) return;
  
  try {
    const data: CacheData<Poll[]> = {
      value: polls,
      timestamp: Date.now(),
      expiry: CACHE_EXPIRY.ACTIVE_POLLS,
      version: CURRENT_CACHE_VERSION,
    };
    sessionStorage.setItem(SESSION_KEYS.ACTIVE_POLLS, JSON.stringify(data));
    console.log(`[Storage] Cached ${polls.length} active polls`);
  } catch (err) {
    console.error('[Storage] Error caching active polls:', err);
  }
}

/**
 * Get cached active polls if not expired
 */
export function getCachedActivePolls(): Poll[] | null {
  if (!isSessionStorageAvailable()) return null;
  
  try {
    const stored = sessionStorage.getItem(SESSION_KEYS.ACTIVE_POLLS);
    if (!stored) return null;

    const data = JSON.parse(stored) as CacheData<Poll[]>;
    const age = Date.now() - data.timestamp;

    // Check version
    if (data.version !== CURRENT_CACHE_VERSION) {
      sessionStorage.removeItem(SESSION_KEYS.ACTIVE_POLLS);
      return null;
    }

    // Check expiry
    if (age > data.expiry) {
      sessionStorage.removeItem(SESSION_KEYS.ACTIVE_POLLS);
      return null;
    }

    console.log(`[Storage] Retrieved ${data.value.length} cached polls`);
    return data.value;
  } catch (err) {
    console.error('[Storage] Error retrieving cached polls:', err);
    return null;
  }
}

/**
 * Cache poll results for instant display
 */
export function cachePollResults(
  pollId: string,
  results: PollResultsAggregate
): void {
  if (!isSessionStorageAvailable()) return;
  
  try {
    const key = `${SESSION_KEYS.POLL_RESULTS}_${pollId}`;
    const data: CacheData<PollResultsAggregate> = {
      value: results,
      timestamp: Date.now(),
      expiry: CACHE_EXPIRY.POLL_RESULTS,
      version: CURRENT_CACHE_VERSION,
    };
    sessionStorage.setItem(key, JSON.stringify(data));
    console.log('[Storage] Cached results for poll:', pollId);
  } catch (err) {
    console.error('[Storage] Error caching poll results:', err);
  }
}

/**
 * Get cached poll results
 */
export function getCachedPollResults(
  pollId: string
): PollResultsAggregate | null {
  if (!isSessionStorageAvailable()) return null;
  
  try {
    const key = `${SESSION_KEYS.POLL_RESULTS}_${pollId}`;
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;

    const data = JSON.parse(stored) as CacheData<PollResultsAggregate>;
    const age = Date.now() - data.timestamp;

    // Check version
    if (data.version !== CURRENT_CACHE_VERSION) {
      sessionStorage.removeItem(key);
      return null;
    }

    // Check expiry
    if (age > data.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }

    console.log('[Storage] Retrieved cached results for poll:', pollId);
    return data.value;
  } catch (err) {
    console.error('[Storage] Error retrieving cached results:', err);
    return null;
  }
}
/**
 * NEW: Find cached results by poll slug instead of ID
 * FIXED: Improved error handling and check logic
 */
export function getCachedPollResultsBySlug(slug: string): PollResultsAggregate | null {
  if (!isStorageAvailable()) return null;
  
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('_results_')) { // More robust key check
        const stored = localStorage.getItem(key);
        if (!stored) continue;
        
        const cached = JSON.parse(stored);
        // Check if this specific cached item belongs to the slug we want
        if (cached.value?.pollSlug === slug || cached.value?.pollQuestion?.toLowerCase().includes(slug.replace('-', ' '))) {
          const age = Date.now() - cached.timestamp;
          if (age < CACHE_CONFIG.RESULTS_TTL) {
            return cached.value;
          }
        }
      }
    }
  } catch (e) {
    console.error('[Storage] Cache slug lookup failed', e);
  }
  return null;
}
/**
 * Invalidate poll results cache (after voting)
 */
export function invalidatePollResultsCache(pollId: string): void {
  if (!isSessionStorageAvailable()) return;
  
  try {
    const key = `${SESSION_KEYS.POLL_RESULTS}_${pollId}`;
    sessionStorage.removeItem(key);
    console.log('[Storage] Invalidated cache for poll:', pollId);
  } catch (err) {
    console.error('[Storage] Error invalidating cache:', err);
  }
}

// ============================================================================
// THEME STORAGE
// ============================================================================

/**
 * Store user's theme preference
 */
export function storeTheme(theme: 'light' | 'dark'): void {
  if (!isStorageAvailable()) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    console.log('[Storage] Theme stored:', theme);
  } catch (err) {
    console.error('[Storage] Error storing theme:', err);
  }
}

/**
 * Get stored theme preference
 */
export function getStoredTheme(): 'light' | 'dark' | null {
  if (!isStorageAvailable()) return null;
  
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme as 'light' | 'dark' | null;
  } catch (err) {
    console.error('[Storage] Error retrieving theme:', err);
    return null;
  }
}

// ============================================================================
// FAVORITES (FUTURE FEATURE)
// ============================================================================

export function addFavorite(pollId: string): void {
  if (!isStorageAvailable()) return;
  
  try {
    const favorites = getFavorites();
    if (!favorites.includes(pollId)) {
      favorites.push(pollId);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  } catch (err) {
    console.error('[Storage] Error adding favorite:', err);
  }
}

export function removeFavorite(pollId: string): void {
  if (!isStorageAvailable()) return;
  
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((id) => id !== pollId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  } catch (err) {
    console.error('[Storage] Error removing favorite:', err);
  }
}

export function getFavorites(): string[] {
  if (!isStorageAvailable()) return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('[Storage] Error retrieving favorites:', err);
    return [];
  }
}

export function isFavorite(pollId: string): boolean {
  try {
    const favorites = getFavorites();
    return favorites.includes(pollId);
  } catch (err) {
    console.error('[Storage] Error checking favorite status:', err);
    return false;
  }
}

// ============================================================================
// VIEWED POLLS TRACKING
// ============================================================================

export function markPollAsViewed(pollId: string): void {
  if (!isStorageAvailable()) return;
  
  try {
    const viewed = getViewedPolls();
    
    const entry = {
      pollId,
      timestamp: Date.now(),
    };
    
    const filtered = viewed.filter((v) => v.pollId !== pollId);
    filtered.unshift(entry);
    
    const limited = filtered.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEYS.VIEWED_POLLS, JSON.stringify(limited));
  } catch (err) {
    console.error('[Storage] Error marking poll as viewed:', err);
  }
}

export function getViewedPolls(): Array<{ pollId: string; timestamp: number }> {
  if (!isStorageAvailable()) return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VIEWED_POLLS);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('[Storage] Error retrieving viewed polls:', err);
    return [];
  }
}

// ============================================================================
// LAST VISIT TRACKING
// ============================================================================

export function updateLastVisit(): void {
  if (!isStorageAvailable()) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, Date.now().toString());
  } catch (err) {
    console.error('[Storage] Error updating last visit:', err);
  }
}

export function getLastVisit(): number | null {
  if (!isStorageAvailable()) return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
    return stored ? parseInt(stored, 10) : null;
  } catch (err) {
    console.error('[Storage] Error retrieving last visit:', err);
    return null;
  }
}

export function isFirstVisit(): boolean {
  return getLastVisit() === null;
}

// ============================================================================
// CACHE VERSION MANAGEMENT
// ============================================================================

/**
 * Check if cache version has changed (invalidate all caches)
 */
export function checkCacheVersion(): boolean {
  if (!isStorageAvailable()) return true;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CACHE_VERSION);
    
    if (!stored || stored !== CURRENT_CACHE_VERSION) {
      // Version changed, clear all caches
      clearAllCache();
      localStorage.setItem(STORAGE_KEYS.CACHE_VERSION, CURRENT_CACHE_VERSION);
      console.log('[Storage] Cache version updated to:', CURRENT_CACHE_VERSION);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('[Storage] Error checking cache version:', err);
    return true;
  }
}

// ============================================================================
// CLEANUP & MAINTENANCE
// ============================================================================

/**
 * Clear all session cache
 */
export function clearAllCache(): void {
  if (!isSessionStorageAvailable()) return;
  
  try {
    sessionStorage.clear();
    console.log('[Storage] All session cache cleared');
  } catch (err) {
    console.error('[Storage] Error clearing all cache:', err);
  }
}

/**
 * Clear all app storage (reset everything)
 */
export function clearAllStorage(): void {
  try {
    if (isStorageAvailable()) {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    }
    
    if (isSessionStorageAvailable()) {
      sessionStorage.clear();
    }
    
    console.log('[Storage] All storage cleared');
  } catch (err) {
    console.error('[Storage] Error clearing all storage:', err);
  }
}

/**
 * Get storage stats for debugging
 */
export function getStorageStats(): {
  localStorage: { used: number; available: boolean };
  sessionStorage: { used: number; available: boolean };
  votedPolls: number;
  cachedPolls: number;
} {
  let localUsed = 0;
  let sessionUsed = 0;
  
  try {
    if (isStorageAvailable()) {
      const localStr = JSON.stringify(localStorage);
      localUsed = new Blob([localStr]).size;
    }
    
    if (isSessionStorageAvailable()) {
      const sessionStr = JSON.stringify(sessionStorage);
      sessionUsed = new Blob([sessionStr]).size;
    }
  } catch (err) {
    console.error('[Storage] Error calculating storage stats:', err);
  }
  
  return {
    localStorage: {
      used: localUsed,
      available: isStorageAvailable(),
    },
    sessionStorage: {
      used: sessionUsed,
      available: isSessionStorageAvailable(),
    },
    votedPolls: getVotedPolls().length,
    cachedPolls: getCachedActivePolls()?.length || 0,
  };
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  isStorageAvailable,
  storeFingerprint,
  getStoredFingerprint,
  markPollAsVoted,
  hasVotedOnPoll,
  getVotedUniversity,
  getVotedPolls,
  clearVotedPolls,
  storeVoterType,
  getStoredVoterType,
  cacheActivePolls,
  getCachedActivePolls,
  cachePollResults,
  getCachedPollResults,
  invalidatePollResultsCache,
  storeTheme,
  getStoredTheme,
  checkCacheVersion,
  clearAllCache,
  clearAllStorage,
  getStorageStats,
};