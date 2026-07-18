import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Layouts
import { AppLayout } from '../components/layout/AppLayout';
import { SectionDivider } from '../components/layout/SectionDivider';

// Racing
import { UniversityRacer } from '../components/racing/UniversityRacer';

// Categories
import { CategorySelector } from '../components/voting/CategorySelector';

// Stats card
import { Card } from '../components/ui/Card';

// Demo data (always populated — even when Supabase is down)
import {
  DEMO_POLLS,
  getDemoResultsForPoll,
  getDemoPlatformStats,
  getDemoRecentActivity,
} from '../lib/demoData';

import type { PollCategory, PollResult } from '../types/models';
import { Activity, Users, Vote, Zap, Trophy, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';

// ----------------- Animated count-up -----------------
// Suspends animation re-triggering on every value change (because the value
// is treated as a target). Mount-triggered: kicks off once on mount so it
// plays whenever the element renders, regardless of viewport position.
const AnimatedCount: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className={`tabular ${className || ''}`}>{display.toLocaleString()}</span>;
};

// ----------------- Time-ago formatter -----------------
function relTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

// ----------------- Category meta -----------------
// (Category grid is handled by the CategorySelector component below.)


// =================================================================
// HomePage — UniPulse v3
// Designed for the interview demo: tight, premium, fully populated.
// =================================================================
export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // --- Headline race (always populated — uses demo data) ---
  const heroPoll = DEMO_POLLS.find(p => p.slug === 'best-vibes') || DEMO_POLLS[0];
  const heroAgg = getDemoResultsForPoll(heroPoll.id);
  const heroResults: PollResult[] = heroAgg.results.slice(0, 5);

  // --- Platform stats ---
  const stats = getDemoPlatformStats();

  // --- Recent activity for the live feed ---
  const activity = getDemoRecentActivity(8);

  // --- Featured poll (rotating) ---
  const featured = DEMO_POLLS.find(p => p.slug === 'recommend-to-friend') || DEMO_POLLS[0];
  const featuredAgg = getDemoResultsForPoll(featured.id);

  const handleCategorySelect = (category: PollCategory) => navigate(`/vote/${category}`);

  return (
    <AppLayout>
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-12 md:space-y-16">

        {/* =========================================== HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 max-w-2xl">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-cyan-500/30 text-[11px] font-bold uppercase tracking-wider text-cyan-300 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span>Live Pulse • July 2026 Cycle</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] animate-fade-in-up">
              The real truth about<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400">
                Kenya's campuses.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Stop guessing. See what students actually think — fee stress, strike culture, hostel conditions, campus vibes. Real votes from real students, no polished brochures. From <strong className="text-white">UoN</strong> to <strong className="text-white">Juja</strong>, the unfiltered pulse of Kenyan campuses.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={() => navigate('/polls')}
                className="group inline-flex items-center gap-2 h-12 px-6 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.45)] hover:-translate-y-0.5"
              >
                <Vote size={18} />
                Cast your vote
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate('/leaderboard')}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/40 transition-all"
              >
                <Trophy size={18} />
                View leaderboard
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex items-stretch gap-4 pt-6 border-t border-slate-800/60 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Stat>
                <StatValue>
                  <AnimatedCount value={stats.totalVotes} className="text-white" />
                </StatValue>
                <StatLabel>Votes cast</StatLabel>
              </Stat>
              <Divider />
              <Stat>
                <StatValue>
                  <AnimatedCount value={stats.totalUniversities} className="text-white" />
                </StatValue>
                <StatLabel>Universities</StatLabel>
              </Stat>
              <Divider />
              <Stat>
                <StatValue>
                  <span className="text-emerald-400">Live</span>
                </StatValue>
                <StatLabel>System status</StatLabel>
              </Stat>
            </div>
          </div>

          {/* Race preview — refined card with demo data */}
          <div className="lg:col-span-5 relative animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="absolute -inset-6 bg-gradient-to-br from-cyan-600/15 to-emerald-500/10 blur-3xl rounded-full opacity-60 pointer-events-none" />
            <div className="relative glass rounded-2xl p-5 sm:p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-[0.15em]">Live Race</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{heroAgg.totalVotes.toLocaleString()} votes</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-5 leading-snug">
                {heroPoll.question}
              </h2>
              <div className="space-y-3.5">
                {heroResults.map((r) => (
                  <UniversityRacer
                    key={r.universityId}
                    result={r}
                    isLeader={r.rank === 1}
                    isLocked={false}
                  />
                ))}
              </div>
              <button
                onClick={() => navigate('/poll/best-vibes')}
                className="mt-5 w-full h-10 rounded-lg text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors flex items-center justify-center gap-1.5"
              >
                See full results <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* =========================================== CATEGORIES */}
        <section>
          <SectionDivider label="Select your battleground" icon={<Zap size={14} />} variant="neon" />
          <div className="mt-4">
            <CategorySelector onSelect={handleCategorySelect} />
          </div>
        </section>

        {/* =========================================== FEATURED + LIVE FEED + INSIGHTS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Featured Battle */}
          <div className="lg:col-span-1">
            <SectionLabel icon={<Vote size={14} className="text-amber-400" />} label="Featured battle" />
            <Card variant="glass" className="h-full p-5 flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => navigate(`/poll/${featured.slug}`)}>
              {/* Badge */}
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  <TrendingUp size={10} /> Hot
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{featured.category}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1 leading-snug group-hover:text-cyan-300 transition-colors">
                {featured.question}
              </h3>
              <p className="text-xs text-slate-500 mb-4 flex-grow line-clamp-2">
                {featured.description}
              </p>
              <div className="space-y-1.5 mb-4">
                {featuredAgg.results.slice(0, 3).map((r) => (
                  <div key={r.universityId} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-600 w-4 text-right">{r.rank}.</span>
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: r.universityColor }} />
                    <span className={`flex-grow truncate ${r.rank === 1 ? 'text-white font-semibold' : 'text-slate-400'}`}>
                      {r.universityName}
                    </span>
                    <span className="font-mono tabular text-slate-300">{r.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/poll/${featured.slug}`); }}
                className="w-full h-10 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 transition-colors flex items-center justify-center gap-1.5"
              >
                Cast your vote <ChevronRight size={14} />
              </button>
            </Card>
          </div>

          {/* Live Feed */}
          <div className="lg:col-span-1">
            <SectionLabel icon={<Activity size={14} className="text-emerald-400" />} label="Real-time pulse" />
            <Card variant="glass" className="h-full p-5 overflow-hidden">
              <div className="space-y-3 max-h-[360px] overflow-y-auto no-scrollbar">
                {activity.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-md"
                      style={{ backgroundColor: a.university_color }}
                    >
                      {a.university_short_name.slice(0, 2)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs text-slate-300 truncate">
                        <span className="font-semibold text-white capitalize">{a.voter_type}</span>{' '}voted for{' '}
                        <span className="font-semibold" style={{ color: a.university_color }}>{a.university_short_name}</span>
                      </p>
                      <p className="text-[10px] text-slate-600 uppercase tracking-wide">{relTime(a.created_at)} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Insights */}
          <div className="lg:col-span-1">
            <SectionLabel icon={<Users size={14} className="text-cyan-400" />} label="Platform insights" />
            <div className="space-y-4">
              <InsightCard
                label="Most discussed"
                value="Fees & HELB"
                sub="Trending on X"
                accentClass="text-amber-300"
                icon={<Zap size={16} className="text-amber-400" />}
              />
              <InsightCard
                label="Most roasted"
                value="UoN"
                sub="Strike culture & politics"
                accentClass="text-cyan-300"
                icon={<Trophy size={16} className="text-cyan-400" />}
              />
              <InsightCard
                label="Most stable"
                value="Strathmore"
                sub="Fewest strike complaints"
                accentClass="text-emerald-300"
                icon={<Sparkles size={16} className="text-emerald-400" />}
              />
            </div>
          </div>
        </section>

        {/* =========================================== PLATFORM STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <BigStat label="Total votes" value={stats.totalVotes} icon={<Vote size={16} />} />
          <BigStat label="Universities" value={stats.totalUniversities} icon={<Users size={16} />} />
          <BigStat label="Live polls" value={stats.totalPolls} icon={<Zap size={16} />} />
          <BigStat label="Categories" value={stats.categoriesCount} icon={<Trophy size={16} />} />
        </section>

        {/* =========================================== DISCLAIMER */}
        <section className="pt-8 border-t border-slate-800/40 text-center">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> UniPulse rankings reflect real-time student sentiment — not official university rankings. A decision-aid, not a verdict.
          </p>
          <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-wider">
            v3.0 • The Student Truth Engine
          </p>
        </section>
      </div>
    </AppLayout>
  );
};

// ---------- Small presentational helpers ----------
const Stat: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col">{children}</div>
);
const StatValue: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-2xl sm:text-3xl font-bold leading-none">{children}</div>
);
const StatLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold mt-1.5">{children}</div>
);
const Divider: React.FC = () => <div className="w-px h-10 bg-slate-800/60 self-center" />;

const SectionLabel: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-2 mb-4">
    {icon}
    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-[0.15em]">{label}</h3>
  </div>
);

const InsightCard: React.FC<{
  label: string;
  value: string;
  sub: string;
  accentClass: string;
  icon: React.ReactNode;
}> = ({ label, value, sub, accentClass, icon }) => (
  <Card variant="glass" className="p-4 group hover:-translate-y-0.5 transition-transform">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
      <div className="opacity-80 group-hover:opacity-100 transition-opacity">{icon}</div>
    </div>
    <div className={`text-xl font-bold ${accentClass}`}>{value}</div>
    <div className="text-[11px] text-slate-500 mt-0.5 font-mono tabular">{sub}</div>
  </Card>
);

const BigStat: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <Card variant="glass" className="p-4 sm:p-5 text-center">
    <div className="flex items-center justify-center mb-2 text-cyan-400/70">{icon}</div>
    <div className="text-2xl sm:text-3xl font-bold text-white mb-1 tabular">
      <AnimatedCount value={value} />
    </div>
    <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-bold">{label}</div>
  </Card>
);
