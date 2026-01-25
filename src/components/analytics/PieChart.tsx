import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface PieData {
  label: string;
  value: number;
  color: string;
}

export const PieChart: React.FC<{ data: PieData[]; size?: number }> = ({ data, size = 200 }) => {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const total = useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data]);
  
  // ✅ FIXED: Pure functional reduce - NO mutations
  const paths = useMemo(() => 
    data.reduce((acc: {pathData: string, item: PieData}[], item) => {
      const prevAngle = acc.reduce((sum, {pathData}) => {
        // Extract end angle from previous path (simple math)
        const match = pathData.match(/A \d+ \d+ 0 (?:1 )?1 ([\d.]+) ([\d.]+)/);
        if (match) {
          const x2 = parseFloat(match[1]);
          const y2 = parseFloat(match[2]);
          return Math.atan2(y2 - 50, x2 - 50) * 180 / Math.PI;
        }
        return sum;
      }, 0);
      
      const angle = (item.value / total) * 360;
      const pathData = getDonutPath(prevAngle, angle);
      
      return [...acc, { pathData, item }];
    }, [])
  , [data, total]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {paths.map(({ pathData, item }, i) => (
            <motion.path
              key={item.label}
              d={pathData}
              fill={item.color}
              stroke="#0f172a"
              strokeWidth="2"
              onMouseEnter={() => setHoverLabel(item.label)}
              onMouseLeave={() => setHoverLabel(null)}
              className="cursor-pointer"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              style={{ originX: '50px', originY: '50px' }}
            />
          ))}
          <circle cx="50" cy="50" r="35" fill="#0f172a" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center">
          <span className="block text-2xl font-bold text-white">
            {hoverLabel ? data.find(d => d.label === hoverLabel)?.value : total}
          </span>
          <span className="absolute top-1/2 mt-4 text-[10px] text-slate-500 uppercase font-bold">
            {hoverLabel || 'Total Votes'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {data.map((item) => (
          <div 
            key={item.label}
            className={`flex items-center gap-2 text-sm transition-opacity ${
              hoverLabel && hoverLabel !== item.label ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-300">{item.label}</span>
            <span className="text-slate-500 font-mono text-xs ml-auto">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// SIMPLER HELPER - Pre-calculate cumulative angles
const getDonutPath = (startAngle: number, angle: number) => {
  const x1 = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
  const y1 = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
  const x2 = 50 + 50 * Math.cos(Math.PI * (startAngle + angle) / 180);
  const y2 = 50 + 50 * Math.sin(Math.PI * (startAngle + angle) / 180);
  return `M 50 50 L ${x1} ${y1} A 50 50 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
};
