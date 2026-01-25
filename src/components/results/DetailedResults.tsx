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
  historyData: any[]; // For the chart
  userHasVoted: boolean;
}

export const DetailedResults: React.FC<DetailedResultsProps> = ({
  poll,
  results,
  totalVotes,
  historyData,
  userHasVoted
}) => {
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
        
        {/* Trend Chart */}
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

        {/* Voter Breakdown */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Users size={18} /> Voter Demographics
            </h3>
            
            <div className="space-y-4">
              {[
                { label: 'Current Students', value: 65, color: 'bg-blue-500' },
                { label: 'Alumni', value: 25, color: 'bg-purple-500' },
                { label: 'Applicants', value: 10, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1 text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color}`} 
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Insight:</strong> Voting is dominated by current students, indicating high campus engagement for this topic.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};