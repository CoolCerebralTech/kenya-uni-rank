// ============================================================================
// UniPulse v3 — DEMO DATA LAYER
// ----------------------------------------------------------------------------
// Realistic, fully-populated Kenyan university dataset so the app looks alive
// at the interview even when Supabase is down or env is missing. Numbers are
// random-ish but deterministic per slug, so re-renders stay stable.
// Used by database.service.ts when `isSupabaseConfigured === false` or when
// a Supabase call fails (graceful degradation — the demo never breaks the UI).
// ============================================================================

import type {
  Poll,
  PollCategory,
  PollResult,
  PollResultsAggregate,
  University,
} from '../types/models';
import { getUniversityById } from '../data/universities';
// `universities` itself isn't read directly below — kept out to keep tsc happy.
export { universities } from '../data/universities';

// ---------------------------------------------------------------------------
// Deterministic pseudo-randomness — same seed → same numbers per poll slug.
// Stable results across reloads / re-renders so the demo never "jumps".
// ---------------------------------------------------------------------------
function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Normalize to [0,1)
  return ((h >>> 0) % 100000) / 100000;
}

// ---------------------------------------------------------------------------
// CURRENT CYCLE
// ---------------------------------------------------------------------------
const CURRENT_CYCLE = '2026-07';
const CYCLE_START_ISO = '2026-07-01T00:00:00.000Z';
const CYCLE_END_ISO = '2026-07-31T23:59:59.000Z';

// ---------------------------------------------------------------------------
// POLLS — 3 polls per category (18 total), realistic Kenyan questions
// ---------------------------------------------------------------------------
interface DemoPollSeed {
  slug: string;
  question: string;
  category: PollCategory;
  description?: string;
}

const POLL_SEEDS: DemoPollSeed[] = [
  // general
  { slug: 'best-overall-experience', category: 'general', question: 'Which university gives you the best overall student experience?', description: 'Think academics + social + campus + value combined.' },
  { slug: 'best-value-for-money', category: 'general', question: 'Which uni is the best value for your money?', description: 'Fees, accommodation costs, and what you actually get.' },
  { slug: 'recommend-to-friend', category: 'general', question: 'Which uni would you recommend to a friend?', description: 'The one you would send your younger sibling to.' },
  // vibes
  { slug: 'best-vibes', category: 'vibes', question: 'Which uni has the best campus vibes?', description: 'The feeling you get walking through the gates.' },
  { slug: 'most-fun-campus', category: 'vibes', question: 'Where is the most fun campus in Kenya?', description: 'Events, music, parties, social life.' },
  { slug: 'best-events-activities', category: 'vibes', question: 'Which uni has the best events & student activities?', description: 'Cultural weeks, concerts, clubs, ceremonies.' },
  // academics
  { slug: 'best-academic-environment', category: 'academics', question: 'Which uni has the best academic environment?', description: 'Lecturers, libraries, rigor, mentorship.' },
  { slug: 'best-tech-program', category: 'academics', question: 'Which uni has the strongest tech / engineering program?', description: 'Coding culture, labs, hackathon wins.' },
  { slug: 'best-business-school', category: 'academics', question: 'Which uni has the best business school?', description: 'Reputation, alumni network, placements.' },
  // sports
  { slug: 'best-sports-facilities', category: 'sports', question: 'Which uni has the best sports facilities?', description: 'Fields, courts, gyms, pools.' },
  { slug: 'best-athletics-program', category: 'sports', question: 'Which uni dominates Kenyan university sports?', description: 'KUSA league wins, rugby 7s, athletics.' },
  // social
  { slug: 'best-social-life', category: 'social', question: 'Where is the best social life?', description: 'Off-campus life, tao, haunts, community.' },
  { slug: 'most-inclusive-campus', category: 'social', question: 'Which uni feels the most inclusive and welcoming?', description: 'Diversity, tribes, international students, queer-friendly.' },
  // facilities
  { slug: 'best-hostels', category: 'facilities', question: 'Which uni has the best hostels / accommodation?', description: 'Cleanliness, space, wifi, water.' },
  { slug: 'best-wifi-connectivity', category: 'facilities', question: 'Which uni has the most reliable campus wifi?', description: 'Speed + uptime in classes and hostels.' },
  { slug: 'best-library', category: 'facilities', question: 'Which uni has the best library?', description: 'Books, study space, hours, comfort.' },
];

