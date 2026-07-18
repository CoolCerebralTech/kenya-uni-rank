import React from 'react';
import type { Poll } from '../../types/models';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatTimeRemaining, getCategoryColor } from '../../services/poll.service';

interface PollCardProps {
  poll: Poll;
  hasVoted: boolean;
  totalVotes: number;
  isTrending?: boolean;
  onVote: () => void;
  onViewResults: () => void;
}

// UniPulse v3 — refined poll card. Glass surface, category chip with
// soft glow, trending flame badge, hover lift.
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
    <Card className="relative flex flex-col h-full group overflow-hidden animate-fade-in-up">
      {/* Ambient category glow on hover */}
      <div
        aria-hidden
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: categoryColor }}
      />

      {/* Header */}
      <div className="relative flex justify-between items-start mb-3">
        <span
          className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border"
          style={{
            color: categoryColor,
            backgroundColor: `${categoryColor}15`,
            borderColor: `${categoryColor}30`,
          }}
        >
          {poll.category}
        </span>

        {isTrending && (
          <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
            <Flame size={12} fill="currentColor" className="animate-pulse" />
            <span>Hot</span>
          </div>
        )}
      </div>

      {/* Question */}
      <h3 className="text-base sm:text-lg font-bold text-white mb-3 flex-grow leading-snug group-hover:text-cyan-200 transition-colors line-clamp-3">
        {poll.question}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-4 font-mono tabular">
        <span>{totalVotes.toLocaleString()} votes</span>
        {poll.endsAt && (
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatTimeRemaining(poll)}
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto">
        {hasVoted ? (
          <Button
            variant="secondary"
            fullWidth
            onClick={onViewResults}
            leftIcon={<CheckCircle2 size={14} className="text-emerald-400" />}
          >
            View Results
          </Button>
        ) : (
          <Button variant="primary" fullWidth onClick={onVote} rightIcon={<ArrowRight size={14} />}>
            Vote Now
          </Button>
        )}
      </div>
    </Card>
  );
};
