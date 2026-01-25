import React from 'react';
import { Badge, type BadgeData } from './Badge';
import { Share2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface BadgeCollectionProps {
  badges: BadgeData[];
  onShare?: () => void;
}

export const BadgeCollection: React.FC<BadgeCollectionProps> = ({ badges, onShare }) => {
  const earnedCount = badges.filter(b => b.isUnlocked).length;
  const progress = (earnedCount / badges.length) * 100;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Achievements</h3>
          <p className="text-xs text-slate-400">
            {earnedCount} of {badges.length} badges unlocked
          </p>
        </div>
        {onShare && (
          <Button variant="ghost" size="sm" onClick={onShare} leftIcon={<Share2 size={14} />}>
            Share
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-6 gap-x-4 justify-items-center">
        {badges.map((badge) => (
          <Badge key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
};