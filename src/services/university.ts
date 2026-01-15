import { universities } from '../data/universities';
import type { University } from '../types';

export class UniversityService {
  /**
   * Get all universities (Static)
   * Sorted alphabetically by default
   */
  static getAll(): University[] {
    return universities.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get a specific university by ID (e.g., 'uon')
   */
  static getById(id: string): University | undefined {
    return universities.find((u) => u.id === id);
  }

  /**
   * Get universities by Type (Public vs Private)
   * Useful for filtering later
   */
  static getByType(type: 'Public' | 'Private'): University[] {
    return universities.filter((u) => u.type === type);
  }

  /**
   * Get a university's color or fallback
   */
  static getColor(id: string): string {
    const uni = this.getById(id);
    return uni?.color || '#000000';
  }
}