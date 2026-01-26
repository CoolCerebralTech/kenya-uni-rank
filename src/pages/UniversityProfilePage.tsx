
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
import { 
  getUniversityProfile, 
  getUniversityTrend, 
  compareUniversities 
} from '../services/insights.service';
import { getUniversityRankings } from '../services/analytics.service';
import type { University, UniversityProfile as ProfileData } from '../types/models';
import { ArrowLeft, Vote, TrendingUp, Swords } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useEffect, useState } from 'react';

// --- INTERFACES FOR PAGE DATA ---
interface FullProfile {
  university: University;
  rival: University;
  profile: ProfileData;
  trendData: { label: string; value: number }[];
  heatMapData: { x: string; y: string; value: number }[];
  rivalryScore: { score1: number; score2: number };
  rank: number;
}

export const UniversityProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showErrorToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<FullProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        // 1. Get Static University Data first
        const university = getUniversityById(id);
        if (!university) {
          navigate('/404');
          return;
        }

        // 2. Fetch all dynamic data in parallel
        const [profileRes, trendRes, leaderboardRes] = await Promise.all([
          getUniversityProfile(id),
          getUniversityTrend(id),
          getUniversityRankings()
        ]);
        
        // Handle critical data failure
        if (!profileRes.success || !profileRes.data) {
          throw new Error('Could not load university profile.');
        }

        // 3. Process Leaderboard to find Rank and Rival
        let rank = 0;
        let rival: University | undefined;
        if (leaderboardRes.success && leaderboardRes.data) {
          const rankings = leaderboardRes.data;
          const currentIndex = rankings.findIndex(r => r.id === id);
          rank = currentIndex !== -1 ? currentIndex + 1 : 0;
          
          // Find rival (person above, or below if #1)
          const rivalIndex = currentIndex > 0 ? currentIndex - 1 : 1;
          const rivalEntry = rankings[rivalIndex];
          if (rivalEntry) {
            rival = getUniversityById(rivalEntry.id);
          }
        }
        
        // Default rival if none found
        if (!rival) {
          rival = getUniversityById(id === 'uon' ? 'ku' : 'uon');
        }

        // 4. Fetch Rivalry stats now that we know the rival
        let rivalryScore = { score1: 0, score2: 0 };
        if (rival) {
            const comparisonRes = await compareUniversities(id, rival.id);
            if (comparisonRes.success && comparisonRes.data) {
                // Sum up head-to-head wins across all categories
                const totalWins1 = comparisonRes.data.headToHead.reduce((sum, cat) => sum + cat.uni1Wins, 0);
                const totalWins2 = comparisonRes.data.headToHead.reduce((sum, cat) => sum + cat.uni2Wins, 0);
                rivalryScore = { score1: totalWins1, score2: totalWins2 };
            }
        }

        // 5. Format Chart Data
        const trendData = (trendRes.data || [])
          .map(t => ({
            label: new Date(t.cycleMonth).toLocaleString('default', { month: 'short' }),
            value: t.percentage
          }))
          .reverse();

        const allCategories = [...profileRes.data.strengths, ...profileRes.data.weaknesses];
        const heatMapData = allCategories.map(cat => ({
          x: cat.category,
          y: university.shortName,
          value: Math.round(cat.avgPercentage)
        }));

        // 6. Assemble the final data object for the page
        setProfileData({
          university,
          rival: rival!,
          profile: profileRes.data,
          trendData,
          heatMapData,
          rivalryScore,
          rank,
        });

      } catch (error) {
        console.error("Failed to load university profile:", error);
        showErrorToast((error as Error).message || "Failed to load profile.");
        navigate('/leaderboard'); // Redirect on failure
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [id, navigate, showErrorToast]);

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="xl" variant="accent" />
      </div>
    );
  }

  const { university, rival, profile, trendData, heatMapData, rivalryScore, rank } = profileData;

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
            <ShareButton title={`Check out ${university.name}'s UniPulse Profile`} />
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

        {/* 1. Main Profile Card */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <UniversityProfile 
            university={university} 
            stats={{
              sentimentScore: profile.sentimentScore,
              totalVotes: profile.totalVotesReceived,
              rank,
              strengths: profile.strengths.map(s => s.category),
              weaknesses: profile.weaknesses.map(w => w.category)
            }} 
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
              <Badge variant="success" dot>Live Data</Badge>
            </div>
            
            <div className="h-64">
              <TrendChart 
                data={trendData} 
                color={university.color} 
              />
            </div>
          </Card>

          {/* Rivalry & Heatmap */}
          <div className="flex flex-col gap-6">
            <Card className="flex-1 bg-slate-900/50">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Swords size={18} className="text-red-500" /> Head-to-Head
                </h3>
                <p className="text-xs text-slate-500">Vs. Primary Rival</p>
              </div>
              
              <RivalryTracker 
                uni1={university}
                uni2={rival}
                score1={rivalryScore.score1}
                score2={rivalryScore.score2}
                category="Overall Wins"
              />
              
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm" onClick={() => navigate('/compare')}>
                  View Detailed Comparison
                </Button>
              </div>
            </Card>

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

        {/* 3. Community Voice (Placeholder) */}
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