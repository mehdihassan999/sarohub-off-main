import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, FileText, Grid, Code, Globe, TrendingUp, 
  CheckCircle2, ArrowRight, Layers, ShieldCheck, Zap 
} from 'lucide-react';
import { api } from '../api';
import { ProcessStep } from '../types';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';

const DEFAULT_PROCESS_STEPS = [
  {
    id: 1,
    stepNumber: '01',
    title: 'Discover',
    shortDescription: 'Understand the business, users and requirements.',
    detailedDescription: 'Before writing a single line of code, we thoroughly investigate your core operational challenges, target audience workflows, competitive landscape, and commercial objectives.',
    activities: [
      'Stakeholder interviews & business goal definition',
      'User persona mapping and user story documentation',
      'Technical constraint & integration audit',
      'Scope bounding and MVP feature prioritization'
    ],
    deliverables: ['Product Discovery Brief', 'Feature Matrix', 'Architecture Feasibility Assessment']
  },
  {
    id: 2,
    stepNumber: '02',
    title: 'Plan',
    shortDescription: 'Define product strategy, architecture and technology.',
    detailedDescription: 'We translate requirements into technical architecture, choosing optimal frameworks, designing relational database schemas, and mapping sprint milestones.',
    activities: [
      'Normalized relational database schema design (PostgreSQL/SQL)',
      'API specification contracts (RESTful / GraphQL)',
      'Cloud hosting & DevOps infrastructure planning (AWS/Linux/Docker)',
      'Two-week agile sprint backlog & timeline formulation'
    ],
    deliverables: ['System Architecture Document', 'Database Entity Relationship Diagram (ERD)', 'Sprint Roadmap']
  },
  {
    id: 3,
    stepNumber: '03',
    title: 'Design',
    shortDescription: 'Create the user experience and interface.',
    detailedDescription: 'Our design team crafts intuitive, accessible, high-conversion interfaces adhering strictly to modern typographic hierarchy, contrast guidelines, and responsive behavior.',
    activities: [
      'Low-fidelity wireframing of primary user paths',
      'High-fidelity interactive UI prototyping in Figma',
      'Component design system & accessible color palette creation',
      'Mobile and desktop responsive stress-testing'
    ],
    deliverables: ['Clickable Prototype', 'Design System Library', 'Production Assets Export']
  },
  {
    id: 4,
    stepNumber: '04',
    title: 'Build',
    shortDescription: 'Develop, integrate and test the product.',
    detailedDescription: 'Our senior full-stack engineers build with strict TypeScript type safety, automated test coverage, and continuous integration pipelines.',
    activities: [
      'Front-end implementation with React / Next.js / Tailwind CSS',
      'Back-end microservices / APIs in Node.js / Express / Python',
      'Third-party SDK integrations (Stripe, AI models, SMS/Email gateways)',
      'Automated unit, integration, and security vulnerability scans'
    ],
    deliverables: ['Clean Git Repository', 'Passing Test Suites', 'Staging Environment Demos']
  },
  {
    id: 5,
    stepNumber: '05',
    title: 'Launch',
    shortDescription: 'Deploy the product to production.',
    detailedDescription: 'We manage production provisioning, DNS configuration, SSL certification, database migration, and live release monitoring with zero downtime.',
    activities: [
      'Production cloud containerization and server provisioning',
      'SSL certificates, custom domain routing, and CDN edge caching',
      'End-to-end user acceptance testing (UAT)',
      'Real-time error alerting and uptime monitoring setup'
    ],
    deliverables: ['Live Production URL', 'Admin Access Credentials', 'Deployment Documentation']
  },
  {
    id: 6,
    stepNumber: '06',
    title: 'Scale',
    shortDescription: 'Maintain, improve and expand the product.',
    detailedDescription: 'Technology products require continuous iteration. We offer dedicated SLAs covering cloud performance optimization, database tuning, security updates, and new feature sprints.',
    activities: [
      'Continuous uptime monitoring and automated daily database backups',
      'Performance profiling, query indexing, and caching improvements',
      'User feedback integration and feature iteration sprints',
      'Security patch management and framework updates'
    ],
    deliverables: ['Monthly Uptime Reports', 'Feature Iteration Sprints', 'Dedicated SLA Support']
  }
];

export default function ProcessView() {
  const [steps, setSteps] = useState<any[]>(DEFAULT_PROCESS_STEPS);

  useEffect(() => {
    api.getProcessSteps()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
          // Merge with detailed activities
          setSteps(sorted.map((s, idx) => ({
            ...DEFAULT_PROCESS_STEPS[idx],
            ...s
          })));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
      <SEOHead
        title="Our Engineering Process | How We Work | SaroHub Technologies"
        description="Explore how SaroHub builds scalable digital solutions through a structured 6-phase engineering process: Discover, Plan, Design, Build, Launch, and Scale."
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
            <Breadcrumbs items={[{ label: 'Process', path: '/process' }]} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
            Methodology & Execution
          </div>

          <h1 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            How We Work
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Great technology isn't an accident—it is the result of disciplined execution. Our structured 6-step framework ensures complete predictability, transparent progress, and production excellence.
          </p>

          <Link
            to="/contact"
            id="process-hero-cta"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-blue-500/25 transition-all"
          >
            <span>Start a Project with Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 6 Steps List */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 space-y-16">
        {steps.map((step, idx) => (
          <div
            key={step.id || idx}
            id={`step-${step.stepNumber}`}
            className="rounded-3xl border p-8 sm:p-12 transition-all duration-300 hover:border-blue-500/40 relative overflow-hidden"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-app)' 
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Number, Title & Description */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-cyan-400">
                    {step.stepNumber}
                  </span>
                  <div className="h-6 w-[1px] bg-slate-700" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Phase 0{idx + 1}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {step.title}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                  {step.shortDescription}
                </p>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.detailedDescription}
                </p>
              </div>

              {/* Right Column: Key Activities & Deliverables */}
              <div className="lg:col-span-6 space-y-6 lg:border-l lg:pl-10 border-slate-800/80">
                {step.activities && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      Key Activities
                    </h3>
                    <ul className="space-y-2.5">
                      {step.activities.map((act: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.deliverables && (
                  <div className="p-4 rounded-xl border border-blue-500/15 bg-blue-500/5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
                      Phase Deliverables
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((del: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700 text-slate-200"
                        >
                          {del}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div 
        className="py-16 border-t text-center"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-app)' 
        }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Put This Process to Work for You?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Schedule an initial discovery call with our team. We'll explore your requirements and map out clear next steps.
          </p>
          <Link
            to="/contact"
            id="process-bottom-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/20 transition-all"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
