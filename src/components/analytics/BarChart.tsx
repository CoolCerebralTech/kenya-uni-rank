import React from 'react';
import { motion } from 'framer-motion';

interface BarData {
  label: string;
  value: number;
  color: string;
}

export const BarChart: React.FC<{ data: BarData[]; height?: number }> = ({ data, height = 200 }) => {
  const max = Math.max(...data.map(d => d.value), 0);

  return (
    <div className="w-full flex items-end gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="group relative flex-1 h-full flex flex-col justify-end items-center">
          <div className="relative w-full h-full flex items-end">
            <motion.div 
              className="w-full rounded-t-md"
              style={{ backgroundColor: item.color }}
              initial={{ height: '0%' }}
              animate={{ height: `${(item.value / max) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            />
          </div>
          <div className="absolute -top-6 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {item.value} votes
          </div>
          <span className="mt-2 text-[10px] text-slate-500 uppercase font-bold truncate w-full text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};