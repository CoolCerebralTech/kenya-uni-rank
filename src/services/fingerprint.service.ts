import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Cache the fingerprint to avoid recalculating
let cachedFingerprint: string | null = null;

/**
 * Generate a unique browser fingerprint
 * This prevents users from voting multiple times
 * 
 * Uses @fingerprintjs/fingerprintjs library which analyzes:
 * - Browser version
 * - OS and platform
 * - Screen resolution
 * - Timezone
 * - Canvas fingerprinting
 * - WebGL fingerprinting
 * - Audio fingerprinting
 * - And many more device attributes
 * 
 * @returns A unique hash string representing this browser/device
 */
export async function getFingerprint(): Promise<string> {
  try {
    // Return cached fingerprint if available
    if (cachedFingerprint) {
      return cachedFingerprint;
    }

    // Initialize FingerprintJS
    const fp = await FingerprintJS.load();

    // Get the visitor identifier
    const result = await fp.get();

    // Cache the fingerprint
    cachedFingerprint = result.visitorId;

    return result.visitorId;
  } catch (error) {
    console.error('Error generating fingerprint:', error);
    
    // Fallback: Generate a simple fingerprint from browser data
    return generateFallbackFingerprint();
  }
}

/**
 * Fallback fingerprint generation if FingerprintJS fails
 * Less robust but better than nothing
 */
function generateFallbackFingerprint(): string {
  try {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.platform,
    ];

    const fingerprint = components.join('|');
    
    // Simple hash function
    return simpleHash(fingerprint);
  } catch (error) {
    console.error('Error generating fallback fingerprint:', error);
    // Last resort: random string (will allow multiple votes, but prevents crashes)
    return `fallback-${Date.now()}-${Math.random()}`;
  }
}

/**
 * Simple string hashing function
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Hash an IP address for privacy-preserving duplicate detection
 * Note: This requires backend support to get the actual IP
 * For now, we return undefined as IP hashing should be done server-side
 */
export async function getIpHash(): Promise<string | undefined> {
  // IP address should be hashed on the backend for privacy
  // We don't expose raw IPs to the client
  // This is a placeholder for future backend integration
  return undefined;
}

/**
 * Clear cached fingerprint (useful for testing)
 */
export function clearFingerprintCache(): void {
  cachedFingerprint = null;
}

/**
 * Check if fingerprinting is supported in this browser
 */
export function isFingerprintingSupported(): boolean {
  try {
    return !!(
      window.navigator &&
      window.screen &&
      typeof window.navigator.userAgent === 'string'
    );
  } catch {
    return false;
  }
}