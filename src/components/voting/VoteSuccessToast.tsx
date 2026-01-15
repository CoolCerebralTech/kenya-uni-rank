import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, TrendingUp } from 'lucide-react';

interface VoteSuccessToastProps {
  universityName: string;
  onClose: () => void;
  autoCloseDuration?: number;
}

export const VoteSuccessToast: React.FC<VoteSuccessToastProps> = ({ 
  universityName, 
  onClose,
  autoCloseDuration = 4000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoCloseDuration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-background-elevated border-2 border-success shadow-xl max-w-sm">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-success/10 via-success/5 to-transparent animate-shimmer" 
          style={{ backgroundSize: '200% 100%' }} 
        />
        
        {/* Content */}
        <div className="relative px-5 py-4 flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="relative">
              <CheckCircle className="text-success" size={28} strokeWidth={2.5} />
              <Sparkles 
                className="absolute -top-1 -right-1 text-yellow-500 animate-pulse" 
                size={14} 
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex-1">
            <h4 className="font-bold text-text dark:text-white mb-1 flex items-center gap-2">
              Vote Recorded!
              <TrendingUp size={14} className="text-success animate-bounce-subtle" />
            </h4>
            <p className="text-sm text-text-subtle dark:text-gray-400">
              Your vote for <span className="font-semibold text-success">{universityName}</span> has been counted.
            </p>
            <p className="text-xs text-text-muted dark:text-gray-500 mt-1">
              See live results below ↓
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-text-subtle hover:text-text-muted dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-success/20">
          <div 
            className="h-full bg-success animate-shrink-width"
            style={{ 
              animation: `shrinkWidth ${autoCloseDuration}ms linear forwards` 
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};