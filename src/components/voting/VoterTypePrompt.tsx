import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, UserPlus, HelpCircle, X } from 'lucide-react';
import { getStoredVoterType, storeVoterType } from '../../services/storage.service';

export const VoterTypePrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if we haven't stored it yet
    const stored = getStoredVoterType();
    if (!stored) {
      // Small delay for entrance animation
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelect = (type: 'student' | 'alumni' | 'applicant' | 'other') => {
    storeVoterType(type);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    // Store 'other' as default if dismissed to stop pestering
    storeVoterType('other');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-40 max-w-sm w-full animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 relative overflow-hidden">
        {/* Neon Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
        
        <button 
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss voter type prompt"
          className="absolute top-2 right-2 text-slate-500 hover:text-white"
        >
          <X size={16} />
        </button>

        <h4 className="text-sm font-bold text-white mb-1">One quick question...</h4>
        <p className="text-xs text-slate-400 mb-4">
          To help us improve the AI matching, which best describes you?
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button 
            type="button"
            onClick={() => handleSelect('student')}
            className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors gap-1 group"
          >
            <GraduationCap size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium text-slate-300">Student</span>
          </button>
          
          <button 
            type="button"
            onClick={() => handleSelect('alumni')}
            className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors gap-1 group"
          >
            <Briefcase size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium text-slate-300">Alumni</span>
          </button>

          <button 
            type="button"
            onClick={() => handleSelect('applicant')}
            className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors gap-1 group"
          >
            <UserPlus size={16} className="text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium text-slate-300">Applicant</span>
          </button>

          <button 
            type="button"
            onClick={() => handleSelect('other')}
            className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors gap-1 group"
          >
            <HelpCircle size={16} className="text-slate-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium text-slate-300">Other</span>
          </button>
        </div>
      </div>
    </div>
  );
};
