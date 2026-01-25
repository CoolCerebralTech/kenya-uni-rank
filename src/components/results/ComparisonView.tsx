import React from 'react';
import type { University } from '../../types/models';
import { ComparisonSlider } from '../racing/ComparisonSlider';
import { ArrowLeftRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface ComparisonViewProps {
  uni1: University;
  uni2: University;
  comparisonData: Array<{
    category: string;
    uni1Score: number;
    uni2Score: number;
    uni1Wins: number;
    uni2Wins: number;
  }>;
  onSwap: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  uni1,
  uni2,
  comparisonData,
  onSwap
}) => {
  return (
    <div className="space-y-6">
      {/* Header Matchup */}
      <div className="flex items-center justify-between bg-slate-900/50 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        {/* VS Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <span className="text-[150px] font-black text-white italic">VS</span>
        </div>

        <div className="relative z-10 text-center w-1/3">
          <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-xl font-bold text-white mb-2 shadow-lg" style={{ backgroundColor: uni1.color }}>
            {uni1.shortName}
          </div>
          <h3 className="font-bold text-white">{uni1.name}</h3>
        </div>

        <Button variant="secondary" size="icon" onClick={onSwap} className="relative z-10 rounded-full h-12 w-12 shrink-0">
          <ArrowLeftRight size={20} />
        </Button>

        <div className="relative z-10 text-center w-1/3">
          <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-xl font-bold text-white mb-2 shadow-lg" style={{ backgroundColor: uni2.color }}>
            {uni2.shortName}
          </div>
          <h3 className="font-bold text-white">{uni2.name}</h3>
        </div>
      </div>

      {/* Comparison Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisonData.map((item) => (
          <div key={item.category} className="mb-2">
             <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
               {item.category}
             </div>
             <ComparisonSlider 
               uni1={{ id: uni1.id, name: uni1.shortName, color: uni1.color, score: item.uni1Score, wins: item.uni1Wins }}
               uni2={{ id: uni2.id, name: uni2.shortName, color: uni2.color, score: item.uni2Score, wins: item.uni2Wins }}
             />
          </div>
        ))}
      </div>
    </div>
  );
};