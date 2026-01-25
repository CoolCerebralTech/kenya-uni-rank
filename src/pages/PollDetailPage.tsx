// src/pages/PollDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
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
import { useFingerprint } from '../hooks/useFingerprint';
import { useToast } from '../hooks/useToast';
import type { Poll, PollResult } from '../types/models';
import { ArrowLeft, Clock, Users, TrendingUp, Info, Vote, Lock } from 'lucide-react';

export const PollDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isReady: isFingerprintReady } = useFingerprint();
  const { showErrorToast } = useToast();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isCheckingVote, setIsCheckingVote] = useState(false);
  
  // Related Polls
  const [relatedPolls, setRelatedPolls] = useState<Array<{ poll: Poll; results: PollResult[] }>>([]);

  // Mock Data for Charts (In production, fetch from analytics service)
  const historyData = [
    { label: 'Day 1', value: 20 },
    { label: 'Day 2', value: 45 },
    { label: 'Day 3', value: 55 },
    { label: 'Day 4', value: 80 },
    { label: 'Today', value: 100 },
  ];

  const demographicData = [
    { label: 'Students', value: 65, color: '#3b82f6' },
    { label: 'Alumni', value: 25, color: '#8b5cf6' },
    { label: 'Other', value: 10, color: '#64748b' },
  ];

  // --- LOAD POLL DATA ---
  useEffect(() => {
    const loadPollData = async () => {
      if (!slug || !isFingerprintReady) return;
      
      setIsLoading(true);

      try {
        // 1. Fetch Poll & Results
        const response = await getPollWithResults(slug);
        
        if (!response.success || !response.data || !response.data.poll) {
          showErrorToast('Poll not found');
          navigate('/404');
          return;
        }

        const currentPoll = response.data.poll;
        setPoll(currentPoll);
        setResults(response.data.results || []);
        setTotalVotes(response.data.totalVotes || 0);

        // 2. Check Vote Status
        setIsCheckingVote(true);
        const voted = await checkIfVoted(currentPoll.id);
        setHasVoted(voted);
        setIsCheckingVote(false);

        // 3. Load Related Polls (Same Category)
        const relatedRes = await getActivePolls(currentPoll.category);
        if (relatedRes.success && relatedRes.data) {
          // Filter out current, take 3
          const others = relatedRes.data
            .filter(p => p.id !== currentPoll.id)
            .slice(0, 3);
            
          // Get basic results for previews
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

      } catch (error) {
        console.error('Error loading poll details:', error);
        showErrorToast('Failed to load poll data');
      } finally {
        setIsLoading(false);
      }
    };

    loadPollData();
  }, [slug, isFingerprintReady, navigate, showErrorToast]);

  // --- HANDLERS ---
  const handleVoteClick = () => {
    if (poll) {
      navigate(`/vote/${poll.category}`);
    }
  };

  // --- RENDER STATES ---
  if (!isFingerprintReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="xl" variant="accent" />
      </div>
    );
  }

  if (isLoading || !poll) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" variant="accent" className="mb-4" />
          <p className="text-slate-400 animate-pulse">Loading poll data...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <PageContainer maxWidth="lg" title={poll.question}>
        
        {/* --- HEADER --- */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <Badge variant="neon" className="uppercase tracking-widest text-[10px]">
                  {poll.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={12} /> Cycle: {poll.cycleMonth || 'Current'}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Vote size={12} /> {totalVotes.toLocaleString()} votes
                </div>
                {isCheckingVote && (
                  <div className="text-xs text-amber-500 animate-pulse">
                    Checking vote status...
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {poll.question}
              </h1>
              {poll.description && (
                <p className="text-slate-400 mt-2">{poll.description}</p>
              )}
            </div>

            <div className="flex gap-2">
              <ShareButton title={poll.question} />
              {!hasVoted && (
                <Button 
                  variant="primary" 
                  onClick={handleVoteClick}
                  leftIcon={<Vote size={16} />}
                >
                  Vote Now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* --- VOTE STATUS BANNER --- */}
        {hasVoted ? (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800/30 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Vote size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">You've voted in this poll</p>
              <p className="text-xs text-green-400">Results unlocked below</p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-amber-900/20 border border-amber-800/30 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Lock size={16} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Results are locked</p>
              <p className="text-xs text-amber-400">Vote to see the community's choices</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleVoteClick}
            >
              Vote to Unlock
            </Button>
          </div>
        )}

        {/* --- MAIN RACE TRACK --- */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {hasVoted ? (
            <RaceTrack 
              results={results}
              totalVotes={totalVotes}
              userHasVoted={true}
              onVoteClick={handleVoteClick}
            />
          ) : (
            <LockedResultsCard onVoteClick={handleVoteClick} />
          )}
        </div>

        {/* --- INSIGHTS (ONLY IF VOTED) --- */}
        {hasVoted && results.length > 0 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <SectionDivider label="Deep Dive Analysis" icon={<Info size={16} />} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Trend Chart */}
              <Card className="md:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-cyan-400" /> Voting Momentum
                  </h3>
                  <Badge variant="success" dot>High Activity</Badge>
                </div>
                <TrendChart data={historyData} />
              </Card>

              {/* Demographics */}
              <Card>
                <h3 className="font-bold text-white flex items-center gap-2 mb-6">
                  <Users size={18} className="text-purple-400" /> Voter Types
                </h3>
                <div className="flex justify-center pb-4">
                  <PieChart data={demographicData} size={180} />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* --- RELATED POLLS --- */}
        {relatedPolls.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <SectionDivider label="Related Battles" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPolls.map((item) => (
                <MiniRacePreview 
                  key={item.poll.id}
                  slug={item.poll.slug}
                  question={item.poll.question}
                  results={item.results}
                  totalVotes={item.results.reduce((sum, result) => sum + result.votes, 0)}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- FOOTER CTA --- */}
        <div className="mt-16 text-center">
          {hasVoted ? (
            <>
              <p className="text-slate-400 mb-4">Want to influence other categories?</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/polls')}
                className="shadow-lg shadow-blue-900/20"
              >
                Find More Battles
              </Button>
            </>
          ) : (
            <>
              <p className="text-slate-400 mb-4">Your honest vote helps thousands of students</p>
              <Button 
                variant="neon" 
                onClick={handleVoteClick}
                leftIcon={<Vote size={16} />}
                className="shadow-lg shadow-cyan-900/20"
              >
                Cast Your Vote Now
              </Button>
            </>
          )}
        </div>

      </PageContainer>
    </AppLayout>
  );
};