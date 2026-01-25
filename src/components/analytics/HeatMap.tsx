import React from 'react';
import { Tooltip } from '../ui/Tooltip';

interface HeatMapData {
  x: string;
  y: string;
  value: number;
}

export const HeatMap: React.FC<{ data: HeatMapData[]; xLabels: string[]; yLabels: string[] }> = ({ data, xLabels, yLabels }) => {
  const getColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500/80';
    if (val >= 60) return 'bg-emerald-600/70';
    if (val >= 40) return 'bg-emerald-700/60';
    if (val >= 20) return 'bg-emerald-800/50';
    return 'bg-slate-800/50';
  };

  return (
    <div className="overflow-x-auto custom-scrollbar pb-4">
      <div className="inline-block min-w-full">
        <div className="flex ml-28">
          {xLabels.map(label => (
            <div key={label} className="w-20 text-center text-[10px] text-slate-400 uppercase font-bold">
              {label}
            </div>
          ))}
        </div>
        <div className="space-y-1 mt-2">
          {yLabels.map(uni => (
            <div key={uni} className="flex items-center gap-1">
              <div className="w-28 text-right pr-3 text-xs font-medium text-slate-300 truncate">{uni}</div>
              {xLabels.map(cat => {
                const point = data.find(d => d.x === cat && d.y === uni);
                const val = point?.value || 0;
                return (
                  <Tooltip key={cat} content={`${uni} | ${cat}: ${val}%`}>
                    <div 
                      className={`w-20 h-8 rounded-md transition-all duration-200 hover:ring-2 hover:ring-cyan-400 cursor-pointer ${getColor(val)}`}
                    />
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};