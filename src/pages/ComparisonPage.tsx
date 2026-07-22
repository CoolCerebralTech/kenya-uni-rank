import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';
import {
  universitiesExtended,
  getExtendedUniversity,
  getOverallScore,
  getUniversityRankings,
} from '../data/universitiesExtended';
import {
  Users,
  GraduationCap,
  MapPin,
  Calendar,
  Wallet,
  BookOpen,
  Home,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Plus,
  X,
  ArrowLeft,
  Trophy,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ComparisonPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Parse ?ids=uon,ku from URL
  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      setSelectedIds(idsParam.split(',').filter(Boolean).slice(0, 3));
    }
  }, [searchParams]);

  const selected = selectedIds
    .map((id) => getExtendedUniversity(id))
    .filter(Boolean) as typeof universitiesExtended;

  const rankings = getUniversityRankings();

  const toggleUniversity = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  };

  const compareRows = [
    { label: 'Type', icon: <BookOpen size={14} />, key: (u: typeof universitiesExtended[0]) => u.type },
    { label: 'Location', icon: <MapPin size={14} />, key: (u: typeof universitiesExtended[0]) => u.location },
    { label: 'Founded', icon: <Calendar size={14} />, key: (u: typeof universitiesExtended[0]) => u.founded.toString() },
    { label: 'Students', icon: <Users size={14} />, key: (u: typeof universitiesExtended[0]) => u.studentPopulation.toLocaleString() },
    { label: '2026 Intake', icon: <GraduationCap size={14} />, key: (u: typeof universitiesExtended[0]) => u.firstYearIntake2026.toLocaleString() },
    { label: 'Fees/Semester', icon: <Wallet size={14} />, key: (u: typeof universitiesExtended[0]) => u.feeRangePerSemester },
    { label: 'Faculties', icon: <BookOpen size={14} />, key: (u: typeof universitiesExtended[0]) => u.faculties.toString() },
    { label: 'Campuses', icon: <MapPin size={14} />, key: (u: typeof universitiesExtended[0]) => u.campuses.length.toString() },
  ];

  const sentimentRows: Array<{ label: string; key: keyof typeof universitiesExtended[0]['sentiment']; icon: React.ReactNode; color: string }> = [
    { label: 'Academic Quality', key: 'academicQuality', icon: <BookOpen size={14} />, color: 'from-emerald-500 to-teal-500' },
    { label: 'Facilities', key: 'facilitiesScore', icon: <Home size={14} />, color: 'from-cyan-500 to-blue-500' },
    { label: 'Social Vibes', key: 'socialVibes', icon: <Sparkles size={14} />, color: 'from-fuchsia-500 to-pink-500' },
    { label: 'Affordability', key: 'affordability', icon: <Wallet size={14} />, color: 'from-amber-500 to-orange-500' },
    { label: 'Stability', key: 'stability', icon: <CheckCircle2 size={14} />, color: 'from-green-500 to-emerald-500' },
    { label: 'Employability', key: 'employability', icon: <Briefcase size={14} />, color: 'from-indigo-500 to-violet-500' },
  ];

  // Find winner for each sentiment row
  const getWinner = (key: keyof typeof universitiesExtended[0]['sentiment']) => {
    if (selected.length < 2) return -1;
    let max = -1;
    let winnerIdx = -1;
    selected.forEach((u, i) => {
      if (u.sentiment[key] > max) {
        max = u.sentiment[key];
        winnerIdx = i;
      }
    });
    return winnerIdx;
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          Compare Universities
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Pick up to 3 universities to compare side by side — fees, facilities, vibes, and more.
        </p>

        {/* ======== SELECTED CARDS ======== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {selected.map((uni) => {
            const score = getOverallScore(uni);
            const rank = rankings.findIndex((u) => u.id === uni.id) + 1;
            return (
              <motion.div
                key={uni.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card padding="md" className="relative h-full">
                  <button
                    onClick={() => toggleUniversity(uni.id)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white shrink-0"
                      style={{ backgroundColor: uni.color }}
                    >
                      {uni.shortName.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{uni.shortName}</h3>
                      <p className="text-[10px] text-slate-500 truncate">{uni.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <ProgressRing value={score} size={56} stroke={5} />
                    <div className="text-right">
                      <div className="text-xs text-slate-400">
                        <span className="font-bold text-white">#{rank}</span> ranked
                      </div>
                      <Badge variant={uni.type === 'Public' ? 'info' : 'neon'} size="sm" className="mt-1">
                        {uni.type}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {/* Add slot */}
          {selected.length < 3 && (
            <button
              onClick={() => {
                const select = document.getElementById('compare-select');
                if (select) select.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center min-h-[140px] text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
            >
              <div className="text-center">
                <Plus size={24} className="mx-auto mb-1" />
                <span className="text-xs font-bold uppercase tracking-wider">Add university</span>
              </div>
            </button>
          )}
        </div>

        {/* ======== COMPARISON TABLE ======== */}
        {selected.length >= 2 ? (
          <>
            <Card padding="none" className="overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Metric</th>
                      {selected.map((u) => (
                        <th key={u.id} className="text-center p-4">
                          <span className="text-sm font-bold text-white">{u.shortName}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? 'bg-slate-900/30' : ''}>
                        <td className="p-4 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-slate-500">{row.icon}</span>
                            {row.label}
                          </span>
                        </td>
                        {selected.map((u) => (
                          <td key={u.id} className="text-center p-4 text-sm font-semibold text-white">
                            {row.key(u)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Sentiment comparison */}
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-cyan-400" /> Student Sentiment Comparison
            </h3>
            <Card padding="md">
              <div className="space-y-4">
                {sentimentRows.map((row) => {
                  const winnerIdx = getWinner(row.key);
                  return (
                    <div key={row.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="text-slate-500">{row.icon}</span>
                          {row.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selected.map((u, i) => (
                          <div key={u.id} className="relative">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-slate-500 font-bold">{u.shortName}</span>
                              <span className="text-xs font-bold text-white tabular">{u.sentiment[row.key]}</span>
                              {i === winnerIdx && selected.length > 1 && (
                                <span className="ml-1 text-[9px] text-emerald-400 font-bold">★ WINNER</span>
                              )}
                            </div>
                            <div className="h-2 bg-slate-800/60 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${u.sentiment[row.key]}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className={`h-full rounded-full bg-gradient-to-r ${row.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        ) : (
          <Card padding="lg" className="text-center">
            <p className="text-sm text-slate-500 mb-4">Select at least 2 universities to compare.</p>
          </Card>
        )}

        {/* ======== PICKER ======== */}
        <div id="compare-select" className="mt-8">
          <h3 className="text-sm font-bold text-white mb-4">All Universities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {universitiesExtended.map((u) => {
              const isSelected = selectedIds.includes(u.id);
              const score = getOverallScore(u);
              return (
                <button
                  key={u.id}
                  onClick={() => toggleUniversity(u.id)}
                  className={`
                    flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left
                    ${isSelected
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                    }
                    ${selected.length >= 3 && !isSelected ? 'opacity-40 pointer-events-none' : ''}
                  `}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{ backgroundColor: u.color }}
                  >
                    {u.shortName.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{u.shortName}</div>
                    <div className="text-[10px] text-slate-500">Score: {score}</div>
                  </div>
                  {isSelected && <CheckCircle2 size={14} className="text-cyan-400 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
