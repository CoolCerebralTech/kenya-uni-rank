import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// --- PROVIDERS ---
import { ToastProvider } from './hooks/useToast';

// --- PAGES ---
import { HomePage } from './pages/HomePage';
import { VotingPage } from './pages/VotingPage';
import { PollDetailPage } from './pages/PollDetailPage';

// --- PLACEHOLDER PAGES (To prevent crashes for missing files) ---
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
    <div className="text-center space-y-4">
      <div className="inline-block p-4 rounded-full bg-slate-900 border border-slate-800 animate-pulse">
        <span className="text-4xl">🚧</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      <p className="text-slate-400 max-w-md mx-auto">
        This module is currently under development for Phase 2.
      </p>
      <a href="/" className="inline-block text-cyan-400 hover:text-cyan-300 font-medium">
        &larr; Return Home
      </a>
    </div>
  </div>
);

// --- UTILITIES ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- APP COMPONENT ---
export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        
        <Routes>
          {/* =========================================================
              CORE PAGES
          ========================================================= */}
          <Route path="/" element={<HomePage />} />
          
          {/* 
            Voting Flow:
            Matches /vote/Vibes, /vote/Academics, etc. 
          */}
          <Route path="/vote/:category" element={<VotingPage />} />
          
          {/* 
            Single Poll Result/Detail:
            Matches /poll/best-campus-life-2025 
          */}
          <Route path="/poll/:slug" element={<PollDetailPage />} />

          {/* =========================================================
              PLACEHOLDERS / FUTURE ROUTES
              (These prevent 404s when clicking buttons in HomePage)
          ========================================================= */}
          
          {/* Note: HomePage navigates to /polls?category=... */}
          <Route path="/polls" element={<PlaceholderPage title="Search & Explore" />} />
          
          <Route path="/results" element={<PlaceholderPage title="Overall Results" />} />
          <Route path="/results/:category" element={<PlaceholderPage title="Category Results" />} />
          
          <Route path="/leaderboard" element={<PlaceholderPage title="University Leaderboard" />} />
          <Route path="/compare" element={<PlaceholderPage title="University Comparison" />} />
          
          <Route path="/how-it-works" element={<PlaceholderPage title="How It Works" />} />
          <Route path="/about" element={<PlaceholderPage title="About UniPulse" />} />
          
          <Route path="/profile" element={<PlaceholderPage title="Student Profile" />} />

          {/* =========================================================
              FALLBACK
          ========================================================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;