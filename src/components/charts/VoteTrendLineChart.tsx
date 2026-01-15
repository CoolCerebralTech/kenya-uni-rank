import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
interface VoteTrendLineChartProps {
  data: VoteTrend[];
  color?: string;
}

export const VoteTrendLineChart: React.FC<VoteTrendLineChartProps> = ({ data, color = 'var(--tw-primary-500)' }) => {
  return (
    <div className="h-64 w-full animate-slide-up">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-border-light)" />
          <XAxis dataKey="time" tick={{ fill: 'var(--tw-text-muted)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--tw-text-muted)', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--tw-bg-background-elevated)', 
              border: '1px solid var(--tw-border)', 
              borderRadius: 'var(--tw-border-radius-lg)', 
              boxShadow: 'var(--tw-shadow-glow)', 
              color: 'var(--tw-text-inverted)' 
            }} 
          />
          <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '0.875rem', color: 'var(--tw-text-muted)' }} />
          <Line type="monotone" dataKey="votes" stroke={color} activeDot={{ r: 8 }} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Usage note: For showing vote trends over time, if you add real-time/historical data in future.