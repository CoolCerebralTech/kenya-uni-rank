// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Layouts & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RacingSkeleton } from '../components/ui/RacingSkeleton';
import { Card } from '../components/ui/Card';

// Feature Components
import { HeroRacePreview } from '../components/racing/HeroRacePreview';
import { CategorySelector } from '../components/voting/CategorySelector';
import { ProgressRing } from '../components/gamification/ProgressRing';
import { LiveFeed } from '../components/features/LiveFeed';
import { PollOfTheDay } from '../components/features/PollOfTheDay';
import { StatCard } from '../components/analytics/StatCard';

// AI Components
import { AIPreviewCard } from '../components/ai/AIPreviewCard';
import { AIMatchTeaser } from '../components/ai/AIMatchTeaser';

// Services & Types
import { 
  getPlatformStats, 
  getMostCompetitiveCategories,
  getTopThreeUniversities,
  formatNumber
} from '../services/analytics.service';
import type { PollCategory } from '../types/models';
import { Activity, Users, Vote, Zap } from 'lucide-react';

// Hooks
import { useVotingFlow } from '../hooks/useVotingFlow';
import { useRealtime } from '../hooks/useRealtime';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [stats, setStats] = useState({ 
    votes: 0, 
    polls: 0, 
    unis: 0,
    totalVotes: 0,
    totalUniversities: 0,
    totalPolls: 0 
  });
  const [mostCompetitiveCategory, setMostCompetitiveCategory] = useState<string>('Vibes');
  const [topUniversity, setTopUniversity] = useState<string>('Strathmore');
  const [competitiveStats, setCompetitiveStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Hooks
  const votingFlow = useVotingFlow();
  const userProgress = votingFlow.getProgress();

  // Real-time subscription for platform activity
  const { isConnected } = useRealtime({
    pollId: 'platform',
    enabled: true,
    onVoteReceived: () => {
      // Refresh platform stats when new votes come in
      loadPlatformStats();
    }
  });

  // Data Fetching
  const loadPlatformStats = async () => {
    try {
      setIsStatsLoading(true);
      const [statsRes, competitiveRes, rankingsRes] = await Promise.all([
        getPlatformStats(),
        getMostCompetitiveCategories(1),
        getTopThreeUniversities()
      ]);

      if (statsRes.success && statsRes.data) {
        setStats({
          votes: statsRes.data.totalVotes,
          polls: statsRes.data.totalPolls,
          unis: statsRes.data.totalUniversities,
          totalVotes: statsRes.data.totalVotes,
          totalUniversities: statsRes.data.totalUniversities,
          totalPolls: statsRes.data.totalPolls
        });
      }

      if (competitiveRes.success && competitiveRes.data && competitiveRes.data.length > 0) {
        const category = competitiveRes.data[0];
        setMostCompetitiveCategory(category.category);
        setCompetitiveStats(category);
      }

      if (rankingsRes.success && rankingsRes.data && rankingsRes.data.length > 0) {
        setTopUniversity(rankingsRes.data[0].name);
      }
    } catch (error) {
      console.error('Failed to load platform stats', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      await loadPlatformStats();
      setIsLoading(false);
    };

    loadDashboardData();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(loadPlatformStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleCategorySelect = (category: PollCategory) => {
    navigate(`/polls?category=${category}`);
  };

  const handleVoteNow = () => {
    navigate('/polls');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <PageContainer maxWidth="xl" title="Home">
          <div className="space-y-8">
            <RacingSkeleton count={5} />
          </div>
        </PageContainer>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageContainer maxWidth="xl" title="Home">
        
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-center">
          
          {/* Left: Copy & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{isConnected ? 'Live' : 'Connecting...'}</span>
              </div>
              <span>•</span>
              <span>Phase 2 Live Cycle: Jan 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              The Student <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Truth Engine.
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Stop guessing. See real-time rankings of Kenyan universities based on unfiltered student votes. From <strong>Nairobi</strong> to <strong>Juja</strong>, find the vibe that fits.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button size="lg" variant="neon" onClick={() => navigate('/polls')} className="px-8 shadow-cyan-500/20 shadow-lg">
                Enter the Race
              </Button>
              <Button size="lg" variant="ghost" onClick={() => navigate('/leaderboard')}>
                View Leaderboard
              </Button>
            </div>

            {/* Quick Stats Row */}
            <div className="flex items-center gap-6 pt-6 border-t border-slate-800/50 animate-in fade-in delay-500">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-white">{formatNumber(stats.votes)}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Votes Cast</div>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-white">{stats.unis}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Universities</div>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-emerald-400 animate-pulse">Live</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">System Status</div>
              </div>
            </div>
          </div>

          {/* Right: Race Visual */}
          <div className="lg:col-span-5 relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
            {/* Glow backing */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-3xl rounded-full opacity-50 pointer-events-none" />
            <HeroRacePreview />
          </div>
        </div>

        {/* --- USER PROGRESS BAR (Real Voting Progress) --- */}
        <div className="mb-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 md:p-6 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ProgressRing 
              progress={userProgress.percentage} 
              radius={32} 
              stroke={5}
              color="#22d3ee"
            >
              <span className="text-xs font-bold text-cyan-400">{userProgress.percentage}%</span>
            </ProgressRing>
            <div>
              <h3 className="font-bold text-white">Your Voice Matters</h3>
              <p className="text-sm text-slate-400">
                You've completed <span className="text-cyan-400 font-bold">{userProgress.completed}</span> of {userProgress.total} categories.
              </p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/polls')}
            disabled={userProgress.completed >= userProgress.total}
          >
            {userProgress.completed >= userProgress.total ? 'All Categories Complete' : 'Continue Voting'}
          </Button>
        </div>

        <SectionDivider label="Select Your Battleground" icon={<Zap size={16} />} variant="neon" />

        {/* --- CATEGORY SELECTION --- */}
        <div className="mb-16">
          <CategorySelector onSelect={handleCategorySelect} />
        </div>

        {/* --- LIVE GRID (Activity + Poll of Day + Stats) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          
          {/* Left Column: Poll of the Day */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Vote className="text-orange-500" size={20} /> Featured Battle
            </h3>
            <PollOfTheDay onVote={handleVoteNow} />
          </div>

          {/* Middle: Live Feed */}
          <div className="lg:col-span-1 h-[320px] lg:h-auto">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="text-green-500" size={20} /> Real-Time Feed
            </h3>
            <LiveFeed />
          </div>

          {/* Right: Stats & Trends */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white mb-0 flex items-center gap-2">
              <Users className="text-blue-500" size={20} /> Platform Insights
            </h3>
            
            <div className="flex-1 grid grid-cols-1 gap-4">
              {isStatsLoading ? (
                <>
                  <Card className="p-4">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                      <div className="h-8 bg-slate-700 rounded"></div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                      <div className="h-8 bg-slate-700 rounded"></div>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <StatCard 
                    label="Most Competitive" 
                    value={mostCompetitiveCategory.charAt(0).toUpperCase() + mostCompetitiveCategory.slice(1)} 
                    icon={<Zap size={20} />}
                    trend={competitiveStats?.competitionLevel === 'high' ? 12 : competitiveStats?.competitionLevel === 'medium' ? 5 : 0}
                  />
                  <StatCard 
                    label="Top University" 
                    value={topUniversity} 
                    icon={<Vote size={20} />} 
                    color="text-indigo-400"
                    trend={8}
                  />
                </>
              )}
              
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase mb-1">Current Cycle</div>
                  <div className="text-white font-mono">Closing in 14 days</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="animate-pulse">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PLATFORM STATS ROW --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats.totalVotes)}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider">Total Votes</div>
            <div className="text-xs text-slate-600 mt-1">Across all polls</div>
          </Card>
          
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats.totalUniversities}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider">Universities</div>
            <div className="text-xs text-slate-600 mt-1">Public & Private</div>
          </Card>
          
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-white mb-2">{stats.totalPolls}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider">Active Polls</div>
            <div className="text-xs text-slate-600 mt-1">In current cycle</div>
          </Card>
          
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-white mb-2">6</div>
            <div className="text-sm text-slate-400 uppercase tracking-wider">Categories</div>
            <div className="text-xs text-slate-600 mt-1">Vibes, Academics, etc.</div>
          </Card>
        </div>

        {/* --- AI TEASER SECTION --- */}
        <div className="mb-16">
          <AIPreviewCard onClick={() => setIsAIModalOpen(true)} />
        </div>

        {/* Modal for AI */}
        <AIMatchTeaser isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

        {/* --- DISCLAIMER SECTION --- */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 text-center">
          <p className="text-sm text-slate-500">
            <strong>Disclaimer:</strong> UniPulse rankings are based on real-time student and alumni votes. 
            This is a decision-aid system showing community sentiment, not official university rankings.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            System Status: <span className={`font-bold ${isConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isConnected ? 'All Systems Operational' : 'Connecting to Live Feed...'}
            </span>
          </p>
        </div>

      </PageContainer>
    </AppLayout>
  );
};