import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Singleton to cache the visitorId so we only calculate it once per session
let cachedVisitorId: string | null = null;

export class FingerprintService {
  static async getVisitorId(): Promise<string> {
    // Return cached ID if we already have it
    if (cachedVisitorId) return cachedVisitorId;

    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      cachedVisitorId = result.visitorId;
      return result.visitorId;
    } catch (error) {
      console.warn('Fingerprint failed, using fallback', error);
      // Robust fallback: specific enough to stop casual spam, distinct enough for users
      const fallbackId = btoa(
        `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}-${new Date().getDate()}`
      );
      cachedVisitorId = fallbackId;
      return fallbackId;
    }
  }
}