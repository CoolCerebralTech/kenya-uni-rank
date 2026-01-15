import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { TooltipProps } from 'recharts';

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================

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

// Define the shape of the payload item Recharts passes to the tooltip
interface RadarPayloadItem {
  value: number;
  payload: CategoryScore; // <--- The original data object
  dataKey: string;
  color: string;
}

// Custom props for the tooltip
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: RadarPayloadItem[];
}

// ============================================================================
// 2. HELPER COMPONENTS (Defined outside render)
// ============================================================================

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const item = payload[0];
    const data = item.payload; // Type: CategoryScore
    
    // Safety check for division by zero
    const percentage = data.fullMark > 0 
      ? ((item.value / data.fullMark) * 100).toFixed(0)
      : '0';
    
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-xl z-50">
        <p className="font-semibold text-gray-900 dark:text-white mb-1 capitalize">
          {data.category}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Score: <span className="font-medium text-blue-600 dark:text-blue-400">{item.value}</span> / {data.fullMark}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {percentage}% Performance
        </p>
      </div>
    );
  }
  return null;
};

// ============================================================================
// 3. MAIN COMPONENT
// ============================================================================

export const MultiCategoryRadarChart: React.FC<MultiCategoryRadarProps> = ({ 
  data,
  color = '#3B82F6', // Default blue
  fillOpacity = 0.6 
}) => {
  
  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-lg">
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

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
            className="text-gray-200 dark:text-gray-700 opacity-50"
          />
          <PolarAngleAxis 
            dataKey="category"
            tick={{ 
              fill: 'currentColor',
              fontSize: 12,
            }}
            className="text-gray-600 dark:text-gray-400 capitalize"
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 'auto']}
            tick={{ 
              fill: 'currentColor',
              fontSize: 10
            }}
            className="text-gray-400 dark:text-gray-600"
            tickCount={5}
          />
          <Radar 
            name="Score" 
            dataKey="value" 
            stroke={color}
            fill={color}
            fillOpacity={fillOpacity}
            strokeWidth={2}
            isAnimationActive={true}
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