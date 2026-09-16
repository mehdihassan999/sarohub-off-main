import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Layers, Handshake, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface WhatWeDoSectionProps {
  settings?: { [key: string]: string };
}

export default function WhatWeDoSection({ settings = {} }: WhatWeDoSectionProps) {
  const sectionBadge = settings.what_we_do_badge || 'Two Core Engines • One Strategic Partner';
  const sectionHeading = settings.what_we_do_heading || 'Client Engineering & B2B Ventures';
  const sectionSubtext = settings.what_we_do_subtext ||
    'We provide full-lifecycle engineering services for businesses needing reliable websites, software, mobile apps, AI automations, and growth marketing—while simultaneously building proprietary products and partnering with startups on high-velocity MVPs.';

  const parseHighlights = (raw: string | undefined, defaultList: string[]) => {
    if (!raw) return defaultList;
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean);
      } catch { /* ignore */ }
    }
    const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return lines.length > 0 ? lines : defaultList;
  };

  const defaultP1Highlights = [
    'Custom Websites & Web Applications',
    'Cross-Platform Mobile Apps (iOS & Android)',
    'Custom Software, ERPs & AI Automation',
    'SEO, Paid Ads & Performance Marketing'
  ];

  const defaultP2Highlights = [
    'Rapid MVP Development in 4–8 Weeks',
    'Fractional CTO & Technical Arm for Startups',
    'White-Label Engineering for Agencies',
    'Joint Ventures & Strategic Co-Development'
  ];

  const defaultP3Highlights = [
    'Alin316 EdTech & School Management Ecosystem',
    'SaroHub Sentinel & Operational ERP Platforms',
    'Tested, enterprise-grade cloud architectures',
    'Ready-to-deploy modules & B2B licensing'
  ];

  const pillars = [
    {
      id: 'businesses',
      title: settings.what_we_do_p1_title || 'Client Engineering Services',
      badge: settings.what_we_do_p1_badge || 'Direct Contracting',
      description: settings.what_we_do_p1_desc || 'We design, engineer, and deploy high-performance websites, custom software, iOS & Android mobile apps, and AI automations with dedicated milestone delivery.',
      highlights: parseHighlights(settings.what_we_do_p1_highlights, defaultP1Highlights),
      ctaText: settings.what_we_do_p1_cta_text || 'Hire Us for a Project',
      ctaLink: settings.what_we_do_p1_cta_link || '/contact',
      icon: Layers,
      accentColor: 'from-blue-500/20 to-indigo-500/20',
      borderAccent: 'hover:border-blue-500/40',
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      id: 'partners',
      title: settings.what_we_do_p2_title || 'B2B & Startup Partnerships',
      badge: settings.what_we_do_p2_badge || 'Co-Building & Scale',
      description: settings.what_we_do_p2_desc || 'We partner with non-technical founders, agencies, and enterprise leaders to build market-ready MVPs, white-label client projects, and scale technical infrastructure.',
      highlights: parseHighlights(settings.what_we_do_p2_highlights, defaultP2Highlights),
      ctaText: settings.what_we_do_p2_cta_text || 'Discuss a B2B Partnership',
      ctaLink: settings.what_we_do_p2_cta_link || '/partnerships',
      icon: Handshake,
      accentColor: 'from-cyan-500/20 to-blue-500/20',
      borderAccent: 'hover:border-cyan-500/40',
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      id: 'ventures',
      title: settings.what_we_do_p3_title || 'Proprietary Tech Products',
      badge: settings.what_we_do_p3_badge || 'Our Own Ventures',
      description: settings.what_we_do_p3_desc || 'We engineer, incubate, and scale our own software products and SaaS ecosystems. Because we build our own ventures, we think like product owners, not just contractors.',
      highlights: parseHighlights(settings.what_we_do_p3_highlights, defaultP3Highlights),
      ctaText: settings.what_we_do_p3_cta_text || 'Explore Our Ventures',
      ctaLink: settings.what_we_do_p3_cta_link || '/ventures',
      icon: Rocket,
      accentColor: 'from-purple-500/20 to-blue-500/20',
      borderAccent: 'hover:border-purple-500/40',
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    }
  ];

  return (
    <section 
      id="what-we-do" 
      className="py-20 lg:py-28 relative border-b overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 lg:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
            {sectionBadge}
          </div>
          <h2 
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {sectionHeading}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            {sectionSubtext}
          </p>
        </div>

        {/* 3 Major Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                id={`card-${pillar.id}`}
                className={`flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 ${pillar.borderAccent} group relative overflow-hidden`}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)'
                }}
              >
                {/* Subtle top card glow on hover */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${pillar.iconColor} transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full border border-slate-700/60 bg-slate-800/40 text-slate-300">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {pillar.description}
                  </p>

                  <ul className="space-y-2.5 mb-8 border-t border-slate-800/80 pt-6">
                    {pillar.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={pillar.ctaLink}
                  id={`cta-${pillar.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-600 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 group-hover:border-blue-500/50"
                >
                  <span>{pillar.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
