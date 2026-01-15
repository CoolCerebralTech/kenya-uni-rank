import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { UniversityService } from '../services/university';
import { MapPin, Globe, School, TrendingUp, Users, BarChart3 } from 'lucide-react';

export const UniversityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const university = id ? UniversityService.getById(id) : undefined;

  if (!university) {
    return <Navigate to="/rankings" replace />;
  }

  // Mock data for charts (you'll replace with real data)
  const mockPerformanceData = [
    { category: 'Vibes', score: 85, color: '#EC4899' },
    { category: 'Sports', score: 70, color: '#F59E0B' },
    { category: 'Academics', score: 90, color: '#3B82F6' },
    { category: 'Value', score: 75, color: '#10B981' },
    { category: 'Reputation', score: 88, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card - Polymarket Style */}
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div 
                className="flex h-20 w-20 items-center justify-center rounded-xl border-4 border-gray-800 text-3xl font-bold shadow-lg"
                style={{ backgroundColor: university.color, color: '#ffffff' }}
              >
                {university.shortName}
              </div>
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">{university.name}</h1>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium
                    ${university.type === 'Public' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                    {university.type}
                  </span>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} />
                    <span>{university.location}</span>
                  </div>
                  {university.website && (
                    <a 
                      href={university.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Globe size={16} />
                      <span>Official Site</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-0">
              <div className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3">
                <TrendingUp size={20} className="text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-white">#4</div>
                  <div className="text-xs text-gray-400">Overall Rank</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Users size={20} className="text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1,240</div>
              <div className="text-sm text-gray-400">Total Votes</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/20 p-2">
              <BarChart3 size={20} className="text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">5</div>
              <div className="text-sm text-gray-400">Active Markets</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/20 p-2">
              <TrendingUp size={20} className="text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">+12.5%</div>
              <div className="text-sm text-gray-400">7-Day Trend</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <School size={20} className="text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">42.3%</div>
              <div className="text-sm text-gray-400">Win Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Performance by Category</h3>
          <div className="space-y-4">
            {mockPerformanceData.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.category}</span>
                  <span className="font-semibold text-white">{item.score}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${item.score}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Market Activity</h3>
          <div className="space-y-4">
            {['Best Campus Life', 'Sports Facilities', 'Value for Money'].map((market, idx) => (
              <div key={idx} className="rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white">{market}</div>
                    <div className="text-sm text-gray-400">Current odds: 63%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">+245</div>
                    <div className="text-xs text-gray-400">votes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};