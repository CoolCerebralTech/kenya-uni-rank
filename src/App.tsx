import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components';
import { 
  HomePage, 
  PollsPage, 
  LeaderboardPage, 
  PollDetailPage 
} from './pages';

// Scroll to top helper component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Simple 404 Page Component
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
    <div className="text-9xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
      The page you are looking for doesn't exist or has been moved.
    </p>
    <a 
      href="/"
      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
    >
      Go Home
    </a>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/polls" element={<PollsPage />} />
          <Route path="/poll/:slug" element={<PollDetailPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;