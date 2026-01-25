import React from 'react';
import type { Poll } from '../../types/models';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronRight } from 'lucide-react';

interface QuickVotePanelProps {
  poll: Poll;
  onStartVote: () => void;
}

export const QuickVotePanel: React.FC<QuickVotePanelProps> = ({ poll, onStartVote }) => {
  return (
    <Card variant="elevated" className="relative overflow-hidden group border-l-4 border-l-cyan-500">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <ChevronRight size={48} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/30 px-2 py-0.5 rounded">
              Next Up
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              {poll.category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-100 transition-colors">
            {poll.question}
          </h3>
        </div>

        <Button 
          variant="neon" 
          onClick={onStartVote}
          rightIcon={<ChevronRight size={16} />}
          className="shrink-0"
        >
          Vote Now
        </Button>
      </div>
    </Card>
  );
};