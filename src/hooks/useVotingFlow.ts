// ============================================================================
// useVotingFlow - Progressive Disclosure Manager (FINAL FIX)
// Manages the "one category at a time" voting flow
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PollCategory } from '../types/models';
import { hasVotedOnPoll } from '../services/storage.service';
import { getActivePolls } from '../services/poll.service';

interface VotingFlowState {
  phase: 'home' | 'category-select' | 'voting' | 'results' | 'completed';
  currentCategory: PollCategory | null;
  completedCategories: PollCategory[];
  currentPollIndex: number;
  totalPollsInCategory: number;
  isLoading: boolean;
}

interface UseVotingFlowResult extends VotingFlowState {
  startCategory: (category: PollCategory) => Promise<void>;
  nextPoll: () => void;
  previousPoll: () => void;
  skipPoll: () => void;
  completeCategory: () => void;
  resetFlow: () => void;
  isCategoryCompleted: (category: PollCategory) => boolean;
  getProgress: () => { completed: number; total: number; percentage: number };
}

export function useVotingFlow(): UseVotingFlowResult {
  const [state, setState] = useState<VotingFlowState>({
    phase: 'home',
    currentCategory: null,
    completedCategories: [],
    currentPollIndex: 0,
    totalPollsInCategory: 0,
    isLoading: true,
  });

  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  // Load completed categories
  useEffect(() => {
    const checkCompletion = async () => {
      const categories: PollCategory[] = [
        'general', 'vibes', 'academics', 'sports', 'social', 'facilities'
      ];
      
      const completed: PollCategory[] = [];

      await Promise.all(categories.map(async (category) => {
        try {
          const response = await getActivePolls(category);
          // Safe check using optional chaining for the loop
          if (response.success && response.data && response.data.length > 0) {
            const allVoted = response.data.every(poll => hasVotedOnPoll(poll.id));
            if (allVoted) {
              completed.push(category);
            }
          }
        } catch (err) {
          console.warn(`Failed to check completion for ${category}`, err);
        }
      }));

      if (isMounted.current) {
        setState(prev => ({ 
          ...prev, 
          completedCategories: completed,
          isLoading: false 
        }));
      }
    };

    checkCompletion();
  }, []);

  const startCategory = useCallback(async (category: PollCategory) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await getActivePolls(category);
      const polls = response.data; // FIX: Capture data in a const variable

      if (response.success && polls) { // FIX: Check the const variable
        if (isMounted.current) {
          setState(prev => ({
            ...prev,
            phase: 'voting',
            currentCategory: category,
            currentPollIndex: 0,
            totalPollsInCategory: polls.length, // FIX: TypeScript now knows this is safe
            isLoading: false,
          }));
        }
      } else {
        console.error('[useVotingFlow] Failed to load category polls');
        if (isMounted.current) setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('[useVotingFlow] Error starting category:', error);
      if (isMounted.current) setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const nextPoll = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentPollIndex + 1;
      if (nextIndex >= prev.totalPollsInCategory) {
        return { ...prev, phase: 'results' };
      }
      return { ...prev, currentPollIndex: nextIndex };
    });
  }, []);

  const previousPoll = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPollIndex: Math.max(0, prev.currentPollIndex - 1),
    }));
  }, []);

  const skipPoll = useCallback(() => {
    nextPoll();
  }, [nextPoll]);

  const completeCategory = useCallback(() => {
    setState(prev => {
      const newCompleted = prev.currentCategory
        ? [...prev.completedCategories, prev.currentCategory]
        : prev.completedCategories;

      const uniqueCompleted = Array.from(new Set(newCompleted));

      return {
        ...prev,
        phase: uniqueCompleted.length >= 6 ? 'completed' : 'category-select',
        completedCategories: uniqueCompleted,
        currentCategory: null,
        currentPollIndex: 0,
      };
    });
  }, []);

  const resetFlow = useCallback(() => {
    setState({
      phase: 'home',
      currentCategory: null,
      completedCategories: [],
      currentPollIndex: 0,
      totalPollsInCategory: 0,
      isLoading: false,
    });
  }, []);

  const isCategoryCompleted = useCallback((category: PollCategory): boolean => {
    return state.completedCategories.includes(category);
  }, [state.completedCategories]);

  const getProgress = useCallback(() => {
    const completed = state.completedCategories.length;
    const total = 6;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  }, [state.completedCategories]);

  return {
    ...state,
    startCategory,
    nextPoll,
    previousPoll,
    skipPoll,
    completeCategory,
    resetFlow,
    isCategoryCompleted,
    getProgress,
  };
}

export default useVotingFlow;