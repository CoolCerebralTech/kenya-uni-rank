import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/FullScreenLoader';

// Visualization
import { RaceTrack } from '../components/racing/RaceTrack';
import { TrendChart } from '../components/results/TrendChart';
import { PieChart } from '../components/analytics/PieChart';
import { ShareButton } from '../components/results/ShareButton';
import { MiniRacePreview } from '../components/racing/MiniRacePreview';
import { LockedResultsCard } from '../components/voting/LockedResultsCard';

// Services
import { getPollWithResults, checkIfVoted } from '../services/voting.service';
import { getActivePolls } from '../services/poll.service';
import { getPollVoteHistory, getPollVoterDemographics } from '../services/analytics.service';
import { useFingerprint } from '../hooks/useFingerprint';
import { useToast } from '../hooks/useToast';
import type { Poll, PollResult } from '../types/models';
import { ArrowLeft, Users, TrendingUp, Info, Vote, Lock } from 'lucide-react';

export const PollDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isReady: isFingerprintReady } = useFingerprint();
  const { showErrorToast } = useToast();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [relatedPolls, setRelatedPolls] = useState<Array<{ poll: Poll; results: PollResult[] }>>([]);
  
  // Chart Data State
  const [historyData, setHistoryData] = useState<{ label: string; value: number }[]>([]);
  const [demographicData, setDemographicData] = useState<{ label: string; value: number; color: string }[]>([]);

  // 🔥 FIX: Don't memoize - just use useEffect properly
  useEffect(() => {
    if (!slug || !isFingerprintReady) {
      console.log('[PollDetail] Waiting for slug or fingerprint...', { slug, isFingerprintReady });
      return;
    }
    
    let isMounted = true;
    
    const loadPollData = async () => {
      console.log('[PollDetail] Loading poll data for slug:', slug);
      setIsLoading(true);

      try {
      // 🔥 FIX: Fetch all critical data in parallel
      // checkIfVoted now handles slug → UUID conversion internally
      const [mainRes, votedStatusRes] = await Promise.all([
        getPollWithResults(slug),
        checkIfVoted(slug) // Now accepts slugs!
      ]);
      
      console.log('[PollDetail] Main response:', mainRes);
      console.log('[PollDetail] Voted status:', votedStatusRes);

      if (!mainRes.success || !mainRes.data || !mainRes.data.poll) {
        throw new Error(mainRes.error || 'Poll not found');
      }

      const currentPoll = mainRes.data.poll;
      setPoll(currentPoll);
      setResults(mainRes.data.results || []);
      setTotalVotes(mainRes.data.totalVotes || 0);
      setHasVoted(votedStatusRes);

      console.log('[PollDetail] Poll loaded:', currentPoll.question);
      console.log('[PollDetail] Has voted:', votedStatusRes);

      // Fetch non-critical data after main content is ready (only if voted)
      if (votedStatusRes && currentPoll) {
        console.log('[PollDetail] Fetching analytics data...');
        const [historyRes, demographicsRes] = await Promise.all([
          getPollVoteHistory(currentPoll.id),
          getPollVoterDemographics(currentPoll.id)
        ]);
        
        if (historyRes.success && historyRes.data) {
          console.log('[PollDetail] History data loaded:', historyRes.data.length, 'points');
          setHistoryData(historyRes.data);
        }
        
        if (demographicsRes.success && demographicsRes.data) {
          console.log('[PollDetail] Demographics loaded:', demographicsRes.data.length, 'segments');
          setDemographicData(demographicsRes.data);
        }
      }
      
      // Fetch related polls
      if (currentPoll) {
        console.log('[PollDetail] Fetching related polls in category:', currentPoll.category);
        const relatedRes = await getActivePolls(currentPoll.category);
        
        if (relatedRes.success && relatedRes.data) {
          const others = relatedRes.data
            .filter(p => p.id !== currentPoll.id)
            .slice(0, 3);
          
          console.log('[PollDetail] Found', others.length, 'related polls');
          
          const relatedData = await Promise.all(
            others.map(async (p) => {
              const res = await getPollWithResults(p.slug);
              return { 
                poll: p, 
                results: res.data?.results || [] 
              };
            })
          );
          
          setRelatedPolls(relatedData);
        }
      }

    } catch (error) {
      console.error('[PollDetail] Error loading poll:', error);
      if (isMounted) {
        showErrorToast((error as Error).message || 'Failed to load poll data');
        navigate('/404');
      }
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

    loadPollData();

    return () => { 
      isMounted = false;
    };
  }, [slug, isFingerprintReady]); // 🔥 FIX: Only depend on slug and fingerprint

  const handleVoteClick = useCallback(() => {
    if (poll) {
      console.log('[PollDetail] Navigating to vote page:', poll.category);
      navigate(`/vote/${poll.category}`);
    }
  }, [poll, navigate]);

  // Memoize expensive computations
  const shouldShowAnalytics = useMemo(() => {
    return hasVoted && results.length > 0;
  }, [hasVoted, results.length]);

  if (isLoading || !poll) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
          <Spinner size="xl" variant="accent" />
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Loading the battle…</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8">

        {/* HEADER */}
        <header>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <Badge variant="neon" className="uppercase mb-3">{poll.category}</Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug">
                {poll.question}
              </h1>
              {poll.description && (
                <p className="text-slate-400 text-sm mt-2 max-w-xl">{poll.description}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <ShareButton title={poll.question} />
              {!hasVoted && (
                <Button variant="primary" onClick={handleVoteClick} leftIcon={<Vote size={16} />}>
                  Vote Now
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* STATUS BANNER */}
        {hasVoted ? (
          <div className="p-4 rounded-xl glass border border-emerald-500/30 flex items-center gap-3 animate-fade-in-up">
            <Vote size={16} className="text-emerald-400 shrink-0" />
            <p className="text-sm font-medium text-white">You've voted in this battle. Results unlocked.</p>
          </div>
        ) : (
          <div className="p-4 rounded-xl glass border border-amber-500/30 flex items-center gap-3">
            <Lock size={16} className="text-amber-400 shrink-0" />
            <p className="text-sm font-medium text-white flex-1">Results are locked. Vote to see the community's truth.</p>
            <Button variant="secondary" size="sm" onClick={handleVoteClick}>Vote to Unlock</Button>
          </div>
        )}

        {/* MAIN RACE TRACK */}
        <div>
          {hasVoted ? (
            <RaceTrack results={results} totalVotes={totalVotes} userHasVoted={true} />
          ) : (
            <LockedResultsCard onVoteClick={handleVoteClick} />
          )}
        </div>

        {/* INSIGHTS */}
        {shouldShowAnalytics && (
          <section>
            <SectionDivider label="Deep dive analysis" icon={<Info size={14} />} variant="neon" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
              <Card className="lg:col-span-2">
                <h3 className="font-bold text-white flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                  <TrendingUp size={16} className="text-cyan-400" /> Voting Momentum
                </h3>
                {historyData.length > 0 ? (
                  <TrendChart data={historyData} />
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                    Not enough data yet
                  </div>
                )}
              </Card>
              <Card>
                <h3 className="font-bold text-white flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                  <Users size={16} className="text-violet-400" /> Voter Types
                </h3>
                {demographicData.length > 0 ? (
                  <PieChart data={demographicData} size={180} />
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
                    Collecting data…
                  </div>
                )}
              </Card>
            </div>
          </section>
        )}

        {/* RELATED BATTLES */}
        {relatedPolls.length > 0 && (
          <section>
            <SectionDivider label="Related battles" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {relatedPolls.map(({ poll: relatedPoll, results: relatedResults }) => (
                <MiniRacePreview
                  key={relatedPoll.id}
                  slug={relatedPoll.slug}
                  question={relatedPoll.question}
                  results={relatedResults}
                  totalVotes={relatedResults.reduce((sum, r) => sum + r.votes, 0)}
                />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="pt-4 text-center">
          <p className="text-slate-400 text-sm mb-4">
            {hasVoted ? 'Influence other categories?' : 'Your vote helps thousands of students.'}
          </p>
          <Button
            variant={hasVoted ? 'secondary' : 'primary'}
            onClick={() => navigate(hasVoted ? '/polls' : `/vote/${poll.category}`)}
          >
            {hasVoted ? 'Find More Battles' : 'Cast Your Vote Now'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};