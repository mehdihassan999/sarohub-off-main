import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, ShoppingBag, Utensils, Rocket, Briefcase, Building2, 
  ArrowRight, CheckCircle2, ChevronRight, Layers, ExternalLink 
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../api';
import { IndustrySolution } from '../types';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';

const INDUSTRY_ICONS: { [key: string]: any } = {
  'education-edtech': GraduationCap,
  'retail-ecommerce': ShoppingBag,
  'hospitality-travel': Utensils,
  'startups': Rocket,
  'professional-services': Briefcase,
  'real-estate': Building2
};

export default function IndustriesView() {
  const [industries, setIndustries] = useState<IndustrySolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string>('all');

  useEffect(() => {
    api.getIndustries()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setIndustries(data.filter(i => i.published).sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredIndustries = selectedSlug === 'all' 
    ? industries 
    : industries.filter(i => i.slug === selectedSlug);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
      <SEOHead
        title="Industries We Serve | SaroHub Technologies"
        description="Tailored digital solutions and custom software for education, retail, hospitality, startups, real estate, and professional services."
      />

      {/* Header Banner */}
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
            <Breadcrumbs items={[{ label: 'Industries', path: '/industries' }]} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
            Industry Solutions
          </div>

          <h1 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Built for Your Industry
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every sector faces distinct operational friction. We develop specialized software platforms engineered around industry workflows, compliance, and growth.
          </p>

          {/* Quick Filter Bar */}
          {industries.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedSlug('all')}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedSlug === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                All Industries
              </button>
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setSelectedSlug(ind.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedSlug === ind.slug
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content List */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 space-y-16">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
              />
            ))}
          </div>
        ) : filteredIndustries.length > 0 ? (
          filteredIndustries.map((industry, index) => {
            const Icon = INDUSTRY_ICONS[industry.slug] || Briefcase;

            return (
              <div
                key={industry.id || index}
                id={`industry-${industry.slug}`}
                className="rounded-3xl border p-8 sm:p-12 transition-all duration-300 hover:border-blue-500/40 relative overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-app)' 
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left Column: Problem & Positioning */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Icon className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                        Industry Sector 0{index + 1}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {industry.name}
                    </h2>

                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                      <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                        The Challenge
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {industry.problemStatement}
                      </p>
                    </div>

                    {/* How SaroHub Solves It */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        Solutions We Deliver
                      </h3>
                      <ul className="space-y-2.5">
                        {industry.solutions.map((sol, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <span>{sol}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-4 items-center">
                      <Link
                        to={`/contact?industry=${encodeURIComponent(industry.name)}`}
                        id={`contact-${industry.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
                      >
                        <span>Discuss an {industry.name} Project</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        to="/work"
                        className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                      >
                        View Related Case Studies →
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Capabilities, Tech & Benefits */}
                  <div className="lg:col-span-6 space-y-6 lg:border-l lg:pl-10 border-slate-800/80">
                    {/* Key Features */}
                    {industry.features && industry.features.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Core Functional Modules
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {industry.features.map((feat, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/50 text-slate-200"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Relevant Services */}
                    {industry.services && industry.services.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Applicable Engineering Services
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {industry.services.map((srv, i) => (
                            <Link
                              key={i}
                              to="/services"
                              className="text-xs px-3 py-1 rounded-md border border-blue-500/20 bg-blue-500/5 text-blue-300 hover:bg-blue-500/10 transition-colors"
                            >
                              {srv}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Measurable Benefits */}
                    {industry.benefits && industry.benefits.length > 0 && (
                      <div className="p-5 rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-950/20 to-transparent">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                          Expected Outcomes
                        </h4>
                        <ul className="space-y-2">
                          {industry.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    {industry.technologies && industry.technologies.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Technology Frameworks
                        </h4>
                        <p className="text-xs font-mono text-slate-400">
                          {industry.technologies.join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-400">
            No industry pages configured.
          </div>
        )}
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
            Operating in a Different Industry?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Our agile engineering process adapts to specialized enterprise workflows, proprietary hardware integrations, and regulated sectors.
          </p>
          <Link
            to="/contact"
            id="industry-custom-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/20 transition-all"
          >
            <span>Request an Industry Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
