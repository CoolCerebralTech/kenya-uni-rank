import React, { useEffect, useState } from 'react';
import { UniversityRacer } from './UniversityRacer';
import type { PollResult } from '../../types/models';
// REAL DATA INTEGRATION
import { getPollWithResults } from '../../services/database.service';
import { RacingSkeleton } from '../ui/RacingSkeleton';
import { motion } from 'framer-motion';

// This slug should correspond to a high-engagement poll like 'best-vibes'
const HERO_POLL_SLUG = 'best-vibes';

export const HeroRacePreview: React.FC = () => {
  const [raceData, setRaceData] = useState<PollResult[] | null>(null);
  const [pollQuestion, setPollQuestion] = useState('Which uni has the best vibes?');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroRace = async () => {
      setIsLoading(true);
      const { data, error } = await getPollWithResults(HERO_POLL_SLUG);
      if (data) {
        setRaceData(data.results.slice(0, 5)); // Show top 5
        if (data.poll) setPollQuestion(data.poll.question);
      } else {
        console.error("Hero Race Error:", error);
      }
      setIsLoading(false);
    };
    fetchHeroRace();
  }, []);

  if (isLoading) {
    return <RacingSkeleton />;
  }
  if (!raceData || raceData.length === 0) {
    return <div className="text-center p-8 text-slate-500">Could not load live preview.</div>;
  }

  return (
    <div className="w-full bg-slate-900/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></div>
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Live Race Preview</h3>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{pollQuestion}</h2>

        <motion.div 
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {raceData.map((result) => (
            <UniversityRacer key={result.universityId} result={result} isLeader={result.rank === 1} isLocked={false} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};