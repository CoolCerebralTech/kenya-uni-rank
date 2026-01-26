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

  // Logic to load specific results for a poll
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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingResults(false);
    }
  }, []);

  // Main initial load
  useEffect(() => {
    let isMounted = true;

    const loadCategoryPolls = async () => {
      // Only show the big spinner on the very first load
      if (!hasLoadedInitial.current) {
        setIsLoading(true);
      }
      
      try {
        const response = await getPollsForVoting(category as PollCategory);
        
        if (!isMounted) return;

        if (response.success && response.data) {
          setPolls(response.data);
          
          // Only change index if we haven't set one yet
          if (!hasLoadedInitial.current && response.data.length > 0) {
            const firstUnvotedIndex = response.data.findIndex(p => !p.userHasVoted);
            const startIndex = firstUnvotedIndex !== -1 ? firstUnvotedIndex : 0;
            setCurrentPollIndex(startIndex);
            await loadPollData(response.data[startIndex]);
          }
          
          hasLoadedInitial.current = true; // Mark as done
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (isFingerprintReady) {
      loadCategoryPolls();
    }
    
    return () => { isMounted = false; };
  }, [category, isFingerprintReady, loadPollData]);
  // Handlers
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

  const handleSelectUni = (id: string) => {
    if (currentPoll?.userHasVoted) return;
    setSelectedUniId(id);
    setIsConfirmOpen(true);
  };

   const submitVote = async () => {
    // Debug logging
    console.log('[Voting Flow] Confirm clicked', { 
      selectedUniId, 
      pollId: currentPoll?.id, 
      fingerprint 
    });

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
        showSuccessToast('Intelligence accepted. Decrypting standings...');
        setIsConfirmOpen(false);
        setShowConfetti(true);

        // Optimistically update the local poll state
        setPolls(prev => prev.map(p => 
          p.id === currentPoll.id 
            ? { ...p, userHasVoted: true, userVotedFor: selectedUniId } 
            : p
        ));
        
        // Fetch fresh results from the "Truth Engine" (DB)
        const resultsRes = await getPollResultsById(currentPoll.id, true);
        if (resultsRes.success && resultsRes.data) {
          setResults(resultsRes.data.results);
          setTotalVotes(resultsRes.data.totalVotes);
        }
      } else {
        // This handles cases like "Already voted" or DB errors
        showErrorToast(response.error || 'The system rejected your vote.');
      }
    } catch (error) {
      console.error('[Voting Flow] Fatal error:', error);
      showErrorToast('Connection to the Truth Engine failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERING ---

  // FIX: Wrap loading in AppLayout to prevent blinking/remounting
  if (isLoading || !isFingerprintReady) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="xl" variant="accent" />
        </div>
      </AppLayout>
    );
  }

  if (polls.length === 0) {
    return (
      <AppLayout>
        <PageContainer>
          <EmptyState title="No Active Battles" description={`The ${category} sector is currently quiet.`} actionLabel="Go Home" onAction={() => navigate('/')} icon={<Trophy />} />
        </PageContainer>
      </AppLayout>
    );
  }

  const allVoted = polls.every(p => p.userHasVoted);
  const completionPercentage = (polls.filter(p => p.userHasVoted).length / polls.length) * 100;

  return (
    <AppLayout>
      <VoteConfetti isActive={showConfetti} color={selectedUniId ? (getUniversityById(selectedUniId)?.color) : undefined} />
      
      {allVoted && (
        <LevelUpToast category={category} onDismiss={() => navigate('/')} onNext={() => navigate(`/results/${category}`)} />
      )}

      <div className="max-w-3xl mx-auto px-4">
        <PollProgress 
          current={currentPollIndex + 1} 
          total={polls.length} 
          category={category} 
          completionPercentage={completionPercentage} 
          onBack={handlePrev} 
          onSkip={handleNext} 
        />
      </div>

      <PageContainer maxWidth="md" className="pt-4 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-slate-400 uppercase mb-4">
            <Zap size={12} /> {currentPoll.category} Sector
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white">{currentPoll.question}</h1>
        </div>

        {currentPoll.userHasVoted ? (
          <div className="space-y-6">
            {/* FIX: Ensure string | null is passed */}
            <AlreadyVotedBadge universityId={currentPoll.userVotedFor ?? null} onViewResults={() => navigate(`/poll/${currentPoll.slug}`)} />
            
            {isLoadingResults ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-800/50 rounded-xl" />)}
              </div>
            ) : (
              // FIX: Added required onVoteClick
              <RaceTrack results={results} totalVotes={totalVotes} userHasVoted={true} onVoteClick={() => {}} />
            )}
            
            <div className="flex justify-center pt-4">
              {currentPollIndex < polls.length - 1 ? (
                <Button variant="secondary" onClick={handleNext} rightIcon={<ArrowRight />}>Next Battle</Button>
              ) : (
                <Button variant="primary" onClick={() => navigate(`/results/${category}`)}>View Full Rankings</Button>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UniversityGrid universities={universities} selectedId={selectedUniId} onSelect={handleSelectUni} onVote={handleSelectUni}  />
            <div className="mt-8"><LockedResultsCard onVoteClick={() => {}} /></div>
          </div>
        )}
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