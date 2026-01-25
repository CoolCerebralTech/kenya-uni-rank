import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';

export const SwipeCard: React.FC<{
  children: React.ReactNode;
  onSwipeLeft: () => void; // Skip
  onSwipeRight: () => void; // Vote
}> = ({ children, onSwipeLeft, onSwipeRight }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacityRight = useTransform(x, [10, 100], [0, 1]);
  const opacityLeft = useTransform(x, [-10, -100], [0, 1]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipeRight();
    } else if (info.offset.x < -100) {
      onSwipeLeft();
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate }}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        className="absolute w-full h-full cursor-grab"
      >
        {/* Indicators */}
        <motion.div style={{ opacity: opacityRight }} className="absolute top-10 left-10 border-4 border-emerald-500 rounded-lg p-2 transform -rotate-12 font-bold text-emerald-500 text-3xl uppercase tracking-widest">VOTE</motion.div>
        <motion.div style={{ opacity: opacityLeft }} className="absolute top-10 right-10 border-4 border-red-500 rounded-lg p-2 transform rotate-12 font-bold text-red-500 text-3xl uppercase tracking-widest">SKIP</motion.div>
        
        {children}
      </motion.div>

      {/* Desktop/Fallback Controls */}
      <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-8 md:hidden">
        <button onClick={onSwipeLeft} className="p-4 bg-slate-900 rounded-full text-red-500 border-2 border-red-500/50 shadow-lg active:scale-95 transition-transform"><X size={24} /></button>
        <button onClick={onSwipeRight} className="p-4 bg-slate-900 rounded-full text-emerald-500 border-2 border-emerald-500/50 shadow-lg active:scale-95 transition-transform"><Check size={24} /></button>
      </div>
    </div>
  );
};