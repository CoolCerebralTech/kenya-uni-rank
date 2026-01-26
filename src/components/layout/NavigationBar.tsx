import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, BarChart2, Vote } from 'lucide-react';

export const NavigationBar: React.FC = () => {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Vote', icon: Vote, path: '/polls' }, // Fix: Pointing to /polls listing instead of non-existent /voting
    { name: 'Results', icon: BarChart2, path: '/results' },
    { name: 'Rankings', icon: Trophy, path: '/leaderboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 pb-safe-area md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200
              ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            <item.icon size={22} strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-wide uppercase">{item.name}</span>
            
            {/* The active indicator bar */}
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                isActive 
                  ? "absolute top-0 w-10 h-1 bg-cyan-400 rounded-b-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                  : "hidden"
              }
            />
          </NavLink>
        ))}
      </div>
    </nav>
  );
};