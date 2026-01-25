import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, BrainCircuit, Target, ArrowRight } from 'lucide-react';

interface AIPreviewCardProps {
  onClick: () => void;
}

export const AIPreviewCard: React.FC<AIPreviewCardProps> = ({ onClick }) => {
  return (
    <Card 
      variant="outlined" 
      className="group relative overflow-hidden cursor-pointer border-violet-500/30 hover:border-violet-500/60 bg-gradient-to-br from-slate-950 to-violet-950/20"
      onClick={onClick}
    >
      {/* Background Circuit Effect */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-colors" />

      <div className="relative z-10 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-violet-900/30 rounded-lg text-violet-400 border border-violet-500/20">
            <BrainCircuit size={24} />
          </div>
          <Badge variant="neon" size="sm" className="animate-pulse">
            Coming Soon
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
          UniPulse Matchmaker AI
        </h3>
        
        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
          Stop guessing. Our AI analyzes your grades, budget, and vibe preference to find your top 3 perfect matches.
        </p>

        <ul className="space-y-2 mb-6">
          {[
            { icon: Target, text: "Personalized Vibe Matching" },
            { icon: Sparkles, text: "Real Student Truth Data" },
            { icon: BrainCircuit, text: "No Sponsor Bias" },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
              <item.icon size={12} className="text-violet-400" />
              {item.text}
            </li>
          ))}
        </ul>

        <div className="flex items-center text-sm font-bold text-violet-400 group-hover:translate-x-1 transition-transform">
          View Prototype <ArrowRight size={16} className="ml-2" />
        </div>
      </div>
    </Card>
  );
};