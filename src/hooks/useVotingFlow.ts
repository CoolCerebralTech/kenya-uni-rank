// ============================================================================
// useVotingFlow - Progressive Disclosure Manager
// Manages the "one category at a time" voting flow
// ============================================================================

import { useState, useEffect } from 'react';
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

/**
 * Hook to manage progressive voting flow
 * Enforces "one category at a time" UX pattern
 * 
 * @example
 * const { 
 *   phase, 
 *   currentCategory, 
 *   startCategory, 
 *   completeCategory 
 * } = useVotingFlow();
 * 
 * if (phase === 'category-select') {
 *   return <CategorySelector onSelect={startCategory} />;
 * }
 */
export function useVotingFlow(): UseVotingFlowResult {
  const [state, setState] = useState<VotingFlowState>({
    phase: 'home',
    currentCategory: null,
    completedCategories: [],
    currentPollIndex: 0,
    totalPollsInCategory: 0,
    isLoading: false,
  });

  // Load completed categories from storage
  useEffect(() => {
    
    // Group voted polls by category to determine completed categories
    // This is a simplified approach - you may want to fetch poll details
    const completed: PollCategory[] = [];
    
    // Check each category for completion
    const categories: PollCategory[] = [
      'general', 'vibes', 'academics', 'sports', 'social', 'facilities'
    ];
    
    categories.forEach(async (category) => {
      const response = await getActivePolls(category);
      if (response.success && response.data) {
        const allVoted = response.data.every(poll => 
          hasVotedOnPoll(poll.id)
        );
        if (allVoted && response.data.length > 0) {
          completed.push(category);
        }
      }
    });

    setState(prev => ({ ...prev, completedCategories: completed }));
  }, []);

  const startCategory = async (category: PollCategory) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Fetch polls in this category
      const response = await getActivePolls(category);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          phase: 'voting',
          currentCategory: category,
          currentPollIndex: 0,
          totalPollsInCategory: response.data.length,
          isLoading: false,
        }));
      } else {
        console.error('[useVotingFlow] Failed to load category polls');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('[useVotingFlow] Error starting category:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const nextPoll = () => {
    setState(prev => {
      const nextIndex = prev.currentPollIndex + 1;
      
      // Check if category is complete
      if (nextIndex >= prev.totalPollsInCategory) {
        return { ...prev, phase: 'results' };
      }
      
      return { ...prev, currentPollIndex: nextIndex };
    });
  };

  const previousPoll = () => {
    setState(prev => ({
      ...prev,
      currentPollIndex: Math.max(0, prev.currentPollIndex - 1),
    }));
  };

  const skipPoll = () => {
    // Mark as seen but not voted
    nextPoll();
  };

  const completeCategory = () => {
    setState(prev => {
      const newCompleted = prev.currentCategory
        ? [...prev.completedCategories, prev.currentCategory]
        : prev.completedCategories;

      return {
        ...prev,
        phase: newCompleted.length >= 6 ? 'completed' : 'category-select',
        completedCategories: newCompleted,
        currentCategory: null,
        currentPollIndex: 0,
      };
    });
  };

  const resetFlow = () => {
    setState({
      phase: 'home',
      currentCategory: null,
      completedCategories: [],
      currentPollIndex: 0,
      totalPollsInCategory: 0,
      isLoading: false,
    });
  };

  const isCategoryCompleted = (category: PollCategory): boolean => {
    return state.completedCategories.includes(category);
  };

  const getProgress = () => {
    const completed = state.completedCategories.length;
    const total = 6; // Total categories
    const percentage = (completed / total) * 100;

    return { completed, total, percentage };
  };

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