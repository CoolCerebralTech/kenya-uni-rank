import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  color?: string; // e.g., 'text-cyan-400'
}> = ({ label, value, trend, icon, color = 'text-cyan-400' }) => {
  // ✅ FIXED: Safe trend handling with nullish coalescing
  const trendValue = trend ?? 0;
  const trendColor = trendValue > 0 ? 'text-emerald-400' : 
                    trendValue < 0 ? 'text-red-400' : 'text-slate-400';
  
  // ✅ FIXED: Safe conditional icon selection
  const TrendIcon = trendValue > 0 ? TrendingUp : 
                   trendValue < 0 ? TrendingDown : Minus;

  return (
    <Card variant="glass" className="p-5 relative overflow-hidden">
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${
        color.replace('text-', 'bg-') + '/5 rounded-full blur-2xl'
      }`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          {icon && (
            <div className={`p-2 rounded-lg bg-slate-800/50 ${color}`}>
              {icon}
            </div>
          )}
        </div>
        
        <h3 className="text-3xl font-bold text-white mt-2 mb-3">{value}</h3>
        
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{Math.abs(trendValue)}% vs last month</span>
          </div>
        )}
      </div>
    </Card>
  );
};
