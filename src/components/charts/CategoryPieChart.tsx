import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PollResult } from '../../types';

// Wrapper type to satisfy Recharts' ChartDataInput
type ChartResult = PollResult & { [key: string]: string | number };

interface Props {
  data: PollResult[];
}

export const CategoryPieChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-64 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
              data={data as ChartResult[]}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="votes"
              nameKey="universityName"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.universityColor || '#6366F1'} // Fallback to primary
                />
              ))}
            </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--tw-bg-background-elevated)', 
              border: '1px solid var(--tw-border)', 
              borderRadius: 'var(--tw-border-radius-lg)', 
              boxShadow: 'var(--tw-shadow-glow)', 
              color: 'var(--tw-text-inverted)' 
            }} 
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle" 
            iconSize={10} 
            wrapperStyle={{ fontSize: '0.875rem', color: 'var(--tw-text-muted)' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
