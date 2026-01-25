import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/FullScreenLoader';
import { Select } from '../components/ui/Select';

// Visualization
import { PodiumView } from '../components/racing/PodiumView';
import { TrendIndicator } from '../components/racing/TrendIndicator';
import { StatCard } from '../components/analytics/StatCard';

// Services & Data
import { getUniversityRankings, getPlatformStats } from '../services/analytics.service';
import type { UniversityLeaderboardEntry } from '../services/database.service';
import type { PollResult } from '../types/models'; // For type mapping
 // For type mapping
import { Trophy, Crown, Filter, ArrowUpRight } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [leaderboard, setLeaderboard] = useState<UniversityLeaderboardEntry[]>([]);
  const [platformStats, setPlatformStats] = useState({ votes: 0, polls: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<'All' | 'Public' | 'Private'>('All');
  const [sortBy, setSortBy] = useState<'votes' | 'wins'>('votes');

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const [rankingsRes, statsRes] = await Promise.all([
          getUniversityRankings(),
          getPlatformStats()
        ]);

        if (rankingsRes.success && rankingsRes.data) {
          setLeaderboard(rankingsRes.data);
        }

        if (statsRes.success && statsRes.data) {
          setPlatformStats({
            votes: statsRes.data.totalVotes,
            polls: statsRes.data.totalPolls
          });
        }
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- PROCESSING ---
  
  // 1. Filter
  const filteredData = leaderboard.filter(uni => {
    if (typeFilter === 'All') return true;
    return uni.type === typeFilter;
  });

  // 2. Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'wins') {
      // Primary: Wins, Secondary: Votes
      return b.first_place_finishes - a.first_place_finishes || b.total_votes_received - a.total_votes_received;
    }
    // Default: Total Votes
    return b.total_votes_received - a.total_votes_received;
  });

  // 3. Map for Podium (Top 3)
  // PodiumView expects PollResult interface, so we map our leaderboard entry to it visually
  const podiumData: PollResult[] = sortedData.slice(0, 3).map((entry, index) => ({
    pollId: 'leaderboard',
    pollQuestion: 'Overall Ranking',
    category: 'general',
    cycleMonth: 'Current',
    universityId: entry.id,
    universityName: entry.name,
    universityShortName: entry.short_name,
    universityColor: entry.color,
    universityType: entry.type,
    votes: entry.total_votes_received,
    percentage: 0, // Not needed for podium visual if we override
    rank: index + 1
  }));

  // --- RENDER HELPERS ---

  const RankRow = ({ entry, index }: { entry: UniversityLeaderboardEntry, index: number }) => {
    const isTop3 = index < 3;
    const rank = index + 1;
    
    // Simulate trend data (Random for demo, real backend would provide previous_rank)
    const trend = index % 5 === 0 ? 'up' : index % 3 === 0 ? 'down' : 'stable';
    
    return (
      <div 
        onClick={() => navigate(`/university/${entry.id}`)}
        className={`
          group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer
          ${isTop3 ? 'bg-slate-900/80 border-slate-700 shadow-lg' : 'bg-slate-900/30 border-slate-800/50 hover:bg-slate-800 hover:border-slate-700'}
        `}
      >
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />

        <div className="flex items-center gap-4 md:gap-6 z-10">
          {/* Rank Number */}
          <div className={`
            w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg font-black text-lg md:text-xl
            ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 
              rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/50' :
              rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/50' :
              'text-slate-500'}
          `}>
            {rank}
          </div>

          {/* Uni Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white text-base md:text-lg group-hover:text-cyan-400 transition-colors">
                {entry.name}
              </h3>
              {isTop3 && <Crown size={14} className="text-yellow-500 fill-yellow-500" />}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <Badge size="sm" variant={entry.type === 'Public' ? 'info' : 'warning'} className="opacity-80">
                {entry.type}
              </Badge>
              <span className="hidden sm:inline">• {entry.location}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 md:gap-8 z-10 text-right">
          
          <div className="hidden md:block">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Dominance</div>
            <div className="font-mono text-slate-300 flex justify-end items-center gap-1">
              <Trophy size={12} className="text-yellow-500" /> {entry.first_place_finishes} Wins
            </div>
          </div>

          <div className="min-w-[80px]">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Votes</div>
            <div className="text-lg font-bold text-white group-hover:scale-110 transition-transform origin-right">
              {entry.total_votes_received.toLocaleString()}
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-center w-8">
             <TrendIndicator trend={trend} />
          </div>
          
          <ArrowUpRight size={16} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
        </div>
      </div>
    );
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="xl" variant="accent" />
      </div>
    );
  }

  return (
    <AppLayout>
      <PageContainer maxWidth="xl" title="Leaderboard">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-10">
          <Badge variant="neon" className="mb-4">Live Rankings</Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            The Grand Leaderboard
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Aggregated performance across all {platformStats.polls} categories. 
            This is the ultimate measure of student sentiment in Kenya.
          </p>
        </div>

        {/* --- PODIUM --- */}
        <div className="mb-16">
          <PodiumView results={podiumData} />
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard 
            label="Total Votes" 
            value={platformStats.votes.toLocaleString()} 
            icon={<Filter size={16} />}
            color="text-cyan-400"
          />
          <StatCard 
            label="Active Unis" 
            value={leaderboard.length} 
            icon={<Crown size={16} />}
            color="text-purple-400"
          />
          <StatCard 
            label="Cycle" 
            value="Jan '26" 
            color="text-green-400"
          />
          <StatCard 
            label="Next Update" 
            value="Real-time" 
            color="text-orange-400"
          />
        </div>

        {/* --- CONTROLS --- */}
        <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-md py-4 border-b border-slate-800/50 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            {(['All', 'Public', 'Private'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`
                  px-4 py-1.5 text-sm font-bold rounded-md transition-all
                  ${typeFilter === type ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}
                `}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Sort By:</span>
            <Select 
              options={[
                { label: 'Total Votes', value: 'votes' },
                { label: 'Gold Medals', value: 'wins' }
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-40"
            />
          </div>
        </div>

        {/* --- RANKINGS LIST --- */}
        <div className="space-y-3 pb-12">
          {sortedData.map((entry, index) => (
            <RankRow key={entry.id} entry={entry} index={index} />
          ))}
          
          {sortedData.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500">No universities found for this filter.</p>
            </div>
          )}
        </div>

      </PageContainer>
    </AppLayout>
  );
};