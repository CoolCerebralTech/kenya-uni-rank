import React from 'react';
import { PodiumView } from '../racing/PodiumView';
import { Card } from '../ui/Card';
import { Trophy, Flame, TrendingUp } from 'lucide-react';
import type { PollCategory, PollResult } from '../../types/models';
import { getCategoryColor } from '../../services/poll.service';

interface CategorySummaryProps {
  category: PollCategory;
  topPollResults: PollResult[]; // For the podium
  totalVotes: number;
  mostCompetitivePoll: string;
  risingStar: string;
}

export const CategorySummary: React.FC<CategorySummaryProps> = ({
  category,
  topPollResults,
  totalVotes,
  mostCompetitivePoll,
  risingStar
}) => {
  const color = getCategoryColor(category);

  return (
    <div className="space-y-6">
      <div 
        className="relative overflow-hidden rounded-2xl p-6 md:p-10 border border-slate-800"
        style={{ 
          background: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95))`,
        }}
      >
        {/* Glow Background */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ backgroundColor: color }}
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-700 text-xs font-bold text-slate-300 mb-4 uppercase tracking-wider">
              <Trophy size={14} style={{ color }} /> {category} Category Leaderboard
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Sector Overview
            </h2>
            <p className="text-slate-400 mb-6 max-w-sm">
              The top performing universities in {category} based on aggregated student sentiment for this month.
            </p>
            
            <div className="flex gap-8">
              <div>
                <span className="block text-2xl font-bold text-white">{totalVotes.toLocaleString()}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Total Votes</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-green-400">Live</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Status</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-slate-800">
             <PodiumView results={topPollResults} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-orange-900/20 text-orange-500 rounded-lg">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Most Competitive Race</p>
            <p className="font-medium text-white line-clamp-1">{mostCompetitivePoll}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-blue-900/20 text-blue-500 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Rising Star</p>
            <p className="font-medium text-white">{risingStar}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};