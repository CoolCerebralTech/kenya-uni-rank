import React, { useEffect } from 'react';

// UniPulse v3 — refined page container. Used by pages that haven't been
// individually redesigned yet — keeps consistent spacing + animation.
// Note: maxWidth mappings are tuned to v3 content widths.
export const PageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title?: string;
}> = ({ children, className = '', maxWidth = 'xl', title }) => {
  useEffect(() => {
    if (title) document.title = `${title} | UniPulse Kenya`;
  }, [title]);

  const widths = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-fade-in-up ${widths[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};
