import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Flame, GraduationCap, DollarSign, Star, TrendingUp } from 'lucide-react';

const categories = [
  { 
    id: 'vibes', 
    name: 'Campus Life & Vibes', 
    icon: Flame, 
    gradient: 'from-pink-500 to-rose-500',
    bg: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
    border: 'border-pink-500/30'
  },
  { 
    id: 'sports', 
    name: 'Sports & Facilities', 
    icon: Trophy, 
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/30'
  },
  { 
    id: 'academics', 
    name: 'Academic Quality', 
    icon: GraduationCap, 
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/30'
  },
  { 
    id: 'value', 
    name: 'Value for Money', 
    icon: DollarSign, 
    gradient: 'from-emerald-500 to-green-500',
    bg: 'bg-gradient-to-br from-emerald-500/10 to-green-500/10',
    border: 'border-emerald-500/30'
  },
  { 
    id: 'general', 
    name: 'Overall Reputation', 
    icon: Star, 
    gradient: 'from-purple-500 to-violet-500',
    bg: 'bg-gradient-to-br from-purple-500/10 to-violet-500/10',
    border: 'border-purple-500/30'
  },
];

export const CategoriesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-400 mb-4">
          <TrendingUp size={14} />
          <span>Pick Your Market</span>
        </div>
        <h2 className="text-3xl font-bold text-white">Browse Categories</h2>
        <p className="mt-2 text-gray-400">Where do you want to place your vote?</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={cat.id} 
              to={`/vote?category=${cat.id}`}
              className={`group relative overflow-hidden rounded-xl border ${cat.border} ${cat.bg} p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-black/50`}
            >
              {/* Gradient corner accent */}
              <div className={`absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-gradient-to-br ${cat.gradient} opacity-10`}></div>
              
              <div className="relative z-10">
                <div className={`mb-6 inline-flex rounded-lg bg-gradient-to-br ${cat.gradient} p-3 text-white`}>
                  <Icon size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-400 mb-4">View live polls & odds</p>
                
                <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-300">
                  <span>Trade Votes →</span>
                </div>
              </div>
              
              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};