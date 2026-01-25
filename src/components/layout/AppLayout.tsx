import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { NavigationBar } from './NavigationBar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';
import { ArrowUp } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 flex flex-col">
      {/* Background Pattern - The "Space" texture */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
      </div>

      {/* Main Layout Grid */}
      <div className="relative z-10 flex flex-col flex-1 max-w-[1440px] mx-auto w-full">
        <Header />

        <div className="flex flex-1 pt-16 pb-20 md:pb-0">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 fixed top-16 bottom-0 left-0 border-r border-slate-800/50 bg-slate-950/50 backdrop-blur-sm z-30">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 w-full md:pl-64 min-h-[calc(100vh-4rem)] flex flex-col">
            {children}
            <div className="mt-auto hidden md:block">
              <Footer />
            </div>
          </main>
        </div>

        {/* Mobile Navigation (Bottom) */}
        <div className="md:hidden">
          <NavigationBar />
        </div>
      </div>

      {/* Global Overlays */}
      <ToastContainer children={null} /> {/* Placeholder for toasts service */}
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-40 p-3 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 shadow-lg shadow-cyan-900/20 transition-all duration-300 hover:bg-slate-700 hover:-translate-y-1 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};