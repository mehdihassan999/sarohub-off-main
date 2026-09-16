import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Handshake, Building2, Rocket, GraduationCap, Network, 
  CheckCircle2, ArrowRight, ShieldCheck, Award, Users, Layers,
  Landmark, Sparkles, X, Globe, ExternalLink
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { api } from '../api';
import { Partner } from '../types';
import PartnerCard from '../components/partners/PartnerCard';

export default function PartnershipsView() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPartnerImage, setSelectedPartnerImage] = useState<{ url: string; partnerName: string } | null>(null);

  useEffect(() => {
    api.getPartners()
      .then((data) => {
        setPartners(data || []);
      })
      .catch((err) => {
        console.error('Failed to load partners in PartnershipsView:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = ['all', ...Array.from(new Set(partners.map(p => p.category)))];

  const filteredPartners = activeCategory === 'all'
    ? partners
    : partners.filter(p => p.category === activeCategory);

  const partnershipModels = [
    {
      id: 'government-sector',
      title: 'Government & Public Sector Collaboration',
      subtitle: 'For Ministries, Civic Authorities & Public Agencies',
      icon: Landmark,
      description: 'Modernize public administration and citizen services with secure, cloud-native portals, open-standard compliance, and transparent data architectures.',
      whoItsFor: 'Government ministries, municipal corporations, public utility bodies, and civic technology initiatives.',
      collaboration: [
        'Citizen-facing e-governance web portals and mobile applications',
        'Internal administrative workflows and digitized records management',
        'Secure API integration with national identity and payment gateways',
        'Technical audits, accessibility compliance (WCAG 2.1), and cloud migration'
      ],
      benefits: [
        'High-security software compliant with public data residency standards',
        'Transparent procurement, fixed milestones, and SLA guarantees',
        'Comprehensive handover, administrator training, and documentation',
        'Dedicated maintenance pods ensuring 99.9% public portal uptime'
      ],
      ctaText: 'Discuss Public Sector Initiative',
      ctaLink: '/contact?type=government'
    },
    {
      id: 'technology-partner',
      title: 'Agency & Technology Partner',
      subtitle: 'For Agencies, Design Studios & Consultancies',
      icon: Building2,
      description: 'Expand your technical capacity without taking on full-time engineering overhead. We act as your dedicated white-label development arm.',
      whoItsFor: 'Digital agencies, creative studios, marketing firms, and IT consultancies needing reliable, senior-level engineering.',
      collaboration: [
        'White-label development under your agency brand',
        'Dedicated engineering pods assigned to your client accounts',
        'Fixed-price project delivery or monthly retainer models',
        'Transparent sprint tracking in Jira / Linear / Slack'
      ],
      benefits: [
        'Strict mutual NDA and client confidentiality',
        'Reliable, on-time delivery backed by code warranties',
        'Predictable profit margins on client technical projects',
        'Ongoing SLA maintenance retainers for recurring revenue'
      ],
      ctaText: 'Partner as an Agency',
      ctaLink: '/agency-partners'
    },
    {
      id: 'venture-partner',
      title: 'Venture & Co-Founder Partner',
      subtitle: 'For Startup Founders & Entrepreneurs',
      icon: Rocket,
      description: 'We partner with domain experts and ambitious founders who have deep market insight but lack the technical leadership to build and scale.',
      whoItsFor: 'Domain-expert founders, industry veterans, and early-stage entrepreneurs with validated market demand.',
      collaboration: [
        'Hybrid models: equity, milestone-based fees, or revenue-share',
        'End-to-end technical co-founder role from MVP to Series A',
        'Full product strategy, UI/UX, cloud infrastructure, and AI integration',
        'Technical due diligence representation for angel & VC funding'
      ],
      benefits: [
        'Zero agency markups—we invest our senior engineering skin in the game',
        'Rapid time-to-market with tested enterprise component libraries',
        'Complete source code and IP ownership transferred to the entity',
        'Long-term technical scalability without early CTO payroll strain'
      ],
      ctaText: 'Explore Venture Partnership',
      ctaLink: '/startups'
    },
    {
      id: 'academic-partner',
      title: 'Academic & Training Partner',
      subtitle: 'For Universities, Colleges & Technical Institutes',
      icon: GraduationCap,
      description: 'Bridge the gap between academic theory and practical industry engineering through real-world capstones, bootcamps, and curriculum alignment.',
      whoItsFor: 'Higher education institutions, computer science departments, vocational academies, and government training initiatives.',
      collaboration: [
        'Co-developed industry-relevant software engineering curricula',
        'Real-world capstone projects mentored by senior engineers',
        'Internship placements and graduate hiring pipelines',
        'Guest lectures and technical workshops on modern stacks'
      ],
      benefits: [
        'Elevated graduate employment and practical readiness',
        'Access to real-world commercial software codebases and tools',
        'Joint research and technical development grant opportunities',
        'Recognized certificates of training from SaroHub Technologies'
      ],
      ctaText: 'Explore Academic Partnership',
      ctaLink: '/contact?type=academic'
    },
    {
      id: 'ecosystem-partner',
      title: 'Ecosystem & Incubation Partner',
      subtitle: 'For Incubators, Accelerators & Innovation Hubs',
      icon: Network,
      description: 'Provide your cohort founders with discounted technical architecture reviews, MVP development perks, and office hours with senior engineers.',
      whoItsFor: 'Startup accelerators, venture studios, tech hubs, angel networks, and regional development programs.',
      collaboration: [
        'Dedicated technical office hours and architecture audits for cohort teams',
        'Preferred partner rates and fast-track MVP onboarding',
        'Workshops on cloud architecture, AI integration, and product discovery',
        'Sponsorship and technical judging for hackathons and demo days'
      ],
      benefits: [
        'Increased portfolio company survival rate and technical health',
        'Curated technical perks to attract high-potential cohort applicants',
        'Direct connection to skilled engineering pods across South Asia',
        'Shared regional tech ecosystem branding and visibility'
      ],
      ctaText: 'Connect Your Ecosystem',
      ctaLink: '/contact?type=ecosystem'
    }
  ];

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
      <SEOHead
        title="Partnerships & Ecosystem | SaroHub Technologies"
        description="Collaborate with SaroHub as a government sector partner, digital agency, venture partner, or academic institution. Build scalable digital solutions together."
      />

      {/* Hero Header */}
      <div 
        className="py-16 sm:py-24 border-b text-center relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-app)' 
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-4">
            <Breadcrumbs items={[{ label: 'Partnerships', path: '/partnerships' }]} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
            <Handshake className="w-3.5 h-3.5" />
            <span>Collaboration Frameworks &amp; Ecosystem</span>
          </div>

          <h1 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Partnerships &amp; Ecosystem
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            We collaborate with government sectors, enterprise agencies, technical consultancies, and innovative startups to engineer resilient digital infrastructure and scale high-impact solutions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact?type=partnership"
              id="partnerships-hero-cta"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Start a Partnership Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#active-collaborations"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all"
            >
              <span>View Active Collaborations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Dynamic Active Collaborations & Ecosystem Network */}
      <section 
        id="active-collaborations" 
        className="max-w-7xl mx-auto px-6 py-16 sm:py-24 border-b"
        style={{ borderColor: 'var(--border-app)' }}
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Ecosystem Directory</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Active Partners &amp; Collaborations
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Government sectors, digital agencies, and strategic alliances actively working with SaroHub to deliver mission-critical software.
          </p>
        </div>

        {/* Dynamic Category Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 backdrop-blur-sm'
                }`}
              >
                {cat === 'all' ? 'All Collaborations' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="h-full">
                <PartnerCard
                  partner={partner}
                  onSelectImage={(url, name) => setSelectedPartnerImage({ url, partnerName: name })}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-slate-800/60 bg-slate-900/20 max-w-xl mx-auto">
            <Landmark className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">No Collaborations in this Category</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Check other categories or add a new partnership through the admin panel.
            </p>
          </div>
        )}
      </section>

      {/* 5 Models Detailed Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 space-y-16">
        <div className="text-center max-w-3xl mx-auto mb-4">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block mb-2">
            Structured Frameworks
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How We Partner &amp; Collaborate
          </h2>
        </div>

        {partnershipModels.map((model, idx) => {
          const Icon = model.icon;

          return (
            <div
              key={model.id}
              id={`model-${model.id}`}
              className="rounded-3xl border p-8 sm:p-12 transition-all duration-300 hover:border-blue-500/40 relative overflow-hidden"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-app)' 
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Overview & Target */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                        Model 0{idx + 1}
                      </span>
                      <p className="text-xs text-slate-400 font-medium">
                        {model.subtitle}
                      </p>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {model.title}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {model.description}
                  </p>

                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                    <p className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
                      Who It Is For
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {model.whoItsFor}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={model.ctaLink}
                      id={`cta-model-${model.id}`}
                      className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>{model.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Collaboration Scope & Benefits */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      How We Collaborate
                    </h3>
                    <ul className="space-y-2.5">
                      {model.collaboration.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-400" />
                      Partner Benefits
                    </h3>
                    <ul className="space-y-2">
                      {model.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <div 
        className="py-16 border-t text-center"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-app)' 
        }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Have a Government, Agency, or Venture Proposal?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            We are always ready to review project briefs, tenders, and strategic alliance proposals.
          </p>
          <Link
            to="/contact?type=partnership"
            id="partnerships-bottom-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/20 transition-all"
          >
            <span>Propose a Collaboration</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* High-Resolution Asset Modal Lightbox */}
      {selectedPartnerImage && (
        <div 
          onClick={() => setSelectedPartnerImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-2 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                {selectedPartnerImage.partnerName} — Showcase Asset
              </span>
              <button
                onClick={() => setSelectedPartnerImage(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 flex items-center justify-center overflow-hidden max-h-[75vh]">
              <img
                src={selectedPartnerImage.url}
                alt={selectedPartnerImage.partnerName}
                className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