// Category metadata (matches what the rest of the app expects)
export const DEMO_CATEGORY_META: Record<PollCategory, { label: string; emoji: string; gradient: string; blurb: string }> = {
  general: { label: 'General', emoji: '🎓', gradient: 'from-blue-500 to-indigo-600', blurb: 'Overall experience' },
  vibes: { label: 'Vibes', emoji: '✨', gradient: 'from-fuchsia-500 to-pink-600', blurb: 'Culture & lifestyle' },
  academics: { label: 'Academics', emoji: '📚', gradient: 'from-emerald-500 to-teal-600', blurb: 'Quality of learning' },
  sports: { label: 'Sports', emoji: '⚽', gradient: 'from-orange-500 to-red-600', blurb: 'Athletics & spirit' },
  social: { label: 'Social', emoji: '🤝', gradient: 'from-violet-500 to-purple-600', blurb: 'Community & fun' },
  facilities: { label: 'Facilities', emoji: '🏛️', gradient: 'from-cyan-500 to-blue-600', blurb: 'Infrastructure' },
};

// ---------------------------------------------------------------------------
// Build the 18 demo polls
// ---------------------------------------------------------------------------
let pollIdCounter = 0;
function buildDemoPoll(seed: DemoPollSeed): Poll {
  pollIdCounter++;
  return {
    id: `demo-poll-${pollIdCounter}`,
    question: seed.question,
    slug: seed.slug,
    category: seed.category,
    isActive: true,
    startsAt: CYCLE_START_ISO,
    endsAt: CYCLE_END_ISO,
    cycleMonth: CURRENT_CYCLE,
    description: seed.description,
    displayOrder: pollIdCounter,
    createdAt: CYCLE_START_ISO,
    updatedAt: CYCLE_START_ISO,
  };
}

export const DEMO_POLLS: Poll[] = POLL_SEEDS.map(buildDemoPoll);

export function getDemoPollsByCategory(category: PollCategory): Poll[] {
  return DEMO_POLLS.filter(p => p.category === category);
}

export function getDemoPollBySlug(slug: string): Poll | undefined {
  return DEMO_POLLS.find(p => p.slug === slug);
}

export function getDemoPollById(id: string): Poll | undefined {
  return DEMO_POLLS.find(p => p.id === id);
}

// ---------------------------------------------------------------------------
// Build poll RESULTS — 7 major universities competing per poll.
// We pick a stable "headline" set + a category-tinted leader bias so the
// results feel credible (e.g. JKUAT rises in academics, KU rises in sports).
// ---------------------------------------------------------------------------
// Bias map: which unis tend to lead which categories. This makes the demo
// feel like a real race, not random noise.
const CATEGORY_LEADER_BIAS: Record<PollCategory, string[]> = {
  general: ['uon', 'strath', 'ku'],
  vibes: ['ku', 'uon', 'usiu'],
  academics: ['strath', 'jkuat', 'uon'],
  sports: ['ku', 'jkuat', 'uon'],
  social: ['uon', 'usiu', 'ku'],
  facilities: ['strath', 'usiu', 'ku'],
};

function pickCompetitors(category: PollCategory): University[] {
  // Always include the big 7, then bias the order so leaders match real perception
  const HEADLINE = ['uon', 'ku', 'jkuat', 'strath', 'usiu', 'mku', 'tuk'];
  const ordered: string[] = [...(CATEGORY_LEADER_BIAS[category] || [])];
  for (const id of HEADLINE) if (!ordered.includes(id)) ordered.push(id);
  return ordered.map(getUniversityById).filter(Boolean) as University[];
}

