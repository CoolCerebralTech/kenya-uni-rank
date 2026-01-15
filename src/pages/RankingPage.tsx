import React from 'react';
import { UniversityService } from '../services/university';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight, Users } from 'lucide-react';

export const RankingPage: React.FC = () => {
  const unis = UniversityService.getAll();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section - Leaderboard overview with competitive student ranking vibe */}
      {/* Image: Dynamic leaderboard showing Kenyan university rankings with trophies and charts - Place as a hero background or central image in the header */}
      <div className="rounded-xl bg-gradient-to-r from-primary-900/50 to-secondary-900/50 p-8 border border-border shadow-glow-blue">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-muted mb-2 animate-pulse">
              <TrendingUp size={16} />
              <span>LIVE RANKINGS</span>
            </div>
            <h2 className="text-3xl md:text-hero font-display text-inverted">University Leaderboard</h2>
            <p className="mt-1 text-subtitle text-text-muted">Real-time insights powered by student votes—see who’s leading!</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-background-elevated px-4 py-2 border border-border">
              <Users size={16} />
              <span className="text-sm text-text-muted">{unis.length} Universities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings Table Section - Data presentation with engaging visuals */}
      {/* Image: Dark mode dashboard UI showing university rankings table with bar charts and Kenyan university logos - Place above the table as a teaser visual */}
      <div className="overflow-hidden rounded-xl bg-background-elevated border border-border shadow-glow-blue animate-slide-up">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-background-hover">
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  University
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Profile
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {unis.map((uni, index) => (
                <tr key={uni.id} className="hover:bg-background-hover transition-all">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-glow
                        ${index < 3 ? 'bg-gradient-to-br from-brand-yellow/20 to-brand-orange/20 text-brand-yellow' : 'bg-background-muted text-text-muted'}`}>
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div 
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white font-bold mr-3 shadow-glow-blue"
                        style={{ backgroundColor: uni.color }}
                      >
                        {uni.shortName.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-display text-inverted">{uni.shortName}</div>
                        <div className="text-xs text-text-muted">{uni.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                      ${uni.type === 'Public' 
                        ? 'bg-brand-blue/20 text-brand-blue' 
                        : 'bg-brand-purple/20 text-brand-purple'}`}>
                      {uni.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-text-muted">{uni.location}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link 
                      to={`/university/${uni.id}`}
                      className="inline-flex items-center gap-1 text-sm text-link hover:text-primary-hover transition-colors"
                    >
                      View Details
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};