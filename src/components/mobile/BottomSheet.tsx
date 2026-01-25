import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'half' | 'full' | 'auto';
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  height = 'auto'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small delay to allow render before animating in
      setTimeout(() => setIsVisible(true), 10);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const heights = {
    half: 'h-[50vh]',
    full: 'h-[90vh]',
    auto: 'h-auto max-h-[90vh]',
  };

  const content = (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div 
        className={`
          relative w-full max-w-lg bg-slate-900 border-t border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl 
          transition-transform duration-300 ease-out flex flex-col
          ${heights[height]}
          ${isVisible ? 'translate-y-0' : 'translate-y-full sm:translate-y-10 sm:opacity-0'}
        `}
      >
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-800">
          {title && <h3 className="font-bold text-white text-lg">{title}</h3>}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-full">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};