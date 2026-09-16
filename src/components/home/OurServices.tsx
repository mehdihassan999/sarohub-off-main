import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, Globe, Cpu, Code, ArrowRight, X, CheckCircle2, 
  Sparkles, Layers, MessageSquare, ChevronRight, HelpCircle,
  Palette, PenTool, TrendingUp, Smartphone, ShoppingBag, Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesProps {
  services: any[];
}

// Fallback services with professional imagery and complete specifications
const fallbackServices = [
  {
    id: 1,
    title: 'Custom Software Development',
    slug: 'custom-software',
    category: 'Enterprise Engineering',
    banner_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Enterprise architecture, bespoke software systems, and high-performance workflow platforms tailored to your business operations.',
    description: 'We build custom software systems designed around your unique operational needs. From internal management portals to automated workflow engines, our applications are reliable, secure, and built to scale with your business.',
    benefits: [
      'Tailored to your exact business logic and workflows',
      'Scalable architecture built for reliable performance',
      'Seamless integration with third-party APIs and services',
      'Clean code standards with full documentation and support'
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Google Cloud'],
    faqs: [
      {
        question: 'How do you ensure the software meets our requirements?',
        answer: 'We begin with structured scoping and prototyping, followed by regular milestone reviews and transparent communication throughout development.'
      }
    ]
  },
  {
    id: 2,
    title: 'Web Application Development',
    slug: 'web-development',
    category: 'Web Engineering',
    banner_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Fast, secure, responsive web applications engineered with modern frontend frameworks, server-side APIs, and microservices.',
    description: 'We engineer high-performance web applications that combine snappy user interfaces with resilient backend architectures. Built with React, TypeScript, and modern API protocols.',
    benefits: [
      'Sub-second page rendering and high Lighthouse performance scores',
      'Responsive, ergonomic user interfaces optimized across all viewports',
      'Role-based access control and encrypted session management',
      'SEO-friendly semantic markup and Core Web Vitals optimization'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'PostgreSQL'],
    faqs: [
      {
        question: 'Can you modernize our existing web portal or rewrite legacy code?',
        answer: 'Yes. We perform architectural audits, modernize legacy codebases, and migrate monolithic applications to high-velocity modern tech stacks.'
      }
    ]
  },
  {
    id: 3,
    title: 'Mobile App Development',
    slug: 'mobile-development',
    category: 'Mobile Solutions',
    banner_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Native & cross-platform iOS and Android mobile apps crafted with fluid animations, offline synchronization, and push notifications.',
    description: 'We design and develop high-performance mobile applications that users love. Leveraging modern frameworks like React Native and Flutter, we deliver synchronized multi-platform applications.',
    benefits: [
      'Native-grade 60fps performance on both iOS and Android',
      'Offline caching and resilient local data synchronization',
      'Deep device API integration: Biometrics, GPS, Camera, Push Alerts',
      'App Store and Google Play compliance and deployment handling'
    ],
    technologies: ['React Native', 'Flutter', 'TypeScript', 'iOS', 'Android', 'Firebase'],
    faqs: [
      {
        question: 'Do you build for both iOS and Android simultaneously?',
        answer: 'Yes. Our cross-platform engineering approach allows up to 90% shared business logic between iOS and Android, dramatically reducing cost and time-to-market.'
      }
    ]
  },
  {
    id: 4,
    title: 'SaaS Product Development',
    slug: 'saas-development',
    category: 'Cloud Products',
    banner_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Multi-tenant cloud subscription products with automated billing, tenant isolation, scalable database clusters, and admin portals.',
    description: 'We architect and build end-to-end Software-as-a-Service (SaaS) products, including multi-tenant databases, Stripe billing integrations, organization management, and cloud infrastructure.',
    benefits: [
      'Secure multi-tenant data architecture and role permissions',
      'Automated subscription billing, invoicing, and customer onboarding',
      'High-availability cloud hosting with automated database backups',
      'Modular code structure ready for rapid feature releases'
    ],
    technologies: ['Node.js', 'React', 'PostgreSQL', 'Stripe', 'Google Cloud', 'Docker', 'Redis'],
    faqs: [
      {
        question: 'Can you help turn our product concept into a launchable SaaS MVP?',
        answer: 'Yes. We handle everything from tenant schema design and UI/UX flows to automated subscription billing and production deployment.'
      }
    ]
  },
  {
    id: 5,
    title: 'AI & Automation Solutions',
    slug: 'ai-automation',
    category: 'Artificial Intelligence',
    banner_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Custom AI integration, autonomous agents, neural document parsing, and workflow automation that eliminate operational bottlenecks.',
    description: 'We help businesses leverage artificial intelligence practically. From custom conversational assistants to automated document processing and predictive workflows, our AI solutions deliver measurable efficiency.',
    benefits: [
      'Automate repetitive workflows to save time and reduce errors',
      'Private, secure AI models tailored to your business data',
      'Seamless integration with your existing CRM and software tools',
      'Actionable analytics and measurable operational impact'
    ],
    technologies: ['Python', 'Gemini API', 'TypeScript', 'Node.js', 'Vector DB', 'Cloud Run'],
    faqs: [
      {
        question: 'Is our company data kept private and secure?',
        answer: 'Yes. All AI integrations strictly respect enterprise privacy standards and process information securely without sharing it with public training pools.'
      }
    ]
  },
  {
    id: 6,
    title: 'E-Commerce Platforms',
    slug: 'ecommerce-platforms',
    category: 'Digital Commerce',
    banner_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Scalable digital storefronts, multi-currency payment checkout, live inventory synchronization, and courier logistics integrations.',
    description: 'We build high-converting e-commerce platforms engineered for high transaction concurrency, seamless payment gateways, and real-time inventory management across warehouses.',
    benefits: [
      'Single-page friction-free checkout with high conversion velocity',
      'Real-time multi-channel inventory synchronization with POS systems',
      'Stripe, PayPal, and regional payment gateway integrations',
      'Automated order invoicing, shipping labels, and courier tracking'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'Redis Caching', 'Tailwind CSS'],
    faqs: [
      {
        question: 'Can you integrate our online store with our physical store POS system?',
        answer: 'Yes. We build two-way synchronization engines that update stock quantities in real time whether a purchase happens in-store or online.'
      }
    ]
  },
  {
    id: 7,
    title: 'Digital Solutions & Cloud Systems',
    slug: 'digital-solutions',
    category: 'Cloud & Infrastructure',
    banner_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Modernize legacy infrastructure, migrate on-premise servers to resilient cloud grids, and automate operational workflows.',
    description: 'We engineer secure digital platforms, migrate legacy infrastructure to resilient cloud grids on AWS and Google Cloud, and connect distributed teams through unified software.',
    benefits: [
      'Cloud deployment on AWS, Google Cloud, or dedicated Linux VPS',
      'Automated CI/CD deployment pipelines with zero downtime',
      'System health monitoring, log aggregation, and error alerting',
      'Database replication, automated backups, and disaster recovery'
    ],
    technologies: ['Google Cloud', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Terraform', 'Linux'],
    faqs: [
      {
        question: 'How do you ensure zero downtime during legacy system migration?',
        answer: 'We execute phased parallel runs with continuous bidirectional database replication and automated rollback safeguards.'
      }
    ]
  },
  {
    id: 8,
    title: 'UI/UX Design & Product Prototyping',
    slug: 'ui-ux-design',
    category: 'Product Design',
    banner_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Human-centric UI/UX design, interactive Figma prototypes, user research, and scalable design systems that make digital products effortless.',
    description: 'Exceptional software begins with empathy for the user. SaroHub Technologies designs intuitive digital interfaces, comprehensive design systems, and rapid interactive prototypes. We conduct in-depth user research, wireframe user journeys, and refine every micro-interaction to deliver digital products that delight users and drive conversions.',
    benefits: [
      'User journey mapping, behavioral research, and heuristic evaluation',
      'Interactive clickable prototypes in Figma for rapid stakeholder validation',
      'Scalable token-based design systems matching modern frontend frameworks',
      'WCAG accessibility compliance and pixel-perfect developer handoff'
    ],
    technologies: ['Figma', 'FigJam', 'Adobe XD', 'Principle', 'Design Systems', 'Tailwind CSS', 'Miro', 'Hotjar'],
    faqs: [
      {
        question: 'Can we hire SaroHub for UI/UX design before engineering starts?',
        answer: 'Yes, absolutely. Designing wireframes and clickable prototypes beforehand validates product concepts, minimizes development revisions, and clarifies project scope.'
      }
    ]
  },
  {
    id: 9,
    title: 'Graphic Designing & Brand Identity',
    slug: 'graphic-design',
    category: 'Creative & Branding',
    banner_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'End-to-end visual branding, logo design, marketing collateral, vector illustration, and digital assets crafted for unforgettable brand recognition.',
    description: 'Your visual identity is the primary handshake between your business and the market. SaroHub Technologies crafts bespoke corporate identities, vector illustration systems, marketing collateral, and digital promotional assets that communicate trust, modernity, and category leadership.',
    benefits: [
      'Complete brand identity systems: logos, typography scales, and custom color palettes',
      'Comprehensive corporate brand guidelines documentation for consistent execution',
      'High-impact social media creatives, ad assets, and digital marketing templates',
      'Print-ready promotional collateral: corporate brochures, business cards, and packaging'
    ],
    technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'After Effects', 'Figma', 'Vector Typography', 'Brand Guidelines'],
    faqs: [
      {
        question: 'What file formats will we receive for our logo and branding?',
        answer: 'You will receive full vector master files (.AI, .EPS, .SVG, .PDF) scalable to any size without loss of quality, along with web-optimized formats (.PNG, .WEBP, .JPG), favicons, and social avatar kits.'
      }
    ]
  },
  {
    id: 10,
    title: 'Digital Marketing & Growth Strategy',
    slug: 'digital-marketing',
    category: 'Growth & Marketing',
    banner_url: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=1200&h=600',
    short_description: 'Full-funnel digital marketing services: Technical SEO, Google & Meta Ads, conversion rate optimization (CRO), and content strategy to acquire qualified leads.',
    description: 'SaroHub Technologies provides data-driven digital marketing and growth engineering services. We combine technical search engine optimization (SEO), high-converting pay-per-click (PPC) advertising across Google and Meta, email funnel automation, and behavioral conversion rate optimization to turn digital impressions into loyal paying customers.',
    benefits: [
      'Data-driven search engine optimization (Technical, On-Page & Local SEO)',
      'Targeted Google Ads, Search, Display & Meta PPC campaigns managed for high ROAS',
      'Conversion Rate Optimization (CRO) & A/B testing across landing pages and sales funnels',
      'Automated email nurturing sequences, lead scoring, and lifecycle marketing retention'
    ],
    technologies: ['Google Ads', 'Meta Business Suite', 'Google Analytics 4', 'Google Tag Manager', 'SEMrush', 'Ahrefs', 'HubSpot', 'Mailchimp'],
    faqs: [
      {
        question: 'How soon can we expect results from digital marketing campaigns?',
        answer: 'Paid advertising campaigns begin generating traffic and lead inquiries within 48 to 72 hours. Organic SEO compounds over 60 to 90 days into a lasting inbound growth channel.'
      }
    ]
  }
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
    return 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=1200&h=600';
  }
  if (t.includes('ui') || t.includes('ux') || t.includes('figma') || t.includes('prototype')) {
    return 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=1200&h=600';
  }
  if (t.includes('graphic') || t.includes('brand') || t.includes('logo') || t.includes('creative')) {
    return 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200&h=600';
  }
  if (t.includes('market') || t.includes('seo') || t.includes('growth') || t.includes('ad') || t.includes('campaign')) {
    return 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=1200&h=600';
  }
  if (t.includes('mobile') || t.includes('ios') || t.includes('android')) {
    return 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200&h=600';
  }
  if (t.includes('saas') || t.includes('subscription')) {
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600';
  }
  if (t.includes('commerce') || t.includes('shop') || t.includes('retail') || t.includes('store')) {
    return 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200&h=600';
  }
  if (t.includes('cloud') || t.includes('devops') || t.includes('server') || t.includes('infrastruct')) {
    return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200&h=600';
  }
  if (t.includes('web')) {
    return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200&h=600';
  }
  return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=600';
};

