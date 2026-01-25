import React from 'react';
import { Menu, User, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Tooltip } from '../ui/Tooltip';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="h-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-cyan-500 group-hover:scale-105 transition-transform">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Uni<span className="text-cyan-400">Pulse</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">Live Cycle: <span className="text-white">January 2026</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Tooltip content="33% of categories conquered!">
            <div className="flex flex-col items-end">
              <div className="text-xs font-medium text-cyan-400">Level 1</div>
              <div className="w-20 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="w-[33%] h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
              </div>
            </div>
          </Tooltip>
          <Button variant="secondary" size="sm" className="hidden sm:flex" leftIcon={<User size={16} />}>My Profile</Button>
          <button className="md:hidden p-2 text-slate-400 hover:text-white"><Menu size={24} /></button>
        </div>
      </div>
    </header>
  );
};