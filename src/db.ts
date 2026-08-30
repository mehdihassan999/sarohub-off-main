import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { 
  Service, Project, Product, SaleProject, Blog, BlogCategory, BlogTag, 
  Event, Career, Application, TeamMember, Testimonial, FAQ, 
  ContactMessage, NewsletterSubscriber, SEOSettings, ActivityLog,
  ChatSession, Opportunity, OpportunityApplication, EventRegistration, Partner, StudentProject, Venture,
  HeroSectionSettings, CompanyMetric, WhySaroHubItem, IndustrySolution, CaseStudy, ProcessStep, TechStackItem, SecurityStandard, CompanyTimelineItem, Lead, MediaItem
} from './types';

const DB_FILE = path.join(process.cwd(), 'db.json');

// export interface DBState {
//   admin: {
//     id: number;
//     username: string;
//     email: string;
//     password_hash: string;
//     full_name: string;
//     profile_pic: string;
//     bio: string;
//     role: string;
//   };
//   seo_settings: SEOSettings[];
//   services: Service[];
//   projects: Project[];
//   products: Product[];
//   sale_projects: SaleProject[];
//   blog_categories: BlogCategory[];
//   blog_tags: BlogTag[];
//   blogs: Blog[];
//   events: Event[];
//   careers: Career[];
//   applications: Application[];
//   team_members: TeamMember[];
//   testimonials: Testimonial[];
//   faqs: FAQ[];
//   contact_messages: ContactMessage[];
//   newsletter_subscribers: NewsletterSubscriber[];
//   activity_logs: ActivityLog[];
//   settings: { [key: string]: string };
//   chat_sessions: ChatSession[];
//   opportunities: Opportunity[];
//   opportunity_applications: OpportunityApplication[];
//   event_registrations: EventRegistration[];
//   agent_availability: 'online' | 'away' | 'offline';
// }

