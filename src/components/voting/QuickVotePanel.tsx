import { useState } from 'react';
import type { Poll, University } from '../../types/models';

interface QuickVotePanelProps {
  poll: Poll;
  universities: University[];
  onVote: (universityId: string) => Promise<void>;
  hasVoted?: boolean;
  votedFor?: string;
  disabled?: boolean;
}

export function QuickVotePanel({ 
  poll, 
  universities, 
  onVote, 
  hasVoted = false,
  votedFor,
  disabled = false 
}: QuickVotePanelProps) {
  const [selectedUni, setSelectedUni] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleVote = async (universityId: string) => {
    if (hasVoted || disabled || isVoting) return;

    setSelectedUni(universityId);
    setIsVoting(true);

    try {
      await onVote(universityId);
      setShowSuccess(true);
      
      // Auto-hide success message
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Vote failed:', error);
      setSelectedUni(null);
    } finally {
      setIsVoting(false);
    }
  };

  // Group universities by type
  const publicUnis = universities.filter(u => u.type === 'Public');
  const privateUnis = universities.filter(u => u.type === 'Private');

  return (
    <div className="w-full space-y-6">
      {/* Poll Question */}
      <div className="text-center space-y-3 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50">
        <div className="inline-block px-3 py-1 bg-cyan-500/10 rounded-full">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
            {poll.category}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-white leading-tight">
          {poll.question}
        </h2>

        {hasVoted ? (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <span>✓</span>
            <span className="text-sm font-semibold">You've voted!</span>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">
            Tap to cast your vote • One vote per poll
          </p>
        )}
      </div>

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-scale-in bg-gradient-to-br from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <div className="font-bold text-lg">Vote Counted!</div>
                <div className="text-sm opacity-90">You shifted the race</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voting Grid */}
      <div className="space-y-6">
        {/* Public Universities */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide px-2">
            Public Universities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {publicUnis.map((uni) => {
              const isSelected = selectedUni === uni.id || votedFor === uni.id;
              const isThisVoting = isVoting && selectedUni === uni.id;

              return (
                <button
                  key={uni.id}
                  onClick={() => handleVote(uni.id)}
                  disabled={hasVoted || disabled || isVoting}
                  className={`
                    relative group p-4 rounded-xl border-2 transition-all duration-300
                    ${hasVoted || disabled
                      ? 'cursor-not-allowed opacity-40'
                      : 'cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95'
                    }
                    ${isSelected
                      ? 'scale-105 shadow-2xl'
                      : ''
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? `${uni.color}20` : '#1E293B',
                    borderColor: isSelected ? uni.color : '#475569',
                  }}
                >
                  {/* Loading Spinner */}
                  {isThisVoting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* University Info */}
                  <div className="space-y-2">
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-white"
                        style={{ backgroundColor: uni.color }}
                      >
                        {uni.shortName.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs font-bold text-white leading-tight">
                        {uni.shortName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {uni.location}
                      </div>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && !isVoting && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce-slow">
                      ✓
                    </div>
                  )}

                  {/* Hover Glow */}
                  {!hasVoted && !disabled && (
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: `0 0 30px ${uni.color}60`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Private Universities */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide px-2">
            Private Universities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {privateUnis.map((uni) => {
              const isSelected = selectedUni === uni.id || votedFor === uni.id;
              const isThisVoting = isVoting && selectedUni === uni.id;

              return (
                <button
                  key={uni.id}
                  onClick={() => handleVote(uni.id)}
                  disabled={hasVoted || disabled || isVoting}
                  className={`
                    relative group p-4 rounded-xl border-2 transition-all duration-300
                    ${hasVoted || disabled
                      ? 'cursor-not-allowed opacity-40'
                      : 'cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95'
                    }
                    ${isSelected ? 'scale-105 shadow-2xl' : ''}
                  `}
                  style={{
                    backgroundColor: isSelected ? `${uni.color}20` : '#1E293B',
                    borderColor: isSelected ? uni.color : '#475569',
                  }}
                >
                  {isThisVoting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-white"
                        style={{ backgroundColor: uni.color }}
                      >
                        {uni.shortName.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs font-bold text-white leading-tight">
                        {uni.shortName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {uni.location}
                      </div>
                    </div>
                  </div>

                  {isSelected && !isVoting && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce-slow">
                      ✓
                    </div>
                  )}

                  {!hasVoted && !disabled && (
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: `0 0 30px ${uni.color}60`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Anti-Cheat Message */}
      {!hasVoted && (
        <div className="text-center p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <p className="text-xs text-blue-400">
            💡 Vote honestly based on your experience — help others find their best fit
          </p>
        </div>
      )}
    </div>
  );
}