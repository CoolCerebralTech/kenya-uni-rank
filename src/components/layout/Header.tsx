import React from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import UniPulseLogo from '../../assets/unipulse.svg';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="h-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img 
            src={UniPulseLogo} 
            alt="UniPulse Logo" 
            className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" 
          />
          <span className="text-lg font-bold tracking-tight text-white">
            Uni<span className="text-cyan-400">Pulse</span>
          </span>
        </Link>

        {/* CENTER STATUS (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">
              Live Cycle: <span className="text-white">January 2026</span>
            </span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* LEVEL SECTION - ✅ TS + ARIA + Windsurf FIXED */}
          <div className="flex flex-col items-end select-none" role="group" aria-label="User level progress">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Level 1
            </div>
            <div 
              className="w-20 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden border border-white/5 relative" 
              role="progressbar"
              aria-label="User progress level"
              // ✅ STRINGS for Windsurf/axe + data- attributes for TS
              data-valuenow="33"
              data-valuemin="0"
              data-valuemax="100"
              tabIndex={-1}
            >
              <div 
                className="w-[33%] h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full absolute inset-0" 
              />
              <span className="sr-only">33% complete (Level 1 progress)</span>
            </div>
          </div>
          
          <Button 
            variant="secondary" 
            size="sm" 
            type="button" 
            className="hidden sm:flex" 
            leftIcon={<User size={16} />}
            onClick={() => navigate('/profile')}
          >
            My Profile
          </Button>
          
          <button 
            type="button"
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Open navigation menu"
            title="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};
