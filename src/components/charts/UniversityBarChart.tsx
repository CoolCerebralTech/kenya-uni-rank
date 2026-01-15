import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { PollResult } from '../../types';

interface Props {
  data: PollResult[];
}

export const UniversityBarChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-64 w-full animate-scale-in">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="universityName" 
            type="category" 
            width={100} 
            tick={{ fontSize: 12, fill: 'var(--tw-text-muted)' }} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: 'var(--tw-bg-background-elevated)', 
              border: '1px solid var(--tw-border)', 
              borderRadius: 'var(--tw-border-radius-lg)', 
              boxShadow: 'var(--tw-shadow-glow)', 
              color: 'var(--tw-text-inverted)' 
            }}
          />
          <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.universityColor || 'var(--tw-primary-500)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};