// // Default/Initial Seed Data for Enterprise Look
// const INITIAL_DB: DBState = {
//   admin: {
//     id: 1,
//     username: 'admin',
//     email: 'cyberm0101noirhat@gmail.com',
//     password_hash: '$2a$10$tZ9B2z2.L.a8g.tY21tWSeQY0E2yqF5BfeHym6t.y8Xz/V10Yp7gS', // SaroHub@Admin2026!
//     full_name: 'Super Admin',
//     profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
//     bio: 'Primary administrator and content director for SaroHub Technologies.',
//     role: 'SuperAdmin'
//   },
//   seo_settings: [
//     {
//       id: 1,
//       page_route: 'home',
//       meta_title: 'SaroHub Technologies | Enterprise Software Solutions',
//       meta_description: 'SaroHub Technologies delivers premium software engineering, custom cloud systems, and elite cognitive solutions globally.',
//       meta_keywords: 'SaroHub, enterprise tech, bespoke software, cloud databases, cognitive AI systems',
//     },
//     {
//       id: 2,
//       page_route: 'about',
//       meta_title: 'Corporate Pedigree & Leadership | SaroHub Technologies',
//       meta_description: 'Learn about our journey, corporate governance, engineering culture, and our elite leadership team.',
//       meta_keywords: 'SaroHub, Ashan Perera, Ruwan Silva, corporate strategy, executive board',
//     },
//     {
//       id: 3,
//       page_route: 'services',
//       meta_title: 'Elite Engineering Services | SaroHub Technologies',
//       meta_description: 'Discover our world-class expertise spanning custom SaaS platforms, cognitive systems, enterprise architecture, and secure databases.',
//       meta_keywords: 'software development, corporate APIs, microservices framework, cybersecurity audits',
//     }
//   ],
//   services: [
//     {
//       id: 1,
//       title: 'Enterprise Software & Cloud Systems',
//       slug: 'enterprise-software-cloud',
//       banner_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450',
//       short_description: 'Designing resilient microservices, elastic database arrays, and high-availability enterprise architectures.',
//       description: 'We engineer complex backend frameworks and highly-scalable cloud infrastructure. Our systems are trusted by financial institutions and large-scale manufacturing grids to process billions of operations with five-nines uptime.',
//       benefits: [
//         '99.999% Service Level Agreement (SLA) reliability',
//         'Auto-scaling Kubernetes deployment architecture',
//         'Advanced database sharding and low-latency read arrays',
//         'Military-grade end-to-end payload encryption standards'
//       ],
//       technologies: ['MySQL', 'Node.js', 'TypeScript', 'Kubernetes', 'Docker', 'Google Cloud Platform'],
//       faqs: [
//         { question: 'What database structures do you implement?', answer: 'We specialize in normalized high-throughput relational structures, including MySQL/MariaDB and distributed transactional databases.' },
//         { question: 'Do you assist in cloud migration?', answer: 'Yes, we design comprehensive infrastructure blueprints to securely transition on-premises mainframes into public/private clouds.' }
//       ],
//       created_at: '2026-06-25T10:00:00Z',
//       updated_at: '2026-06-25T10:00:00Z'
//     },
//     {
//       id: 2,
//       title: 'Cognitive Computing & Advanced AI',
//       slug: 'cognitive-computing-ai',
//       banner_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800&h=450',
//       short_description: 'Implementing custom LLM alignments, predictive modeling pipelines, and computer vision neural grids.',
//       description: 'Unlock enterprise automation through state-of-the-art artificial intelligence. We build custom retrieval-augmented generation (RAG) models, automated compliance agents, and sensory vision algorithms tailored to specialized industries.',
//       benefits: [
//         'Up to 85% operational efficiency gains in core compliance pipelines',
//         'Robust secure vector indexing protecting proprietary corporate data',
//         'Explainable AI metrics with detailed telemetry frameworks',
//         'Sub-150ms inferencing latency on private enterprise hardware clusters'
//       ],
//       technologies: ['Python', 'Gemini API', 'TensorFlow', 'PyTorch', 'Vector Databases', 'Node.js'],
//       faqs: [
//         { question: 'Are our enterprise models safe from public training?', answer: 'Absolutely. All models are trained on completely isolated VPC arrays with strict parameters prohibiting public leakage.' },
//         { question: 'Can you customize agent interfaces?', answer: 'We build tailored conversational nodes, automated report pipelines, and interactive dashboards mapped to your business rules.' }
//       ],
//       created_at: '2026-06-26T10:00:00Z',
//       updated_at: '2026-06-26T10:00:00Z'
//     },
//     {
//       id: 3,
//       title: 'Next-Gen Mobile & Web Experiences',
//       slug: 'next-gen-mobile-web',
//       banner_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450',
//       short_description: 'Building gorgeous, ergonomic user experiences and fluid multi-platform client applications.',
//       description: 'We fuse aesthetic layouts with responsive functional engineering. Our digital interfaces combine glassmorphism styling, fast load times, and micro-interactions designed to convert engagement into corporate outcomes.',
//       benefits: [
//         'Perfect 100/100 Lighthouse performance and accessibility scores',
//         'Unified cross-platform core matching native speed standards',
//         'Ergonomic layout frameworks adapting to any desktop or viewport',
//         'Dynamic styling and animations guided by Framer Motion'
//       ],
//       technologies: ['React.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Native', 'TypeScript'],
//       faqs: [
//         { question: 'How do you guarantee fast website rendering?', answer: 'We enforce static compilation paths, strict asset caching, responsive images, and lightweight client dependencies.' }
//       ],
//       created_at: '2026-06-27T10:00:00Z',
//       updated_at: '2026-06-27T10:00:00Z'
//     }
//   ],
//   projects: [
//     {
//       id: 1,
//       title: 'Vanguard ERP Systems Suite',
//       slug: 'vanguard-erp-systems',
//       client_name: 'Vanguard Heavy Industries',
//       category: 'SaaS',
//       technologies: ['React.js', 'Node.js', 'MySQL', 'Kubernetes', 'Tailwind CSS'],
//       short_description: 'A comprehensive, multi-module resource planning grid engineered for predictive inventory cycles.',
//       description: 'Vanguard heavy manufacturing required a real-time tracking network across six logistical nodes. We built a fully normalized relational database, an Express-powered REST server, and a responsive React client.',
//       case_study: 'By optimizing query indexes on stock logs and implementing secure JWT-authorized access tokens, we decreased record retrieval latency by 72% and saved over 1.2 million USD in redundant hardware allocation.',
//       live_url: 'https://vanguard-erp.demo.sarohub.com',
//       github_url: 'https://github.com/sarohub/vanguard-erp',
//       completion_date: '2026-04-12',
//       thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
//       created_at: '2026-06-20T10:00:00Z',
//       updated_at: '2026-06-20T10:00:00Z'
//     },
//     {
//       id: 2,
//       title: 'Aura AI Cognitive Agent',
//       slug: 'aura-ai-agent',
//       client_name: 'Aura Financial Advisory',
//       category: 'AI',
//       technologies: ['Gemini API', 'TypeScript', 'Vector DB', 'Express', 'Framer Motion'],
//       short_description: 'An autonomous financial reporting compiler generating certified multi-currency compliance forecasts.',
//       description: 'Aura requested an intelligence terminal capable of analyzing compliance documents and cross-referencing global trading rules in seconds.',
//       case_study: 'Leveraging Gemini models alongside server-side vector mapping, we engineered an agent that processes, structures, and highlights regulatory risks. The interface integrates dynamic chart representations and seamless interactive panels.',
//       live_url: 'https://aura-ai.demo.sarohub.com',
//       github_url: 'https://github.com/sarohub/aura-ai',
//       completion_date: '2026-05-30',
//       thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400',
//       created_at: '2026-06-21T10:00:00Z',
//       updated_at: '2026-06-21T10:00:00Z'
//     },
//     {
//       id: 3,
//       title: 'Apex E-Commerce Ecosystem',
//       slug: 'apex-ecom-ecosystem',
//       client_name: 'Apex Global Logistics',
//       category: 'E-Commerce',
//       technologies: ['React.js', 'Express.js', 'MySQL', 'Stripe API', 'Tailwind CSS'],
//       short_description: 'A high-velocity retail system capable of processing 10,000 requests per second with integrated fraud telemetry.',
//       description: 'Apex requested an e-commerce gateway to unify their national retail channels and process customer transactions securely.',
//       case_study: 'We designed a highly-optimized database structure with robust relational integrity. We integrated advanced payment APIs alongside backend risk rating rules to minimize credit card chargeback rates.',
//       live_url: 'https://apex-retail.demo.sarohub.com',
//       github_url: 'https://github.com/sarohub/apex-retail',
//       completion_date: '2026-06-15',
//       thumbnail_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=600&h=400',
//       created_at: '2026-06-22T10:00:00Z',
//       updated_at: '2026-06-22T10:00:00Z'
//     }
//   ],
//   products: [
//     {
//       id: 1,
//       title: 'SaroHub CRM & Core Pipeline',
//       slug: 'sarohub-crm',
//       short_description: 'Comprehensive sales automation, granular client logs, and real-time revenue velocity metrics.',
//       description: 'Transform customer interactions into long-term enterprise assets. SaroHub CRM is a custom-engineered pipeline manager offering secure, relational client mapping, predictive transaction logging, and real-time revenue analytics dashboards.',
//       features: [
//         'Secure multi-user customer mapping and relational logging',
//         'Custom interactive pipelines with intuitive drag-and-drop state updates',
//         'Automated contract document generation based on dynamic templates',
//         'Integrated multi-currency statistics, ledger analysis, and conversion analytics'
//       ],
//       pricing_plans: [
//         { name: 'Core Team', price: '$89', period: 'monthly', features: ['Up to 15 concurrent users', 'Full customer mapping', 'Sales pipelines', 'Secure standard database backup'] },
//         { name: 'Enterprise Grid', price: '$249', period: 'monthly', features: ['Unlimited users', 'Full pipeline automation', 'Advanced compliance logging', 'Direct API access keys', '24/7 dedicated support SLA'] }
//       ],
//       demo_url: 'https://crm.sarohub.com/demo',
//       video_url: 'https://youtube.com/embed/dQw4w9WgXcQ',
//       download_url: 'https://sarohub.com/downloads/crm-installer.exe',
//       thumbnail_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600&h=400',
//       created_at: '2026-06-20T10:00:00Z',
//       updated_at: '2026-06-20T10:00:00Z'
//     },
//     {
//       id: 2,
//       title: 'SaroHub Sentinel Hospital Manager',
//       slug: 'sarohub-sentinel-hospital',
//       short_description: 'Resilient electronic health records (EHR), dynamic clinical scheduling, and secure prescription arrays.',
//       description: 'Deliver peerless medical workflow operations. SaroHub Sentinel is a clinic management ecosystem protecting health records under HIPAA-aligned storage, automating medical appointment routing, and securing ledger details.',
//       features: [
//         'HIPAA-compliant patient record indexing and storage',
//         'Automated slot mapping for surgical and general outpatient cycles',
//         'Integrated drug interaction checks and certified prescription logs',
//         'Advanced medical billing, insurance routing, and detailed audits'
//       ],
//       pricing_plans: [
//         { name: 'Standard Clinic', price: '$179', period: 'monthly', features: ['Up to 5 practitioners', 'Electronic records storage', 'Appointment scheduler', 'Standard patient reports'] },
//         { name: 'Hospital Network', price: 'Custom Quote', period: 'annual', features: ['Unlimited clinical sites', 'Private regional server cluster deployment', 'Direct insurance API interfaces', 'Sub-1s search response guarantees'] }
//       ],
//       demo_url: 'https://sentinel.sarohub.com/demo',
//       video_url: 'https://youtube.com/embed/dQw4w9WgXcQ',
//       download_url: 'https://sarohub.com/downloads/sentinel-desktop.msi',
//       thumbnail_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600&h=400',
//       created_at: '2026-06-21T10:00:00Z',
//       updated_at: '2026-06-21T10:00:00Z'
//     }
//   ],
//   sale_projects: [
//     {
//       id: 1,
//       title: 'Secure Cloud POS System',
//       price: 1499.00,
//       technology: ['React.js', 'Express', 'MySQL', 'Tailwind CSS'],
//       short_description: 'An offline-first, dual-receipt retail checkout gateway featuring instant client logging and multi-terminal sync.',
//       features: [
//         'Dual-ledger offline-first cache system prevents transaction loss',
//         'Secure barcode parsing interfaces and instant receipt generation',
//         'Normalized tables ensuring robust client catalog tracking',
//         'Fully responsive inventory alert limits'
//       ],
//       demo_url: 'https://pos-sale.sarohub.com',
//       thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
//       screenshots: [
//         'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
//         'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400'
//       ],
//       created_at: '2026-06-25T10:00:00Z',
//       updated_at: '2026-06-25T10:00:00Z'
//     }
//   ],
//   blog_categories: [
//     { id: 1, name: 'Cloud Architecture', slug: 'cloud-architecture' },
//     { id: 2, name: 'Cognitive Science', slug: 'cognitive-science' },
//     { id: 3, name: 'Enterprise Strategy', slug: 'enterprise-strategy' }
//   ],
//   blog_tags: [
//     { id: 1, name: 'MySQL', slug: 'mysql' },
//     { id: 2, name: 'Microservices', slug: 'microservices' },
//     { id: 3, name: 'Gemini AI', slug: 'gemini-ai' },
//     { id: 4, name: 'High Availability', slug: 'high-availability' }
//   ],
//   blogs: [
//     {
//       id: 1,
//       title: 'Architecting Relational Systems for Five-Nines Database Uptime',
//       slug: 'architecting-relational-systems',
//       author_name: 'Ruwan Silva',
//       author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
//       category_id: 1,
//       featured_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450',
//       content: 'In modern SaaS infrastructure, database latency and availability dictate application success. We dive into the exact methodologies we used to scale SaroHub CRM to thousands of parallel transactions: connection pooling, query indexing, and read-replica routing configurations.\n\n### Why Normalized Databases Matter\nRedundant data leads to locking and consistency failures. Sticking to 3NF standards avoids multi-record syncing errors and keeps transactional costs minimal.\n\n### Designing Indexed Fields\nBy placing selective indices on frequently filtered attributes like email, slug, and category fields, you reduce standard sequential scans into fast logarithmic seek loops. We strongly advise mapping relational foreign keys explicitly to leverage engine cascade optimization.',
//       reading_time: '6 min read',
//       is_featured: true,
//       meta_title: 'Database Design Guide | SaroHub Technologies',
//       meta_description: 'A deep architectural review of how we design scalable relational networks with zero lock delays.',
//       created_at: '2026-06-28T09:12:00Z',
//       tags: [1, 2, 4]
//     },
//     {
//       id: 2,
//       title: 'Leveraging Gemini Cognitive SDKs for Safe Enterprise Automations',
//       slug: 'leveraging-gemini-cognitive-sdks',
//       author_name: 'Ashan Perera',
//       author_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150',
//       category_id: 2,
//       featured_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=450',
//       content: 'Cognitive agent automation is no longer a luxury. By integrating the `@google/genai` TypeScript SDK on highly secure private containers, we shield core corporate knowledge while offering predictive insights and dynamic reporting metrics.',
//       reading_time: '4 min read',
//       is_featured: false,
//       meta_title: 'Enterprise AI Strategy | SaroHub Technologies',
//       meta_description: 'An executive breakdown on aligning generative model parameters to prevent business leakage.',
//       created_at: '2026-06-29T14:30:00Z',
//       tags: [3]
//     }
//   ],
//   events: [
//     {
//       id: 1,
//       title: 'SaroHub Enterprise Software Summit 2026',
//       banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450',
//       event_date: '2026-08-15T09:00:00Z',
//       venue: 'SaroHub HQ Conference Complex, Corporate Headquarters / Hybrid Portal',
//       description: 'Join our founders, chief technical officers, and enterprise software leaders as we unveil the future of relational database architecture, cognitive business intelligence systems, and distributed microservices.',
//       registration_link: 'https://summit.sarohub.com/register',
//       created_at: '2026-06-28T10:00:00Z'
//     }
//   ],
//   careers: [
//     {
//       id: 1,
//       position: 'Senior Software Engineer (Full Stack Relational Node/React)',
//       department: 'Enterprise Core Systems',
//       salary: 'LKR 450,000 - 650,000 Negotiable',
//       experience: '5+ Years',
//       skills: ['MySQL', 'Node.js', 'React.js', 'TypeScript', 'Docker'],
//       description: 'Join the SaroHub core platform team. You will lead the structural architecture of our multi-tenant SaaS products and scale transactional backends for corporate clients.',
//       is_active: true,
//       created_at: '2026-06-28T08:00:00Z'
//     },
//     {
//       id: 2,
//       position: 'UI/UX Interactive Designer',
//       department: 'Creative Product Grid',
//       salary: 'LKR 250,000 - 350,000',
//       experience: '3+ Years',
//       skills: ['Figma', 'Aesthetic Grid Design', 'Framer Motion', 'Responsive layouts'],
//       description: 'Shape the interfaces of SaroHub software solutions. You will collaborate with the founders to establish premium, ergonomic dashboards and high-converting marketing sites.',
//       is_active: true,
//       created_at: '2026-06-29T09:00:00Z'
//     }
//   ],
//   applications: [
//     {
//       id: 1,
//       career_id: 1,
//       full_name: 'Dinesh Wickramasinghe',
//       email: 'dinesh@dev.com',
//       phone: '+94 77 123 4567',
//       resume_url: 'https://sarohub.com/resumes/dinesh_cv.pdf',
//       cover_letter: 'I have extensive experience working with complex relational databases and building fast Express apps.',
//       applied_at: '2026-06-29T10:15:00Z',
//       status: 'pending'
//     }
//   ],
//   team_members: [
//     {
//       id: 1,
//       name: 'Ashan Perera',
//       position: 'Co-Founder & CEO',
//       photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300',
//       bio: 'Visionary tech entrepreneur with over a decade of experience leading global enterprise software design and strategic market expansions.',
//       skills: ['Leadership', 'Strategy', 'Cloud Architecture', 'Enterprise Sales'],
//       social_linkedin: 'linkedin.com/in/ashan-perera',
//       social_github: 'github.com/ashan',
//       social_twitter: 'twitter.com/ashan',
//       experience_years: '12 Years',
//       is_founder: true,
//       sort_order: 1,
//       created_at: '2026-06-25T10:00:00Z'
//     },
//     {
//       id: 2,
//       name: 'Ruwan Silva',
//       position: 'Co-Founder & CTO',
//       photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
//       bio: 'Full-stack software architect specializing in scalable microservices, low-latency relational architectures, and high-performance system design.',
//       skills: ['MySQL', 'Node.js', 'React', 'Kubernetes', 'Distributed Systems'],
//       social_linkedin: 'linkedin.com/in/ruwan-silva',
//       social_github: 'github.com/ruwan',
//       experience_years: '10 Years',
//       is_founder: true,
//       sort_order: 2,
//       created_at: '2026-06-25T10:00:00Z'
//     },
//     {
//       id: 3,
//       name: 'Sarah Jayawardena',
//       position: 'Co-Founder & Chief Product Officer',
//       photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
//       bio: 'Aesthetic-driven UI/UX designer and product manager passionate about crafting ergonomic user journeys and premium digital products.',
//       skills: ['Product Management', 'UI/UX Design', 'Figma', 'Agile Leadership'],
//       social_linkedin: 'linkedin.com/in/sarah-j',
//       social_github: 'github.com/sarah',
//       experience_years: '8 Years',
//       is_founder: true,
//       sort_order: 3,
//       created_at: '2026-06-25T10:00:00Z'
//     }
//   ],
//   testimonials: [
//     {
//       id: 1,
//       client_name: 'Harsha de Silva',
//       client_role: 'Operations Director',
//       client_company: 'Vanguard Industrial Holdings',
//       client_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
//       rating: 5,
//       feedback: 'The team at SaroHub engineered an absolute masterpiece for us. Their relational Vanguard ERP module tracks millions of structural parts across our sites with flawless real-time indexing. Highly professional!',
//       created_at: '2026-06-26T10:00:00Z'
//     },
//     {
//       id: 2,
//       client_name: 'Anika Fernando',
//       client_role: 'Chief Operations Officer',
//       client_company: 'Aura Advisory',
//       client_avatar: 'https://images.unsplash.com/photo-1534751516642-a131ffd473fd?auto=format&fit=crop&q=80&w=150&h=150',
//       rating: 5,
//       feedback: 'Integrating SaroHub Sentinel and custom AI tools has optimized our administrative throughput by over 40%. Their technical prowess is unmatched.',
//       created_at: '2026-06-27T10:00:00Z'
//     }
//   ],
//   faqs: [
//     {
//       id: 1,
//       category: 'General',
//       question: 'What is SaroHub Technologies core specialty?',
//       answer: 'We specialize in enterprise-level bespoke software, high-integrity relational SQL systems, custom cloud architectures, and secure cognitive computing models (AI) tailored to institutional business rules.',
//       created_at: '2026-06-25T10:00:00Z'
//     },
//     {
//       id: 2,
//       category: 'Pricing',
//       question: 'Do you offer custom service SLAs?',
//       answer: 'Yes, all our major enterprise and cloud integrations are backed by custom Service Level Agreements guaranteeing up to 99.999% uptime, continuous transaction support, and active engineering help desks.',
//       created_at: '2026-06-25T10:00:00Z'
//     }
//   ],
//   contact_messages: [
//     {
//       id: 1,
//       name: 'Rohan Perera',
//       email: 'rohan@enterprise.com',
//       phone: '+94 71 999 8888',
//       subject: 'Cloud ERP System Integration Request',
//       message: 'We are looking to migrate our database records into a unified, high-availability platform. We would like to consult with Ashan or Ruwan on the architecture.',
//       is_read: false,
//       created_at: '2026-06-29T16:20:00Z'
//     }
//   ],
//   newsletter_subscribers: [
//     {
//       id: 1,
//       email: 'news@corporate.com',
//       is_active: true,
//       subscribed_at: '2026-06-28T11:00:00Z'
//     }
//   ],
//   settings: {
//     company_name: 'SaroHub Technologies (Private) Limited',
//     office_address: 'Level 14, East Tower, World Trade Center, Corporate HQ, Sri Lanka',
//     email: 'info@sarohub.com',
//     phone: '+94 11 234 5678',
//     whatsapp: '+94 77 111 2222',
//     business_hours: 'Monday - Friday: 8:30 AM - 5:30 PM (SLT)',
//     facebook: 'https://facebook.com/sarohub',
//     linkedin: 'https://linkedin.com/company/sarohub',
//     twitter: 'https://twitter.com/sarohub'
//   },
//   activity_logs: [
//     {
//       id: 1,
//       admin_id: 1,
//       action_type: 'SYSTEM_BOOT',
//       details: 'SaroHub Technologies backend core bootstrapped with default 3NF schema.',
//       ip_address: '127.0.0.1',
//       created_at: '2026-06-29T23:48:35-07:00'
//     }
//   ],
//   chat_sessions: [
//     {
//       id: 'demo-session-1',
//       visitor_name: 'Dinuka Perera',
//       visitor_email: 'dinuka@cloudscale.lk',
//       status: 'active',
//       agent_unread: true,
//       visitor_unread: false,
//       messages: [
//         {
//           id: 'm1',
//           sender: 'visitor',
//           text: 'Hi SaroHub team! I am interested in your cognitive computing services for our supply chain optimization. Do you support multi-region deployment?',
//           created_at: '2026-06-30T06:50:00Z'
//         },
//         {
//           id: 'm2',
//           sender: 'agent',
//           text: 'Hello Dinuka! Yes, absolutely. All of our cognitive systems are engineered with sub-millisecond edge indexing and deployed across multi-region high-availability configurations.',
//           created_at: '2026-06-30T06:52:00Z'
//         },
//         {
//           id: 'm3',
//           sender: 'visitor',
//           text: 'That sounds perfect. Could you provide some details on pricing and timeline for a pilot?',
//           created_at: '2026-06-30T06:55:00Z'
//         }
//       ],
//       created_at: '2026-06-30T06:50:00Z',
//       updated_at: '2026-06-30T06:55:00Z'
//     }
//   ],
//   opportunities: [
//     {
//       id: 1,
//       type: 'Scholarship',
//       title: 'SaroHub Enterprise Tech Scholarship',
//       slug: 'sarohub-enterprise-tech-scholarship',
//       description: 'Providing fully-funded engineering scholarships for outstanding computer science and software engineering undergraduates in Sri Lanka. Scholars will receive full financial support, direct mentorship under CTO Ruwan Silva, and guaranteed internship opportunities.',
//       eligibility_criteria: 'Undergraduate students currently pursuing a BSc or equivalent degree in Software Engineering, Computer Science, or Information Technology. Minimum GPA of 3.5 or equivalent academic/personal project portfolio.',
//       benefits: 'Full tuition fees coverage, LKR 50,000 monthly study stipend, dedicated workstation in our HQ offices, and structured professional development.',
//       location: 'SaroHub HQ (Hybrid)',
//       duration: '1 Year',
//       deadline: '2026-09-30',
//       positions_count: 5,
//       status: 'Open',
//       featured_image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800&h=450',
//       is_published: true,
//       form_fields: [
//         { id: 'field_name', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full legal name' },
//         { id: 'field_email', type: 'email', label: 'Contact Email', required: true, placeholder: 'Enter your active email' },
//         { id: 'field_phone', type: 'phone', label: 'Contact Phone', required: true, placeholder: 'e.g. +94 77 123 4567' },
//         { id: 'field_gpa', type: 'number', label: 'Current Cumulative GPA', required: true, placeholder: 'e.g. 3.85' },
//         { id: 'field_academic_year', type: 'dropdown', label: 'Current Academic Year', required: true, options: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
//         { id: 'field_statement', type: 'textarea', label: 'Statement of Purpose', required: true, placeholder: 'Briefly explain why you should be awarded this scholarship' },
//         { id: 'field_transcript', type: 'file', label: 'Academic Transcript (PDF)', required: true },
//         { id: 'field_projects', type: 'text', label: 'GitHub Profile Link', required: false, placeholder: 'https://github.com/username' }
//       ],
//       created_at: '2026-07-06T00:00:00Z',
//       updated_at: '2026-07-06T00:00:00Z'
//     },
//     {
//       id: 2,
//       type: 'Internship',
//       title: 'Cognitive Computing & LLM Systems Internship',
//       slug: 'cognitive-computing-llm-systems-internship',
//       description: 'Join our research group engineering state-of-the-art vector mapping databases, custom RAG integrations, and autonomous AI agents. Work alongside SaroHub co-founders Ashan Perera and Ruwan Silva to solve actual industrial scalability problems.',
//       eligibility_criteria: 'Intermediate knowledge of TypeScript, Python, Node.js, and basic relational schemas. Prior experience building projects using LLMs or neural networks is a strong advantage.',
//       benefits: 'Attractive internship salary (LKR 80,000/mo), mentorship from senior software engineering leads, direct exposure to client projects, and high likelihood of transition to permanent role.',
//       location: 'SaroHub HQ / Remote',
//       duration: '6 Months',
//       deadline: '2026-08-15',
//       positions_count: 3,
//       status: 'Open',
//       featured_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&h=450',
//       is_published: true,
//       form_fields: [
//         { id: 'field_name', type: 'text', label: 'Full Name', required: true, placeholder: 'Full Name' },
//         { id: 'field_email', type: 'email', label: 'Email', required: true, placeholder: 'Email Address' },
//         { id: 'field_phone', type: 'phone', label: 'Phone', required: true, placeholder: 'Contact Number' },
//         { id: 'field_projects_links', type: 'textarea', label: 'Brief description of your AI/LLM experience & links', required: true, placeholder: 'Summarize past work...' },
//         { id: 'field_cv', type: 'file', label: 'Resume / CV (PDF)', required: true }
//       ],
//       created_at: '2026-07-06T00:00:00Z',
//       updated_at: '2026-07-06T00:00:00Z'
//     }
//   ],
//   opportunity_applications: [
//     {
//       id: 1,
//       opportunity_id: 1,
//       opportunity_title: 'SaroHub Enterprise Tech Scholarship',
//       opportunity_type: 'Scholarship',
//       applicant_name: 'Akalanka Perera',
//       applicant_email: 'akalanka@student.lk',
//       applied_at: '2026-07-06T01:30:00Z',
//       status: 'Pending',
//       form_data: {
//         'Full Name': 'Akalanka Perera',
//         'Contact Email': 'akalanka@student.lk',
//         'Contact Phone': '+94 77 222 3344',
//         'Current Cumulative GPA': '3.91',
//         'Current Academic Year': '3rd Year',
//         'Statement of Purpose': "I am deeply passionate about enterprise software engineering and cloud systems. The opportunity to work at WTC Headquarters under Ruwan's mentorship is my dream.",
//         'GitHub Profile Link': 'https://github.com/akalanka-dev'
//       },
//       uploaded_documents: [
//         {
//           fieldLabel: 'Academic Transcript (PDF)',
//           fileName: 'akalanka_transcript.pdf',
//           fileUrl: 'https://sarohub.com/resumes/akalanka_transcript_sim.pdf'
//         }
//       ],
//       internal_notes: ''
//     },
//     {
//       id: 2,
//       opportunity_id: 2,
//       opportunity_title: 'Cognitive Computing & LLM Systems Internship',
//       opportunity_type: 'Internship',
//       applicant_name: 'Minuka Fernando',
//       applicant_email: 'minuka@gmail.com',
//       applied_at: '2026-07-06T02:00:00Z',
//       status: 'Shortlisted',
//       form_data: {
//         'Full Name': 'Minuka Fernando',
//         'Email': 'minuka@gmail.com',
//         'Phone': '+94 71 888 9900',
//         'Brief description of your AI/LLM experience & links': 'I have built a custom PDF QA chatbot using Gemini and Express during my university hackathon.'
//       },
//       uploaded_documents: [
//         {
//           fieldLabel: 'Resume / CV (PDF)',
//           fileName: 'minuka_cv.pdf',
//           fileUrl: 'https://sarohub.com/resumes/minuka_cv_sim.pdf'
//         }
//       ],
//       internal_notes: 'Very strong candidate. High hackathon experience. Selected for technical interview.'
//     }
//   ],
//   agent_availability: 'online',
//   event_registrations: []
// };

