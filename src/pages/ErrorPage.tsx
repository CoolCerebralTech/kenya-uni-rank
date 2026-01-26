import React from 'react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { AlertTriangle, Home, RefreshCw, LifeBuoy } from 'lucide-react';

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
      <PageContainer maxWidth="md" className="py-20">
        <div className="text-center space-y-8">
          {/* Error Visual */}
          <div className="relative inline-block">
            <div className="text-[12rem] font-black text-slate-900 leading-none select-none">
              {code}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 rounded-full bg-red-500/10 border border-red-500/20 animate-pulse">
                <AlertTriangle size={64} className="text-red-500" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
              {title}
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              {message}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button 
              variant="primary" 
              size="lg" 
              leftIcon={<Home size={18} />}
              onClick={() => navigate('/')}
            >
              Return to HQ
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              leftIcon={<RefreshCw size={18} />}
              onClick={() => window.location.reload()}
            >
              Retry Protocol
            </Button>
          </div>

          <div className="pt-12 border-t border-slate-800/50">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-4">
              Need technical assistance?
            </p>
            <a 
              href="mailto:support@unipulse.ke" 
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              <LifeBuoy size={16} /> Contact Support
            </a>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  );
};