import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Card } from '../components/ui/Card';

// Visualization
import { CategorySummary } from '../components/results/CategorySummary';
import { RaceTrack } from '../components/racing/RaceTrack';
import { PollList } from '../components/voting/PollList';
import { ShareButton } from '../components/results/ShareButton';

// Services
import { getActivePolls } from '../services/poll.service';
import { getTopUniversitiesInCategory } from '../services/insights.service';
import { getPollWithResults, checkIfVoted } from '../services/voting.service';
import type {
    PollCategory,
    PollResult,
    Poll
} from '../types/models';
import { 
  getCategoryColor, 
  getCategoryDescription,
  CATEGORY_LABELS 
} from '../services/poll.service';
import { ArrowRight, Flame, Trophy, Info } from 'lucide-react';

// Helper to get icon (since service might return string or component, forcing a lookup here for safety)
import { Zap, BookOpen, Trophy as TrophyIcon, Users, Building2, GraduationCap } from 'lucide-react';

const CategoryIcons: Record<string, React.ElementType> = {
  general: GraduationCap,
  vibes: Zap,
  academics: BookOpen,
  sports: TrophyIcon,
  social: Users,
  facilities: Building2,
};

export const CategoryDetailPage: React.FC = () => {
  const { category = 'vibes' } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const safeCategory = category as PollCategory;

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    topUnis: any[]; // Podium data
    totalVotes: number;
    mostCompetitive: { poll: Poll; results: PollResult[] } | null;
    trendingPolls: Poll[];
  } | null>(null);
  const [userHasVotedInSector, setUserHasVotedInSector] = useState(false);

  // --- DATA LOADING ---
  useEffect(() => {
    const loadCategoryData = async () => {
      setIsLoading(true);

      try {
        // 1. Get Top Unis for Podium
        const topUnisRes = await getTopUniversitiesInCategory(safeCategory);
        
        // 2. Get Polls for this category
        const pollsRes = await getActivePolls(safeCategory);
        
        if (pollsRes.success && pollsRes.data) {
          const polls = pollsRes.data;
          
          // Check if user voted in at least one
          // In real app, optimize this to not check every single one individually
          const voteChecks = await Promise.all(polls.slice(0, 3).map(p => checkIfVoted(p.id)));
          const hasVotedAny = voteChecks.some(v => v);
          setUserHasVotedInSector(hasVotedAny);

          // 3. Find "Most Competitive" (Mock logic: just pick first one for demo)
          // Real logic: find poll with smallest gap between 1st and 2nd
          let competitiveData = null;
          if (polls.length > 0) {
            const compPoll = polls[0];
            const res = await getPollWithResults(compPoll.slug);
            if (res.success && res.data) {
              competitiveData = {
                poll: compPoll,
                results: res.data.results
              };
            }
          }

          // 4. Set State
          setStats({
            topUnis: topUnisRes.data || [], // Would need mapping to PollResult format for Podium
            totalVotes: 15420, // Mock total
            mostCompetitive: competitiveData,
            trendingPolls: polls.slice(0, 3), // Top 3 trending
          });
        }
      } catch (error) {
        console.error("Failed to load category details", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [safeCategory]);

  // Helper to map Leaderboard entry to PollResult for PodiumView
  const mapToPodiumFormat = (entries: any[]): PollResult[] => {
    return entries.map((e, i) => ({
      pollId: 'cat-summary',
      pollQuestion: 'Category Leaders',
      category: safeCategory,
      cycleMonth: 'Current',
      universityId: e.universityId,
      universityName: e.universityName,
      universityShortName: e.universityName.substring(0, 3).toUpperCase(), // Fallback
      universityColor: e.universityColor,
      universityType: 'Public', // Fallback
      votes: e.pollsWon * 100, // Mock representation
      percentage: e.avgPercentage,
      rank: i + 1
    }));
  };

  // --- RENDER ---

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="xl" variant="accent" />
      </div>
    );
  }

  const Icon = CategoryIcons[safeCategory] || Zap;
  const color = getCategoryColor(safeCategory);

  return (
    <AppLayout>
      <PageContainer maxWidth="xl" title={`${CATEGORY_LABELS[safeCategory]} Insights`}>
        
        {/* --- HEADER --- */}
        <div className="relative mb-12 p-8 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900">
          {/* Background Glow */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 blur-[120px] opacity-20 pointer-events-none rounded-full"
            style={{ backgroundColor: color }}
          />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-slate-800 text-white border border-slate-700">
                  <Icon size={32} style={{ color }} />
                </div>
                <Badge variant="neon" className="uppercase tracking-widest">
                  Category Hub
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                {CATEGORY_LABELS[safeCategory]}
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                {getCategoryDescription(safeCategory)}
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              {!userHasVotedInSector && (
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => navigate(`/vote/${safeCategory}`)}
                  className="shadow-xl shadow-blue-900/20"
                >
                  Enter the Arena <ArrowRight size={18} className="ml-2" />
                </Button>
              )}
              <ShareButton title={`${CATEGORY_LABELS[safeCategory]} Rankings on UniPulse`} />
            </div>
          </div>
        </div>

        {/* --- SUMMARY STATS --- */}
        <div className="mb-16">
          <CategorySummary 
            category={safeCategory}
            topPollResults={mapToPodiumFormat(stats.topUnis)}
            totalVotes={stats.totalVotes}
            mostCompetitivePoll={stats.mostCompetitive?.poll.question || 'Loading...'}
            risingStar={stats.topUnis[2]?.universityName || 'None'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT: COMPETITIVE HIGHLIGHT --- */}
          <div className="lg:col-span-2 space-y-8">
            <SectionDivider label="Most Competitive Battle" icon={<Flame size={16} />} />
            
            {stats.mostCompetitive ? (
              <div className="bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
                <div className="px-6 py-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {stats.mostCompetitive.poll.question}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Info size={14} /> Tightest margin of victory this month
                  </div>
                </div>
                <RaceTrack 
                  results={stats.mostCompetitive.results} 
                  totalVotes={stats.mostCompetitive.results.reduce((a,b) => a + b.votes, 0)}
                  userHasVoted={true} // Always show for this highlight view
                  onVoteClick={() => {}}
                />
              </div>
            ) : (
              <Card>No competitive data available yet.</Card>
            )}

            <div className="pt-8">
              <SectionDivider label="Trending Polls" icon={<Trophy size={16} />} />
              <PollList 
                polls={stats.trendingPolls} 
                isLoading={false} 
                votedPollIds={[]} // Simplified for view
                onVote={(id) => navigate(`/poll/${id}`)} // Should link to vote page if not voted
                onViewResults={(id) => navigate(`/poll/${id}`)}
              />
            </div>
          </div>

          {/* --- RIGHT: SIDEBAR --- */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
              <h3 className="font-bold text-white mb-4">Sector Leaders</h3>
              <div className="space-y-4">
                {stats.topUnis.slice(0, 5).map((uni, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/university/${uni.universityId}`)}>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-slate-500 w-4">{i + 1}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: uni.universityColor }} />
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                          {uni.universityName}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-500 group-hover:text-cyan-400">
                      {uni.pollsWon} Wins
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800">
                <Button variant="ghost" fullWidth size="sm" onClick={() => navigate('/leaderboard')}>
                  View Full Leaderboard
                </Button>
              </div>
            </Card>

            <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-center">
              <h4 className="font-bold text-blue-400 mb-2">Have your say?</h4>
              <p className="text-sm text-slate-400 mb-4">
                Your vote shapes these rankings. Don't let your uni slide down the list.
              </p>
              <Button 
                fullWidth 
                variant="primary" 
                onClick={() => navigate(`/vote/${safeCategory}`)}
              >
                Vote in {CATEGORY_LABELS[safeCategory]}
              </Button>
            </div>
          </div>

        </div>

      </PageContainer>
    </AppLayout>
  );
};