// // Singleton DB Instance Manager
// class JSONDatabase {
//   private data: DBState = INITIAL_DB;

//   constructor() {
//     this.load();
//   }

//   private load() {
//     try {
//       if (fs.existsSync(DB_FILE)) {
//         const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
//         this.data = JSON.parse(fileContent);
        
//         // Ensure new modules are correctly backfilled with default seed data if missing
//         let hasChanges = false;
//         if (!this.data.opportunities) {
//           this.data.opportunities = INITIAL_DB.opportunities;
//           hasChanges = true;
//         }
//         if (!this.data.opportunity_applications) {
//           this.data.opportunity_applications = INITIAL_DB.opportunity_applications;
//           hasChanges = true;
//         }
//         if (!this.data.event_registrations) {
//           this.data.event_registrations = INITIAL_DB.event_registrations || [];
//           hasChanges = true;
//         }
//         if (hasChanges) {
//           this.save();
//         }
//       } else {
//         this.save();
//       }
//     } catch (e) {
//       console.error("Failed to load local DB state. Reverting to initial seed.", e);
//       this.data = INITIAL_DB;
//     }
//   }

//   private save() {
//     try {
//       fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
//     } catch (e) {
//       console.error("Failed to save local DB state.", e);
//     }
//   }

//   // Get current DB snapshot
//   getState(): DBState {
//     return this.data;
//   }

