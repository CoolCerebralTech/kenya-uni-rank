import React, { useState, useEffect } from 'react';
import type { Poll } from '../../types';
import { VotingService } from '../../services/voting';
import { useFingerprint } from '../../hooks/useFingerprint';
import { VoteOptions } from './VoteOptions';
import { PollResults } from './PollResults';
import { AlertCircle } from 'lucide-react';

interface PollCardProps {
  poll: Poll;
}

export const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const { fingerprint, loading: fpLoading } = useFingerprint();
  
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user already voted in this poll when component mounts
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (fingerprint) {
        const status = await VotingService.hasUserVoted(poll.id, fingerprint);
        setHasVoted(status);
      }
    };
    checkVoteStatus();
  }, [fingerprint, poll.id]);

  const handleVote = async (universityId: string) => {
  if (!fingerprint || isVoting) return;

  setIsVoting(true);
  setError(null);

  try {
    await VotingService.castVote(poll.id, universityId, fingerprint);
    setHasVoted(true);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'ALREADY_VOTED') {
      setHasVoted(true);
      setError('You have already voted in this poll.');
    } else {
      setError('Failed to submit vote. Please try again.');
      console.error('Voting error:', err);
    }
  } finally {
    setIsVoting(false);
  }
};


  return (
    <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
      {/* Poll Header */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {poll.category.toUpperCase()}
          </span>
          {hasVoted && (
            <span className="text-xs font-medium text-green-600">
              ✓ Voted
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{poll.question}</h3>
      </div>

      {/* Poll Body */}
      <div className="p-6">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Loading State (waiting for fingerprint) */}
        {fpLoading ? (
          <div className="flex h-32 items-center justify-center text-gray-400">
             <span className="text-sm">Loading poll...</span>
          </div>
        ) : hasVoted ? (
          // --- SHOW RESULTS IF VOTED ---
          <div className="animate-in fade-in zoom-in duration-300">
             <PollResults pollId={poll.id} />
          </div>
        ) : (
          // --- SHOW VOTING OPTIONS IF NOT VOTED ---
          <VoteOptions onVote={handleVote} isVoting={isVoting} />
        )}
      </div>
    </div>
  );
};