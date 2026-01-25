// ============================================================================
// useFingerprint - Device Identification Hook
// Manages browser fingerprinting for anonymous vote tracking
// ============================================================================

import { useEffect, useState } from 'react';
import { 
  getFingerprint, 
  clearFingerprintCache 
} from '../services/fingerprint.service';
import { 
  getStoredFingerprint, 
  storeFingerprint 
} from '../services/storage.service';

interface UseFingerprintResult {
  fingerprint: string | null;
  loading: boolean;
  error: Error | null;
  isReady: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook to get and cache browser fingerprint
 * Used for anonymous vote tracking across the app
 * 
 * @example
 * const { fingerprint, loading, isReady } = useFingerprint();
 * 
 * if (!isReady) return <Spinner />;
 * 
 * await castVote(pollId, universityId, fingerprint);
 */
export function useFingerprint(): UseFingerprintResult {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const generateFingerprint = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check localStorage first (instant)
      const cached = getStoredFingerprint();
      if (cached) {
        console.log('[useFingerprint] Using cached fingerprint');
        setFingerprint(cached);
        setLoading(false);
        return;
      }

      // Generate new fingerprint
      console.log('[useFingerprint] Generating new fingerprint');
      const newFingerprint = await getFingerprint();
      
      // Store for future use
      storeFingerprint(newFingerprint);
      
      setFingerprint(newFingerprint);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err 
        : new Error('Failed to generate fingerprint');
      
      setError(errorMessage);
      console.error('[useFingerprint] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh fingerprint (useful for testing)
  const refresh = async () => {
    clearFingerprintCache();
    await generateFingerprint();
  };

  useEffect(() => {
    generateFingerprint();
  }, []);

  return { 
    fingerprint, 
    loading, 
    error,
    isReady: !loading && fingerprint !== null && error === null,
    refresh,
  };
}

export default useFingerprint;