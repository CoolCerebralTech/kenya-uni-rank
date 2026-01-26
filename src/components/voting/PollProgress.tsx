import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { ArrowLeft, SkipForward } from 'lucide-react';

interface PollProgressProps {
  current: number;
  total: number;
  category: string;
  completionPercentage?: number; // Added optional prop
  onBack: () => void;
  onSkip: () => void;
}

export const PollProgress: React.FC<PollProgressProps> = ({
  current,
  total,
  category,
  completionPercentage, // Destructure it
  onBack,
  onSkip
}) => {
  // Use provided percentage OR calculate it manually
  const progress = completionPercentage !== undefined 
    ? completionPercentage 
    : (current / total) * 100;

  return (
    <div className="sticky top-16 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-lg sm:border sm:top-20">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={onBack}
          disabled={current === 1}
          className="text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            {category} Battle
          </span>
          <span className="text-sm font-medium text-white">
            Poll {current} of {total}
          </span>
        </div>

        <button 
          onClick={onSkip}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
        >
          Skip <SkipForward size={14} />
        </button>
      </div>

      <ProgressBar 
        value={progress} 
        size="sm" 
        color="gradient" 
        className="max-w-md mx-auto" 
      />
    </div>
  );
};