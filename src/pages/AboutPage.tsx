import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { SectionDivider } from '../components/layout/SectionDivider';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ShieldCheck, Zap, Globe, Mail, Twitter, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">

        {/* HERO */}
        <header className="text-center space-y-6">
          <div className="inline-block p-4 rounded-3xl glass border border-cyan-500/20 text-5xl mb-2">🎓</div>
          <Badge variant="neon">The Truth Engine</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Real Voices. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Honest Rankings.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We're building the world's first Student Truth Engine — helping you find your perfect university fit based on reality, not marketing.
          </p>
        </header>

        {/* MISSION */}
        <section>
          <SectionDivider label="The Mission" icon={<Zap size={14} />} variant="neon" />
          <div className="glass rounded-2xl p-6 md:p-10 mt-4">
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed italic mb-5">
              "UniPulse was born from a real conversation on X: students venting about fee strikes, missing marks, and hostel conditions — but nobody is listening. We centralize that sentiment into polls anyone can vote on."
            </p>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              We empower Kenyan students to share unfiltered sentiment across 6 categories — from HELB delays and strike culture to campus vibes and hostel quality — solving "placement regret" for the next generation. Built on real X conversations, not polished brochures.
            </p>
          </div>
        </section>

        {/* TRUST GRID */}
        <section>
          <SectionDivider label="Why trust us" />
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {[
              { icon: ShieldCheck, title: '100% Anonymous', desc: 'No logins. No tracking. Fingerprinting ensures one person, one vote.' },
              { icon: Zap, title: 'Live Updates', desc: 'Algorithms process votes in real-time. Standings change as the community speaks.' },
              { icon: Globe, title: 'Built for Kenya', desc: 'Designed for the local ecosystem, from JKUAT to Strathmore.' },
            ].map((item, i) => (
              <Card key={i} className="p-6 text-center space-y-3 hover:border-cyan-500/30 transition-colors">
                <div className="mx-auto w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <item.icon size={20} />
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="text-center pt-8">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-4">
            Built with <Heart size={12} className="inline text-rose-500 fill-rose-500" /> in Nairobi
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="ghost" size="sm" leftIcon={<Mail size={14} />}>Contact</Button>
            <Button variant="ghost" size="sm" leftIcon={<Twitter size={14} />}>Follow</Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
