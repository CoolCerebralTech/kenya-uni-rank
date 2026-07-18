import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/FullScreenLoader';
import { EmptyState } from '../components/ui/EmptyState';

// Voting Components
import { UniversityGrid } from '../components/voting/UniversityGrid';
import { VoteConfirmation } from '../components/voting/VoteConfirmation';

// Racing & Gamification
import { RaceTrack } from '../components/racing/RaceTrack';
import { VoteConfetti } from '../components/gamification/VoteConfetti';
import { LevelUpToast } from '../components/gamification/LevelUpToast';

// Services & Data
import { castVote, getPollResultsById, getPollsForVoting, type PollWithStatus } from '../services/voting.service';
import { getAllUniversitiesSync, getUniversityById } from '../services/university.service';
import { useFingerprint } from '../hooks/useFingerprint';
import { useToast } from '../hooks/useToast';
import type { PollCategory, PollResult } from '../types/models';
import { ArrowRight, ArrowLeft, Zap, Trophy, Lock } from 'lucide-react';

// Demo fallback for polls (so VotingFlow always has content)
import { isPureDemo, demoHasVoted } from '../lib/demoFallback';
import { getDemoPollsByCategory, getDemoResultsForPoll } from '../lib/demoData';

// Build an enriched PollWithStatus shape using demo data when Supabase falls back.
function buildDemoPollsWithStatus(category: PollCategory): PollWithStatus[] {
  const polls = getDemoPollsByCategory(category);
  return polls.map(p => ({
    ...p,
    userHasVoted: demoHasVoted(p.id),
    userVotedFor: undefined,
  }));
}

