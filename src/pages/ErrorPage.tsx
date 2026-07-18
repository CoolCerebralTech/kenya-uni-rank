import React from 'react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  let title = "System Malfunction";
  let message = "An unexpected error occurred in the Truth Engine.";
  let code = "500";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Sector Not Found";
      message = "The coordinates you provided do not exist in our database.";
      code = "404";
    }
  }

  return (
    <AppLayout>
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center space-y-8">
        {/* Error Visual */}
        <div className="relative inline-block">
          <div className="text-[8rem] sm:text-[12rem] font-black text-slate-900 leading-none select-none tabular">
            {code}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-5 sm:p-6 rounded-2xl bg-red-500/10 border border-red-500/20 animate-pulse">
              <AlertTriangle size={48} className="text-red-400" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="danger" className="mb-2">Error</Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            {message}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            leftIcon={<Home size={16} />}
          >
            Return Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshCw size={16} />}
          >
            Retry
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};
