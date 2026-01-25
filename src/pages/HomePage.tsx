import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Layouts & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

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
import { getPlatformStats, getHottestPoll } from '../services/analytics.service';
import type { PollCategory, Poll } from '../types/models';
import { Activity, Users, Vote, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [stats, setStats] = useState({ votes: 0, polls: 0, unis: 0 });
  const [featuredPoll, setFeaturedPoll] = useState<Poll | undefined>(undefined);
  const [, setIsLoading] = useState(true);

  // Mock user progress (In real app, fetch from local storage or auth)
  const userProgress = {
    completed: 2,
    total: 6,
    xp: 450
  };

  // Data Fetching
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, pollRes] = await Promise.all([
          getPlatformStats(),
          getHottestPoll()
        ]);

        if (statsRes.success && statsRes.data) {
          setStats({
            votes: statsRes.data.totalVotes,
            polls: statsRes.data.totalPolls,
            unis: statsRes.data.totalUniversities
          });
        }

        if (pollRes.success && pollRes.data) {
          // Convert trending poll to Poll model structure if needed, or use as is
          // Here we assume simple mapping for the display component
          setFeaturedPoll({
            id: pollRes.data.id,
            question: pollRes.data.question,
            category: pollRes.data.category as PollCategory,
            slug: pollRes.data.slug,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            startsAt: null,
            endsAt: null,
            cycleMonth: '2026-01'
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Handlers
  const handleCategorySelect = (category: PollCategory) => {
    navigate(`/polls?category=${category}`);
  };

  const handleVoteNow = () => {
    if (featuredPoll) {
      navigate(`/poll/${featuredPoll.slug}`);
    } else {
      navigate('/polls');
    }
  };

  return (
    <AppLayout>
      <PageContainer maxWidth="xl" title="Home">
        
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-center">
          
          {/* Left: Copy & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-500">
              <Zap size={14} className="fill-current" /> Phase 2 Live Cycle: Jan 2026
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
                <div className="text-2xl font-bold text-white">{stats.votes.toLocaleString()}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Votes Cast</div>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-white">{stats.unis}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Universities</div>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-green-400">Live</div>
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

        {/* --- USER PROGRESS BAR (Sticky-ish) --- */}
        <div className="mb-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 md:p-6 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ProgressRing 
              progress={(userProgress.completed / userProgress.total) * 100} 
              radius={32} 
              stroke={5}
              color="#22d3ee"
            >
              <span className="text-xs font-bold text-cyan-400">{Math.round((userProgress.completed / userProgress.total) * 100)}%</span>
            </ProgressRing>
            <div>
              <h3 className="font-bold text-white">Your Voice Matters</h3>
              <p className="text-sm text-slate-400">
                You've completed <span className="text-cyan-400 font-bold">{userProgress.completed}</span> of {userProgress.total} categories.
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/profile')}>
            Continue Voting
          </Button>
        </div>

        <SectionDivider label="Select Your Battleground" icon={<Zap size={16} />} variant="neon" />

        {/* --- CATEGORY SELECTION --- */}
        <div className="mb-16">
          <CategorySelector onSelect={handleCategorySelect} />
        </div>

        {/* --- LIVE GRID (Activity + Poll of Day) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          
          {/* Left Column: Poll of the Day */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Vote className="text-orange-500" size={20} /> Featured Battle
            </h3>
            <PollOfTheDay poll={featuredPoll} onVote={handleVoteNow} />
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
              <StatCard 
                label="Most Competitive" 
                value="Vibes" 
                trend={12} 
                icon={<Zap size={20} />} 
              />
              <StatCard 
                label="Top University" 
                value="Strathmore" 
                trend={5} 
                icon={<Vote size={20} />} 
                color="text-indigo-400"
              />
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase mb-1">Current Cycle</div>
                  <div className="text-white font-mono">Closing in 14 days</div>
                </div>
                <Badge variant="warning">Active</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* --- AI TEASER SECTION --- */}
        <div className="mb-16">
          <AIPreviewCard onClick={() => setIsAIModalOpen(true)} />
        </div>

        {/* Modal for AI */}
        <AIMatchTeaser isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      </PageContainer>
    </AppLayout>
  );
};