import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { CheckCircle2, ArrowRight, ArrowLeft, Trophy, Vote, Unlock, BarChart3, Bot } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: BarChart3,
      title: 'Analyze the Field',
      desc: 'Start at the dashboard to see live teaser data. Explore categories that matter to your future.',
      details: ['Vibes & Culture', 'Academic Rigor', 'Social Scene'],
    },
    {
      icon: Vote,
      title: 'Cast Your Intelligence',
      desc: 'Participate in polls. Your data fingerprint ensures a fair and accurate student sentiment index.',
      details: ['No registration required', 'One-tap voting system', 'Encrypted anonymity'],
    },
    {
      icon: Unlock,
      title: 'Unlock the Truth',
      desc: 'Once you contribute, the system decrypts the real results, showing colors, names, and trends.',
      details: ['Real-time racing charts', 'University branding', 'National rankings'],
    },
    {
      icon: Trophy,
      title: 'Rank Up',
      desc: 'Complete all categories to earn the "Completionist" badge and unlock deep-dive comparison tools.',
      details: ['Earn Voter XP', 'Unlock Radar Charts', 'Share results'],
    },
    {
      icon: Bot,
      title: 'AI Matching',
      desc: 'Coming Phase 2: Our AI agent will match your personality to the perfect university fit.',
      details: ['Vibe matching', 'Budget optimization', 'Location analysis'],
    },
  ];

  const ActiveIcon = steps[activeStep].icon;

  return (
    <AppLayout>
      <PageContainer maxWidth="lg" title="How It Works">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic">THE PROTOCOL</h1>
          <p className="text-slate-400 text-lg">Follow these steps to master the student truth engine.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
          {/* STEP LIST */}
          <div className="lg:col-span-4 space-y-4">
            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                  activeStep === i 
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                    : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${activeStep === i ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  {i + 1}
                </div>
                <span className={`font-bold ${activeStep === i ? 'text-white' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* STEP DISPLAY */}
          <div className="lg:col-span-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ActiveIcon size={120} className="text-cyan-400" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase">
                  Step {activeStep + 1} of {steps.length}
                </div>
                <h2 className="text-3xl font-black text-white">{steps[activeStep].title}</h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  {steps[activeStep].desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {steps[activeStep].details.map((detail, j) => (
                    <div key={j} className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <CheckCircle2 size={18} className="text-cyan-400" />
                      <span className="text-sm font-medium">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-8">
                  <Button 
                    variant="ghost" 
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(prev => prev - 1)}
                    leftIcon={<ArrowLeft size={18} />}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="primary" 
                    disabled={activeStep === steps.length - 1}
                    onClick={() => setActiveStep(prev => prev + 1)}
                    rightIcon={<ArrowRight size={18} />}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="text-center py-12 border-t border-slate-800/50">
          <h2 className="text-2xl font-bold text-white mb-6">Ready to contribute to the engine?</h2>
          <Button size="lg" variant="neon" onClick={() => window.location.href = '/'}>
            Start Now
          </Button>
        </section>

      </PageContainer>
    </AppLayout>
  );
};
