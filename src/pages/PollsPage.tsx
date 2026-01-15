import React from 'react';
import { Vote, TrendingUp } from 'lucide-react';
import { PollList } from '../components';

export const PollsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-lg">
            <Vote size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text dark:text-white">
              Vote on Polls
            </h1>
            <p className="text-text-subtle dark:text-gray-400">
              Cast your vote and see live results
            </p>
          </div>
        </div>

        {/* Live Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 dark:bg-success/20 rounded-full border border-success/30 mt-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          <TrendingUp size={16} className="text-success" />
          <span className="text-sm font-semibold text-success">
            Results update in real-time
          </span>
        </div>
      </div>

      {/* Poll List Component (handles everything) */}
      <PollList />
    </div>
  );
};