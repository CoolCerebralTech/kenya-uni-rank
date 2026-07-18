import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

// UniPulse v3 — refined trend indicator. Keeps the same external API as v1
// (props: trend + value) but renders as a soft pill with a 0.5×scaled icon.

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'stable';
  value?: number;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend, value }) => {
  const config = {
    up: { icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Rising' },
    down: { icon: TrendingDown, color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Falling' },
    stable: { icon: Minus, color: 'text-slate-500 bg-slate-700/20 border-slate-700/30', label: 'Stable' },
  }[trend];

  const { icon: Icon, color, label } = config;

  return (
    <Tooltip content={`${label} ${value ? `(${value}%)` : ''}`}>
      <span className={`inline-flex items-center gap-1 px-1.5 py-1 rounded-md border text-[11px] ${color}`}>
        <Icon size={12} />
        {value !== undefined && <span className="font-bold tabular">{value}%</span>}
      </span>
    </Tooltip>
  );
};
