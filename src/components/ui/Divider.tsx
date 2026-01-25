import React from 'react';

interface DividerProps {
  label?: string;
  vertical?: boolean;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, vertical = false, className = '' }) => {
  if (vertical) {
    return <div className={`w-px h-full bg-slate-800 ${className}`} />;
  }

  return (
    <div className={`relative flex items-center w-full py-4 ${className}`}>
      <div className="flex-grow border-t border-slate-800"></div>
      {label && (
        <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex-grow border-t border-slate-800"></div>
    </div>
  );
};