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
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data as ChartResult[]}   // ✅ safe cast for Recharts
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="votes"
            nameKey="universityName"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.universityColor} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
