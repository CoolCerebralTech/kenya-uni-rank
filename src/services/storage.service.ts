// ============================================================================
// STORAGE SERVICE
// Handles local storage, session storage, and caching
// ============================================================================

const STORAGE_KEYS = {
  FINGERPRINT: 'unipulse_fingerprint',
  VOTED_POLLS: 'unipulse_voted_polls',
  THEME: 'unipulse_theme',
  LAST_VISIT: 'unipulse_last_visit',
  FAVORITES: 'unipulse_favorites',
  VIEWED_POLLS: 'unipulse_viewed_polls',
} as const;

// Cache expiry times (in milliseconds)
const CACHE_EXPIRY = {
  FINGERPRINT: 7 * 24 * 60 * 60 * 1000, // 7 days
  POLLS: 5 * 60 * 1000, // 5 minutes
  RESULTS: 30 * 1000, // 30 seconds
} as const;

// ============================================================================
// FINGERPRINT STORAGE
// ============================================================================

/**
 * Store fingerprint in local storage
 */
export function storeFingerprint(fingerprint: string): void {
  try {
    const data = {
      value: fingerprint,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.FINGERPRINT, JSON.stringify(data));
  } catch (err) {
    console.error('Error storing fingerprint:', err);
  }
}

/**
 * Get stored fingerprint if not expired
 */
export function getStoredFingerprint(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FINGERPRINT);
    if (!stored) return null;

    const data = JSON.parse(stored);
    const age = Date.now() - data.timestamp;

    // Check if expired
    if (age > CACHE_EXPIRY.FINGERPRINT) {
      localStorage.removeItem(STORAGE_KEYS.FINGERPRINT);
      return null;
    }

    return data.value;
  } catch (err) {
    console.error('Error retrieving fingerprint:', err);
    return null;
  }
}

// ============================================================================
// VOTED POLLS TRACKING
// ============================================================================

/**
 * Mark a poll as voted (for client-side UI state)
 */
export function markPollAsVoted(pollId: string): void {
  try {
    const voted = getVotedPolls();
    if (!voted.includes(pollId)) {
      voted.push(pollId);
      localStorage.setItem(STORAGE_KEYS.VOTED_POLLS, JSON.stringify(voted));
    }
  } catch (err) {
    console.error('Error marking poll as voted:', err);
  }
}

/**
 * Check if a poll has been voted on (client-side check)
 */
export function hasVotedOnPoll(pollId: string): boolean {
  try {
    const voted = getVotedPolls();
    return voted.includes(pollId);
  } catch (err) {
    console.error('Error checking voted status:', err);
    return false;
  }
}

/**
 * Get all voted poll IDs
 */
export function getVotedPolls(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VOTED_POLLS);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error retrieving voted polls:', err);
    return [];
  }
}

/**
 * Clear voted polls (useful for testing)
 */
export function clearVotedPolls(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.VOTED_POLLS);
  } catch (err) {
    console.error('Error clearing voted polls:', err);
  }
}

// ============================================================================
// THEME STORAGE
// ============================================================================

/**
 * Store user's theme preference
 */
export function storeTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (err) {
    console.error('Error storing theme:', err);
  }
}

/**
 * Get stored theme preference
 */
export function getStoredTheme(): 'light' | 'dark' | null {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme as 'light' | 'dark' | null;
  } catch (err) {
    console.error('Error retrieving theme:', err);
    return null;
  }
}

// ============================================================================
// FAVORITES (For future feature)
// ============================================================================

/**
 * Add a poll to favorites
 */
export function addFavorite(pollId: string): void {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(pollId)) {
      favorites.push(pollId);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  } catch (err) {
    console.error('Error adding favorite:', err);
  }
}

/**
 * Remove a poll from favorites
 */
export function removeFavorite(pollId: string): void {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((id) => id !== pollId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  } catch (err) {
    console.error('Error removing favorite:', err);
  }
}

/**
 * Get all favorite poll IDs
 */
export function getFavorites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error retrieving favorites:', err);
    return [];
  }
}

/**
 * Check if a poll is favorited
 */
export function isFavorite(pollId: string): boolean {
  try {
    const favorites = getFavorites();
    return favorites.includes(pollId);
  } catch (err) {
    console.error('Error checking favorite status:', err);
    return false;
  }
}

// ============================================================================
// VIEWED POLLS TRACKING
// ============================================================================

/**
 * Mark a poll as viewed
 */
export function markPollAsViewed(pollId: string): void {
  try {
    const viewed = getViewedPolls();
    
    // Add poll with timestamp
    const entry = {
      pollId,
      timestamp: Date.now(),
    };
    
    // Remove old entry if exists
    const filtered = viewed.filter((v) => v.pollId !== pollId);
    filtered.unshift(entry); // Add to beginning
    
    // Keep only last 50
    const limited = filtered.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEYS.VIEWED_POLLS, JSON.stringify(limited));
  } catch (err) {
    console.error('Error marking poll as viewed:', err);
  }
}

/**
 * Get recently viewed polls
 */
export function getViewedPolls(): Array<{ pollId: string; timestamp: number }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VIEWED_POLLS);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error retrieving viewed polls:', err);
    return [];
  }
}

// ============================================================================
// LAST VISIT TRACKING
// ============================================================================

/**
 * Update last visit timestamp
 */
export function updateLastVisit(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, Date.now().toString());
  } catch (err) {
    console.error('Error updating last visit:', err);
  }
}

/**
 * Get last visit timestamp
 */
export function getLastVisit(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
    return stored ? parseInt(stored, 10) : null;
  } catch (err) {
    console.error('Error retrieving last visit:', err);
    return null;
  }
}

/**
 * Check if this is user's first visit
 */
export function isFirstVisit(): boolean {
  return getLastVisit() === null;
}

// ============================================================================
// CACHE UTILITIES
// ============================================================================

/**
 * Generic cache storage with expiry
 */
export function setCache<T>(key: string, data: T, expiryMs: number): void {
  try {
    const cacheData = {
      value: data,
      timestamp: Date.now(),
      expiry: expiryMs,
    };
    sessionStorage.setItem(key, JSON.stringify(cacheData));
  } catch (err) {
    console.error('Error setting cache:', err);
  }
}

/**
 * Get cached data if not expired
 */
export function getCache<T>(key: string): T | null {
  try {
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;

    const cacheData = JSON.parse(stored);
    const age = Date.now() - cacheData.timestamp;

    if (age > cacheData.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }

    return cacheData.value as T;
  } catch (err) {
    console.error('Error getting cache:', err);
    return null;
  }
}

/**
 * Clear specific cache
 */
export function clearCache(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    console.error('Error clearing cache:', err);
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  try {
    sessionStorage.clear();
  } catch (err) {
    console.error('Error clearing all cache:', err);
  }
}

// ============================================================================
// CLEANUP & MAINTENANCE
// ============================================================================

/**
 * Clear all app storage (reset everything)
 */
export function clearAllStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    sessionStorage.clear();
  } catch (err) {
    console.error('Error clearing all storage:', err);
  }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}