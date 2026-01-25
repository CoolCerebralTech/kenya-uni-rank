
import { X, Share, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// This hook would encapsulate the logic from your useEffect


export const InstallPrompt: React.FC = () => {
  // const { isVisible, isIOS, isAndroid, handleInstallClick, handleDismiss } = useInstallPrompt();
  const { isVisible, handleDismiss, handleInstallClick, isAndroid, isIOS } = { isVisible: true, handleDismiss: () => {}, handleInstallClick: () => {}, isAndroid: false, isIOS: true } // MOCK for display

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800"
        >
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
                <div className="absolute inset-0 bg-cyan-500/30 blur-lg rounded-xl" />
              </div>
              <div>
                <h4 className="font-bold text-white">Get the Full Experience</h4>
                <p className="text-xs text-slate-400">Add UniPulse to your home screen for faster, offline access.</p>
              </div>
            </div>
            <button onClick={handleDismiss} className="text-slate-500 hover:text-white p-1 self-start"><X size={20} /></button>
          </div>

          <div className="max-w-md mx-auto mt-3">
            {isIOS && (
              <p className="text-xs text-center text-slate-400 bg-slate-800/50 p-2 rounded-md">
                Tap <Share size={12} className="inline mx-1" /> then 'Add to Home Screen'
              </p>
            )}
            {isAndroid && (
               <Button size="sm" variant="primary" onClick={handleInstallClick} leftIcon={<Download size={14} />} fullWidth>
                 Install App
               </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};