// src/components/voting/AlreadyVotedBadge.tsx
import React from 'react';
import { Lock, ChevronRight } from 'lucide-react';
import { getUniversityShortName, getUniversityColor } from '../../services/university.service';

interface AlreadyVotedBadgeProps {
  universityId: string | null;
  votedAt?: string; // Changed to string to match ISO date format
  onViewResults: () => void;
}

export const AlreadyVotedBadge: React.FC<AlreadyVotedBadgeProps> = ({ 
  universityId, 
  votedAt, 
  onViewResults 
}) => {
  const uniName = universityId ? getUniversityShortName(universityId) : 'Unknown University';
  const uniColor = universityId ? getUniversityColor(universityId) : '#64748b';
  
  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-KE', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return null;
    }
  };

  return (
    <div 
      className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:border-slate-700 transition-colors" 
      onClick={onViewResults}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
          style={{ backgroundColor: uniColor }}
        >
          {uniName.substring(0, 2)}
        </div>
        
        <div>
          <p className="text-sm font-medium text-slate-200">
            You voted for <span style={{ color: uniColor }} className="font-bold">{uniName}</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock size={10} />
            <span>Vote Locked</span>
            {votedAt && (
              <>
                <span className="text-slate-600">•</span>
                <span>{formatDate(votedAt)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
        View Full Results <ChevronRight size={14} />
      </div>
    </div>
  );
};