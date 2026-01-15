import React, { useState } from 'react';
import { UniversityService } from '../../services/university.service';
import { ChevronRight, Loader2, Zap } from 'lucide-react';
import type { University } from '../../types';

interface VoteOptionsProps {
  onVote: (universityId: string) => void;
  isVoting: boolean;
}

export const VoteOptions: React.FC<VoteOptionsProps> = ({ onVote, isVoting }) => {
  const publicUnis = UniversityService.getByTypeSync('Public');
  const privateUnis = UniversityService.getByTypeSync('Private');

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Public Universities Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-brand-primary shadow-glow"></div>
          <h4 className="text-sm font-bold text-text dark:text-white uppercase tracking-wide">
            Public Universities
          </h4>
          <span className="text-xs text-text-subtle dark:text-gray-500">
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
          <div className="h-2.5 w-2.5 rounded-full bg-brand-secondary shadow-glow-purple"></div>
          <h4 className="text-sm font-bold text-text dark:text-white uppercase tracking-wide">
            Private Universities
          </h4>
          <span className="text-xs text-text-subtle dark:text-gray-500">
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
      className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl border-2 border-border-light dark:border-border bg-white dark:bg-background-elevated p-4 text-left transition-all duration-200 hover:border-brand-primary hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 animate-fade-in-up"
      style={{ 
        borderLeftColor: uni.color, 
        borderLeftWidth: '4px',
        animationDelay: `${index * 50}ms`
      }}
    >
      {/* Background Gradient on Hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          background: `linear-gradient(to right, transparent, ${uni.color}10, transparent)`
        }}
      />

      {/* Color Accent Glow */}
      {isHovered && (
        <div 
          className="absolute left-0 top-0 h-full w-1 blur-sm"
          style={{ 
            backgroundColor: uni.color,
            boxShadow: `0 0 12px ${uni.color}`
          }}
        />
      )}

      {/* Content */}
      <div className="relative flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text dark:text-white text-base">
            {uni.shortName}
          </span>
          {isHovered && (
            <Zap size={14} className="text-brand-accent animate-pulse" />
          )}
        </div>
        <span className="text-xs text-text-subtle dark:text-gray-400 line-clamp-1">
          {uni.name}
        </span>
        <span className="text-xs text-text-muted dark:text-gray-500 flex items-center gap-1">
          📍 {uni.location}
        </span>
      </div>

      {/* Right Icon */}
      <div className={`relative transition-all duration-200 ${
        isHovered ? 'translate-x-1' : ''
      }`}>
        {isVoting ? (
          <Loader2 className="animate-spin text-brand-primary" size={20} />
        ) : (
          <ChevronRight 
            size={20} 
            className={`transition-colors ${
              isHovered ? 'text-brand-primary' : 'text-text-muted'
            }`}
          />
        )}
      </div>

      {/* Hover Glow Effect */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
          style={{ 
            boxShadow: `inset 0 0 20px ${uni.color}`
          }}
        />
      )}
    </button>
  );
};