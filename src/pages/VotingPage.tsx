import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/FullScreenLoader';
import { EmptyState } from '../components/ui/EmptyState';

// Voting Components
import { PollProgress } from '../components/voting/PollProgress';
import { UniversityGrid } from '../components/voting/UniversityGrid';
import { VoteConfirmation } from '../components/voting/VoteConfirmation';
import { AlreadyVotedBadge } from '../components/voting/AlreadyVotedBadge';
import { LockedResultsCard } from '../components/voting/LockedResultsCard';

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
import { ArrowRight, Trophy, Zap } from 'lucide-react';

export const VotingPage: React.FC = () => {
  const { category = 'vibes' } = useParams<{ category: string }>();
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

  const loadPollData = useCallback(async (pollToLoad: PollWithStatus) => {
    if (!pollToLoad.userHasVoted) {
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
      } else {
        showErrorToast('Could not load poll results.');
      }
    } finally {
      setIsLoadingResults(false);
    }
  }, [showErrorToast]);

  useEffect(() => {
    const loadCategoryPolls = async () => {
      setIsLoading(true);
      const response = await getPollsForVoting(category as PollCategory);
      
      if (response.success && response.data) {
        setPolls(response.data);
        if (response.data.length > 0) {
          const firstUnvotedIndex = response.data.findIndex(p => !p.userHasVoted);
          const startIndex = firstUnvotedIndex !== -1 ? firstUnvotedIndex : 0;
          setCurrentPollIndex(startIndex);
          await loadPollData(response.data[startIndex]);
        }
      } else {
        showErrorToast(response.error || 'Failed to load polls.');
      }
      setIsLoading(false);
    };

    if (isFingerprintReady) {
      loadCategoryPolls();
    }
  }, [category, isFingerprintReady, showErrorToast, loadPollData]);

  const navigateToPoll = useCallback((index: number) => {
    if (index >= 0 && index < polls.length) {
      setCurrentPollIndex(index);
      setSelectedUniId(null);
      setShowConfetti(false);
      loadPollData(polls[index]);
    }
  }, [polls, loadPollData]);

  const handleNext = () => navigateToPoll(currentPollIndex + 1);
  const handlePrev = () => navigateToPoll(currentPollIndex - 1);

  const handleSelectUni = (id: string) => {
    if (currentPoll?.userHasVoted || !isFingerprintReady) return;
    setSelectedUniId(id);
    setIsConfirmOpen(true);
  };

  const submitVote = async () => {
    if (!selectedUniId || !currentPoll || !fingerprint) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await castVote(currentPoll.id, selectedUniId, 'student');

      if (response.success) {
        showSuccessToast('Vote submitted!');
        setIsConfirmOpen(false);
        setShowConfetti(true);

        setPolls(prevPolls => prevPolls.map(p => 
          p.id === currentPoll.id ? { ...p, userHasVoted: true, userVotedFor: selectedUniId } : p
        ));
        
        const resultsRes = await getPollResultsById(currentPoll.id, true);
        if (resultsRes.success && resultsRes.data) {
          setResults(resultsRes.data.results);
          setTotalVotes(resultsRes.data.totalVotes);
        }
      } else {
        showErrorToast(response.error || 'Vote failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Spinner size="xl" /></div>;
  }

  if (!currentPoll) {
    return (
      <AppLayout>
        <PageContainer>
          <EmptyState title="No Active Battles" description={`There are no polls in the ${category} category.`} actionLabel="Return Home" onAction={() => navigate('/')} icon={<Trophy />} />
        </PageContainer>
      </AppLayout>
    );
  }

  const allVoted = polls.every(p => p.userHasVoted);
  const completionPercentage = polls.length > 0 ? (polls.filter(p => p.userHasVoted).length / polls.length) * 100 : 0;

  return (
    <AppLayout>
      <VoteConfetti isActive={showConfetti} color={selectedUniId ? getUniversityById(selectedUniId)?.color : undefined} />
      {allVoted && (
        <LevelUpToast category={category} xpGained={polls.length * 50} onDismiss={() => navigate('/')} onNext={() => navigate(`/results/${category}`)} />
      )}

      <div className="max-w-3xl mx-auto px-4">
        <PollProgress current={currentPollIndex + 1} total={polls.length} category={category} completionPercentage={completionPercentage} onBack={handlePrev} onSkip={handleNext} />
      </div>

      <PageContainer maxWidth="md" className="pt-4 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <Zap size={12} /> {currentPoll.category} Sector
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white">{currentPoll.question}</h1>
          {currentPoll.description && <p className="text-slate-400 mt-4">{currentPoll.description}</p>}
        </div>

        {currentPoll.userHasVoted ? (
          <div className="space-y-6">
            <AlreadyVotedBadge universityId={currentPoll.userVotedFor} onViewResults={() => navigate(`/poll/${currentPoll.slug}`)} />
            {isLoadingResults ? (
              <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-800/50 rounded-lg"></div>)}</div>
            ) : (
              <RaceTrack results={results} totalVotes={totalVotes} userHasVoted />
            )}
            <div className="flex justify-center">
              {currentPollIndex < polls.length - 1 ? (
                <Button variant="secondary" onClick={handleNext} rightIcon={<ArrowRight />} className="animate-pulse">Next Battle</Button>
              ) : (
                <Button variant="primary" onClick={() => navigate(`/results/${category}`)}>View Results</Button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <UniversityGrid universities={universities} selectedId={selectedUniId} onSelect={handleSelectUni} />
            <div className="mt-8"><LockedResultsCard onVoteClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} /></div>
          </div>
        )}

        <div className="mt-12 text-center text-xs text-slate-600">
          Fingerprint: {fingerprint?.substring(0, 8)}... • Cycle: {currentPoll.cycleMonth || 'Current'}
        </div>
      </PageContainer>

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