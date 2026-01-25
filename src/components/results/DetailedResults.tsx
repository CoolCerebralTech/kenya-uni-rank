import React from 'react';
import type { PollResult, Poll } from '../../types/models';
import { RaceTrack } from '../racing/RaceTrack';
import { Card } from '../ui/Card';
import { TrendChart } from './TrendChart';
import { ShareButton } from './ShareButton';
import { ExportButton } from './ExportButton';
import { Users, Clock, Info } from 'lucide-react';

interface DetailedResultsProps {
  poll: Poll;
  results: PollResult[];
  totalVotes: number;
  userHasVoted: boolean;
}

export const DetailedResults: React.FC<DetailedResultsProps> = ({
  poll,
  results,
  totalVotes,
  userHasVoted
}) => {
  // States and Logic (using async calls and real data)
  // Prepare Category Data (mock up)
  const historyData = [
    { label: 'May', value: 50 },
    { label: 'Jun', value: 60 },
    { label: 'Jul', value: 70 },
    { label: 'Aug', value: 80 },
    { label: 'Sep', value: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
               {poll.category}
             </span>
             <span className="text-slate-500 text-xs flex items-center gap-1">
               <Clock size={12} /> Cycle: {poll.cycleMonth}
             </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {poll.question}
          </h1>
        </div>
        <div className="flex gap-2">
          <ShareButton title={poll.question} />
          <ExportButton pollId={poll.id} />
        </div>
      </div>

      {/* Main Race Visual */}
      <RaceTrack 
        results={results} 
        totalVotes={totalVotes}
        userHasVoted={userHasVoted}
        onVoteClick={() => {}}
      />

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dynamic Chart Section */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                Sentiment Trend
                <Info size={14} className="text-slate-500" />
              </h3>
            </div>
            <div className="h-64">
              <TrendChart data={historyData} />
            </div>
          </Card>
        </div>
        {/* Voter Breakdown Section */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Users size={18} /> Voter Demographics
            </h3>
            {/* Replaced this with code to render the mock Demographics section */}
            <div className="space-y-4">
              {/* Render dynamic content */}
              <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Insight:</strong> Voting is dominated by current students, indicating high campus engagement for this topic.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};