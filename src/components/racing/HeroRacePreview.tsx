import React, { useEffect, useState } from 'react';
import { UniversityRacer } from './UniversityRacer';
import type { PollResult } from '../../types/models';
import { universities } from '../../data/universities'; // Direct import for mock data

export const HeroRacePreview: React.FC = () => {
  // Mock data state
  const [results, setResults] = useState<PollResult[]>(() => {
    const topIds = ['uon', 'strath', 'ku', 'usiu', 'jkuat'];
    return topIds.map((id, index) => {
      const uni = universities.find(u => u.id === id)!;
      return {
        pollId: 'demo',
        pollQuestion: 'Demo',
        category: 'vibes',
        cycleMonth: '2026-01',
        universityId: uni.id,
        universityName: uni.name,
        universityShortName: uni.shortName,
        universityColor: uni.color,
        universityType: uni.type,
        votes: 1000 - (index * 100),
        percentage: 20, // Placeholder
        rank: index + 1,
      };
    });
  });

  // Simulate "Live Race"
  useEffect(() => {
    const interval = setInterval(() => {
      setResults(prev => {
        // Randomly adjust votes slightly to simulate activity
        const updated = prev.map(r => ({
          ...r,
          votes: r.votes + Math.floor(Math.random() * 5),
        }));
        
        // Recalculate percentages and sort
        const total = updated.reduce((sum, r) => sum + r.votes, 0);
        return updated
          .map(r => ({ ...r, percentage: (r.votes / total) * 100 }))
          .sort((a, b) => b.votes - a.votes)
          .map((r, i) => ({ ...r, rank: i + 1 }));
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900/50 rounded-2xl border border-slate-800 p-6 backdrop-blur-sm relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <div className="text-[100px] leading-none font-black text-white">?</div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Live Preview</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Which uni rules the vibes?</h2>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <UniversityRacer 
            key={result.universityId}
            result={result}
            isLeader={index === 0}
            // We don't lock the hero preview, we want to tease the data visuals
            isLocked={false} 
          />
        ))}
      </div>

      {/* Glass Overlay at bottom to fade out */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
};