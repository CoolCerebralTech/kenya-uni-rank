import React, { useState, useEffect } from 'react';
import type { Poll } from '../../types';
import { castVote, checkIfVoted } from '../../services/voting.service';
import { useFingerprint } from '../../hooks/useFingerprint';
import { VoteOptions } from './VoteOptions';
import { PollResults } from './PollResults';
import { VoteSuccessToast } from './VoteSuccessToast';
import { LiveVoteIndicator } from './LiveVoteIndicator';
import { AlertCircle, TrendingUp, Users } from 'lucide-react';
import { UniversityService } from '../../services/university.service';

interface PollCardProps {
  poll: Poll;
}

export const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const { fingerprint, loading: fpLoading, isReady } = useFingerprint();
  
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [votedUniversityName, setVotedUniversityName] = useState('');

  // Check if user already voted when fingerprint is ready
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (isReady) {
        const status = await checkIfVoted(poll.id);
        setHasVoted(status);
      }
    };
    checkVoteStatus();
  }, [isReady, poll.id]);

  const handleVote = async (universityId: string) => {
    if (!isReady || isVoting) return;

    setIsVoting(true);
    setError(null);

    try {
      const result = await castVote(poll.id, universityId);
      
      if (result.success) {
        setHasVoted(true);
        
        // Get university name for success message
        const uni = UniversityService.getById(universityId);
        setVotedUniversityName(uni?.shortName || 'this university');
        setShowSuccessToast(true);
      } else {
        setError(result.error || 'Failed to submit vote');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Voting error:', err);
    } finally {
      setIsVoting(false);
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      vibes: 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
      sports: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
      academics: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
      food: 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
      facilities: 'bg-teal-500/20 text-teal-700 dark:text-teal-400 border-teal-500/30',
      social: 'bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30',
      general: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
    };
    return colors[category.toLowerCase()] || colors.general;
  };

  return (
    <>
      <div className="group mb-6 overflow-hidden rounded-2xl bg-white dark:bg-background-elevated shadow-md hover:shadow-xl border border-border-light dark:border-border transition-all duration-300 hover:scale-[1.01] animate-fade-in-up">
        {/* Poll Header */}
        <div className="relative border-b border-border-light dark:border-border bg-gradient-to-r from-background-light to-background-light/50 dark:from-background-subtle dark:to-background-subtle/50 px-6 py-5">
          {/* Decorative Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-2xl" />
          
          <div className="relative">
            {/* Category Badge & Status */}
            <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide border ${getCategoryColor(poll.category)}`}>
                  {poll.category}
                </span>
                {hasVoted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success border border-success/30">
                    ✓ You Voted
                  </span>
                )}
              </div>
              
              <LiveVoteIndicator pollId={poll.id} variant="compact" />
            </div>

            {/* Question */}
            <h3 className="text-xl font-bold text-text dark:text-white leading-tight mb-2 group-hover:text-brand-primary transition-colors">
              {poll.question}
            </h3>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-text-subtle dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Users size={14} />
                Real-time results
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={14} />
                Live voting
              </span>
            </div>
          </div>
        </div>

        {/* Poll Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-danger/10 dark:bg-danger/20 border border-danger/30 p-4 text-sm text-danger animate-slide-down">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Oops! Something went wrong</p>
                <p className="text-xs opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {fpLoading ? (
            <div className="flex flex-col items-center justify-center h-40 text-text-muted">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-primary border-t-transparent mb-3" />
              <span className="text-sm">Loading poll...</span>
            </div>
          ) : hasVoted ? (
            // Show Results
            <div className="animate-scale-in">
              <PollResults pollId={poll.id} />
            </div>
          ) : (
            // Show Voting Options
            <VoteOptions onVote={handleVote} isVoting={isVoting} />
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <VoteSuccessToast
          universityName={votedUniversityName}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </>
  );
};