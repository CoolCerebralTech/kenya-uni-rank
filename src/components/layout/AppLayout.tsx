import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { NavigationBar } from './NavigationBar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useToast } from '../../hooks/useToast';
import { Toast, ToastContainer } from '../ui/Toast';
import { ArrowUp } from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, hideToast } = useToast();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* UPGRADE: More dynamic background for a "game lobby" feel */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#1e40af33,transparent)]"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        <div className="flex flex-1 pt-16 max-w-[1536px] mx-auto w-full">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 fixed top-16 bottom-0 left-[max(0px,calc(50%-768px))] border-r border-slate-800/50 bg-slate-950/30 backdrop-blur-sm z-30">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 w-full md:pl-72 flex flex-col">
            {children}
            <div className="mt-auto hidden md:block">
              <Footer />
            </div>
          </main>
        </div>

        {/* Mobile Navigation */}
        <NavigationBar />
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={hideToast} />
        ))}
      </ToastContainer>
      
      {/* UPGRADE: On-brand, neon scroll-to-top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 h-11 w-11 flex items-center justify-center rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 hover:bg-cyan-950/30 hover:-translate-y-1 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};