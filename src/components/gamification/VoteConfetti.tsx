import React, { useEffect, useState } from 'react';

interface VoteConfettiProps {
  isActive: boolean;
  color?: string; // University color
  onComplete?: () => void;
}

export const VoteConfetti: React.FC<VoteConfettiProps> = ({ 
  isActive, 
  color = '#22d3ee', // Default Cyan
  onComplete 
}) => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      // Create 50 particles
      setParticles(Array.from({ length: 50 }, (_, i) => i));
      
      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex items-center justify-center">
      {particles.map((i) => {
        // Random physics values for each particle
        const rotation = Math.random() * 360;
        const delay = Math.random() * 0.2;
        const duration = 0.6 + Math.random() * 0.4;
        const spreadX = (Math.random() - 0.5) * 100; // -50vw to 50vw
        const spreadY = (Math.random() - 0.5) * 100; // -50vh to 50vh
        const size = 5 + Math.random() * 10;
        const particleColor = Math.random() > 0.5 ? color : '#ffffff';

        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-sm animate-confetti-explode"
            style={{
              width: `${size}px`,
              height: `${size * 0.6}px`,
              backgroundColor: particleColor,
              transform: `rotate(${rotation}deg)`,
              // We use CSS variables to pass random values to the keyframes
              '--tx': `${spreadX}vw`,
              '--ty': `${spreadY}vh`,
              '--rot': `${rotation * 2}deg`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            } as React.CSSProperties}
          />
        );
      })}
      <style>{`
        @keyframes confetti-explode {
          0% { transform: translate(0, 0) rotate(0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
        }
        .animate-confetti-explode {
          animation-name: confetti-explode;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};