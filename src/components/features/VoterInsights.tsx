import React from 'react';
import { Card } from '../ui/Card';
import { PieChart } from '../analytics/PieChart';
import { BarChart } from '../analytics/BarChart';
import { Users } from 'lucide-react';

export const VoterInsights: React.FC = () => {
  const demographics = [
    { label: 'Students', value: 60, color: '#3b82f6' },
    { label: 'Alumni', value: 30, color: '#8b5cf6' },
    { label: 'Applicants', value: 10, color: '#10b981' },
  ];

  const deviceStats = [
    { label: 'Mobile', value: 85, color: '#ec4899' },
    { label: 'Desktop', value: 15, color: '#64748b' },
  ];

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
        <Users size={20} className="text-cyan-400" />
        <h3 className="font-bold text-white">Who is voting?</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           <h4 className="text-xs text-slate-500 uppercase font-bold mb-4 text-center">Voter Type</h4>
           <div className="flex justify-center">
             <PieChart data={demographics} size={160} />
           </div>
        </div>

        <div>
           <h4 className="text-xs text-slate-500 uppercase font-bold mb-4 text-center">Device Usage</h4>
           <div className="h-40 flex items-end justify-center px-8">
             <BarChart data={deviceStats} height={150} />
           </div>
        </div>
      </div>
    </Card>
  );
};