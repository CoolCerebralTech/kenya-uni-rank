import React from 'react';
import { Twitter, Github, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

// UniPulse v3 — refined footer. Tighter spacing, cleaner headings.
export const Footer: React.FC = () => {
  return (
    <footer className="hidden md:block w-full border-t border-slate-800/50 bg-slate-950/30 pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-black text-white">
                Uni<span className="text-cyan-400">Pulse</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs mb-3">
              The student-powered truth engine. Helping Kenyan students find their perfect university match through real data, not polished brochures.
            </p>
            <div className="flex gap-3">
              <a href="https://x.com/h_hawkins8" className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="Twitter"><Twitter size={16} /></a>
              <a href="https://github.com/CoolCerebralTech" className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="GitHub"><Github size={16} /></a>
              <a href="https://www.linkedin.com/in/howkins-oyugi-8h8h" className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="LinkedIn"><Linkedin size={16} /></a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-3">Platform</h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><Link to="/polls" className="hover:text-cyan-400 transition-colors">Live Polls</Link></li>
              <li><Link to="/leaderboard" className="hover:text-cyan-400 transition-colors">Leaderboard</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-3">Community</h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">For Students</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">For Alumni</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Partner Unis</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-600 uppercase tracking-wider font-bold">
          <p>© 2026 UniPulse Kenya</p>
          <div className="flex items-center gap-1 normal-case tracking-normal font-normal">
            <span>Built with</span>
            <Heart size={10} className="text-rose-500 fill-rose-500" />
            <span>for Kenyan Students</span>
          </div>
          <p>v3.0.0</p>
        </div>
      </div>
    </footer>
  );
};
