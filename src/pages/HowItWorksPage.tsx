import { useState } from 'react';

export function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: 1,
      emoji: '🏠',
      title: 'Land on Homepage',
      description: 'See a live preview of university rankings in "Ghost Mode" - teaser data that shows what\'s possible.',
      details: [
        'Browse 6 main categories: Vibes, Academics, Sports, Social, Facilities, General',
        'See your progress tracker (how many categories you\'ve completed)',
        'Pick a category that matters most to you',
      ],
      image: '📊',
    },
    {
      step: 2,
      emoji: '🗳️',
      title: 'Vote Honestly',
      description: 'Cast your vote in polls across your chosen category. No login required.',
      details: [
        'One-click voting - tap a university logo to vote',
        'Vote on 5-20 polls per category',
        'See instant feedback: "Your vote shifted the race!"',
        'Progress bar shows you\'re almost done',
      ],
      image: '✅',
    },
    {
      step: 3,
      emoji: '🔓',
      title: 'Unlock Reality',
      description: 'After voting, see REAL student opinions and live rankings.',
      details: [
        'Racing bar charts show true standings',
        'University colors and branding visible',
        'Live pulse indicators on top 3 universities',
        'Results update in real-time as votes come in',
      ],
      image: '🏁',
    },
    {
      step: 4,
      emoji: '🎯',
      title: 'Repeat & Conquer',
      description: 'Complete more categories to build a full picture.',
      details: [
        'Each category unlocks new insights',
        'Earn badges: First Vote, Category Master, Full Completion',
        'Compare universities across different aspects',
        'Share results with friends',
      ],
      image: '🏆',
    },
    {
      step: 5,
      emoji: '🤖',
      title: 'AI Matching (Coming Soon)',
      description: 'Get personalized university recommendations based on YOUR preferences.',
      details: [
        'Tell us your learning style (practical vs theory)',
        'Share your social preferences (quiet vs lively)',
        'Input your budget and location needs',
        'Get your Top 3 matches with honest trade-offs',
      ],
      image: '✨',
    },
  ];

  const currentStep = steps[activeStep];

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-white">How UniPulse Works</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Your step-by-step guide to finding the perfect university fit
          </p>
        </div>

        {/* Interactive Stepper */}
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-8">
          
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.step} className="flex items-center flex-1">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`relative flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                    index === activeStep
                      ? 'bg-cyan-500 border-cyan-400 text-white scale-110'
                      : index < activeStep
                      ? 'bg-green-500 border-green-400 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-400'
                  }`}
                >
                  {index < activeStep ? '✓' : step.step}
                </button>
                
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${index < activeStep ? 'bg-green-500' : 'bg-slate-700'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center space-y-3">
              <div className="text-6xl">{currentStep.emoji}</div>
              <h2 className="text-3xl font-black text-white">{currentStep.title}</h2>
              <p className="text-lg text-slate-400">{currentStep.description}</p>
            </div>

            {/* Visual */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
              <div className="text-8xl">{currentStep.image}</div>
            </div>

            {/* Details */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-3">
              {currentStep.details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-cyan-400">✓</span>
                  </div>
                  <div className="text-sm text-slate-300">{detail}</div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeStep === 0
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                ← Previous
              </button>

              <div className="text-sm text-slate-500">
                Step {activeStep + 1} of {steps.length}
              </div>

              <button
                onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                disabled={activeStep === steps.length - 1}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeStep === steps.length - 1
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white text-center">Why UniPulse is Different</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 text-center space-y-3">
              <div className="text-4xl">⚡</div>
              <div className="text-sm font-bold text-white">No Login Required</div>
              <div className="text-xs text-slate-400">Vote instantly. No accounts, no friction.</div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 text-center space-y-3">
              <div className="text-4xl">🔴</div>
              <div className="text-sm font-bold text-white">Real-Time Updates</div>
              <div className="text-xs text-slate-400">See rankings shift live as votes come in.</div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 text-center space-y-3">
              <div className="text-4xl">🔒</div>
              <div className="text-sm font-bold text-white">Anti-Bias Design</div>
              <div className="text-xs text-slate-400">Results hidden until you vote honestly.</div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 text-center space-y-3">
              <div className="text-4xl">🎓</div>
              <div className="text-sm font-bold text-white">Student Truth</div>
              <div className="text-xs text-slate-400">Real opinions, not marketing BS.</div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              { q: 'Do I need to create an account?', a: 'Nope! UniPulse is completely anonymous. Just vote and go.' },
              { q: 'Can I change my vote?', a: 'No - votes are final to prevent manipulation. Think carefully before voting!' },
              { q: 'How do you prevent spam?', a: 'We use device fingerprinting and IP tracking (anonymously) to allow only one vote per poll.' },
              { q: 'Are the results biased?', a: 'Results are hidden until you vote to prevent bias. We only show real student opinions.' },
              { q: 'When will AI matching launch?', a: 'We\'re collecting honest data first. Expected launch: Post-February 2026.' },
              { q: 'Can universities manipulate rankings?', a: 'No. Only verified students/alumni votes count. We have anti-spam protection.' },
            ].map((faq, index) => (
              <details key={index} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 group">
                <summary className="cursor-pointer text-sm font-bold text-white flex items-center justify-between">
                  {faq.q}
                  <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-sm text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-black text-white">Ready to Start?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            It takes less than 5 minutes to vote in a category. Your honest opinion helps thousands of students.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105"
          >
            🗳️ Start Voting Now
          </a>
        </section>

      </div>
    </div>
  );
}