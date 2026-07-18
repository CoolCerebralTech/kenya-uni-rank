import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/FullScreenLoader';

// Racing
import { PodiumView } from '../components/racing/PodiumView';
import { TrendIndicator } from '../components/racing/TrendIndicator';

// Services & Data
import { getUniversityRankings, getPlatformStats } from '../services/analytics.service';
import type { UniversityLeaderboardEntry } from '../services/database.service';
import type { PollResult, PollCategory } from '../types/models';
import { Trophy, Crown, ArrowUpRight } from 'lucide-react';

// Demo fallback
import { getDemoLeaderboard, getDemoPlatformStats } from '../lib/demoData';
import { isPureDemo } from '../lib/demoFallback';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState<UniversityLeaderboardEntry[]>([]);
  const [platformStats, setPlatformStats] = useState({ votes: 0, polls: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState<'All' | 'Public' | 'Private'>('All');
  const [sortBy, setSortBy] = useState<'votes' | 'wins'>('votes');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rankingsRes, statsRes] = await Promise.all([
          getUniversityRankings(),
          getPlatformStats(),
        ]);

        let lb: UniversityLeaderboardEntry[] | null = null;
        if (rankingsRes.success && rankingsRes.data && rankingsRes.data.length > 0) {
          lb = rankingsRes.data;
        } else if (isPureDemo) {
          lb = getDemoLeaderboard() as UniversityLeaderboardEntry[];
        }
        if (lb) setLeaderboard(lb);

        let votes = 0; let polls = 0;
        if (statsRes.success && statsRes.data) {
          votes = statsRes.data.totalVotes;
          polls = statsRes.data.totalPolls;
        } else if (isPureDemo) {
          votes = getDemoPlatformStats().totalVotes;
          polls = getDemoPlatformStats().totalPolls;
        }
        setPlatformStats({ votes, polls });
      } catch (error) {
        console.error('Failed to load leaderboard', error);
        // Hard fallback to demo
        setLeaderboard(getDemoLeaderboard() as UniversityLeaderboardEntry[]);
        const ds = getDemoPlatformStats();
        setPlatformStats({ votes: ds.totalVotes, polls: ds.totalPolls });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter + sort
  const filteredData = leaderboard.filter(uni => typeFilter === 'All' || uni.type === typeFilter);
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'wins') {
      return b.first_place_finishes - a.first_place_finishes || b.total_votes_received - a.total_votes_received;
    }
    return b.total_votes_received - a.total_votes_received;
  });

  // Podium data — top 3 mapped to PollResult shape for PodiumView
  const podiumData: PollResult[] = sortedData.slice(0, 3).map((entry, index) => ({
    pollId: 'leaderboard',
    pollQuestion: 'Overall Ranking',
    category: 'general' as PollCategory,
    cycleMonth: 'Current',
    universityId: entry.id,
    universityName: entry.name,
    universityShortName: entry.short_name,
    universityColor: entry.color,
    universityType: entry.type,
    votes: entry.total_votes_received,
    percentage: 0,
    rank: index + 1,
  }));

  const RankRow = ({ entry, index }: { entry: UniversityLeaderboardEntry; index: number }) => {
    const isTop3 = index < 3;
    const rank = index + 1;
    // Stable, derived "trend" so the demo never shows random noise per render.
    const trend: 'up' | 'down' | 'stable' =
      index % 5 === 0 ? 'up' : index % 3 === 0 ? 'down' : 'stable';

    return (
      <div
        onClick={() => navigate(`/university/${entry.id}`)}
        className={`
          group relative flex items-center justify-between p-3 sm:p-4 rounded-xl border cursor-pointer transition-all duration-200
          ${isTop3
            ? 'glass border-slate-700/60 shadow-md'
            : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700'}
        `}
      >
        {/* Hover wash */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />

        {/* Left: rank + name */}
        <div className="flex items-center gap-3 sm:gap-4 z-10 min-w-0">
          {/* Rank chip */}
          <div
            className={`
              w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-black text-sm sm:text-base shrink-0
              ${rank === 1 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40' :
                rank === 2 ? 'bg-slate-300/15 text-slate-300 border border-slate-300/40' :
                rank === 3 ? 'bg-amber-800/15 text-amber-700 border border-amber-800/40' :
                'text-slate-500 bg-slate-800/40'}
            `}
          >
            {rank}
          </div>

          {/* Name */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-300 transition-colors truncate">
                {entry.name}
              </h3>
              {isTop3 && <Crown size={12} className="text-amber-400 fill-amber-500 shrink-0" />}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Badge size="sm" variant={entry.type === 'Public' ? 'info' : 'warning'} className="opacity-80">
                {entry.type}
              </Badge>
              <span className="hidden sm:inline">• {entry.location}</span>
            </div>
          </div>
        </div>

        {/* Right: stats */}
        <div className="flex items-center gap-3 sm:gap-5 z-10 shrink-0">
          <div className="hidden sm:block text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Wins</div>
            <div className="font-mono tabular text-slate-300 text-xs flex items-center justify-end gap-1">
              <Trophy size={11} className="text-amber-500" />
              {entry.first_place_finishes}
            </div>
          </div>

          <div className="text-right min-w-[60px]">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Votes</div>
            <div className="text-sm sm:text-base font-bold text-white tabular group-hover:scale-110 group-hover:text-cyan-300 transition-all origin-right">
              {entry.total_votes_received.toLocaleString()}
            </div>
          </div>

          <div className="hidden sm:block">
            <TrendIndicator trend={trend} />
          </div>

          <ArrowUpRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0" />
        </div>
      </div>
    );
  };

  // ---------------- RENDER ----------------
  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
          <Spinner size="xl" variant="accent" />
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Loading the leaderboard…</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8 md:space-y-10">

        {/* HEADER */}
        <header className="text-center max-w-3xl mx-auto">
          <Badge variant="neon" className="mb-3">Live Rankings</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            The Grand Leaderboard
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Where Kenya's universities stand across {platformStats.polls} active polls — by real student votes.
          </p>
        </header>

        {/* PODIUM */}
        <section className="glass rounded-2xl p-5 sm:p-6">
          <PodiumView results={podiumData} />
        </section>

        {/* STATS GRID */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total votes', value: platformStats.votes.toLocaleString(), className: 'text-cyan-400' },
            { label: 'Active unis', value: leaderboard.length, className: 'text-violet-400' },
            { label: 'Cycle', value: "Jul '26", className: 'text-emerald-400' },
            { label: 'Next update', value: 'Real-time', className: 'text-amber-400' },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center">
              <div className={`text-xl sm:text-2xl font-bold tabular ${stat.className}`}>
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* CONTROLS — sticky filter bar */}
        <div className="sticky top-16 z-30 bg-slate-950/80 backdrop-blur-md py-3 -mx-4 px-4 sm:rounded-xl border-y sm:border border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Type filter (segmented) */}
          <div className="flex bg-slate-900/60 p-1 rounded-lg border border-slate-800 text-[11px] font-bold uppercase tracking-wider">
            {(['All', 'Public', 'Private'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  typeFilter === type
                    ? 'bg-cyan-500/15 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sort toggle (segmented) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort by</span>
            <div className="flex bg-slate-900/60 p-1 rounded-lg border border-slate-800 text-[11px] font-bold uppercase tracking-wider">
              <button
                onClick={() => setSortBy('votes')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  sortBy === 'votes' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Votes
              </button>
              <button
                onClick={() => setSortBy('wins')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  sortBy === 'wins' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Wins
              </button>
            </div>
          </div>
        </div>

        {/* RANKINGS LIST */}
        <section className="space-y-2.5 sm:space-y-3 pb-12">
          {sortedData.map((entry, index) => (
            <RankRow key={entry.id} entry={entry} index={index} />
          ))}
          {sortedData.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500">No universities found for this filter.</p>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};
