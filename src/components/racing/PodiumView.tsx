import { memo } from 'react';
import type { PollResult } from '../../types/models';
import { Crown, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

// UniPulse v3 — refined podium. Uses framer-motion to spring-rise the steps
// from below; first place floats a crown with a soft pulse.
const PodiumStep = memo<{ result: PollResult; place: number; height: string }>(({ result, place, height }) => {
  const baseGrad =
    place === 1
      ? 'from-amber-500/30 via-amber-500/10 to-transparent'
      : place === 2
      ? 'from-slate-500/30 via-slate-500/10 to-transparent'
      : 'from-amber-900/30 via-amber-900/10 to-transparent';

  return (
    <motion.div
      className="relative flex flex-col items-center w-full"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 110, damping: 14, delay: (3 - place) * 0.12 }}
    >
      {/* Logo mark */}
      <div
        className={`relative mb-1 ${place === 1 ? 'animate-pulse-soft' : ''}`}
      >
        {place === 1 && (
          <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 text-amber-300 fill-amber-400 drop-shadow" />
        )}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 shadow-2xl flex items-center justify-center text-base font-black text-white z-10"
          style={{
            backgroundColor: result.universityColor,
            borderColor: place === 1 ? '#fcd34d' : place === 2 ? '#cbd5e1' : '#a16207',
          }}
        >
          {result.universityShortName}
        </div>
      </div>

      {/* Podium step */}
      <div
        className={`relative w-full rounded-t-xl flex flex-col items-center justify-center p-2 text-center bg-gradient-to-b ${baseGrad} border-t-2 ${
          place === 1 ? 'border-amber-400/60' : place === 2 ? 'border-slate-400/40' : 'border-amber-800/40'
        }`}
        style={{ height }}
      >
        {place === 2 && <Medal className="absolute top-2 right-2 w-4 h-4 text-slate-400 fill-slate-500" />}
        {place === 3 && <Medal className="absolute top-2 right-2 w-4 h-4 text-amber-800 fill-amber-900" />}
        <span className={`text-xl sm:text-2xl font-black tabular ${place === 1 ? 'text-white' : 'text-slate-200'}`}>
          {result.percentage.toFixed(0)}%
        </span>
        <span className="text-[10px] text-slate-500 font-mono tabular uppercase tracking-wider">
          {result.votes.toLocaleString()} votes
        </span>
      </div>
    </motion.div>
  );
});

PodiumStep.displayName = 'PodiumStep';

export const PodiumView = memo<{ results: PollResult[] }>(({ results }) => {
  if (results.length < 3) {
    return (
      <div className="text-center text-slate-500 p-8">
        Not enough data for a podium yet.
      </div>
    );
  }

  const [first, second, third] = results;
  return (
    <div className="relative pt-6 pb-2">
      {/* Names above the top of the podium */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 mb-3">
        <div className="w-1/4 text-center">
          <p className="text-sm font-bold text-slate-200 truncate">{second.universityName}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">2nd</p>
        </div>
        <div className="w-1/3 text-center">
          <p className="text-base sm:text-lg font-black text-white truncate">{first.universityName}</p>
          <p className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">★ Champion</p>
        </div>
        <div className="w-1/4 text-center">
          <p className="text-sm font-bold text-slate-200 truncate">{third.universityName}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">3rd</p>
        </div>
      </div>
      {/* Podium steps */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 h-56 sm:h-64">
        <div className="w-1/4 h-full flex items-end">
          <PodiumStep result={second} place={2} height="65%" />
        </div>
        <div className="w-1/3 h-full flex items-end">
          <PodiumStep result={first} place={1} height="92%" />
        </div>
        <div className="w-1/4 h-full flex items-end">
          <PodiumStep result={third} place={3} height="48%" />
        </div>
      </div>
    </div>
  );
});

PodiumView.displayName = 'PodiumView';
