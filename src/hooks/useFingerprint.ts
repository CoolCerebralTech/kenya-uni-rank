import { useEffect, useState } from 'react';
import { FingerprintService } from '../services/fingerprint';

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        const visitorId = await FingerprintService.getVisitorId();
        setFingerprint(visitorId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to generate fingerprint'));
        console.error('Fingerprint error:', err);
      } finally {
        setLoading(false);
      }
    };

    getFingerprint();
  }, []);

  return { fingerprint, loading, error };
}