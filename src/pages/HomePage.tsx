import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Vote, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { 
  getPlatformStats, 
  getTopTrendingPolls,
  getTopThreeUniversities,
  type TrendingPoll,
  type UniversityLeaderboardEntry
} from '../services';
import { LoadingSkeleton } from '../components';

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState({
    totalPolls: 0,
    totalVotes: 0,
    totalUniversities: 0,
    categoriesCount: 0
  });
  const [trendingPolls, setTrendingPolls] = useState<TrendingPoll[]>([]);
  const [topUniversities, setTopUniversities] = useState<UniversityLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, trending, topThree] = await Promise.all([
          getPlatformStats(),
          getTopTrendingPolls(3),
          getTopThreeUniversities()
        ]);

        setStats(statsData);
        setTrendingPolls(trending);
        setTopUniversities(topThree);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-accent p-12 text-white animate-fade-in">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            <span>Real Student Opinions, Real-Time Results</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 leading-tight">
            The Pulse of Kenyan Universities
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Vote on polls, compare universities, and see live results from thousands of students across Kenya.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to="/polls"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-primary rounded-xl font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
            >
              <Vote size={20} />
              <span>Start Voting</span>
              <ArrowRight size={20} />
            </Link>
            
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/20"
            >
              <Trophy size={20} />
              <span>View Rankings</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
        {[
          { label: 'Active Polls', value: stats.totalPolls, icon: Vote, color: 'text-blue-600' },
          { label: 'Total Votes', value: stats.totalVotes, icon: TrendingUp, color: 'text-green-600' },
          { label: 'Universities', value: stats.totalUniversities, icon: Users, color: 'text-purple-600' },
          { label: 'Categories', value: stats.categoriesCount, icon: BarChart3, color: 'text-orange-600' }
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-background-elevated border border-border-light dark:border-border p-6 hover:shadow-lg transition-all hover:scale-105 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            
            <div className="relative">
              <stat.icon className={`${stat.color} mb-3`} size={24} />
              <p className="text-3xl font-bold text-text dark:text-white mb-1">
                {loading ? '...' : stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-text-subtle dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Trending Polls */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text dark:text-white mb-1">
              🔥 Trending Polls
            </h2>
            <p className="text-sm text-text-subtle dark:text-gray-400">
              Most voted polls right now
            </p>
          </div>
          <Link
            to="/polls"
            className="text-brand-primary hover:text-brand-primary-hover font-semibold text-sm flex items-center gap-1"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton variant="card" count={3} />
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {trendingPolls.map((poll, index) => (
              <Link
                key={poll.id}
                to={`/poll/${poll.slug}`}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-background-elevated border border-border-light dark:border-border p-6 hover:shadow-xl transition-all hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                
                <div className="relative">
                  <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full mb-3">
                    {poll.category.toUpperCase()}
                  </span>
                  
                  <h3 className="font-bold text-text dark:text-white mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">
                    {poll.question}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-subtle dark:text-gray-400">
                      {poll.total_votes.toLocaleString()} votes
                    </span>
                    <TrendingUp size={16} className="text-success" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Top Universities */}
      <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text dark:text-white mb-1">
              🏆 Top Universities
            </h2>
            <p className="text-sm text-text-subtle dark:text-gray-400">
              Most voted universities this week
            </p>
          </div>
          <Link
            to="/leaderboard"
            className="text-brand-primary hover:text-brand-primary-hover font-semibold text-sm flex items-center gap-1"
          >
            Full Leaderboard
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton variant="card" count={3} />
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {topUniversities.map((uni, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={uni.id}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-background-elevated dark:to-background-subtle border-2 border-border-light dark:border-border p-6 hover:shadow-xl transition-all hover:scale-105"
                  style={{ 
                    borderColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                    animationDelay: `${index * 100}ms` 
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{medals[index]}</span>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: uni.color }}
                    >
                      #{index + 1}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-text dark:text-white mb-2">
                    {uni.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-subtle dark:text-gray-400">
                      {uni.total_votes_received.toLocaleString()} votes
                    </span>
                    <span className="text-text-muted dark:text-gray-500">
                      {uni.polls_participated} polls
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-primary to-brand-secondary p-12 text-white text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">
            Your Voice Matters
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students shaping the future of university rankings in Kenya. Every vote counts!
          </p>
          <Link
            to="/polls"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-primary rounded-xl font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
          >
            <Vote size={20} />
            <span>Vote Now</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};