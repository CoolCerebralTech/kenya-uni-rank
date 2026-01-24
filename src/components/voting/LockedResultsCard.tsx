
interface LockedResultsCardProps {
  categoryName: string;
  pollCount: number;
  onUnlock: () => void;
}

export function LockedResultsCard({ 
  categoryName, 
  pollCount, 
  onUnlock 
}: LockedResultsCardProps) {
  return (
    <div className="relative group">
      {/* Blurred Background Preview */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl blur-sm opacity-50" />
      
      {/* Lock Overlay */}
      <div className="relative p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-2xl border-2 border-slate-700/50 space-y-6 min-h-[400px] flex flex-col items-center justify-center">
        {/* Lock Icon with Animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative text-7xl animate-bounce-slow filter drop-shadow-lg">
            🔒
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white">
            Results Locked
          </h3>
          <p className="text-slate-400 max-w-sm">
            Vote in <span className="text-cyan-400 font-semibold">{categoryName}</span> polls to unlock real student opinions
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-black text-cyan-400">{pollCount}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Polls</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-green-400">Live</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Results</div>
          </div>
        </div>

        {/* Unlock Button */}
        <button
          onClick={onUnlock}
          className="group/btn relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-white overflow-hidden transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-cyan-500/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            🗳️ Cast Your Votes
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
        </button>

        {/* Trust Message */}
        <div className="pt-4 border-t border-slate-700/50 text-center">
          <p className="text-xs text-slate-500 leading-relaxed">
            We hide results until you vote to prevent bias.<br/>
            Your honest opinion makes these rankings trustworthy.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 text-4xl opacity-20 animate-pulse">
          ✨
        </div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-20 animate-pulse delay-300">
          🎯
        </div>
      </div>
    </div>
  );
}