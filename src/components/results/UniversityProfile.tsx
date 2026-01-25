import React from 'react';
import type { University } from '../../types/models';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressRing } from '../gamification/ProgressRing';
import { MapPin, Globe, Calendar, Users } from 'lucide-react';

interface UniversityProfileProps {
  university: University;
  stats: {
    sentimentScore: number;
    totalVotes: number;
    rank: number;
    strengths: string[];
    weaknesses: string[];
  };
}

export const UniversityProfile: React.FC<UniversityProfileProps> = ({ university, stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Identity Card */}
      <div className="lg:col-span-1">
        <Card className="relative overflow-hidden h-full flex flex-col items-center text-center p-8 border-t-4" style={{ borderTopColor: university.color }}>
          
          {/* Logo Placeholder */}
          <div 
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl mb-6 relative z-10"
            style={{ backgroundColor: university.color }}
          >
            {university.shortName}
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{university.name}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <Badge variant={university.type === 'Public' ? 'info' : 'warning'}>{university.type}</Badge>
            <span className="text-slate-500 text-sm flex items-center gap-1">
              <MapPin size={12} /> {university.location}
            </span>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-800 pt-6 mt-auto">
             <div>
               <div className="text-3xl font-bold text-white">#{stats.rank}</div>
               <div className="text-[10px] text-slate-500 uppercase tracking-widest">National Rank</div>
             </div>
             <div>
               <div className="text-3xl font-bold text-white">{stats.totalVotes}</div>
               <div className="text-[10px] text-slate-500 uppercase tracking-widest">Total Votes</div>
             </div>
          </div>
        </Card>
      </div>

      {/* Stats & Insights */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Sentiment Score */}
        <Card className="flex items-center justify-between p-6 bg-slate-900/80">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Student Sentiment</h3>
            <p className="text-sm text-slate-400">Based on recent voting cycles</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-2xl font-bold text-cyan-400">{stats.sentimentScore}%</span>
              <span className="text-xs text-slate-500">Positive</span>
            </div>
            <ProgressRing progress={stats.sentimentScore} radius={35} stroke={4} color={university.color} />
          </div>
        </Card>

        {/* Strengths / Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h4 className="font-bold text-green-400 mb-4 uppercase text-xs tracking-wider border-b border-slate-800 pb-2">
              Core Strengths
            </h4>
            <ul className="space-y-2">
              {stats.strengths.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h4 className="font-bold text-red-400 mb-4 uppercase text-xs tracking-wider border-b border-slate-800 pb-2">
              Areas for Growth
            </h4>
            <ul className="space-y-2">
              {stats.weaknesses.map((s, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Founded', value: '1970', icon: Calendar },
            { label: 'Students', value: '84k+', icon: Users },
            { label: 'Website', value: 'Visit', icon: Globe },
          ].map((item, i) => (
             <div key={i} className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 flex flex-col items-center text-center">
               <item.icon size={16} className="text-slate-500 mb-2" />
               <span className="text-sm font-bold text-white">{item.value}</span>
               <span className="text-[10px] text-slate-500 uppercase">{item.label}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};