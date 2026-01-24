// ============================================================================
// UNIPULSE PHASE 2 - COMPONENT EXPORTS
// Gaming-style, addictive UI components for student engagement
// ============================================================================

// Racing Components (Core Visualizers)
export { RaceTrack } from './racing/RaceTrack';
export { HeroRacePreview } from './racing/HeroRacePreview';
export { ProgressRing } from './racing/ProgressRing';

// Voting Components (Interactive)
export { CategorySelector } from './voting/CategorySelector';
export { QuickVotePanel } from './voting/QuickVotePanel';
export { LockedResultsCard } from './voting/LockedResultsCard';

// AI Teaser (Phase 3 Preview)
export { AIMatchTeaser } from './ai/AIMatchTeaser';

// Loading States (Racing Theme)
export {
  RacingSkeleton,
  CategoryCardSkeleton,
  UniversityGridSkeleton,
  StatsBarSkeleton,
} from './ui/RacingSkeleton';

// Layout Components (To Be Created)
// export { AppLayout } from './layout/AppLayout';
// export { NavigationBar } from './layout/NavigationBar';

// Gamification Components (To Be Created)
// export { StreakCounter } from './gamification/StreakCounter';
// export { BadgeCollection } from './gamification/BadgeCollection';
// export { VoteConfetti } from './gamification/VoteConfetti';
// export { LevelUpToast } from './gamification/LevelUpToast';

// ============================================================================
// COMPONENT ARCHITECTURE NOTES
// ============================================================================

/*
DESIGN PHILOSOPHY:
- Mobile-first, thumb-friendly interactions
- Dopamine-driven feedback (confetti, toasts, badges)
- "Vote to Unlock" progression system
- University colors drive brand rivalry
- Ghost Mode → Reality Mode unlock flow

CRITICAL UX RULES:
1. No results visible until user votes
2. One category at a time (progressive disclosure)
3. Locked categories show teaser data only
4. Completed categories show "CONQUERED" badge
5. Live pulse indicators on top 3 racers
6. Smooth animations (300-1000ms transitions)
7. Anti-cheat messaging visible but subtle

COLOR SYSTEM:
- Primary: Cyan (#06B6D4) - CTAs, active states
- Success: Green (#10B981) - Completed, voted
- Warning: Amber (#F59E0B) - Teaser mode, ghost state
- Danger: Red (#EF4444) - Live indicators, urgent
- Locked: Slate (#64748B) - Unavailable content
- Background: Deep Slate (#0F172A) - Dark mode default

COMPONENT STATES:
- GHOST_MODE: Teaser data, blurred visuals
- VOTING_MODE: Active, can cast vote
- VOTED_MODE: Locked, showing "Already Voted" badge
- RESULTS_MODE: Unlocked, live real-time standings
- LOCKED_MODE: Requires vote to view

ANIMATIONS TO IMPLEMENT:
- Scale on hover (1.02-1.05)
- Pulse on live updates
- Shimmer on loading
- Confetti on vote success
- Smooth bar chart races
- Badge pop-in animations
- Level-up transitions

ACCESSIBILITY:
- High contrast (WCAG AA minimum)
- Keyboard navigation support
- Screen reader labels
- Focus indicators visible
- Touch targets 44px minimum

PERFORMANCE:
- Lazy load images
- Virtual scroll for long lists
- Debounce rapid clicks
- Optimistic UI updates
- Cache results in sessionStorage
*/