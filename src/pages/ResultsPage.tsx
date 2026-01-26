import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/FullScreenLoader';
import { Tabs } from '../components/ui/Tabs';

// Results & Visualization
import { CategorySummary } from '../components/results/CategorySummary';
import { ResultsGrid } from '../components/results/ResultsGrid';
import { LockedResultsCard } from '../components/voting/LockedResultsCard';

// Services
import { getActivePolls } from '../services/poll.service';
import { getPollWithResults } from '../services/voting.service';
import { getVotedPolls } from '../services/storage.service';
import { useToast } from '../hooks/useToast';

// Types
import type { PollCategory, PollResult } from '../types/models';
import { Lock, ArrowLeft, Share2 } from 'lucide-react';

interface AggregatedCategoryData {
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
}

export const ResultsPage: React.FC = () => {
  const { category = 'vibes' } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { showErrorToast } = useToast();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [categoryData, setCategoryData] = useState<AggregatedCategoryData | null>(null);

  // Tabs Configuration
  const categories: { id: string; label: string }[] = [
    { id: 'vibes', label: 'Vibes' },
    { id: 'academics', label: 'Academics' },
    { id: 'sports', label: 'Sports' },
    { id: 'social', label: 'Social' },
    { id: 'facilities', label: 'Facilities' },
  ];

  // --- DATA LOADING & LOGIC ---
  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      const targetCategory = category as PollCategory;

      try {
        // 1. Get user's voting history (Access Control)
        const votedPollIds = getVotedPolls();
        
        // 2. Fetch all active polls for this category
        const pollsRes = await getActivePolls(targetCategory);
        
        if (!pollsRes.success || !pollsRes.data || pollsRes.data.length === 0) {
          setIsLoading(false);
          setIsLocked(false); 
          return;
        }

        const categoryPolls = pollsRes.data;

        // 3. Security Check
        const hasVotedIncategory = categoryPolls.some(p => votedPollIds.includes(p.id));

        if (!hasVotedIncategory) {
          setIsLocked(true);
          setIsLoading(false);
          return;
        }

        setIsLocked(false);

        // 4. Fetch Results
        const resultsPromises = categoryPolls.map(p => getPollWithResults(p.slug));
        const resultsResponses = await Promise.all(resultsPromises);

        // 5. Structure the Raw Data
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

        // =========================================================
        // REAL-TIME MATH AGGREGATION
        // =========================================================

        let totalCategoryVotes = 0;
        let minMargin = 100;
        let mostCompetitiveName = 'N/A';
        
        // FIXED: Added 'type' to the aggregator definition so TypeScript knows what it is
        const uniAggregator = new Map<string, { 
          name: string; 
          shortName: string; 
          color: string; 
          votes: number; 
          id: string;
          type: 'Public' | 'Private'; 
        }>();

        processedPolls.forEach(poll => {
          totalCategoryVotes += poll.totalVotes;

          // A. Find Most Competitive Poll
          if (poll.results.length >= 2) {
            const first = poll.results[0];
            const second = poll.results[1];
            const margin = first.percentage - second.percentage;
            
            if (margin < minMargin) {
              minMargin = margin;
              mostCompetitiveName = poll.question;
            }
          }

          // B. Aggregate Votes for Podium
          poll.results.forEach(r => {
            const current = uniAggregator.get(r.universityId) || {
              name: r.universityName,
              shortName: r.universityShortName,
              color: r.universityColor,
              votes: 0,
              id: r.universityId,
              type: r.universityType // Capture the type here!
            };
            
            uniAggregator.set(r.universityId, {
              ...current,
              votes: current.votes + r.votes
            });
          });
        });

        // C. Calculate Final Ranks
        const sortedUnis = Array.from(uniAggregator.values())
          .sort((a, b) => b.votes - a.votes);

        // Convert back to PollResult format for the Podium Component
        const overallLeaderboard: PollResult[] = sortedUnis.map((uni, index) => ({
          universityId: uni.id,
          universityName: uni.name,
          universityShortName: uni.shortName,
          universityColor: uni.color,
          votes: uni.votes,
          percentage: totalCategoryVotes > 0 ? (uni.votes / totalCategoryVotes) * 100 : 0,
          rank: index + 1,
          pollId: 'aggregate',
          pollQuestion: 'Category Overall',
          category: targetCategory,
          cycleMonth: 'Current',
          universityType: uni.type // FIXED: Uses the captured type
        })).slice(0, 3);

        // D. Determine Rising Star
        const risingStarName = sortedUnis.length > 2 
          ? sortedUnis[2].name 
          : (sortedUnis.length > 1 ? sortedUnis[1].name : 'Pending Data');

        setCategoryData({
          polls: processedPolls,
          topResults: overallLeaderboard,
          totalVotes: totalCategoryVotes,
          mostCompetitive: mostCompetitiveName,
          risingStar: risingStarName,
        });

      } catch (error) {
        console.error('Error calculating results:', error);
        showErrorToast('Failed to load category analysis');
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [category, showErrorToast]);

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
          <p className="text-slate-400 animate-pulse">Aggregating Sector Intelligence...</p>
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
            
            {/* 1. Hero Summary (Real Data) */}
            <CategorySummary 
              category={category as PollCategory}
              topPollResults={categoryData.topResults}
              totalVotes={categoryData.totalVotes}
              mostCompetitivePoll={categoryData.mostCompetitive}
              risingStar={categoryData.risingStar}
            />

            <SectionDivider label="Detailed Breakdown" />

            {/* 2. Full Grid (Real Data) */}
            <ResultsGrid 
              polls={categoryData.polls} 
              onViewDetails={(pollId) => {
                // Assuming we can navigate by ID, or if you need slugs, 
                // you might need to update the data interface to include 'slug' from the API.
                // For now, ID is used.
                navigate(`/poll/${pollId}`); 
              }} 
              userVotedPollIds={getVotedPolls()}
            />

          </div>
        )}

      </PageContainer>
    </AppLayout>
  );
};