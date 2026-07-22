import React from 'react';

// UniPulse v3 — circular progress ring (for university overall score)
interface ProgressRingProps {
  value: number;       // 0-100
  size?: number;       // pixel diameter
  stroke?: number;     // stroke width
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 80,
  stroke = 6,
  className = '',
}) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;

  // Color based on score
  const color = value >= 75 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white tabular leading-none">{value}</span>
        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">score</span>
      </div>
    </div>
  );
};
