import React from 'react';
import { 
  Heart, 
  Trophy, 
  BookOpen, 
  Coffee, 
  Building2, 
  Users, 
  Star 
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  categoryCounts?: Record<string, number>;
}

const CATEGORIES = [
  { id: 'all', label: 'All Polls', icon: Star, color: 'text-gray-600 dark:text-gray-400' },
  { id: 'vibes', label: 'Vibes', icon: Heart, color: 'text-purple-600 dark:text-purple-400' },
  { id: 'sports', label: 'Sports', icon: Trophy, color: 'text-green-600 dark:text-green-400' },
  { id: 'academics', label: 'Academics', icon: BookOpen, color: 'text-blue-600 dark:text-blue-400' },
  { id: 'food', label: 'Food', icon: Coffee, color: 'text-orange-600 dark:text-orange-400' },
  { id: 'facilities', label: 'Facilities', icon: Building2, color: 'text-teal-600 dark:text-teal-400' },
  { id: 'social', label: 'Social', icon: Users, color: 'text-pink-600 dark:text-pink-400' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory,
  categoryCounts = {}
}) => {
  return (
    <div className="mb-8 animate-fade-in-up">
      <h3 className="text-sm font-bold text-text dark:text-white mb-4 uppercase tracking-wide">
        Filter by Category
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === (category.id === 'all' ? null : category.id);
          const count = category.id === 'all' 
            ? Object.values(categoryCounts).reduce((sum, c) => sum + c, 0)
            : categoryCounts[category.id] || 0;
          
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id === 'all' ? null : category.id)}
              className={`
                group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                transition-all duration-200 border-2
                ${isSelected 
                  ? 'bg-brand-primary text-white border-brand-primary shadow-lg scale-105' 
                  : 'bg-white dark:bg-background-elevated text-text-subtle dark:text-gray-400 border-border-light dark:border-border hover:border-brand-primary/50 hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10'
                }
              `}
            >
              <category.icon 
                size={16} 
                className={isSelected ? 'text-white' : category.color}
              />
              <span>{category.label}</span>
              {count > 0 && (
                <span className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                  ${isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-background-subtle dark:bg-background-hover text-text-muted'
                  }
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};