import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import type { PollResult } from '../../types';

// ============================================================================
// 1. STRICT TYPE DEFINITIONS (NO ANY)
// ============================================================================

interface Props {
  data: PollResult[];
}

// Recharts requires data objects to have an index signature for internal access.
// We extend PollResult to allow string indexing with 'unknown' (safer than any).
type ChartData = PollResult & {
  [key: string]: unknown;
};

// Define the shape of a single item in the Tooltip's payload array.
// This matches what Recharts actually passes down.
interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: PollResult; // <--- The original data object is here
  color?: string;
  fill?: string;
}

// Strictly define the props our CustomTooltip will receive.
// We do not extend Recharts types to avoid generic complexity and 'any' leaks.
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  // Our custom prop passed via <Tooltip content={<CustomTooltip totalVotes={...} />} />
  totalVotes: number;
}

// ============================================================================
// 2. HELPER COMPONENTS
// ============================================================================

/**
 * Custom Label for the Pie Chart slices
 */
const renderCustomLabel = (props: PieLabelRenderProps) => {
  const { percent } = props;
  
  // Strict null checks
  if (percent === undefined || percent === null) return null;
  if (percent < 0.05) return null; // Hide labels for small slices (< 5%)
  
  return `${(percent * 100).toFixed(0)}%`;
};

/**
 * Custom Tooltip Component
 */
const CustomTooltip = ({ active, payload, totalVotes }: CustomTooltipProps) => {
  // Strict checks to ensure data exists before rendering
  if (active && payload && payload.length > 0) {
    const item = payload[0];
    
    // Access properties safely
    const value = item.value;
    const dataPayload = item.payload; // Type: PollResult
    
    const percentage = totalVotes > 0 
      ? ((value / totalVotes) * 100).toFixed(1) 
      : '0';

    return (
      <div className="rounded-lg border border-border bg-white dark:bg-slate-800 p-3 shadow-xl z-50">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">
          {dataPayload.universityName}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {value.toLocaleString()} votes
          </span>{' '}
          ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

// ============================================================================
// 3. MAIN COMPONENT
// ============================================================================

export const CategoryPieChart: React.FC<Props> = ({ data }) => {
  // 1. Calculate total votes
  const totalVotes = data.reduce((sum, item) => sum + item.votes, 0);

  // 2. Prepare data for Recharts
  // We explicitly type 'sortedData' as 'ChartData[]' to satisfy Recharts requirements
  // We map the data to a new object to ensure it has the structure Recharts expects
  const sortedData: ChartData[] = [...data]
    .sort((a, b) => b.votes - a.votes)
    .map((item) => ({
      ...item,
      // Explicitly mapping keys ensures TS knows they exist
      name: item.universityName,
      value: item.votes
    }));

  // 3. Handle Empty State
  if (totalVotes === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
        <p className="text-gray-400 text-sm">No votes yet</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="votes"
            nameKey="universityName"
            animationBegin={0}
            animationDuration={1000}
            label={renderCustomLabel}
            labelLine={false}
          >
            {sortedData.map((entry) => (
              <Cell
                key={entry.universityId}
                fill={entry.universityColor || '#3B82F6'}
                strokeWidth={2}
                stroke="transparent"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          
          {/* Passing strict custom types to Tooltip */}
          <Tooltip 
            content={<CustomTooltip totalVotes={totalVotes} />} 
          />
          
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              fontSize: '0.75rem',
              paddingTop: '10px',
              opacity: 0.8
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};