//   // Update complete state (useful for admin actions)
//   updateState(updater: (state: DBState) => void) {
//     updater(this.data);
//     this.save();
//   }

//   // Activity logger helper
//   logActivity(adminId: number | undefined, action: string, details: string, ip: string) {
//     const nextId = this.data.activity_logs.length > 0 ? Math.max(...this.data.activity_logs.map(l => l.id)) + 1 : 1;
//     this.data.activity_logs.unshift({
//       id: nextId,
//       admin_id: adminId,
//       action_type: action,
//       details,
//       ip_address: 'ADMIN_SECURE',
//       created_at: new Date().toISOString()
//     });
//     this.save();
//   }
// }

// export const db = new JSONDatabase();























export const DEFAULT_VENTURES: Venture[] = [
  {
    id: 1,
    ventureNumber: "VENTURE 01",
    name: "Alin316",
    slug: "alin316",
    shortTitle: "Alin316",
    tagline: "Building a smarter digital future for education.",
    description: "Alin316 is a cloud-based school management and learning platform designed to bring academic, administrative, and educational workflows together in one connected ecosystem.",
    category: "EdTech • SaaS",
    status: "Expanding",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=300&h=300",
    coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200&h=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800&h=450"
    ],
    keyCapabilities: [
      "Student and staff management",
      "Academic and class management",
      "Attendance and performance tracking",
      "Digital learning workflows",
      "School administration",
      "Communication and collaboration",
      "Dashboards and reporting",
      "Cloud-based accessibility"
    ],
    technologies: ["React", "TypeScript", "Node.js", "Cloud", "SaaS"],
    websiteUrl: "https://alin316.sarohub.com",
    demoUrl: "https://alin316-demo.sarohub.com",
    learnMoreUrl: "/ventures/alin316",
    featured: true,
    order: 1,
    published: true,
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    industry: "Education & EdTech",
    problem: "Traditional educational institutions struggle with fragmented administrative systems, manual attendance tracking, and disconnected parent-teacher-student communication channels.",
    solution: "Alin316 unifies student records, academic grading, fee collection, staff scheduling, and digital learning modules into an intuitive cloud platform.",
    targetMarket: "K-12 Schools, Colleges, Academies, and Educational Networks.",
    businessModel: "SaaS Subscription (Per Student / Monthly / Annual Tier)"
  },
  {
    id: 2,
    ventureNumber: "VENTURE 02",
    name: "SaroHub Real Estate",
    slug: "sarohub-real-estate",
    shortTitle: "SaroHub Real Estate",
    tagline: "Reimagining property discovery, management, and investment.",
    description: "An AI-powered, multi-tenant real estate ecosystem designed to connect property seekers, owners, agents, agencies, and investors through a unified digital platform.",
    category: "PropTech • AI • SaaS",
    status: "In Development",
    logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=300&h=300",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200&h=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=450"
    ],
    keyCapabilities: [
      "AI-powered natural-language property search",
      "Multi-tenant agency management",
      "Property listing and portfolio management",
      "Intelligent recommendations",
      "Agent and agency management",
      "Investment and property analytics",
      "Cross-border property discovery",
      "Virtual property exploration"
    ],
    technologies: ["Python", "AI APIs", "React", "TypeScript", "Node.js"],
    websiteUrl: "",
    demoUrl: "",
    learnMoreUrl: "/ventures/sarohub-real-estate",
    featured: true,
    order: 2,
    published: true,
    createdAt: "2026-03-10T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    industry: "Real Estate & PropTech",
    problem: "Real estate markets suffer from slow property search, lack of verified data, fragmented agency management tools, and poor cross-border investment accessibility.",
    solution: "An intelligent PropTech platform using AI conversational search, multi-tenant agency management, and automated portfolio analytics.",
    targetMarket: "Property buyers, renters, real estate agencies, property managers, and global investors.",
    businessModel: "Agency SaaS Tiers + Featured Listing Fees"
  },
  {
    id: 3,
    ventureNumber: "VENTURE 03",
    name: "SaroHub CRM",
    slug: "sarohub-crm",
    shortTitle: "SaroHub CRM",
    tagline: "Turning customer relationships into business intelligence.",
    description: "SaroHub CRM is a business relationship and pipeline platform designed to help organizations manage customers, opportunities, workflows, transactions, and business insights from one unified system.",
    category: "SaaS • Business Technology",
    status: "In Development",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300&h=300",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=450"
    ],
    keyCapabilities: [
      "Customer and organization management",
      "Interactive sales pipelines",
      "Relationship and activity tracking",
      "Automated document generation",
      "Revenue and transaction analytics",
      "Multi-currency reporting",
      "Business dashboards",
      "Multi-user collaboration"
    ],
    technologies: ["TypeScript", "React", "Node.js", "Cloud APIs"],
    websiteUrl: "",
    demoUrl: "",
    learnMoreUrl: "/ventures/sarohub-crm",
    featured: true,
    order: 3,
    published: true,
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    industry: "Business Software & CRM",
    problem: "Growing businesses struggle with complex sales funnels, scattered client communications, and lack of real-time visibility into deal pipelines.",
    solution: "SaroHub CRM simplifies lead-to-deal conversion with intuitive drag-and-drop pipelines, automated document generation, and multi-currency transaction tracking.",
    targetMarket: "B2B companies, agencies, technology firms, and service providers.",
    businessModel: "Per User / Monthly SaaS License"
  },
  {
    id: 4,
    ventureNumber: "VENTURE 04",
    name: "SaroHub Sentinel",
    slug: "sarohub-sentinel",
    shortTitle: "SaroHub Sentinel",
    tagline: "Building smarter digital infrastructure for healthcare.",
    description: "SaroHub Sentinel is a healthcare management platform designed to help clinics and healthcare organizations digitize operational workflows, manage patient information, coordinate appointments, and streamline administrative processes.",
    category: "HealthTech • SaaS",
    status: "In Development",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300&h=300",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200&h=600",
    galleryImages: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800&h=450"
    ],
    keyCapabilities: [
      "Patient record management",
      "Appointment and scheduling management",
      "Doctor and staff workflows",
      "Prescription and medication records",
      "Medical billing management",
      "Insurance workflow support",
      "Operational reporting",
      "Role-based access and audit trails"
    ],
    technologies: ["TypeScript", "React", "Node.js", "Python", "Cloud Security"],
    websiteUrl: "",
    demoUrl: "",
    learnMoreUrl: "/ventures/sarohub-sentinel",
    featured: true,
    order: 4,
    published: true,
    createdAt: "2026-05-15T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    industry: "Healthcare & HealthTech",
    problem: "Medical clinics and healthcare providers frequently deal with paper records, fragmented appointment scheduling, and delayed administrative billing.",
    solution: "SaroHub Sentinel provides a centralized digital workflow system for managing patient records, doctor schedules, prescriptions, and clinic operations.",
    targetMarket: "Private clinics, diagnostic centers, group practices, and healthcare providers.",
    businessModel: "Clinic Monthly Subscription"
  }
];

