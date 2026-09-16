import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  CheckCircle2, ArrowRight, ChevronDown, Cpu, Sparkles, Rocket, 
  Code, Globe, Layers, MessageSquare, Shield, Zap, Check, HelpCircle, 
  Send, Phone, Mail, Clock, RefreshCw, Terminal, Star
} from 'lucide-react';
import { getServiceBySlug, SERVICES_DATA, ServiceData } from '../data/seoContent';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { api } from '../api';

export default function ServiceDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const [dbService, setDbService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  // Set of open FAQ indices - all open by default so NO content is hidden inside accordions
  const [openFaqIndices, setOpenFaqIndices] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));

  // Normalize slug lookup
  const cleanSlug = (slug || '').toLowerCase().trim().replace(/^\/|\/$/g, '');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const services = await api.getServices();
        if (!isMounted) return;

        // Match against database records
        const found = services.find((s: any) => {
          if (!s) return false;
          if (String(s.id) === cleanSlug) return true;
          if (s.slug && s.slug.toLowerCase() === cleanSlug) return true;

          // Normalized alphanumeric comparison
          const normDb = (s.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const normTarget = cleanSlug.replace(/[^a-z0-9]/g, '');
          if (normDb && normTarget && normDb === normTarget) return true;

          // Known canonical alias pairs
          const aliasPairs = [
            ['custom-software', 'custom-software-development'],
            ['mobile-development', 'mobile-app-development'],
            ['ecommerce-platforms', 'ecommerce-development'],
            ['crm', 'crm-development'],
            ['digital-solutions', 'digital-solutions-cloud-systems'],
            ['business-automation', 'business-process-automation']
          ];

          for (const [a, b] of aliasPairs) {
            if ((s.slug === a && cleanSlug === b) || (s.slug === b && cleanSlug === a)) {
              return true;
            }
          }

          // Substring match
          if (s.slug && (cleanSlug.includes(s.slug) || s.slug.includes(cleanSlug))) {
            return true;
          }

          return false;
        });

        if (found) {
          setDbService(found);
        }
      } catch (err) {
        console.error('Failed to load dynamic service from API', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    const handleDataUpdated = () => {
      loadData();
    };

    window.addEventListener('sarohub-data-updated', handleDataUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener('sarohub-data-updated', handleDataUpdated);
    };
  }, [cleanSlug]);

  // Lookup base SEO blueprint
  const baseBlueprint = getServiceBySlug(cleanSlug) || (dbService?.slug ? getServiceBySlug(dbService.slug) : undefined);

  // If neither exists after loading, redirect to /services
  if (!loading && !baseBlueprint && !dbService) {
    return <Navigate to="/services" replace />;
  }

  // Loading skeleton state
  if (loading && !baseBlueprint && !dbService) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-cyan-400 font-mono text-sm">
          <RefreshCw className="h-6 w-6 animate-spin text-cyan-400" />
          <span>Loading technical engineering blueprint...</span>
        </div>
      </div>
    );
  }

  // Parse dynamic technologies
  const parsedDbTechs: string[] = Array.isArray(dbService?.technologies)
    ? dbService.technologies
    : (typeof dbService?.technologies === 'string'
      ? dbService.technologies.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []);

  const activeTechnologies = parsedDbTechs.length > 0
    ? parsedDbTechs
    : (baseBlueprint?.technologies || ['TypeScript', 'Node.js', 'React', 'Docker', 'PostgreSQL', 'API Services']);

  // Parse dynamic benefits
  const parsedDbBenefits: string[] = Array.isArray(dbService?.benefits)
    ? dbService.benefits
    : (typeof dbService?.benefits === 'string'
      ? dbService.benefits.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []);

  // Parse dynamic FAQs
  const parsedDbFaqs: Array<{ question: string; answer: string }> = Array.isArray(dbService?.faqs)
    ? dbService.faqs.filter((f: any) => f && f.question && f.answer)
    : [];

  const computedShortTitle = baseBlueprint?.shortTitle || (dbService?.title ? dbService.title.split(' ')[0] + ' ' + (dbService.title.split(' ')[1] || '') : 'Service');

  const activeHeroHeadline = dbService?.hero_headline || dbService?.heroHeadline || baseBlueprint?.heroHeadline || (dbService?.title ? `${dbService.title} Engineered for Enterprise Performance` : 'High-Performance Custom Engineering');

  // Dynamic Operational Problems Solved
  const activeProblemsSolved: string[] = (Array.isArray(dbService?.problems_solved) && dbService.problems_solved.length > 0)
    ? dbService.problems_solved
    : ((Array.isArray(dbService?.problemsSolved) && dbService.problemsSolved.length > 0)
      ? dbService.problemsSolved
      : (baseBlueprint?.problemsSolved && baseBlueprint.problemsSolved.length > 0
        ? baseBlueprint.problemsSolved
        : (parsedDbBenefits.length > 0
          ? parsedDbBenefits
          : [
              'Operational bottlenecks caused by disconnected manual workflows.',
              'System scalability constraints under increasing user demand.',
              'Data silos between internal teams and legacy third-party tools.',
              'Security vulnerabilities and downtime in unmanaged hosting environments.'
            ])));

  // Dynamic Technical Capabilities & Architecture
  const activeCapabilities: Array<{ title: string; description: string }> = (Array.isArray(dbService?.capabilities) && dbService.capabilities.length > 0)
    ? dbService.capabilities
    : (baseBlueprint?.capabilities && baseBlueprint.capabilities.length > 0
      ? baseBlueprint.capabilities
      : [
          {
            title: 'Custom Architecture & Microservices',
            description: 'Scalable, event-driven backend systems and databases engineered for high throughput.'
          },
          {
            title: 'Modern Responsive Frontend Portals',
            description: 'Sub-second rendering, mobile-first interfaces, and intuitive administrative dashboards.'
          },
          {
            title: 'API Middleware & Webhook Integrations',
            description: 'Unified connectors bridging CRM, ERP, payment processors, and messaging platforms.'
          },
          {
            title: 'Cloud Infrastructure & DevOps CI/CD',
            description: 'Automated testing, containerized deployments, and zero-downtime rolling upgrades.'
          },
          {
            title: 'Role-Based Access Control & Security',
            description: 'Granular permissions, OAuth2 authentication, and end-to-end data encryption.'
          },
          {
            title: '24/7 SLA Operations & Telemetry',
            description: 'Proactive error monitoring, performance telemetry, and scheduled data backups.'
          }
        ]);

  // Dynamic Target Organizations & Use Cases
  const activeTargetAudience: string[] = (Array.isArray(dbService?.target_audience) && dbService.target_audience.length > 0)
    ? dbService.target_audience
    : ((Array.isArray(dbService?.targetAudience) && dbService.targetAudience.length > 0)
      ? dbService.targetAudience
      : (baseBlueprint?.targetAudience && baseBlueprint.targetAudience.length > 0
        ? baseBlueprint.targetAudience
        : [
            'Enterprises modernizing core operations and data infrastructure.',
            'Fast-growing venture startups deploying production MVPs.',
            'SaaS organizations scaling multi-tenant application workloads.',
            'Regional businesses automating repetitive back-office tasks.'
          ]));

  // Dynamic Verified Metrics & Benefits
  const activeBusinessBenefits: Array<{ metric: string; label: string; description: string }> = (Array.isArray(dbService?.business_benefits) && dbService.business_benefits.length > 0)
    ? dbService.business_benefits
    : ((Array.isArray(dbService?.businessBenefits) && dbService.businessBenefits.length > 0)
      ? dbService.businessBenefits
      : (baseBlueprint?.businessBenefits && baseBlueprint.businessBenefits.length > 0
        ? baseBlueprint.businessBenefits
        : [
            { metric: '99.99%', label: 'Infrastructure Availability', description: 'Fault-tolerant deployment ensures reliable continuous uptime.' },
            { metric: '3x', label: 'Velocity Multiplier', description: 'Accelerate feature deployment and customer onboarding cycles.' },
            { metric: '100%', label: 'Source Code Ownership', description: 'Full commercial IP transfer and complete technical documentation.' }
          ]));

  // Dynamic Engineering Lifecycle Process Steps
  const activeProcessSteps: Array<{ step: string; title: string; description: string }> = (Array.isArray(dbService?.process_steps) && dbService.process_steps.length > 0)
    ? dbService.process_steps
    : ((Array.isArray(dbService?.processSteps) && dbService.processSteps.length > 0)
      ? dbService.processSteps
      : (baseBlueprint?.processSteps && baseBlueprint.processSteps.length > 0
        ? baseBlueprint.processSteps
        : [
            { step: '01', title: 'Technical Discovery & Scoping', description: 'Map workflows, user personas, database schemas, and integration dependencies.' },
            { step: '02', title: 'System Architecture & UI/UX', description: 'Produce clickable wireframes, component design systems, and API contracts.' },
            { step: '03', title: 'Sprint Engineering & CI/CD', description: 'Build in rapid 2-week milestones with automated regression testing.' },
            { step: '04', title: 'Security Auditing & Hardening', description: 'Perform penetration scans, stress testing, and staging environment verification.' },
            { step: '05', title: 'Production Cutover & SLA Support', description: 'Zero-downtime deployment, DNS provisioning, and continuous maintenance.' }
          ]));

  // Dynamic FAQs
  const activeFaqs: Array<{ question: string; answer: string }> = (Array.isArray(dbService?.faqs) && dbService.faqs.length > 0)
    ? dbService.faqs
    : (baseBlueprint?.faqs && baseBlueprint.faqs.length > 0
      ? baseBlueprint.faqs
      : [
          {
            question: `How quickly can SaroHub begin discovery on a ${computedShortTitle} project?`,
            answer: 'We initiate scoping sessions within 48 hours of initial consultation and typically deliver an architectural roadmap and milestone timeline within 3 to 5 business days.'
          },
          {
            question: 'Do we retain full ownership of the source code and IP?',
            answer: 'Yes. All intellectual property, source repositories, deployment keys, and database schemas are 100% owned by your organization upon project completion.'
          },
          {
            question: 'What post-launch SLA and maintenance support is provided?',
            answer: 'We provide structured post-deployment warranty support, 24/7 server monitoring, proactive security updates, and dedicated engineering retainers for continuous feature iterations.'
          }
        ]);

  // Construct active merged service object
  const activeService: ServiceData = {
    slug: dbService?.slug || baseBlueprint?.slug || cleanSlug,
    title: dbService?.title || baseBlueprint?.title || 'Software Engineering Service',
    shortTitle: computedShortTitle,
    metaTitle: dbService?.meta_title || baseBlueprint?.metaTitle || `${dbService?.title || 'Engineering Service'} | SaroHub Technologies`,
    metaDescription: dbService?.meta_description || dbService?.short_description || baseBlueprint?.metaDescription || dbService?.description || 'Custom engineering solutions built by SaroHub Technologies.',
    category: dbService?.category || baseBlueprint?.category || 'Software Engineering',
    heroHeadline: activeHeroHeadline,
    heroSubheadline: dbService?.short_description || baseBlueprint?.heroSubheadline || dbService?.description || 'Scalable architecture, reliable development, and seamless integrations.',
    iconName: baseBlueprint?.iconName || 'Code',
    bannerImage: dbService?.banner_url || baseBlueprint?.bannerImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200&h=600',
    overview: dbService?.description || baseBlueprint?.overview || dbService?.short_description || 'We engineer high-reliability digital solutions tailored to modern organizational demands.',
    problemsSolved: activeProblemsSolved,
    targetAudience: activeTargetAudience,
    capabilities: activeCapabilities,
    businessBenefits: activeBusinessBenefits,
    technologies: activeTechnologies,
    processSteps: activeProcessSteps,
    relevantProjectSlugs: baseBlueprint?.relevantProjectSlugs || ['waziri-mobile', 'vanguard-erp-systems', 'the-crescent-resorts'],
    relatedServiceSlugs: baseBlueprint?.relatedServiceSlugs || ['web-development', 'custom-software-development', 'saas-development', 'digital-solutions'],
    faqs: activeFaqs
  };

  // Keep all FAQs open by default so no content is hidden inside accordions
  useEffect(() => {
    if (activeService.faqs && activeService.faqs.length > 0) {
      setOpenFaqIndices(new Set(activeService.faqs.map((_, idx) => idx)));
    }
  }, [cleanSlug, activeService.faqs?.length]);

  const toggleFaq = (index: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    setOpenFaqIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const allFaqsOpen = activeService.faqs.length > 0 && openFaqIndices.size === activeService.faqs.length;

  const toggleAllFaqs = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (allFaqsOpen) {
      setOpenFaqIndices(new Set());
    } else {
      setOpenFaqIndices(new Set(activeService.faqs.map((_, idx) => idx)));
    }
  };

  // Structured Data Schema for Service & FAQ (memoized to prevent re-render loops)
  const structuredData = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: activeService.title,
      description: activeService.overview,
      provider: {
        '@type': 'Organization',
        name: 'SaroHub Technologies (Private) Limited',
        url: 'https://sarohub.com'
      },
      areaServed: 'Worldwide',
      serviceType: activeService.category,
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        price: 'Contact for Architecture & Scoping'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: activeService.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  ], [activeService.title, activeService.overview, activeService.category, activeService.faqs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <SEOHead
        title={activeService.metaTitle}
        description={activeService.metaDescription}
        canonicalUrl={`https://sarohub.com/services/${activeService.slug}`}
        ogType="website"
        ogImage={activeService.bannerImage}
        structuredData={structuredData}
      />

      {/* Top Breadcrumb Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Services', url: '/services' },
              { name: activeService.shortTitle, url: `/services/${activeService.slug}`, isCurrent: true }
            ]}
          />

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-800/40">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Active Enterprise Blueprint</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                {activeService.heroHeadline}
              </h1>
              
              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                {activeService.heroSubheadline}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={`/contact?service=${encodeURIComponent(activeService.title)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Request Technical Scoping</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                
                <a
                  href="#capabilities"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all cursor-pointer"
                >
                  Explore Capabilities
                </a>
              </div>

              {/* Verified Metrics Strip */}
              <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
                {activeService.businessBenefits.map((b, i) => (
                  <div key={i} className="space-y-1">
                    <span className="block font-display text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
                      {b.metric}
                    </span>
                    <span className="block text-xs font-semibold text-slate-300">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Banner Image / Media */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
                <img
                  src={activeService.bannerImage}
                  alt={`${activeService.title} architectural blueprint`}
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                      Enterprise Engineering SLA
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      SaroHub Core
                    </span>
                  </div>
                  <span className="block text-xs text-slate-300 leading-relaxed">
                    Production-grade software engineering, secure tenant data isolation, and verified operational benchmarks.
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Service Overview & Problem Solving */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                What is {activeService.title}?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {activeService.overview}
              </p>

              {/* Dynamic Benefits Highlight if available */}
              {parsedDbBenefits.length > 0 && (
                <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/30 space-y-3">
                  <h4 className="font-display text-xs font-bold font-mono uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <Star className="h-3.5 w-3.5 text-cyan-400" /> Core Strategic Advantages
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {parsedDbBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="pt-4">
                <h3 className="font-display text-lg font-bold text-white mb-4">
                  Target Organizations & Use Cases
                </h3>
                <ul className="space-y-3">
                  {activeService.targetAudience.map((audience, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="p-1 rounded-md bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span>{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                Operational Problems We Eliminate
              </h3>
              
              <div className="space-y-4">
                {activeService.problemsSolved.map((problem, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded shrink-0">
                      #{i + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {problem}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="capabilities" className="py-20 border-b border-slate-800/80 bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              Engineering Matrix
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Technical Capabilities & Architecture
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Modular, scalable components engineered to integrate into your existing tech stack with zero disruption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeService.capabilities.map((cap, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 hover:border-cyan-500/30 transition-all hover:bg-slate-900"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  {cap.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Technologies We Use */}
      <section className="py-16 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Technologies & Frameworks Deployed
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Modern, reliable software engineering stacks prioritizing security, developer velocity, and speed.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {activeService.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 border border-slate-800 text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Process */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
              Delivery Methodology
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Our 5-Stage Engineering Lifecycle
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {activeService.processSteps.map((step, i) => (
              <div
                key={i}
                className="relative rounded-2xl bg-slate-950 border border-slate-800/80 p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-2xl font-black text-cyan-400 block mb-3">
                    {step.step}
                  </span>
                  <h3 className="font-display text-sm font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
                <HelpCircle className="h-3.5 w-3.5" /> Technical FAQ & Engineering Details
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Frequently Asked Questions About {activeService.shortTitle}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                Transparent answers covering architecture, device hardware, data privacy, and production SLAs.
              </p>
            </div>

            {activeService.faqs.length > 0 && (
              <button
                type="button"
                onClick={toggleAllFaqs}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 border border-slate-700/80 text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <span>{allFaqsOpen ? 'Collapse All' : 'Expand All'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                  {openFaqIndices.size}/{activeService.faqs.length} Open
                </span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {activeService.faqs.map((faq, i) => {
              const isOpen = openFaqIndices.has(i);
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all ${
                    isOpen 
                      ? 'border-cyan-500/40 bg-slate-900/90 shadow-lg shadow-cyan-950/20' 
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  } overflow-hidden`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-cyan-950/90 border border-cyan-800/60 text-cyan-400 shrink-0 mt-0.5">
                        Q{i + 1}
                      </span>
                      <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block">
                        {isOpen ? 'Visible' : 'Hidden'}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-cyan-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 pt-0 border-t border-slate-800/60 bg-slate-950/40">
                      <div className="flex items-start gap-3 mt-4">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/50 text-blue-400 shrink-0 mt-0.5">
                          ANS
                        </span>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Conversion CTA Footer */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Architect Your {activeService.shortTitle} Solution?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Schedule an architectural scoping consultation with our engineering directors. We analyze your requirements and deliver a comprehensive technical roadmap.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`/contact?service=${encodeURIComponent(activeService.title)}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-4 text-sm font-bold text-slate-950 transition-all shadow-xl hover:shadow-cyan-500/20 cursor-pointer"
            >
              <span>Schedule Scoping Session</span>
              <Send className="h-4 w-4" />
            </Link>
            
            <a
              href="mailto:info@sarohub.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-6 py-4 text-sm font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>info@sarohub.com</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