export default function OurServices({ services }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Helper to dynamically match icons to service titles
  const getServiceIcon = (title: string = '', category: string = '') => {
    const t = `${title} ${category}`.toLowerCase();
    if (t.includes('ai') || t.includes('intelligent') || t.includes('machine') || t.includes('cognitive')) return Cpu;
    if (t.includes('ui') || t.includes('ux') || t.includes('prototype') || t.includes('wireframe')) return Palette;
    if (t.includes('graphic') || t.includes('brand') || t.includes('logo') || t.includes('creative')) return PenTool;
    if (t.includes('market') || t.includes('seo') || t.includes('growth') || t.includes('ad')) return TrendingUp;
    if (t.includes('mobile') || t.includes('ios') || t.includes('android')) return Smartphone;
    if (t.includes('commerce') || t.includes('shop') || t.includes('store')) return ShoppingBag;
    if (t.includes('cloud') || t.includes('server') || t.includes('devops') || t.includes('infrastruct')) return Cloud;
    if (t.includes('saas')) return Layers;
    if (t.includes('web')) return Globe;
    if (t.includes('software') || t.includes('platform')) return Code;
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

  // Category filter tabs
  const categoryFilters = [
    { id: 'all', label: 'All Services' },
    { id: 'software', label: 'Software & Web' },
    { id: 'cloud-ai', label: 'AI & Cloud' },
    { id: 'design', label: 'UI/UX & Creative' },
    { id: 'marketing', label: 'Marketing & Growth' }
  ];

  const matchesCategory = (item: any, catId: string) => {
    if (catId === 'all') return true;
    const text = `${item.title || ''} ${item.category || ''} ${item.slug || ''}`.toLowerCase();
    if (catId === 'software') {
      return text.includes('software') || text.includes('web') || text.includes('mobile') || text.includes('saas') || text.includes('commerce');
    }
    if (catId === 'cloud-ai') {
      return text.includes('ai') || text.includes('automation') || text.includes('cloud') || text.includes('digital solutions');
    }
    if (catId === 'design') {
      return text.includes('ui') || text.includes('ux') || text.includes('graphic') || text.includes('design') || text.includes('brand');
    }
    if (catId === 'marketing') {
      return text.includes('market') || text.includes('seo') || text.includes('growth') || text.includes('advertising') || text.includes('conversion');
    }
    return true;
  };

  const filteredServices = displayServices.filter(item => matchesCategory(item, activeCategory));

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
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
            Our Services
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-4"
            style={{ color: 'var(--text-main)' }}
          >
            End-to-End Digital & Engineering Services.
          </h2>
          <p 
            className="mt-3 text-sm font-medium leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            From bespoke software and scalable cloud architecture to human-centric UI/UX, distinctive brand identity, and high-ROAS digital marketing.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categoryFilters.map(cat => {
            const count = displayServices.filter(item => matchesCategory(item, cat.id)).length;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20 scale-102' 
                    : 'bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-700/50 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((item, idx) => {
            const Icon = getServiceIcon(item.title, item.category);
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
                <div className="px-6 pb-6 pt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-app)' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedService(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 cursor-pointer py-1"
                  >
                    Quick View
                  </button>
                  <Link
                    to={`/services/${item.slug || item.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 group/btn cursor-pointer py-1"
                  >
                    Full Details
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
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
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl border hover:bg-white/5 transition-colors cursor-pointer order-3 sm:order-1"
                  style={{
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-body)'
                  }}
                >
                  Close
                </button>
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                  <Link
                    to={`/services/${selectedService.slug || selectedService.id}`}
                    onClick={() => setSelectedService(null)}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Full Service Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to={`/contact?service=${encodeURIComponent(selectedService.title)}`}
                    onClick={() => setSelectedService(null)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Consult Our Team</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
