import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, BarChart3, Shield, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section - Engaging student sentiment overview with vibrant campus energy */}
      {/* Image: Vibrant aerial view of University of Nairobi campus with students walking and modern buildings in Nairobi Kenya - Place as full-width background or hero image */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-radial from-primary-900/40 to-background px-6 py-16 text-center sm:px-12 shadow-glow-blue">
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-500/10 px-4 py-2 text-sm text-secondary-300 border border-secondary-500/30 animate-pulse">
            <Zap size={14} />
            <span>Powered by Real Student Votes</span>
          </div>
          
          <h1 className="text-4xl md:text-display font-display text-inverted">
            Discover the <span className="text-primary-400">True Pulse</span> of Kenyan Universities
          </h1>
          
          <p className="text-subtitle text-text-muted max-w-2xl mx-auto">
            Vote anonymously, see live rankings, and get unfiltered insights from fellow students. No sign-up required—just real sentiment.
          </p>
          
          <div className="flex flex-col justify-center gap-4 sm:flex-row pt-4">
            <Link 
              to="/vote" 
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 hover:bg-primary-hover px-8 py-3.5 font-semibold text-primary-foreground transition-all hover:shadow-glow hover:scale-[1.02]"
            >
              <BarChart3 size={20} />
              Start Voting Now
            </Link>
            <Link 
              to="/rankings" 
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-8 py-3.5 font-semibold text-inverted hover:bg-background-hover transition-all hover:scale-[1.02]"
            >
              <TrendingUp size={20} />
              Explore Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid - Quick overview of platform metrics with subtle icons */}
      {/* Image: Dynamic illustration of students voting on mobile phones with poll charts and Kenyan university logos floating around - Place as a central illustrative graphic above the stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-background-elevated p-6 border border-border shadow-card hover:shadow-glow-blue transition-all">
          <div className="text-2xl font-bold text-primary-400">7+</div>
          <div className="text-sm text-text-muted">Top Universities</div>
        </div>
        <div className="rounded-xl bg-background-elevated p-6 border border-border shadow-card hover:shadow-glow-blue transition-all">
          <div className="text-2xl font-bold text-primary-400">8</div>
          <div className="text-sm text-text-muted">Voting Categories</div>
        </div>
        <div className="rounded-xl bg-background-elevated p-6 border border-border shadow-card hover:shadow-glow-blue transition-all">
          <div className="text-2xl font-bold text-primary-400">Live</div>
          <div className="text-sm text-text-muted">Real-Time Updates</div>
        </div>
        <div className="rounded-xl bg-background-elevated p-6 border border-border shadow-card hover:shadow-glow-blue transition-all">
          <div className="text-2xl font-bold text-primary-400">100%</div>
          <div className="text-sm text-text-muted">Anonymous Voting</div>
        </div>
      </div>

      {/* Top Rankings Teaser - Dashboard-style preview of current rankings */}
      {/* Image: Sleek dashboard showing university rankings with bar charts in dark mode UI design - Place as an embedded mockup or screenshot-like element in this section */}
      <section className="rounded-xl bg-background-muted p-8 border border-border shadow-glow animate-slide-up">
        <h2 className="text-2xl font-display text-inverted mb-6">Sneak Peek: Current Top Rankings</h2>
        <p className="text-text-muted mb-4">See how universities stack up based on real student votes.</p>
        {/* Placeholder for a mini chart component or image - e.g., <UniversityBarChart data={sampleData} /> */}
        <div className="h-48 bg-background-elevated rounded-lg flex items-center justify-center text-text-subtle">
          {/* Integrate a real chart here, or use the image suggestion above */}
          Mini Rankings Chart Goes Here
        </div>
        <Link to="/rankings" className="mt-4 inline-block text-primary-500 hover:text-primary-hover">View Full Rankings →</Link>
      </section>

      {/* Featured Polls - Teaser for active polls with engaging visuals */}
      {/* Image: Group of diverse Kenyan university students celebrating campus life with sports and events - Place as a background or side image to evoke fun and community */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="group rounded-xl bg-background-elevated p-6 border border-border transition-all hover:shadow-glow-blue hover:scale-[1.02]">
          <h3 className="text-xl font-display text-inverted mb-2">Hot Polls Right Now</h3>
          <p className="text-text-muted mb-4">Join the conversation on campus vibes, academics, and more.</p>
          {/* Placeholder for poll teaser cards */}
          <div className="space-y-2">
            <div className="p-3 bg-background-hover rounded-md">Best Campus Life?</div>
            <div className="p-3 bg-background-hover rounded-md">Top Sports Facilities?</div>
          </div>
          <Link to="/vote" className="mt-4 inline-block text-primary-500 hover:text-primary-hover">Vote in Polls →</Link>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-brand-green/20 to-brand-blue/20 p-6 border border-border-light shadow-glow">
          {/* Image placement here for visual appeal */}
          <h3 className="text-xl font-display text-inverted mb-2">Student Stories</h3>
          <p className="text-text-muted">Real insights from Kenyan campuses—vote to shape the narrative!</p>
        </div>
      </section>

      {/* Features Section - Why UniPulse with creative icons and images */}
      {/* For each feature card: */}
      {/* - Live Odds: Abstract secure voting system with fingerprint and anonymous icons in futuristic style */}
      {/* - Zero-Signup: Raw data visualization of student sentiments with word clouds and graphs for university reviews */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="group rounded-xl bg-background-elevated p-6 border border-border transition-all hover:border-primary-500/50 hover:bg-background-hover hover:shadow-glow-blue">
          <div className="mb-4 inline-flex rounded-lg bg-primary-500/20 p-3 text-primary-400">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-xl font-display text-inverted mb-2">Live Sentiment Tracking</h3>
          <p className="text-text-muted">
            Watch rankings evolve in real-time as students share their true experiences.
          </p>
          {/* Image: Sleek dashboard showing university rankings with bar charts in dark mode UI design - Place as card thumbnail */}
        </div>
        
        <div className="group rounded-xl bg-background-elevated p-6 border border-border transition-all hover:border-success/50 hover:bg-background-hover hover:shadow-glow-blue">
          <div className="mb-4 inline-flex rounded-lg bg-success/20 p-3 text-success">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-display text-inverted mb-2">Effortless & Secure Voting</h3>
          <p className="text-text-muted">
            One-click votes with fingerprint protection—no accounts, total anonymity.
          </p>
          {/* Image: Abstract secure voting system with fingerprint and anonymous icons in futuristic style - Place as card thumbnail */}
        </div>
        
        <div className="group rounded-xl bg-background-elevated p-6 border border-border transition-all hover:border-brand-purple/50 hover:bg-background-hover hover:shadow-glow-blue">
          <div className="mb-4 inline-flex rounded-lg bg-brand-purple/20 p-3 text-brand-purple">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-display text-inverted mb-2">Unfiltered Insights</h3>
          <p className="text-text-muted">
            Categories that matter: vibes, sports, academics—straight from students.
          </p>
          {/* Image: Raw data visualization of student sentiments with word clouds and graphs for university reviews - Place as card thumbnail */}
        </div>
      </section>
    </div>
  );
};