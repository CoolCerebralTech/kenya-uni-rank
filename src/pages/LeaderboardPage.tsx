import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Medal, Award, Users } from 'lucide-react';
import { 
  getUniversityLeaderboard,
  type UniversityLeaderboardEntry 
} from '../services';
import { LeaderboardSkeleton } from '../components';

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<UniversityLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'Public' | 'Private'>('all');

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getUniversityLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  // Filter universities by type
  const filteredLeaderboard = filterType === 'all' 
    ? leaderboard 
    : leaderboard.filter(uni => uni.type === filterType);

  // Get podium (top 3)
  const podium = filteredLeaderboard.slice(0, 3);
  const others = filteredLeaderboard.slice(3);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: '1st Place' };
      case 1:
        return { icon: Award, color: 'text-gray-400', bg: 'bg-gray-400/10', label: '2nd Place' };
      case 2:
        return { icon: Medal, color: 'text-orange-600', bg: 'bg-orange-600/10', label: '3rd Place' };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text dark:text-white">
              University Rankings
            </h1>
            <p className="text-text-subtle dark:text-gray-400">
              Based on real student votes
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-6">
          {['all', 'Public', 'Private'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as typeof filterType)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all border-2 ${
                filterType === type
                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg scale-105'
                  : 'bg-white dark:bg-background-elevated text-text-subtle dark:text-gray-400 border-border-light dark:border-border hover:border-brand-primary/50'
              }`}
            >
              {type === 'all' ? 'All Universities' : `${type} Only`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LeaderboardSkeleton />
      ) : (
        <>
          {/* Podium - Top 3 */}
          {podium.length > 0 && (
            <div className="grid md:grid-cols-3 gap-4 animate-fade-in-up">
              {podium.map((uni, index) => {
                const rankInfo = getRankIcon(index);
                if (!rankInfo) return null;

                return (
                  <div
                    key={uni.id}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-background-elevated dark:to-background-subtle border-2 p-6 hover:shadow-2xl transition-all hover:scale-105"
                    style={{ 
                      borderColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl" />
                    
                    <div className="relative">
                      {/* Rank Badge */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${rankInfo.bg} rounded-full mb-4`}>
                        <rankInfo.icon className={rankInfo.color} size={18} />
                        <span className={`font-bold text-sm ${rankInfo.color}`}>
                          {rankInfo.label}
                        </span>
                      </div>

                      {/* University Info */}
                      <h3 className="font-bold text-xl text-text dark:text-white mb-2 line-clamp-2">
                        {uni.name}
                      </h3>
                      
                      <div 
                        className="inline-block px-2 py-1 rounded-md text-xs font-semibold text-white mb-4"
                        style={{ backgroundColor: uni.color }}
                      >
                        {uni.short_name}
                      </div>

                      {/* Stats */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-text-subtle dark:text-gray-400">Total Votes:</span>
                          <span className="font-bold text-text dark:text-white">
                            {uni.total_votes_received.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-text-subtle dark:text-gray-400">Polls:</span>
                          <span className="font-semibold text-text dark:text-white">
                            {uni.polls_participated}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rest of Rankings */}
          {others.length > 0 && (
            <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-xl font-bold text-text dark:text-white mb-4 flex items-center gap-2">
                <Users size={20} />
                All Rankings
              </h2>
              
              {others.map((uni, index) => {
                const rank = index + 4; // +4 because podium took first 3
                
                return (
                  <div
                    key={uni.id}
                    className="flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-background-elevated border border-border-light dark:border-border hover:shadow-lg transition-all hover:scale-[1.01] group"
                  >
                    {/* Rank Number */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-background-subtle dark:bg-background-hover text-text dark:text-white font-bold text-lg">
                      #{rank}
                    </div>

                    {/* University Info */}
                    <div className="flex-1">
                      <h4 className="font-bold text-text dark:text-white mb-1 group-hover:text-brand-primary transition-colors">
                        {uni.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-text-subtle dark:text-gray-400">
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                          style={{ backgroundColor: uni.color }}
                        >
                          {uni.short_name}
                        </span>
                        <span>•</span>
                        <span>{uni.type}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="font-bold text-text dark:text-white">
                          {uni.total_votes_received.toLocaleString()}
                        </p>
                        <p className="text-text-muted dark:text-gray-500 text-xs">votes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-text dark:text-white">
                          {uni.polls_participated}
                        </p>
                        <p className="text-text-muted dark:text-gray-500 text-xs">polls</p>
                      </div>
                    </div>

                    {/* Trend Icon */}
                    <TrendingUp size={18} className="text-success opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredLeaderboard.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <Trophy size={48} className="mx-auto mb-4 text-text-muted opacity-50" />
              <p className="text-text-subtle dark:text-gray-400">
                No universities found for this filter
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};