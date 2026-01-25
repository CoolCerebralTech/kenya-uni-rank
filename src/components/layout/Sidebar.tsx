import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Vote, Trophy, Sparkles, TrendingUp, CheckCircle, PlayCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

export const Sidebar: React.FC = () => {
  // const { completedCategories, getProgress } = useVotingFlow(); // This is how state would be connected
  // const { completed, percentage } = getProgress();

  // --- MOCK DATA FOR VISUALIZATION ---
  const completedCategories = ['vibes', 'sports'];
  const progress = { completed: 2, total: 6, percentage: 33 };
  const categories = ['Vibes', 'Academics', 'Sports', 'Facilities', 'Social', 'General'];
  // --- END MOCK DATA ---
  
  const menuItems = [
    { name: 'Mission Control', icon: Home, path: '/' },
    { name: 'Start Voting', icon: Vote, path: '/voting' },
    { name: 'Leaderboards', icon: Trophy, path: '/leaderboard' },
    { name: 'Trends & Insights', icon: TrendingUp, path: '/trends', badge: 'New' },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-4 space-y-8">
      {/* UPGRADE: User Progress Section - The core of gamification */}
      <div>
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Your Progress
        </p>
        <Card variant="glass" padding="sm" className="text-center">
          <h4 className="font-bold text-white">Race to 100%</h4>
          <p className="text-xs text-slate-400 mb-3">{progress.completed} of {progress.total} categories conquered</p>
          <ProgressBar value={progress.percentage} color="gradient" showValue />
        </Card>
      </div>

      {/* Main Navigation */}
      <nav>
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 group
              ${isActive 
                ? 'bg-blue-600/10 text-cyan-400' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              <span>{item.name}</span>
            </div>
            {item.badge && <Badge variant="neon" size="sm">{item.badge}</Badge>}
          </NavLink>
        ))}
      </nav>

      {/* UPGRADE: Gamified Category Links */}
      <div>
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Categories
        </p>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isCompleted = completedCategories.includes(cat.toLowerCase());
            const Icon = isCompleted ? CheckCircle : PlayCircle;
            return (
              <NavLink
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className={({isActive}) => `flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors
                  ${isCompleted ? 'text-slate-500 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                  ${isActive && !isCompleted ? 'text-cyan-400 bg-slate-800/50' : ''}`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} className={isCompleted ? 'text-emerald-500' : ''} />
                  {cat}
                </span>
                {isCompleted && <span className="text-xs font-bold text-emerald-500">DONE</span>}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* AI Teaser Card */}
      <div className="mt-auto">
        <Card variant="glass" className="border-indigo-500/20 text-center">
          <div className="flex justify-center mb-2 text-indigo-400"><Sparkles size={20} /></div>
          <h4 className="text-sm font-semibold text-white mb-1">AI Matchmaker</h4>
          <p className="text-xs text-slate-400">Unlock after completing all categories.</p>
        </Card>
      </div>
    </div>
  );
};