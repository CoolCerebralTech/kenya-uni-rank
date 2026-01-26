import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';

/**
 * 🏎️ EPIC RACE ANIMATION SYSTEM
 * Implements smooth FLIP animations
 */

interface RaceAnimationProps {
  children: React.ReactNode;
  enableEffects?: boolean;
  raceMode?: 'standard' | 'turbo' | 'blazing';
}

export const RaceAnimation: React.FC<RaceAnimationProps> = ({ 
  children, 
  enableEffects = true,
  raceMode = 'turbo' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Store PREVIOUS positions to compare against
  const prevPositionsRef = useRef<Map<string, DOMRect>>(new Map());
  
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const items = Array.from(container.children) as HTMLElement[];
    const newPositions = new Map<string, DOMRect>();
    
    // 1. Measure NEW positions
    items.forEach((item, index) => {
      const key = item.dataset.raceKey || `item-${index}`;
      newPositions.set(key, item.getBoundingClientRect());
    });

    // 2. Compare with OLD positions
    items.forEach((item, index) => {
      const key = item.dataset.raceKey || `item-${index}`;
      const prev = prevPositionsRef.current.get(key);
      const curr = newPositions.get(key);
      
      if (prev && curr) {
        const deltaX = prev.left - curr.left;
        const deltaY = prev.top - curr.top;
        
        if (deltaX !== 0 || deltaY !== 0) {
          setIsAnimating(true);
          
          // INVERT: Move back to old position instantly
          item.style.transition = 'none';
          item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          
          // Force reflow
          void item.offsetHeight;
          
          // PLAY: Animate to new position
          item.style.transition = `transform ${getDuration(raceMode)}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
          item.style.transform = 'translate(0, 0)';
          
          // Add effects
          if (enableEffects && Math.abs(deltaY) > 20) {
            addOvertakeEffect(item, deltaY > 0 ? 'up' : 'down');
          }

          // Cleanup
          setTimeout(() => {
            if (item) {
              item.style.transition = '';
              item.style.transform = '';
              setIsAnimating(false);
            }
          }, getDuration(raceMode));
        }
      }
    });

    // 3. Save NEW positions for next render
    prevPositionsRef.current = newPositions;

  }, [children, enableEffects, raceMode]); // Runs whenever children (order) changes
  
  return (
    <div 
      ref={containerRef} 
      className={`relative ${isAnimating ? 'race-active' : ''}`}
    >
      {/* Background Grid Lines */}
      {enableEffects && (
        <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none opacity-10 z-0">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-full border-t border-cyan-500/20"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
        </div>
      )}
      
      {children}
      
      <style>{`
        .race-active {
          background: radial-gradient(ellipse at center, rgba(6, 182, 212, 0.05) 0%, transparent 70%);
        }
        
        .overtaking-up { z-index: 10; filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.4)); }
        .overtaking-down { z-index: 9; filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.4)); }
      `}</style>
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDuration(mode: 'standard' | 'turbo' | 'blazing'): number {
  switch (mode) {
    case 'standard': return 800;
    case 'turbo': return 600;
    case 'blazing': return 400;
    default: return 600;
  }
}

function addOvertakeEffect(element: HTMLElement, direction: 'up' | 'down') {
  const className = direction === 'up' ? 'overtaking-up' : 'overtaking-down';
  element.classList.add(className);
  setTimeout(() => element.classList.remove(className), 600);
}

// ============================================================================
// PARTICLE SYSTEM (Exported!)
// ============================================================================

interface ParticleEffectProps {
  active: boolean;
  color?: string;
}

// FIX: Added 'export' keyword here
export const RaceParticles: React.FC<ParticleEffectProps> = ({ 
  active, 
  color = '#06b6d4' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number }> = [];
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        size: Math.random() * 3 + 1,
      });
    }
    
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        if (p.life <= 0) {
          particles[index] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            size: Math.random() * 3 + 1,
          };
        }
        
        ctx.globalAlpha = p.life;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [active, color]);
  
  if (!active) return null;
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30 z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};