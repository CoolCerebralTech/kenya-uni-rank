import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const baseClasses = "bg-slate-800/50 rounded";
  
  const variants = {
    text: "h-4 w-full rounded-md",
    rect: "h-32 w-full rounded-xl",
    circle: "h-12 w-12 rounded-full",
  };

  const style = { width, height };
  const items = Array(count).fill(0);

  return (
    <>
      {items.map((_, index) => (
        <div
          key={index}
          className={`relative overflow-hidden ${baseClasses} ${variants[variant]} ${className} ${count > 1 && index < count - 1 ? 'mb-2' : ''}`}
          style={style}
        >
          {/* UPGRADE: Standardized shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        </div>
      ))}
    </>
  );
};