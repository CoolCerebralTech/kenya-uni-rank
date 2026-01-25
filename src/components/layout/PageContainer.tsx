import React, { useEffect } from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string; // For document title
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '', 
  maxWidth = 'xl',
  title
}) => {
  
  // Update document title if provided
  useEffect(() => {
    if (title) {
      document.title = `${title} | UniPulse Kenya`;
    }
  }, [title]);

  const widths = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-[1400px]", // Custom wider breakpoint for dashboards
    full: "max-w-full",
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 ${widths[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};