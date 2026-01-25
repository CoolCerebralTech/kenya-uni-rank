// src/components/features/PollOfTheDay.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Flame, Clock, TrendingUp } from 'lucide-react';
import { RacingSkeleton } from '../ui/RacingSkeleton';
import { getHottestPoll } from '../../services/analytics.service';
import type { TrendingPoll } from '../../services/database.service';

interface PollOfTheDayProps {
  onVote: () => void;
}

export const PollOfTheDay: React.FC<PollOfTheDayProps> = ({ onVote }) => {
  const [poll, setPoll] = useState<TrendingPoll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHottestPoll = async () => {
      try {
        setLoading(true);
        const response = await getHottestPoll();
        
        if (response.success && response.data) {
          setPoll(response.data);
        }
      } catch (err) {
        console.error('[PollOfTheDay] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHottestPoll();
  }, []);

  if (loading) return <Card><RacingSkeleton /></Card>;

  if (!poll) {
    return (
      <Card className="p-8 text-center">
        <div className="text-slate-500">No polls available</div>
      </Card>
    );
  }

  // Format time remaining (mock for now - would need actual poll dates)
  const getTimeRemaining = () => {
    return '24h';
  };

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
              <Clock size={12} /> Ends in {getTimeRemaining()}
            </span>
            <span className="text-slate-500 text-xs flex items-center gap-1">
              <TrendingUp size={12} /> {poll.total_votes.toLocaleString()} votes
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
            {poll.question}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Trending in <span className="text-cyan-400 capitalize">{poll.category}</span> • {poll.universities_competing} universities competing
          </p>
        </div>

        <Button 
          variant="primary" 
          fullWidth 
          onClick={onVote} 
          className="bg-gradient-to-r from-orange-600 to-rose-600 border-none hover:from-orange-700 hover:to-rose-700"
        >
          Vote Now
        </Button>
      </Card>
    </div>
  );
};