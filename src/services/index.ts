// ============================================================================
// SERVICES INDEX
// Central export point for all services - Phase 2
// ============================================================================

// Database operations
export * from './database.service';

// Poll lifecycle and management (NEW - Phase 2)
//export * from './poll.service';

// Voting operations
//export * from './voting.service';

// University operations
export { UniversityService } from './university.service';
export {
  getUniversity,
  getUniversityColor,
  getAllUniversities,
  searchUniversities,
} from './university.service';

// Fingerprinting
export {
  getFingerprint,
  getIpHash,
  clearFingerprintCache,
  isFingerprintingSupported,
} from './fingerprint.service';

// Analytics
export * from './analytics.service';

// Insights & Trends (NEW - Phase 2)
export * from './insights.service';

// Storage & Caching
export * from './storage.service';