import React from 'react';
import type { University } from '../../types/models';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { VoteButton } from './VoteButton';

interface UniversityCardProps {
  university: University;
  isSelected?: boolean;
  voteState?: 'idle' | 'loading' | 'success' | 'error' | 'disabled';
  onSelect: () => void;
  onVote: () => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  isSelected,
  voteState = 'idle',
  onSelect,
  onVote
}) => {
  return (
    <Card 
      padding="none"
      className={`
        relative group transition-all duration-300
        ${isSelected 
          ? 'ring-2 ring-blue-500 bg-slate-800/80 scale-[1.02] shadow-xl shadow-blue-900/20' 
          : 'hover:bg-slate-800/50 hover:border-slate-600'
        }
      `}
      onClick={onSelect}
    >
      {/* Top Banner (Color) */}
      <div 
        className="h-2 w-full" 
        style={{ backgroundColor: university.color }} 
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-lg"
            style={{ backgroundColor: university.color }}
          >
            {university.shortName}
          </div>
          <Badge size="sm" variant={university.type === 'Public' ? 'info' : 'warning'}>
            {university.type}
          </Badge>
        </div>

        {/* Info */}
        <h3 className="font-bold text-white mb-1 truncate" title={university.name}>
          {university.name}
        </h3>
        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
          📍 {university.location}
        </p>

        {/* Action */}
        <div onClick={(e) => e.stopPropagation()}>
          <VoteButton 
            state={voteState} 
            onClick={onVote} 
            className={isSelected ? 'bg-blue-600 border-blue-500 text-white' : ''}
          />
        </div>
      </div>
      
      {/* Selected Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/5 pointer-events-none rounded-xl" />
      )}
    </Card>
  );
};