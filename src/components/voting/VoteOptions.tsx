import React, { useState } from 'react';
import { UniversityService } from '../../services/university.service';
import { ChevronRight, Loader2, Zap } from 'lucide-react';
import type { University } from '../../types';

interface VoteOptionsProps {
  onVote: (universityId: string) => void;
  isVoting: boolean;
}

export const VoteOptions: React.FC<VoteOptionsProps> = ({ onVote, isVoting }) => {
  // Use Sync methods since data is static for now
  const publicUnis = UniversityService.getByTypeSync('Public');
  const privateUnis = UniversityService.getByTypeSync('Private');

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Public Universities Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            Public Universities
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({publicUnis.length})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {publicUnis.map((uni, index) => (
            <UniversityOption
              key={uni.id}
              uni={uni}
              onVote={onVote}
              isVoting={isVoting}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Private Universities Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            Private Universities
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({privateUnis.length})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {privateUnis.map((uni, index) => (
            <UniversityOption
              key={uni.id}
              uni={uni}
              onVote={onVote}
              isVoting={isVoting}
              index={index + publicUnis.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced University Option Component
const UniversityOption: React.FC<{
  uni: University;
  onVote: (id: string) => void;
  isVoting: boolean;
  index: number;
}> = ({ uni, onVote, isVoting, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onVote(uni.id)}
      disabled={isVoting}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-left transition-all duration-200 hover:border-blue-500 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 animate-fade-in-up"
      style={{ 
        borderLeftColor: uni.color, 
        borderLeftWidth: '4px',
        animationDelay: `${Math.min(index * 50, 500)}ms` // Cap delay to prevent long waits
      }}
    >
      {/* Background Gradient on Hover */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          background: `linear-gradient(to right, transparent, ${uni.color}15, transparent)`
        }}
      />

      {/* Color Accent Glow on Left Edge */}
      {isHovered && (
        <div 
          className="absolute left-0 top-0 h-full w-1 blur-sm pointer-events-none"
          style={{ 
            backgroundColor: uni.color,
            boxShadow: `0 0 12px ${uni.color}`
          }}
        />
      )}

      {/* Content */}
      <div className="relative flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 dark:text-white text-base">
            {uni.shortName}
          </span>
          {isHovered && !isVoting && (
            <Zap size={14} className="text-yellow-500 animate-pulse" />
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
          {uni.name}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          📍 {uni.location}
        </span>
      </div>

      {/* Right Icon */}
      <div className={`relative transition-all duration-200 ${
        isHovered ? 'translate-x-1' : ''
      }`}>
        {isVoting ? (
          <Loader2 className="animate-spin text-blue-600" size={20} />
        ) : (
          <ChevronRight 
            size={20} 
            className={`transition-colors ${
              isHovered ? 'text-blue-600' : 'text-gray-300'
            }`}
          />
        )}
      </div>
    </button>
  );
};