import React from 'react';
import { Lock, Eye } from 'lucide-react';
import { Button } from '../ui/Button';

interface GhostModeProps {
  onVote: () => void;
}

export const GhostMode: React.FC<GhostModeProps> = ({ onVote }) => {
  return (
    <div className="absolute inset-0 z-20 backdrop-blur-md bg-slate-950/40 flex flex-col items-center justify-center text-center p-6 border-t border-slate-800/50">
      
      <div className="bg-slate-900/80 p-4 rounded-full border border-slate-700 shadow-xl shadow-black mb-4">
        <Lock className="w-8 h-8 text-cyan-400" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        Results are Locked
      </h3>
      
      <p className="text-slate-300 text-sm max-w-xs mb-6">
        To see the real truth, you must contribute yours. 
        <br/><span className="text-slate-500 italic">No lurkers allowed.</span>
      </p>

      <Button 
        variant="neon" 
        size="lg" 
        onClick={onVote}
        leftIcon={<Eye size={18} />}
        className="animate-pulse hover:animate-none"
      >
        Reveal Results
      </Button>

      <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">
        Encrypted • Anonymous • Secure
      </p>
    </div>
  );
};