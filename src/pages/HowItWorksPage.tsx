import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
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
      desc: 'Once you contribute, the system decrypts the real results — colors, names, and trends.',
      details: ['Real-time racing charts', 'University branding', 'National rankings'],
    },
    {
      icon: Trophy,
      title: 'Rank Up',
      desc: 'Complete all categories to earn the "Completionist" badge and unlock deep-dive tools.',
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
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">

        {/* HEADER */}
        <header className="text-center">
          <Badge variant="neon" className="mb-3">The Protocol</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            How UniPulse Works
          </h1>
        </header>

        {/* STEP COUNTER */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeStep
                  ? 'w-8 bg-cyan-400'
                  : i < activeStep
                  ? 'bg-cyan-700/60'
                  : 'bg-slate-800'
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* ACTIVE STEP CARD */}
        <Card className="p-6 sm:p-8 space-y-5 animate-fade-in-up" key={activeStep}>
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ActiveIcon size={22} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.18em] mb-1">
                Step {activeStep + 1} of {steps.length}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{steps[activeStep].title}</h2>
            </div>
          </div>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {steps[activeStep].desc}
          </p>

          <ul className="space-y-2">
            {steps[activeStep].details.map((d, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </Card>

        {/* NAV */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            leftIcon={<ArrowLeft size={14} />}
            disabled={activeStep === 0}
          >
            Prev
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
              rightIcon={<ArrowRight size={14} />}
            >
              Next Step
            </Button>
          ) : (
            <Button variant="success" size="sm" leftIcon={<Trophy size={14} />}>
              Start Voting
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
