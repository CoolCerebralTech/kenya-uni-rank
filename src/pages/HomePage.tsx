import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { SEO } from '../components/seo/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';
import {
  universitiesExtended,
  getUniversityRankings,
  getOverallScore,
} from '../data/universitiesExtended';
import {
  Search,
  MapPin,
  Users,
  Wallet,
  Trophy,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Public' | 'Private'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'intake' | 'fees' | 'name'>('score');

  const rankings = getUniversityRankings();

  const filtered = useMemo(() => {
    let list = universitiesExtended.filter((u) => {
      if (filterType !== 'all' && u.type !== filterType) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.shortName.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q) ||
          u.programs.some((p) => p.toLowerCase().includes(q)) ||
          u.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    if (sortBy === 'score') list = [...list].sort((a, b) => getOverallScore(b) - getOverallScore(a));
    if (sortBy === 'intake') list = [...list].sort((a, b) => b.firstYearIntake2026 - a.firstYearIntake2026);
    if (sortBy === 'fees') list = [...list].sort((a, b) => a.feeMinPerSemester - b.feeMinPerSemester);
    if (sortBy === 'name') list = [...list].sort((a, b) => a.shortName.localeCompare(b.shortName));

    return list;
  }, [search, filterType, sortBy]);

  const top3 = rankings.slice(0, 3);
  const trendingTags = ['Strike culture', 'Best vibes', 'Most stable', 'Fee stress', 'Employable grads'];

  return (
    <AppLayout>
      <SEO
        title="UniPulse — Compare Kenyan Universities by Fees, Facilities & Real Student Sentiment"
        description="Compare all Kenyan universities side by side — fees, facilities, campus vibes, strike history, and real student sentiment from X. UoN, KU, JKUAT, Strathmore, Moi, and more. Make the right choice before you enroll."
        keywords={['Kenya university', 'university comparison Kenya', 'UoN', 'KU', 'JKUAT', 'Strathmore', 'university fees Kenya', 'KUCCPS', 'KCSE', 'campus vibes', 'HELB', 'best university Kenya']}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* ======== HERO ======== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass rounded-3xl p-6 md:p-10 mb-8 overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-cyan-500 via-transparent to-emerald-500" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-4 text-[10px] font-bold text-cyan-400 uppercase tracking-[0.18em]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span>The student truth engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.08] mb-3">
              Compare Kenyan universities<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400">
                before you enroll.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mb-5">
              Real fees, real facilities, real vibes. See what students actually think —
              from HELB delays to strike culture to campus social life. No polished brochures.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById('uni-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:-translate-y-0.5"
              >
                Explore universities <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/compare')}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-white border border-slate-700 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-600 transition-all"
              >
                Compare side-by-side
              </button>
            </div>
          </div>
        </motion.div>

        {/* ======== TOP 3 PODIUM ======== */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-amber-400" /> Top Ranked Universities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3.map((uni, i) => {
              const score = getOverallScore(uni);
              return (
                <motion.button
                  key={uni.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/university/${uni.slug}`)}
                  className="text-left"
                >
                  <Card padding="md" hoverEffect className="h-full relative overflow-hidden">
                    {i === 0 && (
                      <div className="absolute top-0 right-0 px-2 py-1 bg-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-wider rounded-bl-lg">
                        #1 Best
                      </div>
                    )}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white shrink-0"
                        style={{ backgroundColor: uni.color }}
                      >
                        {uni.shortName.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{uni.shortName}</h3>
                        <p className="text-[10px] text-slate-500 flex items-center gap-0.5">
                          <MapPin size={10} /> {uni.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <ProgressRing value={score} size={52} stroke={5} />
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                          <Wallet size={10} /> {uni.feeRangePerSemester.split('–')[0].replace('KSh ', 'KSh')}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Users size={10} /> {uni.studentPopulation.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ======== TRENDING TAGS ======== */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trending on X</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => { setSearch(tag); setSortBy('score'); }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ======== SEARCH + FILTER BAR ======== */}
        <div className="glass rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, location, program, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'Public', 'Private'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`
                  px-3 h-10 rounded-xl text-xs font-bold transition-all
                  ${filterType === type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900/60 text-slate-500 border border-slate-800 hover:text-slate-300'
                  }
                `}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-10 px-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-400 focus:border-cyan-500/50 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="score">Sort: Score</option>
            <option value="intake">Sort: Intake</option>
            <option value="fees">Sort: Fees</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {/* ======== UNIVERSITY GRID ======== */}
        <div id="uni-grid">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">
              {filtered.length} {filtered.length === 1 ? 'University' : 'Universities'}
            </h2>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              {sortBy === 'score' ? 'By overall score' : sortBy === 'intake' ? 'By 2026 intake' : sortBy === 'fees' ? 'By lowest fees' : 'Alphabetical'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((u, i) => {
              const score = getOverallScore(u);
              const rank = rankings.findIndex((r) => r.id === u.id) + 1;
              return (
                <motion.button
                  key={u.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/university/${u.slug}`)}
                  className="text-left"
                >
                  <Card padding="md" hoverEffect className="h-full">
                    {/* Header row */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-black text-white shrink-0"
                        style={{ backgroundColor: u.color }}
                      >
                        {u.shortName.slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white truncate">{u.shortName}</h3>
                          <Badge variant="default" size="sm">#{rank}</Badge>
                        </div>
                        <p className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-0.5">
                          <MapPin size={10} /> {u.location}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <ProgressRing value={score} size={44} stroke={4} />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-3 line-clamp-2">
                      {u.description}
                    </p>

                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <div className="text-[9px] text-slate-600 uppercase tracking-wider font-bold mb-0.5">Fees</div>
                        <div className="text-[10px] font-bold text-white truncate">{u.feeRangePerSemester.split('–')[0].replace('KSh ', '')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[9px] text-slate-600 uppercase tracking-wider font-bold mb-0.5">Students</div>
                        <div className="text-[10px] font-bold text-white">{u.studentPopulation > 999 ? `${(u.studentPopulation / 1000).toFixed(0)}k` : u.studentPopulation}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[9px] text-slate-600 uppercase tracking-wider font-bold mb-0.5">Intake</div>
                        <div className="text-[10px] font-bold text-white">{u.firstYearIntake2026 > 999 ? `${(u.firstYearIntake2026 / 1000).toFixed(1)}k` : u.firstYearIntake2026}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {u.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={`
                          px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider
                          ${/strike|worst|roast|missing|stress/i.test(tag)
                            ? 'bg-red-500/10 text-red-400'
                            : /best|stable|employable|strong|tech/i.test(tag)
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-slate-800/60 text-slate-500'
                          }
                        `}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ======== DISCLAIMER ======== */}
        <div className="pt-8 mt-8 border-t border-slate-800/40 text-center">
          <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> UniPulse combines official university data with real student sentiment from X (Twitter). Scores reflect student perception — not official rankings. A decision-aid, not a verdict.
          </p>
          <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-wider">
            v4.0 • The Student Truth Engine
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
