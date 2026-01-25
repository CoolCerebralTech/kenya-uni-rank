import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, Users } from 'lucide-react';

interface LeaderboardRankProps {
  rank: number;
  totalVoters: number;
  topPercent: number;
}

export const LeaderboardRank: React.FC<LeaderboardRankProps> = ({ 
  rank, 
  totalVoters, 
  topPercent 
}) => {
  return (
    <Card className="bg-gradient-to-r from-slate-900 to-slate-950 border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
              Your Global Rank
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">#{rank}</span>
              <span className="text-xs text-slate-500">of {totalVoters.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
            <TrendingUp size={12} />
            Top {topPercent}%
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Keep voting to climb!
          </p>
        </div>
      </div>
    </Card>
  );
};