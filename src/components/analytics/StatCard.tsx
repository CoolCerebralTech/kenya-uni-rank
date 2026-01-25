import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number; // percentage
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon, color = 'text-cyan-400' }) => {
  return (
    <Card className="flex items-start justify-between p-5">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
        
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            <span>{Math.abs(trend)}%</span>
            <span className="text-slate-500 ml-1">vs last month</span>
          </div>
        )}
      </div>

      {icon && (
        <div className={`p-3 rounded-xl bg-slate-800/50 border border-slate-700 ${color}`}>
          {icon}
        </div>
      )}
    </Card>
  );
};