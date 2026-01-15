import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export interface VoteTrend {
  time: string;
  votes: number;
  label?: string;
}

interface VoteTrendLineChartProps {
  data: VoteTrend[];
  color?: string;
  showGrid?: boolean;
}

export const VoteTrendLineChart: React.FC<VoteTrendLineChartProps> = ({ 
  data, 
  color = '#3B82F6',
  showGrid = true 
}) => {
  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      
      return (
        <div className="rounded-lg border border-border bg-white dark:bg-background-elevated px-4 py-3 shadow-xl">
          <p className="font-semibold text-text dark:text-white mb-1">
            {item.payload.label || item.payload.time}
          </p>
          <p className="text-sm text-text-subtle dark:text-gray-400">
            {item.value.toLocaleString()} votes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72 w-full animate-slide-up">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="currentColor"
              className="text-border-light dark:text-border opacity-30"
            />
          )}
          <XAxis 
            dataKey="time" 
            tick={{ 
              fill: 'currentColor',
              fontSize: 12
            }}
            className="text-text-muted dark:text-gray-400"
          />
          <YAxis 
            tick={{ 
              fill: 'currentColor',
              fontSize: 12
            }}
            className="text-text-muted dark:text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconSize={10}
            wrapperStyle={{ 
              fontSize: '0.875rem',
              paddingBottom: '10px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="votes" 
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};