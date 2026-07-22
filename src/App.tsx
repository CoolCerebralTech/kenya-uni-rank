import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  Outlet,
  Navigate,
} from 'react-router-dom';

// --- PROVIDERS ---
import { ToastProvider } from './hooks/useToast';

// --- PAGES (v4: only dashboard-relevant pages) ---
import { HomePage } from './pages/HomePage';
import { ComparisonPage } from './pages/ComparisonPage';
import UniversityProfilePage from './pages/UniversityProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ErrorPage } from './pages/ErrorPage';

// --- UTILITIES ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const RootLayout = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

// --- ROUTER (v4) ---
// Old routes (/polls, /vote/*, /poll/*, /results/*, /category/*, /leaderboard,
// /trends, /profile, /search, /voting, /how-it-works) all redirect home.
// Only working routes: /, /compare, /university/:id, /about, /explore, /rankings.
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // Main pages
      { index: true, element: <HomePage /> },
      { path: 'compare', element: <ComparisonPage /> },
      { path: 'university/:id', element: <UniversityProfilePage /> },
      { path: 'about', element: <AboutPage /> },

      // /explore and /rankings both just redirect to home
      // (home already has the search/filter/grid — they're the same view)
      { path: 'explore', element: <Navigate to="/" replace /> },
      { path: 'rankings', element: <Navigate to="/" replace /> },

      // Redirect all old routes to home
      { path: 'polls', element: <Navigate to="/" replace /> },
      { path: 'voting', element: <Navigate to="/" replace /> },
      { path: 'vote/:category', element: <Navigate to="/" replace /> },
      { path: 'poll/:slug', element: <Navigate to="/" replace /> },
      { path: 'results/:category?', element: <Navigate to="/" replace /> },
      { path: 'category/:category', element: <Navigate to="/" replace /> },
      { path: 'leaderboard', element: <Navigate to="/" replace /> },
      { path: 'trends', element: <Navigate to="/" replace /> },
      { path: 'search', element: <Navigate to="/" replace /> },
      { path: 'profile', element: <Navigate to="/" replace /> },
      { path: 'how-it-works', element: <Navigate to="/about" replace /> },

      // Fallback
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
};

export default App;
