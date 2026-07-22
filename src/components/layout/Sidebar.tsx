import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, GitCompare, Search, Info, BarChart3 } from 'lucide-react';

// UniPulse v4 — lean sidebar for the university comparison dashboard.
// Old voting/polling/progress/AI-matchmaker sections removed.

export const Sidebar: React.FC = () => {
  const menuItems = [
    { name: 'Home', icon: Home, path: '/', end: true },
    { name: 'Compare', icon: GitCompare, path: '/compare' },
    { name: 'Explore', icon: Search, path: '/explore' },
    { name: 'Rankings', icon: BarChart3, path: '/rankings' },
    { name: 'About', icon: Info, path: '/about' },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar p-4 space-y-6 no-scrollbar">
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
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-cyan-500/10 text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }
              `}
            >
              <item.icon size={18} className="transition-transform group-hover:scale-110" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Universities quick access */}
      <div>
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-2">
          Top Universities
        </p>
        <div className="space-y-0.5">
          {TOP_UNIS.map((uni) => (
            <NavLink
              key={uni.slug}
              to={`/university/${uni.slug}`}
              className={({ isActive }) => `
                flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors
                ${isActive
                  ? 'text-cyan-300 bg-slate-800/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }
              `}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white shrink-0"
                style={{ backgroundColor: uni.color }}
              >
                {uni.shortName.slice(0, 2)}
              </div>
              <span className="truncate">{uni.shortName}</span>
              <span className="ml-auto text-[10px] text-slate-600">#{uni.rank}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

// Top 5 ranked unis for quick access
const TOP_UNIS = [
  { slug: 'strath', shortName: 'Strathmore', color: '#1e3a8a', rank: 1 },
  { slug: 'usiu', shortName: 'USIU', color: '#F59E0B', rank: 2 },
  { slug: 'ku', shortName: 'KU', color: '#0F766E', rank: 3 },
  { slug: 'jkuat', shortName: 'JKUAT', color: '#15803D', rank: 4 },
  { slug: 'uon', shortName: 'UoN', color: '#1E3A8A', rank: 6 },
];
