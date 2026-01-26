import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ShieldCheck, Zap, Globe, Mail, Twitter } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <AppLayout>
      <PageContainer maxWidth="lg" title="About UniPulse">
        
        {/* HERO */}
        <div className="text-center space-y-6 mb-20">
          <div className="inline-block p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-6xl mb-4">🎓</div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Real Voices. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Honest Rankings.
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            We're building the world's first Student Truth Engine to help you find your perfect university fit based on reality, not marketing.
          </p>
        </div>

        {/* MISSION */}
        <section className="mb-20">
          <SectionDivider label="The Mission" icon={<Zap size={16} />} />
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
            <p className="text-xl text-slate-300 leading-relaxed italic mb-6">
              "UniPulse was born from a simple frustration: Official university rankings tell you about research papers, but they don't tell you what it's actually like to live and learn on campus."
            </p>
            <p className="text-lg text-slate-400">
              We empower Kenyan students to share unfiltered sentiment across 6 categories — from the quality of WiFi to the intensity of social life — solving "placement regret" for the next generation.
            </p>
          </div>
        </section>

        {/* TRUST GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: ShieldCheck, title: '100% Anonymous', desc: 'No logins. No tracking. We use fingerprinting to ensure one person, one vote.' },
            { icon: Zap, title: 'Live Updates', desc: 'Our algorithms process votes in real-time. Standings change as the community speaks.' },
            { icon: Globe, title: 'Built for Kenya', desc: 'Designed specifically for the local ecosystem, from JKUAT to Strathmore.' },
          ].map((item, i) => (
            <Card key={i} className="p-8 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* CONTACT */}
        <section className="mb-12">
          <SectionDivider label="Get In Touch" />
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-slate-800 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Have feedback or want to partner?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="secondary" 
                leftIcon={<Mail size={18} />}
                onClick={() => window.open('mailto:hello@unipulse.ke')}
              >
                Email HQ
              </Button>
              <Button 
                variant="ghost" 
                leftIcon={<Twitter size={18} />}
                onClick={() => window.open('https://twitter.com/unipulseke')}
              >
                Twitter / X
              </Button>
            </div>
          </div>
        </section>

      </PageContainer>
    </AppLayout>
  );
};