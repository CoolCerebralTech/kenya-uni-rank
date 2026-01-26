import React, { useEffect } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  useLocation,
  Outlet,
  Navigate
} from 'react-router-dom';

// --- PROVIDERS ---
import { ToastProvider } from './hooks/useToast';

// --- PAGES ---
import { HomePage } from './pages/HomePage';
import { VotingPage } from './pages/VotingPage';
import { PollDetailPage } from './pages/PollDetailPage';
import { ResultsPage } from './pages/ResultsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { UniversityProfilePage } from './pages/UniversityProfilePage';
import { TrendsPage } from './pages/TrendsPage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
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

// --- ROUTER CONFIGURATION ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />, 
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // 1. Voting Routes
      {
        path: "vote/:category",
        element: <VotingPage />,
      },
      {
        // FIX: Handle generic "/voting" or "/polls" clicks 
        // by sending them to the Search/Discovery page
        path: "voting",
        element: <SearchPage />,
      },
      {
        path: "polls",
        element: <SearchPage />,
      },
      
      // 2. Results & Details
      {
        path: "poll/:slug",
        element: <PollDetailPage />,
      },
      {
        path: "results/:category?",
        element: <ResultsPage />,
      },
      {
        path: "category/:category",
        element: <CategoryDetailPage />,
      },

      // 3. Analytics & Rankings
      {
        path: "leaderboard",
        element: <LeaderboardPage />,
      },
      {
        path: "trends",
        element: <TrendsPage />,
      },
      {
        path: "compare",
        element: <ComparisonPage />,
      },
      {
        path: "university/:id",
        element: <UniversityProfilePage />,
      },

      // 4. User & Info
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "how-it-works",
        element: <HowItWorksPage />,
      },

      // 5. Fallback for any other typed URL
      {
        path: "*",
        element: <Navigate to="/" replace />,
      }
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