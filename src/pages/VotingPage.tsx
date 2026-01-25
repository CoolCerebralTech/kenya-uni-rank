// src/pages/VotingPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/FullScreenLoader';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';

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
import { getActivePolls } from '../services/poll.service';
import { castVote, checkIfVoted, getPollResultsById } from '../services/voting.service';
import { getAllUniversitiesSync, getUniversityById } from '../services/university.service';
import { useFingerprint } from '../hooks/useFingerprint';
import { useToast } from '../hooks/useToast';
import type { Poll, PollCategory, PollResult } from '../types/models';
import { ArrowRight, AlertCircle, Trophy, Zap } from 'lucide-react';

export const VotingPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  // --- HOOKS ---
  const { fingerprint, isReady: isFingerprintReady } = useFingerprint();
  const { showSuccessToast, showErrorToast } = useToast();
  
  // --- STATE ---
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  
  // Current Poll State
  const [hasVoted, setHasVoted] = useState(false);
  const [votedUniId, setVotedUniId] = useState<string | null>(null);
  const [results, setResults] = useState<PollResult[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  
  // Interaction State
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Gamification State
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedCategory, setCompletedCategory] = useState(false);

  // Static Data
  const universities = getAllUniversitiesSync();
  const currentPoll = polls[currentPollIndex];

  // --- LOAD POLLS FOR CATEGORY ---
  useEffect(() => {
    const loadCategoryPolls = async () => {
      if (!category) return;
      
      setIsLoading(true);
      try {
        const response = await getActivePolls(category as PollCategory);
        
        if (response.success && response.data) {
          setPolls(response.data);
          
          // Check vote status for first poll
          if (response.data.length > 0 && isFingerprintReady) {
            await loadPollStatus(response.data[0]);
          }
        } else {
          showErrorToast(response.error || 'Failed to load polls');
        }
      } catch (error) {
        console.error('Error loading category polls:', error);
        showErrorToast('Failed to load polls');
      } finally {
        setIsLoading(false);
      }
    };

    if (isFingerprintReady) {
      loadCategoryPolls();
    }
  }, [category, isFingerprintReady, showErrorToast]);

  // --- LOAD POLL STATUS (VOTED OR NOT) ---
  const loadPollStatus = async (poll: Poll) => {
    if (!fingerprint) return;
    
    try {
      const voted = await checkIfVoted(poll.id);
      setHasVoted(voted);
      
      if (voted) {
        // Load results if already voted
        setIsLoadingResults(true);
        const resultsRes = await getPollResultsById(poll.id);
        
        if (resultsRes.success && resultsRes.data) {
          setResults(resultsRes.data.results);
          setTotalVotes(resultsRes.data.totalVotes);
        }
      } else {
        // Reset results for new poll
        setResults([]);
        setTotalVotes(0);
        setVotedUniId(null);
      }
    } catch (error) {
      console.error('Error loading poll status:', error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  // --- NAVIGATION ---
  const handleNext = async () => {
    if (currentPollIndex < polls.length - 1) {
      const nextIndex = currentPollIndex + 1;
      setCurrentPollIndex(nextIndex);
      setSelectedUniId(null);
      setShowConfetti(false);
      
      if (polls[nextIndex]) {
        await loadPollStatus(polls[nextIndex]);
      }
    } else {
      // Finished all polls in category
      setCompletedCategory(true);
      showSuccessToast(`🎉 You've completed all polls in ${category}!`);
    }
  };

  const handlePrev = async () => {
    if (currentPollIndex > 0) {
      const prevIndex = currentPollIndex - 1;
      setCurrentPollIndex(prevIndex);
      setSelectedUniId(null);
      
      if (polls[prevIndex]) {
        await loadPollStatus(polls[prevIndex]);
      }
    }
  };

  // --- VOTE HANDLING ---
  const handleSelectUni = (id: string) => {
    if (hasVoted || !isFingerprintReady) return;
    setSelectedUniId(id);
    setIsConfirmOpen(true);
  };

  const submitVote = async () => {
    if (!selectedUniId || !currentPoll || !fingerprint) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await castVote(
        currentPoll.id,
        selectedUniId,
        'student' // In real app, get from voter type prompt
      );

      if (response.success) {
        // Success
        setIsConfirmOpen(false);
        setHasVoted(true);
        setVotedUniId(selectedUniId);
        setShowConfetti(true);
        showSuccessToast('Vote submitted! Results updating...');
        
        // Load fresh results
        const resultsRes = await getPollResultsById(currentPoll.id, false); // Skip cache
        
        if (resultsRes.success && resultsRes.data) {
          setResults(resultsRes.data.results);
          setTotalVotes(resultsRes.data.totalVotes);
        }

        // Auto-advance after delay
        setTimeout(() => {
          handleNext();
        }, 3000);
      } else {
        showErrorToast(response.error || 'Failed to submit vote');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      showErrorToast('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewResults = () => {
    if (currentPoll) {
      navigate(`/poll/${currentPoll.slug}`);
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

  if (isLoading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="space-y-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-800 rounded w-3/4 mx-auto"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="space-y-3">
                      <div className="h-6 bg-slate-800 rounded"></div>
                      <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                      <div className="h-10 bg-slate-800 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </AppLayout>
    );
  }

  if (polls.length === 0) {
    return (
      <AppLayout>
        <PageContainer>
          <EmptyState 
            title="No Active Battles" 
            description={`There are currently no active polls in the ${category} category. Check back soon!`} 
            actionLabel="Return Home"
            onAction={() => navigate('/')}
            icon={<Trophy className="w-12 h-12 text-slate-600" />}
          />
        </PageContainer>
      </AppLayout>
    );
  }

  if (!currentPoll) {
    return (
      <AppLayout>
        <PageContainer>
          <EmptyState 
            title="Poll Not Found" 
            description="The requested poll could not be loaded." 
            actionLabel="Go Back"
            onAction={() => navigate(-1)}
          />
        </PageContainer>
      </AppLayout>
    );
  }

  // Calculate completion percentage
  const completionPercentage = polls.length > 0 
    ? Math.round(((currentPollIndex + (hasVoted ? 1 : 0)) / polls.length) * 100)
    : 0;

  return (
    <AppLayout>
      {/* Confetti Layer */}
      <VoteConfetti 
        isActive={showConfetti} 
        color={selectedUniId ? getUniversityById(selectedUniId)?.color : undefined} 
      />

      {/* Level Up Toast */}
      {completedCategory && (
        <LevelUpToast 
          category={category || 'Unknown'} 
          xpGained={polls.length * 50}
          onDismiss={() => {
            setCompletedCategory(false);
            navigate('/');
          }}
          onNext={() => navigate(`/results/${category}`)}
        />
      )}

      {/* Progress Header */}
      <div className="max-w-3xl mx-auto px-4">
        <PollProgress 
          current={currentPollIndex + 1} 
          total={polls.length} 
          category={category || ''}
          completionPercentage={completionPercentage}
          onBack={handlePrev}
          onSkip={handleNext}
        />
      </div>

      <PageContainer maxWidth="md" className="pt-4 pb-20">
        
        {/* --- QUESTION AREA --- */}
        <div className="text-center mb-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <Zap size={12} /> {currentPoll.category} Sector
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
            {currentPoll.question}
          </h1>
          {currentPoll.description && (
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              {currentPoll.description}
            </p>
          )}
        </div>

        {/* --- RESULTS AREA (If Voted) --- */}
        {hasVoted && !isLoadingResults && (
          <div className="mb-8 animate-in fade-in zoom-in-95 duration-500 space-y-6">
            <AlreadyVotedBadge 
              universityId={votedUniId} 
              onViewResults={handleViewResults} 
            />
            
            <div className="mt-4">
              <RaceTrack 
                results={results} 
                totalVotes={totalVotes} 
                userHasVoted={true} 
                onVoteClick={() => {}} 
              />
            </div>
            
            <div className="mt-6 flex justify-center gap-3">
              {currentPollIndex < polls.length - 1 ? (
                <Button 
                  variant="secondary" 
                  onClick={handleNext}
                  rightIcon={<ArrowRight size={16} />}
                  className="animate-pulse"
                >
                  Next Battle
                </Button>
              ) : (
                <Button 
                  variant="primary"
                  onClick={() => navigate(`/results/${category}`)}
                >
                  View Category Results
                </Button>
              )}
            </div>
          </div>
        )}

        {/* --- VOTING AREA (If Not Voted) --- */}
        {!hasVoted && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <UniversityGrid 
              universities={universities}
              selectedId={selectedUniId}
              voteStates={{}}
              onSelect={handleSelectUni}
              onVote={handleSelectUni}
            />
          </div>
        )}

        {/* --- LOADING RESULTS --- */}
        {isLoadingResults && (
          <div className="mb-8 animate-pulse">
            <div className="h-12 bg-slate-800/50 rounded-lg mb-4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-800/30 rounded-xl"></div>
              ))}
            </div>
          </div>
        )}

        {/* --- LOCKED RESULTS (If not voted but showing preview) --- */}
        {!hasVoted && results.length === 0 && (
          <div className="mb-8">
            <LockedResultsCard 
              onVoteClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            />
          </div>
        )}

        {/* --- FOOTER DISCLAIMER --- */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-900/10 border border-amber-900/30 text-amber-500/80 text-xs">
            <AlertCircle size={14} />
            <span>Votes are anonymous and final for this monthly cycle.</span>
          </div>
          <p className="text-xs text-slate-600 mt-4">
            Your device fingerprint: {fingerprint?.substring(0, 8)}... • 
            Cycle: {currentPoll.cycleMonth || 'Current'}
          </p>
        </div>

      </PageContainer>

      {/* --- CONFIRMATION MODAL --- */}
      <VoteConfirmation 
        isOpen={isConfirmOpen}
        university={selectedUniId ? getUniversityById(selectedUniId) : null}
        isSubmitting={isSubmitting}
        onConfirm={submitVote}
        onCancel={() => {
          setIsConfirmOpen(false);
          setSelectedUniId(null);
        }}
      />

    </AppLayout>
  );
};