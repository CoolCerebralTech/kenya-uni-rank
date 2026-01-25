import React from 'react';
import { Card } from '../ui/Card';
import { Swords } from 'lucide-react';
import type { University } from '../../types/models';

interface RivalryProps {
  uni1: University;
  uni2: University;
  score1: number;
  score2: number;
  category: string;
}

export const RivalryTracker: React.FC<RivalryProps> = ({ uni1, uni2, score1, score2, category }) => {
  const total = score1 + score2;
  const p1 = (score1 / total) * 100;
  const p2 = (score2 / total) * 100;

  return (
    <Card className="border-t-4 border-t-red-500">
      <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold text-red-500 uppercase tracking-widest">
        <Swords size={16} /> Rivalry Watch
      </div>

      <div className="flex justify-between items-end mb-2">
        <div className="text-left">
          <div className="text-2xl font-black text-white" style={{ color: uni1.color }}>{uni1.shortName}</div>
          <div className="text-xs text-slate-500">Wins</div>
        </div>
        <div className="text-center pb-2">
          <span className="text-[10px] text-slate-600 uppercase font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
            {category}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-white" style={{ color: uni2.color }}>{uni2.shortName}</div>
          <div className="text-xs text-slate-500">Wins</div>
        </div>
      </div>

      {/* Battle Bar */}
      <div className="h-6 w-full flex rounded-md overflow-hidden bg-slate-800">
        <div 
          className="h-full flex items-center justify-start pl-2 text-[10px] font-bold text-white/90"
          style={{ width: `${p1}%`, backgroundColor: uni1.color }}
        >
          {score1}
        </div>
        <div className="w-1 bg-slate-950 transform skew-x-[-20deg] scale-110 z-10" />
        <div 
          className="h-full flex items-center justify-end pr-2 text-[10px] font-bold text-white/90"
          style={{ width: `${p2}%`, backgroundColor: uni2.color }}
        >
          {score2}
        </div>
      </div>
    </Card>
  );
};