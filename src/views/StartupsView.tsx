import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, Lightbulb, Compass, Palette, Code2, Send, TrendingUp, 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Layers, Sparkles 
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';

export default function StartupsView() {
  const processSteps = [
    {
      phase: '01',
      title: 'Idea Validation & Discovery',
      description: 'We deconstruct your concept, analyze user demand, define minimum viable functionality, and eliminate scope creep before writing code.',
      icon: Lightbulb
    },
    {
      phase: '02',
      title: 'Product Strategy & Architecture',
      description: 'We architect database schemas, API boundaries, third-party integrations, and cloud hosting for cost-efficiency during early traction.',
      icon: Compass
    },
    {
      phase: '03',
      title: 'UI/UX Prototype & Flow',
      description: 'Clickable high-fidelity wireframes that look and feel real. Test user workflows with early customers and stakeholders before build.',
      icon: Palette
    },
    {
      phase: '04',
      title: 'Agile MVP Development',
      description: 'Sprint-based engineering focusing on the core value proposition. Clean, testable TypeScript code built to pass technical due diligence.',
      icon: Code2
    },
    {
      phase: '05',
      title: 'Production Launch',
      description: 'Zero-downtime deployment, SSL certificates, error tracking, analytics telemetry, and onboarding funnels set up for initial cohort release.',
      icon: Send
    },
    {
      phase: '06',
      title: 'Scale & Iteration',
      description: 'Post-launch feedback loops, performance optimizations, database indexing, and feature expansion as you acquire paying customers.',
      icon: TrendingUp
    }
  ];

  const startupServices = [
    {
      title: 'Product Discovery',
      desc: 'Market alignment, technical feasibility, and feature prioritization.'
    },
    {
      title: 'MVP Development',
      desc: 'Rapid 6 to 8-week production builds ready for initial customers.'
    },
    {
      title: 'UI/UX Design',
      desc: 'Intuitive modern interfaces designed for frictionless customer adoption.'
    },
    {
      title: 'SaaS Development',
      desc: 'Multi-tenant architecture, Stripe billing, and team workspaces.'
    },
    {
      title: 'AI Integration',
      desc: 'Practical LLMs, intelligent embeddings, and automated workflows.'
    },
    {
      title: 'Technical Architecture',
      desc: 'Clean scalable codebases that survive growth and diligence.'
    },
    {
      title: 'Cloud Deployment',
      desc: 'Dockerized Linux/AWS setups optimized for low monthly burn.'
    },
    {
      title: 'Product Scaling',
      desc: 'Database optimization, caching layers, and throughput upgrades.'
    }
  ];

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
      <SEOHead
        title="Startups & MVP Engineering | From Idea to MVP | SaroHub Technologies"
        description="We partner with startup founders to turn ideas into scalable MVPs. Full-stack development, UI/UX, SaaS architecture, and launch strategy."
      />

      {/* Hero Header */}
      <div 
        className="py-16 sm:py-24 border-b text-center relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-app)' 
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/15 via-cyan-500/10 to-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-4">
            <Breadcrumbs items={[{ label: 'Startups', path: '/startups' }]} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
            <Rocket className="w-3.5 h-3.5 text-blue-400" />
            <span>Startup Engineering Partner</span>
          </div>

          <h1 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            From Idea to MVP
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            We partner with visionary founders to build production-ready digital products. We bring product strategy, robust engineering, and venture-building experience to turn your vision into a scalable reality.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=startup"
              id="startups-hero-cta"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Build Your MVP</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/ventures"
              className="w-full sm:w-auto px-8 py-4 border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-all"
            >
              Explore Our Own Ventures
            </Link>
          </div>
        </div>
      </div>

      {/* The 6-Stage Process */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b" style={{ borderColor: 'var(--border-app)' }}>
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            The Startup Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-4">
            How We Take You From Concept to Market
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Building an MVP is not about cutting corners—it is about rigorous prioritization. Our 6-stage framework gets you to market swiftly while preserving clean architecture for future scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.phase}
                className="p-8 rounded-2xl border transition-all duration-300 hover:border-blue-500/40 relative flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-app)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-2xl font-mono font-bold text-slate-600">
                      {step.phase}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services for Startups */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 border-b" style={{ borderColor: 'var(--border-app)' }}>
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            Startup Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-4">
            Services Built for High-Growth Founders
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Everything your early-stage company needs under one roof. No juggling separate freelancers, designers, and DevOps engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {startupServices.map((srv, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border transition-all duration-200 hover:border-blue-500/40"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)'
              }}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">
                {srv.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {srv.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Founders Choose SaroHub */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="rounded-3xl border p-8 sm:p-12 lg:p-16 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                Founder Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                We Build Ventures Ourselves
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Unlike outsourced dev shops that only charge for hours, SaroHub is an active venture builder. We develop and scale our own commercial software products. That means we treat your unit economics, customer acquisition friction, and cloud burn with the same seriousness we apply to our own ventures.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  '100% IP & source code ownership transferred to you',
                  'Modular architecture that scales cleanly post-funding',
                  'Pragmatic AI features that provide real market differentiation',
                  'Flexible sprint arrangements designed around your runway'
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-8 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/30 to-indigo-950/20 text-center space-y-6">
              <Sparkles className="w-10 h-10 text-cyan-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">
                Ready to Turn Your Idea Into Reality?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Book a confidential 30-minute discovery session with our technical team.
              </p>
              <Link
                to="/contact?type=startup"
                id="startups-box-cta"
                className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/25 transition-all"
              >
                <span>Build Your MVP</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
