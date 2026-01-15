// ============================================================================
// SERVICES INDEX
// Central export point for all services
// ============================================================================

// Database operations
export * from './database.service';

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

// Storage & Caching
export * from './storage.service';