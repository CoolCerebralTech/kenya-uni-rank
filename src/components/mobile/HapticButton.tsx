import React from 'react';
import { Button } from '../ui/Button'; // Assuming we wrap the UI button

interface HapticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pattern?: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy';
  children: React.ReactNode;
  variant?: unknown; // Pass through to Button
  size?: unknown; // Pass through to Button
  className?: string;
}

export const HapticButton: React.FC<HapticButtonProps> = ({ 
  pattern = 'light', 
  onClick, 
  children, 
  ...props 
}) => {
  
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      switch (pattern) {
        case 'success': navigator.vibrate([50, 50, 50]); break;
        case 'warning': navigator.vibrate([100, 50, 100]); break;
        case 'error': navigator.vibrate([50, 100, 50, 100, 50]); break;
        case 'light': navigator.vibrate(20); break;
        case 'medium': navigator.vibrate(50); break;
        case 'heavy': navigator.vibrate(100); break;
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHaptic();
    if (onClick) onClick(e);
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};