export const VotingPage: React.FC = () => {
  const { category = 'general' } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const { fingerprint, isReady: isFingerprintReady } = useFingerprint();
  const { showSuccessToast, showErrorToast } = useToast();

  const [polls, setPolls] = useState<PollWithStatus[]>([]);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [results, setResults] = useState<PollResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const universities = getAllUniversitiesSync();
  const currentPoll = polls[currentPollIndex];
  const hasLoadedInitial = React.useRef(false);

  // Load results for a given poll
  const loadPollData = useCallback(async (pollToLoad: PollWithStatus) => {
    if (!pollToLoad.userHasVoted) {
      // For demo polls, we can still compute naive results pre-vote to display
      // a tasteful "preview" race before they vote? No — keep locked-results UX.
      setResults([]);
      setTotalVotes(0);
      return;
    }
    setIsLoadingResults(true);
    try {
      const resultsRes = await getPollResultsById(pollToLoad.id);
      if (resultsRes.success && resultsRes.data) {
        setResults(resultsRes.data.results);
        setTotalVotes(resultsRes.data.totalVotes);
      } else if (isPureDemo) {
        // Demo fallback: directly pull from demoData
        const agg = getDemoResultsForPoll(pollToLoad.id);
        setResults(agg.results);
        setTotalVotes(agg.totalVotes);
      }
    } catch (e) {
      console.error(e);
      // Fallback surface: demo data
      if (isPureDemo) {
        const agg = getDemoResultsForPoll(pollToLoad.id);
        setResults(agg.results);
        setTotalVotes(agg.totalVotes);
      }
    } finally {
      setIsLoadingResults(false);
    }
  }, []);

  // Main load
  useEffect(() => {
    let isMounted = true;

    const loadCategoryPolls = async () => {
      if (!hasLoadedInitial.current) setIsLoading(true);
      try {
        const response = await getPollsForVoting(category as PollCategory);

        if (!isMounted) return;

        let resolvedPolls: PollWithStatus[] = [];
        if (response.success && response.data && response.data.length > 0) {
          resolvedPolls = response.data;
        } else {
          // Fall back to demo polls (graceful degradation when Supabase fails)
          resolvedPolls = buildDemoPollsWithStatus(category as PollCategory);
        }

        setPolls(resolvedPolls);

        if (!hasLoadedInitial.current && resolvedPolls.length > 0) {
          const firstUnvotedIndex = resolvedPolls.findIndex(p => !p.userHasVoted);
          const startIndex = firstUnvotedIndex !== -1 ? firstUnvotedIndex : 0;
          setCurrentPollIndex(startIndex);
          await loadPollData(resolvedPolls[startIndex]);
        }
        hasLoadedInitial.current = true;
      } catch (err) {
        console.error(err);
        // Final fallback
        const demoPolls = buildDemoPollsWithStatus(category as PollCategory);
        setPolls(demoPolls);
        if (demoPolls.length > 0) {
          const startIndex = demoPolls.findIndex(p => !p.userHasVoted);
          const actualStart = startIndex !== -1 ? startIndex : 0;
          setCurrentPollIndex(actualStart);
          await loadPollData(demoPolls[actualStart]);
        }
        hasLoadedInitial.current = true;
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (isFingerprintReady) loadCategoryPolls();
    return () => { isMounted = false; };
  }, [category, isFingerprintReady, loadPollData]);

  // Navigation
  const navigateToPoll = (index: number) => {
    if (index >= 0 && index < polls.length) {
      setCurrentPollIndex(index);
      setSelectedUniId(null);
      setShowConfetti(false);
      loadPollData(polls[index]);
    }
  };
  const handleNext = () => navigateToPoll(currentPollIndex + 1);
  const handlePrev = () => navigateToPoll(currentPollIndex - 1);

  // Vote interactions
  const handleSelectUni = (id: string) => {
    if (currentPoll?.userHasVoted) return;
    setSelectedUniId(id);
    setIsConfirmOpen(true);
  };

  const submitVote = async () => {
    if (!selectedUniId || !currentPoll) {
      showErrorToast("Please select a university first.");
      return;
    }
    if (!fingerprint) {
      showErrorToast("Secure ID not ready. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await castVote(currentPoll.id, selectedUniId, 'student');
      if (response.success) {
        showSuccessToast('Vote accepted. Decrypting standings…');
        setIsConfirmOpen(false);
        setShowConfetti(true);

        // Optimistic local vote state
        setPolls(prev => prev.map(p =>
          p.id === currentPoll.id
            ? { ...p, userHasVoted: true, userVotedFor: selectedUniId }
            : p
        ));

        // Fetch fresh results
        const resultsRes = await getPollResultsById(currentPoll.id, true);
        if (resultsRes.success && resultsRes.data) {
          setResults(resultsRes.data.results);
          setTotalVotes(resultsRes.data.totalVotes);
        } else if (isPureDemo) {
          const agg = getDemoResultsForPoll(currentPoll.id);
          setResults(agg.results);
          setTotalVotes(agg.totalVotes);
        }
      } else {
        showErrorToast(response.error || 'The system rejected your vote.');
      }
    } catch (error) {
      console.error('[Voting Flow] Fatal error:', error);
      showErrorToast('Connection failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- RENDER ----

  if (isLoading || !isFingerprintReady) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
          <Spinner size="xl" variant="accent" />
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Loading the battles…</p>
        </div>
      </AppLayout>
    );
  }

  if (polls.length === 0) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 pt-10">
          <EmptyState
            title="No active battles"
            description={`The ${category} sector is quiet right now.`}
            actionLabel="Back home"
            onAction={() => navigate('/')}
            icon={<Trophy />}
          />
        </div>
      </AppLayout>
    );
  }

  const allVoted = polls.every(p => p.userHasVoted);
  const completionPercentage = (polls.filter(p => p.userHasVoted).length / polls.length) * 100;
  const totalPolls = polls.length;
  const votedCount = polls.filter(p => p.userHasVoted).length;

  return (
    <AppLayout>
      {/* Confetti for successful vote */}
      <VoteConfetti
        isActive={showConfetti}
        color={selectedUniId ? (getUniversityById(selectedUniId)?.color) : undefined}
      />

      {/* Level-up toast when category is fully completed */}
      {allVoted && (
        <LevelUpToast
          category={category}
          onDismiss={() => navigate('/')}
          onNext={() => navigate(`/results/${category}`)}
        />
      )}

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">

        {/* Progress header */}
        <div className="mb-6 sm:mb-8">
          {/* Top row: back / page title / skip */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              onClick={handlePrev}
              disabled={currentPollIndex === 0}
              className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentPollIndex === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowLeft size={14} />
              Prev
            </button>

            <div className="text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.18em] font-bold">Battle</span>
              <div className="font-mono tabular text-sm text-white font-bold">
                {currentPollIndex + 1}<span className="text-slate-600">/{totalPolls}</span>
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={currentPollIndex === totalPolls - 1}
              className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                currentPollIndex === totalPolls - 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white'
              }`}
            >
              Skip
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono tabular uppercase tracking-wider">
            <span>{votedCount} voted</span>
            <span>{totalPolls - votedCount} left</span>
          </div>
        </div>

        {/* The poll question */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/60 border border-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">
            <Zap size={11} className="text-cyan-400" />
            {currentPoll.category} sector
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight px-2">
            {currentPoll.question}
          </h1>
          {currentPoll.description && (
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">{currentPoll.description}</p>
          )}
        </div>

        {/* Voting grid / Race results */}
        {currentPoll.userHasVoted ? (
          <div className="space-y-6 animate-fade-in-up">
            {/* Already voted badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider w-fit mx-auto">
              <Lock size={12} />
              You've cast your vote
            </div>

            {isLoadingResults ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-slate-800/40 rounded-xl" />
                ))}
              </div>
            ) : (
              <RaceTrack
                results={results}
                totalVotes={totalVotes}
                userHasVoted={true}
                onVoteClick={() => {}}
              />
            )}

            <div className="flex justify-center pt-2">
              {currentPollIndex < polls.length - 1 ? (
                <Button variant="primary" onClick={handleNext} rightIcon={<ArrowRight size={16} />}>
                  Next Battle
                </Button>
              ) : (
                <Button variant="success" onClick={() => navigate(`/results/${category}`)} leftIcon={<Trophy size={16} />}>
                  View Full Rankings
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up space-y-6">
            <UniversityGrid
              universities={universities}
              selectedId={selectedUniId}
              onSelect={handleSelectUni}
              onVote={handleSelectUni}
            />

            {/* Locked results teaser */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 to-slate-950/40 p-5 text-center">
              <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 mb-3">
                  <Lock size={16} className="text-amber-300" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Results locked</h3>
                <p className="text-xs text-slate-500 mb-0">Cast your vote to reveal the live standings.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm sheet */}
      <VoteConfirmation
        isOpen={isConfirmOpen}
        university={selectedUniId ? (getUniversityById(selectedUniId) || null) : null}
        isSubmitting={isSubmitting}
        onConfirm={submitVote}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </AppLayout>
  );
};
