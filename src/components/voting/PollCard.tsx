import React from 'react';
import type { Poll } from '../../types/models';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Clock, Flame, CheckCircle2 } from 'lucide-react';
import { formatTimeRemaining } from '../../services/poll.service';
import { getCategoryColor } from '../../services/poll.service';

interface PollCardProps {
  poll: Poll;
  hasVoted: boolean;
  totalVotes: number;
  isTrending?: boolean;
  onVote: () => void;
  onViewResults: () => void;
}

export const PollCard: React.FC<PollCardProps> = ({
  poll,
  hasVoted,
  totalVotes,
  isTrending,
  onVote,
  onViewResults,
}) => {
  const categoryColor = getCategoryColor(poll.category);

  return (
    <Card className="flex flex-col h-full hover:border-slate-600 transition-colors group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <Badge 
          className="bg-opacity-10 border-opacity-20"
          // If you want to apply dynamic colors, you can use inline style on a wrapper or generate a dynamic class
        >
          <span
            style={{ backgroundColor: categoryColor, borderColor: categoryColor, color: categoryColor }}
          >
            {poll.category}
          </span>
        </Badge>
        
        {isTrending && (
          <div className="flex items-center gap-1 text-orange-400 text-xs font-bold animate-pulse">
            <Flame size={12} fill="currentColor" />
            <span>Trending</span>
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-white mb-2 flex-grow group-hover:text-blue-200 transition-colors">
        {poll.question}
      </h3>

      {/* Meta Data */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-mono">
        <span>{totalVotes.toLocaleString()} votes</span>
        {poll.endsAt && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatTimeRemaining(poll)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto">
        {hasVoted ? (
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={onViewResults}
            leftIcon={<CheckCircle2 size={16} className="text-green-500" />}
          >
            Results
          </Button>
        ) : (
          <Button variant="primary" fullWidth onClick={onVote}>
            Vote Now
          </Button>
        )}
      </div>
    </Card>
  );
};