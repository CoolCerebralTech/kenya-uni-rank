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

// UniPulse v3 — v3 voting tile. Premium micro-card with brand-color wash on
// selected state, refined spacing, full mobile responsiveness.
export const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  isSelected = false,
  voteState = 'idle',
  onSelect,
  onVote,
}) => {
  return (
    <Card
      padding="none"
      variant={isSelected ? 'glass' : 'default'}
      className={`
        relative overflow-hidden transition-all duration-300 cursor-pointer
        ${isSelected
          ? 'ring-2 ring-cyan-400/70 shadow-[0_0_30px_rgba(34,211,238,0.18)] scale-[1.02]'
          : 'hover:-translate-y-1 hover:border-slate-700 group'}
      `}
      onClick={onSelect}
    >
      {/* Top brand strip — glows when selected */}
      <div
        className={`h-1.5 w-full transition-all duration-300 ${isSelected ? 'h-2' : ''}`}
        style={{
          backgroundColor: university.color,
          boxShadow: isSelected ? `0 0 10px ${university.color}` : 'none',
        }}
      />
      {/* Subtle wash — visible only on hover/selected */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity pointer-events-none"
        style={{ backgroundColor: university.color }}
      />

      <div className="relative p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg shrink-0"
            style={{ backgroundColor: university.color }}
          >
            {university.shortName}
          </div>
          <Badge
            size="sm"
            variant={university.type === 'Public' ? 'info' : 'warning'}
          >
            {university.type}
          </Badge>
        </div>

        {/* Name */}
        <h3
          className="font-bold text-white text-sm mb-1 truncate leading-snug group-hover:text-cyan-300 transition-colors"
          title={university.name}
        >
          {university.name}
        </h3>

        <p className="text-[11px] text-slate-500 mb-4 flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {university.location}
        </p>

        {/* Action — single tap to vote / select */}
        <div onClick={(e) => e.stopPropagation()}>
          <VoteButton
            state={voteState}
            onClick={() => {
              if (onVote) onVote();
              else onSelect();
            }}
            className={isSelected ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-300' : ''}
          />
        </div>
      </div>
    </Card>
  );
};
