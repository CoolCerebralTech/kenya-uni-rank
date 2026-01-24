// ============================================================================
// UNIVERSITY SERVICE - PHASE 2 PRODUCTION
// Handles university data with database-first approach
// ============================================================================

import { universities } from '../data/universities';
import { getUniversities as dbGetUniversities } from './database.service';
import type { University } from '../types/models';
import type { DatabaseResponse } from './database.service';

// ============================================================================
// IN-MEMORY CACHE
// ============================================================================

let cachedUniversities: University[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ============================================================================
// CORE OPERATIONS
// ============================================================================

/**
 * Get all universities (database-first with fallback)
 */
export async function getAllUniversities(): Promise<DatabaseResponse<University[]>> {
  try {
    // Check cache first
    if (cachedUniversities && cacheTimestamp) {
      const age = Date.now() - cacheTimestamp;
      if (age < CACHE_TTL) {
        console.log('[University Service] Using cached universities');
        return {
          success: true,
          data: cachedUniversities,
          error: null,
        };
      }
    }

    // Try database
    console.log('[University Service] Fetching from database');
    const response = await dbGetUniversities();

    if (response.success && response.data && response.data.length > 0) {
      const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name));
      
      // Update cache
      cachedUniversities = sorted;
      cacheTimestamp = Date.now();
      
      console.log(`[University Service] Fetched ${sorted.length} universities from DB`);
      return {
        success: true,
        data: sorted,
        error: null,
      };
    }

    // Fallback to static data
    console.log('[University Service] Using static fallback data');
    const fallback = [...universities].sort((a, b) => a.name.localeCompare(b.name));
    
    cachedUniversities = fallback;
    cacheTimestamp = Date.now();
    
    return {
      success: true,
      data: fallback,
      error: null,
    };
  } catch (err) {
    console.error('[University Service] Error fetching universities:', err);
    
    // Ultimate fallback
    const fallback = [...universities].sort((a, b) => a.name.localeCompare(b.name));
    return {
      success: true,
      data: fallback,
      error: 'Using static fallback data',
    };
  }
}

/**
 * Get universities synchronously from static data
 */
export function getAllUniversitiesSync(): University[] {
  return [...universities].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a specific university by ID
 */
export function getUniversityById(id: string): University | undefined {
  // Check cache first
  if (cachedUniversities) {
    return cachedUniversities.find((u) => u.id === id);
  }
  
  // Fall back to static data
  return universities.find((u) => u.id === id);
}

/**
 * Get universities by type
 */
export async function getUniversitiesByType(
  type: 'Public' | 'Private'
): Promise<DatabaseResponse<University[]>> {
  try {
    const response = await dbGetUniversities(type);

    if (response.success && response.data && response.data.length > 0) {
      console.log(`[University Service] Fetched ${response.data.length} ${type} universities`);
      return response;
    }

    // Fallback to static data
    const fallback = universities.filter((u) => u.type === type);
    console.log(`[University Service] Using static data for ${type} universities`);
    
    return {
      success: true,
      data: fallback,
      error: null,
    };
  } catch (err) {
    console.error('[University Service] Error fetching by type:', err);
    const fallback = universities.filter((u) => u.type === type);
    return {
      success: true,
      data: fallback,
      error: 'Using static fallback data',
    };
  }
}

/**
 * Get universities by type synchronously
 */
export function getUniversitiesByTypeSync(
  type: 'Public' | 'Private'
): University[] {
  return universities.filter((u) => u.type === type);
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

/**
 * Search universities by name, short name, or location
 */
export function searchUniversities(query: string): University[] {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return getAllUniversitiesSync();
  }

  return universities.filter(
    (u) =>
      u.name.toLowerCase().includes(lowerQuery) ||
      u.shortName.toLowerCase().includes(lowerQuery) ||
      u.location.toLowerCase().includes(lowerQuery) ||
      u.id.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get universities by location
 */
export function getUniversitiesByLocation(location: string): University[] {
  const lowerLocation = location.toLowerCase().trim();
  return universities.filter((u) =>
    u.location.toLowerCase().includes(lowerLocation)
  );
}

/**
 * Get universities grouped by type
 */
export function getUniversitiesGroupedByType(): {
  public: University[];
  private: University[];
} {
  const publicUnis = universities
    .filter((u) => u.type === 'Public')
    .sort((a, b) => a.name.localeCompare(b.name));
    
  const privateUnis = universities
    .filter((u) => u.type === 'Private')
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    public: publicUnis,
    private: privateUnis,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get university color
 */
export function getUniversityColor(id: string): string {
  const uni = getUniversityById(id);
  return uni?.color || '#000000';
}

/**
 * Get university short name
 */
export function getUniversityShortName(id: string): string {
  const uni = getUniversityById(id);
  return uni?.shortName || id.toUpperCase();
}

/**
 * Get university name
 */
export function getUniversityName(id: string): string {
  const uni = getUniversityById(id);
  return uni?.name || id.toUpperCase();
}

/**
 * Get university metadata
 */
export function getUniversityMetadata(id: string): {
  id: string;
  name: string;
  shortName: string;
  type: 'Public' | 'Private';
  location: string;
  color: string;
} | null {
  const uni = getUniversityById(id);
  if (!uni) return null;

  return {
    id: uni.id,
    name: uni.name,
    shortName: uni.shortName,
    type: uni.type,
    location: uni.location,
    color: uni.color,
  };
}

/**
 * Validate if a university ID exists
 */
export function universityExists(id: string): boolean {
  return universities.some((u) => u.id === id);
}

/**
 * Get random university (for demos/testing)
 */
export function getRandomUniversity(): University {
  const randomIndex = Math.floor(Math.random() * universities.length);
  return universities[randomIndex];
}

/**
 * Get all unique locations
 */
export function getUniqueLocations(): string[] {
  const locations = universities.map((u) => u.location);
  return Array.from(new Set(locations)).sort();
}

/**
 * Get university count statistics
 */
export function getUniversityCount(): {
  total: number;
  public: number;
  private: number;
} {
  const publicCount = universities.filter((u) => u.type === 'Public').length;
  const privateCount = universities.filter((u) => u.type === 'Private').length;

  return {
    total: universities.length,
    public: publicCount,
    private: privateCount,
  };
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Clear university cache (force refresh)
 */
export function clearUniversityCache(): void {
  console.log('[University Service] Clearing cache');
  cachedUniversities = null;
  cacheTimestamp = null;
}

/**
 * Pre-load universities into cache
 */
export async function preloadUniversities(): Promise<void> {
  console.log('[University Service] Pre-loading universities');
  await getAllUniversities();
}

/**
 * Get cache status
 */
export function getCacheStatus(): {
  isCached: boolean;
  cacheAge: number | null;
  itemCount: number;
} {
  return {
    isCached: cachedUniversities !== null,
    cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
    itemCount: cachedUniversities?.length || 0,
  };
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  getAllUniversities,
  getAllUniversitiesSync,
  getUniversityById,
  getUniversitiesByType,
  getUniversitiesByTypeSync,
  searchUniversities,
  getUniversitiesByLocation,
  getUniversitiesGroupedByType,
  getUniversityColor,
  getUniversityShortName,
  getUniversityName,
  getUniversityMetadata,
  universityExists,
  getRandomUniversity,
  getUniqueLocations,
  getUniversityCount,
  clearUniversityCache,
  preloadUniversities,
  getCacheStatus,
};