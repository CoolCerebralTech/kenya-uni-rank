import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PollResult } from '../../types';

interface Props {
  data: PollResult[];
}

// Custom label to show percentage
const renderCustomLabel = (entry: any) => {
  return `${entry.percentage.toFixed(0)}%`;
};

export const CategoryPieChart: React.FC<Props> = ({ data }) => {
  // Calculate total votes
  const totalVotes = data.reduce((sum, item) => sum + item.votes, 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = totalVotes > 0 ? ((item.value / totalVotes) * 100).toFixed(1) : 0;
      
      return (
        <div className="rounded-lg border border-border bg-white dark:bg-background-elevated px-4 py-3 shadow-xl">
          <p className="font-semibold text-text dark:text-white mb-1">
            {item.name}
          </p>
          <p className="text-sm text-text-subtle dark:text-gray-400">
            {item.value.toLocaleString()} votes ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Sort data by votes for better visual hierarchy
  const sortedData = [...data].sort((a, b) => b.votes - a.votes);

  return (
    <div className="h-80 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey="votes"
            nameKey="universityName"
            animationBegin={0}
            animationDuration={800}
            label={renderCustomLabel}
            labelLine={false}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.universityColor || '#3B82F6'}
                strokeWidth={2}
                stroke="#ffffff"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle" 
            iconSize={10}
            wrapperStyle={{ 
              fontSize: '0.875rem',
              paddingTop: '20px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};