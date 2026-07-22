import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { SEO } from '../components/seo/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SectionDivider } from '../components/layout/SectionDivider';
import { ProgressRing } from '../components/ui/ProgressRing';
import {
  getExtendedUniversityBySlug,
  getUniversityRankings,
  getOverallScore,
} from '../data/universitiesExtended';
import {
  Users,
  GraduationCap,
  MapPin,
  Calendar,
  Building2,
  Globe,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Wallet,
  Home,
  BookOpen,
  Briefcase,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================================================
// UniversityProfilePage — SofaScore-style dashboard for each university
// ============================================================================
export default function UniversityProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const uni = slug ? getExtendedUniversityBySlug(slug) : undefined;

  if (!uni) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
          <AlertTriangle size={48} className="text-slate-600" />
          <h2 className="text-xl font-bold text-white">University not found</h2>
          <p className="text-sm text-slate-500">We don't have data for this institution yet.</p>
          <Button variant="primary" onClick={() => navigate('/polls')}>
            Browse all universities
          </Button>
        </div>
      </AppLayout>
    );
  }

  const overallScore = getOverallScore(uni);
  const rankings = getUniversityRankings();
  const rank = rankings.findIndex((u) => u.id === uni.id) + 1;

  // Sentiment bars
  const sentimentBars = [
    { label: 'Academic Quality', value: uni.sentiment.academicQuality, icon: <BookOpen size={14} />, color: 'from-emerald-500 to-teal-500' },
    { label: 'Facilities', value: uni.sentiment.facilitiesScore, icon: <Home size={14} />, color: 'from-cyan-500 to-blue-500' },
    { label: 'Social Vibes', value: uni.sentiment.socialVibes, icon: <Sparkles size={14} />, color: 'from-fuchsia-500 to-pink-500' },
    { label: 'Affordability', value: uni.sentiment.affordability, icon: <Wallet size={14} />, color: 'from-amber-500 to-orange-500' },
    { label: 'Stability', value: uni.sentiment.stability, icon: <CheckCircle2 size={14} />, color: 'from-green-500 to-emerald-500' },
    { label: 'Employability', value: uni.sentiment.employability, icon: <Briefcase size={14} />, color: 'from-indigo-500 to-violet-500' },
  ];

  // Stats cards
  const stats = [
    { label: 'Founded', value: uni.founded.toString(), icon: <Calendar size={16} /> },
    { label: 'Type', value: uni.type, icon: <Building2 size={16} /> },
    { label: 'Students (approx)', value: uni.studentPopulation.toLocaleString(), icon: <Users size={16} /> },
    { label: '2026 Intake', value: uni.firstYearIntake2026.toLocaleString(), icon: <GraduationCap size={16} /> },
    { label: 'Faculties', value: uni.faculties.toString(), icon: <Building2 size={16} /> },
    { label: 'Campuses', value: uni.campuses.length.toString(), icon: <MapPin size={16} /> },
  ];

  // Google Maps embed URL (no API key needed — uses public embed)
  const mapFallbackUrl = `https://maps.google.com/maps?q=${uni.lat},${uni.lng}&z=15&output=embed`;

  // SEO keywords for this university
  const seoKeywords = [
    uni.name,
    uni.shortName,
    `${uni.shortName} fees`,
    `${uni.shortName} courses`,
    `${uni.shortName} requirements`,
    `${uni.shortName} location`,
    `${uni.shortName} review`,
    `${uni.shortName} university`,
    'Kenya university',
    'KCSE',
    'KUCCPS',
    'university comparison Kenya',
    ...uni.tags.map(t => t.toLowerCase()),
  ];

  const seoDescription = `${uni.name} (${uni.shortName}) — ${uni.description} Fees: ${uni.feeRangePerSemester}/semester. ${uni.studentPopulation.toLocaleString()} students. ${uni.programs.slice(0, 4).join(', ')}. See what students really think.`;

  return (
    <AppLayout>
      <SEO title={uni.name} description={seoDescription} keywords={seoKeywords} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* ======== HERO HEADER ======== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden relative"
        >
          {/* Uni color glow */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top right, ${uni.color}, transparent 70%)` }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
            {/* Logo circle */}
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white shrink-0 border border-white/10"
              style={{ backgroundColor: uni.color }}
            >
              {uni.shortName.slice(0, 3)}
            </div>

            {/* Title + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={uni.type === 'Public' ? 'info' : 'neon'} size="sm">
                  {uni.type}
                </Badge>
                {rank <= 3 && (
                  <Badge variant="warning" size="sm" icon={<Trophy size={10} />}>
                    #{rank} ranked
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {uni.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {uni.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} /> Est. {uni.founded}
                </span>
                <a
                  href={`https://${uni.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Globe size={12} /> {uni.website} <ExternalLink size={10} />
                </a>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mt-3 max-w-2xl">
                {uni.description}
              </p>
            </div>

            {/* Overall score ring */}
            <div className="shrink-0 flex flex-col items-center">
              <ProgressRing value={overallScore} size={88} stroke={6} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                UniPulse Score
              </span>
            </div>
          </div>
        </motion.div>

        {/* ======== STAT CARDS GRID ======== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card padding="sm" className="text-center h-full">
                <div className="flex justify-center mb-1.5 text-cyan-400">{stat.icon}</div>
                <div className="text-base font-bold text-white tabular">{stat.value}</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mt-0.5">
                  {stat.label}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ======== FEE + RANK INFO BAR ======== */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Fee Range (per semester)
              </div>
              <div className="text-lg font-bold text-white">{uni.feeRangePerSemester}</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-800" />
            <div className="flex-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                UniPulse Rank
              </div>
              <div className="text-lg font-bold text-white">
                #{rank} <span className="text-sm font-normal text-slate-500">of {rankings.length}</span>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-slate-800" />
            <div className="flex-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                Campuses
              </div>
              <div className="text-sm font-semibold text-slate-300 line-clamp-1">
                {uni.campuses.join(', ')}
              </div>
            </div>
          </div>
        </Card>

        {/* ======== SENTIMENT RADAR / BARS ======== */}
        <SectionDivider label="Student Sentiment" icon={<TrendingUp size={14} className="text-cyan-400" />} variant="neon" />

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Sentiment bars */}
          <Card padding="md">
            <h3 className="text-sm font-bold text-white mb-4">How students rate {uni.shortName}</h3>
            <div className="space-y-4">
              {sentimentBars.map((bar, i) => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="text-slate-500">{bar.icon}</span>
                      {bar.label}
                    </span>
                    <span className="text-xs font-bold text-white tabular">{bar.value}/100</span>
                  </div>
                  <div className="h-2 bg-slate-800/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tags + signals */}
          <Card padding="md">
            <h3 className="text-sm font-bold text-white mb-4">What students say on X</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {uni.tags.map((tag) => {
                const isNegative = /strike|worst|roast|missing|stress|remote/i.test(tag);
                return (
                  <Badge key={tag} variant={isNegative ? 'danger' : 'success'} size="sm">
                    {tag}
                  </Badge>
                );
              })}
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              {uni.sentiment.stability < 35 && (
                <div className="flex items-start gap-2 text-red-400">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>Students report frequent strike disruptions and unstable academic calendar.</span>
                </div>
              )}
              {uni.sentiment.facilitiesScore < 40 && (
                <div className="flex items-start gap-2 text-amber-400">
                  <Home size={14} className="mt-0.5 shrink-0" />
                  <span>Multiple complaints about hostel conditions and campus infrastructure.</span>
                </div>
              )}
              {uni.sentiment.affordability < 30 && (
                <div className="flex items-start gap-2 text-amber-400">
                  <Wallet size={14} className="mt-0.5 shrink-0" />
                  <span>Students consider this university expensive for the value offered.</span>
                </div>
              )}
              {uni.sentiment.stability > 80 && (
                <div className="flex items-start gap-2 text-emerald-400">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                  <span>Zero strike culture — students praise the stable academic calendar.</span>
                </div>
              )}
              {uni.sentiment.employability > 75 && (
                <div className="flex items-start gap-2 text-emerald-400">
                  <Briefcase size={14} className="mt-0.5 shrink-0" />
                  <span>Strong graduate outcomes — employers actively recruit from {uni.shortName}.</span>
                </div>
              )}
              {uni.sentiment.socialVibes > 70 && (
                <div className="flex items-start gap-2 text-fuchsia-400">
                  <Sparkles size={14} className="mt-0.5 shrink-0" />
                  <span>One of the best-rated campuses for social life, events, and culture.</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ======== GOOGLE MAPS EMBED ======== */}
        <SectionDivider label="Location" icon={<MapPin size={14} className="text-cyan-400" />} variant="simple" />

        <Card padding="none" className="overflow-hidden mb-6">
          <iframe
            src={mapFallbackUrl}
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${uni.name} — map`}
          />
        </Card>

        {/* ======== PROGRAMS OFFERED ======== */}
        <SectionDivider label="Top Programs" icon={<BookOpen size={14} className="text-cyan-400" />} variant="simple" />

        <div className="flex flex-wrap gap-2 mb-8">
          {uni.programs.map((program) => (
            <Badge key={program} variant="default" size="md">
              {program}
            </Badge>
          ))}
        </div>

        {/* ======== COMPARE CTA ======== */}
        <Card padding="lg" className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border-cyan-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Compare {uni.shortName} with others</h3>
              <p className="text-sm text-slate-400 mt-1">
                See how {uni.shortName} stacks up against other Kenyan universities side by side.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate(`/compare?ids=${uni.id}`)}
              className="shrink-0"
            >
              Compare now <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
