import React from 'react';
import { Lock } from 'lucide-react';

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: string;
}

interface BadgeProps {
  badge: BadgeData;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({ badge, size = 'md', onClick }) => {
  const rarityColors = {
    common: 'border-slate-600 text-slate-400 bg-slate-800/50',
    rare: 'border-blue-500 text-blue-400 bg-blue-900/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    legendary: 'border-yellow-500 text-yellow-400 bg-yellow-900/20 shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-pulse',
  };

  const sizes = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-32 h-32 text-base',
  };

  const isUnlocked = badge.isUnlocked;
  
  return (
    <div 
      className={`relative flex flex-col items-center justify-center gap-1 group cursor-pointer ${onClick ? '' : 'pointer-events-none'}`}
      onClick={onClick}
    >
      {/* Badge Shape (Hexagon-ish) */}
      <div className={`
        relative flex items-center justify-center rounded-2xl border-2 transition-all duration-300
        ${sizes[size]}
        ${isUnlocked ? rarityColors[badge.rarity] : 'border-slate-800 bg-slate-900/80 grayscale opacity-50'}
        ${onClick ? 'group-hover:scale-105 group-hover:shadow-lg' : ''}
      `}>
        
        {/* Icon */}
        <div className={`transition-transform duration-300 ${isUnlocked ? 'scale-100' : 'scale-90 opacity-50'}`}>
          {isUnlocked ? badge.icon : <Lock size={size === 'sm' ? 12 : 24} />}
        </div>

        {/* Shine Effect (Unlocked only) */}
        {isUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl" />
        )}
      </div>

      {/* Label (Only for MD/LG) */}
      {size !== 'sm' && (
        <span className={`font-bold text-center leading-tight ${isUnlocked ? 'text-slate-200' : 'text-slate-600'}`}>
          {badge.name}
        </span>
      )}
    </div>
  );
};