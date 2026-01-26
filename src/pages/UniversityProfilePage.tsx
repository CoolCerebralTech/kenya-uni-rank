import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/FullScreenLoader';
import { Badge } from '../components/ui/Badge';

// Visualization
import { UniversityProfile } from '../components/results/UniversityProfile';
import { TrendChart } from '../components/results/TrendChart';
import { RivalryTracker } from '../components/features/RivalryTracker';
import { HeatMap } from '../components/analytics/HeatMap';
import { ShareButton } from '../components/results/ShareButton';

// Services & Data
import { getUniversityById } from '../services/university.service';
import { getUniversityProfile, getUniversityTrend, compareUniversities } from '../services/insights.service';
import { getUniversityRankings } from '../services/analytics.service';
import type { University, UniversityProfile as ProfileData } from '../types/models';
import { ArrowLeft, Vote, TrendingUp, Swords } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface FullProfile {
  university: University;
  rival: University | null; // Made nullable
  profile: ProfileData;
  trendData: { label: string; value: number }[];
  heatMapData: { x: string; y: string; value: number }[];
  rivalryScore: { score1: number; score2: number };
  rank: number;
}

export const UniversityProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<FullProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const university = getUniversityById(id);
        if (!university) {
          navigate('/404');
          return;
        }

        const [profileRes, trendRes, leaderboardRes] = await Promise.all([
          getUniversityProfile(id),
          getUniversityTrend(id),
          getUniversityRankings()
        ]);
        
        if (!isMounted) return;

        // Rank & Rival Calculation
        let rank = 0;
        let rival: University | null = null;
        if (leaderboardRes.success && leaderboardRes.data && leaderboardRes.data.length > 0) {
          const rankings = leaderboardRes.data;
          const currentIndex = rankings.findIndex(r => r.id === id);
          rank = currentIndex !== -1 ? currentIndex + 1 : 0;
          
          // Safety Check: Find rival (the person above you, or the person below you if you are #1)
          let rivalEntry = null;
          if (currentIndex > 0) {
            rivalEntry = rankings[currentIndex - 1];
          } else if (rankings.length > 1) {
            rivalEntry = rankings[1];
          }
          
          if (rivalEntry) rival = getUniversityById(rivalEntry.id) || null;
        }

        // Rivalry Stats
        let rivalryScore = { score1: 0, score2: 0 };
        if (rival) {
            const compRes = await compareUniversities(id, rival.id);
            if (compRes.success && compRes.data) {
                rivalryScore = {
                    score1: compRes.data.headToHead.reduce((sum, cat) => sum + cat.uni1Wins, 0),
                    score2: compRes.data.headToHead.reduce((sum, cat) => sum + cat.uni2Wins, 0),
                };
            }
        }

        // Charts data mapping
        const trendData = (trendRes.data || []).map(t => ({
          label: t.cycleMonth.split('-')[1], // Just the month
          value: t.percentage
        })).reverse();

        // Heatmap mapping
        const allStats = [...(profileRes.data?.strengths || []), ...(profileRes.data?.weaknesses || [])];
        const heatMapData = allStats.map(cat => ({
          x: cat.category,
          y: university.shortName,
          value: Math.round(cat.avgPercentage)
        }));

        setProfileData({
          university,
          rival,
          profile: profileRes.data!,
          trendData,
          heatMapData,
          rivalryScore,
          rank,
        });

      } catch (error) {
        console.error("Profile load error:", error);
        // DO NOT throw error here, just handle it to stop the loop
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => { isMounted = false; };
  }, [id, navigate]);

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Spinner size="xl" variant="accent" /></div>;
  }

  if (!profileData) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">University data unavailable.</div>;
  }

  const { university, rival, profile, trendData, heatMapData, rivalryScore, rank } = profileData;

  return (
    <AppLayout>
      <PageContainer maxWidth="xl" title={`${university.name} Profile`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex gap-2">
            <ShareButton title={`Check out ${university.name}'s UniPulse Profile`} />
            <Button variant="primary" size="sm" leftIcon={<Vote size={16} />} onClick={() => navigate(`/vote/general`)}>
              Vote For {university.shortName}
            </Button>
          </div>
        </div>

        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <UniversityProfile 
            university={university} 
            stats={{
              sentimentScore: profile.sentimentScore,
              totalVotes: profile.totalVotesReceived,
              rank: rank || 0,
              strengths: profile.strengths.length > 0 ? profile.strengths.map(s => s.category) : ['New Contender'],
              weaknesses: profile.weaknesses.length > 0 ? profile.weaknesses.map(w => w.category) : ['Awaiting Votes']
            }} 
          />
        </div>

        <SectionDivider label="Performance Analysis" variant="neon" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="h-full min-h-[350px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><TrendingUp size={18} className="text-cyan-400" /> Sentiment History</h3>
                <p className="text-xs text-slate-500">6-Month Rating</p>
              </div>
              <Badge variant="success" dot>{trendData.length > 0 ? 'Live' : 'No Data'}</Badge>
            </div>
            <div className="h-64">
              {trendData.length > 1 ? (
                <TrendChart data={trendData} color={university.color} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-sm">Historical trend data will appear here.</div>
              )}
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="flex-1 bg-slate-900/50">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><Swords size={18} className="text-red-500" /> Head-to-Head</h3>
              {rival ? (
                <RivalryTracker uni1={university} uni2={rival} score1={rivalryScore.score1} score2={rivalryScore.score2} category="Overall Wins" />
              ) : (
                <div className="text-center py-10 text-slate-500 text-sm">No primary rival identified yet.</div>
              )}
            </Card>

            <Card className="flex-1">
              <h3 className="text-sm font-bold text-white mb-4">Category Heatmap</h3>
              {heatMapData.length > 0 ? (
                <HeatMap data={heatMapData} xLabels={['Vibes', 'Academics', 'Sports', 'Social', 'Facilities']} yLabels={[university.shortName]} />
              ) : (
                <div className="text-center py-6 text-slate-600 text-xs">Insufficient data for heatmap visualization.</div>
              )}
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  );
};