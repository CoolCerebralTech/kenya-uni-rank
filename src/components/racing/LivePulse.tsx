import React from 'react';
import { Tooltip } from '../ui/Tooltip';

interface LivePulseProps {
  color?: string;
  label?: string;
  isActive?: boolean;
}

export const LivePulse: React.FC<LivePulseProps> = ({ 
  color = '#22c55e', // Default green
  label = 'Live Updates Active',
  isActive = true 
}) => {
  if (!isActive) return null;

  return (
    <Tooltip content={label} position="left">
      <div className="relative flex h-3 w-3">
        <span 
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" 
          style={{ backgroundColor: color }}
        />
        <span 
          className="relative inline-flex rounded-full h-3 w-3" 
          style={{ backgroundColor: color }}
        />
      </div>
    </Tooltip>
  );
};