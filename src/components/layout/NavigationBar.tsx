import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, GitCompare, Search, Info, BarChart3 } from 'lucide-react';

// UniPulse v4 — mobile bottom nav. Old voting/polls/trends tabs removed.
// 5 tabs: Home, Compare, Explore, Rankings, About.

const NAV_ITEMS: Array<{ name: string; icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }>; path: string; end?: boolean }> = [
  { name: 'Home', icon: Home, path: '/', end: true },
  { name: 'Compare', icon: GitCompare, path: '/compare' },
  { name: 'Explore', icon: Search, path: '/explore' },
  { name: 'Ranks', icon: BarChart3, path: '/rankings' },
  { name: 'About', icon: Info, path: '/about' },
];

export const NavigationBar: React.FC = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-800/80 pb-safe-area md:hidden"
      aria-label="Primary mobile navigation"
    >
      <div className="flex justify-around items-stretch h-14">
        {NAV_ITEMS.map(({ name, icon: Icon, path, end }) => (
          <NavLink
            key={name}
            to={path}
            end={end}
            className={({ isActive }) => `
              relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200
              ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar — top of icon */}
                <span
                  aria-hidden
                  className={`absolute top-0 h-1 w-8 rounded-b-full transition-all duration-300 ${
                    isActive ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'bg-transparent'
                  }`}
                />
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} className={isActive ? 'scale-110 transition-transform' : 'transition-transform'} />
                <span className="text-[9px] font-bold tracking-wide uppercase leading-none">{name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
