import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Flame, GraduationCap, Star, TrendingUp } from 'lucide-react';

const categories = [
  { 
    id: 'general', 
    name: 'General Experience', 
    icon: Star, 
    gradient: 'gradient-purple',
    bg: 'bg-background-elevated',
    border: 'border-brand-purple/30'
  },
  { 
    id: 'vibes', 
    name: 'Campus Life & Vibes', 
    icon: Flame, 
    gradient: 'gradient-pink',
    bg: 'bg-background-elevated',
    border: 'border-brand-pink/30'
  },
  { 
    id: 'sports', 
    name: 'Sports & Facilities', 
    icon: Trophy, 
    gradient: 'gradient-orange',
    bg: 'bg-background-elevated',
    border: 'border-brand-orange/30'
  },
  { 
    id: 'academics', 
    name: 'Academic Environment', 
    icon: GraduationCap, 
    gradient: 'gradient-blue',
    bg: 'bg-background-elevated',
    border: 'border-brand-blue/30'
  },
];

export const CategoriesPage: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header Section - Overview of categories with vibrant student choice theme */}
      {/* Image: Collage of Kenyan university students in various activities representing categories like studying, sports, events - Place as a full-width hero background or central illustrative image */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-2 text-sm text-primary-400 border border-primary-500/30 mb-4 animate-pulse">
          <TrendingUp size={14} />
          <span>Explore Categories</span>
        </div>
        <h2 className="text-3xl md:text-hero font-display text-inverted">Choose Your Category</h2>
        <p className="mt-2 text-subtitle text-text-muted max-w-2xl mx-auto">Dive into polls on vibes, sports, academics, and more. Vote and see what students really think!</p>
      </div>

      {/* Categories Grid - Engaging cards for each category */}
      {/* Overall Image for Grid: Modern dashboard with category icons and poll previews in a dark UI - Place above the grid as a teaser visual */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={cat.id} 
              to={`/categories/${cat.id}`}
              className={`group relative overflow-hidden rounded-xl border ${cat.border} ${cat.bg} p-6 transition-all hover:scale-[1.02] hover:shadow-glow-blue animate-slide-up delay-${index * 100}`}
            >
              {/* Gradient accent */}
              <div className={`absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-${cat.gradient} opacity-20`}></div>
              
              <div className="relative z-10">
                <div className={`mb-6 inline-flex rounded-lg bg-${cat.gradient} p-3 text-white shadow-glow`}>
                  <Icon size={28} />
                </div>
                
                <h3 className="text-xl font-display text-inverted mb-2">{cat.name}</h3>
                <p className="text-sm text-text-muted mb-4">Vote on polls and view live rankings</p>
                
                <div className="flex items-center text-sm text-text-subtle group-hover:text-primary-500 transition-colors">
                  <span>Explore Now →</span>
                </div>
              </div>
              
              {/* Hover effect */}
              <div className={`absolute inset-0 bg-${cat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}></div>
              
              {/* Per-Category Image Suggestion - Place as a small thumbnail or background in the card */}
              {/* For General: Iconic view of University of Nairobi main gate with students */}
              {/* For Vibes: Kenyan university students at a campus party or event */}
              {/* For Sports: Students playing soccer on a Kenyan university field */}
              {/* For Academics: Classroom scene in a Kenyan university with lecturer and students */}
            </Link>
          );
        })}
      </div>
    </div>
  );
};