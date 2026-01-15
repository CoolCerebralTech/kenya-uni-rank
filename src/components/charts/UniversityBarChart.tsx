import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { PollResult } from '../../types';

interface Props {
  data: PollResult[];
  showPercentage?: boolean;
}

export const UniversityBarChart: React.FC<Props> = ({ data, showPercentage = false }) => {
  // Sort by votes descending
  const sortedData = [...data].sort((a, b) => b.votes - a.votes);
  
  // Calculate total for percentages
  const totalVotes = data.reduce((sum, item) => sum + item.votes, 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as PollResult;
      const percentage = totalVotes > 0 ? ((item.votes / totalVotes) * 100).toFixed(1) : 0;
      
      return (
        <div className="rounded-lg border border-border bg-white dark:bg-background-elevated px-4 py-3 shadow-xl">
          <p className="font-semibold text-text dark:text-white mb-1">
            {item.universityName}
          </p>
          <p className="text-sm text-text-subtle dark:text-gray-400">
            {item.votes.toLocaleString()} votes ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full animate-fade-in-up">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={sortedData} 
          layout="vertical" 
          margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="universityName" 
            type="category" 
            width={120}
            tick={{ 
              fontSize: 13, 
              fill: 'currentColor',
              className: 'text-text-subtle dark:text-gray-400'
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar 
            dataKey="votes" 
            radius={[0, 8, 8, 0]}
            animationDuration={800}
            animationBegin={0}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.universityColor || '#3B82F6'}
                opacity={0.9}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};