import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  value?: number; // e.g., 5.2%
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend, value }) => {
  const config = {
    up: { icon: TrendingUp, color: 'text-green-500', label: 'Rising' },
    down: { icon: TrendingDown, color: 'text-red-500', label: 'Falling' },
    stable: { icon: Minus, color: 'text-slate-500', label: 'Stable' },
  };

  const { icon: Icon, color, label } = config[trend];

  return (
    <Tooltip content={`${label} ${value ? `(${value}%)` : ''}`}>
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon size={16} />
        {value && <span className="text-xs font-bold">{value}%</span>}
      </div>
    </Tooltip>
  );
};