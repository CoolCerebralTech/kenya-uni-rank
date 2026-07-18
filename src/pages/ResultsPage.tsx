import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
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

// Demo fallback
import { getDemoPollsByCategory, getDemoResultsForPoll } from '../lib/demoData';
import { isPureDemo, demoHasVoted } from '../lib/demoFallback';

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

  const votedPollIds = useMemo(() => getVotedPolls(), []);
  const [status, setStatus] = useState<PageStatus>('loading');
  const [data, setData] = useState<CategoryData | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setStatus('loading');
      const targetCategory = category as PollCategory;

      try {
        const [pollsRes, resultsRes] = await Promise.all([
          getActivePolls(targetCategory),
          getCategoryResults(targetCategory),
        ]);

        if (!isMounted) return;

        // Resolve polls
        let polls = (pollsRes.success && pollsRes.data && pollsRes.data.length > 0)
          ? pollsRes.data
          : (isPureDemo ? getDemoPollsByCategory(targetCategory) : []);

        if (polls.length === 0) {
          setStatus('empty');
          return;
        }

        // Access control — In demo mode, treat any userHasVoted anywhere as unlocked
        const hasVotedInCategory = isPureDemo
          ? polls.some(p => demoHasVoted(p.id))
          : polls.some(p => votedPollIds.includes(p.id));

        if (!hasVotedInCategory) {
          setStatus('locked');
          return;
        }

        // Process results — try Supabase first, fall back to demo
        let allResults: PollResult[] = [];
        if (resultsRes.success && resultsRes.data && resultsRes.data.length > 0) {
          allResults = resultsRes.data;
        } else if (isPureDemo) {
          // Aggregate all demo poll results for this category
          polls.forEach(p => {
            const agg = getDemoResultsForPoll(p.id);
            allResults.push(...agg.results);
          });
        }

        if (allResults.length === 0) {
          setStatus('empty');
          return;
        }

        // Filter + dedupe
        const validResults = allResults.filter(r =>
          r.pollId && r.universityId && r.universityName &&
          r.universityColor && r.universityShortName &&
          typeof r.votes === 'number' && !isNaN(r.votes) &&
          typeof r.percentage === 'number' && !isNaN(r.percentage)
        );

        const dedupeMap = new Map<string, PollResult>();
        validResults.forEach(r => {
          const key = `${r.pollId}-${r.universityId}`;
          if (!dedupeMap.has(key)) dedupeMap.set(key, r);
        });

        // Group by poll
        const pollsMap = new Map<string, GroupedPoll>();
        dedupeMap.forEach(r => {
          if (!pollsMap.has(r.pollId)) {
            pollsMap.set(r.pollId, {
              id: r.pollId,
              question: r.pollQuestion,
              category: r.category,
              totalVotes: 0,
              results: [],
            });
          }
          const p = pollsMap.get(r.pollId)!;
          p.results.push(r);
          p.totalVotes += r.votes;
        });

        // Top 3 overall
        const uniStats = new Map<string, PollResult>();
        dedupeMap.forEach(r => {
          const curr = uniStats.get(r.universityId) || { ...r, votes: 0 };
          uniStats.set(r.universityId, { ...curr, votes: curr.votes + r.votes });
        });
        const topResults = Array.from(uniStats.values())
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 3);

        const pollsArray = Array.from(pollsMap.values());
        const totalVotes = pollsArray.reduce((sum, p) => sum + p.totalVotes, 0);

        const newData: CategoryData = {
          polls: pollsArray,
          topResults,
          totalVotes,
          mostCompetitive: pollsArray[0]?.question || 'Active Sector',
          risingStar: topResults[2]?.universityName || topResults[0]?.universityName || 'New Entry',
        };

        if (isMounted) {
          setData(newData);
          setStatus('ready');
        }
      } catch (err) {
        console.error('[ResultsPage] Error:', err);
        if (isMounted) setStatus('empty');
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [category, votedPollIds]);

  const categories = useMemo(() => [
    { id: 'vibes', label: 'Vibes' },
    { id: 'academics', label: 'Academics' },
    { id: 'sports', label: 'Sports' },
    { id: 'social', label: 'Social' },
    { id: 'facilities', label: 'Facilities' },
  ], []);

  const handleBackClick = useMemo(() => () => navigate('/'), [navigate]);
  const handleTabChange = useMemo(() => (id: string) => navigate(`/results/${id}`), [navigate]);
  const handleViewDetails = useMemo(() => (id: string) => navigate(`/poll/${id}`), [navigate]);
  const handleVoteClick = useMemo(() => () => navigate(`/vote/${category}`), [navigate, category]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
            <Spinner size="xl" variant="accent" />
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
              Decrypting sector intel…
            </p>
          </div>
        );

      case 'locked':
        return (
          <div className="max-w-2xl mx-auto py-10 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl glass border border-red-500/30 flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Lock className="text-red-400" size={28} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 uppercase tracking-tight">
              Sector Encrypted
            </h2>
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
              Vote in the <strong className="text-cyan-300">{category}</strong> sector to unlock live standings.
            </p>
            <LockedResultsCard onVoteClick={handleVoteClick} />
          </div>
        );

      case 'ready':
        return data ? (
          <div className="space-y-8 animate-fade-in-up">
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
            <p className="text-slate-500 text-sm">No data available for this sector yet.</p>
            <Button className="mt-4" onClick={handleBackClick}>Return Home</Button>
          </div>
        );
    }
  };

  return (
    <AppLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* HEADER */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={handleBackClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              <ArrowLeft size={14} /> Back to HQ
            </button>
            <div className="flex items-center gap-2">
              <Badge variant="neon">Sector Intel</Badge>
              {status === 'ready' && (
                <Button variant="ghost" size="sm" leftIcon={<Share2 size={14} />}>
                  <span className="hidden sm:inline">Export</span>
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto no-scrollbar border-b border-slate-800/50 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Tabs
              tabs={categories}
              activeTab={category}
              onChange={handleTabChange}
              variant="pills"
            />
          </div>
        </header>

        {renderContent()}
      </div>
    </AppLayout>
  );
};
