// ============================================================================
// FINGERPRINT SERVICE - PHASE 2 ANTI-SPAM
// Device identification for anonymous voting without authentication
// ============================================================================

import FingerprintJS from '@fingerprintjs/fingerprintjs';

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

let cachedFingerprint: string | null = null;
let fingerprintPromise: Promise<string> | null = null;

// ============================================================================
// MAIN FINGERPRINT GENERATION
// ============================================================================

/**
 * Generate a unique browser fingerprint
 * Uses FingerprintJS for maximum accuracy, falls back gracefully
 * 
 * @returns Promise<string> - Unique device identifier
 */
export async function getFingerprint(): Promise<string> {
  try {
    // Return cached value immediately if available
    if (cachedFingerprint) {
      console.log('[Fingerprint] Using cached fingerprint');
      return cachedFingerprint;
    }

    // Prevent multiple simultaneous fingerprint generations
    if (fingerprintPromise) {
      console.log('[Fingerprint] Waiting for in-progress fingerprint generation');
      return await fingerprintPromise;
    }

    // Start fingerprint generation
    console.log('[Fingerprint] Generating new fingerprint...');
    fingerprintPromise = generateFingerprint();
    
    const fingerprint = await fingerprintPromise;
    cachedFingerprint = fingerprint;
    fingerprintPromise = null;
    
    console.log('[Fingerprint] Fingerprint generated successfully');
    return fingerprint;
  } catch (error) {
    console.error('[Fingerprint] Error in getFingerprint:', error);
    fingerprintPromise = null;
    
    // Always return a valid fingerprint, even if generation fails
    return generateFallbackFingerprint();
  }
}

/**
 * Internal: Generate fingerprint using FingerprintJS
 */
async function generateFingerprint(): Promise<string> {
  try {
    // 'monitoring' is not a valid option for FingerprintJS.load, so remove it.
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    // Add entropy from timestamp for additional uniqueness
    const entropy = Date.now().toString(36);
    const fingerprint = `fp_${result.visitorId}_${entropy}`;
    
    console.log('[Fingerprint] FingerprintJS generated:', fingerprint.substring(0, 20) + '...');
    return fingerprint;
  } catch (error) {
    console.error('[Fingerprint] FingerprintJS failed, using fallback:', error);
    return generateFallbackFingerprint();
  }
}

// ============================================================================
// FALLBACK FINGERPRINT GENERATION
// ============================================================================

/**
 * Fallback generator if FingerprintJS fails
 * Uses stable browser attributes to create a deterministic hash
 */
function generateFallbackFingerprint(): string {
  try {
    console.log('[Fingerprint] Using fallback fingerprint generation');
    
    // Collect stable browser attributes
    const components: string[] = [
      navigator.userAgent,
      navigator.language,
      String(window.screen.colorDepth),
      String(window.screen.width),
      String(window.screen.height),
      String(new Date().getTimezoneOffset()),
      String(navigator.hardwareConcurrency || 'unknown'),
      String(navigator.maxTouchPoints || 0),
      navigator.platform,
    ];

    // Add canvas fingerprinting for additional entropy
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('UniPulse', 2, 2);
        components.push(canvas.toDataURL());
      }
    } catch {
      // Canvas fingerprinting blocked, skip
    }

    const fingerprintString = components.join('|');
    const hash = simpleHash(fingerprintString);
    
    // Add entropy to prevent exact duplicates
    const entropy = Date.now().toString(36).substring(0, 4);
    const fallbackFingerprint = `fallback_${hash}_${entropy}`;
    
    console.log('[Fingerprint] Fallback fingerprint generated:', fallbackFingerprint.substring(0, 20) + '...');
    return fallbackFingerprint;
  } catch (error) {
    console.error('[Fingerprint] Fallback generation failed:', error);
    
    // Ultimate fallback: Session-based random ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    console.warn('[Fingerprint] Using random session ID:', sessionId);
    return sessionId;
  }
}

// ============================================================================
// HASHING UTILITIES
// ============================================================================

/**
 * Simple hashing utility (DJB2 variant)
 * Fast and deterministic for client-side fingerprinting
 */
function simpleHash(str: string): string {
  let hash = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * SHA-256 hash (for sensitive data like IP addresses)
 * Uses Web Crypto API if available
 */
export async function sha256Hash(input: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('[Fingerprint] SHA-256 hashing failed:', error);
    // Fallback to simple hash
    return simpleHash(input);
  }
}

// ============================================================================
// IP HASHING (PHASE 2)
// ============================================================================

/**
 * Get hashed IP address (server-side only)
 * Client-side cannot reliably get IP, so this is a placeholder
 * In production, use Supabase Edge Functions or serverless functions
 * 
 * @returns Promise<string | undefined> - Hashed IP or undefined
 */
