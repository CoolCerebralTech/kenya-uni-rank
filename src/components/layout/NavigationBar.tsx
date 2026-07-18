import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, BarChart3, Vote, Sparkles } from 'lucide-react';

// UniPulse v3 — refined bottom navigation for mobile.
// Active indicator: filled pill background + cyan accent + soft glow.
// Height respects iOS safe-area.
// BUG FIX: removed the inner <NavLink> rendering as indicator (invalid JSX double
// NavLink children). Now using a single NavLink with active-styled ::before bar.

interface NavItem {
  name: string;
  icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }>;
  path: string;
  end?: boolean;
  accent?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', icon: Home, path: '/', end: true },
  { name: 'Vote', icon: Vote, path: '/polls' },
  { name: 'Ranks', icon: Trophy, path: '/leaderboard' },
  { name: 'Trends', icon: BarChart3, path: '/trends' },
  { name: 'About', icon: Sparkles, path: '/about' },
];

export const NavigationBar: React.FC = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-800/80 pb-safe-area md:hidden"
      aria-label="Primary mobile navigation"
    >
      <div className="flex justify-around items-stretch h-14">
        {NAV_ITEMS.map(({ name, icon: Icon, path, end, accent }) => (
          <NavLink
            key={name}
            to={path}
            end={end}
            className={({ isActive }) => `
              relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-200
              ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}
              ${accent ? 'accent-glow' : ''}
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active indicator pill — top of icon */}
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
