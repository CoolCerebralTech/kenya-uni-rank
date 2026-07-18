import React from 'react';

interface SectionDividerProps {
  label?: string;
  icon?: React.ReactNode;
  variant?: 'simple' | 'neon' | 'glass';
  className?: string;
}

// UniPulse v3 — refined section divider. Tighter spacing, cyan accent for neon.
export const SectionDivider: React.FC<SectionDividerProps> = ({
  label,
  icon,
  variant = 'simple',
  className = '',
}) => {
  const variants = {
    simple: 'border-slate-800/60',
    neon: 'border-cyan-500/25',
    glass: 'border-white/10',
  };

  const iconColor =
    variant === 'neon' ? 'text-cyan-400' : 'text-slate-500';

  return (
    <div className={`relative flex items-center py-5 ${className}`}>
      <div className={`flex-grow border-t ${variants[variant]}`} />

      {(label || icon) && (
        <div className="flex-shrink-0 mx-3 sm:mx-4 flex items-center gap-1.5">
          {icon && <span className={iconColor}>{icon}</span>}
          {label && (
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.18em]">
              {label}
            </span>
          )}
        </div>
      )}

      <div className={`flex-grow border-t ${variants[variant]}`} />

      {variant === 'neon' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      )}
    </div>
  );
};
