import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', hoverEffect = false, children, ...props }, ref) => {
    
    const baseStyles = "rounded-xl overflow-hidden transition-all duration-300";

    const variants = {
      default: "bg-slate-900/50 border border-slate-800/60",
      elevated: "bg-slate-900/60 shadow-xl shadow-black/40 border border-slate-800/60",
      outlined: "bg-transparent border border-slate-700/60",
      glass: "glass border border-slate-800/60",
    };

    const paddings = {
      none: "p-0",
      sm: "p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    };

    // Refined hover effect — subtle lift + cyan glow border
    const hoverClasses = hoverEffect
      ? "hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
      : "";

    return (
      <div
        ref={ref}
        className={`group ${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${className}`}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

Card.displayName = 'Card';