import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  size = 'md', 
  children, 
  icon, 
  dot, 
  className = '' 
}) => {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-emerald-950/50 text-emerald-400 border-emerald-900",
    warning: "bg-amber-950/50 text-amber-400 border-amber-900",
    danger: "bg-red-950/50 text-red-400 border-red-900",
    info: "bg-blue-950/50 text-blue-400 border-blue-900",
    neon: "bg-slate-950 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  const dotColors = {
    default: "bg-slate-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-red-400",
    info: "bg-blue-400",
    neon: "bg-cyan-400 animate-pulse",
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};