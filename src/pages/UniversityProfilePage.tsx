import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';

// Visualization
import { UniversityProfile } from '../components/results/UniversityProfile';
import { TrendChart } from '../components/results/TrendChart';
import { RivalryTracker } from '../components/features/RivalryTracker';
import { HeatMap } from '../components/analytics/HeatMap';

// Services & Data
import { getUniversityById } from '../services/university.service';
import type { University } from '../types/models';
import { ArrowLeft, Share2, Vote, TrendingUp, Swords } from 'lucide-react';

export const UniversityProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- STATE ---
  const [university, setUniversity] = useState<University | undefined>(undefined);
  const [rival, setRival] = useState<University | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile Stats
  const [stats, setStats] = useState<{
    sentimentScore: number;
    totalVotes: number;
    rank: number;
    strengths: string[]; // Strings for UI display
    weaknesses: string[];
  } | null>(null);

  // Chart Data
  const [trendData, setTrendData] = useState<{ label: string; value: number }[]>([]);
  const [heatMapData, setHeatMapData] = useState<{ x: string; y: string; value: number }[]>([]);

  // --- DATA LOADING ---
  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;
      setIsLoading(true);

      // 1. Get Static University Data
      const uniData = getUniversityById(id);
      
      if (!uniData) {
        navigate('/404');
        return;
      }
      setUniversity(uniData);

      // 2. Determine Rival (Mock Logic: Just pick another popular one for demo)
      // In real app, this comes from a "rivals" table or matching algorithm
      const rivalId = id === 'uon' ? 'ku' : id === 'strath' ? 'usiu' : 'uon'; 
      const rivalData = getUniversityById(rivalId);
      setRival(rivalData);

      // 3. Get Dynamic Stats (Mocked Service Call for now, replacing with real logic later)
      // We simulate the response structure from getUniversityProfile service
      // In production, await getUniversityProfile(id);
      const mockStats = {
        sentimentScore: 78,
        totalVotes: 12450,
        rank: 3,
        strengths: ['Academics', 'Facilities', 'Alumni Network'],
        weaknesses: ['Sports', 'Social Life', 'Admin Support']
      };
      setStats(mockStats);

      // 4. Get Trends
      // In production, await getUniversityTrend(id);
      setTrendData([
        { label: 'Aug', value: 65 },
        { label: 'Sep', value: 68 },
        { label: 'Oct', value: 72 },
        { label: 'Nov', value: 70 },
        { label: 'Dec', value: 75 },
        { label: 'Jan', value: 78 },
      ]);

      // 5. HeatMap Data (Category Performance)
      const categories = ['Vibes', 'Academics', 'Sports', 'Social', 'Facilities'];
      const heatData = categories.map(cat => ({
        x: cat,
        y: uniData.shortName,
        value: Math.floor(Math.random() * 40) + 60 // Random score 60-100
      }));
      setHeatMapData(heatData);

      setIsLoading(false);
    };

    loadProfile();
  }, [id, navigate]);

  // --- RENDER ---

  if (isLoading || !university || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="xl" variant="accent" />
      </div>
    );
  }

  return (
    <AppLayout>
      <PageContainer maxWidth="xl" title={`${university.name} Profile`}>
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Share2 size={16} />}>
              Share Profile
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              leftIcon={<Vote size={16} />}
              onClick={() => navigate('/polls')}
            >
              Vote For {university.shortName}
            </Button>
          </div>
        </div>

        {/* 1. Main Profile Card (Reused Component) */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <UniversityProfile 
            university={university} 
            stats={stats} 
          />
        </div>

        <SectionDivider label="Performance Analysis" variant="neon" />

        {/* 2. Trends & Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Trend Chart */}
          <Card className="h-full min-h-[350px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-cyan-400" /> Sentiment History
                </h3>
                <p className="text-xs text-slate-500">6-Month Approval Rating</p>
              </div>
              <Badge variant="success" dot>+3.2% This Month</Badge>
            </div>
            
            <div className="h-64">
              <TrendChart 
                data={trendData} 
                color={university.color} 
              />
            </div>
          </Card>

          {/* Rivalry Tracker */}
          <div className="flex flex-col gap-6">
            <Card className="flex-1 bg-slate-900/50">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Swords size={18} className="text-red-500" /> Head-to-Head
                </h3>
                <p className="text-xs text-slate-500">Vs. Primary Rival</p>
              </div>
              
              {rival && (
                <RivalryTracker 
                  uni1={university}
                  uni2={rival}
                  score1={15} // Mock wins
                  score2={12} // Mock wins
                  category="Overall Wins"
                />
              )}
              
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm" onClick={() => navigate('/compare')}>
                  View Detailed Comparison
                </Button>
              </div>
            </Card>

            {/* Category Heatmap */}
            <Card className="flex-1">
              <h3 className="text-sm font-bold text-white mb-4">Category Heatmap</h3>
              <div className="flex justify-center">
                <HeatMap 
                  data={heatMapData}
                  xLabels={['Vibes', 'Academics', 'Sports', 'Social', 'Facilities']}
                  yLabels={[university.shortName]}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* 3. Community Voice (Placeholder for Phase 3) */}
        <div className="bg-slate-900/30 rounded-2xl p-8 border border-slate-800 border-dashed text-center">
          <h3 className="text-xl font-bold text-white mb-2">Student Truth Wall</h3>
          <p className="text-slate-400 mb-6">
            Real quotes and reviews from verified students are coming in Phase 3.
          </p>
          <Button variant="secondary" disabled>
            Features Locked 🔒
          </Button>
        </div>

      </PageContainer>
    </AppLayout>
  );
};