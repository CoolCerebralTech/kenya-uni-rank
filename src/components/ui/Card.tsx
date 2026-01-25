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
      glass: "bg-slate-900/60 backdrop-blur-md border border-white/5",
    };

    const paddings = {
      none: "p-0",
      sm: "p-3",
      md: "p-5",
      lg: "p-8",
    };

    const hoverClasses = hoverEffect 
      ? "hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer" 
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';