import { useEffect, useState } from 'react';
import { getFingerprint, isFingerprintingSupported } from '../services/fingerprint.service';
import { getStoredFingerprint, storeFingerprint } from '../services/storage.service';

/**
 * Custom hook to get and cache browser fingerprint
 * Used for anonymous vote tracking
 */
export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initFingerprint = async () => {
      try {
        // Check if fingerprinting is supported
        if (!isFingerprintingSupported()) {
          throw new Error('Browser fingerprinting is not supported in this environment');
        }

        // Try to get cached fingerprint first
        const cached = getStoredFingerprint();
        if (cached) {
          setFingerprint(cached);
          setLoading(false);
          return;
        }

        // Generate new fingerprint
        const newFingerprint = await getFingerprint();
        
        // Store for future use
        storeFingerprint(newFingerprint);
        
        setFingerprint(newFingerprint);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to generate fingerprint';
        
        setError(new Error(errorMessage));
        console.error('Fingerprint error:', err);
      } finally {
        setLoading(false);
      }
    };

    initFingerprint();
  }, []);

  return { 
    fingerprint, 
    loading, 
    error,
    // Helper to check if fingerprint is ready
    isReady: !loading && fingerprint !== null && error === null,
  };
}