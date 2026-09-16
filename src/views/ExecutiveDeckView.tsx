import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, FileText, Share2, CheckCircle2, ShieldCheck, Sparkles, 
  Layers, Cpu, Globe, Smartphone, Printer, ExternalLink, Mail, Phone,
  Building2, Users, Award, Lock, ArrowRight, Eye, RefreshCw, AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { downloadExecutiveDeck, printExecutiveDeck, DeckPdfData } from '../utils/executiveDeckPdf';

interface ExecutiveDeckViewProps {
  settings?: { [key: string]: string };
}

export default function ExecutiveDeckView({ settings = {} }: ExecutiveDeckViewProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const companyName = settings.company_name || 'SaroHub Technologies (Private) Limited';
  const companyEmail = 'mehdi.sarohub@gmail.com';
  const rawWhatsapp = settings.whatsapp || '+92 3430381473';
  const whatsappNumber = rawWhatsapp.includes('+94') ? '+92 3430381473' : rawWhatsapp;

  // Deck Data state
  const [deckData, setDeckData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Focus filter
  const [activeTrack, setActiveTrack] = useState<'all' | 'ai' | 'saas' | 'mobile'>('all');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [includeCaseStudies, setIncludeCaseStudies] = useState(true);
  const [includeGuarantees, setIncludeGuarantees] = useState(true);

  useEffect(() => {
    fetch('/api/deck/data')
      .then(res => res.json())
      .then(data => {
        setDeckData(data);
      })
      .catch(err => {
        console.error('Failed to load live deck data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredPillars = React.useMemo(() => {
    if (!deckData?.core_pillars) return [];
    if (activeTrack === 'ai') {
      return deckData.core_pillars.filter((p: any) => p.title.toLowerCase().includes('ai') || p.title.toLowerCase().includes('automation'));
    }
    if (activeTrack === 'saas') {
      return deckData.core_pillars.filter((p: any) => p.title.toLowerCase().includes('saas') || p.title.toLowerCase().includes('web') || p.title.toLowerCase().includes('custom'));
    }
    if (activeTrack === 'mobile') {
      return deckData.core_pillars.filter((p: any) => p.title.toLowerCase().includes('mobile'));
    }
    return deckData.core_pillars;
  }, [deckData, activeTrack]);

  // Prepare normalized data for the vector PDF generator
  const preparePdfPayload = (): DeckPdfData => {
    return {
      companyName,
      tagline: 'Enterprise Software Architecture • Scaled SaaS Platforms • AI Systems',
      headquarters: deckData?.headquarters || 'Skardu, Gilgit-Baltistan, Pakistan',
      email: companyEmail,
      whatsapp: whatsappNumber,
      phone: deckData?.phone || '+92 355 5866875',
      website: 'https://sarohub.com',
      metrics: deckData?.verified_metrics || [
        { label: 'Projects Delivered', value: '45+', highlight: 'Global clients' },
        { label: 'Enterprise Uptime', value: '99.9%', highlight: 'Production SLA' },
        { label: 'Incubated Ventures', value: '5+', highlight: 'Active spinouts' },
        { label: 'Active Engineers', value: '18+', highlight: 'In-house talent' },
        { label: 'Client Retention', value: '94%', highlight: 'Long-term' },
        { label: 'IP Ownership', value: '100%', highlight: 'Client owns code' }
      ],
      pillars: (filteredPillars && filteredPillars.length > 0) ? filteredPillars : [
        {
          title: 'Custom Software & Enterprise Web Applications',
          description: 'Bespoke operational backbones, high-traffic portals, and cloud microservices engineered for zero single points of failure.'
        },
        {
          title: 'Multi-Tenant SaaS & Digital Products',
          description: 'Scalable subscription platforms with automated billing, tenant partitioning, and distributed cloud computing.'
        },
        {
          title: 'Mobile Applications (iOS & Android)',
          description: 'Fluid native and cross-platform mobile apps with offline synchronization, device hardware integration, and biometric security.'
        },
        {
          title: 'AI Engineering & Cognitive Automation',
          description: 'Generative AI workflows, tailored LLM agents, retrieval-augmented generation (RAG), and intelligent enterprise search.'
        }
      ],
      technologies: [
        { category: 'Frontend & Mobile', stack: 'React, Next.js, React Native, TypeScript, Tailwind, Vite' },
        { category: 'Backend & Cloud', stack: 'Node.js, Express, Python FastAPI, PostgreSQL, Redis, Supabase' },
        { category: 'AI & Cognitive', stack: 'Gemini 2.5, OpenAI GPT-4o, LangChain, Vector Embeddings, RAG' },
        { category: 'DevOps & SRE', stack: 'AWS, GCP Cloud Run, Docker, Cloudflare, CI/CD, Kubernetes' }
      ],
      caseStudies: (deckData?.selected_case_studies || []).map((cs: any) => ({
        title: cs?.title || '',
        client: cs?.client || '',
        category: cs?.category || '',
        solution: cs?.solution || ''
      })),
      guarantees: deckData?.enterprise_guarantees || [
        {
          name: '100% Client IP Ownership',
          detail: 'All git repos, assets, and documentation belong exclusively to the client upon settlement.'
        },
        {
          name: 'Strict Mutual NDA First',
          detail: 'Confidentiality protection executed before technical scoping or architectural disclosures.'
        },
        {
          name: 'OWASP Security Hardening',
          detail: 'End-to-end data encryption, role-based access control, and automated penetration checks.'
        },
        {
          name: 'Post-Launch Hypercare SLA',
          detail: 'Dedicated 30-day warranty, real-time monitoring, and rapid hotfix guarantees.'
        }
      ]
    };
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      const payload = preparePdfPayload();
      const filename = `${companyName.replace(/[^a-zA-Z0-9]/g, '-')}-Executive-Capabilities-Deck.pdf`;
      const success = downloadExecutiveDeck(payload, filename);
      if (success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } else {
        throw new Error('PDF download direct method did not complete');
      }
    } catch (e) {
      console.warn('PDF download fallback to print:', e);
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    try {
      window.print();
    } catch (err) {
      console.error('Print trigger failed:', err);
    } finally {
      setTimeout(() => setIsPrinting(false), 1000);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="min-h-screen py-12 md:py-20" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-main)' }}>
      <SEOHead 
        title={`Executive Capabilities Deck (One-Pager PDF) | ${companyName}`}
        description="Download the official SaroHub Technologies Executive Capabilities Deck. One-page corporate overview, technical infrastructure, verified case studies, and enterprise guarantees."
        canonicalUrl="https://sarohub.com/capabilities"
      />

      {/* Print Specific CSS to ensure clean A4 output if user hits Ctrl+P */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #capabilities-deck-canvas, #capabilities-deck-canvas * {
            visibility: visible;
          }
          #capabilities-deck-canvas {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: #090d16 !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, footer, .no-print, header {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Executive Deck', path: '/capabilities' }]} />

        {/* Page Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <FileText className="w-3.5 h-3.5" />
              Executive Capabilities Deck Generator
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Corporate Capabilities <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">One-Pager</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              Engineered for C-suite executives, investment committees, and technical directors. Customize the focus track and export a high-resolution vector PDF immediately.
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-400" />}
              <span>{copySuccess ? 'Link Copied!' : 'Share Deck'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>{isPrinting ? 'Preparing Print...' : 'Print Deck'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf || loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-lg cursor-pointer ${
                downloadSuccess 
                  ? 'bg-emerald-600 shadow-emerald-600/30' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/25'
              } disabled:opacity-50`}
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Vector PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF One-Pager</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Customization Toolbar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 mb-8 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Focus Track:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Full Overview' },
                { id: 'ai', label: 'AI & Automation' },
                { id: 'saas', label: 'SaaS & Enterprise Web' },
                { id: 'mobile', label: 'Mobile Apps' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTrack(t.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTrack === t.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMetrics}
                onChange={e => setIncludeMetrics(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0"
              />
              Metrics
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCaseStudies}
                onChange={e => setIncludeCaseStudies(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0"
              />
              Case Studies
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGuarantees}
                onChange={e => setIncludeGuarantees(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0"
              />
              Guarantees & SLA
            </label>
          </div>
        </div>

        {/* The Live PDF Canvas (One-Pager Layout) */}
        <div className="overflow-x-auto pb-8">
          <div 
            id="capabilities-deck-canvas"
            ref={deckRef}
            className="w-full max-w-[980px] mx-auto rounded-2xl border border-slate-700/80 bg-[#090d16] text-slate-100 p-8 sm:p-12 shadow-2xl relative overflow-hidden font-sans"
            style={{ minHeight: '1100px' }}
          >
            {/* Subtle background mesh */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Document Header */}
            <div className="border-b border-slate-800 pb-6 mb-8 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                    SaroHub Technologies (Private) Limited
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Executive Capabilities Statement
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enterprise Software Architecture • Scaled SaaS Platforms • AI Systems & Cognitive Automation
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] text-slate-400 space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 shrink-0">
                <p><strong className="text-slate-200">Legal Status:</strong> Incorporated Private Limited</p>
                <p><strong className="text-slate-200">Headquarters:</strong> Skardu, Gilgit-Baltistan, Pakistan</p>
                <p><strong className="text-slate-200">Corporate Email:</strong> {companyEmail}</p>
                <p><strong className="text-slate-200">Executive WhatsApp:</strong> {whatsappNumber}</p>
              </div>
            </div>

            {/* Verified Metrics Ribbon */}
            {includeMetrics && deckData?.verified_metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8 relative z-10">
                {deckData.verified_metrics.map((m: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
                    <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                      {m.value}
                    </p>
                    <p className="text-[11px] font-bold text-slate-200 mt-0.5">{m.label}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{m.highlight}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Core Capability Pillars */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Core Engineering Competencies
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPillars.map((p: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
                    <h4 className="text-xs font-bold text-blue-300 mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack Matrix */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 mb-8 relative z-10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Battle-Tested Technology Ecosystem
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-200 text-[11px] mb-1">Frontend & Mobile</p>
                  <p className="text-slate-400 text-[11px]">React, Next.js, React Native, TypeScript, Tailwind, Vite</p>
                </div>
                <div>
                  <p className="font-bold text-slate-200 text-[11px] mb-1">Backend & Cloud</p>
                  <p className="text-slate-400 text-[11px]">Node.js, Express, Python FastAPI, PostgreSQL, Redis, Supabase</p>
                </div>
                <div>
                  <p className="font-bold text-slate-200 text-[11px] mb-1">AI & Intelligent Systems</p>
                  <p className="text-slate-400 text-[11px]">Gemini 2.5, OpenAI GPT-4o, LangChain, Vector Embeddings, RAG</p>
                </div>
                <div>
                  <p className="font-bold text-slate-200 text-[11px] mb-1">Infrastructure & DevOps</p>
                  <p className="text-slate-400 text-[11px]">AWS, GCP, Docker, Cloudflare, CI/CD Actions, Kubernetes</p>
                </div>
              </div>
            </div>

            {/* Selected Client Case Studies */}
            {includeCaseStudies && deckData?.selected_case_studies && (
              <div className="mb-8 relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Demonstrated Track Record & Solved Challenges
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deckData.selected_case_studies.map((cs: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="text-xs font-bold text-slate-100">{cs.title}</h4>
                        <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          {cs.category}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <p className="text-slate-400">
                          <strong className="text-slate-300">Challenge:</strong> {cs.problem ? cs.problem.substring(0, 100) : 'Modernized legacy system'}...
                        </p>
                        <p className="text-slate-300">
                          <strong className="text-emerald-400">Solved:</strong> {cs.solution ? cs.solution.substring(0, 110) : 'Full stack delivery'}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enterprise Guarantees */}
            {includeGuarantees && deckData?.enterprise_guarantees && (
              <div className="mb-8 relative z-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Enterprise Guarantees & Contractual Commitments
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {deckData.enterprise_guarantees.map((g: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs">
                      <p className="font-bold text-slate-200 text-[11px] mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {g.name}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{g.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Footer & Call to Action */}
            <div className="border-t border-slate-800 pt-6 mt-8 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-200">Ready to discuss your enterprise requirements?</p>
                <p className="text-slate-400 text-[11px]">
                  Book an engineering discovery call: <a href="https://sarohub.com/book" className="text-cyan-400 hover:underline">sarohub.com/book</a>
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>Direct: {whatsappNumber}</span>
                <span>•</span>
                <span>Email: {companyEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
