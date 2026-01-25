// src/components/features/LiveFeed.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Activity } from 'lucide-react';
import { getLatestVotes } from '../../services/analytics.service';
import { timeAgo } from '../../services/analytics.service';
import { RacingSkeleton } from '../ui/RacingSkeleton';

interface LiveVoteActivity {
  id: string;
  universityShortName: string;
  universityColor: string;
  category: string;
  timestamp: string;
  voterType: string;
}

export const LiveFeed: React.FC = () => {
  const [activities, setActivities] = useState<LiveVoteActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveActivity = async () => {
      try {
        setLoading(true);
        const response = await getLatestVotes(20); // Get 20 latest votes
        
        if (response.success && response.data) {
          // Map database response to component format
          const formattedActivities = response.data.map((item, index) => ({
            id: item.university_id + item.created_at + index,
            universityShortName: item.university_short_name,
            universityColor: item.university_color,
            category: item.category,
            timestamp: timeAgo(item.created_at),
            voterType: item.voter_type || 'Anonymous',
          }));
          setActivities(formattedActivities);
        } else {
          setError(response.error || 'Failed to load activity');
        }
      } catch (err) {
        setError('Error fetching live activity');
        console.error('[LiveFeed] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveActivity();
    
    // Set up polling for real-time updates (every 10 seconds)
    const interval = setInterval(fetchLiveActivity, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="h-full flex flex-col overflow-hidden bg-slate-950/50 border-slate-800">
        <RacingSkeleton count={5} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex flex-col items-center justify-center p-8">
        <div className="text-slate-500 text-center">
          <Activity size={32} className="mx-auto mb-2" />
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-slate-950/50 border-slate-800">
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="relative">
          <Activity size={16} className="text-green-500" />
          <div className="absolute inset-0 bg-green-500 blur-sm opacity-50 animate-pulse" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Live Pulse ({activities.length} votes)
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative space-y-3 mask-image-b-fade">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No recent activity yet
          </div>
        ) : (
          activities.map((item) => (
            <div 
              key={item.id}
              className="flex items-center gap-3 text-sm animate-in slide-in-from-top-2 fade-in duration-500"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_cyan]" />
              
              <span className="text-slate-500 text-xs font-mono">
                [{item.timestamp}]
              </span>
              
              <div className="flex-1 truncate text-slate-300">
                <span className="text-white font-bold capitalize">{item.voterType}</span> voted for{' '}
                <span 
                  style={{ color: item.universityColor }} 
                  className="font-bold"
                >
                  {item.universityShortName}
                </span>{' '}
                in <span className="text-slate-400 capitalize">{item.category}</span>
              </div>
            </div>
          ))
        )}
        
        {/* Gradient Mask for Fade Out */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      </div>
    </Card>
  );
};