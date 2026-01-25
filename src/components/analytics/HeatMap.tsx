import React from 'react';
import { Tooltip } from '../ui/Tooltip';

interface HeatMapData {
  x: string; // Category
  y: string; // University
  value: number; // 0-100 score
}

interface HeatMapProps {
  data: HeatMapData[];
  xLabels: string[];
  yLabels: string[];
}

export const HeatMap: React.FC<HeatMapProps> = ({ data, xLabels, yLabels }) => {
  const getColor = (val: number) => {
    // Green intensity scale
    if (val >= 80) return 'bg-green-500';
    if (val >= 60) return 'bg-green-600/80';
    if (val >= 40) return 'bg-green-700/60';
    if (val >= 20) return 'bg-green-800/40';
    return 'bg-slate-800';
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* X Labels (Categories) */}
        <div className="flex mb-2 ml-24">
          {xLabels.map(label => (
            <div key={label} className="w-16 text-center text-[10px] text-slate-500 uppercase font-bold rotate-0">
              {label.substring(0, 4)}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="space-y-1">
          {yLabels.map(uni => (
            <div key={uni} className="flex items-center gap-1">
              {/* Y Label (University) */}
              <div className="w-24 text-right pr-3 text-xs font-medium text-slate-400 truncate">
                {uni}
              </div>
              
              {/* Cells */}
              {xLabels.map(cat => {
                const point = data.find(d => d.x === cat && d.y === uni);
                const val = point?.value || 0;
                
                return (
                  <Tooltip key={cat} content={`${uni} - ${cat}: ${val}%`}>
                    <div 
                      className={`w-16 h-8 rounded-sm transition-all hover:ring-2 hover:ring-white/50 cursor-pointer ${getColor(val)}`}
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