import React, { useState } from 'react';
import { Quote, ChevronRight, Award, ShieldCheck, Mail, MapPin, Sparkles, Building2, Globe2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

interface CEOMessageProps {
  settings: { [key: string]: string };
}

const CEO_FULL_MESSAGE = `Bismillah ir-Rahman ir-Rahim.

In the Name of Allah, the Most Gracious, the Most Merciful.

When I founded SaroHub Technologies, my vision was clear: to build a world-class technology company that not only creates outstanding software and digital solutions, but also uplifts our community in Gilgit-Baltistan and Pakistan at large. Coming from Skardu, I know firsthand that talent and ambition are not limited by geography—only by opportunity.

SaroHub is our answer to that challenge. We are building ventures, launching products, and delivering enterprise-grade solutions that compete on the global stage, while staying deeply rooted in our local identity and values. We believe that innovation driven by purpose creates lasting impact.

To our clients and partners: thank you for trusting us with your ambitions. We do not take that trust lightly. Every project, every solution, and every line of code we write carries our commitment to excellence, integrity, and your success.

To the young talent of Gilgit-Baltistan: you belong in this industry. Technology is for everyone with the curiosity to learn and the courage to build. SaroHub's doors are open to you—as teammates, learners, and future founders.

We are just getting started. The best is yet to come.

— Mehdi Hassan
  CEO & Founder, SaroHub Technologies`;

export default function CEOMessage({ settings }: CEOMessageProps) {
  const [expanded, setExpanded] = useState(false);

  const ceoName = settings.ceo_name || 'Mehdi Hassan';
  const ceoTitle = settings.ceo_title || 'Founder & Chief Executive Officer';
  const ceoPhoto = settings.ceo_photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=600';
  const companyName = settings.company_name || 'SaroHub Technologies (Pvt) Ltd';
  const ceoMessage = settings.ceo_message || CEO_FULL_MESSAGE;
  const officeAddress = settings.office_address || 'Skardu, Gilgit-Baltistan, Pakistan';
  const email = settings.email || 'info@sarohub.com';

  const previewLines = ceoMessage.split('\n').slice(0, 7).join('\n');

  return (
    <section
      id="ceo-message"
      className="py-16 sm:py-20 relative overflow-hidden border-y transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-app)'
      }}
    >
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--text-main) 1px, transparent 0)',
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span>OFFICIAL EXECUTIVE ADDRESS</span>
          </div>

          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
            style={{ color: 'var(--text-main)' }}
          >
            Leadership Vision & Statement
          </h2>

          <p
            className="mt-4 text-sm sm:text-base max-w-2xl leading-relaxed font-normal"
            style={{ color: 'var(--text-body)' }}
          >
            A personal pledge of purpose, integrity, and global technological ambition from the founder of {companyName}.
          </p>
        </div>

        {/* Master Executive Card */}
        <div
          className="max-w-4xl mx-auto rounded-2xl border shadow-xl backdrop-blur-xl overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: 'var(--bg-app)',
            borderColor: 'var(--border-app)'
          }}
        >
          {/* Subtle Top Accent Gradient */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-5 sm:p-8 lg:p-9 items-start">

            {/* LEFT: CEO Profile Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">

              {/* Executive Portrait Container */}
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-30 group-hover:opacity-60 blur-lg transition duration-500" />
                <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-slate-900 shadow-xl">
                  <img
                    src={ceoPhoto}
                    alt={ceoName}
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Verified Executive Seal */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow-md border border-white/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              {/* Title & Name */}
              <div className="space-y-1.5 w-full">
                <h3
                  className="font-display text-xl sm:text-2xl font-black tracking-tight"
                  style={{ color: 'var(--text-main)' }}
                >
                  {ceoName}
                </h3>

                <p className="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {ceoTitle}
                </p>

                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs pt-1 font-medium" style={{ color: 'var(--text-muted)' }}>
                  <Building2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>{companyName}</span>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Skardu, Gilgit-Baltistan, Pakistan</span>
                </div>
              </div>

              {/* Key Leadership Metrics Cards */}
              <div className="grid grid-cols-2 gap-2 w-full pt-1">
                {[
                  {
                    label: 'Founded & Reg.',
                    value: settings.ceo_founded_display || (settings.founder_year ? `${settings.founder_year}${settings.registered_year ? ` (Reg. ${settings.registered_year})` : ''}` : '2022 (Reg. 2026)'),
                    icon: Award
                  },
                  {
                    label: 'Ventures & SaaS',
                    value: settings.ceo_ventures_saas || settings.ventures_count || '5+ Built',
                    icon: Globe2
                  },
                  {
                    label: 'Engineering Team',
                    value: settings.ceo_engineering_team || settings.team_size || '20+ Minds',
                    icon: Building2
                  },
                  {
                    label: 'Strategic Focus',
                    value: settings.ceo_strategic_focus || 'GB & Global',
                    icon: Sparkles
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="rounded-lg border p-2.5 flex flex-col justify-center transition-all hover:border-blue-500/40"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border-app)'
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                        <Icon className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          {item.label}
                        </span>
                      </div>
                      <p className="font-display text-sm font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Contact Link */}
              <div className="w-full pt-0.5">
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Direct Inquiry with Leadership</span>
                </Link>
              </div>

            </div>

            {/* RIGHT: Executive Statement Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">

              {/* Highlight Pull-Quote Box */}
              <div
                className="relative rounded-xl border p-4 sm:p-5 overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)'
                }}
              >
                <Quote className="absolute -top-3 -right-3 h-20 w-20 text-blue-500/10 pointer-events-none" />
                <div className="flex gap-3.5 items-start">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                    <Quote className="h-4 w-4" />
                  </div>
                  <div>
                    <p
                      className="text-sm sm:text-base font-bold leading-snug italic tracking-tight"
                      style={{ color: 'var(--text-main)' }}
                    >
                      "Building enterprise-grade technology for a global market, deeply rooted in our identity and empowering our region."
                    </p>
                    <p className="text-xs font-mono text-blue-400 mt-2 font-semibold">
                      — Core Vision & Commitment
                    </p>
                  </div>
                </div>
              </div>

              {/* Statement Letter Body */}
              <div
                className="relative rounded-xl border p-5 sm:p-6 space-y-3"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)'
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={expanded ? 'full' : 'preview'}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 font-serif text-[13px] sm:text-[14px] leading-relaxed"
                    style={{ color: 'var(--text-body)' }}
                  >
                    {(expanded ? ceoMessage : previewLines)
                      .split('\n')
                      .map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) {
                          return <div key={idx} className="h-1.5" />;
                        }
                        if (trimmed.startsWith('Bismillah') || trimmed.startsWith('In the Name')) {
                          return (
                            <p key={idx} className="text-xs font-mono font-bold tracking-wider text-blue-400 italic">
                              {trimmed}
                            </p>
                          );
                        }
                        if (trimmed.startsWith('—') || trimmed.startsWith('CEO & Founder')) {
                          return null; // Rendered in signature section below
                        }
                        return (
                          <p key={idx} className="leading-relaxed">
                            {trimmed}
                          </p>
                        );
                      })}
                  </motion.div>
                </AnimatePresence>

                {/* Fade Out Mask when Collapsed */}
                {!expanded && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-24 rounded-b-2xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, transparent, var(--bg-card) 90%)'
                    }}
                  />
                )}
              </div>

              {/* Expand Toggle & Official Signature */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t" style={{ borderColor: 'var(--border-app)' }}>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group cursor-pointer"
                >
                  <span>{expanded ? 'Collapse Statement' : 'Read Full Executive Statement'}</span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-300 ${expanded ? '-rotate-90 text-blue-300' : 'group-hover:translate-x-1'}`}
                  />
                </button>

                {/* Signature Block */}
                <div className="text-left sm:text-right">
                  <p
                    className="text-xl sm:text-2xl font-black italic tracking-wide"
                    style={{
                      color: 'var(--text-main)',
                      fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif'
                    }}
                  >
                    {ceoName}
                  </p>
                  <p className="text-[11px] font-mono font-medium text-blue-400 mt-0.5">
                    {ceoTitle} &bull; SaroHub Technologies
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
