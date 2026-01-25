import React from 'react';

interface BarData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 200 }) => {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full flex items-end gap-2" style={{ height: `${height}px` }}>
      {data.map((item, i) => {
        const heightPercent = (item.value / max) * 100;
        
        return (
          <div key={i} className="group relative flex-1 h-full flex flex-col justify-end">
            <div 
              className="w-full rounded-t-sm transition-all duration-500 hover:opacity-80 relative"
              style={{ 
                height: `${heightPercent}%`, 
                backgroundColor: item.color 
              }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {item.value} votes
              </div>
            </div>
            
            {/* Label */}
            <div className="mt-2 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold block truncate w-full" title={item.label}>
                {item.label.substring(0, 3)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};