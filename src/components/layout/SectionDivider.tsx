import React from 'react';

interface SectionDividerProps {
  label?: string;
  icon?: React.ReactNode;
  variant?: 'simple' | 'neon' | 'glass';
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ 
  label, 
  icon, 
  variant = 'simple',
  className = '' 
}) => {
  
  const variants = {
    simple: "border-slate-800",
    neon: "border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]",
    glass: "border-white/10",
  };

  return (
    <div className={`relative flex items-center py-8 ${className}`}>
      <div className={`flex-grow border-t ${variants[variant]}`}></div>
      
      {(label || icon) && (
        <div className="flex-shrink-0 mx-4 flex items-center gap-2">
          {icon && <span className="text-slate-500">{icon}</span>}
          {label && (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {label}
            </span>
          )}
        </div>
      )}
      
      <div className={`flex-grow border-t ${variants[variant]}`}></div>
      
      {/* Decorative gradient fade for neon variant */}
      {variant === 'neon' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent pointer-events-none" />
      )}
    </div>
  );
};