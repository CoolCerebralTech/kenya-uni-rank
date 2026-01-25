import React, { useState } from 'react';

interface PieData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Calculate cumulative angles for each slice
  const cumulativeAngles = data.reduce<number[]>((acc, item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const previousAngle = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(previousAngle + angle);
    return acc;
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* Chart */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {data.map((item, i) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const largeArc = angle > 180 ? 1 : 0;
            
            // Calculate coordinates
            const currentAngle = i === 0 ? 0 : cumulativeAngles[i - 1];
            const x1 = 50 + 50 * Math.cos(Math.PI * currentAngle / 180);
            const y1 = 50 + 50 * Math.sin(Math.PI * currentAngle / 180);
            const x2 = 50 + 50 * Math.cos(Math.PI * (currentAngle + angle) / 180);
            const y2 = 50 + 50 * Math.sin(Math.PI * (currentAngle + angle) / 180);
            
            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            const slice = (
              <path
                key={i}
                d={pathData}
                fill={item.color}
                stroke="#0f172a" // Gap color
                strokeWidth="2"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="transition-all duration-300 hover:opacity-90 cursor-pointer origin-center hover:scale-105"
                style={{
                  transformBox: 'fill-box',
                }}
              />
            );
            
            return slice;
          })}
          
          {/* Inner Circle for Donut Effect */}
          <circle cx="50" cy="50" r="30" fill="#0f172a" />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
             <span className="block text-2xl font-bold text-white">
               {hoverIndex !== null ? data[hoverIndex].value : total}
             </span>
             <span className="text-[10px] text-slate-500 uppercase font-bold">
               {hoverIndex !== null ? data[hoverIndex].label : 'Total'}
             </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {data.map((item, i) => (
          <div 
            key={i} 
            className={`flex items-center gap-2 text-sm transition-opacity ${hoverIndex !== null && hoverIndex !== i ? 'opacity-30' : 'opacity-100'}`}
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-300">{item.label}</span>
            <span className="text-slate-500 font-mono text-xs ml-auto">{((item.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};