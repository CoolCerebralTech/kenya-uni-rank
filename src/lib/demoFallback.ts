// ============================================================================
// DEMO FALLBACK WRAPPER
// ----------------------------------------------------------------------------
// Every read function in database.service.ts is wrapped with this helper.
// It tries Supabase first (when configured), and on any failure — missing env,
// network error, table missing, RLS denial — falls back to the demo dataset.
// This makes the interview demo unbreakable.
// ============================================================================

import { isSupabaseConfigured, supabase } from './supabase';
import {
  getDemoResultsForPoll,
  getDemoPollsByCategory,
  getDemoPollBySlug,
  getDemoPollById,
  getDemoTrendingPolls,
  getDemoLeaderboard,
  getDemoRecentActivity,
  getDemoCategoryInsights,
  DEMO_POLLS,
  type DemoLeaderboardEntry,
  type DemoCategoryInsight,
} from './demoData';
import { universities as ALL_UNIVERSITIES } from '../data/universities';
import type { Poll, PollCategory, PollResultsAggregate, University } from '../types/models';
import type {
  DatabaseResponse,
  PollWithResults,
  TrendingPoll,
  UniversityLeaderboardEntry,
  RecentActivity,
  CategoryInsight,
} from '../services/database.service';

// Demo vote registry — in-memory so the user can actually "vote" in the demo
// and have the results update locally. Persists per-session via localStorage.
const DEMO_VOTED_LS_KEY = 'unipulse:demo:voted';
const DEMO_VOTES_LS_KEY = 'unipulse:demo:votes';

type DemoVoteMap = Record<string, { universityId: string; voterType: string; ts: string }>;

function loadDemoVotes(): DemoVoteMap {
  try {
    const raw = localStorage.getItem(DEMO_VOTES_LS_KEY);
    return raw ? (JSON.parse(raw) as DemoVoteMap) : {};
  } catch {
    return {};
  }
}

function saveDemoVotes(map: DemoVoteMap) {
  try { localStorage.setItem(DEMO_VOTES_LS_KEY, JSON.stringify(map)); } catch { /* ignore */ }
}

function loadVotedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(DEMO_VOTED_LS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveVotedSet(set: Set<string>) {
  try { localStorage.setItem(DEMO_VOTED_LS_KEY, JSON.stringify([...set])); } catch { /* ignore */ }
}

export function demoHasVoted(pollId: string): boolean {
  return loadVotedSet().has(pollId);
}

export function demoRecordVote(pollId: string, universityId: string, voterType: string) {
  const votes = loadDemoVotes();
  votes[pollId] = { universityId, voterType, ts: new Date().toISOString() };
  saveDemoVotes(votes);
  const set = loadVotedSet();
  set.add(pollId);
  saveVotedSet(set);
}

export function demoWhoVotedFor(pollId: string): string | undefined {
  return loadDemoVotes()[pollId]?.universityId;
}

// ---------------------------------------------------------------------------
// DEMO-FLAVOURED FETCHES
// ---------------------------------------------------------------------------
// Patch the demo result to include the user's own vote
function applyUserVote(agg: PollResultsAggregate, pollId: string): PollResultsAggregate {
  const myVote = loadDemoVotes()[pollId];
  if (!myVote) return agg;

  const results = agg.results.map(r => {
    if (r.universityId === myVote.universityId) {
      return { ...r, votes: r.votes + 1 };
    }
    return r;
  });
  // Re-tally
  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  // Re-percentage
  const withPct = results.map(r => ({ ...r, percentage: totalVotes > 0 ? Number(((r.votes / totalVotes) * 100).toFixed(2)) : 0 }));
  // Re-rank
  const ranked = [...withPct].sort((a, b) => b.votes - a.votes);
  ranked.forEach((r, i) => { r.rank = i + 1; });
  return { ...agg, results: ranked, totalVotes };
}

export const DemoDB = {
  getActivePolls(category?: PollCategory): DatabaseResponse<Poll[]> {
    const polls = category ? getDemoPollsByCategory(category) : DEMO_POLLS;
    return { data: polls, error: null, success: true };
  },

  getPollBySlug(slug: string): DatabaseResponse<Poll> {
    const poll = getDemoPollBySlug(slug);
    return poll
      ? { data: poll, error: null, success: true }
      : { data: null, error: 'Poll not found', success: false };
  },

  getPollById(id: string): DatabaseResponse<Poll> {
    const poll = getDemoPollById(id);
    return poll
      ? { data: poll, error: null, success: true }
      : { data: null, error: 'Poll not found', success: false };
  },

  getPollWithResults(slug: string): DatabaseResponse<PollWithResults> {
    const poll = getDemoPollBySlug(slug) ?? getDemoPollById(slug);
    if (!poll) return { data: null, error: 'Poll not found', success: false };
    const agg = applyUserVote(getDemoResultsForPoll(poll.id), poll.id);
    return {
      data: { poll, results: agg.results, totalVotes: agg.totalVotes },
      error: null,
      success: true,
    };
  },

  getTrendingPolls(): DatabaseResponse<TrendingPoll[]> {
    return { data: getDemoTrendingPolls(10), error: null, success: true };
  },

  getUniversities(type?: 'Public' | 'Private'): DatabaseResponse<University[]> {
    const list = type ? ALL_UNIVERSITIES.filter(u => u.type === type) : ALL_UNIVERSITIES;
    return { data: list, error: null, success: true };
  },

  getUniversityLeaderboard(): DatabaseResponse<UniversityLeaderboardEntry[]> {
    const entries: UniversityLeaderboardEntry[] = getDemoLeaderboard().map((e: DemoLeaderboardEntry) => ({
      ...e,
      // DemoLeaderboardEntry already matches UniversityLeaderboardEntry shape — cast is safe
    })) as UniversityLeaderboardEntry[];
    return { data: entries, error: null, success: true };
  },

  hasUserVoted(pollId: string): DatabaseResponse<boolean> {
    return { data: demoHasVoted(pollId), error: null, success: true };
  },

  submitVote(pollId: string, universityId: string, _fingerprintHash: string, _ipHash?: string, _voterType?: string, _userAgent?: string): DatabaseResponse<{ voteId: string }> {
    if (demoHasVoted(pollId)) {
      return { data: null, error: 'You have already voted in this battle.', success: false };
    }
    demoRecordVote(pollId, universityId, _voterType || 'student');
    return { data: { voteId: `demo-vote-${Date.now()}` }, error: null, success: true };
  },

  getRecentActivity(): DatabaseResponse<RecentActivity[]> {
    const items = getDemoRecentActivity(20) as RecentActivity[];
    return { data: items, error: null, success: true };
  },

  getCategoryInsights(): DatabaseResponse<CategoryInsight[]> {
    const items = getDemoCategoryInsights().map((d: DemoCategoryInsight) => ({
      category: d.category,
      total_polls: d.total_polls,
      total_votes: d.total_votes,
      universities_active: d.universities_active,
      recent_activity_percentage: d.recent_activity_percentage,
      is_trending: d.is_trending,
    })) as CategoryInsight[];
    return { data: items, error: null, success: true };
  },

  getPollCategoryCounts(): DatabaseResponse<Array<{ category: PollCategory; count: number }>> {
    const map = new Map<PollCategory, number>();
    DEMO_POLLS.forEach(p => map.set(p.category, (map.get(p.category) || 0) + 1));
    return { data: Array.from(map.entries()).map(([category, count]) => ({ category, count })), error: null, success: true };
  },
};

// Convenience: are we currently in pure demo mode (no Supabase at all)?
export const isPureDemo = !isSupabaseConfigured || supabase === null;
