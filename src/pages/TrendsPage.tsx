import React, { useState, useEffect, useMemo } from 'react';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/FullScreenLoader';
import { useToast } from '../hooks/useToast';

// Analytics & Visualization
import { LineChart } from '../components/analytics/LineChart';
import { HeatMap } from '../components/analytics/HeatMap';
import { TrendIndicator } from '../components/racing/TrendIndicator';
import { ExportButton } from '../components/results/ExportButton';

// Services
import { getAllUniversitiesSync, getUniversityById } from '../services/university.service';
import { getRisingUniversities, getUniversityTrend, getUniversitySentimentStats } from '../services/insights.service';
import { getUniversityRankings } from '../services/analytics.service';
import type { University } from '../types/models';
import { TrendingUp, TrendingDown, Filter } from 'lucide-react';

// --- INTERFACES FOR PAGE DATA ---
interface Mover {
  id: string;
  name: string;
  shortName: string;
  color: string;
  change: number;
  currentScore: number;
}

interface HeatMapData {
  x: string;
  y: string;
  value: number;
}

interface LineSeries {
  name: string;
  color: string;
  data: number[];
}

export const TrendsPage: React.FC = () => {
  const { showErrorToast } = useToast();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('6m');
  const [selectedCategory] = useState('overall');
  
  // Data State
  const [lineChartData, setLineChartData] = useState<{ labels: string[]; series: LineSeries[] } | null>(null);
  const [movers, setMovers] = useState<{ rising: Mover[]; falling: Mover[] }>({ rising: [], falling: [] });
  const [heatMapData, setHeatMapData] = useState<HeatMapData[]>([]);
  const [heatMapLabels, setHeatMapLabels] = useState<string[]>([]);
  
  // 🔥 FIX: Memoize universities list
  const universities = useMemo(() => getAllUniversitiesSync(), []);

  // 🔥 FIX: Load data directly in useEffect without dependencies that change
  useEffect(() => {
    let isMounted = true;

    const loadTrends = async () => {
      console.log('[TrendsPage] Loading trends data...');
      setIsLoading(true);

      try {
        const [leaderboardRes, risingRes] = await Promise.all([
          getUniversityRankings(),
          getRisingUniversities(5)
        ]);
        
        if (!isMounted) return;

        // Rising stars
        if (risingRes.success && risingRes.data) {
          const risingStars = risingRes.data.map(uni => {
            const uniDetails = getUniversityById(uni.universityId);
            return {
              id: uni.universityId,
              name: uni.universityName,
              shortName: uniDetails?.shortName || 'N/A',
              color: uniDetails?.color || '#ffffff',
              change: uni.trendScore,
              currentScore: 0
            };
          });
          setMovers({ rising: risingStars, falling: [] });
        }

        // Get top 5 universities
        let top5Unis: University[] = [];
        if (leaderboardRes.success && leaderboardRes.data) {
          top5Unis = leaderboardRes.data
            .slice(0, 5)
            .map(u => getUniversityById(u.id))
            .filter((u): u is University => !!u);
        } else {
          top5Unis = universities.slice(0, 5);
        }

        if (!isMounted) return;

        // Fetch trend data for line chart
        const trendPromises = top5Unis.map(uni => getUniversityTrend(uni.id, 6));
        const trendResponses = await Promise.all(trendPromises);
        
        if (!isMounted) return;

        const series: LineSeries[] = trendResponses.map((res, index) => {
          const uni = top5Unis[index];
          const data = res.success && res.data 
            ? res.data.map(d => Math.round(d.percentage)).reverse() 
            : Array(6).fill(0);
          return { name: uni.shortName, color: uni.color, data };
        });

        const labels = trendResponses[0]?.data
          ?.map(d => new Date(d.cycleMonth).toLocaleString('default', { month: 'short' }))
          .reverse() || ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
        
        setLineChartData({ labels, series });

        // Heat map data
        const heatMapUnis = top5Unis.slice(0, 8);
        const heatMapUniIds = heatMapUnis.map(u => u.id);
        const sentimentRes = await getUniversitySentimentStats(heatMapUniIds);
        
        if (!isMounted) return;

        if (sentimentRes.success && sentimentRes.data) {
          const categories = ['vibes', 'academics', 'sports', 'social', 'facilities'];
          const heatData: HeatMapData[] = [];
          heatMapUnis.forEach(uni => {
            categories.forEach(cat => {
              heatData.push({
                x: cat.charAt(0).toUpperCase() + cat.slice(1),
                y: uni.shortName,
                value: Math.round(sentimentRes.data![uni.id]?.[cat] || 0)
              });
            });
          });
          setHeatMapData(heatData);
          setHeatMapLabels(heatMapUnis.map(u => u.shortName));
        }

        console.log('[TrendsPage] Data loaded successfully');

      } catch (error) {
        console.error('[TrendsPage] Failed to load trends:', error);
        if (isMounted) {
          showErrorToast("Could not load market intelligence data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTrends();

    return () => {
      isMounted = false;
    };
  }, [selectedRange, selectedCategory]); // 🔥 FIX: Only depend on user-controlled values

  // 🔥 FIX: Memoize handlers
  const handleRangeChange = useMemo(
    () => (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRange(e.target.value),
    []
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="xl" variant="accent" />
      </div>
    );
  }

  return (
    <AppLayout>
      <PageContainer maxWidth="xl" title="Historical Trends">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/20 border border-purple-500/30 text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <TrendingUp size={14} /> Market Intelligence
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              Performance Trends
            </h1>
            <p className="text-slate-400 max-w-xl">
              Track how student sentiment shifts over time. Identify which universities are gaining momentum.
            </p>
          </div>
          <div className="flex gap-3">
            <Select 
              value={selectedRange}
              onChange={handleRangeChange}
              options={[
                { label: 'Last 6 Months', value: '6m' },
                { label: 'Year to Date', value: 'ytd', disabled: true }
              ]}
              className="w-40"
            />
            <ExportButton pollId="trends_report" />
          </div>
        </div>

        {/* Sentiment Momentum Chart */}
        <Card className="mb-12 p-6 bg-slate-900/50 border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold text-white mb-1">Sentiment Momentum</h3>
          <p className="text-xs text-slate-500 mb-6">Aggregated approval rating for top 5 universities.</p>
          <div className="h-[300px] w-full">
            {lineChartData ? (
              <LineChart 
                labels={lineChartData.labels}
                series={lineChartData.series}
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                No data available
              </div>
            )}
          </div>
        </Card>

        {/* Movers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-t-4 border-t-green-500 animate-in fade-in slide-in-from-left duration-500">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-green-500" /> Rising Stars
            </h3>
            <div className="space-y-3">
              {movers.rising.length > 0 ? (
                movers.rising.map((uni, index) => (
                  <div 
                    key={uni.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors animate-in fade-in slide-in-from-left duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" 
                        style={{ backgroundColor: uni.color }}
                      >
                        {uni.shortName}
                      </div>
                      <div className="font-bold text-white text-sm">{uni.name}</div>
                    </div>
                    <TrendIndicator trend="up" value={Math.abs(uni.change)} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No rising stars data available
                </div>
              )}
            </div>
          </Card>

          <Card className="border-t-4 border-t-red-500 opacity-60 animate-in fade-in slide-in-from-right duration-500">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <TrendingDown size={20} className="text-red-500" /> Cooling Down
            </h3>
            <div className="text-center py-8 text-slate-500 text-sm">
              Data service for this module is in development.
            </div>
          </Card>
        </div>

        {/* Heat Map */}
        <SectionDivider label="Category Matrix" icon={<Filter size={16} />} />
        <Card className="p-6 md:p-8 overflow-x-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-lg font-bold text-white mb-1">Strengths & Weaknesses</h3>
          <p className="text-sm text-slate-400 mb-6">
            Heatmap showing performance across categories for top universities.
          </p>
          {heatMapData.length > 0 ? (
            <HeatMap 
              data={heatMapData}
              xLabels={['Vibes', 'Academics', 'Sports', 'Social', 'Facilities']}
              yLabels={heatMapLabels}
            />
          ) : (
            <div className="text-center py-12 text-slate-500">
              No heatmap data available
            </div>
          )}
        </Card>

      </PageContainer>
    </AppLayout>
  );
};