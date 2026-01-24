import { useState, useEffect } from 'react';

interface RacerData {
  id: string;
  name: string;
  shortName: string;
  color: string;
  percentage: number;
}

// Mock teaser data - updates every 3 seconds
const MOCK_RACERS: RacerData[] = [
  { id: 'uon', name: 'University of Nairobi', shortName: 'UoN', color: '#1E3A8A', percentage: 28 },
  { id: 'ku', name: 'Kenyatta University', shortName: 'KU', color: '#0F766E', percentage: 24 },
  { id: 'strath', name: 'Strathmore University', shortName: 'Strathmore', color: '#1e3a8a', percentage: 22 },
  { id: 'jkuat', name: 'JKUAT', shortName: 'JKUAT', color: '#15803D', percentage: 15 },
  { id: 'usiu', name: 'USIU-Africa', shortName: 'USIU', color: '#F59E0B', percentage: 11 },
];

export function HeroRacePreview() {
  const [racers, setRacers] = useState(MOCK_RACERS);
  const [pulse, setPulse] = useState(false);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRacers(prev => {
        const updated = prev.map(racer => ({
          ...racer,
          percentage: Math.max(5, Math.min(35, racer.percentage + (Math.random() - 0.5) * 4)),
        }));
        return updated.sort((a, b) => b.percentage - a.percentage);
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl" />
      
      {/* Content Container */}
      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-bold text-red-400 uppercase tracking-wide">
              Live Race Preview
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            The University Rankings
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Students Actually Trust
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Find the university that fits your vibe — powered by real student and alumni voices across Kenya
          </p>
        </div>

        {/* Racing Visualization */}
        <div className="space-y-3">
          {racers.map((racer, index) => (
            <div
              key={racer.id}
              className={`relative transition-all duration-500 ${pulse ? 'scale-[1.01]' : ''}`}
            >
              {/* Medal for top 3 */}
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-2xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
              </div>

              {/* Bar Container */}
              <div className="relative h-16 bg-slate-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/30">
                {/* Animated Bar */}
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
                  style={{
                    width: `${racer.percentage}%`,
                    backgroundColor: racer.color,
                    opacity: 0.8,
                  }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: racer.color }}
                    >
                      {racer.shortName.charAt(0)}
                    </div>
                    <span className="font-bold text-white">{racer.shortName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">
                      {racer.percentage.toFixed(1)}%
                    </span>
                    {index < 3 && (
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: racer.color }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Teaser Notice */}
        <div className="relative p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">👀</span>
            <div className="flex-1 space-y-1">
              <div className="text-sm font-bold text-amber-400">
                This is Ghost Mode
              </div>
              <div className="text-xs text-slate-400">
                These are teaser rankings. Vote to unlock the real standings and see what students actually think.
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-white text-lg overflow-hidden transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50">
            <span className="relative z-10">🏁 Join the Race</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-xl font-semibold text-white transition-all duration-300">
            How it Works
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700/50">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-white">20</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Universities</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-cyan-400">95+</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Live Polls</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-green-400">Real-Time</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
}