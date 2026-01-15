import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { UniversityService } from '../services/university';
import { MapPin, Globe, School, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { MultiCategoryRadarChart } from '../components/charts/MultiCategoryRadarChart'; // Assuming path to the new radar chart

export const UniversityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const university = id ? UniversityService.getById(id) : undefined;

  if (!university) {
    return <Navigate to="/rankings" replace />;
  }

  // Sample data for radar chart (replace with real aggregated data from Supabase)
  const performanceData = [
    { category: 'General', value: 88, fullMark: 100 },
    { category: 'Vibes', value: 85, fullMark: 100 },
    { category: 'Sports', value: 70, fullMark: 100 },
    { category: 'Academics', value: 90, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section - University overview with campus vibe */}
      {/* Image: Aerial view of {university.name} campus in Nairobi Kenya with students and modern buildings - Place as a full-width background or hero image */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-background-muted to-background-elevated border border-border shadow-glow-blue">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div 
                className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-border text-3xl font-bold shadow-glow"
                style={{ backgroundColor: university.color, color: '#ffffff' }}
              >
                {university.shortName}
              </div>
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-hero font-display text-inverted">{university.name}</h1>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium
                    ${university.type === 'Public' 
                      ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' 
                      : 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30'}`}>
                    {university.type}
                  </span>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{university.location}</span>
                  </div>
                  {university.website && (
                    <a 
                      href={university.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-2 text-link hover:text-primary-hover transition-colors"
                    >
                      <Globe size={16} />
                      <span>Official Site</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-0">
              <div className="inline-flex items-center gap-2 rounded-lg bg-success/10 px-4 py-3 border border-success/30 animate-pulse">
                <TrendingUp size={20} className="text-success" />
                <div>
                  <div className="text-2xl font-bold text-inverted">#3</div>
                  <div className="text-xs text-text-muted">Overall Rank</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Key metrics with visual icons */}
      {/* Image: Infographic of university stats like student count and rankings in a dashboard style - Place above the grid as a central visual */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-background-elevated p-4 border border-border shadow-card hover:shadow-glow-blue transition-all">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-blue/20 p-2">
              <Users size={20} className="text-brand-blue" />
            </div>
            <div>
              <div className="text-2xl font-bold text-inverted">1,500+</div>
              <div className="text-sm text-text-muted">Total Votes</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-background-elevated p-4 border border-border shadow-card hover:shadow-glow-blue transition-all">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/20 p-2">
              <BarChart3 size={20} className="text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-inverted">4</div>
              <div className="text-sm text-text-muted">Active Categories</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-background-elevated p-4 border border-border shadow-card hover:shadow-glow-blue transition-all">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/20 p-2">
              <TrendingUp size={20} className="text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-inverted">+15%</div>
              <div className="text-sm text-text-muted">Weekly Trend</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl bg-background-elevated p-4 border border-border shadow-card hover:shadow-glow-blue transition-all">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-purple/20 p-2">
              <School size={20} className="text-brand-purple" />
            </div>
            <div>
              <div className="text-2xl font-bold text-inverted">45%</div>
              <div className="text-sm text-text-muted">Top Category Win</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts Section - Visual breakdowns */}
      {/* Image: Radar chart visualization of university performance across categories in dark mode - Place as an embedded chart preview or illustrative image */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-background-elevated p-6 border border-border shadow-glow-blue animate-slide-up">
          <h3 className="mb-4 text-lg font-display text-inverted">Performance Across Categories</h3>
          <MultiCategoryRadarChart data={performanceData} />
        </div>
        
        <div className="rounded-xl bg-background-elevated p-6 border border-border shadow-glow-blue animate-slide-up">
          <h3 className="mb-4 text-lg font-display text-inverted">Recent Poll Activity</h3>
          <div className="space-y-4">
            {['Best Overall Experience', 'Most Fun Campus', 'Best Academic Environment'].map((poll, idx) => (
              <div key={idx} className="rounded-lg border border-border p-4 hover:border-primary-500/50 hover:bg-background-hover transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-display text-inverted">{poll}</div>
                    <div className="text-sm text-text-muted">Current lead: 58%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-success">+320</div>
                    <div className="text-xs text-text-muted">votes</div>
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