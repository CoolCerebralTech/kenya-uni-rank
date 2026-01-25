import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, BarChart2, User, Vote } from 'lucide-react';

export const NavigationBar: React.FC = () => {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Vote', icon: Vote, path: '/polls' },
    { name: 'Results', icon: BarChart2, path: '/results', badge: 3 },
    { name: 'Rankings', icon: Trophy, path: '/leaderboard' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  const handleTap = () => {
    // Haptic feedback for mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 pb-safe-area">
      <div className="flex justify-around items-center h-16 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={handleTap}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center w-full h-full space-y-1
              transition-all duration-200
              ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-1 rounded-xl transition-all ${isActive ? 'bg-cyan-500/10' : ''}`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-950">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.name}</span>
                
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute top-0 w-8 h-0.5 bg-cyan-400 rounded-b-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};