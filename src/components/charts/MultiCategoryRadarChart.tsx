import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface CategoryScore {
  category: string;
  value: number;
  fullMark: number;
}

interface MultiCategoryRadarProps {
  data: CategoryScore[];
  color?: string;
  fillOpacity?: number;
}

export const MultiCategoryRadarChart: React.FC<MultiCategoryRadarProps> = ({ 
  data,
  color = '#3B82F6',
  fillOpacity = 0.6 
}) => {
  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = item.payload.fullMark > 0 
        ? ((item.value / item.payload.fullMark) * 100).toFixed(0)
        : 0;
      
      return (
        <div className="rounded-lg border border-border bg-white dark:bg-background-elevated px-4 py-3 shadow-xl">
          <p className="font-semibold text-text dark:text-white mb-1">
            {item.payload.category}
          </p>
          <p className="text-sm text-text-subtle dark:text-gray-400">
            Score: {item.value} / {item.payload.fullMark}
          </p>
          <p className="text-xs text-text-muted dark:text-gray-500">
            {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius="75%" 
          data={data}
        >
          <PolarGrid 
            stroke="currentColor"
            className="text-border-light dark:text-border opacity-30"
          />
          <PolarAngleAxis 
            dataKey="category"
            tick={{ 
              fill: 'currentColor',
              fontSize: 12
            }}
            className="text-text-subtle dark:text-gray-400"
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 'auto']}
            tick={{ 
              fill: 'currentColor',
              fontSize: 11
            }}
            className="text-text-muted dark:text-gray-500"
          />
          <Radar 
            name="Performance" 
            dataKey="value" 
            stroke={color}
            fill={color}
            fillOpacity={fillOpacity}
            strokeWidth={2}
            animationDuration={800}
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
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};