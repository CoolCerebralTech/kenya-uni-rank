import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Card } from '../ui/Card';

interface UniStats {
  id: string;
  name: string;
  color: string;
  score: number; // 0-100
  wins: number;
}

interface ComparisonSliderProps {
  uni1: UniStats;
  uni2: UniStats;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ uni1, uni2 }) => {
  const [flipped, setFlipped] = useState(false);

  const left = flipped ? uni2 : uni1;
  const right = flipped ? uni1 : uni2;

  const totalWins = left.wins + right.wins;
  const leftPercent = totalWins > 0 ? (left.wins / totalWins) * 100 : 50;
  const rightPercent = 100 - leftPercent;

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-left">
          <h3 className="font-bold text-lg text-white">{left.name}</h3>
          <span className="text-xs text-slate-400">{left.wins} Category Wins</span>
        </div>
        
        <button 
          onClick={() => setFlipped(!flipped)}
          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
        >
          <ArrowLeftRight size={16} />
        </button>

        <div className="text-right">
          <h3 className="font-bold text-lg text-white">{right.name}</h3>
          <span className="text-xs text-slate-400">{right.wins} Category Wins</span>
        </div>
      </div>

      {/* The Slider Bar */}
      <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex relative">
        <div 
          className="h-full transition-all duration-500"
          style={{ width: `${leftPercent}%`, backgroundColor: left.color }}
        />
        <div 
          className="h-full transition-all duration-500"
          style={{ width: `${rightPercent}%`, backgroundColor: right.color }}
        />
        
        {/* Center Divider */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-950 z-10" />
      </div>

      <div className="flex justify-between mt-2 text-xs font-mono font-bold">
        <span style={{ color: left.color }}>{leftPercent.toFixed(1)}%</span>
        <span style={{ color: right.color }}>{rightPercent.toFixed(1)}%</span>
      </div>
    </Card>
  );
};