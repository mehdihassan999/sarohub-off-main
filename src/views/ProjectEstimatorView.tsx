import React, { useState, useMemo } from 'react';
import { 
  Calculator, Check, ArrowRight, ShieldCheck, Sparkles, Clock, 
  DollarSign, Layers, Cpu, Smartphone, Globe, ShoppingCart, 
  Cloud, Lock, FileText, Download, Send, CheckCircle2, AlertCircle,
  HelpCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';

interface ProjectEstimatorViewProps {
  settings?: { [key: string]: string };
}

interface ProjectTypeOption {
  id: string;
  name: string;
  icon: any;
  desc: string;
  baseMinUSD: number;
  baseMaxUSD: number;
  baseWeeks: number;
}

interface ModuleOption {
  id: string;
  name: string;
  category: string;
  costUSD: number;
  weeks: number;
  desc: string;
}

export default function ProjectEstimatorView({ settings = {} }: ProjectEstimatorViewProps) {
  const navigate = useNavigate();
  const companyName = settings.company_name || 'SaroHub Technologies (Private) Limited';
  const companyEmail = settings.email || 'info@sarohub.com';
  const rawWhatsapp = settings.whatsapp || '+92 3430381473';
  const whatsappNumber = rawWhatsapp.includes('+94') ? '+92 3430381473' : rawWhatsapp;

  // Configuration State
  const [currency, setCurrency] = useState<'USD' | 'PKR'>('USD');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('Enterprise SaaS Platform');
  const [selectedScale, setSelectedScale] = useState<string>('Production Standard');
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'AI / LLM Integration & Workflow Automation',
    'Payment Processing & Subscriptions (Stripe/Card)',
    'Enterprise RBAC, Multi-Tenancy & Audit Logs'
  ]);
  const [timelineSpeed, setTimelineSpeed] = useState<string>('Standard Production Sprint');

  // Contact capture state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Conversion rate
  const USD_TO_PKR = 280;

  const projectTypes: ProjectTypeOption[] = [
    {
      id: 'Enterprise SaaS Platform',
      name: 'Enterprise SaaS Platform',
      icon: Layers,
      desc: 'Multi-tenant cloud platform with subscription billing, role permissions, and scalable database architecture.',
      baseMinUSD: 4500,
      baseMaxUSD: 8500,
      baseWeeks: 8
    },
    {
      id: 'Custom Web Application',
      name: 'Custom Web Application',
      icon: Globe,
      desc: 'Bespoke high-performance web platform, interactive dashboards, or internal operational software.',
      baseMinUSD: 2500,
      baseMaxUSD: 4500,
      baseWeeks: 4
    },
    {
      id: 'Mobile App (iOS & Android)',
      name: 'Mobile App (iOS & Android)',
      icon: Smartphone,
      desc: 'Native or cross-platform React Native / Flutter apps with offline sync, push alerts, and device hardware integration.',
      baseMinUSD: 3500,
      baseMaxUSD: 6500,
      baseWeeks: 6
    },
    {
      id: 'AI Agent & Cognitive Automation',
      name: 'AI Agent & Cognitive Automation',
      icon: Cpu,
      desc: 'Generative AI workflows, customized LLM agents, RAG enterprise search, and automated decision engines.',
      baseMinUSD: 3000,
      baseMaxUSD: 6000,
      baseWeeks: 5
    },
    {
      id: 'E-Commerce Ecosystem',
      name: 'E-Commerce Ecosystem',
      icon: ShoppingCart,
      desc: 'Custom headless or full-stack digital store with inventory synchronization, payment gateways, and order dispatch.',
      baseMinUSD: 2200,
      baseMaxUSD: 4200,
      baseWeeks: 4
    },
    {
      id: 'Cloud Architecture & DevOps',
      name: 'Cloud Architecture & DevOps',
      icon: Cloud,
      desc: 'Kubernetes orchestration, serverless microservices, CI/CD deployment pipelines, and zero-downtime infrastructure.',
      baseMinUSD: 2000,
      baseMaxUSD: 4000,
      baseWeeks: 3
    }
  ];

  const scaleTiers = [
    {
      id: 'MVP / Startup Prototype',
      multiplier: 0.85,
      desc: 'Optimized for rapid speed-to-market and investor validation with core essential features.',
      badge: 'Speed Focused'
    },
    {
      id: 'Production Standard',
      multiplier: 1.15,
      desc: 'Built for active customer traffic, comprehensive unit/integration testing, and solid documentation.',
      badge: 'Recommended'
    },
    {
      id: 'Enterprise Scaled & High-Security',
      multiplier: 1.6,
      desc: 'Hardened for high concurrency, strict compliance (SOC2/GDPR), automated auditing, and 99.9% uptime SLA.',
      badge: 'Maximum Reliability'
    }
  ];

  const availableModules: ModuleOption[] = [
    {
      id: 'AI / LLM Integration & Workflow Automation',
      name: 'AI & Cognitive LLM Workflows',
      category: 'Intelligence',
      costUSD: 1200,
      weeks: 1.5,
      desc: 'Smart agent pipelines, contextual AI copilots, OpenAI/Gemini APIs, and automated summarization.'
    },
    {
      id: 'Payment Processing & Subscriptions (Stripe/Card)',
      name: 'Global & Local Payments (Stripe/Card)',
      category: 'Monetization',
      costUSD: 700,
      weeks: 1,
      desc: 'Secure checkout, recurring subscriptions, invoice generation, and multi-currency billing.'
    },
    {
      id: 'Enterprise RBAC, Multi-Tenancy & Audit Logs',
      name: 'Multi-Tenancy & Enterprise RBAC',
      category: 'Security',
      costUSD: 1100,
      weeks: 1.5,
      desc: 'Granular permissions, organization partitioning, session tracking, and audit logging.'
    },
    {
      id: 'Real-time Chat, WebSockets & Notifications',
      name: 'Real-Time WebSockets & Push Alerts',
      category: 'Engagement',
      costUSD: 900,
      weeks: 1,
      desc: 'Live bidirectional messaging, in-app activity feeds, email dispatches, and SMS webhooks.'
    },
    {
      id: 'Advanced BI Analytics & Visual Dashboards',
      name: 'Interactive Analytics & Reports',
      category: 'Data',
      costUSD: 850,
      weeks: 1,
      desc: 'Data visualization (charts, heatmaps, exportable CSV/PDF reports), filtering, and KPIs.'
    },
    {
      id: 'Third-Party API & ERP/CRM Synchronizers',
      name: 'Third-Party ERP, CRM & API Sync',
      category: 'Integrations',
      costUSD: 800,
      weeks: 1,
      desc: 'Seamless two-way integration with Salesforce, HubSpot, SAP, Google Workspace, or custom REST/GraphQL APIs.'
    },
    {
      id: 'High Availability Cloud, CI/CD & Auto-Scaling',
      name: 'High Availability Cloud & CI/CD',
      category: 'DevOps',
      costUSD: 950,
      weeks: 1,
      desc: 'Automated GitHub Actions pipelines, Docker containerization, CDN caching, and automated cloud backups.'
    }
  ];

  // Dynamic Calculation
  const calculation = useMemo(() => {
    const pType = projectTypes.find(p => p.id === selectedProjectType) || projectTypes[0];
    const sTier = scaleTiers.find(s => s.id === selectedScale) || scaleTiers[1];

    let min = pType.baseMinUSD * sTier.multiplier;
    let max = pType.baseMaxUSD * sTier.multiplier;
    let weeks = pType.baseWeeks * sTier.multiplier;

    selectedModules.forEach(modId => {
      const mod = availableModules.find(m => m.id === modId);
      if (mod) {
        min += mod.costUSD;
        max += mod.costUSD * 1.25;
        weeks += mod.weeks;
      }
    });

    if (timelineSpeed === 'Accelerated / High-Priority') {
      min *= 1.2;
      max *= 1.2;
      weeks = Math.max(3, weeks * 0.7); // 30% faster sprint delivery
    }

    const isPkr = currency === 'PKR';
    const finalMin = isPkr ? Math.round(min * USD_TO_PKR / 1000) * 1000 : Math.round(min / 50) * 50;
    const finalMax = isPkr ? Math.round(max * USD_TO_PKR / 1000) * 1000 : Math.round(max / 50) * 50;
    const weeksMin = Math.max(2, Math.floor(weeks));
    const weeksMax = Math.ceil(weeks * 1.3);

    const phases = [
      {
        name: 'Phase 1: Architecture, Scoping & Interactive UX',
        weeks: Math.max(1, Math.round(weeks * 0.2)),
        desc: 'Technical specification document, database schema modeling, user journeys, and high-fidelity Figma prototypes.'
      },
      {
        name: 'Phase 2: Core Engineering & Backend Services',
        weeks: Math.max(2, Math.round(weeks * 0.4)),
        desc: 'API microservices, cloud databases, business logic algorithms, and authentication infrastructure.'
      },
      {
        name: 'Phase 3: Module Integration & Client Application',
        weeks: Math.max(1, Math.round(weeks * 0.25)),
        desc: `Implementation of selected modules (${selectedModules.length > 0 ? selectedModules.slice(0, 2).join(', ') : 'core features'}), state handling, and responsive frontend.`
      },
      {
        name: 'Phase 4: QA Audits, Security Hardening & Launch',
        weeks: Math.max(1, Math.round(weeks * 0.15)),
        desc: 'Penetration testing, cross-browser validation, CI/CD setup, production rollout, and SLA warranty initiation.'
      }
    ];

    return {
      finalMin,
      finalMax,
      weeksMin,
      weeksMax,
      phases
    };
  }, [selectedProjectType, selectedScale, selectedModules, timelineSpeed, currency]);

  const toggleModule = (modId: string) => {
    setSelectedModules(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const handleSaveAndEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim()) {
      setSubmitError('Please provide your email address to receive your formal estimate breakdown.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName.trim(),
          client_email: clientEmail.trim(),
          client_phone: clientPhone.trim(),
          company_name: company.trim(),
          project_type: selectedProjectType,
          scale_tier: selectedScale,
          selected_modules: selectedModules,
          timeline_speed: timelineSpeed,
          currency,
          project_notes: notes.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate estimate.');

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit estimate. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currSymbol = currency === 'PKR' ? '₨ ' : '$';

  return (
    <div className="min-h-screen py-12 md:py-20" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-main)' }}>
      <SEOHead 
        title={`Project Cost & Scope Calculator | ${companyName}`}
        description="Estimate your software project cost, delivery timeline, and phased architectural roadmap in real time. Transparent engineering pricing from SaroHub Technologies."
        canonicalUrl="https://sarohub.com/estimate"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Scope & Cost Estimator', path: '/estimate' }]} />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/30 bg-blue-500/10 text-blue-400">
            <Calculator className="w-3.5 h-3.5" />
            Interactive Scope & Investment Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">Project Cost & Timeline</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Configure your technical requirements, scale, and feature modules. Get instant, transparent projections for development budget, delivery milestones, and sprint timelines.
          </p>

          {/* Currency Toggle */}
          <div className="inline-flex items-center gap-1 p-1 mt-6 rounded-xl border border-slate-800 bg-slate-900/80">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'USD' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              USD ($) Global
            </button>
            <button
              type="button"
              onClick={() => setCurrency('PKR')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === 'PKR' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PKR (₨) Domestic
            </button>
          </div>
        </div>

        {/* Main Grid: Configurator on Left, Live Estimate Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Configurator Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Project Type */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h2 className="text-base sm:text-lg font-bold">Select Project Archetype</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => {
                  const isSelected = selectedProjectType === type.id;
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedProjectType(type.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 shadow-sm shadow-blue-500/20'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                          {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                        </div>
                        <h3 className={`text-sm font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {type.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{type.desc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                        Base: ~{type.baseWeeks} weeks delivery
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Architecture & Scalability Tier */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h2 className="text-base sm:text-lg font-bold">Architecture & Scalability Tier</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {scaleTiers.map((tier) => {
                  const isSelected = selectedScale === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedScale(tier.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 shadow-sm shadow-blue-500/20'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-bold ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                          {tier.id}
                        </h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {tier.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{tier.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Feature Modules / Add-ons */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h2 className="text-base sm:text-lg font-bold">Feature Modules & Integrations</h2>
                </div>
                <span className="text-xs text-slate-400">{selectedModules.length} selected</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableModules.map((mod) => {
                  const isSelected = selectedModules.includes(mod.id);
                  const displayCost = currency === 'PKR' 
                    ? `+₨ ${(mod.costUSD * USD_TO_PKR).toLocaleString()}` 
                    : `+$${mod.costUSD}`;

                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModule(mod.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-cyan-500/80 bg-cyan-500/10 shadow-sm shadow-cyan-500/10'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {mod.name}
                        </h4>
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-slate-700'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{mod.desc}</p>
                      <div className="flex items-center justify-between text-[10px] font-semibold">
                        <span className="text-slate-400 uppercase">{mod.category}</span>
                        <span className="text-cyan-400">{displayCost}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Delivery Cadence */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h2 className="text-base sm:text-lg font-bold">Delivery Cadence & Priority</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'Standard Production Sprint',
                    name: 'Standard Production Sprint',
                    desc: 'Regular continuous delivery cycles with weekly milestone demonstrations.',
                    tag: 'Standard Rates'
                  },
                  {
                    id: 'Accelerated / High-Priority',
                    name: 'Accelerated / High-Priority Sprint',
                    desc: 'Dedicated parallel engineering squads, daily releases, delivers ~30% faster.',
                    tag: 'Dedicated Squad (+20%)'
                  }
                ].map((speed) => {
                  const isSelected = timelineSpeed === speed.id;
                  return (
                    <div
                      key={speed.id}
                      onClick={() => setTimelineSpeed(speed.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 shadow-sm shadow-blue-500/20'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                          {speed.name}
                        </h4>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{speed.desc}</p>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        {speed.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Scope & Investment Card */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                    Live Scope Calculation
                  </span>
                  <h3 className="text-lg font-bold text-white">Preliminary Estimate</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProjectType('Enterprise SaaS Platform');
                    setSelectedScale('Production Standard');
                    setSelectedModules(['AI / LLM Integration & Workflow Automation']);
                    setTimelineSpeed('Standard Production Sprint');
                  }}
                  title="Reset to standard defaults"
                  className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Price & Timeline Display */}
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80">
                  <p className="text-xs text-slate-400 font-semibold mb-1">Estimated Investment Range</p>
                  <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                    {currSymbol}{calculation.finalMin.toLocaleString()} – {currSymbol}{calculation.finalMax.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Currency: {currency} • Milestone-based disbursements under strict SLA
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
                    <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="text-[11px] text-slate-400">Estimated Delivery</p>
                    <p className="text-sm font-bold text-slate-200">{calculation.weeksMin} to {calculation.weeksMax} Weeks</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-center">
                    <ShieldCheck className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-[11px] text-slate-400">IP Rights</p>
                    <p className="text-sm font-bold text-slate-200">100% Client Owned</p>
                  </div>
                </div>
              </div>

              {/* Phased Roadmap Breakdown */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Architectural Delivery Roadmap
                </h4>
                <div className="space-y-2.5">
                  {calculation.phases.map((phase, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs">
                      <div className="flex justify-between font-semibold text-slate-200 mb-1">
                        <span>{phase.name}</span>
                        <span className="text-blue-400 shrink-0">~{phase.weeks} wks</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{phase.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/book', {
                      state: {
                        projectType: selectedProjectType,
                        budgetRange: `${currSymbol}${calculation.finalMin.toLocaleString()} - ${currSymbol}${calculation.finalMax.toLocaleString()}`,
                        scopeSummary: `${selectedProjectType} (${selectedScale}) with ${selectedModules.length} modules (${selectedModules.join(', ')}). Estimated delivery: ${calculation.weeksMin}-${calculation.weeksMax} weeks.`
                      }
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/25"
                >
                  Book Discovery Call to Lock Scope
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Email Form Toggle or Inline Capture */}
                {submitSuccess ? (
                  <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Scope breakdown dispatched to your email! Our team will follow up within 24 hours.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSaveAndEmail} className="pt-3 border-t border-slate-800/80 space-y-2.5">
                    <p className="text-xs font-semibold text-slate-300">
                      Receive this official estimate breakdown in your inbox:
                    </p>
                    
                    {submitError && (
                      <p className="text-[11px] text-rose-400">{submitError}</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="email"
                        required
                        placeholder="you@company.com *"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-xs transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-transparent rounded-full animate-spin"></div>
                          Dispatching Estimate...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Email Me Formal SOW & Scope Summary
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 text-center leading-relaxed space-y-1">
                <div>
                  Need customized contract structures? Reach our engineering desk on WhatsApp:{' '}
                  <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`} className="text-emerald-400 hover:underline">
                    {whatsappNumber}
                  </a>
                </div>
                <div>
                  Or email your project scope directly to:{' '}
                  <a href={`mailto:${companyEmail}`} className="text-blue-400 hover:underline font-semibold">
                    {companyEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
