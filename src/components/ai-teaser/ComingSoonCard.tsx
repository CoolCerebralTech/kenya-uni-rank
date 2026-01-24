import { useState } from 'react';

export function AIMatchTeaser() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Teaser Card */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        
        {/* Card Content */}
        <div className="relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 space-y-6">
          {/* Icon & Badge */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="text-5xl">🤖✨</div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white leading-tight">
              AI-Powered University Matching
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Find your perfect fit based on your preferences, not just grades. 
              We're building this using <span className="text-cyan-400 font-semibold">real student data</span>, not guesses.
            </p>
          </div>

          {/* Features Preview */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs">✓</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">Personal Vibe Matching</div>
                <div className="text-xs text-slate-500">Based on your learning style, social preferences & goals</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs">✓</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">Honest Trade-offs</div>
                <div className="text-xs text-slate-500">No sugar-coating — see real pros & cons from students</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs">✓</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">Top 3 Recommendations</div>
                <div className="text-xs text-slate-500">Personalized matches beyond KCSE cluster points</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white overflow-hidden transform hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Preview the Future 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Trust Badge */}
          <div className="pt-4 border-t border-slate-700/50 text-center">
            <p className="text-xs text-slate-500">
              Launching after we collect enough honest student votes
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative max-w-md w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 space-y-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Meme/Visual */}
            <div className="text-center space-y-4">
              <div className="text-7xl animate-bounce-slow">
                🔮
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">
                  Not Yet... But Soon
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  We're building something <span className="text-cyan-400 font-semibold">magical</span> using real student data, not marketing BS.
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-400">Data Collection</span>
                <span className="text-sm font-bold text-green-400">In Progress</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-400">AI Training</span>
                <span className="text-sm font-bold text-amber-400">Next Phase</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-400">Launch Date</span>
                <span className="text-sm font-bold text-cyan-400">Post-Feb 2026</span>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-400 text-center">
                  💡 <span className="font-semibold">Help us build it!</span> Every honest vote makes the AI smarter.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-bold text-white transition-colors"
              >
                Got it, let me vote!
              </button>
            </div>

            {/* Disclaimer */}
            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 text-center leading-relaxed">
                <span className="font-semibold text-slate-400">Note:</span> This is a decision-aid system based on community opinions, not official university advice.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}