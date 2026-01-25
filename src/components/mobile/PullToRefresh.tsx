import React, { useState, useRef } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const THRESHOLD = 80; // px to trigger refresh

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0 || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0 && window.scrollY === 0) {
      // Add resistance
      setPullDistance(Math.min(diff * 0.5, 120));
      // Prevent default pull-to-refresh
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (isRefreshing) return;

    if (pullDistance > THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(60); // Snap to loading position
      await onRefresh();
      setIsRefreshing(false);
    }
    
    setPullDistance(0);
    setStartY(0);
  };

  return (
    <div 
      className="min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Indicator */}
      <div 
        className="fixed top-16 left-0 right-0 flex justify-center pointer-events-none z-40 transition-all duration-200"
        style={{ 
          transform: `translateY(${pullDistance > 0 ? pullDistance - 40 : -50}px)`,
          opacity: pullDistance > 0 ? 1 : 0 
        }}
      >
        <div className="bg-slate-900 rounded-full p-2 shadow-lg border border-slate-700 text-cyan-400">
          {isRefreshing ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <ArrowDown 
              size={20} 
              style={{ transform: `rotate(${Math.min(pullDistance * 2, 180)}deg)` }} 
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: isDragging() ? 'none' : 'transform 0.3s cubic-bezier(0,0,0.2,1)' 
        }}
      >
        {children}
      </div>
    </div>
  );

  function isDragging() {
    return startY > 0 && !isRefreshing;
  }
};