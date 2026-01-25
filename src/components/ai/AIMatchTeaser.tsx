import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { MemeOverlay } from './MemeOverlay';
import { WaitlistForm } from './WaitlistForm';
import { Bot, Sparkles } from 'lucide-react';

interface AIMatchTeaserProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIMatchTeaser: React.FC<AIMatchTeaserProps> = ({ isOpen, onClose }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="lg"
      title="UniPulse AI Protocol"
    >
      <div className="relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
        {/* Background Grid Animation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(17,24,39,0.9),rgba(17,24,39,0.9)),url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e51a_1px,transparent_1px),linear-gradient(to_bottom,#4f46e51a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

        <div className="relative z-10 w-full max-w-md mx-auto p-4">
          {!showForm ? (
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 animate-pulse" />
                <Bot size={64} className="text-violet-400 relative z-10 mx-auto" />
              </div>
              
              <MemeOverlay />
              
              <div className="pt-6">
                <button 
                  onClick={() => setShowForm(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-violet-600 font-lg rounded-full hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 focus:ring-offset-slate-900"
                >
                  <Sparkles className="w-5 h-5 mr-2 animate-spin-slow" />
                  <span>Get Early Access</span>
                  <div className="absolute -inset-3 rounded-full bg-violet-400/20 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-200" />
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right fade-in duration-300">
              <WaitlistForm onBack={() => setShowForm(false)} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};