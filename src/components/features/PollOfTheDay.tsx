import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Poll } from '../../types/models';
import { Flame, Clock } from 'lucide-react';
import { RacingSkeleton } from '../ui/RacingSkeleton';

interface PollOfTheDayProps {
  poll?: Poll;
  onVote: () => void;
}

export const PollOfTheDay: React.FC<PollOfTheDayProps> = ({ poll, onVote }) => {
  if (!poll) return <Card><RacingSkeleton /></Card>;

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
      
      <Card className="relative h-full flex flex-col items-start justify-between bg-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
               <Flame size={10} fill="currentColor" /> Daily Pick
             </span>
             <span className="text-slate-500 text-xs flex items-center gap-1">
               <Clock size={12} /> Ends in 12h
             </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
            {poll.question}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Trending in <span className="text-cyan-400">{poll.category}</span> • 1,240 votes so far
          </p>
        </div>

        <Button variant="primary" fullWidth onClick={onVote} className="bg-gradient-to-r from-orange-600 to-rose-600 border-none">
          Vote Now
        </Button>
      </Card>
    </div>
  );
};