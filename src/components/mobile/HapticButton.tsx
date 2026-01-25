import React from 'react';
// UPGRADE: Import the Button and its props type
import { Button, type ButtonProps } from '../ui/Button';

// UPGRADE: Extend ButtonProps to inherit all its properties (variant, size, etc.)
// and add our new 'pattern' prop.
interface HapticButtonProps extends ButtonProps {
  pattern?: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy';
}

export const HapticButton: React.FC<HapticButtonProps> = ({ 
  pattern = 'light', 
  onClick, 
  children, 
  ...props // `...props` now safely contains correctly typed `variant`, `size`, etc.
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

  // The props are now passed through with perfect type safety.
  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};