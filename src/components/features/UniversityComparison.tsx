import React, { useState, useEffect } from 'react';
import type { University } from '../../types/models';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { motion } from 'framer-motion';
// REAL DATA INTEGRATION: Import services and types
import { getUniversitySentimentStats } from '../../services/insights.service';
import { Spinner } from '../ui/FullScreenLoader';

type SentimentStats = { [key: string]: number }; // e.g., { vibes: 85, academics: 90, ... }

export const UniversityComparison: React.FC<{ universities: University[] }> = ({ universities }) => {
  const [uni1Id, setUni1Id] = useState(universities[0]?.id || '');
  const [uni2Id, setUni2Id] = useState(universities[1]?.id || '');
  const [stats, setStats] = useState<{ [key: string]: SentimentStats }>({});
  const [isLoading, setIsLoading] = useState(false);

  const uni1 = universities.find(u => u.id === uni1Id);
  const uni2 = universities.find(u => u.id === uni2Id);
  
  const categories = ['Vibes', 'Academics', 'Sports', 'Facilities', 'Social'];

  // REAL DATA INTEGRATION: Fetch stats when selected universities change
  useEffect(() => {
    const fetchStats = async () => {
      if (!uni1Id || !uni2Id) return;

      setIsLoading(true);
      // This service function would query the `poll_results` view and aggregate data
      const { data, error } = await getUniversitySentimentStats([uni1Id, uni2Id]);

      if (data) {
        setStats(data);
      }
      if (error) {
        console.error("Failed to fetch comparison stats:", error);
      }
      setIsLoading(false);
    };

    fetchStats();
  }, [uni1Id, uni2Id]);

  const renderRadar = (uni1: University, uni2: University) => {
    // (SVG rendering logic is unchanged, it now uses the fetched 'stats' state)
    const size = 250, center = size / 2, radius = 100;
    const getPoint = (v: number, i: number) => {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2, r = (v / 100) * radius;
      return `${center + r * Math.cos(a)},${center + r * Math.sin(a)}`;
    };
    const d1 = categories.map((c, i) => getPoint(stats[uni1.id]?.[c.toLowerCase()] || 0, i)).join(' ');
    const d2 = categories.map((c, i) => getPoint(stats[uni2.id]?.[c.toLowerCase()] || 0, i)).join(' ');

    return (
      <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {[20, 40, 60, 80, 100].map(l => <polygon key={l} points={categories.map((_, i) => getPoint(l, i)).join(' ')} fill="none" stroke="#334155" />)}
        {categories.map((c, i) => <line key={c} x1={center} y1={center} x2={getPoint(100, i).split(',')[0]} y2={getPoint(100, i).split(',')[1]} stroke="#334155" />)}
        {categories.map((c, i) => <text key={c} x={getPoint(115, i).split(',')[0]} y={getPoint(115, i).split(',')[1]} className="text-[10px] fill-slate-400 uppercase font-bold" textAnchor="middle" dominantBaseline="middle">{c}</text>)}
        <motion.polygon points={d1} fill={uni1.color} fillOpacity="0.3" stroke={uni1.color} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        <motion.polygon points={d2} fill={uni2.color} fillOpacity="0.3" stroke={uni2.color} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
      </svg>
    );
  };

  return (
    <Card padding="lg">
      <h3 className="text-xl font-bold text-white mb-1">Head-to-Head</h3>
      <p className="text-sm text-slate-400 mb-6">Compare two universities based on real student sentiment.</p>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
         <Select options={universities.map(u => ({ label: u.name, value: u.id }))} value={uni1Id} onChange={(e) => setUni1Id(e.target.value)} />
         <Select options={universities.map(u => ({ label: u.name, value: u.id }))} value={uni2Id} onChange={(e) => setUni2Id(e.target.value)} />
      </div>
      <div className="h-[250px] flex items-center justify-center">
         {isLoading && <Spinner />}
         {!isLoading && uni1 && uni2 && renderRadar(uni1, uni2)}
         {!isLoading && (!uni1 || !uni2) && <p className="text-slate-500">Select two universities to compare.</p>}
      </div>
    </Card>
  );
};