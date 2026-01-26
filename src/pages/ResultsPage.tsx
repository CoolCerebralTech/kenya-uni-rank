import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/FullScreenLoader';
import { Tabs } from '../components/ui/Tabs';

// Visualization
import { CategorySummary } from '../components/results/CategorySummary';
import { ResultsGrid } from '../components/results/ResultsGrid';
import { LockedResultsCard } from '../components/voting/LockedResultsCard';

// Services
import { getActivePolls } from '../services/poll.service';
import { getCategoryResults } from '../services/analytics.service';
import { getVotedPolls } from '../services/storage.service';

// Types
import type { PollCategory, PollResult } from '../types/models';
import { Lock, ArrowLeft, Share2 } from 'lucide-react';

// --- TYPES ---
interface GroupedPoll {
  id: string;
  question: string;
  category: PollCategory;
  totalVotes: number;
  results: PollResult[];
}

interface CategoryData {
  polls: GroupedPoll[];
  topResults: PollResult[];
  totalVotes: number;
  mostCompetitive: string;
  risingStar: string;
}

type PageStatus = 'loading' | 'locked' | 'ready' | 'empty';

export const ResultsPage: React.FC = () => {
  const { category = 'vibes' } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // 🔥 FIX #1: Memoize votedPollIds to prevent new array on every render
  const votedPollIds = useMemo(() => getVotedPolls(), []);
  
  // State Machine: simpler and prevents impossible states (like loading AND locked)
  const [status, setStatus] = useState<PageStatus>('loading');
  
  // 🐛 DEBUG: Simple render log
  console.log(`🔄 [ResultsPage] RENDER - Category: ${category}, Status: ${status}`);
  const [data, setData] = useState<CategoryData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      console.log(`📥 [ResultsPage] Loading data for category: ${category}`);
      
      // 1. Start Loading
      setStatus('loading');
      
      const targetCategory = category as PollCategory;

      try {
        // 2. Fetch User Permissions & Poll Existence
        const [pollsRes, resultsRes] = await Promise.all([
          getActivePolls(targetCategory),
          getCategoryResults(targetCategory)
        ]);

        if (!isMounted) {
          console.log('⚠️ [ResultsPage] Component unmounted, aborting');
          return;
        }

        // 3. Handle "Empty" or "Error" cases
        if (!pollsRes.success || !pollsRes.data || pollsRes.data.length === 0) {
          console.log('❌ [ResultsPage] No polls found');
          setStatus('empty');
          return;
        }

        // 4. Check Access Control (Lock Logic)
        const hasVotedInCategory = pollsRes.data.some(p => votedPollIds.includes(p.id));

        if (!hasVotedInCategory) {
          console.log('🔒 [ResultsPage] User has not voted in this category');
          setStatus('locked');
          return;
        }

        // 5. Process Data if Unlocked
        if (!resultsRes.success || !resultsRes.data) {
          console.log('❌ [ResultsPage] No results data');
          setStatus('empty');
          return;
        }

        const allResults = resultsRes.data;
        console.log(`✅ [ResultsPage] Processing ${allResults.length} results`);

        // 🔥 COMPREHENSIVE FIX: Filter and deduplicate results
        const validResults = allResults.filter(r => {
          // Check all required fields exist
          const hasRequiredFields = !!(
            r.pollId &&
            r.universityId &&
            r.universityName &&
            r.universityColor &&
            r.universityShortName
          );
          
          // Check numeric fields are valid
          const hasValidNumbers = 
            typeof r.votes === 'number' && 
            !isNaN(r.votes) &&
            typeof r.percentage === 'number' && 
            !isNaN(r.percentage) &&
            typeof r.rank === 'number' && 
            !isNaN(r.rank) &&
            r.votes >= 0 &&
            r.percentage >= 0 &&
            r.rank > 0;
          
          const isValid = hasRequiredFields && hasValidNumbers;
          
          if (!isValid) {
            console.warn('⚠️ [ResultsPage] Filtered out invalid result:', {
              pollId: r.pollId,
              universityId: r.universityId,
              universityName: r.universityName,
              votes: r.votes,
              percentage: r.percentage,
              rank: r.rank,
              reason: !hasRequiredFields ? 'Missing fields' : 'Invalid numbers'
            });
          }
          
          return isValid;
        });

        // 🔥 FIX: Remove duplicate universities per poll (keep highest rank)
        const deduplicatedResults: PollResult[] = [];
        const seenKeys = new Set<string>();
        
        validResults.forEach(r => {
          const key = `${r.pollId}-${r.universityId}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            deduplicatedResults.push(r);
          } else {
            console.warn('⚠️ [ResultsPage] Removed duplicate:', {
              pollId: r.pollId,
              universityId: r.universityId
            });
          }
        });

        // Group by Poll ID
        const pollsMap = new Map<string, GroupedPoll>();
        deduplicatedResults.forEach(r => {
          if (!pollsMap.has(r.pollId)) {
            pollsMap.set(r.pollId, {
              id: r.pollId,
              question: r.pollQuestion,
              category: r.category,
              totalVotes: 0,
              results: []
            });
          }
          const p = pollsMap.get(r.pollId)!;
          p.results.push(r);
          p.totalVotes += r.votes;
        });

        // Calculate Podium
        const uniStats = new Map<string, PollResult>();
        deduplicatedResults.forEach(r => {
          const curr = uniStats.get(r.universityId) || { ...r, votes: 0 };
          uniStats.set(r.universityId, { ...curr, votes: curr.votes + r.votes });
        });

        const topResults = Array.from(uniStats.values())
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 3);

        const totalVotes = Array.from(pollsMap.values()).reduce((sum, p) => sum + p.totalVotes, 0);
        const pollsArray = Array.from(pollsMap.values());

        const newData: CategoryData = {
          polls: pollsArray,
          topResults,
          totalVotes,
          mostCompetitive: pollsArray[0]?.question || 'Active Sector',
          risingStar: topResults[2]?.universityName || topResults[0]?.universityName || 'New Entry'
        };

        console.log('✅ [ResultsPage] Data processed successfully:', {
          polls: newData.polls.length,
          topResults: newData.topResults.length,
          totalVotes: newData.totalVotes
        });

        // 🐛 DEBUG: Check for problematic poll data
        if (category === 'facilities') {
          console.log('🔍 [FACILITIES DEBUG] All polls:', newData.polls.map(p => ({
            id: p.id,
            question: p.question,
            resultsCount: p.results.length,
            hasInvalidData: p.results.some(r => 
              !r.universityId || 
              !r.universityName || 
              r.votes === undefined ||
              r.percentage === undefined
            )
          })));
        }

        setData(newData);
        setStatus('ready');

      } catch (err) {
        console.error("❌ [ResultsPage] Error:", err);
        if (isMounted) setStatus('empty');
      }
    };

    loadData();

    return () => { 
      isMounted = false;
      console.log('🧹 [ResultsPage] Cleanup');
    };
  }, [category, votedPollIds]);

  // --- TAB CONFIG ---
  const categories = useMemo(() => [
    { id: 'vibes', label: 'Vibes' },
    { id: 'academics', label: 'Academics' },
    { id: 'sports', label: 'Sports' },
    { id: 'social', label: 'Social' },
    { id: 'facilities', label: 'Facilities' },
  ], []);

  // 🔥 FIX #2: Memoize handlers to prevent re-creation
  const handleBackClick = useMemo(() => () => navigate('/'), [navigate]);
  const handleTabChange = useMemo(() => (id: string) => navigate(`/results/${id}`), [navigate]);
  const handleViewDetails = useMemo(() => (id: string) => navigate(`/poll/${id}`), [navigate]);
  const handleVoteClick = useMemo(() => () => navigate(`/vote/${category}`), [navigate, category]);

  // --- RENDER HELPERS ---
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center">
            <Spinner size="xl" variant="accent" className="mb-4" />
            <p className="text-slate-500 animate-pulse font-mono text-xs uppercase tracking-widest">Decrypting Sector Intel...</p>
          </div>
        );
      
      case 'locked':
        return (
          <div className="max-w-2xl mx-auto py-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Lock className="text-red-500" size={28} />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 italic uppercase">Sector Encrypted</h2>
            <p className="text-slate-400 mb-8">Vote in the <strong>{category}</strong> sector to unlock live standings.</p>
            <LockedResultsCard onVoteClick={handleVoteClick} />
          </div>
        );

      case 'ready':
        return data ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CategorySummary 
              category={category as PollCategory}
              topPollResults={data.topResults}
              totalVotes={data.totalVotes}
              mostCompetitivePoll={data.mostCompetitive}
              risingStar={data.risingStar}
            />
            <SectionDivider label="Sector Breakdown" />
            <ResultsGrid 
              polls={data.polls} 
              onViewDetails={handleViewDetails}
              userVotedPollIds={votedPollIds}
            />
          </div>
        ) : null;

      case 'empty':
      default:
        return (
          <div className="text-center py-20">
            <p className="text-slate-500">No data available for this sector yet.</p>
            <Button className="mt-4" onClick={handleBackClick}>Return Home</Button>
          </div>
        );
    }
  };

  return (
    <AppLayout>
      <PageContainer maxWidth="xl">
        <div className="mb-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button 
              type="button"
              onClick={handleBackClick}
              className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft size={14} /> Back to HQ
            </button>
            {status === 'ready' && <Button variant="ghost" size="sm" leftIcon={<Share2 size={16} />}>Export Data</Button>}
          </div>

          <div className="overflow-x-auto no-scrollbar border-b border-slate-800/50">
            <Tabs 
              tabs={categories} 
              activeTab={category} 
              onChange={handleTabChange}
              variant="pills" 
            />
          </div>
        </div>

        {renderContent()}

      </PageContainer>
    </AppLayout>
  );
};