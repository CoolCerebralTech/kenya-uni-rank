import React, { useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface TrendChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ 
  data, 
  color = '#22d3ee', // Cyan
  height = 200 
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length < 2) return <div className="text-slate-500 text-sm p-4">Not enough data for trends.</div>;

  // Calculate scales
  const maxVal = Math.max(...data.map(d => d.value)) * 1.1; // Add headroom
  const minVal = 0;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minVal) / (maxVal - minVal)) * 100;
    return { x, y, ...d };
  });

  // Create path string (Simple line for now, could be bezier)
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full relative select-none" style={{ height: `${height}px` }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="overflow-visible"
      >
        {/* Grid Lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2" />

        {/* Area Fill (Gradient) */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <path d={areaD} fill="url(#chartGradient)" />
        
        {/* Line */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          filter="url(#glow)"
          vectorEffect="non-scaling-stroke" 
        />

        {/* Interactive Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoverIndex === i ? 4 : 2} // Scale logic handled by SVG coords, visual radius differs
            fill={color}
            stroke="#0f172a"
            strokeWidth="0.5"
            className="transition-all duration-200 cursor-pointer"
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            // Note: In non-scaling SVG, radius is relative to viewbox. 
            // Better to use CSS hover effects on a transparent wrapper if precision needed.
          />
        ))}
      </svg>

      {/* Hover Tooltip Overlay */}
      {hoverIndex !== null && (
        <div 
          className="absolute bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-xs z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ 
            left: `${points[hoverIndex].x}%`, 
            top: `${points[hoverIndex].y}%` 
          }}
        >
          <div className="font-bold text-white">{points[hoverIndex].label}</div>
          <div className="text-cyan-400">{points[hoverIndex].value}% Sentiment</div>
        </div>
      )}
      
      {/* X Axis Labels */}
      <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-[10px] text-slate-500 uppercase font-mono">
        <span>{data[0].label}</span>
        <span>{data[data.length - 1].label}</span>
      </div>
    </div>
  );
};