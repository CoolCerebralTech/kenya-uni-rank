import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface WaitlistFormProps {
  onBack: () => void;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      // In real app: save to Supabase 'waitlist' table
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8 animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
        <p className="text-slate-400 text-sm mb-6">
          We'll notify <strong>{email}</strong> the second the neural network goes live.
        </p>
        <Button variant="ghost" onClick={onBack}>
          Back to Voting
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-white mb-6 text-sm transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Join the Intelligence</h3>
        <p className="text-slate-400 text-sm">
          Be the first to access the AI matching engine when Phase 3 launches.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-violet-400 mb-1.5 uppercase tracking-wider">
            Input Protocol // Email
          </label>
          <div className="relative">
            <Input 
              type="email" 
              placeholder="student@example.com" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if(status === 'error') setStatus('idle');
              }}
              className="bg-slate-900 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20 font-mono"
              leftIcon={<Mail size={16} className="text-slate-500" />}
            />
          </div>
          {status === 'error' && (
            <div className="flex items-center gap-1 text-red-400 text-xs mt-2 animate-in slide-in-from-left-2">
              <AlertCircle size={12} /> Invalid email format
            </div>
          )}
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            <span className="text-slate-300 font-bold">Privacy Protocol:</span> Your email is hashed and stored securely. We never spam. We only ping for major system upgrades.
          </p>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          variant="primary"
          className="bg-violet-600 hover:bg-violet-500 border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin mr-2" size={16} /> Encrypting...
            </span>
          ) : (
            'Notify Me'
          )}
        </Button>
      </form>
    </div>
  );
};