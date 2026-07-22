import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UniPulseLogo from '../../assets/unipulse.svg';
import { GitCompare } from 'lucide-react';

// UniPulse v4 — clean header. No more Live/Demo mode badge (we're a
// static comparison site, not a live polling platform). Just logo + compare CTA.

export const Header: React.FC = () => {
  const navigate = useNavigate();

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

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate('/compare')}
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-bold text-slate-300 bg-slate-900/60 border border-slate-800 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
          >
            <GitCompare size={14} /> Compare
          </button>

          {/* Mobile: just logo dot (mobile bottom nav handles navigation) */}
          <div className="sm:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-black text-cyan-400">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
