import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';


interface MultiCategoryRadarProps {
  data: Array<{ category: string; value: number; fullMark: number }>; // Example data shape
}

export const MultiCategoryRadarChart: React.FC<MultiCategoryRadarProps> = ({ data }) => {
  return (
    <div className="h-72 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--tw-text-muted)', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: 'var(--tw-text-subtle)' }} />
          <Radar name="Score" dataKey="value" stroke="var(--tw-primary-500)" fill="var(--tw-primary-500)" fillOpacity={0.6} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--tw-bg-background-elevated)', 
              border: '1px solid var(--tw-border)', 
              borderRadius: 'var(--tw-border-radius-lg)', 
              boxShadow: 'var(--tw-shadow-glow)', 
              color: 'var(--tw-text-inverted)' 
            }} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Usage note: This can be used for comparing a university across categories, e.g., data = [{ category: 'Vibes', value: 85, fullMark: 100 }, ...]