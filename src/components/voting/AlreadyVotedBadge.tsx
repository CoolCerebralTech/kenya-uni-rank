import React from 'react';
import { Check, Lock, ChevronRight } from 'lucide-react';
import { getUniversityShortName, getUniversityColor } from '../../services/university.service';

interface AlreadyVotedBadgeProps {
  universityId: string | null; // Can be null if we don't know who they voted for (local storage sync issue)
  votedAt?: number;
  onViewResults: () => void;
}

export const AlreadyVotedBadge: React.FC<AlreadyVotedBadgeProps> = ({ 
  universityId, 
  votedAt, 
  onViewResults 
}) => {
  const uniName = universityId ? getUniversityShortName(universityId) : 'Unknown';
  const uniColor = universityId ? getUniversityColor(universityId) : '#64748b';

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex items-center justify-between group cursor-pointer hover:border-slate-700 transition-colors" onClick={onViewResults}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 text-green-500">
          <Check size={16} />
        </div>
        
        <div>
          <p className="text-sm font-medium text-slate-200">
            You voted for <span style={{ color: uniColor }} className="font-bold">{uniName}</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
             <Lock size={10} />
             <span>Vote Locked</span>
             {votedAt && <span>• {new Date(votedAt).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
        View Results <ChevronRight size={14} />
      </div>
    </div>
  );
};