import React, { useState, useEffect } from 'react';
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

// Racing & Gamification
import { RaceTrack } from '../components/racing/RaceTrack';
import { VoteConfetti } from '../components/gamification/VoteConfetti';
import { LevelUpToast } from '../components/gamification/LevelUpToast';

// Services & Data
import { getActivePolls } from '../services/poll.service';
import { castVote, checkIfVoted, getPollWithResults } from '../services/voting.service';
import { getAllUniversitiesSync, getUniversityById } from '../services/university.service';
import type { Poll, PollCategory, PollResult } from '../types/models';
import { ArrowRight, AlertCircle, Info } from 'lucide-react';

export const VotingPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  // --- STATE ---
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
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
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Static Data
  const universities = getAllUniversitiesSync();

  // --- INITIALIZATION ---
  useEffect(() => {
    const loadSession = async () => {
      if (!category) return;
      setIsLoading(true);

      // 1. Fetch Polls for Category
      const response = await getActivePolls(category as PollCategory);
      
      if (response.success && response.data) {
        setPolls(response.data);
        
        // 2. Check status of first poll
        if (response.data.length > 0) {
          await loadPollStatus(response.data[0]);
        }
      }
      setIsLoading(false);
    };

    loadSession();
  }, [category]);

  // Load status for a specific poll (voted vs new)
  const loadPollStatus = async (poll: Poll) => {
    const voted = await checkIfVoted(poll.id);
    setHasVoted(voted);
    
    // If voted, we need to fetch results immediately
    if (voted) {
      // In a real app, we'd store WHO they voted for in localStorage to show the specific badge
      // For now, we'll assume we fetch the aggregate results
      const resultsRes = await getPollWithResults(poll.slug);
      if (resultsRes.success && resultsRes.data) {
        setResults(resultsRes.data.results);
        setTotalVotes(resultsRes.data.totalVotes);
      }
    } else {
      // Reset results if not voted (Ghost Mode will handle UI)
      setResults([]);
      setTotalVotes(0);
    }
  };

  // --- HANDLERS ---

  const handleNext = async () => {
    if (currentIndex < polls.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedUniId(null);
      setHasVoted(false);
      // Load status for next poll
      await loadPollStatus(polls[nextIndex]);
    } else {
      // Finished all polls
      setShowLevelUp(true);
    }
  };

  const handlePrev = async () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedUniId(null);
      await loadPollStatus(polls[prevIndex]);
    }
  };

  const handleSelectUni = (id: string) => {
    if (hasVoted) return; // Locked
    setSelectedUniId(id);
    setIsConfirmOpen(true);
  };

  const submitVote = async () => {
    if (!selectedUniId) return;
    
    setIsSubmitting(true);
    const currentPoll = polls[currentIndex];

    // 1. Cast Vote
    const response = await castVote(
      currentPoll.id,
      selectedUniId,
      'student' // Defaulting for now, usually from context
    );

    if (response.success) {
      // 2. Success Effect
      setIsConfirmOpen(false);
      setHasVoted(true);
      setVotedUniId(selectedUniId);
      setShowConfetti(true);
      
      // 3. Fetch Fresh Results
      const resultsRes = await getPollWithResults(currentPoll.slug);
      if (resultsRes.success && resultsRes.data) {
        setResults(resultsRes.data.results);
        setTotalVotes(resultsRes.data.totalVotes);
      }

      // 4. Auto-Advance Timer
      setTimeout(() => {
        handleNext();
        setShowConfetti(false); // Reset confetti
      }, 3500); // Give them time to see the race change
    } else {
      // Error handling (Toast would go here)
      alert(response.error || 'Voting failed');
    }
    
    setIsSubmitting(false);
  };

  // --- RENDER ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" variant="accent" className="mb-4" />
          <p className="text-slate-400 animate-pulse">Initializing Voting Sequence...</p>
        </div>
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <AppLayout>
        <PageContainer>
          <EmptyState 
            title="No Polls Active" 
            description={`There are currently no active battles in the ${category} sector.`} 
            actionLabel="Return to Base"
            onAction={() => navigate('/')}
          />
        </PageContainer>
      </AppLayout>
    );
  }

  const currentPoll = polls[currentIndex];
  const selectedUni = selectedUniId ? getUniversityById(selectedUniId) : null;

  return (
    <AppLayout>
      {/* Confetti Layer */}
      <VoteConfetti 
        isActive={showConfetti} 
        color={selectedUni?.color} 
      />

      {/* Level Up Toast */}
      {showLevelUp && (
        <LevelUpToast 
          category={category || 'Unknown'} 
          xpGained={polls.length * 50}
          onDismiss={() => setShowLevelUp(false)}
          onNext={() => navigate('/results')}
        />
      )}

      {/* Progress Header (Sticky) */}
      <div className="max-w-3xl mx-auto px-4">
        <PollProgress 
          current={currentIndex + 1} 
          total={polls.length} 
          category={category || ''}
          onBack={handlePrev}
          onSkip={handleNext}
        />
      </div>

      <PageContainer maxWidth="md" className="pt-4 pb-20">
        
        {/* --- QUESTION AREA --- */}
        <div className="text-center mb-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <Info size={12} /> {currentPoll.category} Sector
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
            {currentPoll.question}
          </h1>
        </div>

        {/* --- RESULTS AREA (If Voted) --- */}
        {hasVoted && (
          <div className="mb-8 animate-in fade-in zoom-in-95 duration-500">
            <AlreadyVotedBadge 
              universityId={votedUniId} 
              onViewResults={() => {}} 
            />
            <div className="mt-4">
              <RaceTrack 
                results={results} 
                totalVotes={totalVotes} 
                userHasVoted={true} 
                onVoteClick={() => {}} 
              />
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button 
                variant="secondary" 
                onClick={handleNext} 
                rightIcon={<ArrowRight size={16} />}
                className="animate-pulse"
              >
                Next Battle
              </Button>
            </div>
          </div>
        )}

        {/* --- VOTING GRID (If Not Voted) --- */}
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

        {/* --- FOOTER HINT --- */}
        {!hasVoted && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-900/10 border border-amber-900/30 text-amber-500/80 text-xs">
              <AlertCircle size={14} />
              <span>Votes are anonymous and irreversible for this cycle.</span>
            </div>
          </div>
        )}

      </PageContainer>

      {/* --- CONFIRMATION MODAL --- */}
      <VoteConfirmation 
        isOpen={isConfirmOpen}
        university={selectedUni || null}
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