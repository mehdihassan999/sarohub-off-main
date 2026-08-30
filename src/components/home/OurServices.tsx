import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, Globe, Cpu, Code, ArrowRight, X, CheckCircle2, 
  Sparkles, Layers, MessageSquare, ChevronRight, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesProps {
  services: any[];
}

// Fallback services in case API has no items yet
const fallbackServices = [
  {
    id: 1,
    title: 'Enterprise Software & Cloud Systems',
    slug: 'enterprise-software-cloud',
    banner_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450',
    short_description: 'Designing resilient microservices, elastic database arrays, and high-availability enterprise architectures.',
    description: 'We engineer complex backend frameworks and highly-scalable cloud infrastructure. Our systems are trusted by financial institutions and large-scale manufacturing grids to process billions of operations with five-nines uptime.',
    benefits: [
      '99.999% Service Level Agreement (SLA) reliability',
      'Auto-scaling Kubernetes deployment architecture',
      'Advanced database sharding and low-latency read arrays',
      'Military-grade end-to-end payload encryption standards'
    ],
    technologies: ['MySQL', 'Node.js', 'TypeScript', 'Kubernetes', 'Docker', 'Google Cloud Platform'],
    faqs: [
      {
        question: 'What database structures do you implement?',
        answer: 'We specialize in normalized high-throughput relational structures, including MySQL/MariaDB and distributed transactional databases.'
      }
    ]
  },
  {
    id: 2,
    title: 'Cognitive Computing & Advanced AI',
    slug: 'cognitive-computing-ai',
    banner_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800&h=450',
    short_description: 'Implementing custom LLM alignments, predictive modeling pipelines, and computer vision neural grids.',
    description: 'Unlock enterprise automation through state-of-the-art artificial intelligence. We build custom retrieval-augmented generation (RAG) models, automated compliance agents, and sensory vision algorithms tailored to specialized industries.',
    benefits: [
      'Up to 85% operational efficiency gains in core compliance pipelines',
      'Robust secure vector indexing protecting proprietary corporate data',
      'Explainable AI metrics with detailed telemetry frameworks',
      'Sub-150ms inferencing latency on private enterprise hardware clusters'
    ],
    technologies: ['Python', 'Gemini API', 'TensorFlow', 'PyTorch', 'Vector Databases', 'Node.js'],
    faqs: [
      {
        question: 'Are our enterprise models safe from public training?',
        answer: 'Absolutely. All models are trained on completely isolated VPC arrays with strict parameters prohibiting public leakage.'
      }
    ]
  },
  {
    id: 3,
    title: 'Modern Web & Mobile Platforms',
    slug: 'web-mobile-products',
    banner_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450',
    short_description: 'We create modern web and mobile experiences that combine thoughtful product design, reliable engineering, and scalable technology.',
    description: 'We create tailored digital experiences combining intuitive interaction design with robust, scalable engineering. From high-conversion SaaS dashboards to cross-platform mobile apps, our solutions deliver unmatched speed, accessibility, and reliability.',
    benefits: [
      'Sub-second load times & Google Core Web Vitals optimization',
      'Native-grade cross-platform mobile performance for iOS & Android',
      'Accessible, modern design systems built for enterprise scaling',
      'Seamless RESTful & GraphQL API integration'
    ],
    technologies: ['React', 'TypeScript', 'React Native', 'Tailwind CSS', 'Next.js'],
    faqs: [
      {
        question: 'Do you offer ongoing support after launch?',
        answer: 'Yes, we provide dedicated maintenance, performance monitoring, and continuous deployment support.'
      }
    ]
  },
];

