import React from 'react';
import type { PollCategory } from '../../types/models';
import { GraduationCap, Zap, BookOpen, Trophy, Users, Building2 } from 'lucide-react';

interface CategorySelectorProps {
  onSelect: (category: PollCategory) => void;
  activeCategory?: PollCategory;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect, activeCategory }) => {
  const categories: { id: PollCategory; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
    { id: 'general', label: 'General', icon: <GraduationCap size={24} />, desc: 'Overall experience', color: 'from-blue-600 to-indigo-600' },
    { id: 'vibes', label: 'Vibes', icon: <Zap size={24} />, desc: 'Culture & Lifestyle', color: 'from-pink-500 to-rose-500' },
    { id: 'academics', label: 'Academics', icon: <BookOpen size={24} />, desc: 'Quality of learning', color: 'from-emerald-500 to-teal-500' },
    { id: 'sports', label: 'Sports', icon: <Trophy size={24} />, desc: 'Athletics & Spirit', color: 'from-amber-500 to-orange-500' },
    { id: 'social', label: 'Social', icon: <Users size={24} />, desc: 'Community & Fun', color: 'from-violet-500 to-purple-500' },
    { id: 'facilities', label: 'Facilities', icon: <Building2 size={24} />, desc: 'Infrastructure', color: 'from-cyan-500 to-blue-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`
              relative group overflow-hidden rounded-xl transition-all duration-300
              ${isActive ? 'ring-2 ring-white scale-[1.02]' : 'hover:scale-[1.02] hover:ring-1 hover:ring-slate-700'}
            `}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            
            {/* Active Glow */}
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20`} />
            )}

            <div className="relative p-4 flex flex-col items-center text-center h-full">
              <div className={`
                p-3 rounded-full mb-3 transition-colors
                ${isActive ? `bg-gradient-to-br ${cat.color} text-white shadow-lg` : 'bg-slate-900 text-slate-400 group-hover:text-white group-hover:bg-slate-800'}
              `}>
                {cat.icon}
              </div>
              
              <h3 className={`font-bold text-sm mb-1 ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                {cat.label}
              </h3>
              
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                {cat.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};