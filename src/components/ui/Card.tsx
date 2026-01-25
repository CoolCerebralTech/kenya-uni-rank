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
      default: "bg-slate-900 border border-slate-800/60",
      elevated: "bg-slate-900 shadow-xl shadow-black/50 border border-slate-800",
      outlined: "bg-transparent border border-slate-700",
      glass: "bg-slate-900/60 backdrop-blur-md border border-white/10",
    };

    const paddings = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    // UPGRADE: Enhanced hover effect with a glowing gradient border
    const hoverClasses = hoverEffect 
      ? "hover:-translate-y-1 relative before:absolute before:inset-0 before:p-px before:rounded-xl before:bg-gradient-to-b before:from-indigo-500 before:to-blue-600 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300" 
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