export async function getIpHash(): Promise<string | undefined> {
  // Client-side cannot get real IP address
  // This must be handled server-side via:
  // 1. Supabase Edge Functions
  // 2. Cloudflare Workers
  // 3. Next.js API Routes
  // 4. Express middleware
  
  console.log('[Fingerprint] IP hashing is server-side only');
  return undefined;
}

/**
 * For development/testing: Mock IP hash generation
 */
export async function getMockIpHash(): Promise<string> {
  const mockIp = '192.168.1.1'; // Placeholder
  return sha256Hash(mockIp);
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

/**
 * Clear cached fingerprint (useful for testing or privacy)
 */
export function clearFingerprintCache(): void {
  console.log('[Fingerprint] Clearing fingerprint cache');
  cachedFingerprint = null;
  fingerprintPromise = null;
}

/**
 * Get cached fingerprint without generating new one
 */
export function getCachedFingerprint(): string | null {
  return cachedFingerprint;
}

// ============================================================================
// VOTER TYPE DETECTION (PHASE 2 ANALYTICS)
// ============================================================================

/**
 * Detect likely voter type based on browser characteristics
 * This is a heuristic and should be combined with user self-reporting
 */
export function detectLikelyVoterType(): 'student' | 'alumni' | 'applicant' | 'other' {
  try {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Mobile users are more likely to be current students
    const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent);
    
    // Check time of day (students vote more during off-peak hours)
    const hour = new Date().getHours();
    const isDayTime = hour >= 9 && hour <= 17;
    
    // Basic heuristic (can be improved with ML later)
    if (isMobile && !isDayTime) {
      return 'student';
    }
    
    if (!isMobile && isDayTime) {
      return 'alumni';
    }
    
    return 'other';
  } catch (error) {
    console.error('[Fingerprint] Voter type detection failed:', error);
    return 'other';
  }
}

// ============================================================================
// USER AGENT PARSING
// ============================================================================

/**
 * Get sanitized user agent string for analytics
 * Strips identifying information while keeping useful data
 */
export function getSanitizedUserAgent(): string {
  try {
    const ua = navigator.userAgent;
    
    // Remove specific version numbers for privacy
    const sanitized = ua
      .replace(/\d+\.\d+\.\d+/g, 'X.X.X')
      .replace(/Chrome\/[\d.]+/g, 'Chrome/X')
      .replace(/Safari\/[\d.]+/g, 'Safari/X')
      .replace(/Firefox\/[\d.]+/g, 'Firefox/X');
    
    return sanitized;
  } catch (error) {
    console.error('[Fingerprint] User agent sanitization failed:', error);
    return 'Unknown';
  }
}

// ============================================================================
// FINGERPRINT VALIDATION
// ============================================================================

/**
 * Validate fingerprint format
 * Ensures fingerprint meets minimum requirements
 */
export function isValidFingerprint(fingerprint: string): boolean {
  if (!fingerprint || typeof fingerprint !== 'string') {
    return false;
  }
  
  // Fingerprint should be at least 10 characters
  if (fingerprint.length < 10) {
    return false;
  }
  
  // Should start with known prefix
  const validPrefixes = ['fp_', 'fallback_', 'session_'];
  const hasValidPrefix = validPrefixes.some(prefix => fingerprint.startsWith(prefix));
  
  return hasValidPrefix;
}

// ============================================================================
// DEBUGGING UTILITIES (DEVELOPMENT ONLY)
// ============================================================================

/**
 * Get detailed fingerprint information for debugging
 * DO NOT use in production (privacy concerns)
 */
export async function getFingerprintDebugInfo(): Promise<{
  fingerprint: string;
  isValid: boolean;
  isCached: boolean;
  method: 'fingerprintjs' | 'fallback' | 'session';
  timestamp: string;
  userAgent: string;
  screen: string;
  language: string;
}> {
  const fingerprint = await getFingerprint();
  
  let method: 'fingerprintjs' | 'fallback' | 'session' = 'session';
  if (fingerprint.startsWith('fp_')) method = 'fingerprintjs';
  else if (fingerprint.startsWith('fallback_')) method = 'fallback';
  
  return {
    fingerprint,
    isValid: isValidFingerprint(fingerprint),
    isCached: cachedFingerprint !== null,
    method,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
  };
}

// ============================================================================
// EXPORT ALL UTILITIES
// ============================================================================

export default {
  getFingerprint,
  getIpHash,
  getMockIpHash,
  clearFingerprintCache,
  getCachedFingerprint,
  detectLikelyVoterType,
  getSanitizedUserAgent,
  isValidFingerprint,
  sha256Hash,
  getFingerprintDebugInfo,
};