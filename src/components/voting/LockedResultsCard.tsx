import React from 'react';
import { Card } from '../ui/Card';
import { Lock } from 'lucide-react';
import { Button } from '../ui/Button';

interface LockedResultsCardProps {
  onVoteClick: () => void;
}

export const LockedResultsCard: React.FC<LockedResultsCardProps> = ({ onVoteClick }) => {
  return (
    <Card className="relative overflow-hidden h-[300px] flex items-center justify-center text-center p-6">
      {/* Blurred fake data background */}
      <div className="absolute inset-0 opacity-20 filter blur-sm pointer-events-none">
        {[80, 60, 45, 30].map((h, i) => (
          <div key={i} className="mb-4 flex items-center gap-2 px-4">
             <div className="w-8 h-8 rounded bg-slate-700"></div>
             <div className="h-6 bg-slate-700 rounded w-full" style={{ width: `${h}%` }}></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 bg-slate-950/80 p-8 rounded-2xl border border-slate-800 backdrop-blur-md shadow-2xl">
        <div className="bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <Lock className="text-cyan-400" size={24} />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Results Locked</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
          We believe in fair exchange. Share your opinion to unlock the community's truth.
        </p>

        <Button variant="neon" onClick={onVoteClick}>
          Cast Your Vote
        </Button>
      </div>
    </Card>
  );
};