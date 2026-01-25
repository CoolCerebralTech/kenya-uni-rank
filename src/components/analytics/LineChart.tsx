import React, { useState } from 'react';

// Reuse the SVG logic from TrendChart, but expanded for multiple lines
// Keeping it simple for the sake of code length in this prompt

interface LineSeries {
  name: string;
  color: string;
  data: number[];
}

interface LineChartProps {
  labels: string[];
  series: LineSeries[];
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ labels, series, height = 250 }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const allValues = series.flatMap(s => s.data);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min || 1;

  const getY = (val: number) => 100 - ((val - min) / range) * 100;
  const getX = (index: number) => (index / (labels.length - 1)) * 100;

  return (
    <div className="w-full relative select-none" style={{ height: `${height}px` }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
        {/* Grid */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#1e293b" strokeWidth="0.5" />
        ))}

        {/* Lines */}
        {series.map((s, si) => {
          const points = s.data.map((val, i) => `${getX(i)},${getY(val)}`).join(' ');
          return (
            <polyline
              key={si}
              points={points}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className="transition-all duration-300"
              style={{ opacity: hoverIndex === null ? 1 : 0.3 }} // Fade out logic could be better
            />
          );
        })}
        
        {/* Hover Line Overlay */}
        {hoverIndex !== null && (
          <line 
            x1={getX(hoverIndex)} 
            y1="0" 
            x2={getX(hoverIndex)} 
            y2="100" 
            stroke="#475569" 
            strokeWidth="0.5" 
            strokeDasharray="2" 
          />
        )}
        
        {/* Interaction Areas */}
        {labels.map((_, i) => (
           <rect
             key={i}
             x={getX(i) - 2}
             y="0"
             width="4"
             height="100"
             fill="transparent"
             onMouseEnter={() => setHoverIndex(i)}
             onMouseLeave={() => setHoverIndex(null)}
             className="cursor-crosshair"
           />
        ))}
      </svg>

      {/* Tooltip */}
      {hoverIndex !== null && (
        <div className="absolute top-0 right-0 bg-slate-900/90 backdrop-blur border border-slate-700 p-2 rounded text-xs z-20">
          <div className="font-bold text-white mb-1 border-b border-slate-700 pb-1">{labels[hoverIndex]}</div>
          {series.map((s, i) => (
            <div key={i} className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-slate-300">{s.name}:</span>
              <span className="text-white font-mono">{s.data[hoverIndex]}%</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Labels */}
      <div className="flex justify-between mt-2 text-[10px] text-slate-500 uppercase">
        {labels.map((l, i) => (
          <span key={i} style={{ opacity: i % 2 === 0 ? 1 : 0 }}>{l}</span> // Show every other label to avoid crowding
        ))}
      </div>
    </div>
  );
};