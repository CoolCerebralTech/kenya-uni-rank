import React from 'react';
import { PollList } from '../components/voting/PollList';
import { TrendingUp, Filter, Zap } from 'lucide-react';

export const VotingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header - Polymarket Style */}
      <div className="rounded-xl border border-gray-800 bg-gradient-to-r from-gray-900 to-black p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Zap size={16} className="text-yellow-400" />
              <span>ACTIVE MARKETS</span>
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Live Polls</h2>
            <p className="mt-2 text-gray-400 max-w-2xl">
              Click to vote on any university. Results update in real-time—watch the odds shift.
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
              <Filter size={16} />
              Filter
            </button>
            <div className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5">
              <TrendingUp size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Poll Grid */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <div className="p-6">
          <PollList />
        </div>
      </div>

      {/* Market Info Footer */}
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" />
          How It Works
        </h4>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-300">1. Pick a Market</div>
            <div className="text-xs text-gray-500">Choose any active poll (like "Best Campus Life")</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-300">2. Cast Your Vote</div>
            <div className="text-xs text-gray-500">Click on any university—no signup needed</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-300">3. Watch Odds Shift</div>
            <div className="text-xs text-gray-500">See real-time percentages update instantly</div>
          </div>
        </div>
      </div>
    </div>
  );
};