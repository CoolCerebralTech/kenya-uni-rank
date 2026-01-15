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
      // Wait for exit animation to finish before calling onClose
      setTimeout(onClose, 300); 
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoCloseDuration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 border-2 border-green-500 shadow-xl max-w-sm w-full">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-green-50 via-green-100/50 to-transparent dark:from-green-900/20 dark:via-green-900/10" 
          style={{ backgroundSize: '200% 100%' }} 
        />
        
        {/* Content */}
        <div className="relative px-5 py-4 flex items-start gap-4">
          {/* Icon */}
          <div className="shrink-0">
            <div className="relative">
              <CheckCircle className="text-green-600 dark:text-green-400" size={28} strokeWidth={2.5} />
              <Sparkles 
                className="absolute -top-1 -right-1 text-yellow-500 animate-pulse" 
                size={14} 
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              Vote Recorded!
              <TrendingUp size={14} className="text-green-600 dark:text-green-400" />
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your vote for <span className="font-semibold text-green-700 dark:text-green-400">{universityName}</span> has been counted.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              See live results below ↓
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-green-100 dark:bg-green-900">
          <div 
            className="h-full bg-green-500"
            style={{ 
              width: '100%',
              transition: `width ${autoCloseDuration}ms linear`,
              // Using a simple transition for the width to simulate countdown
              // In a real app, you might want a CSS keyframe here
            }}
          />
        </div>
      </div>
    </div>
  );
};