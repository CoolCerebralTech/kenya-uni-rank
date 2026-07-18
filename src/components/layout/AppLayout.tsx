import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { NavigationBar } from './NavigationBar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useToast } from '../../hooks/useToast';
import { Toast, ToastContainer } from '../ui/Toast';
import { ArrowUp } from 'lucide-react';

// UniPulse v3 — refined app shell:
//  • Ambient gradient + subtle grid backing (used by .bg-ambient / .bg-grid)
//  • Sidebar is desktop-only (≥md); on mobile the bottom nav drives everything.
//  • Bottom nav occupies its own zone (h-14 + safe-area); we add a matching
//    mb-14 md:mb-0 to the main content so nothing is hidden behind it.
//  • Scroll-to-top button floats above the bottom nav on mobile.
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
    <div className="relative min-h-[100dvh] bg-ambient text-slate-100 font-sans selection:bg-cyan-500/30 flex flex-col">
      {/* Ambient backdrop layers */}
      <div className="fixed inset-0 z-[-2] pointer-events-none bg-ambient" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-grid opacity-60" />

      {/* Header */}
      <Header />

      {/* Body: sidebar + main */}
      <div className="flex flex-1 pt-16 max-w-[1536px] mx-auto w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 fixed top-16 bottom-0 left-[max(0px,calc(50%-768px))] border-r border-slate-800/50 bg-slate-950/40 backdrop-blur-md z-30">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full md:pl-72 flex flex-col pb-14 md:pb-0">
          {children}
          <div className="mt-auto hidden md:block">
            <Footer />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <NavigationBar />

      {/* Toast notifications */}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={hideToast} />
        ))}
      </ToastContainer>

      {/* Scroll-to-top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 h-11 w-11 flex items-center justify-center rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.18)] backdrop-blur-md transition-all duration-300 hover:bg-cyan-950/40 hover:-translate-y-1 hover:border-cyan-400/60 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};
