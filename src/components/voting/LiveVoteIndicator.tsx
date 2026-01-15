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
    // Simulate real-time activity for MVP demo purposes
    // In production, this would be triggered by Supabase Realtime events
    const simulateActivity = () => {
      setIsActive(true);
      setRecentVotes((prev) => prev + 1);
      
      const timeout = setTimeout(() => {
        setIsActive(false);
      }, 2000);
      return timeout;
    };

    // Use a fixed interval instead of random to be React-friendly
    const interval = setInterval(() => {
      // 30% chance to simulate a vote every 5 seconds
      // This is safe because it's inside an effect, not render
      if (Math.random() > 0.7) { 
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
          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-500/50 scale-105' 
          : 'bg-green-50 dark:bg-green-900/10 text-green-600/80 dark:text-green-400/80 border border-green-200 dark:border-green-800'
        }
      `}>
        <span className="relative flex h-2 w-2">
          {isActive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span>Live</span>
      </div>
    );
  }

  return (
    <div className={`
      flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300
      ${isActive 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-md scale-[1.02]' 
        : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-gray-700'
      }
    `}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          {isActive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          )}
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <Activity 
          size={16} 
          className={isActive ? 'text-green-600 animate-pulse' : 'text-gray-400'}
        />
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-900 dark:text-white">
          {isActive ? 'Vote received!' : 'Listening for votes...'}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {recentVotes} recent {recentVotes === 1 ? 'vote' : 'votes'}
        </span>
      </div>

      {isActive && (
        <TrendingUp size={14} className="text-green-600 animate-bounce" />
      )}
    </div>
  );
};