// Base support numbers per uni — gives some unis a believable floor
const BASE_SUPPORT: Record<string, number> = {
  uon: 240,
  ku: 215,
  jkuat: 180,
  strath: 195,
  usiu: 130,
  mku: 145,
  tuk: 110,
  moi: 95,
  egerton: 70,
  maseno: 80,
  mmust: 55,
  dekut: 45,
  mmu: 40,
  daystar: 65,
  cuea: 50,
  kca: 60,
  zetech: 45,
  anu: 30,
  riara: 35,
  kabarak: 40,
};

export function getDemoResultsForPoll(pollIdOrSlug: string): PollResultsAggregate {
  const poll =
    getDemoPollById(pollIdOrSlug) ||
    getDemoPollBySlug(pollIdOrSlug) ||
    DEMO_POLLS[0];

  const competitors = pickCompetitors(poll.category);

  // Build raw votes — bias leader by +60-120 votes, everyone else gets noise
  const raw = competitors.map((uni, i) => {
    const bias = i < 3 ? (3 - i) * (40 + Math.floor(seededRandom(`${poll.slug}-${uni.id}-bias`) * 80)) : 0;
    const base = BASE_SUPPORT[uni.id] ?? 30;
    const noise = Math.floor(seededRandom(`${poll.slug}-${uni.id}-noise`) * 60);
    return { uni, votes: Math.max(20, base + bias + noise - 40) };
  });

  // Tally
  const totalVotes = raw.reduce((sum, r) => sum + r.votes, 0);

  // Sort by votes desc, assign rank
  const ranked = [...raw].sort((a, b) => b.votes - a.votes);

  const results: PollResult[] = ranked.map((r, idx) => {
    const percentage = totalVotes > 0 ? (r.votes / totalVotes) * 100 : 0;
    return {
      pollId: poll.id,
      pollQuestion: poll.question,
      category: poll.category,
      cycleMonth: poll.cycleMonth,
      universityId: r.uni.id,
      universityName: r.uni.name,
      universityShortName: r.uni.shortName,
      universityColor: r.uni.color,
      universityType: r.uni.type,
      votes: r.votes,
      percentage: Number(percentage.toFixed(2)),
      rank: idx + 1,
    };
  });

  return {
    pollId: poll.id,
    pollQuestion: poll.question,
    category: poll.category,
    totalVotes,
    results,
    lastUpdated: new Date().toISOString(),
    cycleMonth: poll.cycleMonth,
  };
}

// Convenience: all results for a given category (for the Results/Category pages)
export function getDemoResultsForCategory(category: PollCategory): PollResult[] {
  const polls = getDemoPollsByCategory(category);
  return polls.flatMap(p => getDemoResultsForPoll(p.id).results);
}

// ---------------------------------------------------------------------------
// LEADERBOARD — aggregated across all 18 demo polls
// ---------------------------------------------------------------------------
export interface DemoLeaderboardEntry {
  id: string;
  name: string;
  short_name: string;
  type: 'Public' | 'Private';
  color: string;
  location: string;
  total_votes_received: number;
  polls_participated: number;
  first_place_finishes: number;
}

export function getDemoLeaderboard(): DemoLeaderboardEntry[] {
  const totals = new Map<string, { votes: number; wins: number; polls: Set<string> }>();
  for (const poll of DEMO_POLLS) {
    const agg = getDemoResultsForPoll(poll.id);
    for (const r of agg.results) {
      const e = totals.get(r.universityId) ?? { votes: 0, wins: 0, polls: new Set<string>() };
      e.votes += r.votes;
      if (r.rank === 1) e.wins += 1;
      e.polls.add(poll.id);
      totals.set(r.universityId, e);
    }
  }

  const rows: DemoLeaderboardEntry[] = [];
  for (const [id, t] of totals) {
    const u = getUniversityById(id);
    if (!u) continue;
    rows.push({
      id: u.id,
      name: u.name,
      short_name: u.shortName,
      type: u.type,
      color: u.color,
      location: u.location,
      total_votes_received: t.votes,
      polls_participated: t.polls.size,
      first_place_finishes: t.wins,
    });
  }
  rows.sort((a, b) => b.total_votes_received - a.total_votes_received);
  return rows;
}

