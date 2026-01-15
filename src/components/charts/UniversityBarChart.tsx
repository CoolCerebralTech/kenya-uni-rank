import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { PollResult } from '../../types';

// ============================================================================
// 1. STRICT TYPE DEFINITIONS
// ============================================================================

interface Props {
  data: PollResult[];
  showPercentage?: boolean;
}

// Recharts requires data objects to have an index signature for internal access
type ChartData = PollResult & {
  [key: string]: unknown;
};

// Define the shape of the payload item Recharts passes to the tooltip
interface TooltipPayloadItem {
  value: number;
  payload: PollResult; // <--- The original data object
  dataKey: string;
}

// STRICT: We manually define the props instead of extending complex Recharts types
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[]; // We explicitly say this is an array of our items
  label?: string;
  // Custom props we pass down
  totalVotes: number;
  showPercentage: boolean;
}

// ============================================================================
// 2. HELPER COMPONENTS
// ============================================================================

const CustomTooltip = ({ active, payload, totalVotes, showPercentage }: CustomTooltipProps) => {
  // 1. Check if active and has data
  if (active && payload && payload.length > 0) {
    
    // 2. Safe access to the first item
    const item = payload[0];
    const data = item.payload; // This is now strictly typed as PollResult
    const votes = item.value;
    
    // 3. Calculate percentage
    const percentage = totalVotes > 0 
      ? ((votes / totalVotes) * 100).toFixed(1) 
      : '0';

    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-xl z-50 min-w-37.5">
        <p className="font-semibold text-gray-900 dark:text-white mb-1 border-b border-gray-100 dark:border-gray-700 pb-1">
          {data.universityName}
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
            <span>Votes:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {votes.toLocaleString()}
            </span>
          </p>
          {showPercentage && (
            <p className="text-sm text-blue-600 dark:text-blue-400 flex justify-between font-medium">
              <span>Share:</span>
              <span>{percentage}%</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// ============================================================================
// 3. MAIN COMPONENT
// ============================================================================

export const UniversityBarChart: React.FC<Props> = ({ 
  data, 
  showPercentage = true 
}) => {
  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-lg">
        <p className="text-gray-400 text-sm">No votes to display</p>
      </div>
    );
  }

  // Sort by votes descending (High to Low)
  // We explicitly type this array to satisfy Recharts
  const sortedData: ChartData[] = [...data]
    .sort((a, b) => b.votes - a.votes)
    .map(item => ({ 
      ...item,
      // Explicitly map keys if needed, though spreading works with our type definition
      name: item.universityName
    }));
  
  // Calculate total for percentages
  const totalVotes = data.reduce((sum, item) => sum + item.votes, 0);

  return (
    <div className="h-80 w-full animate-fade-in-up">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={sortedData} 
          layout="vertical" 
          margin={{ left: 0, right: 30, top: 10, bottom: 10 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="universityShortName" 
            type="category" 
            width={70}
            tick={{ 
              fontSize: 12, 
              fill: '#64748b',
              fontWeight: 500
            }}
            interval={0}
          />
          
          {/* We pass our custom props here */}
          <Tooltip 
            content={
              <CustomTooltip 
                totalVotes={totalVotes} 
                showPercentage={showPercentage} 
              />
            } 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
          />
          
          <Bar 
            dataKey="votes" 
            radius={[0, 4, 4, 0]}
            barSize={24}
            animationDuration={1000}
            animationBegin={0}
          >
            {sortedData.map((entry) => (
              <Cell 
                key={entry.universityId} 
                fill={entry.universityColor || '#3B82F6'}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};