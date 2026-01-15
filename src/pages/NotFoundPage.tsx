import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="relative">
        {/* Animated background effect */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"></div>
        
        <div className="relative rounded-2xl border border-gray-800 bg-gray-900 p-12">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 mb-6">
            <AlertTriangle size={40} className="text-red-400" />
          </div>
          
          <h1 className="text-8xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-bold text-white mb-2">Market Not Found</h2>
          <p className="text-gray-400 max-w-md mb-8">
            This poll or page doesn't exist. It might have expired or been resolved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Go Home
            </Link>
            <Link 
              to="/vote" 
              className="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-900 px-8 py-3 font-semibold text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Browse Active Markets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};