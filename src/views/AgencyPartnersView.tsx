import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Handshake, ShieldCheck, Users, Clock, Award, CheckCircle2, 
  ArrowRight, Lock, Server, Cpu, Smartphone, Globe, Layers, Sparkles 
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { api } from '../api';
import { Partner } from '../types';
import PartnerCard from '../components/partners/PartnerCard';

export default function AgencyPartnersView() {
  const [agencyPartners, setAgencyPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getPartners()
      .then((data) => {
        const agencies = (data || []).filter(p => 
          p.category.toLowerCase().includes('agency') || 
          p.category === 'Partner' || 
          p.category === 'Technology Partner'
        );
        setAgencyPartners(agencies);
      })
      .catch((err) => {
        console.error('Failed to load agency partners:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  const capabilities = [
    {
      title: 'White-Label Engineering',
      desc: 'We build directly under your brand name or as your silent technical production studio. Complete client-facing invisibility.',
      icon: ShieldCheck
    },
    {
      title: 'Dedicated Engineering Pods',
      desc: 'Plug senior full-stack developers, QA leads, and solution architects directly into your agency workflow.',
      icon: Users
    },
    {
      title: 'Web Application Development',
      desc: 'High-performance React/Next.js platforms, client portals, and bespoke content management solutions.',
      icon: Globe
    },
    {
      title: 'Mobile App Development',
      desc: 'Cross-platform iOS and Android apps built with React Native and Flutter with native device integration.',
      icon: Smartphone
    },
    {
      title: 'AI & Automation Solutions',
      desc: 'Custom LLM integrations, document intelligence, cognitive search, and workflow automation for your clients.',
      icon: Cpu
    },
    {
      title: 'SaaS Platform Development',
      desc: 'Multi-tenant architectures, subscription billing, usage metrics, and cloud infrastructure for client software.',
      icon: Server
    },
    {
      title: 'Complex API Integrations',
      desc: 'Seamless connections between CRMs, ERPs, payment gateways, legacy databases, and cloud services.',
      icon: Layers
    },
    {
      title: 'Ongoing SLA Maintenance',
      desc: 'Continuous uptime monitoring, security patching, and Tier-2/3 technical support so your clients stay protected.',
      icon: Clock
    }
  ];

  const agencyBenefits = [
    {
      title: 'Reliable, On-Time Delivery',
      desc: 'Never miss an agency delivery deadline. Our rigorous sprint cadence and automated testing ensure predictable releases.',
      icon: Award
    },
    {
      title: 'Instant Technical Scale',
      desc: 'Take on high-value, complex technical accounts without bloating your full-time payroll or turning down big RFP briefs.',
      icon: Users
    },
    {
      title: 'Strict Non-Disclosure & Confidentiality',
      desc: 'Comprehensive mutual NDAs signed upfront. We never contact your clients directly or solicit your accounts.',
      icon: Lock
    },
    {
      title: 'Long-Term Technical Support',
      desc: 'We back every line of code with ongoing maintenance agreements, allowing your agency to earn recurring monthly retainer revenue.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
      <SEOHead
        title="Agency Partnerships | Your Client. Our Technology. | SaroHub Technologies"
        description="White-label technology partner for digital agencies, creative studios, and consultancies. Scale your development capacity under strict NDA."
      />

      {/* Hero Header */}
      <div 
        className="py-16 sm:py-24 border-b text-center relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-app)' 
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-blue-500/15 to-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-4">
            <Breadcrumbs items={[{ label: 'Agency Partners', path: '/agency-partners' }]} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
            <Handshake className="w-3.5 h-3.5" />
            <span>Technology Partnership Program</span>
          </div>

          <h1 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your Client. Our Technology.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Expand your agency's technical capabilities without expanding your overhead. We act as your reliable white-label engineering department—building high-performance software under your brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=agency"
              id="agency-hero-cta"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Become a Technology Partner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/partnerships"
              className="w-full sm:w-auto px-8 py-4 border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all"
            >
              All Partnership Models
            </Link>
          </div>
        </div>
      </div>

      {/* Agency Benefits */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b" style={{ borderColor: 'var(--border-app)' }}>
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            Agency Value Proposition
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-4">
            Why Leading Agencies Partner with SaroHub
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            You bring the creative vision, strategy, and client relationship. We supply the senior engineering discipline to deliver flawless technical executions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agencyBenefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl border transition-all duration-300 hover:border-emerald-500/40 flex items-start gap-6"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)'
                }}
              >
                <div className="w-12 h-12 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Capabilities */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b" style={{ borderColor: 'var(--border-app)' }}>
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            Full-Stack Delivery
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-4">
            Technical Capabilities for Your Client Accounts
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From complex web portals to native mobile applications and artificial intelligence integrations, we deliver end-to-end.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border transition-all duration-200 hover:border-blue-500/40 flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)'
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg border border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Active Agency Collaborations */}
      {agencyPartners.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Ecosystem Network
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Featured Agency Collaborations
              </h3>
            </div>
            <Link
              to="/partnerships"
              className="text-xs font-mono font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencyPartners.map((partner) => (
              <div key={partner.id} className="h-full">
                <PartnerCard partner={partner} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partnership Engagement Callout */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div 
          className="rounded-3xl border p-8 sm:p-12 lg:p-16 text-center max-w-4xl mx-auto relative overflow-hidden"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-app)' 
          }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            Confidential Partnership
          </div>

          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Let's Discuss Your Next Client Project
          </h3>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
            Tell us about your upcoming brief or technical requirements. We sign an NDA first, review your scope, and provide a fixed or dedicated team proposal.
          </p>

          <Link
            to="/contact?type=agency"
            id="agency-footer-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/25 transition-all"
          >
            <span>Become a Technology Partner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
