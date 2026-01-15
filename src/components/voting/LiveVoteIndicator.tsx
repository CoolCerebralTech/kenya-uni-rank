import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp } from 'lucide-react';

interface LiveVoteIndicatorProps {
  pollId: string;
  variant?: 'compact' | 'detailed';
}

export const LiveVoteIndicator: React.FC<LiveVoteIndicatorProps> = ({ 
  pollId,
  variant = 'compact' 
}) => {
  const [recentVotes, setRecentVotes] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Simulate vote activity detection
    // In real app, this would listen to Supabase realtime
    const simulateActivity = () => {
      setIsActive(true);
      setRecentVotes((prev) => prev + 1);
      
      setTimeout(() => {
        setIsActive(false);
      }, 2000);
    };

    // Random activity simulation
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        simulateActivity();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pollId]);

  if (variant === 'compact') {
    return (
      <div className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
        transition-all duration-300
        ${isActive 
          ? 'bg-success/20 text-success border-2 border-success/50 scale-110' 
          : 'bg-success/10 text-success/80 border border-success/30'
        }
      `}>
        <span className="relative flex h-2 w-2">
          {isActive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span>Live</span>
      </div>
    );
  }

  return (
    <div className={`
      flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300
      ${isActive 
        ? 'bg-success/10 border-success/40 shadow-md scale-[1.02]' 
        : 'bg-background-subtle dark:bg-background-elevated border-border'
      }
    `}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          {isActive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          )}
          <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
        </span>
        <Activity 
          size={16} 
          className={isActive ? 'text-success animate-pulse' : 'text-text-subtle'}
        />
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-text dark:text-white">
          {isActive ? 'Vote received!' : 'Listening for votes...'}
        </span>
        <span className="text-xs text-text-subtle dark:text-gray-400">
          {recentVotes} recent {recentVotes === 1 ? 'vote' : 'votes'}
        </span>
      </div>

      {isActive && (
        <TrendingUp size={14} className="text-success animate-bounce-subtle" />
      )}
    </div>
  );
};