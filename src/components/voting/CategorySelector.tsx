// src/components/voting/CategorySelector.tsx
import React, { useEffect, useState } from 'react';
import type { PollCategory } from '../../types/models';
import { GraduationCap, Zap, BookOpen, Trophy, Users, Building2, TrendingUp } from 'lucide-react';
import { getCategoryStats, getTrendingCategories } from '../../services/analytics.service';
import { getCategoryColor } from '../../services/poll.service';

interface CategorySelectorProps {
  onSelect: (category: PollCategory) => void;
  activeCategory?: PollCategory;
}

interface CategoryStats {
  category: PollCategory;
  count: number;
  percentage: number;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect, activeCategory }) => {
  const [categories, setCategories] = useState<Array<{
    id: PollCategory; 
    label: string; 
    emoji: string;
    desc: string; 
    color: string;
    stats?: CategoryStats;
    isTrending: boolean;
  }>>([]);
  const [, setTrendingCategories] = useState<PollCategory[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const [statsRes, trendingRes] = await Promise.all([
          getCategoryStats(),
          getTrendingCategories()
        ]);

        const baseCategories = [
          { id: 'general' as PollCategory, label: 'General', emoji: '🎓', desc: 'Overall experience' },
          { id: 'vibes' as PollCategory, label: 'Vibes', emoji: '✨', desc: 'Culture & Lifestyle' },
          { id: 'academics' as PollCategory, label: 'Academics', emoji: '📚', desc: 'Quality of learning' },
          { id: 'sports' as PollCategory, label: 'Sports', emoji: '⚽', desc: 'Athletics & Spirit' },
          { id: 'social' as PollCategory, label: 'Social', emoji: '🤝', desc: 'Community & Fun' },
          { id: 'facilities' as PollCategory, label: 'Facilities', emoji: '🏛️', desc: 'Infrastructure' },
        ];

        // Update with trending status
        const updatedCategories = baseCategories.map(cat => {
          const stats = statsRes.success && statsRes.data 
            ? statsRes.data.find(s => s.category === cat.id)
            : undefined;
          
          const isTrending = trendingRes.success && trendingRes.data
            ? trendingRes.data.includes(cat.id)
            : false;

          return {
            ...cat,
            color: getCategoryColor(cat.id),
            stats,
            isTrending,
          };
        });

        setCategories(updatedCategories);
        setTrendingCategories(trendingRes.success ? trendingRes.data || [] : []);
      } catch (err) {
        console.error('[CategorySelector] Error:', err);
      }
    };

    fetchCategoryData();
  }, []);

  const icons: Record<PollCategory, React.ReactNode> = {
    general: <GraduationCap size={24} />,
    vibes: <Zap size={24} />,
    academics: <BookOpen size={24} />,
    sports: <Trophy size={24} />,
    social: <Users size={24} />,
    facilities: <Building2 size={24} />,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const isTrending = cat.isTrending;
        
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`
              relative group overflow-hidden rounded-xl transition-all duration-300
              ${isActive ? 'ring-2 ring-white scale-[1.02] shadow-lg' : 'hover:scale-[1.02] hover:ring-1 hover:ring-slate-700'}
            `}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            
            {/* Active Glow */}
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20`} />
            )}

            {/* Trending Badge */}
            {isTrending && (
              <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp size={8} />
                Hot
              </div>
            )}

            <div className="relative p-4 flex flex-col items-center text-center h-full">
              <div className={`
                p-3 rounded-full mb-3 transition-colors
                ${isActive ? `bg-gradient-to-br ${cat.color} text-white shadow-lg` : 'bg-slate-900 text-slate-400 group-hover:text-white group-hover:bg-slate-800'}
              `}>
                {icons[cat.id]}
              </div>
              
              <h3 className={`font-bold text-sm mb-1 ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                {cat.label}
              </h3>
              
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mb-2">
                {cat.desc}
              </p>
              
              {/* Stats */}
              {cat.stats && (
                <div className="text-xs text-slate-600">
                  {cat.stats.count} polls • {cat.stats.percentage.toFixed(0)}%
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};