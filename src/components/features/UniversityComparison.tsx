import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, AlertCircle } from 'lucide-react';

// UI Components
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { Spinner } from '../ui/FullScreenLoader';

// Services & Types
import type { University } from '../../types/models';
import { getUniversitySentimentStats } from '../../services/insights.service';

type SentimentStats = { [category: string]: number };

interface UniversityComparisonProps {
  universities: University[];
}

export const UniversityComparison: React.FC<UniversityComparisonProps> = ({ universities }) => {
  // Default to first two universities
  const [uni1Id, setUni1Id] = useState<string>(universities[0]?.id || '');
  const [uni2Id, setUni2Id] = useState<string>(universities[1]?.id || '');
  
  const [stats, setStats] = useState<{ [key: string]: SentimentStats }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uni1 = universities.find(u => u.id === uni1Id);
  const uni2 = universities.find(u => u.id === uni2Id);
  
  // The categories to display on the Radar Chart
  // Note: These must match the keys returned by getUniversitySentimentStats (usually lowercase)
  const categories = ['Vibes', 'Academics', 'Sports', 'Facilities', 'Social'];

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchStats = async () => {
      if (!uni1Id || !uni2Id) return;

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getUniversitySentimentStats([uni1Id, uni2Id]);

        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError('Could not load comparison data.');
        }
      } catch (err) {
        console.error("Failed to fetch comparison stats:", err);
        setError('Connection failed.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [uni1Id, uni2Id]);

  // --- SVG RADAR CHART GENERATOR ---
  const renderRadar = (u1: University, u2: University) => {
    const size = 300;
    const center = size / 2;
    const radius = 100;
    
    // Helper to calculate polygon points
    const getPoint = (value: number, index: number) => {
      const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
      const r = (value / 100) * radius; // Value is 0-100 percentage
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    };

    // Generate paths
    const d1 = categories.map((c, i) => getPoint(stats[u1.id]?.[c.toLowerCase()] || 0, i)).join(' ');
    const d2 = categories.map((c, i) => getPoint(stats[u2.id]?.[c.toLowerCase()] || 0, i)).join(' ');

    return (
      <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        
        {/* Background Grid (Web) */}
        {[20, 40, 60, 80, 100].map(level => (
          <polygon 
            key={level} 
            points={categories.map((_, i) => getPoint(level, i)).join(' ')} 
            fill="none" 
            stroke="#1e293b" // slate-800
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {categories.map((c, i) => (
          <line 
            key={c} 
            x1={center} 
            y1={center} 
            x2={getPoint(100, i).split(',')[0]} 
            y2={getPoint(100, i).split(',')[1]} 
            stroke="#1e293b"
          />
        ))}

        {/* Labels */}
        {categories.map((c, i) => {
          const [x, y] = getPoint(120, i).split(',');
          return (
            <text 
              key={c} 
              x={x} 
              y={y} 
              className="text-[10px] md:text-xs fill-slate-400 font-bold uppercase tracking-wider" 
              textAnchor="middle" 
              dominantBaseline="middle"
            >
              {c}
            </text>
          );
        })}

        {/* Uni 1 Shape */}
        <motion.polygon 
          points={d1} 
          fill={u1.color} 
          fillOpacity="0.3" 
          stroke={u1.color} 
          strokeWidth="2" 
          initial={{ pathLength: 0, opacity: 0 }} 
          animate={{ pathLength: 1, opacity: 1 }} 
          transition={{ duration: 1, ease: "easeOut" }} 
        />

        {/* Uni 2 Shape */}
        <motion.polygon 
          points={d2} 
          fill={u2.color} 
          fillOpacity="0.3" 
          stroke={u2.color} 
          strokeWidth="2" 
          initial={{ pathLength: 0, opacity: 0 }} 
          animate={{ pathLength: 1, opacity: 1 }} 
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} 
        />
      </svg>
    );
  };

  return (
    <Card className="p-6 md:p-8 bg-slate-900/50 border-slate-800">
      
      {/* Selectors */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Challenger 1</label>
          <Select 
            options={universities.map(u => ({ label: u.name, value: u.id }))} 
            value={uni1Id} 
            onChange={(e) => setUni1Id(e.target.value)}
            className="border-slate-700 bg-slate-900"
          />
          {uni1 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: uni1.color }} />
              <span className="text-sm font-bold text-white">{uni1.shortName}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Challenger 2</label>
          <Select 
            options={universities.map(u => ({ label: u.name, value: u.id }))} 
            value={uni2Id} 
            onChange={(e) => setUni2Id(e.target.value)}
            className="border-slate-700 bg-slate-900"
          />
          {uni2 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: uni2.color }} />
              <span className="text-sm font-bold text-white">{uni2.shortName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative min-h-[350px] flex items-center justify-center bg-slate-950/30 rounded-2xl border border-slate-800/50 p-4">
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl"
            >
              <Spinner size="lg" variant="accent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center text-red-400">
            <AlertCircle size={32} className="mx-auto mb-2" />
            <p>{error}</p>
          </div>
        )}

        {/* Radar Chart */}
        {!isLoading && !error && uni1 && uni2 && renderRadar(uni1, uni2)}
        
        {/* Empty State */}
        {!isLoading && (!uni1 || !uni2) && (
          <p className="text-slate-500">Select two universities to begin the analysis.</p>
        )}
      </div>

      {/* Stats Summary Table */}
      {!isLoading && !error && uni1 && uni2 && (
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Strongest Category</div>
            <div className="flex items-center gap-2 text-green-400 font-bold">
               <Trophy size={14} /> 
               {/* Logic to find highest stat for Uni 1 */}
               {Object.entries(stats[uni1.id] || {}).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A'}
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-right">
            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Strongest Category</div>
            <div className="flex items-center justify-end gap-2 text-green-400 font-bold">
               {Object.entries(stats[uni2.id] || {}).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A'}
               <Trophy size={14} /> 
            </div>
          </div>
        </div>
      )}

    </Card>
  );
};