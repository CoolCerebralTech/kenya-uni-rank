import React, { useState } from 'react';
import { Bell, Menu, User, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
// Assuming react-router-dom is used, otherwise replace Link with a tag
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/60">
      <div className="h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-cyan-500 group-hover:scale-105 transition-transform">
            <Zap className="text-white w-5 h-5 fill-current" />
            <div className="absolute -inset-1 bg-cyan-500/30 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-none">
              Uni<span className="text-cyan-400">Pulse</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-none">
              Kenya
            </span>
          </div>
        </Link>

        {/* Center: Cycle Indicator (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">Live Cycle: <span className="text-white">Jan 2026</span></span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Progress (Mobile/Desktop) */}
          <div className="flex flex-col items-end mr-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-400">
              <span>Level 1</span>
              <span className="block md:hidden text-slate-500">| Jan '26</span>
            </div>
            <div className="w-16 h-1 bg-slate-800 rounded-full mt-0.5">
              <div className="w-[30%] h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
            </div>
          </div>

          <button className="hidden sm:flex relative p-2 text-slate-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950" />
          </button>

          <Button 
            variant="secondary" 
            size="sm" 
            className="hidden sm:flex"
            leftIcon={<User size={16} />}
          >
            Sign In
          </Button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Simple implementation) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 animate-in slide-in-from-top-5">
           <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
               <span className="text-sm text-slate-400">Current Cycle</span>
               <Badge variant="success" dot>Jan 2026</Badge>
             </div>
             <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" fullWidth>My Profile</Button>
                <Button variant="ghost" fullWidth>Settings</Button>
             </div>
           </div>
        </div>
      )}
    </header>
  );
};