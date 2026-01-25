import React from 'react';
import { Card } from '../ui/Card';
import { Calendar, TrendingUp, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const MonthlyRecap: React.FC = () => {
  return (
    <Card 
      className="relative overflow-hidden border-yellow-500/30"
      style={{
        background: 'linear-gradient(to bottom right, #1e1b4b, #312e81)'
      }}
    >
      {/* Confetti overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      
      <div className="relative z-10 p-2">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-yellow-400">
             <Calendar size={16} />
             <span className="text-xs font-bold uppercase tracking-widest">January Recap</span>
          </div>
          <div className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs font-bold border border-yellow-500/30">
            Cycle Closed
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-6">
          The Votes Are In!
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 text-slate-300 text-xs mb-1">
              <Trophy size={12} className="text-yellow-400" /> Top Uni
            </div>
            <p className="text-lg font-bold text-white">Strathmore</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 text-slate-300 text-xs mb-1">
              <TrendingUp size={12} className="text-green-400" /> Rising Star
            </div>
            <p className="text-lg font-bold text-white">Zetech</p>
          </div>
        </div>

        <Button 
          variant="secondary" 
          fullWidth 
          rightIcon={<ArrowRight size={16} />}
          className="bg-white/10 hover:bg-white/20 border-white/10 text-white"
        >
          View Full Report
        </Button>
      </div>
    </Card>
  );
};