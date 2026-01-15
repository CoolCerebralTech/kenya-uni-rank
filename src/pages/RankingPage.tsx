import React from 'react';
import { UniversityService } from '../services/university';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight, Users } from 'lucide-react';

export const RankingPage: React.FC = () => {
  const unis = UniversityService.getAll();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-800 bg-gradient-to-r from-gray-900 to-black p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <TrendingUp size={16} />
              <span>LIVE RANKINGS</span>
            </div>
            <h2 className="text-2xl font-bold text-white">University Leaderboard</h2>
            <p className="mt-1 text-gray-400">Real-time rankings based on student votes</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-2">
              <Users size={16} />
              <span className="text-sm text-gray-300">{unis.length} Institutions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr className="bg-gray-900/50">
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  University
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Profile
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {unis.map((uni, index) => (
                <tr key={uni.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold
                        ${index < 3 ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-amber-400' : 'bg-gray-800 text-gray-400'}`}>
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div 
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white font-bold mr-3"
                        style={{ backgroundColor: uni.color }}
                      >
                        {uni.shortName.substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{uni.shortName}</div>
                        <div className="text-xs text-gray-400">{uni.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                      ${uni.type === 'Public' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-purple-500/20 text-purple-400'}`}>
                      {uni.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-300">{uni.location}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link 
                      to={`/university/${uni.id}`}
                      className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                    >
                      View Odds
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