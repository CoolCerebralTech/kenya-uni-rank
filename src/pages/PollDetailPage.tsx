import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';

// Visualization
import { RaceTrack } from '../components/racing/RaceTrack';
import { TrendChart } from '../components/results/TrendChart';
import { PieChart } from '../components/analytics/PieChart';
import { ShareButton } from '../components/results/ShareButton';
import { MiniRacePreview } from '../components/racing/MiniRacePreview';

// Services
import { getPollWithResults, checkIfVoted } from '../services/voting.service';
import { getActivePolls } from '../services/poll.service';
import type { Poll, PollResult } from '../types/models';
import { ArrowLeft, Clock, Users, TrendingUp, Info } from 'lucide-react';

export const PollDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Related Polls
  const [relatedPolls, setRelatedPolls] = useState<Array<{ poll: Poll; results: PollResult[] }>>([]);

  // Mock Data for Charts (In real app, fetch from specific analytics endpoint)
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

  // --- INITIALIZATION ---
  useEffect(() => {
    const loadPollData = async () => {
      if (!slug) return;
      setIsLoading(true);

      try {
        // 1. Fetch Poll & Results
        const response = await getPollWithResults(slug);
        
        if (!response.success || !response.data || !response.data.poll) {
          navigate('/404');
          return;
        }

        const currentPoll = response.data.poll;
        setPoll(currentPoll);
        setResults(response.data.results);
        setTotalVotes(response.data.totalVotes);

        // 2. Check Vote Status
        const voted = await checkIfVoted(currentPoll.id);
        setHasVoted(voted);

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
      } finally {
        setIsLoading(false);
      }
    };

    loadPollData();
  }, [slug, navigate]);

  // --- RENDER ---

  if (isLoading || !poll) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Spinner size="xl" variant="accent" />
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
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="neon" className="uppercase tracking-widest text-[10px]">
                  {poll.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={12} /> Live Cycle
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight max-w-3xl">
                {poll.question}
              </h1>
            </div>

            <ShareButton title={poll.question} />
          </div>
        </div>

        {/* --- MAIN RACE TRACK --- */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <RaceTrack 
            results={results}
            totalVotes={totalVotes}
            userHasVoted={hasVoted}
            onVoteClick={() => navigate(`/vote/${poll.category}`)} // Redirect to voting flow
          />
        </div>

        {/* --- INSIGHTS (LOCKED UNTIL VOTED) --- */}
        {hasVoted && (
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
          <div>
            <SectionDivider label="Related Battles" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPolls.map((item) => (
                <MiniRacePreview 
                  key={item.poll.id}
                  slug={item.poll.slug}
                  question={item.poll.question}
                  results={item.results}
                  totalVotes={item.results.reduce((a,b) => a + b.votes, 0)}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- FOOTER CTA (If Voted) --- */}
        {hasVoted && (
          <div className="mt-16 text-center">
            <p className="text-slate-400 mb-4">Want to influence other categories?</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/polls')}
              className="shadow-lg shadow-blue-900/20"
            >
              Find More Battles
            </Button>
          </div>
        )}

      </PageContainer>
    </AppLayout>
  );
};