import React, { useEffect } from 'react';

// Enhanced with smooth fade-in animation for page transitions
export const PageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
}> = ({ children, className = '', maxWidth = 'xl', title }) => {
  
  useEffect(() => {
    if (title) document.title = `${title} | UniPulse Kenya`;
  }, [title]);

  const widths = { sm: "max-w-3xl", md: "max-w-5xl", lg: "max-w-7xl", xl: "max-w-[1536px]", full: "max-w-full" };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-in fade-in duration-300 ${widths[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};