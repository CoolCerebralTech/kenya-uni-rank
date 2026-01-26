import React, { useEffect, useState } from 'react';

// Layout & UI
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { Spinner } from '../components/ui/FullScreenLoader';
import { SectionDivider } from '../components/layout/SectionDivider';

// Gamification & Services
import { getVotedPolls, getVoteDetails, clearAllStorage } from '../services/storage.service';
import { getActivePolls } from '../services/poll.service';
import { getUniversityShortName } from '../services/university.service'; // For better UI
import type { PollCategory } from '../types/models';
import { AlertTriangle, Check, Trophy, Zap, Star } from 'lucide-react';

interface VoteHistory {
  pollId: string;
  universityId: string;
  votedAt: number;
  category?: PollCategory;
}

// Helper moved outside for cleanliness
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return new Date(timestamp).toLocaleDateString();
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

export const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [voteHistory, setVoteHistory] = useState<VoteHistory[]>([]);
  const [completedCategories, setCompletedCategories] = useState<PollCategory[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      
      const voted = getVotedPolls();
      const details = getVoteDetails();
      
      setTotalVotes(voted.length);
      
      const history: VoteHistory[] = Object.values(details);
      setVoteHistory(history.sort((a, b) => b.votedAt - a.votedAt));

      // --- PERFORMANCE FIX: Fetch all category polls in parallel ---
      const categories: PollCategory[] = ['vibes', 'academics', 'sports', 'social', 'facilities'];
      const pollPromises = categories.map(category => getActivePolls(category));
      const pollResponses = await Promise.all(pollPromises);

      const completed: PollCategory[] = [];
      pollResponses.forEach((response, index) => {
        if (response.success && response.data && response.data.length > 0) {
          const allInCategoryVoted = response.data.every(poll => voted.includes(poll.id));
          if (allInCategoryVoted) {
            completed.push(categories[index]);
          }
        }
      });

      setCompletedCategories(completed);
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const handleReset = () => {
    clearAllStorage();
    // No need to reset state, just reload to clear everything
    setShowResetConfirm(false);
    window.location.reload();
  };

  const categoriesCompleted = completedCategories.length;
  const totalCategories = 5; // Updated to match actual categories
  const completionPercentage = totalCategories > 0 ? (categoriesCompleted / totalCategories) * 100 : 0;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageContainer maxWidth="lg" title="My Profile">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-block p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-2 border-slate-700 shadow-lg">
            <span className="text-5xl">👤</span>
          </div>
          <h1 className="text-4xl font-black text-white">Your Profile</h1>
          <p className="text-slate-400">Track your voting journey and achievements.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center">
            <div className="text-4xl font-black text-cyan-400">{totalVotes}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">Total Votes Cast</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center">
            <div className="text-4xl font-black text-green-400">{categoriesCompleted}/{totalCategories}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">Categories Completed</div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 text-center">
            <div className="text-4xl font-black text-purple-400">{completionPercentage.toFixed(0)}%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">Overall Progress</div>
          </div>
        </div>

        <SectionDivider label="Achievements" />

        {/* Achievements Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Achievement unlocked={totalVotes > 0} icon={<Check />} title="First Vote" desc="Cast your first vote" />
            <Achievement unlocked={categoriesCompleted > 0} icon={<Trophy />} title="Category Master" desc="Complete a category" />
            <Achievement unlocked={totalVotes >= 20} icon={<Zap />} title="Power Voter" desc={`${totalVotes}/20 Votes Cast`} />
            <Achievement unlocked={categoriesCompleted === totalCategories} icon={<Star />} title="Completionist" desc={`${categoriesCompleted}/${totalCategories} Categories`} />
        </div>


        <SectionDivider label="Vote History" />
        
        {/* Vote History */}
        <div className="space-y-3">
          {voteHistory.length > 0 ? (
            voteHistory.slice(0, 10).map((vote, index) => (
              <div
                key={`${vote.pollId}-${index}`}
                className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">
                    {/* UI UPGRADE: Show short name, not ID */}
                    Voted for <span className="text-cyan-400">{getUniversityShortName(vote.universityId) || vote.universityId.toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{vote.category ? `in ${vote.category}` : 'General Poll'}</div>
                </div>
                <div className="text-xs text-slate-400 font-mono">{formatTimeAgo(vote.votedAt)}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">No votes recorded yet.</div>
          )}
        </div>


        {/* Danger Zone */}
        <div className="mt-16 pt-8 border-t border-slate-800/50">
          <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-4">
            <AlertTriangle size={18} /> Danger Zone
          </h3>
          
          <div className="bg-red-950/50 border border-red-500/30 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <div className="font-bold text-white">Reset All Data</div>
                <div className="text-xs text-slate-400 mt-1 max-w-md">
                  This will clear your entire voting history and achievements from this device. This action cannot be undone.
                </div>
              </div>
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-sm font-semibold transition-colors shrink-0"
                >
                  Reset My Data
                </button>
              ) : (
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-bold transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </PageContainer>
    </AppLayout>
  );
}

// Helper component for achievements to reduce repetition
const Achievement: React.FC<{ unlocked: boolean; icon: React.ReactNode; title: string; desc: string }> = 
({ unlocked, icon, title, desc }) => (
  <div className={`
    p-5 rounded-xl border transition-all duration-300
    ${unlocked 
      ? 'bg-slate-800 border-slate-700' 
      : 'bg-slate-900/50 border-slate-800/50 opacity-60'
    }`}
  >
    <div className={`
      w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors
      ${unlocked ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'}
    `}>
      {icon}
    </div>
    <div className="font-bold text-white text-sm">{title}</div>
    <div className="text-xs text-slate-400 mt-1">{unlocked ? `Unlocked ✓` : desc}</div>
  </div>
);