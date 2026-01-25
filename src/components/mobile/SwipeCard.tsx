import React, { useState, useRef } from 'react';
import { X, Check } from 'lucide-react';

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft: () => void; // Skip
  onSwipeRight: () => void; // Vote/Like
  disabled?: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  disabled 
}) => {
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging || disabled) return;
    setIsDragging(false);

    const threshold = 100; // Pixels to trigger swipe

    if (offsetX > threshold) {
      // Swiped Right
      setOffsetX(500); // Fly off screen
      setTimeout(() => {
        onSwipeRight();
        setOffsetX(0);
      }, 300);
    } else if (offsetX < -threshold) {
      // Swiped Left
      setOffsetX(-500); // Fly off screen
      setTimeout(() => {
        onSwipeLeft();
        setOffsetX(0);
      }, 300);
    } else {
      // Reset
      setOffsetX(0);
    }
  };

  // Visual calculations
  const rotate = (offsetX / 20); // Degrees
  const opacityRight = Math.min(1, Math.max(0, offsetX / 100));
  const opacityLeft = Math.min(1, Math.max(0, -offsetX / 100));

  return (
    <div className="relative w-full h-full perspective-1000">
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full relative"
        style={{
          transform: `translateX(${offsetX}px) rotate(${rotate}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Indicators Overlay */}
        {isDragging && (
          <>
            <div 
              className="absolute top-4 left-4 border-4 border-green-500 rounded-lg p-2 transform -rotate-12 z-20 font-bold text-green-500 text-2xl uppercase tracking-widest"
              style={{ opacity: opacityRight }}
            >
              VOTE
            </div>
            <div 
              className="absolute top-4 right-4 border-4 border-red-500 rounded-lg p-2 transform rotate-12 z-20 font-bold text-red-500 text-2xl uppercase tracking-widest"
              style={{ opacity: opacityLeft }}
            >
              SKIP
            </div>
          </>
        )}
        
        {children}
      </div>

      {/* Desktop Controls (Fallback) */}
      <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-8 md:hidden">
        <button 
          onClick={() => { setOffsetX(-500); setTimeout(() => { onSwipeLeft(); setOffsetX(0); }, 300); }}
          className="p-4 bg-slate-900 rounded-full text-red-500 border border-slate-800 shadow-lg active:scale-95 transition-transform"
        >
          <X size={24} />
        </button>
        <button 
          onClick={() => { setOffsetX(500); setTimeout(() => { onSwipeRight(); setOffsetX(0); }, 300); }}
          className="p-4 bg-slate-900 rounded-full text-green-500 border border-slate-800 shadow-lg active:scale-95 transition-transform"
        >
          <Check size={24} />
        </button>
      </div>
    </div>
  );
};