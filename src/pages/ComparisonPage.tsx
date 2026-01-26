import React, { useState, useEffect } from 'react';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/FullScreenLoader';

// Features
import { UniversityComparison } from '../components/features/UniversityComparison';
import { ShareButton } from '../components/results/ShareButton';

// Services
import { getUniversities } from '../services/database.service';
import type { University } from '../types/models';
import { Swords, Info, AlertTriangle } from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [universities, setUniversities] = useState<University[]>([]);

  useEffect(() => {
    // Fetch the list of universities for the dropdowns
    const loadData = async () => {
      setIsLoading(true);
      const response = await getUniversities();
      
      if (response.success && response.data) {
        setUniversities(response.data);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <AppLayout>
      <PageContainer maxWidth="xl" title="Compare Universities">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-500/30 text-red-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Swords size={14} /> Versus Mode
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Head-to-Head Analysis
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Settle the debate. Compare any two universities across key metrics based on real student voting data.
          </p>
        </div>

        {/* --- MAIN COMPARISON TOOL --- */}
        <div className="mb-12">
          {!isLoading && universities.length > 0 ? (
            <UniversityComparison universities={universities} />
          ) : (
            <Card className="h-[500px] flex items-center justify-center bg-slate-900/50">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <Spinner size="lg" />
                  <p className="text-slate-500 animate-pulse">Loading Battle Data...</p>
                </div>
              ) : (
                <p className="text-red-400">Failed to load universities list.</p>
              )}
            </Card>
          )}
        </div>

        {/* --- SHARE SECTION --- */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center max-w-md w-full">
            <h3 className="font-bold text-white mb-2">Found a clear winner?</h3>
            <p className="text-xs text-slate-400 mb-4">
              Share this matchup with your friends and let them vote to change the stats.
            </p>
            <div className="flex justify-center">
              <ShareButton title="UniPulse Comparison Battle" />
            </div>
          </div>
        </div>

        <SectionDivider label="About the Data" icon={<Info size={16} />} />

        {/* --- DISCLAIMER --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Info size={16} className="text-blue-400" /> How is this calculated?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comparison scores are derived from aggregating votes across individual polls. If a university wins more "Vibes" polls, their Vibe score increases relative to the competition.
            </p>
          </div>

          <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-800/50">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" /> Subjective Nature
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              These stats represent <strong>student sentiment</strong>, not official academic rankings. They reflect how students <em>feel</em> about their institutions.
            </p>
          </div>
        </div>

      </PageContainer>
    </AppLayout>
  );
};