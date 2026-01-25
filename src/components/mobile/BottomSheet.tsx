import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BottomSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'half' | 'full' | 'auto';
}> = ({ isOpen, onClose, title, children, height = 'auto' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const heights = { half: '50vh', full: '90vh', auto: 'auto' };
  const maxHeights = { half: '50vh', full: '90vh', auto: '90vh' };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ height: heights[height], maxHeight: maxHeights[height] }}
            className="relative w-full max-w-lg bg-slate-900 border-t border-slate-700 rounded-t-2xl shadow-2xl flex flex-col"
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-700 rounded-full" />
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800 mt-4">
              <h3 className="font-bold text-white text-lg">{title || ''}</h3>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};