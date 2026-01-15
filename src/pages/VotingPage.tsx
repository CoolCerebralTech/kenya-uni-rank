import React from 'react';
import { PollList } from '../components/voting/PollList';
import { TrendingUp, Filter, Zap } from 'lucide-react';

export const VotingPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section - Engaging intro to voting with dynamic student participation vibe */}
      {/* Image: Diverse group of Kenyan university students using phones to vote in polls on campus - Place as a subtle background or hero image for the header */}
      <div className="rounded-xl bg-gradient-to-r from-primary-900/50 to-secondary-900/50 p-8 border border-border shadow-glow-blue">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-muted mb-2 animate-pulse">
              <Zap size={16} className="text-brand-yellow" />
              <span>ACTIVE POLLS</span>
            </div>
            <h2 className="text-3xl md:text-hero font-display text-inverted">Join the Vote</h2>
            <p className="mt-2 text-subtitle text-text-muted max-w-2xl">
              Pick your favorites, vote anonymously, and watch live results update in real-time. Your voice shapes the rankings!
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-background-elevated px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-background-hover transition-all hover:shadow-glow">
              <Filter size={16} />
              Filter Categories
            </button>
            <div className="inline-flex items-center gap-2 rounded-lg bg-success/10 px-4 py-2.5 border border-success/30">
              <TrendingUp size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Poll Grid Section - Main content with list of polls */}
      {/* Image: Interactive poll interface mockup with bar charts and university options in a mobile app style - Place as a teaser image above the poll list for visual engagement */}
      <div className="rounded-xl bg-background-elevated overflow-hidden border border-border shadow-card hover:shadow-glow-blue transition-all animate-slide-up">
        <div className="p-6">
          <PollList />
        </div>
      </div>

      {/* How It Works Section - Educational footer with step-by-step guide */}
      {/* Image: Step-by-step infographic of voting process with icons for pick, vote, and watch - Place as an illustrative graphic integrated into the grid or as background */}
      <div className="rounded-xl bg-background-muted p-8 border border-border shadow-glow animate-slide-up">
        <h4 className="font-display text-inverted mb-4 flex items-center gap-2 text-xl">
          <Zap size={20} className="text-brand-yellow" />
          How Voting Works
        </h4>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2 group">
            <div className="text-base font-display text-inverted group-hover:text-primary-400 transition-colors">1. Choose a Poll</div>
            <div className="text-sm text-text-muted">Select from categories like vibes, sports, or academics.</div>
          </div>
          <div className="space-y-2 group">
            <div className="text-base font-display text-inverted group-hover:text-primary-400 transition-colors">2. Cast Your Vote</div>
            <div className="text-sm text-text-muted">One click on your top university—no sign-up needed.</div>
          </div>
          <div className="space-y-2 group">
            <div className="text-base font-display text-inverted group-hover:text-primary-400 transition-colors">3. See Instant Results</div>
            <div className="text-sm text-text-muted">Watch percentages and rankings update live.</div>
          </div>
        </div>
      </div>
    </div>
  );
};