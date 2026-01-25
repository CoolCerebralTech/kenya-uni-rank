import React from 'react';
import type { PollResult } from '../../types/models';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MiniRacePreviewProps {
  slug: string;
  question: string;
  results: PollResult[];
  totalVotes: number;
}

export const MiniRacePreview: React.FC<MiniRacePreviewProps> = ({
  slug,
  question,
  results,
  totalVotes
}) => {
  const topResults = results.slice(0, 3); // Top 3 only

  return (
    <Link to={`/poll/${slug}`} className="block group">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-sm font-medium text-slate-200 line-clamp-2 pr-4 group-hover:text-cyan-400 transition-colors">
            {question}
          </h4>
          <ChevronRight size={16} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="space-y-2">
          {topResults.map((r, i) => (
            <div key={r.universityId} className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 w-3">{i + 1}.</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ width: `${r.percentage}%`, backgroundColor: r.universityColor }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-between items-center text-[10px] text-slate-500">
          <span>{totalVotes.toLocaleString()} votes</span>
          <span className="uppercase tracking-wide">Live</span>
        </div>
      </div>
    </Link>
  );
};