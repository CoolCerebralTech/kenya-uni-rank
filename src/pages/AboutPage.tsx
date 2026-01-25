
export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Hero */}
        <div className="text-center space-y-6">
          <div className="inline-block text-7xl mb-4">🎓</div>
          <h1 className="text-5xl font-black text-white leading-tight">
            About UniPulse
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Real student voices. Honest rankings. Better university decisions.
          </p>
        </div>

        {/* Mission */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white">Our Mission</h2>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 space-y-4">
            <p className="text-lg text-slate-300 leading-relaxed">
              UniPulse was born from a simple frustration: <span className="text-cyan-400 font-semibold">official university rankings don't capture the student experience</span>.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              We're building a platform where <span className="text-green-400 font-semibold">real students and alumni</span> share honest opinions about campus vibes, academics, sports, facilities, and social life — helping the next generation make informed decisions.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              Our goal? To solve <span className="text-purple-400 font-semibold">"placement regrets"</span> by matching post-KCSE students with universities that fit their personal vibe, not just their grades.
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white">The Problem We're Solving</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-3">
              <div className="text-3xl">😞</div>
              <div className="text-sm font-bold text-red-400">Old Way (Broken)</div>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• Rankings based on research papers, not student life</li>
                <li>• No insights into campus culture or vibes</li>
                <li>• Students choose based on marketing, not reality</li>
                <li>• High placement regret rates</li>
              </ul>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6 space-y-3">
              <div className="text-3xl">✨</div>
              <div className="text-sm font-bold text-green-400">UniPulse Way (Better)</div>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• Real student sentiment across 6 categories</li>
                <li>• Anonymous, honest opinions</li>
                <li>• Live, transparent rankings</li>
                <li>• AI matching based on personal fit (coming soon)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: '1', emoji: '🗳️', title: 'Vote Honestly', desc: 'Share your experience across categories like Vibes, Academics, Sports, and more. No login required.' },
              { step: '2', emoji: '🏁', title: 'Unlock Reality', desc: 'Vote to see real-time rankings powered by student voices, not marketing departments.' },
              { step: '3', emoji: '🤖', title: 'Get Matched (Soon)', desc: 'AI will recommend your Top 3 universities based on your preferences, not just grades.' },
            ].map((item) => (
              <div key={item.step} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center text-xl font-black text-cyan-400">
                  {item.step}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="text-lg font-bold text-white">{item.title}</div>
                  </div>
                  <div className="text-sm text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Trust Us */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white">Why Trust UniPulse?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 text-center space-y-3">
              <div className="text-4xl">🔒</div>
              <div className="text-sm font-bold text-white">Anonymous</div>
              <div className="text-xs text-slate-400">No accounts. No tracking. Just honest votes.</div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 text-center space-y-3">
              <div className="text-4xl">🔴</div>
              <div className="text-sm font-bold text-white">Live</div>
              <div className="text-xs text-slate-400">Real-time rankings updated every vote.</div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6 text-center space-y-3">
              <div className="text-4xl">🇰🇪</div>
              <div className="text-sm font-bold text-white">For Kenyans</div>
              <div className="text-xs text-slate-400">Built by Kenyan students, for Kenyan students.</div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white">Our Values</h2>
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-8 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💯</span>
              <div>
                <div className="text-sm font-bold text-white">Honesty Over Hype</div>
                <div className="text-xs text-slate-400 mt-1">We hide results until you vote to prevent bias. Real opinions, not marketing.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-sm font-bold text-white">Students First</div>
                <div className="text-xs text-slate-400 mt-1">Every feature is designed to help students make better decisions, not to sell ads.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <div className="text-sm font-bold text-white">Always Improving</div>
                <div className="text-xs text-slate-400 mt-1">We listen to feedback and ship updates fast. This is just the beginning.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black text-white">Get in Touch</h2>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 text-center space-y-4">
            <p className="text-slate-300">
              Have feedback? Found a bug? Want to partner with us?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@unipulse.ke"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white font-semibold transition-colors"
              >
                📧 Email Us
              </a>
              <a
                href="https://twitter.com/unipulseke"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold transition-colors"
              >
                🐦 Follow on Twitter
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-black text-white">Ready to Join the Movement?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Every vote makes the rankings more accurate. Help the next generation find their perfect fit.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105"
          >
            🏁 Start Voting Now
          </a>
        </section>

      </div>
    </div>
  );
}