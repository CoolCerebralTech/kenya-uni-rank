import React, { useState } from 'react';

type TimeoutId = ReturnType<typeof setTimeout>;

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  delay = 300 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<TimeoutId>();

  const show = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-800 border border-slate-700 rounded shadow-xl whitespace-nowrap animate-in fade-in duration-200 ${positions[position]}`}>
          {content}
          {/* Arrow */}
          <div className="absolute w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45"
            style={{
              bottom: position === 'top' ? '-4px' : 'auto',
              top: position === 'bottom' ? '-4px' : 'auto',
              left: ['top', 'bottom'].includes(position) ? '50%' : 'auto',
              right: position === 'left' ? '-4px' : 'auto',
              marginLeft: ['top', 'bottom'].includes(position) ? '-4px' : '0',
            }}
          />
        </div>
      )}
    </div>
  );
};