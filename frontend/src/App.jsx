import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatWidget from './components/ChatWidget.jsx';
import LeadsDashboard from './components/LeadsDashboard.jsx';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="bg-gradient-to-br from-wiz-purple via-violet-600 to-wiz-blue text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🚀 Empowering Young Minds with Future Skills
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-5">
            Learn to Think.<br />
            <span className="text-yellow-300">Learn to Lead.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            WizKlub's AI-powered programs in Coding, Robotics &amp; Higher-Order Thinking help children aged 5–17
            develop 21st-century skills they'll use for life.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => document.getElementById('wiz-chat-toggle')?.click()}
              className="px-6 py-3 bg-white text-wiz-purple font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition"
            >
              💬 Chat with Wiz
            </button>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-white/15 backdrop-blur border border-white/30 rounded-xl font-semibold hover:bg-white/25 transition"
            >
              📊 Leads Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Why WizKlub?</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Trusted by 1,00,000+ students across India and growing globally.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🧠', title: 'Higher-Order Thinking', desc: 'Develop critical analysis, problem-solving, and creative reasoning skills.' },
              { icon: '💻', title: 'Coding & AI', desc: 'Age-appropriate projects in Python, Scratch, Robotics, and Machine Learning.' },
              { icon: '🏆', title: 'Global Competitions', desc: 'Prepare for international STEM olympiads and build a winning portfolio.' },
            ].map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-md transition group">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-wiz-purple transition">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '1L+', label: 'Students Enrolled' },
            { num: '500+', label: 'School Partners' },
            { num: '15+', label: 'Countries' },
            { num: '4.8★', label: 'Parent Rating' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-wiz-purple to-wiz-blue bg-clip-text text-transparent">{s.num}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-r from-wiz-purple to-wiz-blue text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to ignite your child's potential?</h2>
        <p className="text-white/80 mb-8 max-w-lg mx-auto">Click the chat bubble → tell Wiz a bit about your child → get a free demo class booked in under 3 minutes.</p>
        <span className="inline-block animate-bounce-soft text-5xl">💬</span>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-500 py-8 px-6 text-center text-xs">
        <p>© {new Date().getFullYear()} WizKlub Technologies Pvt. Ltd. · All rights reserved.</p>
        <p className="mt-1">
          <a href="mailto:hello@wizklab.com" className="hover:text-white transition">hello@wizklab.com</a>
          {' · '}
          <a href="https://wizklab.com" target="_blank" rel="noreferrer" className="hover:text-white transition">wizklab.com</a>
        </p>
      </footer>

      {/* ── Floating Chat Widget ──────────────────────────── */}
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<LeadsDashboard />} />
    </Routes>
  );
}
