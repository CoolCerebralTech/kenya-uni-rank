import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import { Layout } from './components/common/Layout';

// Pages
import { HomePage } from './pages/HomePage';
import { VotingPage } from './pages/VotingPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { RankingPage } from './pages/RankingPage';
import { UniversityPage } from './pages/UniversityPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      {/* Dark theme wrapper */}
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Layout>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<HomePage />} />

            {/* Main Voting Feed */}
            <Route path="/vote" element={<VotingPage />} />

            {/* Categories Directory */}
            <Route path="/categories" element={<CategoriesPage />} />

            {/* Leaderboard / Directory */}
            <Route path="/rankings" element={<RankingPage />} />

            {/* Individual University Profile */}
            <Route path="/university/:id" element={<UniversityPage />} />

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;