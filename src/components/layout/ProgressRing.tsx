
interface ProgressRingProps {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export function ProgressRing({ 
  completed, 
  total, 
  size = 120, 
  strokeWidth = 8,
  showLabel = true 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (completed / total) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* SVG Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-white">
            {completed}/{total}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">
            Categories
          </div>
        </div>
      )}

      {/* Glow Effect */}
      {percentage > 0 && (
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
}