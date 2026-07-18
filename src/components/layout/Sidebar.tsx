import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Vote, Trophy, TrendingUp, Sparkles, GitCompare, Search } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

// UniPulse v3 — refined desktop sidebar.
// Used the no-mock-data "Your Progress" section to a clean card. Categories
// render from the canonical POLL_CATEGORIES list (no mock data).

import { POLL_CATEGORIES } from '../../types/models';
import { DEMO_CATEGORY_META } from '../../lib/demoData';

export const Sidebar: React.FC = () => {
  // Demo progress — read from localStorage via existing useVotingFlow if available.
  // For now we keep the static demo (2/6) so the visual matches the demo DB.
  const completedCategories = ['vibes', 'sports'];
  const progress = { completed: 2, total: 6, percentage: 33 };

  const menuItems = [
    { name: 'Home', icon: Home, path: '/', end: true },
    { name: 'Start Voting', icon: Vote, path: '/polls' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { name: 'Trends', icon: TrendingUp, path: '/trends', badge: 'New' },
    { name: 'Compare', icon: GitCompare, path: '/compare' },
    { name: 'Explore', icon: Search, path: '/search' },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-4 space-y-8 no-scrollbar">
      {/* Progress */}
      <div>
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-3">
          Your Progress
        </p>
        <Card variant="glass" padding="md" className="text-center">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white text-sm">Race to 100%</h4>
            <span className="text-xs font-mono tabular text-cyan-400">{progress.percentage}%</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            {progress.completed} of {progress.total} categories conquered
          </p>
          <ProgressBar value={progress.percentage} color="gradient" size="sm" />
        </Card>
      </div>

      {/* Main Nav */}
      <nav>
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-2">
          Navigation
        </p>
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={(item as { end?: boolean }).end}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-cyan-500/10 text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className="transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              {item.badge && <Badge variant="neon" size="sm">{item.badge}</Badge>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Categories */}
      <div>
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-2">
          Categories
        </p>
        <div className="space-y-0.5">
          {POLL_CATEGORIES.map((cat) => {
            const isCompleted = completedCategories.includes(cat.toLowerCase());
            return (
              <NavLink
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className={({isActive}) => `
                  flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors
                  ${isCompleted ? 'text-slate-500 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}
                  ${isActive && !isCompleted ? 'text-cyan-300 bg-slate-800/40' : ''}
                `}
              >
                <span className="capitalize">{DEMO_CATEGORY_META[cat]?.label ?? cat}</span>
                {isCompleted ? (
                  <span className="text-[10px] font-bold text-emerald-400">✓ DONE</span>
                ) : (
                  <span className="text-slate-600 text-xs">→</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* AI Match Card */}
      <div className="mt-auto">
        <Card variant="glass" className="border-indigo-500/20 text-center group cursor-pointer transition-transform hover:-translate-y-1">
          <div className="flex justify-center mb-2 text-indigo-300">
            <div className="p-2 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
              <Sparkles size={18} />
            </div>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">AI Matchmaker</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Unlock after completing all 6 categories.
          </p>
        </Card>
      </div>
    </div>
  );
};
