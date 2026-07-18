import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UniPulseLogo from '../../assets/unipulse.svg';
import { isSupabaseConfigured } from '../../lib/supabase';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const live = isSupabaseConfigured;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-800/60 glass pt-safe-area">
      <div className="h-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative">
            <img 
              src={UniPulseLogo} 
              alt="UniPulse Logo" 
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-cyan-500/30 blur-md -z-10 group-hover:bg-cyan-400/50 transition-colors" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Uni<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Pulse</span>
          </span>
        </Link>

        {/* CENTER STATUS (desktop only) */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/80">
            <div className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${live ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${live ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
            <span className="text-xs font-medium text-slate-300">
              {live ? (
                <>Live: <span className="text-white">July 2026 Cycle</span></>
              ) : (
                <span className="text-amber-400">Demo Mode</span>
              )}
            </span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile: compact profile avatar */}
          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="Profile"
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
