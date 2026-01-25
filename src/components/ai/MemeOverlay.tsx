import React from 'react';
import { Timer, Share2, Hammer } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const MemeOverlay: React.FC = () => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
      
      {/* Meme Placeholder */}
      <div className="relative w-full aspect-video bg-slate-800 rounded-lg overflow-hidden mb-6 flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-transparent opacity-50" />
        
        {/* Placeholder Art for Meme */}
        <div className="text-center">
            <Hammer size={48} className="text-slate-600 mx-auto mb-2 animate-bounce" />
            <p className="text-slate-500 text-xs font-mono uppercase">Construction in progress</p>
        </div>
        
        {/* Glitch Text Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
           <h3 className="text-2xl font-black text-white uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-[2px_2px_0px_rgba(139,92,246,1)]">
             Chill Kiasi ✋
           </h3>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        Patience, young grasshopper 🦗
      </h3>
      
      <p className="text-slate-400 text-sm mb-6">
        We are training the AI on thousands of votes (yours included). 
        Real magic takes time. No hallucinations allowed.
      </p>

      {/* Progress Bars */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider">
          <span>Data Collection</span>
          <span className="text-green-400">85% Ready</span>
        </div>
        <ProgressBar value={85} color="success" size="sm" striped />
        
        <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider mt-2">
          <span>AI Neural Training</span>
          <span className="text-violet-400">40% Loading...</span>
        </div>
        <ProgressBar value={40} color="primary" size="sm" />
      </div>

      {/* Estimated Arrival */}
      <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 border-t border-slate-800 pt-4">
        <span className="flex items-center gap-1">
          <Timer size={14} /> ETA: Post-Feb 2026
        </span>
        <button className="flex items-center gap-1 hover:text-white transition-colors">
          <Share2 size={14} /> Share the hype
        </button>
      </div>
    </div>
  );
};