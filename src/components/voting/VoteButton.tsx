import React from 'react';
import { Loader2, Check, ArrowRight } from 'lucide-react';

interface VoteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state: 'idle' | 'loading' | 'success' | 'error' | 'disabled';
}

export const VoteButton: React.FC<VoteButtonProps> = ({ state, className = '', ...props }) => {
  const baseStyles = "relative overflow-hidden w-full h-10 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2";
  
  const stateStyles = {
    idle: "bg-slate-800 text-white hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-slate-700 hover:border-blue-500",
    loading: "bg-slate-900 text-slate-400 border border-slate-800 cursor-wait",
    success: "bg-green-600 text-white border border-green-500 shadow-[0_0_15px_rgba(22,163,74,0.5)] cursor-default",
    error: "bg-red-900/50 text-red-200 border border-red-800 animate-shake",
    disabled: "bg-slate-900/50 text-slate-600 border border-slate-800 cursor-not-allowed",
  };

  return (
    <button
      disabled={state === 'loading' || state === 'disabled' || state === 'success'}
      className={`${baseStyles} ${stateStyles[state]} ${className}`}
      {...props}
    >
      {state === 'idle' && (
        <>
          <span>Select</span>
          <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
        </>
      )}
      
      {state === 'loading' && <Loader2 size={16} className="animate-spin" />}
      
      {state === 'success' && (
        <>
          <Check size={16} className="animate-in zoom-in duration-300" />
          <span>Voted</span>
        </>
      )}
      
      {state === 'error' && <span>Failed</span>}
      
      {state === 'disabled' && <span>Locked</span>}
    </button>
  );
};