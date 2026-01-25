import React, { useState, useEffect } from 'react';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';

// Analytics & Visualization
import { LineChart } from '../components/analytics/LineChart';
import { HeatMap } from '../components/analytics/HeatMap';
import { TrendIndicator } from '../components/racing/TrendIndicator';
import { ExportButton } from '../components/results/ExportButton';

// Services
import { getAllUniversitiesSync } from '../services/university.service';
import { TrendingUp, TrendingDown, Filter, Zap } from 'lucide-react';

export const TrendsPage: React.FC = () => {
  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('6m');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  
  // Data State
  const [lineChartData, setLineChartData] = useState<{ labels: string[]; series: any[] } | null>(null);
  const [movers, setMovers] = useState<{ rising: any[]; falling: any[] }>({ rising: [], falling: [] });
  const [heatMapData, setHeatMapData] = useState<any[]>([]);

  // Static Data
  const universities = getAllUniversitiesSync();

  // --- DATA GENERATION (MOCK) ---
  useEffect(() => {
    const loadTrends = () => {
      setIsLoading(true);

      // Simulate API delay
      setTimeout(() => {
        // 1. Generate Line Chart Data (Top 5 Unis over 6 months)
        const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
        const top5 = universities.slice(0, 5); // Just take first 5 for demo
        
        const series = top5.map(uni => ({
          name: uni.shortName,
          color: uni.color,
          data: months.map((_, i) => 50 + Math.floor(Math.random() * 40) + (i * 2)) // Random upward/downward trend
        }));

        setLineChartData({ labels: months, series });

        // 2. Generate Movers (Rising/Falling)
        const rising = universities.slice(0, 3).map(u => ({
          ...u,
          change: +(Math.random() * 5).toFixed(1),
          currentScore: 70 + Math.floor(Math.random() * 20)
        }));
        
        const falling = universities.slice(5, 8).map(u => ({
          ...u,
          change: -(Math.random() * 5).toFixed(1),
          currentScore: 50 + Math.floor(Math.random() * 20)
        }));

        setMovers({ rising, falling });

        // 3. Generate Heatmap (Uni x Category)
        const categories = ['Vibes', 'Academics', 'Sports', 'Social', 'Facilities'];
        const heatData: any[] = [];
        
        // Use top 8 unis for heatmap to keep it readable
        const heatUnis = universities.slice(0, 8);
        
        heatUnis.forEach(uni => {
          categories.forEach(cat => {
            heatData.push({
              x: cat,
              y: uni.shortName,
              value: Math.floor(Math.random() * 60) + 40 // Score 40-100
            });
          });
        });

        setHeatMapData(heatData);
        setIsLoading(false);
      }, 800);
    };

    loadTrends();
  }, [selectedRange, selectedCategory]);

  // --- RENDER ---

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
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/20 border border-purple-500/30 text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <TrendingUp size={14} /> Market Intelligence
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              Performance Trends
            </h1>
            <p className="text-slate-400 max-w-xl">
              Track how student sentiment shifts over time. Identify which universities are gaining momentum and which are losing ground.
            </p>
          </div>

          <div className="flex gap-3">
            <Select 
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              options={[
                { label: 'Last 3 Months', value: '3m' },
                { label: 'Last 6 Months', value: '6m' },
                { label: 'Year to Date', value: 'ytd' }
              ]}
              className="w-40"
            />
            <ExportButton pollId="trends_report_jan_2026" />
          </div>
        </div>

        {/* --- MAIN CHART SECTION --- */}
        <Card className="mb-12 p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" /> Sentiment Momentum
              </h3>
              <p className="text-xs text-slate-500">Aggregated approval rating (0-100%)</p>
            </div>
            
            {/* Legend / Filter */}
            <div className="flex gap-2">
              {['Overall', 'Vibes', 'Academics'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat.toLowerCase())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat.toLowerCase()
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px] w-full">
            {lineChartData && (
              <LineChart 
                labels={lineChartData.labels}
                series={lineChartData.series}
                height={300}
              />
            )}
          </div>
        </Card>

        {/* --- MOVERS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Rising Stars */}
          <Card className="border-t-4 border-t-green-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-green-500" /> Rising Stars
              </h3>
              <Badge variant="success">Bullish</Badge>
            </div>
            
            <div className="space-y-4">
              {movers.rising.map((uni) => (
                <div key={uni.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: uni.color }}>
                      {uni.shortName}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{uni.name}</div>
                      <div className="text-xs text-slate-500">Sentiment: {uni.currentScore}%</div>
                    </div>
                  </div>
                  <TrendIndicator trend="up" value={Math.abs(uni.change)} />
                </div>
              ))}
            </div>
          </Card>

          {/* Cooling Down */}
          <Card className="border-t-4 border-t-red-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <TrendingDown size={20} className="text-red-500" /> Cooling Down
              </h3>
              <Badge variant="danger">Bearish</Badge>
            </div>
            
            <div className="space-y-4">
              {movers.falling.map((uni) => (
                <div key={uni.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: uni.color }}>
                      {uni.shortName}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{uni.name}</div>
                      <div className="text-xs text-slate-500">Sentiment: {uni.currentScore}%</div>
                    </div>
                  </div>
                  <TrendIndicator trend="down" value={Math.abs(uni.change)} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* --- HEATMAP SECTION --- */}
        <div className="mb-12">
          <SectionDivider label="Category Matrix" icon={<Filter size={16} />} />
          
          <div className="bg-slate-900/80 rounded-2xl p-6 md:p-8 border border-slate-800 overflow-x-auto">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Strengths & Weaknesses</h3>
                <p className="text-sm text-slate-400">
                  Intensity map showing performance across all categories.
                </p>
              </div>
              <div className="flex gap-2 text-[10px] uppercase font-bold text-slate-500">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-800 rounded-sm"></div> Low</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-600 rounded-sm"></div> High</span>
              </div>
            </div>

            <HeatMap 
              data={heatMapData}
              xLabels={['Vibes', 'Academics', 'Sports', 'Social', 'Facilities']}
              yLabels={universities.slice(0, 8).map(u => u.shortName)} // Top 8
            />
          </div>
        </div>

      </PageContainer>
    </AppLayout>
  );
};