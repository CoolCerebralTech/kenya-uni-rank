import { universities } from '../data/universities';
import { getUniversities as dbGetUniversities } from './database.service';
import type { University } from '../types';

// ============================================================================
// UNIVERSITY SERVICE
// Handles university data operations
// Uses static data as fallback, but prefers fresh database data
// ============================================================================

export class UniversityService {
  /**
   * Get all universities from database (preferred) or static fallback
   * Sorted alphabetically by default
   */
  static async getAll(): Promise<University[]> {
    try {
      // Try to fetch from database first
      const dbUniversities = await dbGetUniversities();
      
      if (dbUniversities && dbUniversities.length > 0) {
        return dbUniversities.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      // Fallback to static data
      return universities.sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
      console.error('Error fetching universities, using static data:', err);
      return universities.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  /**
   * Get all universities synchronously from static data
   * Use this when you need immediate data without async
   */
  static getAllSync(): University[] {
    return universities.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get a specific university by ID (e.g., 'uon')
   * Checks static data for instant access
   */
  static getById(id: string): University | undefined {
    return universities.find((u) => u.id === id);
  }

  /**
   * Get universities by Type (Public vs Private)
   * @param type - 'Public' or 'Private'
   */
  static async getByType(type: 'Public' | 'Private'): Promise<University[]> {
    try {
      // Try database first
      const dbUniversities = await dbGetUniversities(type);
      
      if (dbUniversities && dbUniversities.length > 0) {
        return dbUniversities;
      }
      
      // Fallback to static data
      return universities.filter((u) => u.type === type);
    } catch (err) {
      console.error('Error fetching universities by type, using static data:', err);
      return universities.filter((u) => u.type === type);
    }
  }

  /**
   * Get universities by Type synchronously
   */
  static getByTypeSync(type: 'Public' | 'Private'): University[] {
    return universities.filter((u) => u.type === type);
  }

  /**
   * Get a university's color or fallback to default
   */
  static getColor(id: string): string {
    const uni = this.getById(id);
    return uni?.color || '#000000';
  }

  /**
   * Get a university's short name
   */
  static getShortName(id: string): string {
    const uni = this.getById(id);
    return uni?.shortName || id.toUpperCase();
  }

  /**
   * Search universities by name (case-insensitive)
   */
  static search(query: string): University[] {
    const lowerQuery = query.toLowerCase();
    return universities.filter(
      (u) =>
        u.name.toLowerCase().includes(lowerQuery) ||
        u.shortName.toLowerCase().includes(lowerQuery) ||
        u.location.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get universities grouped by type
   */
  static getGroupedByType(): {
    public: University[];
    private: University[];
  } {
    const publicUnis = universities.filter((u) => u.type === 'Public');
    const privateUnis = universities.filter((u) => u.type === 'Private');

    return {
      public: publicUnis.sort((a, b) => a.name.localeCompare(b.name)),
      private: privateUnis.sort((a, b) => a.name.localeCompare(b.name)),
    };
  }

  /**
   * Get university count
   */
  static getCount(): { total: number; public: number; private: number } {
    const publicCount = universities.filter((u) => u.type === 'Public').length;
    const privateCount = universities.filter((u) => u.type === 'Private').length;

    return {
      total: universities.length,
      public: publicCount,
      private: privateCount,
    };
  }

  /**
   * Validate if a university ID exists
   */
  static exists(id: string): boolean {
    return universities.some((u) => u.id === id);
  }

  /**
   * Get a random university (useful for demos/testing)
   */
  static getRandom(): University {
    const randomIndex = Math.floor(Math.random() * universities.length);
    return universities[randomIndex];
  }

  /**
   * Get universities by location
   */
  static getByLocation(location: string): University[] {
    const lowerLocation = location.toLowerCase();
    return universities.filter((u) =>
      u.location.toLowerCase().includes(lowerLocation)
    );
  }

  /**
   * Get all unique locations
   */
  static getLocations(): string[] {
    const locations = universities.map((u) => u.location);
    return Array.from(new Set(locations)).sort();
  }

  /**
   * Get university metadata (for SEO, analytics, etc.)
   */
  static getMetadata(id: string): {
    id: string;
    name: string;
    shortName: string;
    type: string;
    location: string;
    color: string;
  } | null {
    const uni = this.getById(id);
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
}

// ============================================================================
// HELPER FUNCTIONS (Convenience exports)
// ============================================================================

/**
 * Quick access to get a university by ID
 */
export function getUniversity(id: string): University | undefined {
  return UniversityService.getById(id);
}

/**
 * Quick access to get university color
 */
export function getUniversityColor(id: string): string {
  return UniversityService.getColor(id);
}

/**
 * Quick access to get all universities
 */
export async function getAllUniversities(): Promise<University[]> {
  return UniversityService.getAll();
}

/**
 * Quick access to search universities
 */
export function searchUniversities(query: string): University[] {
  return UniversityService.search(query);
}