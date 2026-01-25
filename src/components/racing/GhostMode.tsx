import React from 'react';
import { Lock, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const GhostMode: React.FC<{ onVote: () => void }> = ({ onVote }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 backdrop-blur-md bg-slate-950/60 flex flex-col items-center justify-center text-center p-6"
    >
      <div className="relative flex items-center justify-center w-16 h-16 bg-slate-900/80 rounded-full border border-slate-700 shadow-xl mb-4">
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
        <Lock className="w-8 h-8 text-cyan-400 relative z-10" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">The Truth is Locked</h3>
      <p className="text-slate-300 text-sm max-w-xs mb-6">Contribute your vote to unlock the real-time student sentiment.</p>
      <Button variant="neon" size="lg" onClick={onVote} leftIcon={<Eye size={18} />}>Cast Your Vote</Button>
    </motion.div>
  );
};