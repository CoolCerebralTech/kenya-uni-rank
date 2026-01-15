import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <--- Import Link
import type { Poll } from '../../types';
import { castVote, checkIfVoted } from '../../services/voting.service';
import { getFingerprint } from '../../services/fingerprint.service'; 
import { VoteOptions } from './VoteOptions';
import { PollResults } from './PollResults';
import { VoteSuccessToast } from './VoteSuccessToast';
import { LiveVoteIndicator } from './LiveVoteIndicator';
import { AlertCircle, TrendingUp, Users, ArrowRight, BarChart2 } from 'lucide-react'; // <--- Added icons
import { UniversityService } from '../../services/university.service';

interface PollCardProps {
  poll: Poll;
}

export const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const [fpReady, setFpReady] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [votedUniversityName, setVotedUniversityName] = useState('');

  // Initial check on mount
  useEffect(() => {
    const init = async () => {
      try {
        await getFingerprint();
        setFpReady(true);
        const status = await checkIfVoted(poll.id);
        setHasVoted(status);
      } catch (e) {
        console.error("Fingerprint init error", e);
        setFpReady(true);
      }
    };
    init();
  }, [poll.id]);

  const handleVote = async (universityId: string) => {
    if (!fpReady || isVoting) return;

    setIsVoting(true);
    setError(null);

    try {
      const result = await castVote(poll.id, universityId);
      
      if (result.success) {
        setHasVoted(true);
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
    } finally {
      setIsVoting(false);
    }
  };

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, string> = {
      vibes: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
      sports: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
      academics: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      food: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
      facilities: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800',
      social: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800',
      general: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
    };
    return styles[category.toLowerCase()] || styles.general;
  };

  return (
    <>
      <div className="group mb-6 overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:scale-[1.005] animate-fade-in-up">
        {/* Poll Header */}
        <div className="relative border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-700/50 px-6 py-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative">
            <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide border ${getCategoryStyle(poll.category)}`}>
                  {poll.category}
                </span>
                {hasVoted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                    ✓ You Voted
                  </span>
                )}
              </div>
              
              <LiveVoteIndicator pollId={poll.id} variant="compact" />
            </div>

            {/* --- LINK ADDED HERE --- */}
            <Link to={`/poll/${poll.slug}`} className="block">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-brand-primary transition-colors hover:underline decoration-brand-primary/30">
                {poll.question}
              </h3>
            </Link>

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400 animate-slide-down">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Oops! Something went wrong</p>
                <p className="text-xs opacity-90">{error}</p>
              </div>
            </div>
          )}

          {!fpReady ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-primary border-t-transparent mb-3" />
              <span className="text-sm">Loading voting module...</span>
            </div>
          ) : hasVoted ? (
            <div className="animate-scale-in">
              <PollResults pollId={poll.id} />
              
              {/* --- LINK ADDED HERE TOO --- */}
              <div className="mt-4 flex justify-center">
                <Link 
                  to={`/poll/${poll.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  <BarChart2 size={16} />
                  View Detailed Analysis
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <VoteOptions onVote={handleVote} isVoting={isVoting} />
          )}
        </div>
      </div>

      {showSuccessToast && (
        <VoteSuccessToast
          universityName={votedUniversityName}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </>
  );
};