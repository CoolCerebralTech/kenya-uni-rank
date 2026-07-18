import React from 'react';

// Enhanced with more vibrant neon styles
export const Badge: React.FC<{
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}> = ({ variant = 'default', size = 'md', children, icon, dot, className = '' }) => {
  const variants = {
    default: "bg-slate-800/60 text-slate-300 border-slate-700/60",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-red-500/10 text-red-400 border-red-500/30",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    neon: "bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
  };
  const sizes = { sm: "px-2 py-0.5 text-[10px]", md: "px-2.5 py-1 text-xs", lg: "px-3 py-1 text-sm" };
  const dotColors = {
    default: "bg-slate-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-red-400",
    info: "bg-blue-400",
    neon: "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.7)]",
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};