import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    fullWidth = false, 
    children, 
    disabled, 
    ...props 
  }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 border border-transparent focus:ring-blue-500 focus:ring-offset-slate-950",
      neon: "bg-slate-950 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-950/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:border-cyan-400 focus:ring-cyan-500 focus:ring-offset-slate-950",
      secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 focus:ring-slate-500 focus:ring-offset-slate-950",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20 focus:ring-red-500 focus:ring-offset-slate-950",
      ghost: "text-slate-400 hover:text-white hover:bg-white/10 focus:ring-slate-500 focus:ring-offset-slate-950",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="absolute h-5 w-5 animate-spin" />}
        <span className={`flex items-center justify-center ${isLoading ? 'invisible' : 'visible'}`}>
          {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';