// Helper to safely parse array or comma-delimited strings
const parseArrayField = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field.map(f => String(f).trim()).filter(Boolean);
  if (typeof field === 'string') {
    return field.split(/[,|•\n]/).map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// Fallback banner image based on title keywords
const getDefaultBanner = (title: string = '') => {
  const t = title.toLowerCase();
  if (t.includes('ai') || t.includes('intelligent') || t.includes('cognitive') || t.includes('machine')) {
    return 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800&h=450';
  }
  if (t.includes('web') || t.includes('mobile') || t.includes('app') || t.includes('platform')) {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450';
  }
  return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450';
};

export default function OurServices({ services }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<any | null>(null);

  // Helper to dynamically match icons to service titles
  const getServiceIcon = (title: string = '') => {
    const t = title.toLowerCase();
    if (t.includes('ai') || t.includes('intelligent') || t.includes('machine') || t.includes('cognitive')) return Cpu;
    if (t.includes('web') || t.includes('mobile')) return Globe;
    if (t.includes('software') || t.includes('platform') || t.includes('digital') || t.includes('cloud')) return Code;
    return Rocket;
  };

  // Close modal on Escape key and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedService(null);
    };

    if (selectedService) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedService]);

  // Use API services when available, otherwise fall back to hardcoded cards
  const displayServices = services && services.length > 0 ? services : fallbackServices;

  return (
    <section 
      id="services-grid" 
      className="py-24 relative overflow-hidden border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="absolute top-1/4 right-0 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
            Capabilities & Solutions
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
            style={{ color: 'var(--text-main)' }}
          >
            What We Build.
          </h2>
          <p 
            className="mt-4 text-sm font-medium leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            From venture building to technology partnerships, we build products and solutions that solve real problems and create long-term value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((item, idx) => {
            const Icon = getServiceIcon(item.title);
            const bannerSrc = item.banner_url || getDefaultBanner(item.title);
            const techList = parseArrayField(item.technologies);

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl border overflow-hidden transition-all duration-300 group flex flex-col justify-between premium-card-hover shadow-sm hover:shadow-xl"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-app)' 
                }}
              >
                <div>
                  {/* Banner Image with Fallback & Overlays */}
                  <div 
                    className="h-48 w-full overflow-hidden relative cursor-pointer border-b"
                    style={{ borderColor: 'var(--border-app)', backgroundColor: 'var(--bg-app)' }}
                    onClick={() => setSelectedService(item)}
                  >
                    <img
                      src={bannerSrc}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getDefaultBanner(item.title);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    
                    {/* Header Badges over Banner */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 bg-blue-600/90 backdrop-blur border border-blue-400/40 rounded-xl items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                        <Icon className="h-5 w-5 stroke-[1.8]" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 backdrop-blur border border-white/15 text-slate-200 shadow-sm">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 
                        onClick={() => setSelectedService(item)}
                        className="font-display text-lg font-bold group-hover:text-blue-400 transition-colors cursor-pointer"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {item.title}
                      </h3>
                      <p 
                        className="mt-2.5 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium"
                        style={{ color: 'var(--text-body)' }}
                      >
                        {item.short_description || item.description}
                      </p>
                    </div>

                    {/* Micro Tech Tags */}
                    {techList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {techList.slice(0, 4).map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="text-[9px] font-bold rounded px-2.5 py-1 uppercase tracking-wider border"
                            style={{ 
                              backgroundColor: 'var(--bg-app)', 
                              borderColor: 'var(--border-app)',
                              color: 'var(--text-body)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {techList.length > 4 && (
                          <span
                            className="text-[9px] font-bold rounded px-2 py-1 uppercase tracking-wider border text-blue-400"
                            style={{ 
                              backgroundColor: 'var(--bg-app)', 
                              borderColor: 'var(--border-app)' 
                            }}
                          >
                            +{techList.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Footer */}
                <div className="px-6 pb-6 pt-2 border-t flex justify-end" style={{ borderColor: 'var(--border-app)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedService(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 group/btn cursor-pointer py-1"
                  >
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SERVICE DETAIL MODAL */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
            {/* Click-outside backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl border overflow-hidden shadow-2xl z-10 my-auto flex flex-col max-h-[90vh]"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)',
                color: 'var(--text-main)'
              }}
            >
              {/* Modal Banner Header */}
              <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={selectedService.banner_url || getDefaultBanner(selectedService.title)}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getDefaultBanner(selectedService.title);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/60 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 transition-all cursor-pointer z-20"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Banner Content Title & Icon */}
                <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4">
                  {(() => {
                    const Icon = getServiceIcon(selectedService.title);
                    return (
                      <div className="flex h-12 w-12 sm:h-14 sm:w-14 bg-blue-600 border border-blue-400/50 rounded-2xl items-center justify-center text-white shadow-xl shrink-0">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7 stroke-[1.8]" />
                      </div>
                    );
                  })()}
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase text-blue-300 bg-blue-900/60 backdrop-blur px-2.5 py-0.5 rounded-full border border-blue-400/30 mb-1">
                      Enterprise Service
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-tight truncate">
                      {selectedService.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Modal Body Scroll Area */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                {/* Short Overview */}
                {selectedService.short_description && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-1.5">
                      Overview
                    </h4>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-body)' }}>
                      {selectedService.short_description}
                    </p>
                  </div>
                )}

                {/* Detailed Technical Copy */}
                {selectedService.description && selectedService.description !== selectedService.short_description && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-1.5">
                      Technical Architecture & Scope
                    </h4>
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-body)' }}>
                      {selectedService.description}
                    </p>
                  </div>
                )}

                {/* Benefits / Key Advantages */}
                {(() => {
                  const benefits = parseArrayField(selectedService.benefits);
                  if (benefits.length === 0) return null;
                  return (
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                        Key Capabilities & Enterprise Value
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {benefits.map((benefit: string, bIdx: number) => (
                          <div
                            key={bIdx}
                            className="flex items-start gap-2.5 p-3 rounded-xl border text-xs font-medium"
                            style={{
                              backgroundColor: 'var(--bg-app)',
                              borderColor: 'var(--border-app)',
                              color: 'var(--text-main)'
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Technologies Stack */}
                {(() => {
                  const techs = parseArrayField(selectedService.technologies);
                  if (techs.length === 0) return null;
                  return (
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-blue-400" />
                        Core Frameworks & Tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {techs.map((tech: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg border uppercase tracking-wider"
                            style={{
                              backgroundColor: 'var(--bg-app)',
                              borderColor: 'var(--border-app)',
                              color: 'var(--text-main)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* FAQs if available */}
                {selectedService.faqs && Array.isArray(selectedService.faqs) && selectedService.faqs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
                      Frequently Asked Questions
                    </h4>
                    <div className="space-y-3">
                      {selectedService.faqs.map((faq: any, fIdx: number) => (
                        <div
                          key={fIdx}
                          className="p-4 rounded-xl border space-y-1.5"
                          style={{
                            backgroundColor: 'var(--bg-app)',
                            borderColor: 'var(--border-app)'
                          }}
                        >
                          <h5 className="text-xs font-bold text-white">{faq.question}</h5>
                          <p className="text-xs font-medium" style={{ color: 'var(--text-body)' }}>{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions Footer */}
              <div 
                className="p-4 sm:p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0"
                style={{
                  backgroundColor: 'var(--bg-app)',
                  borderColor: 'var(--border-app)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl border hover:bg-white/5 transition-colors cursor-pointer order-2 sm:order-1"
                  style={{
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-body)'
                  }}
                >
                  Close
                </button>
                <Link
                  to={`/contact?service=${encodeURIComponent(selectedService.title)}`}
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all cursor-pointer order-1 sm:order-2"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Consult Our Team on this Service
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
