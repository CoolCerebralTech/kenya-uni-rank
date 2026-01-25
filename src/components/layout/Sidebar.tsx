import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Vote, Trophy, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Mission Control', icon: Home, path: '/' },
    { name: 'Active Polls', icon: Vote, path: '/polls' },
    { name: 'Leaderboards', icon: Trophy, path: '/leaderboard' },
    { name: 'Trends & Insights', icon: TrendingUp, path: '/trends', badge: 'New' },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-4">
      {/* Navigation */}
      <nav className="space-y-1 mb-8">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-blue-600/10 text-cyan-400 border border-blue-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <Badge variant="neon" size="sm">{item.badge}</Badge>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Categories Quick Links */}
      <div className="mb-8">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Categories
        </p>
        <div className="space-y-1">
          {['Vibes', 'Academics', 'Sports', 'Facilities', 'Social'].map((cat) => (
            <NavLink
              key={cat}
              to={`/polls?category=${cat.toLowerCase()}`}
              className="block px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/30 transition-colors"
            >
              # {cat}
            </NavLink>
          ))}
        </div>
      </div>

      {/* AI Teaser Card - Pushed to bottom */}
      <div className="mt-auto">
        <Card variant="outlined" className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2 text-indigo-400">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Coming Soon</span>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">AI Matchmaker</h4>
          <p className="text-xs text-slate-400 mb-3">
            Finding your perfect uni fit using real student data.
          </p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[65%] rounded-full animate-pulse" />
          </div>
          <p className="text-[10px] text-right text-indigo-400 mt-1">65% Complete</p>
        </Card>
      </div>
    </div>
  );
};