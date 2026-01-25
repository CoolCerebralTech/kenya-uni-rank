import React, { useEffect, useState } from 'react';
import { ProgressRing } from '../components/gamification/ProgressRing';
import { getVotedPolls, getVoteDetails, clearAllStorage } from '../services/storage.service';
import { getActivePolls } from '../services/poll.service';
import type { PollCategory } from '../types/models';

interface VoteHistory {
  pollId: string;
  universityId: string;
  votedAt: number;
  category?: PollCategory;
}

export function ProfilePage() {
  const [votedPolls, setVotedPolls] = useState<string[]>([]);
  const [voteHistory, setVoteHistory] = useState<VoteHistory[]>([]);
  const [completedCategories, setCompletedCategories] = useState<PollCategory[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const voted = getVotedPolls();
    const details = getVoteDetails();
    
    setVotedPolls(voted);
    
    // Convert details to history array
    const history: VoteHistory[] = Object.values(details);
    setVoteHistory(history.sort((a, b) => b.votedAt - a.votedAt));

    // Calculate completed categories
    const categories: PollCategory[] = ['general', 'vibes', 'academics', 'sports', 'social', 'facilities'];
    const completed: PollCategory[] = [];

    for (const category of categories) {
      const response = await getActivePolls(category);
      if (response.success && response.data) {
        const allVoted = response.data.every(poll => voted.includes(poll.id));
        if (allVoted && response.data.length > 0) {
          completed.push(category);
        }
      }
    }

    setCompletedCategories(completed);
  };

  const handleReset = () => {
    clearAllStorage();
    setVotedPolls([]);
    setVoteHistory([]);
    setCompletedCategories([]);
    setShowResetConfirm(false);
    window.location.reload();
  };

  const totalVotes = votedPolls.length;
  const categoriesCompleted = completedCategories.length;
  const totalCategories = 6;
  const completionPercentage = (categoriesCompleted / totalCategories) * 100;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full border-4 border-cyan-500/30">
            <span className="text-6xl">👤</span>
          </div>
          <h1 className="text-4xl font-black text-white">Your Profile</h1>
          <p className="text-slate-400">Track your voting journey and achievements</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center space-y-2">
            <div className="text-4xl font-black text-cyan-400">{totalVotes}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">Total Votes Cast</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center space-y-2">
            <div className="text-4xl font-black text-green-400">{categoriesCompleted}/{totalCategories}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">Categories Completed</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center space-y-2">
            <div className="text-4xl font-black text-purple-400">{completionPercentage.toFixed(0)}%</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">Progress</div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center py-8">
          <ProgressRing completed={categoriesCompleted} total={totalCategories} size={160} />
        </div>

        {/* Completed Categories */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Conquered Categories</h2>
          
          {completedCategories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedCategories.map((category) => {
                const emojis: Record<PollCategory, string> = {
                  general: '🎓',
                  vibes: '✨',
                  academics: '📚',
                  sports: '⚽',
                  social: '🤝',
                  facilities: '🏛️',
                };

                return (
                  <div
                    key={category}
                    className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3"
                  >
                    <span className="text-3xl">{emojis[category]}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-green-400 capitalize">{category}</div>
                      <div className="text-xs text-slate-500">Completed ✓</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <div className="text-slate-400">No categories completed yet. Start voting!</div>
            </div>
          )}
        </div>

        {/* Vote History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Recent Votes</h2>
          
          {voteHistory.length > 0 ? (
            <div className="space-y-2">
              {voteHistory.slice(0, 10).map((vote, index) => {
                const timeAgo = formatTimeAgo(vote.votedAt);
                
                return (
                  <div
                    key={`${vote.pollId}-${index}`}
                    className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">
                        Voted for {vote.universityId.toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{timeAgo}</div>
                    </div>
                    <div className="text-green-400">✓</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">🗳️</div>
              <div className="text-slate-400">No votes yet. Cast your first vote!</div>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* First Vote Badge */}
            <div className={`rounded-xl p-6 border ${totalVotes > 0 ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-slate-800/30 border-slate-700/30 opacity-50'}`}>
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-sm font-bold text-white">First Vote</div>
              <div className="text-xs text-slate-400 mt-1">
                {totalVotes > 0 ? 'Unlocked!' : 'Cast your first vote'}
              </div>
            </div>

            {/* Category Master */}
            <div className={`rounded-xl p-6 border ${categoriesCompleted > 0 ? 'bg-purple-500/10 border-purple-500/20' : 'bg-slate-800/30 border-slate-700/30 opacity-50'}`}>
              <div className="text-4xl mb-2">👑</div>
              <div className="text-sm font-bold text-white">Category Master</div>
              <div className="text-xs text-slate-400 mt-1">
                {categoriesCompleted > 0 ? 'Unlocked!' : 'Complete a category'}
              </div>
            </div>

            {/* Full Completion */}
            <div className={`rounded-xl p-6 border ${categoriesCompleted === 6 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-slate-800/30 border-slate-700/30 opacity-50'}`}>
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-sm font-bold text-white">All Categories Complete</div>
              <div className="text-xs text-slate-400 mt-1">
                {categoriesCompleted === 6 ? 'Unlocked!' : `${categoriesCompleted}/6 categories`}
              </div>
            </div>

            {/* Power Voter */}
            <div className={`rounded-xl p-6 border ${totalVotes >= 20 ? 'bg-green-500/10 border-green-500/20' : 'bg-slate-800/30 border-slate-700/30 opacity-50'}`}>
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-sm font-bold text-white">Power Voter</div>
              <div className="text-xs text-slate-400 mt-1">
                {totalVotes >= 20 ? 'Unlocked!' : `${totalVotes}/20 votes`}
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4 pt-8 border-t border-slate-700">
          <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
          
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-4">
            <div>
              <div className="text-sm font-bold text-white">Reset All Data</div>
              <div className="text-xs text-slate-400 mt-1">
                This will clear all your votes and progress. This action cannot be undone.
              </div>
            </div>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-semibold transition-colors"
              >
                Reset My Data
              </button>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-red-400 font-semibold">Are you absolutely sure?</div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-semibold transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}