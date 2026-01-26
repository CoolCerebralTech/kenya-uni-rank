import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, Users } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { toast } from '../../hooks/useToast';
// IMPORT THE NEW SERVICE
import { joinWaitlist } from '../../services/database.service';

export const WaitlistForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.includes('@') || email.length < 5) {
      setStatus('error');
      toast.error('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    // REAL DATABASE CALL
    const response = await joinWaitlist(email);

    if (response.success) {
      setStatus('success');
      toast.success(`You're on the list! We'll notify ${email}.`);
    } else {
      setStatus('idle'); // Allow retry
      toast.error('Something went wrong. Please try again.');
      console.error(response.error);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8 animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">You're in the queue!</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
          The first access wave is full. We'll email you the moment a spot opens in the next phase.
        </p>
        <Button variant="ghost" onClick={onBack}>Return to Mission Control</Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button 
        type="button" 
        onClick={onBack} 
        className="flex items-center text-slate-500 hover:text-white mb-6 text-sm transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Join the Next Wave</h3>
        <p className="text-slate-400 text-sm">Phase 1 is full. Register for early access to the next AI Matchmaker release.</p>
      </div>
      
      <div className="flex items-center gap-2 p-2 mb-4 rounded-md bg-slate-800/50 border border-slate-700 text-xs">
        <Users size={14} className="text-violet-400" />
        <span className="text-slate-300">Over <strong>5,000+</strong> students already in line.</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          type="email" 
          placeholder="your-email@uni.ac.ke" 
          value={email}
          onChange={(e) => { setEmail(e.target.value); if(status === 'error') setStatus('idle'); }}
          className="bg-slate-900 border-slate-700 focus:border-violet-500 focus:ring-violet-500/20"
          leftIcon={<Mail size={16} />}
          error={status === 'error' ? 'Please enter a valid email address.' : undefined}
        />

        <Button 
          type="submit" 
          fullWidth 
          variant="primary"
          className="bg-violet-600 hover:bg-violet-500 focus:ring-violet-500 border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Securing Your Spot...' : 'Get Notified'}
        </Button>
      </form>
    </div>
  );
};