export interface DBState {
  admin: {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    full_name: string;
    profile_pic: string;
    bio: string;
    role: string;
  };
  seo_settings: SEOSettings[];
  services: Service[];
  projects: Project[];
  products: Product[];
  ventures: Venture[];
  sale_projects: SaleProject[];
  blog_categories: BlogCategory[];
  blog_tags: BlogTag[];
  blogs: Blog[];
  events: Event[];
  careers: Career[];
  applications: Application[];
  team_members: TeamMember[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  contact_messages: ContactMessage[];
  newsletter_subscribers: NewsletterSubscriber[];
  activity_logs: ActivityLog[];
  settings: { [key: string]: string };
  chat_sessions: ChatSession[];
  opportunities: Opportunity[];
  opportunity_applications: OpportunityApplication[];
  event_registrations: EventRegistration[];
  partners: Partner[];
  student_projects: StudentProject[];
  agent_availability: 'online' | 'away' | 'offline';
  hero_settings?: HeroSectionSettings;
  company_metrics?: CompanyMetric[];
  why_sarohub_items?: WhySaroHubItem[];
  industry_solutions?: IndustrySolution[];
  case_studies?: CaseStudy[];
  process_steps?: ProcessStep[];
  tech_stack_items?: TechStackItem[];
  security_standards?: SecurityStandard[];
  company_timeline?: CompanyTimelineItem[];
  leads?: Lead[];
  media_library?: MediaItem[];
}

// Default/Initial Seed Data for Enterprise Look
const INITIAL_DB: DBState = {
  admin: {
    id: 1,
    username: 'admin',
    email: 'cyberm0101noirhat@gmail.com',
    password_hash: '$2a$10$tZ9B2z2.L.a8g.tY21tWSeQY0E2yqF5BfeHym6t.y8Xz/V10Yp7gS', // SaroHub@Admin2026!
    full_name: 'Super Admin',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
    bio: 'Primary administrator and content director for SaroHub Technologies.',
    role: 'SuperAdmin'
  },
  seo_settings: [
    {
      id: 1,
      page_route: 'home',
      meta_title: 'SaroHub Technologies | Enterprise Software Solutions',
      meta_description: 'SaroHub Technologies delivers premium software engineering, custom cloud systems, and elite cognitive solutions globally.',
      meta_keywords: 'SaroHub, enterprise tech, bespoke software, cloud databases, cognitive AI systems',
    },
    {
      id: 2,
      page_route: 'about',
      meta_title: 'Corporate Pedigree & Leadership | SaroHub Technologies',
      meta_description: 'Learn about our journey, corporate governance, engineering culture, and our elite leadership team.',
      meta_keywords: 'SaroHub, Ashan Perera, Ruwan Silva, corporate strategy, executive board',
    },
    {
      id: 3,
      page_route: 'services',
      meta_title: 'Elite Engineering Services | SaroHub Technologies',
      meta_description: 'Discover our world-class expertise spanning custom SaaS platforms, cognitive systems, enterprise architecture, and secure databases.',
      meta_keywords: 'software development, corporate APIs, microservices framework, cybersecurity audits',
    }
  ],
  services: [
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
        { question: 'What database structures do you implement?', answer: 'We specialize in normalized high-throughput relational structures, including MySQL/MariaDB and distributed transactional databases.' },
        { question: 'Do you assist in cloud migration?', answer: 'Yes, we design comprehensive infrastructure blueprints to securely transition on-premises mainframes into public/private clouds.' }
      ],
      created_at: '2026-06-25T10:00:00Z',
      updated_at: '2026-06-25T10:00:00Z'
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
        { question: 'Are our enterprise models safe from public training?', answer: 'Absolutely. All models are trained on completely isolated VPC arrays with strict parameters prohibiting public leakage.' },
        { question: 'Can you customize agent interfaces?', answer: 'We build tailored conversational nodes, automated report pipelines, and interactive dashboards mapped to your business rules.' }
      ],
      created_at: '2026-06-26T10:00:00Z',
      updated_at: '2026-06-26T10:00:00Z'
    },
    {
      id: 3,
      title: 'Next-Gen Mobile & Web Experiences',
      slug: 'next-gen-mobile-web',
      banner_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450',
      short_description: 'Building gorgeous, ergonomic user experiences and fluid multi-platform client applications.',
      description: 'We fuse aesthetic layouts with responsive functional engineering. Our digital interfaces combine glassmorphism styling, fast load times, and micro-interactions designed to convert engagement into corporate outcomes.',
      benefits: [
        'Perfect 100/100 Lighthouse performance and accessibility scores',
        'Unified cross-platform core matching native speed standards',
        'Ergonomic layout frameworks adapting to any desktop or viewport',
        'Dynamic styling and animations guided by Framer Motion'
      ],
      technologies: ['React.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Native', 'TypeScript'],
      faqs: [
        { question: 'How do you guarantee fast website rendering?', answer: 'We enforce static compilation paths, strict asset caching, responsive images, and lightweight client dependencies.' }
      ],
      created_at: '2026-06-27T10:00:00Z',
      updated_at: '2026-06-27T10:00:00Z'
    }
  ],
  projects: [
    {
      id: 1,
      title: 'Vanguard ERP Systems Suite',
      slug: 'vanguard-erp-systems',
      client_name: 'Vanguard Heavy Industries',
      category: 'SaaS',
      technologies: ['React.js', 'Node.js', 'MySQL', 'Kubernetes', 'Tailwind CSS'],
      short_description: 'A comprehensive, multi-module resource planning grid engineered for predictive inventory cycles.',
      description: 'Vanguard heavy manufacturing required a real-time tracking network across six logistical nodes. We built a fully normalized relational database, an Express-powered REST server, and a responsive React client.',
      case_study: 'By optimizing query indexes on stock logs and implementing secure JWT-authorized access tokens, we decreased record retrieval latency by 72% and saved over 1.2 million USD in redundant hardware allocation.',
      live_url: 'https://vanguard-erp.demo.sarohub.com',
      github_url: 'https://github.com/sarohub/vanguard-erp',
      completion_date: '2026-04-12',
      thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: '2026-06-20T10:00:00Z',
      updated_at: '2026-06-20T10:00:00Z'
    },
    {
      id: 2,
      title: 'Aura AI Cognitive Agent',
      slug: 'aura-ai-agent',
      client_name: 'Aura Financial Advisory',
      category: 'AI',
      technologies: ['Gemini API', 'TypeScript', 'Vector DB', 'Express', 'Framer Motion'],
      short_description: 'An autonomous financial reporting compiler generating certified multi-currency compliance forecasts.',
      description: 'Aura requested an intelligence terminal capable of analyzing compliance documents and cross-referencing global trading rules in seconds.',
      case_study: 'Leveraging Gemini models alongside server-side vector mapping, we engineered an agent that processes, structures, and highlights regulatory risks. The interface integrates dynamic chart representations and seamless interactive panels.',
      live_url: 'https://aura-ai.demo.sarohub.com',
      github_url: 'https://github.com/sarohub/aura-ai',
      completion_date: '2026-05-30',
      thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: '2026-06-21T10:00:00Z',
      updated_at: '2026-06-21T10:00:00Z'
    },
    {
      id: 3,
      title: 'Apex E-Commerce Ecosystem',
      slug: 'apex-ecom-ecosystem',
      client_name: 'Apex Global Logistics',
      category: 'E-Commerce',
      technologies: ['React.js', 'Express.js', 'MySQL', 'Stripe API', 'Tailwind CSS'],
      short_description: 'A high-velocity retail system capable of processing 10,000 requests per second with integrated fraud telemetry.',
      description: 'Apex requested an e-commerce gateway to unify their national retail channels and process customer transactions securely.',
      case_study: 'We designed a highly-optimized database structure with robust relational integrity. We integrated advanced payment APIs alongside backend risk rating rules to minimize credit card chargeback rates.',
      live_url: 'https://apex-retail.demo.sarohub.com',
      github_url: 'https://github.com/sarohub/apex-retail',
      completion_date: '2026-06-15',
      thumbnail_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: '2026-06-22T10:00:00Z',
      updated_at: '2026-06-22T10:00:00Z'
    }
  ],
  products: [
    {
      id: 1,
      title: 'SaroHub CRM & Core Pipeline',
      slug: 'sarohub-crm',
      short_description: 'Comprehensive sales automation, granular client logs, and real-time revenue velocity metrics.',
      description: 'Transform customer interactions into long-term enterprise assets. SaroHub CRM is a custom-engineered pipeline manager offering secure, relational client mapping, predictive transaction logging, and real-time revenue analytics dashboards.',
      features: [
        'Secure multi-user customer mapping and relational logging',
        'Custom interactive pipelines with intuitive drag-and-drop state updates',
        'Automated contract document generation based on dynamic templates',
        'Integrated multi-currency statistics, ledger analysis, and conversion analytics'
      ],
      pricing_plans: [
        { name: 'Core Team', price: '$89', period: 'monthly', features: ['Up to 15 concurrent users', 'Full customer mapping', 'Sales pipelines', 'Secure standard database backup'] },
        { name: 'Enterprise Grid', price: '$249', period: 'monthly', features: ['Unlimited users', 'Full pipeline automation', 'Advanced compliance logging', 'Direct API access keys', '24/7 dedicated support SLA'] }
      ],
      demo_url: 'https://crm.sarohub.com/demo',
      video_url: 'https://youtube.com/embed/dQw4w9WgXcQ',
      download_url: 'https://sarohub.com/downloads/crm-installer.exe',
      thumbnail_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: '2026-06-20T10:00:00Z',
      updated_at: '2026-06-20T10:00:00Z'
    },
    {
      id: 2,
      title: 'SaroHub Sentinel Hospital Manager',
      slug: 'sarohub-sentinel-hospital',
      short_description: 'Resilient electronic health records (EHR), dynamic clinical scheduling, and secure prescription arrays.',
      description: 'Deliver peerless medical workflow operations. SaroHub Sentinel is a clinic management ecosystem protecting health records under HIPAA-aligned storage, automating medical appointment routing, and securing ledger details.',
      features: [
        'HIPAA-compliant patient record indexing and storage',
        'Automated slot mapping for surgical and general outpatient cycles',
        'Integrated drug interaction checks and certified prescription logs',
        'Advanced medical billing, insurance routing, and detailed audits'
      ],
      pricing_plans: [
        { name: 'Standard Clinic', price: '$179', period: 'monthly', features: ['Up to 5 practitioners', 'Electronic records storage', 'Appointment scheduler', 'Standard patient reports'] },
        { name: 'Hospital Network', price: 'Custom Quote', period: 'annual', features: ['Unlimited clinical sites', 'Private regional server cluster deployment', 'Direct insurance API interfaces', 'Sub-1s search response guarantees'] }
      ],
      demo_url: 'https://sentinel.sarohub.com/demo',
      video_url: 'https://youtube.com/embed/dQw4w9WgXcQ',
      download_url: 'https://sarohub.com/downloads/sentinel-desktop.msi',
      thumbnail_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600&h=400',
      created_at: '2026-06-21T10:00:00Z',
      updated_at: '2026-06-21T10:00:00Z'
    }
  ],
  ventures: DEFAULT_VENTURES,
  sale_projects: [
    {
      id: 1,
      title: 'Secure Cloud POS System',
      price: 1499.00,
      technology: ['React.js', 'Express', 'MySQL', 'Tailwind CSS'],
      short_description: 'An offline-first, dual-receipt retail checkout gateway featuring instant client logging and multi-terminal sync.',
      features: [
        'Dual-ledger offline-first cache system prevents transaction loss',
        'Secure barcode parsing interfaces and instant receipt generation',
        'Normalized tables ensuring robust client catalog tracking',
        'Fully responsive inventory alert limits'
      ],
      demo_url: 'https://pos-sale.sarohub.com',
      thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
      screenshots: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400'
      ],
      created_at: '2026-06-25T10:00:00Z',
      updated_at: '2026-06-25T10:00:00Z'
    }
  ],
  blog_categories: [
    { id: 1, name: 'Cloud Architecture', slug: 'cloud-architecture' },
    { id: 2, name: 'Cognitive Science', slug: 'cognitive-science' },
    { id: 3, name: 'Enterprise Strategy', slug: 'enterprise-strategy' }
  ],
  blog_tags: [
    { id: 1, name: 'MySQL', slug: 'mysql' },
    { id: 2, name: 'Microservices', slug: 'microservices' },
    { id: 3, name: 'Gemini AI', slug: 'gemini-ai' },
    { id: 4, name: 'High Availability', slug: 'high-availability' }
  ],
  blogs: [
    {
      id: 1,
      title: 'Architecting Relational Systems for Five-Nines Database Uptime',
      slug: 'architecting-relational-systems',
      author_name: 'Ruwan Silva',
      author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      category_id: 1,
      featured_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450',
      content: 'In modern SaaS infrastructure, database latency and availability dictate application success. We dive into the exact methodologies we used to scale SaroHub CRM to thousands of parallel transactions: connection pooling, query indexing, and read-replica routing configurations.\n\n### Why Normalized Databases Matter\nRedundant data leads to locking and consistency failures. Sticking to 3NF standards avoids multi-record syncing errors and keeps transactional costs minimal.\n\n### Designing Indexed Fields\nBy placing selective indices on frequently filtered attributes like email, slug, and category fields, you reduce standard sequential scans into fast logarithmic seek loops. We strongly advise mapping relational foreign keys explicitly to leverage engine cascade optimization.',
      reading_time: '6 min read',
      is_featured: true,
      meta_title: 'Database Design Guide | SaroHub Technologies',
      meta_description: 'A deep architectural review of how we design scalable relational networks with zero lock delays.',
      created_at: '2026-06-28T09:12:00Z',
      tags: [1, 2, 4]
    },
    {
      id: 2,
      title: 'Leveraging Gemini Cognitive SDKs for Safe Enterprise Automations',
      slug: 'leveraging-gemini-cognitive-sdks',
      author_name: 'Ashan Perera',
      author_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150',
      category_id: 2,
      featured_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=450',
      content: 'Cognitive agent automation is no longer a luxury. By integrating the `@google/genai` TypeScript SDK on highly secure private containers, we shield core corporate knowledge while offering predictive insights and dynamic reporting metrics.',
      reading_time: '4 min read',
      is_featured: false,
      meta_title: 'Enterprise AI Strategy | SaroHub Technologies',
      meta_description: 'An executive breakdown on aligning generative model parameters to prevent business leakage.',
      created_at: '2026-06-29T14:30:00Z',
      tags: [3]
    }
  ],
  events: [
    {
      id: 1,
      title: 'SaroHub Enterprise Software Summit 2026',
      banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450',
      event_date: '2026-08-15T09:00:00Z',
      venue: 'SaroHub HQ Conference Complex, Corporate Headquarters / Hybrid Portal',
      description: 'Join our founders, chief technical officers, and enterprise software leaders as we unveil the future of relational database architecture, cognitive business intelligence systems, and distributed microservices.',
      registration_link: 'https://summit.sarohub.com/register',
      created_at: '2026-06-28T10:00:00Z'
    }
  ],
  careers: [
    {
      id: 1,
      position: 'Senior Software Engineer (Full Stack Relational Node/React)',
      department: 'Enterprise Core Systems',
      salary: 'LKR 450,000 - 650,000 Negotiable',
      experience: '5+ Years',
      skills: ['MySQL', 'Node.js', 'React.js', 'TypeScript', 'Docker'],
      description: 'Join the SaroHub core platform team. You will lead the structural architecture of our multi-tenant SaaS products and scale transactional backends for corporate clients.',
      is_active: true,
      created_at: '2026-06-28T08:00:00Z'
    },
    {
      id: 2,
      position: 'UI/UX Interactive Designer',
      department: 'Creative Product Grid',
      salary: 'LKR 250,000 - 350,000',
      experience: '3+ Years',
      skills: ['Figma', 'Aesthetic Grid Design', 'Framer Motion', 'Responsive layouts'],
      description: 'Shape the interfaces of SaroHub software solutions. You will collaborate with the founders to establish premium, ergonomic dashboards and high-converting marketing sites.',
      is_active: true,
      created_at: '2026-06-29T09:00:00Z'
    }
  ],
  applications: [
    {
      id: 1,
      career_id: 1,
      full_name: 'Dinesh Wickramasinghe',
      email: 'dinesh@dev.com',
      phone: '+94 77 123 4567',
      resume_url: 'https://sarohub.com/resumes/dinesh_cv.pdf',
      cover_letter: 'I have extensive experience working with complex relational databases and building fast Express apps.',
      applied_at: '2026-06-29T10:15:00Z',
      status: 'pending'
    }
  ],
  team_members: [
    {
      id: 1,
      name: 'Ashan Perera',
      position: 'Co-Founder & CEO',
      photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300',
      bio: 'Visionary tech entrepreneur with over a decade of experience leading global enterprise software design and strategic market expansions.',
      skills: ['Leadership', 'Strategy', 'Cloud Architecture', 'Enterprise Sales'],
      social_linkedin: 'linkedin.com/in/ashan-perera',
      social_github: 'github.com/ashan',
      social_twitter: 'twitter.com/ashan',
      portfolio_url: '',
      experience_years: '12 Years',
      is_founder: true,
      sort_order: 1,
      created_at: '2026-06-25T10:00:00Z'
    },
    {
      id: 2,
      name: 'Ruwan Silva',
      position: 'Co-Founder & CTO',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
      bio: 'Full-stack software architect specializing in scalable microservices, low-latency relational architectures, and high-performance system design.',
      skills: ['MySQL', 'Node.js', 'React', 'Kubernetes', 'Distributed Systems'],
      social_linkedin: 'linkedin.com/in/ruwan-silva',
      social_github: 'github.com/ruwan',
      portfolio_url: '',
      experience_years: '10 Years',
      is_founder: true,
      sort_order: 2,
      created_at: '2026-06-25T10:00:00Z'
    },
    {
      id: 3,
      name: 'Sarah Jayawardena',
      position: 'Co-Founder & Chief Product Officer',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
      bio: 'Aesthetic-driven UI/UX designer and product manager passionate about crafting ergonomic user journeys and premium digital products.',
      skills: ['Product Management', 'UI/UX Design', 'Figma', 'Agile Leadership'],
      social_linkedin: 'linkedin.com/in/sarah-j',
      social_github: 'github.com/sarah',
      portfolio_url: '',
      experience_years: '8 Years',
      is_founder: true,
      sort_order: 3,
      created_at: '2026-06-25T10:00:00Z'
    }
  ],
  testimonials: [
    {
      id: 1,
      client_name: 'Harsha de Silva',
      client_role: 'Operations Director',
      client_company: 'Vanguard Industrial Holdings',
      client_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 5,
      feedback: 'The team at SaroHub engineered an absolute masterpiece for us. Their relational Vanguard ERP module tracks millions of structural parts across our sites with flawless real-time indexing. Highly professional!',
      created_at: '2026-06-26T10:00:00Z'
    },
    {
      id: 2,
      client_name: 'Anika Fernando',
      client_role: 'Chief Operations Officer',
      client_company: 'Aura Advisory',
      client_avatar: 'https://images.unsplash.com/photo-1534751516642-a131ffd473fd?auto=format&fit=crop&q=80&w=150&h=150',
      rating: 5,
      feedback: 'Integrating SaroHub Sentinel and custom AI tools has optimized our administrative throughput by over 40%. Their technical prowess is unmatched.',
      created_at: '2026-06-27T10:00:00Z'
    }
  ],
  faqs: [
    {
      id: 1,
      category: 'General',
      question: 'What is SaroHub Technologies core specialty?',
      answer: 'We specialize in enterprise-level bespoke software, high-integrity relational SQL systems, custom cloud architectures, and secure cognitive computing models (AI) tailored to institutional business rules.',
      created_at: '2026-06-25T10:00:00Z'
    },
    {
      id: 2,
      category: 'Pricing',
      question: 'Do you offer custom service SLAs?',
      answer: 'Yes, all our major enterprise and cloud integrations are backed by custom Service Level Agreements guaranteeing up to 99.999% uptime, continuous transaction support, and active engineering help desks.',
      created_at: '2026-06-25T10:00:00Z'
    }
  ],
  contact_messages: [
    {
      id: 1,
      name: 'Rohan Perera',
      email: 'rohan@enterprise.com',
      phone: '+94 71 999 8888',
      subject: 'Cloud ERP System Integration Request',
      message: 'We are looking to migrate our database records into a unified, high-availability platform. We would like to consult with Ashan or Ruwan on the architecture.',
      is_read: false,
      created_at: '2026-06-29T16:20:00Z'
    }
  ],
  newsletter_subscribers: [
    {
      id: 1,
      email: 'news@corporate.com',
      is_active: true,
      subscribed_at: '2026-06-28T11:00:00Z'
    }
  ],
  settings: {
    company_name: 'SaroHub Technologies (Private) Limited',
    office_address: 'Ali Chowk, Roshan Electric Store Building 3rd Floor skardu Gilgit-Baltistan Pakistan',
    email: 'info@sarohub.com',
    phone: '+94 11 234 5678',
    whatsapp: '+94 77 111 2222',
    business_hours: 'Monday - Friday: 8:30 AM - 5:30 PM (SLT)',
    facebook: 'https://facebook.com/sarohub',
    linkedin: 'https://linkedin.com/company/sarohub',
    twitter: 'https://twitter.com/sarohub',
    instagram: '',
    github: '',
    youtube: '',
    tiktok: '',
    founder_year: '2022',
    registered_year: '2026',
    ceo_ventures_saas: '5+ Built',
    ceo_engineering_team: '20+ Minds',
    ceo_strategic_focus: 'GB & Global'
  },
  activity_logs: [
    {
      id: 1,
      admin_id: 1,
      action_type: 'SYSTEM_BOOT',
      details: 'SaroHub Technologies backend core bootstrapped with default 3NF schema.',
      ip_address: '127.0.0.1',
      created_at: '2026-06-29T23:48:35-07:00'
    }
  ],
  chat_sessions: [
    {
      id: 'demo-session-1',
      visitor_name: 'Dinuka Perera',
      visitor_email: 'dinuka@cloudscale.lk',
      status: 'active',
      agent_unread: true,
      visitor_unread: false,
      messages: [
        {
          id: 'm1',
          sender: 'visitor',
          text: 'Hi SaroHub team! I am interested in your cognitive computing services for our supply chain optimization. Do you support multi-region deployment?',
          created_at: '2026-06-30T06:50:00Z'
        },
        {
          id: 'm2',
          sender: 'agent',
          text: 'Hello Dinuka! Yes, absolutely. All of our cognitive systems are engineered with sub-millisecond edge indexing and deployed across multi-region high-availability configurations.',
          created_at: '2026-06-30T06:52:00Z'
        },
        {
          id: 'm3',
          sender: 'visitor',
          text: 'That sounds perfect. Could you provide some details on pricing and timeline for a pilot?',
          created_at: '2026-06-30T06:55:00Z'
        }
      ],
      created_at: '2026-06-30T06:50:00Z',
      updated_at: '2026-06-30T06:55:00Z'
    }
  ],
  opportunities: [
    {
      id: 1,
      type: 'Scholarship',
      title: 'SaroHub Enterprise Tech Scholarship',
      slug: 'sarohub-enterprise-tech-scholarship',
      description: 'Providing fully-funded engineering scholarships for outstanding computer science and software engineering undergraduates in Sri Lanka. Scholars will receive full financial support, direct mentorship under CTO Ruwan Silva, and guaranteed internship opportunities.',
      eligibility_criteria: 'Undergraduate students currently pursuing a BSc or equivalent degree in Software Engineering, Computer Science, or Information Technology. Minimum GPA of 3.5 or equivalent academic/personal project portfolio.',
      benefits: 'Full tuition fees coverage, LKR 50,000 monthly study stipend, dedicated workstation in our HQ offices, and structured professional development.',
      location: 'SaroHub HQ (Hybrid)',
      duration: '1 Year',
      deadline: '2026-09-30',
      positions_count: 5,
      status: 'Open',
      featured_image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800&h=450',
      is_published: true,
      form_fields: [
        { id: 'field_name', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full legal name' },
        { id: 'field_email', type: 'email', label: 'Contact Email', required: true, placeholder: 'Enter your active email' },
        { id: 'field_phone', type: 'phone', label: 'Contact Phone', required: true, placeholder: 'e.g. +94 77 123 4567' },
        { id: 'field_gpa', type: 'number', label: 'Current Cumulative GPA', required: true, placeholder: 'e.g. 3.85' },
        { id: 'field_academic_year', type: 'dropdown', label: 'Current Academic Year', required: true, options: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
        { id: 'field_statement', type: 'textarea', label: 'Statement of Purpose', required: true, placeholder: 'Briefly explain why you should be awarded this scholarship' },
        { id: 'field_transcript', type: 'file', label: 'Academic Transcript (PDF)', required: true },
        { id: 'field_projects', type: 'text', label: 'GitHub Profile Link', required: false, placeholder: 'https://github.com/username' }
      ],
      created_at: '2026-07-06T00:00:00Z',
      updated_at: '2026-07-06T00:00:00Z'
    },
    {
      id: 2,
      type: 'Internship',
      title: 'Cognitive Computing & LLM Systems Internship',
      slug: 'cognitive-computing-llm-systems-internship',
      description: 'Join our research group engineering state-of-the-art vector mapping databases, custom RAG integrations, and autonomous AI agents. Work alongside SaroHub co-founders Ashan Perera and Ruwan Silva to solve actual industrial scalability problems.',
      eligibility_criteria: 'Intermediate knowledge of TypeScript, Python, Node.js, and basic relational schemas. Prior experience building projects using LLMs or neural networks is a strong advantage.',
      benefits: 'Attractive internship salary (LKR 80,000/mo), mentorship from senior software engineering leads, direct exposure to client projects, and high likelihood of transition to permanent role.',
      location: 'SaroHub HQ / Remote',
      duration: '6 Months',
      deadline: '2026-08-15',
      positions_count: 3,
      status: 'Open',
      featured_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&h=450',
      is_published: true,
      form_fields: [
        { id: 'field_name', type: 'text', label: 'Full Name', required: true, placeholder: 'Full Name' },
        { id: 'field_email', type: 'email', label: 'Email', required: true, placeholder: 'Email Address' },
        { id: 'field_phone', type: 'phone', label: 'Phone', required: true, placeholder: 'Contact Number' },
        { id: 'field_projects_links', type: 'textarea', label: 'Brief description of your AI/LLM experience & links', required: true, placeholder: 'Summarize past work...' },
        { id: 'field_cv', type: 'file', label: 'Resume / CV (PDF)', required: true }
      ],
      created_at: '2026-07-06T00:00:00Z',
      updated_at: '2026-07-06T00:00:00Z'
    }
  ],
  opportunity_applications: [
    {
      id: 1,
      opportunity_id: 1,
      opportunity_title: 'SaroHub Enterprise Tech Scholarship',
      opportunity_type: 'Scholarship',
      applicant_name: 'Akalanka Perera',
      applicant_email: 'akalanka@student.lk',
      applied_at: '2026-07-06T01:30:00Z',
      status: 'Pending',
      form_data: {
        'Full Name': 'Akalanka Perera',
        'Contact Email': 'akalanka@student.lk',
        'Contact Phone': '+94 77 222 3344',
        'Current Cumulative GPA': '3.91',
        'Current Academic Year': '3rd Year',
        'Statement of Purpose': "I am deeply passionate about enterprise software engineering and cloud systems. The opportunity to work at WTC Headquarters under Ruwan's mentorship is my dream.",
        'GitHub Profile Link': 'https://github.com/akalanka-dev'
      },
      uploaded_documents: [
        {
          fieldLabel: 'Academic Transcript (PDF)',
          fileName: 'akalanka_transcript.pdf',
          fileUrl: 'https://sarohub.com/resumes/akalanka_transcript_sim.pdf'
        }
      ],
      internal_notes: ''
    },
    {
      id: 2,
      opportunity_id: 2,
      opportunity_title: 'Cognitive Computing & LLM Systems Internship',
      opportunity_type: 'Internship',
      applicant_name: 'Minuka Fernando',
      applicant_email: 'minuka@gmail.com',
      applied_at: '2026-07-06T02:00:00Z',
      status: 'Shortlisted',
      form_data: {
        'Full Name': 'Minuka Fernando',
        'Email': 'minuka@gmail.com',
        'Phone': '+94 71 888 9900',
        'Brief description of your AI/LLM experience & links': 'I have built a custom PDF QA chatbot using Gemini and Express during my university hackathon.'
      },
      uploaded_documents: [
        {
          fieldLabel: 'Resume / CV (PDF)',
          fileName: 'minuka_cv.pdf',
          fileUrl: 'https://sarohub.com/resumes/minuka_cv_sim.pdf'
        }
      ],
      internal_notes: 'Very strong candidate. High hackathon experience. Selected for technical interview.'
    }
  ],
  agent_availability: 'online',
  event_registrations: [],
  partners: [
    {
      id: 1,
      name: "Global Tech Agency Network",
      category: "Agency",
      logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200&h=100",
      website_url: "https://sarohub.com",
      description: "Strategic delivery partner for enterprise web & mobile software applications.",
      featured: true,
      order: 1,
      created_at: "2026-08-01T00:00:00.000Z"
    },
    {
      id: 2,
      name: "Venture Capital Partners",
      category: "Investor",
      logo_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200&h=100",
      website_url: "https://sarohub.com",
      description: "Strategic investment partner backing high-growth tech ventures and platforms.",
      featured: true,
      order: 2,
      created_at: "2026-08-01T00:00:00.000Z"
    }
  ],
  student_projects: [
    {
      id: 1,
      title: 'Smart Health Diagnostics Platform',
      student_name: 'Imran Khan & Team',
      batch_course: 'Full-Stack Software Engineering - Batch 2026',
      category: 'AI & Web SaaS',
      technologies: ['React', 'Node.js', 'TypeScript', 'Python', 'Tailwind CSS'],
      short_description: 'An AI-assisted medical telemetry dashboard for patient vitals monitoring and automated diagnostics dispatch.',
      description: 'Built during the 12-week SaroHub IT Center Advanced Bootcamp, this platform processes real-time patient metrics with automated triage alerts and encrypted HIPAA-ready storage.',
      thumbnail_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800&h=450',
      live_url: 'https://demo-health.sarohub.com',
      github_url: 'https://github.com/sarohub-academy/health-diagnostics',
      created_at: '2026-07-01T10:00:00Z',
      updated_at: '2026-07-01T10:00:00Z'
    },
    {
      id: 2,
      title: 'Autonomous Logistics Tracker',
      student_name: 'Ayesha Rahman',
      batch_course: 'Cloud & Microservices Architecture - Batch 2026',
      category: 'Cloud & IoT',
      technologies: ['Node.js', 'Docker', 'React Native', 'MySQL', 'GCP'],
      short_description: 'Real-time GPS fleet telemetry tracking system with automated route optimization algorithms.',
      description: 'Engineered as a capstone project at SaroHub IT Center. Features live map tracking, driver dispatch alerts, and distributed container deployment.',
      thumbnail_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800&h=450',
      live_url: 'https://demo-logistics.sarohub.com',
      github_url: 'https://github.com/sarohub-academy/logistics-tracker',
      created_at: '2026-07-15T10:00:00Z',
      updated_at: '2026-07-15T10:00:00Z'
    },
    {
      id: 3,
      title: 'EduSphere Learning Ecosystem',
      student_name: 'Zayn Perera & Fatima Ali',
      batch_course: 'Modern Web Engineering - Batch 2026',
      category: 'EdTech & SaaS',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      short_description: 'Collaborative online learning platform with live code playground, quizzes, and automated certificate generation.',
      description: 'Developed by SaroHub Academy graduates to serve local educational institutes with interactive video courses, automated grading, and peer code reviews.',
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&h=450',
      live_url: 'https://demo-edusphere.sarohub.com',
      github_url: 'https://github.com/sarohub-academy/edusphere-app',
      created_at: '2026-08-01T10:00:00Z',
      updated_at: '2026-08-01T10:00:00Z'
    }
  ]
};

// Singleton DB Instance Manager
class JSONDatabase {
  private data: DBState = INITIAL_DB;

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        
        // Ensure new modules are correctly backfilled with default seed data if missing
        let hasChanges = false;
        if (!this.data.opportunities) {
          this.data.opportunities = INITIAL_DB.opportunities;
          hasChanges = true;
        }
        if (!this.data.opportunity_applications) {
          this.data.opportunity_applications = INITIAL_DB.opportunity_applications;
          hasChanges = true;
        }
        if (!this.data.event_registrations) {
          this.data.event_registrations = INITIAL_DB.event_registrations || [];
          hasChanges = true;
        }
        if (!this.data.partners) {
          this.data.partners = INITIAL_DB.partners || [];
          hasChanges = true;
        }
        if (!this.data.student_projects) {
          this.data.student_projects = INITIAL_DB.student_projects || [];
          hasChanges = true;
        }
        if (!this.data.ventures || this.data.ventures.length === 0) {
          this.data.ventures = DEFAULT_VENTURES;
          hasChanges = true;
        }
        if (!this.data.chat_sessions) {
          this.data.chat_sessions = INITIAL_DB.chat_sessions || [];
          hasChanges = true;
        }
        if (!this.data.agent_availability) {
          this.data.agent_availability = INITIAL_DB.agent_availability || 'online';
          hasChanges = true;
        }

        // New Dynamic CMS Collections Backfills
        if (!this.data.hero_settings) {
          (this.data as any).hero_settings = {
            eyebrowText: 'Turning Vision Into Ventures.',
            headline: 'Build AI-Powered Software & Scalable Digital Systems',
            description: 'SaroHub Technologies engineers custom software, SaaS products, AI solutions, and digital platforms built for global business impact.',
            primaryCtaText: 'Start a Project',
            primaryCtaLink: '#contact-preview',
            secondaryCtaText: 'Explore Our Work',
            secondaryCtaLink: '#featured-projects',
            badgeText: 'Enterprise Software & AI Engineering Partner',
            bgMediaUrl: '',
            heroImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&h=800'
          };
          hasChanges = true;
        }

        if (!this.data.company_metrics) {
          (this.data as any).company_metrics = [
            { id: 1, number: '50+', label: 'Projects Delivered', description: 'Enterprise platforms & web systems', icon: 'Briefcase', order: 1, active: true },
            { id: 2, number: '18+', label: 'Organizations Served', description: 'Corporate clients & institutions', icon: 'Globe', order: 2, active: true },
            { id: 3, number: '100K+', label: 'Users Reached', description: 'Across deployed SaaS applications', icon: 'Users', order: 3, active: true },
            { id: 4, number: '25+', label: 'Engineering Experts', description: 'Full-stack & AI developers', icon: 'Cpu', order: 4, active: true },
            { id: 5, number: '6', label: 'Proprietary Ventures', description: 'Internal products in market', icon: 'Award', order: 5, active: true },
            { id: 6, number: '12+', label: 'Countries Served', description: 'Clients across US, EU, and Asia', icon: 'MapPin', order: 6, active: true }
          ];
          hasChanges = true;
        }

        if (!this.data.why_sarohub_items) {
          (this.data as any).why_sarohub_items = [
            { id: 1, title: 'Business-First Engineering', shortDescription: 'We solve the business problem before selecting technology.', detailedDescription: 'Our architecture starts with business ROI and scalability requirements rather than tech hype.', icon: 'CheckCircle', order: 1, status: 'active' },
            { id: 2, title: 'AI Where It Matters', shortDescription: 'Targeted AI models that create measurable value.', detailedDescription: 'We integrate RAG pipelines, predictive ML models, and automated compliance agents.', icon: 'Cpu', order: 2, status: 'active' },
            { id: 3, title: 'Product Thinking', shortDescription: 'Built for usability, retention, and long-term growth.', detailedDescription: 'Every platform is built with intuitive UX, multi-tenant SaaS architecture, and expansion pathways.', icon: 'TrendingUp', order: 3, status: 'active' },
            { id: 4, title: 'Built to Scale', shortDescription: 'High-throughput microservices designed for future growth.', detailedDescription: 'Our serverless & containerized deployments handle millions of operations with five-nines reliability.', icon: 'Grid', order: 4, status: 'active' },
            { id: 5, title: 'One Technology Partner', shortDescription: 'Strategy, design, engineering, and support under one roof.', detailedDescription: 'From initial scoping to cloud deployment and ongoing security monitoring, we own the lifecycle.', icon: 'Award', order: 5, status: 'active' }
          ];
          hasChanges = true;
        }

        if (!this.data.process_steps) {
          (this.data as any).process_steps = [
            { id: 1, stepNumber: '01', title: 'Discover', shortDescription: 'In-depth scoping of goals, user journeys, and technical constraints.', detailedDescription: 'We align on business requirements, architecture blueprints, and project milestones.', icon: 'Search', order: 1 },
            { id: 2, stepNumber: '02', title: 'Strategy', shortDescription: 'Database normalization, API contracts, and technology stack selection.', detailedDescription: 'Designing resilient system blueprints, security controls, and UX wireframes.', icon: 'FileText', order: 2 },
            { id: 3, stepNumber: '03', title: 'Design', shortDescription: 'Interactive prototypes, component design systems, and UX validation.', detailedDescription: 'Building modern responsive interfaces with high accessibility standards.', icon: 'Grid', order: 3 },
            { id: 4, stepNumber: '04', title: 'Build', shortDescription: 'Agile sprint development, automated CI/CD pipelines, and code reviews.', detailedDescription: 'Full-stack engineering with continuous integration, unit tests, and security scanning.', icon: 'Code', order: 4 },
            { id: 5, stepNumber: '05', title: 'Launch', shortDescription: 'Production cloud deployment, load testing, and zero-downtime cutover.', detailedDescription: 'Deploying to high-availability clusters with monitoring and automated backups.', icon: 'Globe', order: 5 },
            { id: 6, stepNumber: '06', title: 'Scale', shortDescription: 'Ongoing performance tuning, feature updates, and SLA support.', detailedDescription: 'Proactive server maintenance, analytics optimization, and scale expansion.', icon: 'TrendingUp', order: 6 }
          ];
          hasChanges = true;
        }

        if (!this.data.security_standards) {
          (this.data as any).security_standards = [
            { id: 1, title: 'Authentication & Access Control', category: 'Security', description: 'OAuth2, JWT with rotation, RBAC, and Multi-Factor Authentication.', details: ['Role-based access control (RBAC)', 'Encrypted session tokens with automatic rotation', 'Bcrypt password hashing with high salt rounds'], icon: 'Lock', order: 1 },
            { id: 2, title: 'Data Protection & Encryption', category: 'Compliance', description: 'AES-256 encryption at rest and TLS 1.3 payload encryption in transit.', details: ['Database level field encryption for PII', 'Automated nightly backups with off-site replication', 'Zero-trust architecture policies'], icon: 'CheckCircle', order: 2 },
            { id: 3, title: 'API & Microservice Security', category: 'Infrastructure', description: 'Rate limiting, CORS policies, XSS/CSRF prevention, and payload validation.', details: ['Strict input sanitization & parameterized queries', 'DDoS protection via Cloudflare WAF', 'API gateway rate limiting per tenant'], icon: 'Shield', order: 3 },
            { id: 4, title: 'CI/CD & Code Quality Audits', category: 'DevOps', description: 'Automated vulnerability scanning, static code analysis, and unit test coverage.', details: ['Automated SAST scans on pull requests', 'Container image vulnerability scanning', 'Continuous uptime & health telemetry monitoring'], icon: 'Activity', order: 4 }
          ];
          hasChanges = true;
        }

        if (!this.data.company_timeline) {
          (this.data as any).company_timeline = [
            { id: 1, year: '2022', title: 'SaroHub Initiative Begins', description: 'Founded as a specialized technology research group and custom software consultancy.', order: 1, status: 'active' },
            { id: 2, year: '2024', title: 'IT Training Center & AI Lab Launch', description: 'Expanded into hands-on IT Academy training and cognitive computing R&D.', order: 2, status: 'active' },
            { id: 3, year: '2026', title: 'Incorporation & Venture Expansion', description: 'Officially incorporated SaroHub Technologies (Pvt) Ltd, scaling proprietary SaaS ventures and enterprise client platforms.', order: 3, status: 'active' }
          ];
          hasChanges = true;
        }

        if (!this.data.leads) {
          (this.data as any).leads = [];
          hasChanges = true;
        }

        if (!this.data.media_library) {
          (this.data as any).media_library = [];
          hasChanges = true;
        }

        // Backfill portfolio_url for existing team members missing it
        if (this.data.team_members) {
          this.data.team_members.forEach((m: any) => {
            if (m.portfolio_url === undefined) {
              m.portfolio_url = '';
              hasChanges = true;
            }
          });
        }
        // Backfill new social media keys for settings
        const settingDefaults: { [key: string]: string } = { instagram: '', github: '', youtube: '', tiktok: '' };
        if (this.data.settings) {
          for (const key of Object.keys(settingDefaults)) {
            if (this.data.settings[key] === undefined) {
              this.data.settings[key] = settingDefaults[key];
              hasChanges = true;
            }
          }
        }
        if (hasChanges) {
          this.save();
        }
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Failed to load local DB state. Reverting to initial seed.", e);
      this.data = INITIAL_DB;
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to save local DB state.", e);
    }
  }

  // Get current DB snapshot
  getState(): DBState {
    return this.data;
  }

  // Update complete state (useful for admin actions)
  updateState(updater: (state: DBState) => void) {
    updater(this.data);
    this.save();
  }

  // Activity logger helper
  logActivity(adminId: number | undefined, action: string, details: string, ip: string) {
    const nextId = this.data.activity_logs.length > 0 ? Math.max(...this.data.activity_logs.map(l => l.id)) + 1 : 1;
    this.data.activity_logs.unshift({
      id: nextId,
      admin_id: adminId,
      action_type: action,
      details,
      ip_address: 'ADMIN_SECURE',
      created_at: new Date().toISOString()
    });
    this.save();
  }
}

export const db = new JSONDatabase();
