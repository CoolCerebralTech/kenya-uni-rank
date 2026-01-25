import React from 'react';
import type { PollResult } from '../../types/models';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

const PodiumStep: React.FC<{ result: PollResult; place: number; height: string }> = ({ result, place, height }) => (
  <motion.div 
    className="flex flex-col items-center w-full"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 100, damping: 15, delay: (3 - place) * 0.1 }}
  >
    <div className={`mb-2 ${place === 1 && 'animate-bounce-slow'}`}>
      {place === 1 && <Trophy className="w-10 h-10 text-yellow-400 fill-yellow-400" />}
      {place === 2 && <Medal className="w-8 h-8 text-slate-300 fill-slate-300" />}
      {place === 3 && <Medal className="w-8 h-8 text-amber-700 fill-amber-700" />}
    </div>
    <div className={`w-16 h-16 rounded-full border-4 shadow-lg mb-2 flex items-center justify-center text-lg font-black text-white z-10`} style={{ backgroundColor: result.universityColor, borderColor: place === 1 ? '#facc15' : '#1e293b' }}>
      {result.universityShortName}
    </div>
    <div className={`w-full rounded-t-lg relative flex flex-col items-center justify-center p-2 text-center ${place === 1 ? 'bg-slate-800' : 'bg-slate-900'}`} style={{ height }}>
      <span className={`block text-2xl font-bold ${place === 1 ? 'text-white' : 'text-slate-300'}`}>{result.percentage.toFixed(0)}%</span>
      <span className="text-xs text-slate-500">{result.votes.toLocaleString()} votes</span>
    </div>
  </motion.div>
);

export const PodiumView: React.FC<{ results: PollResult[] }> = ({ results }) => {
  if (results.length < 3) return <div className="text-center text-slate-500 p-8">Not enough data for a podium.</div>;
  const [first, second, third] = results;

  return (
    <div className="flex items-end justify-center gap-2 h-72">
      <div className="w-1/4 h-full flex items-end"><PodiumStep result={second} place={2} height="65%" /></div>
      <div className="w-1/3 h-full flex items-end"><PodiumStep result={first} place={1} height="90%" /></div>
      <div className="w-1/4 h-full flex items-end"><PodiumStep result={third} place={3} height="45%" /></div>
    </div>
  );
};