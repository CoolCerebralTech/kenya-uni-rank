import React from 'react';

// Extracted for clarity and reusability
export const Spinner: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'accent';
  className?: string;
}> = ({ size = 'md', variant = 'primary', className = '' }) => {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-2", lg: "w-10 h-10 border-4", xl: "w-16 h-16 border-4" };
  const variants = { primary: "border-slate-800 border-t-blue-500", white: "border-white/20 border-t-white", accent: "border-slate-800 border-t-cyan-400" };
  return <div className={`inline-block animate-spin rounded-full ${sizes[size]} ${variants[variant]} ${className}`} />;
};

export const FullScreenLoader: React.FC<{ label?: string }> = ({ label = "Initializing System..." }) => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
    <Spinner size="xl" variant="accent" />
    <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">{label}</p>
  </div>
);