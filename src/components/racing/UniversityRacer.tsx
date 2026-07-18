import React, { useEffect, useRef, useState } from 'react';
import type { PollResult } from '../../types/models';
import { Crown } from 'lucide-react';

// UniPulse v3 — refined race bar component.
// Animates the bar fill from 0 → target on mount/vote reveal.
// Locked state: grayscale + blur numbers (used before user votes).

interface UniversityRacerProps {
  result: PollResult;
  isLeader?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

export const UniversityRacer: React.FC<UniversityRacerProps> = ({
  result,
  isLeader = false,
  isLocked = false,
  onClick,
}) => {
  const targetPercentage = isLocked ? Math.max(12, result.percentage) : result.percentage;
  const [width, setWidth] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  // Animate the bar width on mount or when value changes
  useEffect(() => {
    // Use rAF to trigger the CSS transition by jumping from 0 → target
    const id = requestAnimationFrame(() => {
      setWidth(Math.min(100, targetPercentage));
    });
    return () => cancelAnimationFrame(id);
  }, [targetPercentage]);

  return (
    <div
      className={`relative w-full group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Label row */}
      <div className="flex justify-between items-end mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {isLeader && (
            <Crown
              size={13}
              className="text-amber-300 fill-amber-400 shrink-0 animate-pulse-soft"
              strokeWidth={2}
            />
          )}
          <span className={`text-sm font-semibold truncate ${isLeader ? 'text-white' : 'text-slate-300'}`}>
            <span className="font-mono text-slate-600 text-xs mr-1.5 tabular">{result.rank}.</span>
            {result.universityName}
          </span>
        </div>

        {/* Numbers — hidden when locked */}
        <div className={`font-mono text-xs flex items-baseline gap-1 tabular ${isLocked ? 'blur-sm text-slate-600' : 'text-slate-400'}`}>
          {!isLocked && (
            <>
              <span className="font-bold text-white text-sm">{result.percentage.toFixed(1)}%</span>
              <span className="opacity-50 text-[10px]">/ {result.votes}</span>
            </>
          )}
          {isLocked && <span className="text-[10px]">??%</span>}
        </div>
      </div>

      {/* Track */}
      <div
        ref={barRef}
        className="h-9 w-full bg-slate-900/80 rounded-lg overflow-hidden border border-slate-800/80 relative shadow-inner"
      >
        {/* Bar */}
        <div
          className="h-full relative transition-[width] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center px-2.5"
          style={{
            width: `${width}%`,
            background: isLocked
              ? 'linear-gradient(90deg, #334155 0%, #475569 100%)'
              : `linear-gradient(90deg, ${result.universityColor} 0%, ${shade(result.universityColor, 18)} 100%)`,
            filter: isLocked ? 'grayscale(100%) brightness(0.7)' : 'none',
            boxShadow: isLeader && !isLocked ? `0 0 20px ${hexA(result.universityColor, 0.35)}` : 'none',
          }}
        >
          {/* Shine */}
          {!isLocked && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:via-white/20 transition-colors" />
          )}
          {/* Short name inside bar */}
          {width > 18 && (
            <span className="relative z-10 text-white font-bold text-[10px] tracking-wider uppercase drop-shadow-sm truncate">
              {result.universityShortName}
            </span>
          )}
        </div>

        {/* Short name outside bar — when narrow */}
        {width <= 18 && !isLocked && (
          <div className="absolute left-2 top-0 bottom-0 flex items-center" style={{ left: `calc(${width}% + 6px)` }}>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              {result.universityShortName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- color helpers ----------
// Convert a hex color string into an rgba string with the given alpha.
function hexA(hex: string, a: number): string {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
// Lighten or darken a hex color by an absolute percent (−100 to +100).
function shade(hex: string, percent: number): string {
  const { r, g, b } = parseHex(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = Math.round((t - r) * p) + r;
  const G = Math.round((t - g) * p) + g;
  const B = Math.round((t - b) * p) + b;
  return `rgb(${R}, ${G}, ${B})`;
}
function parseHex(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export default UniversityRacer;