// ---------------------------------------------------------------------------
// PLATFORM STATS
// ---------------------------------------------------------------------------
export function getDemoPlatformStats() {
  const lb = getDemoLeaderboard();
  const totalVotes = lb.reduce((sum, u) => sum + u.total_votes_received, 0);
  return {
    totalPolls: DEMO_POLLS.length,
    totalVotes,
    totalUniversities: lb.length,
    categoriesCount: Object.keys(DEMO_CATEGORY_META).length,
  };
}

// ---------------------------------------------------------------------------
// CATEGORY INSIGHTS
// ---------------------------------------------------------------------------
export interface DemoCategoryInsight {
  category: PollCategory;
  total_polls: number;
  total_votes: number;
  universities_active: number;
  recent_activity_percentage: number;
  is_trending: boolean;
}

export function getDemoCategoryInsights(): DemoCategoryInsight[] {
  return (Object.keys(DEMO_CATEGORY_META) as PollCategory[]).map((cat, idx) => {
    const polls = getDemoPollsByCategory(cat);
    const results = getDemoResultsForCategory(cat);
    const activeSet = new Set(results.map(r => r.universityId));
    const totalVotes = polls
      .map(p => getDemoResultsForPoll(p.id).totalVotes)
      .reduce((sum, v) => sum + v, 0);
    return {
      category: cat,
      total_polls: polls.length,
      total_votes: totalVotes,
      universities_active: activeSet.size,
      recent_activity_percentage: 15 + ((idx * 7) % 30),
      is_trending: cat === 'vibes' || cat === 'social',
    };
  });
}

// ---------------------------------------------------------------------------
// RECENT ACTIVITY FEED — synthetic live-feed entries
// ---------------------------------------------------------------------------
export interface DemoRecentActivity {
  created_at: string;
  poll_question: string;
  poll_slug: string;
  category: PollCategory;
  university_name: string;
  university_short_name: string;
  university_color: string;
  university_type: 'Public' | 'Private';
  voter_type: 'student' | 'alumni' | 'applicant' | 'other';
}

const VOTER_TYPES: DemoRecentActivity['voter_type'][] = ['student', 'student', 'student', 'alumni', 'applicant', 'other'];

export function getDemoRecentActivity(limit = 20): DemoRecentActivity[] {
  const out: DemoRecentActivity[] = [];
  const now = Date.now();
  for (let i = 0; i < limit; i++) {
    const poll = DEMO_POLLS[Math.floor(seededRandom(`act-${i}-poll`) * DEMO_POLLS.length)];
    const agg = getDemoResultsForPoll(poll.id);
    const result = agg.results[Math.floor(seededRandom(`act-${i}-uni`) * agg.results.length)];
    const secondsAgo = Math.floor(seededRandom(`act-${i}-time`) * 600); // last 10 min
    out.push({
      created_at: new Date(now - secondsAgo * 1000).toISOString(),
      poll_question: poll.question,
      poll_slug: poll.slug,
      category: poll.category,
      university_name: result.universityName,
      university_short_name: result.universityShortName,
      university_color: result.universityColor,
      university_type: result.universityType,
      voter_type: VOTER_TYPES[Math.floor(seededRandom(`act-${i}-voter`) * VOTER_TYPES.length)],
    });
  }
  // Sort newest first
  out.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return out;
}

// ---------------------------------------------------------------------------
// TRENDING POLLS (ordered by total votes)
// ---------------------------------------------------------------------------
export function getDemoTrendingPolls(limit = 10) {
  const rows = DEMO_POLLS.map(p => {
    const agg = getDemoResultsForPoll(p.id);
    const lastVoteSeconds = Math.floor(seededRandom(`${p.slug}-last-vote`) * 3600);
    return {
      id: p.id,
      question: p.question,
      slug: p.slug,
      category: p.category,
      cycle_month: p.cycleMonth,
      total_votes: agg.totalVotes,
      universities_competing: agg.results.length,
      last_vote_time: new Date(Date.now() - lastVoteSeconds * 1000).toISOString(),
      competition_level: (agg.results.length >= 6 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
    };
  });
  rows.sort((a, b) => b.total_votes - a.total_votes);
  return rows.slice(0, limit);
}
