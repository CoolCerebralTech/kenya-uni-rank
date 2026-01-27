import React from 'react';
import { Twitter, Github, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/50 bg-slate-950/30 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-white">Uni<span className="text-cyan-400">Pulse</span></span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs mb-4">
              The student-powered truth engine. Helping 2026 KCSE graduates find their perfect university match through real data, not polished brochures.
            </p>
            <div className="flex gap-4">
              <a href="https://x.com/h_hawkins8" className="text-slate-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
              <a href="https://github.com/CoolCerebralTech" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
              <a href="https://www.linkedin.com/in/howkins-oyugi-8h8h" className="text-slate-400 hover:text-blue-600 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/polls" className="hover:text-cyan-400 transition-colors">Live Polls</Link></li>
              <li><Link to="/leaderboard" className="hover:text-cyan-400 transition-colors">Leaderboard</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">How it Works</Link></li>
              <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">For Students</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">For Alumni</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Partner Unis</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 UniPulse Kenya. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart size={12} className="text-red-500 fill-red-500" />
            <span>for Kenyan Students</span>
          </div>
          <p>v2.0.0 (Phase 2)</p>
        </div>
      </div>
    </footer>
  );
};