import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Tabs } from '../components/ui/Tabs';

// Results & Visualization
import { CategorySummary } from '../components/results/CategorySummary';
import { ResultsGrid } from '../components/results/ResultsGrid';
import { LockedResultsCard } from '../components/voting/LockedResultsCard';

// Services
import { getActivePolls } from '../services/poll.service';
import { getPollWithResults } from '../services/voting.service';
import { getVotedPolls } from '../services/storage.service';
import type { PollCategory, PollResult } from '../types/models';
import { Lock, ArrowLeft, Share2 } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { category = 'vibes' } = useParams<{ category: string }>();
  const navigate = useNavigate();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [categoryData, setCategoryData] = useState<{
    polls: Array<{
      id: string;
      question: string;
      category: PollCategory;
      totalVotes: number;
      results: PollResult[];
    }>;
    topResults: PollResult[]; // For podium
    totalVotes: number;
    mostCompetitive: string;
    risingStar: string;
  } | null>(null);

  // Tabs Configuration
  const categories: { id: string; label: string }[] = [
    { id: 'vibes', label: 'Vibes' },
    { id: 'academics', label: 'Academics' },
    { id: 'sports', label: 'Sports' },
    { id: 'social', label: 'Social' },
    { id: 'facilities', label: 'Facilities' },
  ];

  // --- DATA LOADING & ACCESS CONTROL ---
  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      const targetCategory = category as PollCategory;

      // 1. Access Control: Check if user voted in ANY poll of this category
      // This is a simplified check. In production, you might require X% completion.
      const votedPollIds = getVotedPolls();
      const pollsRes = await getActivePolls(targetCategory);
      
      if (!pollsRes.success || !pollsRes.data) {
        setIsLoading(false);
        return;
      }

      const categoryPolls = pollsRes.data;
      const hasVotedIncategory = categoryPolls.some(p => votedPollIds.includes(p.id));

      if (!hasVotedIncategory) {
        setIsLocked(true);
        setIsLoading(false);
        return;
      }

      setIsLocked(false);

      // 2. Fetch Results for all polls in category
      // Note: In a real backend, this would be a single aggregate endpoint to avoid waterfalls
      const resultsPromises = categoryPolls.map(p => getPollWithResults(p.slug));
      const resultsResponses = await Promise.all(resultsPromises);

      const processedPolls = resultsResponses
        .map((res, index) => {
          if (!res.success || !res.data) return null;
          return {
            id: categoryPolls[index].id,
            question: categoryPolls[index].question,
            category: targetCategory,
            totalVotes: res.data.totalVotes,
            results: res.data.results,
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);

      // 3. Calculate Summary Metrics
      const allVotes = processedPolls.reduce((sum, p) => sum + p.totalVotes, 0);
      
      // Flatten all results to find top performers across category
      const allResultsMap = new Map<string, { result: PollResult; score: number }>();
      
      processedPolls.forEach(poll => {
        poll.results.forEach(r => {
          const current = allResultsMap.get(r.universityId) || { result: r, score: 0 };
          // Simple scoring: Add percentages (not scientifically perfect but good for visual)
          allResultsMap.set(r.universityId, { 
            result: r, 
            score: current.score + r.percentage 
          });
        });
      });

      const sortedByScore = Array.from(allResultsMap.values())
        .sort((a, b) => b.score - a.score)
        .map(item => item.result)
        .slice(0, 3);

      setCategoryData({
        polls: processedPolls,
        topResults: sortedByScore,
        totalVotes: allVotes,
        mostCompetitive: processedPolls[0]?.question || 'None', // Mock logic
        risingStar: sortedByScore[2]?.universityName || 'Pending', // Mock logic
      });

      setIsLoading(false);
    };

    loadResults();
  }, [category]);

  // --- HANDLERS ---
  const handleTabChange = (newCat: string) => {
    navigate(`/results/${newCat}`);
  };

  const handleVoteNow = () => {
    navigate(`/vote/${category}`);
  };

  // --- RENDER ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Spinner size="xl" variant="accent" className="mb-4" />
          <p className="text-slate-400 animate-pulse">Decrypting Community Data...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <PageContainer maxWidth="xl" title={`${category?.charAt(0).toUpperCase()}${category?.slice(1)} Results`}>
        
        {/* Navigation & Tabs */}
        <div className="mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Back to HQ
            </button>
            
            {!isLocked && (
              <Button variant="ghost" size="sm" leftIcon={<Share2 size={16} />}>
                Share Report
              </Button>
            )}
          </div>

          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <Tabs 
              tabs={categories} 
              activeTab={category || 'vibes'} 
              onChange={handleTabChange} 
              variant="pills"
            />
          </div>
        </div>

        {/* LOCKED STATE */}
        {isLocked && (
          <div className="max-w-2xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-slate-800 mb-6 shadow-xl shadow-black">
                <Lock className="text-red-500" size={32} />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                Sector Locked
              </h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Access to the <strong>{category}</strong> intelligence report requires a security clearance.
              </p>
            </div>

            <LockedResultsCard onVoteClick={handleVoteNow} />
            
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                Security Protocol: Contribute to View
              </p>
            </div>
          </div>
        )}

        {/* UNLOCKED STATE */}
        {!isLocked && categoryData && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 1. Hero Summary */}
            <CategorySummary 
              category={category as PollCategory}
              topPollResults={categoryData.topResults}
              totalVotes={categoryData.totalVotes}
              mostCompetitivePoll={categoryData.mostCompetitive}
              risingStar={categoryData.risingStar}
            />

            <SectionDivider label="Detailed Breakdown" />

            {/* 2. Full Grid */}
            <ResultsGrid 
              polls={categoryData.polls} 
              onViewDetails={(id) => navigate(`/poll/${id}`)} // Assuming detail route exists or uses slug
              userVotedPollIds={getVotedPolls()}
            />

          </div>
        )}

      </PageContainer>
    </AppLayout>
  );
};