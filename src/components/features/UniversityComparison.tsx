import React, { useState } from 'react';
import type { University } from '../../types/models';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { UniversityCard } from '../voting/UniversityCard';

interface ComparisonProps {
  universities: University[]; // List of all avail
  stats: Record<string, { vibes: number; academics: number; sports: number; facilities: number; social: number }>;
}

export const UniversityComparison: React.FC<ComparisonProps> = ({ universities, stats }) => {
  const [uni1Id, setUni1Id] = useState(universities[0]?.id || '');
  const [uni2Id, setUni2Id] = useState(universities[1]?.id || '');

  const uni1 = universities.find(u => u.id === uni1Id);
  const uni2 = universities.find(u => u.id === uni2Id);
  
  const categories = ['vibes', 'academics', 'sports', 'facilities', 'social'];

  // Radar Chart Logic (SVG)
  const renderRadar = () => {
    const size = 200;
    const center = size / 2;
    const radius = 80;
    
    const getPoint = (value: number, index: number, total: number) => {
      const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
      const r = (value / 100) * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    };

    const d1 = categories.map((cat, i) => getPoint(stats[uni1Id]?.[cat as keyof typeof stats[uni1Id]] || 0, i, 5)).join(' ');
    const d2 = categories.map((cat, i) => getPoint(stats[uni2Id]?.[cat as keyof typeof stats[uni2Id]] || 0, i, 5)).join(' ');

    return (
      <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Grid Web */}
        {[20, 40, 60, 80, 100].map(level => (
           <polygon 
             key={level}
             points={categories.map((_, i) => getPoint(level, i, 5)).join(' ')}
             fill="none"
             stroke="#1e293b"
             strokeWidth="1"
           />
        ))}
        
        {/* Axis Lines & Labels */}
        {categories.map((cat, i) => {
           const [x, y] = getPoint(115, i, 5).split(',').map(Number); // Label pos
           const [lx, ly] = getPoint(100, i, 5).split(',').map(Number); // Line end
           return (
             <g key={cat}>
               <line x1={center} y1={center} x2={lx} y2={ly} stroke="#1e293b" />
               <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-slate-500 uppercase font-bold">
                 {cat}
               </text>
             </g>
           );
        })}

        {/* Uni 1 Shape */}
        <polygon points={d1} fill={uni1?.color} fillOpacity="0.3" stroke={uni1?.color} strokeWidth="2" />
        
        {/* Uni 2 Shape */}
        <polygon points={d2} fill={uni2?.color} fillOpacity="0.3" stroke={uni2?.color} strokeWidth="2" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
         <Select 
           options={universities.map(u => ({ label: u.name, value: u.id }))}
           value={uni1Id}
           onChange={(e) => setUni1Id(e.target.value)}
         />
         <Select 
           options={universities.map(u => ({ label: u.name, value: u.id }))}
           value={uni2Id}
           onChange={(e) => setUni2Id(e.target.value)}
         />
      </div>

      <Card className="flex items-center justify-center py-8">
         {uni1 && uni2 ? renderRadar() : <div className="text-slate-500">Select universities</div>}
      </Card>

      <div className="grid grid-cols-2 gap-4">
         {uni1 && <UniversityCard university={uni1} onSelect={() => {}} onVote={() => {}} />}
         {uni2 && <UniversityCard university={uni2} onSelect={() => {}} onVote={() => {}} />}
      </div>
    </div>
  );
};