import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const allValues = useMemo(() => series.flatMap(s => s.data), [series]);
  const max = Math.max(...allValues, 0);

  const getPath = (data: number[]) => {
    const points = data.map((val, i) => {
      const x = (i / (labels.length - 1)) * 100;
      const y = 100 - (val / max) * 100;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const index = Math.round((x / rect.width) * (labels.length - 1));
    
    if (index >= 0 && index < labels.length) {
      setActiveLabel(labels[index]);
      setMousePos({ x: (index / (labels.length - 1)) * rect.width, y: e.clientY - rect.top });
    }
  };

  const activeIndex = activeLabel ? labels.indexOf(activeLabel) : -1;

  return (
    <div 
      ref={containerRef}
      className="w-full relative select-none" 
      style={{ height: `${height}px` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActiveLabel(null)}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
        {/* Grid Lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#334155" strokeWidth="0.2" />
        ))}

        {/* Lines and Gradients */}
        {series.map((s) => {
          const path = getPath(s.data);
          const gradientId = `gradient-${s.name.replace(/\s/g, '')}`;
          return (
            <g key={s.name}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <motion.path
                d={`${path} L 100,100 L 0,100 Z`}
                fill={`url(#${gradientId})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.path
                d={path}
                fill="none"
                stroke={s.color}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </g>
          );
        })}

        {/* Hover Scrubber Line */}
        {activeIndex !== -1 && (
          <line
            x1={(activeIndex / (labels.length - 1)) * 100} y1="0"
            x2={(activeIndex / (labels.length - 1)) * 100} y2="100"
            stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2"
          />
        )}
      </svg>
      
      {/* Tooltip */}
      <AnimatePresence>
        {activeIndex !== -1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg text-xs z-20 pointer-events-none"
            style={{ 
              left: mousePos.x, 
              top: mousePos.y,
              transform: `translate(-50%, -120%)`,
              minWidth: '150px'
            }}
          >
            <div className="font-bold text-white mb-2 border-b border-slate-700 pb-1">{labels[activeIndex]}</div>
            {series.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-300">{s.name}</span>
                </div>
                <span className="text-white font-mono font-semibold">{s.data[activeIndex]}%</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-[10px] text-slate-500 uppercase font-semibold">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
};