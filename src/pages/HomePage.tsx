import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, BarChart3, Shield, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section - Polymarket Style */}
      <section className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black px-6 py-12 text-center sm:px-12">
        {/* Polymarket-style grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Zap size={14} />
            <span>Real-Time Campus Sentiment</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Glassdoor Meets
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Polymarket
            </span>
            <span className="text-xl text-gray-400">for Kenyan Universities</span>
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            No marketing fluff. Just raw, unfiltered data from students. 
            Vote on campus life, academics, sports—see real-time odds.
          </p>
          
          <div className="flex flex-col justify-center gap-4 sm:flex-row pt-4">
            <Link 
              to="/vote" 
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3.5 font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02]"
            >
              <BarChart3 size={20} />
              Start Voting
            </Link>
            <Link 
              to="/rankings" 
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-8 py-3.5 font-semibold text-gray-200 transition-all hover:bg-gray-800"
            >
              <TrendingUp size={20} />
              View Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid - Polymarket Style */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">20+</div>
          <div className="text-sm text-gray-400">Universities</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">5</div>
          <div className="text-sm text-gray-400">Categories</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">Real-Time</div>
          <div className="text-sm text-gray-400">Live Odds</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <div className="text-2xl font-bold text-white">100%</div>
          <div className="text-sm text-gray-400">Anonymous</div>
        </div>
      </div>

      {/* Features - Polymarket Card Style */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="group rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-blue-500/50 hover:bg-gray-900/80">
          <div className="mb-4 inline-flex rounded-lg bg-blue-500/20 p-3 text-blue-400">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Live Odds</h3>
          <p className="text-gray-400">
            Like Polymarket for campus life. Watch sentiment shift in real-time as students vote.
          </p>
        </div>
        
        <div className="group rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-green-500/50 hover:bg-gray-900/80">
          <div className="mb-4 inline-flex rounded-lg bg-green-500/20 p-3 text-green-400">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Zero-Signup</h3>
          <p className="text-gray-400">
            No accounts. No tracking. Browser fingerprinting prevents spam while keeping votes anonymous.
          </p>
        </div>
        
        <div className="group rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-purple-500/50 hover:bg-gray-900/80">
          <div className="mb-4 inline-flex rounded-lg bg-purple-500/20 p-3 text-purple-400">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Raw Data</h3>
          <p className="text-gray-400">
            From "Best Vibes" to "Worst Admin"—the real categories students care about, uncensored.
          </p>
        </div>
      </section>
    </div>
  );
};