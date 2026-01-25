import React, { useState, useEffect } from 'react';
import { X, Share, PlusSquare, Download } from 'lucide-react';
import { Button } from '../ui/Button';

export const InstallPrompt: React.FC = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect OS
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    const android = /android/.test(ua);
    
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (!isStandalone) {
      if (ios) setIsIOS(true);
      if (android) setIsAndroid(true);
      
      // Only show if we haven't dismissed it recently
      const dismissed = localStorage.getItem('install_prompt_dismissed');
      if (!dismissed) {
         // Delay showing it
         setTimeout(() => setIsVisible(true), 3000);
      }
    }

    // Capture Android install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandalone) setIsVisible(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Hide for 7 days
    localStorage.setItem('install_prompt_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-slate-900 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom-full">
      <div className="flex items-start justify-between max-w-md mx-auto">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl shadow-lg flex-shrink-0 flex items-center justify-center">
             <span className="text-white font-bold text-xl">U</span>
          </div>
          
          <div>
            <h4 className="font-bold text-white text-sm">Install UniPulse</h4>
            <p className="text-xs text-slate-400 mb-2">
              Add to your home screen for the full immersive experience.
            </p>

            {isIOS && (
              <div className="text-xs text-slate-300 flex items-center gap-1">
                Tap <Share size={12} /> then <PlusSquare size={12} /> "Add to Home Screen"
              </div>
            )}
            
            {isAndroid && (
               <Button 
                 size="sm" 
                 variant="primary" 
                 onClick={handleInstallClick}
                 leftIcon={<Download size={14} />}
                 className="mt-1"
               >
                 Install App
               </Button>
            )}
          </div>
        </div>

        <button onClick={handleDismiss} className="text-slate-500 hover:text-white p-1">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};