// --- 1. CORE ENTITIES ---

export interface University {
  id: string; // e.g. "uon" (Primary Key)
  slug: string; // e.g. "uon"
  name: string;
  shortName: string;
  type: 'Public' | 'Private';
  location: string;
  color: string; // For UI branding
  website?: string;
}

export interface Poll {
  id: string; // UUID
  question: string; // e.g. "Which uni has the best sports?"
  slug: string; // e.g. "best-sports"
  category: 'vibes' | 'academics' | 'sports' | 'general';
  isActive: boolean;
  totalVotes: number; // We will count this via SQL
}

// --- 2. VOTING LOGIC ---

export interface Vote {
  id: string; // UUID
  pollId: string;
  universityId: string; // The uni the user CHOSE
  fingerprintHash: string; // Browser fingerprint to prevent spam
  createdAt: string; // Supabase returns ISO strings, not Date objects
}

// --- 3. UI/RESULTS ---

// This is what we use to display the charts
export interface PollResult {
  universityId: string;
  universityName: string;
  universityColor: string;
  votes: number;
  percentage: number;
}