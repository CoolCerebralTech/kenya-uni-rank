import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================

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

// Define the shape of the payload item Recharts passes to the tooltip
interface TooltipPayloadItem {
  value: number;
  payload: VoteTrend; // <--- The original data object
  dataKey: string;
  stroke: string;
}

// Custom props for the tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

// ============================================================================
// 2. HELPER COMPONENTS
// ============================================================================

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const item = payload[0];
    const data = item.payload; // Access the original VoteTrend object
    
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-xl z-50">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">
          {data.label || data.time}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {item.value.toLocaleString()}
          </span> votes
        </p>
      </div>
    );
  }
  return null;
};

// ============================================================================
// 3. MAIN COMPONENT
// ============================================================================

export const VoteTrendLineChart: React.FC<VoteTrendLineChartProps> = ({ 
  data, 
  color = '#3B82F6',
  showGrid = true 
}) => {
  
  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
        <p className="text-gray-400 text-sm">No trend data available</p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full animate-slide-up">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-200 dark:stroke-gray-700 opacity-50"
              vertical={false} // Cleaner look with horizontal lines only
            />
          )}
          <XAxis 
            dataKey="time" 
            tick={{ 
              fill: '#94a3b8', // slate-400
              fontSize: 12
            }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{ 
              fill: '#94a3b8', // slate-400
              fontSize: 12
            }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
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
            name="Votes over time"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 6, strokeWidth: 0, fill: color }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};