import React from 'react';
import { Timer, Share2, Hammer } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const MemeOverlay: React.FC = () => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
      <div className="relative w-full aspect-video bg-slate-800 rounded-lg mb-6 flex items-center justify-center group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent" />
        <div className="text-center">
          <Hammer size={48} className="text-slate-600 mx-auto mb-2 animate-bounce" />
          <p className="text-slate-500 text-xs font-mono uppercase">System Upgrade in Progress</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
           <h3 className="text-2xl font-black text-white uppercase tracking-tighter drop-shadow-[2px_2px_0px_rgba(139,92,246,1)]">
             We're Cooking 🔥
           </h3>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">The AI is Learning...</h3>
      <p className="text-slate-400 text-sm mb-6">
        We're processing thousands of votes from the <strong className="text-violet-400">Phase 1</strong> data drop. The next wave of insights will be even smarter.
      </p>

      <div className="space-y-3 text-left">
        <ProgressBar value={85} color="success" size="sm" showValue label="Phase 1 Data Collection" />
        <ProgressBar value={40} color="gradient" size="sm" showValue label="Neural Network Training" striped />
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 border-t border-slate-800 pt-4 mt-6">
        <span className="flex items-center gap-1.5"><Timer size={14} /> Next Phase: Post-Feb 2026</span>
        <button className="flex items-center gap-1.5 hover:text-white transition-colors"><Share2 size={14} /> Share The Hype</button>
      </div>
    </div>
  );
};