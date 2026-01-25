import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/Card';
import { Activity } from 'lucide-react';

interface VoteActivity {
  id: string;
  universityShortName: string;
  universityColor: string;
  category: string;
  timestamp: string;
  voterType: string;
}

export const LiveFeed: React.FC = () => {
  // Mock data generator for the demo
  const [activities, setActivities] = useState<VoteActivity[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate incoming votes
    const unis = [
      { name: 'UoN', color: '#1e3a8a' }, 
      { name: 'KU', color: '#0f766e' }, 
      { name: 'Strath', color: '#1e3a8a' },
      { name: 'USIU', color: '#f59e0b' },
      { name: 'JKUAT', color: '#15803d' }
    ];
    const cats = ['Vibes', 'Sports', 'Academics', 'Social'];
    const types = ['Student', 'Alumni', 'Applicant'];

    const addVote = () => {
      const uni = unis[Math.floor(Math.random() * unis.length)];
      const newVote: VoteActivity = {
        id: Math.random().toString(36),
        universityShortName: uni.name,
        universityColor: uni.color,
        category: cats[Math.floor(Math.random() * cats.length)],
        timestamp: 'Just now',
        voterType: types[Math.floor(Math.random() * types.length)],
      };
      
      setActivities(prev => [newVote, ...prev].slice(0, 20)); // Keep last 20
    };

    const interval = setInterval(addVote, 2000 + Math.random() * 3000);
    addVote(); // Initial
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-slate-950/50 border-slate-800">
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="relative">
          <Activity size={16} className="text-green-500" />
          <div className="absolute inset-0 bg-green-500 blur-sm opacity-50 animate-pulse" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Live Pulse
        </span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-hidden relative space-y-3 mask-image-b-fade"
      >
        {activities.map((item) => (
          <div 
            key={item.id}
            className="flex items-center gap-3 text-sm animate-in slide-in-from-top-2 fade-in duration-500"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]" />
            
            <span className="text-slate-500 text-xs font-mono">
              [{item.timestamp}]
            </span>
            
            <div className="flex-1 truncate text-slate-300">
              <span className="text-white font-bold">{item.voterType}</span> voted for{' '}
              <span 
                style={{ color: item.universityColor }} 
                className="font-bold"
              >
                {item.universityShortName}
              </span>{' '}
              in <span className="text-slate-400">{item.category}</span>
            </div>
          </div>
        ))}
        
        {/* Gradient Mask for Fade Out */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      </div>
    </Card>
  );
};