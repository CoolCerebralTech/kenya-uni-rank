import React from 'react';
import { Lock } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'legendary';
  isUnlocked: boolean;
}

export const Badge: React.FC<{
  badge: BadgeData;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}> = ({ badge, size = 'md', onClick }) => {
  const { isUnlocked, rarity, name, description, icon } = badge;

  const rarityStyles = {
    common: 'border-slate-600 text-slate-400 bg-slate-800/50',
    rare: 'border-blue-500 text-blue-400 bg-blue-900/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    legendary: 'border-yellow-500 text-yellow-400 bg-yellow-900/30 shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-pulse',
  };
  const sizes = { sm: 'w-16 h-16 text-xs', md: 'w-24 h-24 text-sm', lg: 'w-32 h-32 text-base' };

  return (
    <Tooltip content={isUnlocked ? description : 'Locked'}>
      <div
        className={`relative flex flex-col items-center justify-center gap-2 group cursor-pointer ${onClick ? '' : 'pointer-events-none'}`}
        onClick={onClick}
      >
        <div className={`relative flex items-center justify-center p-2 rounded-2xl border-2 transition-all duration-300 ${sizes[size]} ${isUnlocked ? rarityStyles[rarity] : 'border-slate-800 bg-slate-900 grayscale opacity-50'}`}>
          <div className={`transition-transform duration-300 ${isUnlocked ? 'scale-100' : 'scale-90 opacity-50'}`}>
            {isUnlocked ? icon : <Lock size={size === 'sm' ? 16 : 24} />}
          </div>
          {isUnlocked && <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
        {size !== 'sm' && (
          <span className={`font-bold text-center leading-tight ${isUnlocked ? 'text-slate-200' : 'text-slate-600'}`}>
            {name}
          </span>
        )}
      </div>
    </Tooltip>
  );
};