import React from 'react';
import { Card } from '../ui/Card';
import { Swords } from 'lucide-react';
import type { University } from '../../types/models';
import { motion } from 'framer-motion';

interface RivalryProps {
  uni1: University;
  uni2: University;
  score1: number;
  score2: number;
  category: string;
}

export const RivalryTracker: React.FC<RivalryProps> = ({ uni1, uni2, score1, score2, category }) => {
  const total = score1 + score2 || 1;
  const p1 = (score1 / total) * 100;
  const p2 = (score2 / total) * 100;

  return (
    <Card className="p-5 border-t-4 border-t-red-600 bg-slate-900/50">
      <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold text-red-500 uppercase tracking-widest">
        <Swords size={16} /> Rivalry Watch
      </div>
      <p className="text-center text-sm text-slate-400 mb-4">
        Battle for <span className="font-bold text-white">{category}</span> Supremacy
      </p>

      <div className="relative flex justify-between items-center mb-2">
        <div className="text-left">
          <p className="text-xl font-black text-white" style={{ color: uni1.color }}>{uni1.shortName}</p>
          <p className="text-3xl font-bold text-white">{score1}</p>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center bg-slate-950 rounded-full border-2 border-slate-700">
          <p className="font-black text-lg text-slate-500">VS</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-white" style={{ color: uni2.color }}>{uni2.shortName}</p>
          <p className="text-3xl font-bold text-white">{score2}</p>
        </div>
      </div>

      <div className="h-4 w-full flex rounded-full overflow-hidden bg-slate-800 border border-slate-700">
        <motion.div
          className="h-full"
          style={{ backgroundColor: uni1.color }}
          initial={{ width: '50%' }}
          animate={{ width: `${p1}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.div
          className="h-full"
          style={{ backgroundColor: uni2.color }}
          initial={{ width: '50%' }}
          animate={{ width: `${p2}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </Card>
  );
};