import React, { useEffect } from 'react';

interface Particle {
  id: number;
  rotation: number;
  delay: number;
  duration: number;
  spreadX: number;
  spreadY: number;
  size: number;
  color: string;
}

export const VoteConfetti: React.FC<{
  isActive: boolean;
  color?: string;
  onComplete?: () => void;
}> = ({ isActive, color = '#22d3ee', onComplete }) => {
  // ✅ NO STATE AT ALL - Pure computation based on prop
  const particles: Particle[] = React.useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      rotation: (i * 137.5) % 360,
      delay: (i % 10) * 0.02,
      duration: 0.8 + (i % 6) * 0.1,
      spreadX: ((i % 24) - 12) * 5,
      spreadY: ((i % 20) - 10) * 6,
      size: 6 + (i % 12),
      color: (i % 3 === 0) ? color : '#ffffff',
    })), [color]);

  // ✅ ONLY external timer effect - no state updates
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-1/2 left-1/2 rounded-sm animate-confetti-explode"
          style={{
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            '--tx': `${p.spreadX}vw`,
            '--ty': `${p.spreadY}vh`,
            '--rot': `${p.rotation * 2}deg`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          } as React.CSSProperties}
        />
      ))}
      <style>{`
        @keyframes confetti-explode {
          0% { transform: translate(0, 0) rotate(0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
        }
        .animate-confetti-explode {
          animation-name: confetti-explode;
          animation-timing-function: cubic-bezier(0.1, 0.9, 0.2, 1);
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};
