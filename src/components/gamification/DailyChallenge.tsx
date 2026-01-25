import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Target, Clock, CheckCircle } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

interface DailyChallengeProps {
  completedCount: number;
  targetCount: number;
  timeLeft: string; // e.g., "4h 20m"
  onClaim?: () => void;
  isClaimed?: boolean;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  completedCount,
  targetCount,
  timeLeft,
  onClaim,
  isClaimed = false
}) => {
  const isComplete = completedCount >= targetCount;
  const progress = (completedCount / targetCount) * 100;

  return (
    <Card className="border-l-4 border-l-purple-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-purple-400" />
          <h4 className="font-bold text-white text-sm">Daily Quest</h4>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock size={12} />
          <span>{timeLeft} left</span>
        </div>
      </div>

      <p className="text-xs text-slate-300 mb-3">
        Vote in <span className="text-white font-bold">{targetCount} polls</span> today to earn a specialized badge.
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-[10px] mb-1 text-slate-400">
          <span>Progress</span>
          <span>{completedCount}/{targetCount}</span>
        </div>
        <ProgressBar value={progress} size="sm" color={isComplete ? 'success' : 'primary'} />
      </div>

      {isComplete && !isClaimed && (
        <Button 
          variant="neon" 
          size="sm" 
          fullWidth 
          onClick={onClaim}
          className="animate-pulse"
        >
          Claim Reward
        </Button>
      )}

      {isClaimed && (
        <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-bold bg-green-500/10 p-2 rounded-lg">
          <CheckCircle size={16} /> Reward Claimed
        </div>
      )}
    </Card>
  );
};