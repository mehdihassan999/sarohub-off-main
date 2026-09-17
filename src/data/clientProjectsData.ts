export interface ProjectChallenge {
  title: string;
  description: string;
}

export interface ProjectSolution {
  title: string;
  description: string;
}

export interface ProjectImpactOutcome {
  title: string;
  description: string;
}

export interface ProjectMetricResult {
  metric: string;
  label: string;
  detail?: string;
}

export interface ProjectTechStack {
  frontend?: string;
  backend?: string;
  database?: string;
  architecture?: string;
  tags: string[];
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar_url?: string;
}

export interface ClientProject {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  category: string; // One of: 'Web Applications', 'Websites', 'SaaS', 'Business Software', 'E-commerce / Commerce', 'Hospitality', 'Retail', 'Education', 'Other'
  secondary_categories?: string[];
  project_type: string;
  positioning_statement: string;
  short_description: string;
  what_we_solved: string;
  status: 'Delivered' | 'Completed' | 'Ongoing' | 'In Production';
  engagement: string;
  completion_date: string;
  thumbnail_url: string;
  screenshots: string[];
  live_url?: string;
  github_url?: string;

  // Case Study Sections
  overview: {
    client_background: string;
    industry_context: string;
    what_sarohub_built: string;
    project_importance: string;
  };
  challenges: ProjectChallenge[];
  solutions: ProjectSolution[];
  features: string[];
  sarohub_role: string[];
  technologies: ProjectTechStack;
  results_impact: {
    metrics?: ProjectMetricResult[];
    qualitative_outcomes: ProjectImpactOutcome[];
  };
  testimonial?: ProjectTestimonial;
  featured?: boolean;
  order?: number;
}

export const CLIENT_PROJECTS: ClientProject[] = [
  {
    id: 1,
    title: 'Waziri Mobile',
    slug: 'waziri-mobile',
    client_name: 'Waziri Mobile',
    industry: 'Mobile & Electronics',
    category: 'E-commerce / Commerce',
    secondary_categories: ['Web Applications', 'Retail'],
    project_type: 'Custom Web Application & Ordering Platform',
    positioning_statement: 'Digital platform for a modern mobile & electronics business.',
    short_description: 'A modern digital platform enabling smartphone and electronics buyers to explore live store inventories, detailed technical specifications, and place direct purchase inquiries.',
    what_we_solved: 'Created a modern digital platform to improve product visibility and customer accessibility.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-03-20',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://wazirimobile.com',
    overview: {
      client_background: 'Waziri Mobile is a recognized regional retailer supplying smartphones, smart devices, and consumer tech accessories across northern commercial hubs.',
      industry_context: 'Consumer Electronics & Telecommunications Retail',
      what_sarohub_built: 'SaroHub architected a high-speed digital catalog, multi-variant filter engine, customer inquiry conduit, and central stock management portal.',
      project_importance: 'Rising customer inquiry volume through physical visits and scattered messaging required a modern digital platform to showcase new smartphone models, verify stock, and streamline retail orders.'
    },
    challenges: [
      {
        title: 'Limited Digital Presence',
        description: 'The business needed a stronger online presence to reach smartphone buyers beyond walk-in foot traffic.'
      },
      {
        title: 'Product Visibility',
        description: 'Customers needed an easier way to discover available smartphone models, colors, memory variants, and pricing.'
      },
      {
        title: 'Customer Accessibility',
        description: 'Product information, warranty policies, and device specifications needed to be accessible online 24/7.'
      },
      {
        title: 'Scattered Information',
        description: 'Stock details and pricing inquiries were managed manually over WhatsApp, creating customer wait times and lost orders.'
      }
    ],
    solutions: [
      {
        title: 'Custom Digital Platform',
        description: 'A purpose-built web application designed directly around Waziri Mobile\'s sales and customer engagement flow.'
      },
      {
        title: 'Product Showcase',
        description: 'Structured presentation of smartphones, tablets, audio accessories, and genuine warranties with multi-angle photos.'
      },
      {
        title: 'Responsive Experience',
        description: 'Optimized for mobile smartphones, tablets, and desktop computers for fast, on-the-go browsing.'
      },
      {
        title: 'Scalable Architecture',
        description: 'Built with a flexible MERN stack foundation that can support upcoming branch expansions and digital payments.'
      }
    ],
    features: [
      'Interactive Product Catalog with Instant Search',
      'Multi-Variant Specification & Storage Filter',
      'Direct WhatsApp & Call Ordering Conduit',
      'Live Branch Inventory Availability Indicators',
      'Responsive Mobile-First Interface',
      'Promotional Banners & Deal Highlights',
      'Admin Catalog & Inventory Control Dashboard',
      'Customer Product Inquiry Tracker'
    ],
    sarohub_role: [
      'UI/UX Design',
      'Frontend Development',
      'Backend Development',
      'Database Development',
      'API Development',
      'System Architecture',
      'Deployment & Hosting Setup',
      'Quality Assurance Testing',
      'Technical Support'
    ],
    technologies: {
      frontend: 'React.js, Tailwind CSS',
      backend: 'Node.js, Express.js',
      database: 'MongoDB',
      architecture: 'MERN Stack Architecture',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MERN Stack', 'Tailwind CSS']
    },
    results_impact: {
      metrics: [
        { metric: '+65%', label: 'Inquiry Response Speed', detail: 'Faster customer device discovery and order confirmation times.' },
        { metric: '10,000+', label: 'Monthly Catalog Browses', detail: 'Customers viewing live phone models and accessory inventory.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Improved Product Visibility',
          description: 'Created a stronger, credible digital presence enabling customers across the region to explore phone models online.'
        },
        {
          title: 'Better Customer Experience',
          description: 'Made technical specifications, storage options, and prices easy to compare on any mobile phone.'
        },
        {
          title: 'Centralized Platform',
          description: 'Unified product listings, branch details, and order inquiries into one cohesive digital destination.'
        },
        {
          title: 'Scalable Foundation',
          description: 'Built a reliable technology base ready for future branch rollouts and expanded electronics lines.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub delivered exactly what our business needed. Customers now browse our stock online before visiting, and our inquiry response time has improved dramatically.',
      author: 'Management Team',
      role: 'Managing Director',
      company: 'Waziri Mobile'
    },
    featured: true,
    order: 1
  },
  {
    id: 2,
    title: 'The Crescent Resorts',
    slug: 'the-crescent-resorts',
    client_name: 'The Crescent Resorts',
    industry: 'Hospitality',
    category: 'Hospitality',
    secondary_categories: ['Web Applications'],
    project_type: 'Hospitality Booking & Digital Guest Experience Platform',
    positioning_statement: 'Hospitality & digital guest experience platform for premier northern tourism.',
    short_description: 'A centralized hotel management and guest booking engine engineered to showcase luxury resort suites, manage room reservations, and eliminate booking collisions.',
    what_we_solved: 'Replaced manual booking records with a centralized digital reservation and guest management system that eliminated double-bookings.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-05-15',
    thumbnail_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://thecrescentresorts.com',
    overview: {
      client_background: 'The Crescent Resorts is a premier hospitality provider operating scenic boutique hotels and retreat properties serving vacationers and corporate groups.',
      industry_context: 'Hospitality, Luxury Tourism & Leisure',
      what_sarohub_built: 'SaroHub built an enterprise hospitality platform combining a guest-facing direct booking engine with back-office room inventory, guest folios, and amenity scheduling.',
      project_importance: 'During high-demand peak travel seasons, telephone reservations and spreadsheet tracking created double-booking risks and billing delays. The resort required a reliable digital booking engine to capture direct guest revenue.'
    },
    challenges: [
      {
        title: 'Manual Booking Conflicts',
        description: 'Managing reservations through phone calls and paper ledgers led to overlap risks during peak holiday travel periods.'
      },
      {
        title: 'Limited Online Room Showcase',
        description: 'Prospective travelers could not view high-resolution room photos, balcony vistas, amenities, and seasonal rates.'
      },
      {
        title: 'High Third-Party Commissions',
        description: 'Over-reliance on external hotel aggregator portals drained significant profit margins from direct bookings.'
      },
      {
        title: 'Fragmented Guest Folios',
        description: 'Room charges, dining receipts, and excursion arrangements were tracked across separate systems, slowing checkout.'
      }
    ],
    solutions: [
      {
        title: 'Custom Digital Platform',
        description: 'A bespoke hospitality platform integrating front-desk reservation management with customer-facing booking.'
      },
      {
        title: 'Room & Amenity Showcase',
        description: 'Visual presentations of executive suites, family chalets, mountain dining, and guided excursion itineraries.'
      },
      {
        title: 'Responsive Experience',
        description: 'Streamlined mobile booking interface optimized for tourists researching accommodations while traveling.'
      },
      {
        title: 'Scalable Architecture',
        description: 'Engineered with atomic transactional locking to guarantee zero double-bookings under concurrent traffic.'
      }
    ],
    features: [
      'Interactive Room Availability Calendar',
      'Direct Guest Reservation & Inquiry Engine',
      'High-Resolution Room & Suite Gallery',
      'Multi-Tier Seasonal Pricing Management',
      'Automated Confirmation Notifications',
      'Dining, Conference & Excursion Showcase',
      'Front-Desk Guest Folio & Check-In Portal',
      'Executive Occupancy & Revenue Reporting'
    ],
    sarohub_role: [
      'UI/UX Design',
      'Frontend Development',
      'Backend Development',
      'Database Development',
      'API Development',
      'System Architecture',
      'Deployment & Optimization',
      'Quality Assurance Testing',
      'Technical Support'
    ],
    technologies: {
      frontend: 'React.js, TypeScript, Tailwind CSS',
      backend: 'Node.js, Express.js',
      database: 'PostgreSQL',
      architecture: 'RESTful API & Modular Web Architecture',
      tags: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Tailwind CSS']
    },
    results_impact: {
      metrics: [
        { metric: '0%', label: 'Double Booking Collision Rate', detail: 'Complete elimination of reservation overlap errors.' },
        { metric: '+48%', label: 'Direct Bookings Increase', detail: 'Substantially reduced reliance on high-fee third-party booking agents.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Zero Booking Collisions',
          description: 'Centralized digital room ledger completely eliminated double-booking headaches and front-desk confusion.'
        },
        {
          title: 'Higher Direct Reservations',
          description: 'Empowered travelers to reserve directly through the resort website, saving substantial third-party OTA commissions.'
        },
        {
          title: 'Elevated Brand Perception',
          description: 'Delivered an elegant digital presence that faithfully reflects the premium quality of the resort grounds.'
        },
        {
          title: 'Streamlined Check-In',
          description: 'Pre-registered booking data allowed front desk personnel to accelerate guest check-in significantly.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub gave us a direct booking system that transformed our operations. Double bookings are completely gone, and our direct inquiries from tourists have grown each month.',
      author: 'General Manager',
      role: 'Resort General Manager',
      company: 'The Crescent Resorts'
    },
    featured: true,
    order: 2
  },
  {
    id: 3,
    title: 'VG4 Super Store',
    slug: 'vg4-super-store',
    client_name: 'VG4 Super Store',
    industry: 'Retail',
    category: 'Retail',
    secondary_categories: ['Business Software'],
    project_type: 'Retail Point of Sale & Warehouse Inventory Platform',
    positioning_statement: 'Retail & business management system with ultra-fast POS and warehouse inventory.',
    short_description: 'An offline-capable, multi-terminal Point of Sale (POS) and automated warehouse inventory platform engineered for rapid barcode scanning and real-time stock sync.',
    what_we_solved: 'Replaced an unstable legacy billing tool with a sub-50ms barcode scanning POS and real-time inventory management system.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-06-10',
    thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://vg4superstore.com',
    overview: {
      client_background: 'VG4 Super Store is a high-volume department retail store handling thousands of customer transactions daily across groceries, electronics, and household goods.',
      industry_context: 'Supermarket & FMCG Retail Distribution',
      what_sarohub_built: 'SaroHub engineered a multi-terminal Point of Sale (POS) system with sub-50ms barcode scanning, local offline resilience, and centralized warehouse inventory management.',
      project_importance: 'Peak shopping hours caused checkout congestion and customer frustration. The legacy software crashed during connectivity drops and could not reconcile shelf stock with the central warehouse.'
    },
    challenges: [
      {
        title: 'Long Checkout Queues',
        description: 'Slow billing software caused long checkout queues during peak evening shopping hours.'
      },
      {
        title: 'Offline Vulnerability',
        description: 'Network or power disruptions froze terminals, stopping sales and receipt printing.'
      },
      {
        title: 'Warehouse Stock Blindspots',
        description: 'Lack of real-time inventory synchronization between the shop floor and warehouse storage.'
      },
      {
        title: 'Cashier Shift Discrepancies',
        description: 'Manual register closing led to reconciliation errors and delayed daily accounting.'
      }
    ],
    solutions: [
      {
        title: 'Custom Digital Platform',
        description: 'A purpose-built retail checkout platform designed specifically around cashier speed and keyboard hotkeys.'
      },
      {
        title: 'Offline-First Architecture',
        description: 'Integrated local cache enabling checkout registers to operate continuously even during network outages.'
      },
      {
        title: 'Real-Time Inventory Hub',
        description: 'Normalized database tracking thousands of SKUs across multiple terminals and backroom storage.'
      },
      {
        title: 'Scalable Architecture',
        description: 'Engineered with optimized SQL indexing capable of handling high daily transaction volume with zero lag.'
      }
    ],
    features: [
      'Sub-50ms Barcode Scanning & Keyboard Shortcuts',
      'Offline-First Local Sales Transaction Cache',
      'Thermal Receipt Printing & Digital SMS Invoices',
      'Automated Low-Stock Alerts & Reorder Reports',
      'Multi-Terminal Cashier Shift Reconciliation',
      'Multi-Category Warehouse Inventory Management',
      'Daily Sales, Profit Margins & Gross Telemetry',
      'Role-Based Permissions (Cashier, Manager, Admin)'
    ],
    sarohub_role: [
      'UI/UX Design',
      'Frontend Development',
      'Backend Development',
      'Database Development',
      'API Development',
      'System Architecture',
      'On-Premises Hardware Configuration',
      'Quality Assurance & Stress Testing',
      'Technical Support & Cashier Training'
    ],
    technologies: {
      frontend: 'React.js, Tailwind CSS',
      backend: 'Node.js, Express.js',
      database: 'MySQL, SQLite Local Cache',
      architecture: 'Offline-First Client with WebSockets Cloud Sync',
      tags: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'WebSockets', 'Tailwind CSS']
    },
    results_impact: {
      metrics: [
        { metric: '55%', label: 'Checkout Time Reduction', detail: 'Dramatically shortened cashier transaction queues.' },
        { metric: '5,000+', label: 'Daily Transactions Processed', detail: 'Continuous high-volume checkout with zero system downtime.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Faster Checkout Speed',
          description: 'Cashiers process customers rapidly with sub-50ms barcode lookups, eliminating bottleneck queues.'
        },
        {
          title: 'Zero Sales Interruptions',
          description: 'Offline-first database architecture keeps registers running smoothly through power and internet cuts.'
        },
        {
          title: 'Precise Stock Control',
          description: 'Warehouse staff and supervisors maintain real-time visibility over inventory levels and low-stock alerts.'
        },
        {
          title: 'Automated Shift Audits',
          description: 'Cashiers close shifts with one-click reconciliation, eliminating manual calculation discrepancies.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub\'s POS system changed how our store operates. Register lines move rapidly, the software never freezes when the internet drops, and stock counts are always accurate.',
      author: 'Supermarket Management',
      role: 'Operations Lead',
      company: 'VG4 Super Store'
    },
    featured: true,
    order: 3
  },
  {
    id: 4,
    title: 'Vanguard ERP Systems Suite',
    slug: 'vanguard-erp-systems',
    client_name: 'Vanguard Heavy Industries',
    industry: 'Heavy Manufacturing & Logistics',
    category: 'Business Software',
    secondary_categories: ['SaaS'],
    project_type: 'Enterprise Resource Planning (ERP)',
    positioning_statement: 'Unified ERP platform streamlining procurement, logistics, and multi-facility inventory.',
    short_description: 'A unified enterprise resource planning suite built to connect inventory, industrial procurement, and cross-facility logistics into a single real-time control center.',
    what_we_solved: 'Consolidated fragmented procurement spreadsheets into an automated enterprise resource planning platform.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-04-12',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://vanguard-erp.demo.sarohub.com',
    overview: {
      client_background: 'Vanguard Heavy Industries operates multi-facility industrial fabrication plants supplying construction and infrastructure materials.',
      industry_context: 'Industrial Manufacturing & Supply Chain Logistics',
      what_sarohub_built: 'SaroHub built an enterprise ERP suite integrating procurement pipelines, multi-warehouse stock audits, vendor purchase orders, and asset maintenance.',
      project_importance: 'Operating across disparate legacy databases caused duplicate orders, inventory holding expenses, and days of delay during quarterly financial audits.'
    },
    challenges: [
      {
        title: 'Fragmented Operations',
        description: 'Plant managers and procurement teams lacked a synchronized system to verify stock across regional facilities.'
      },
      {
        title: 'Slow Record Retrieval',
        description: 'Database query times for historical supply transactions hindered timely purchasing decisions.'
      },
      {
        title: 'Complex Audit Trails',
        description: 'Verifying purchase orders and vendor payments required tedious manual reconciliation.'
      }
    ],
    solutions: [
      {
        title: 'Custom Digital Platform',
        description: 'An integrated ERP system linking procurement, production floor inventory, and vendor accounts.'
      },
      {
        title: 'High-Performance Database',
        description: 'Normalized relational database architecture delivering sub-second reporting across enterprise records.'
      },
      {
        title: 'Strict Access Controls',
        description: 'Role-based permission hierarchy keeping sensitive operational metrics secure.'
      },
      {
        title: 'Scalable Architecture',
        description: 'Containerized deployment capable of onboarding additional manufacturing plants with zero downtime.'
      }
    ],
    features: [
      'Centralized Multi-Facility Inventory Matrix',
      'Automated Purchase Order & Vendor Workflow',
      'Equipment Maintenance Schedule & Log Tracker',
      'Executive KPI Dashboards & Real-Time Telemetry',
      'Immutable Audit Trail for Regulatory Compliance',
      'Automated Financial Closing & Invoice Dispatch'
    ],
    sarohub_role: [
      'UI/UX Design',
      'System Architecture',
      'Frontend Engineering',
      'Backend Development',
      'Database Optimization',
      'DevOps & Container Deployment',
      'Security & Audit Verification',
      'Enterprise SLA Support'
    ],
    technologies: {
      frontend: 'React.js, Tailwind CSS',
      backend: 'Node.js, Express.js',
      database: 'MySQL',
      architecture: 'Containerized Microservices on Kubernetes',
      tags: ['React.js', 'Node.js', 'MySQL', 'Kubernetes', 'Tailwind CSS']
    },
    results_impact: {
      metrics: [
        { metric: '72%', label: 'Record Lookup Speed Improvement', detail: 'Drastic reduction in database query latency across logistics hubs.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Streamlined Procurement',
          description: 'Replaced manual purchase orders with automated vendor routing and approval workflows.'
        },
        {
          title: 'Unified Business Data',
          description: 'Executive teams gain instantaneous visibility over plant inventory levels and pending orders.'
        },
        {
          title: 'Simplified Auditing',
          description: 'Built-in audit trails accelerated compliance certifications and financial reviews.'
        }
      ]
    },
    featured: true,
    order: 4
  },
  {
    id: 5,
    title: 'Apex E-Commerce Ecosystem',
    slug: 'apex-ecom-ecosystem',
    client_name: 'Apex Global Logistics',
    industry: 'Global Retail & Logistics',
    category: 'E-commerce / Commerce',
    secondary_categories: ['Web Applications'],
    project_type: 'High-Traffic E-Commerce Platform',
    positioning_statement: 'High-speed online shopping platform built to handle heavy visitor volume.',
    short_description: 'A high-speed e-commerce storefront engineered to process high visitor volume smoothly with integrated payment gateways and automated shipping routing.',
    what_we_solved: 'Built an optimized, high-concurrency online storefront with automated courier dispatch to prevent flash-sale cart crashes.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-06-15',
    thumbnail_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://apex-retail.demo.sarohub.com',
    overview: {
      client_background: 'Apex Global Logistics is an international commerce partner distributing consumer products and apparel across regional retail networks.',
      industry_context: 'E-Commerce Retail & Logistics Distribution',
      what_sarohub_built: 'A frictionless consumer storefront featuring instantaneous catalog search, secure payment processing, and automated warehouse picking labels.',
      project_importance: 'Flash sales previously crashed legacy web servers, causing abandoned shopping carts and lost customer orders during high-demand campaigns.'
    },
    challenges: [
      {
        title: 'Traffic Surges & Downtime',
        description: 'Seasonal promotions overwhelmed existing servers, causing checkout slowdowns and purchase drops.'
      },
      {
        title: 'Checkout Friction',
        description: 'Multi-step forms caused elevated cart abandonment rates among mobile buyers.'
      },
      {
        title: 'Manual Order Dispatch',
        description: 'Orders had to be manually entered into courier systems, creating fulfillment delays.'
      }
    ],
    solutions: [
      {
        title: 'High-Concurrency Storefront',
        description: 'Engineered with optimized server caching to handle thousands of simultaneous shoppers.'
      },
      {
        title: 'Streamlined Payment Gateway',
        description: 'Implemented 1-click accelerated checkout with automated fraud screening.'
      },
      {
        title: 'Automated Courier Webhooks',
        description: 'Successful orders automatically push dispatch manifests to fulfillment partner depots.'
      },
      {
        title: 'Scalable Architecture',
        description: 'Modular microservice design prepared for multi-currency expansion and localized storefronts.'
      }
    ],
    features: [
      'High-Concurrency Flash-Sale Storefront',
      '1-Click Streamlined Mobile Checkout',
      'Automated Fraud & Transaction Verification',
      'Real-Time Warehouse Stock Availability',
      'Courier Tracking & SMS Delivery Updates',
      'Customer Account & Order History Portal'
    ],
    sarohub_role: [
      'UI/UX Design',
      'Frontend Development',
      'Backend API Development',
      'Payment Gateway Integration',
      'Performance Optimization',
      'Cloud Scalability Testing'
    ],
    technologies: {
      frontend: 'React.js, Tailwind CSS',
      backend: 'Express.js, Node.js',
      database: 'MySQL',
      architecture: 'Event-Driven Architecture & Stripe API',
      tags: ['React.js', 'Express.js', 'MySQL', 'Stripe API', 'Tailwind CSS']
    },
    results_impact: {
      qualitative_outcomes: [
        {
          title: 'Zero Flash-Sale Downtime',
          description: 'Successfully maintained 100% storefront uptime during peak high-volume marketing campaigns.'
        },
        {
          title: 'Faster Order Fulfillment',
          description: 'Automated courier dispatch routing shortened warehouse packing and shipment dispatch cycles.'
        },
        {
          title: 'Higher Checkout Conversion',
          description: 'Friction-free mobile checkout flow significantly reduced customer cart abandonment.'
        }
      ]
    },
    featured: false,
    order: 5
  },
  {
    id: 6,
    title: 'Aura AI Cognitive Agent',
    slug: 'aura-ai-agent',
    client_name: 'Aura Financial Advisory',
    industry: 'Financial Advisory & Compliance',
    category: 'SaaS',
    secondary_categories: ['Web Applications'],
    project_type: 'Intelligent Compliance & Analytics Suite',
    positioning_statement: 'Intelligent financial assistant automating regulatory compliance and data analysis.',
    short_description: 'An intelligent enterprise software assistant that automates compliance auditing, financial forecasting, and regulatory filing verification.',
    what_we_solved: 'Automated multi-hundred page compliance audits and forecasting into an interactive AI-assisted executive dashboard.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-05-30',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://aura-ai.demo.sarohub.com',
    overview: {
      client_background: 'Aura Financial Advisory provides wealth management, corporate structuring, and cross-border regulatory compliance services.',
      industry_context: 'Financial Advisory, Wealth Management & Fintech',
      what_sarohub_built: 'SaroHub engineered a secure document ingestion and cognitive analysis platform that flags compliance risks and generates structured executive briefs.',
      project_importance: 'Senior analysts spent dozens of hours reviewing dense legal and financial filings manually, limiting client onboarding capacity.'
    },
    challenges: [
      {
        title: 'Manual Audit Overhead',
        description: 'Reading multi-hundred-page corporate balance sheets and tax disclosures manually created turnaround bottlenecks.'
      },
      {
        title: 'Risk of Human Oversight',
        description: 'Crucial regulatory clauses and fine-print amendments could be overlooked during rush filing windows.'
      },
      {
        title: 'Strict Data Privacy',
        description: 'Financial documents required zero-retention processing with strict confidentiality guarantees.'
      }
    ],
    solutions: [
      {
        title: 'Custom Cognitive Platform',
        description: 'A purpose-built financial intelligence suite leveraging secure document embedding and contextual parsing.'
      },
      {
        title: 'Visual Executive Dashboards',
        description: 'Instant visualization of liquidity ratios, compliance flags, and multi-year forecasting models.'
      },
      {
        title: 'Secure Ingestion Pipeline',
        description: 'Zero data retention protocols ensuring client financial records are never used for model training.'
      },
      {
        title: 'Scalable Architecture',
        description: 'Built with asynchronous processing queues capable of parsing multiple large filings simultaneously.'
      }
    ],
    features: [
      'Automated Corporate Filing Ingestion & Parsing',
      'Regulatory Compliance Flagging & Citation Links',
      'Interactive Cashflow & Capital Forecasting',
      'Executive Summary PDF Export Generator',
      'Role-Based Analyst Permissions & Audit Trail'
    ],
    sarohub_role: [
      'AI Systems Architecture',
      'UI/UX Design',
      'Frontend & Backend Engineering',
      'Vector Database Setup',
      'Privacy & Security Verification',
      'Deployment & Testing'
    ],
    technologies: {
      frontend: 'React.js, TypeScript, Tailwind CSS',
      backend: 'Express.js, Node.js',
      database: 'Vector DB, PostgreSQL',
      architecture: 'Gemini API & Secure Document Microservice',
      tags: ['Gemini API', 'TypeScript', 'Vector DB', 'Express.js', 'Tailwind CSS']
    },
    results_impact: {
      qualitative_outcomes: [
        {
          title: 'Accelerated Audit Turnaround',
          description: 'Reduced initial filing analysis time from days to under thirty minutes per client portfolio.'
        },
        {
          title: 'Enhanced Analytical Accuracy',
          description: 'Automated compliance rule-checking caught subtle discrepancies that previously required repeated reviews.'
        },
        {
          title: 'Enterprise Confidentiality',
          description: 'Delivered an isolated, compliant processing environment protecting all proprietary client information.'
        }
      ]
    },
    featured: false,
    order: 6
  },
  {
    id: 7,
    title: 'Apex Performance & Growth — Multi-Channel Digital Marketing & SEO Campaign',
    slug: 'apex-growth-marketing',
    client_name: 'Apex Retail Group',
    industry: 'E-Commerce & Consumer Retail',
    category: 'Digital Marketing',
    secondary_categories: ['E-commerce / Commerce', 'Web Applications'],
    project_type: 'Multi-Channel Performance Marketing, Technical SEO & Paid Ads Campaign',
    positioning_statement: 'High-ROAS Google & Meta performance ad engine with conversion rate optimization and technical SEO.',
    short_description: 'Full-funnel digital marketing campaign executed by SaroHub: restructured Google Search/Shopping ads, deployed Meta lookalike funnels, resolved critical SEO indexation bottlenecks, and configured automated email recovery workflows.',
    what_we_solved: 'Eliminated wasted ad spend by restructuring campaigns, resolving technical SEO crawl errors, and engineering high-converting landing pages that elevated ROAS from 1.4x to 4.6x.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-07-10',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://apexretail.com',
    overview: {
      client_background: 'Apex Retail Group is a fast-scaling multi-category consumer e-commerce retailer offering lifestyle goods, electronics, and home essentials.',
      industry_context: 'Digital Commerce, Paid Media & Multi-Channel Acquisition',
      what_sarohub_built: 'SaroHub architected and executed an end-to-end digital marketing growth engine: paid media restructuring across Google Ads and Meta, server-side Conversion API (CAPI) attribution, technical SEO remediation, and high-converting landing page redesigns.',
      project_importance: 'Rising customer acquisition costs and low organic visibility were eroding margins. Apex required a proven digital growth partner to optimize paid spend, maximize ROAS, and establish sustainable organic search dominance.'
    },
    challenges: [
      {
        title: 'Unprofitable Ad Spend (1.4x ROAS)',
        description: 'Previous ad campaigns targeted broad, unqualified keywords and unsegmented audiences, burning budget without generating profitable purchases.'
      },
      {
        title: 'High Landing Page Bounce Rates',
        description: 'Visitors were bouncing within 5 seconds due to slow mobile loading speeds, cluttered navigation, and friction in the checkout funnel.'
      },
      {
        title: 'Inaccurate Conversion Attribution',
        description: 'Browser cookie blocking and missing server-side event tracking caused significant data loss in Google Analytics and Meta Ads Manager.'
      },
      {
        title: 'Depressed Organic Visibility',
        description: 'Over 4,000 product pages were poorly indexed due to canonicalization issues, missing schema markup, and sluggish Core Web Vitals.'
      }
    ],
    solutions: [
      {
        title: 'Full-Funnel Paid Advertising Engine',
        description: 'Restructured Google Search, Shopping, Performance Max, and Meta lookalike audience funnels with strict negative keyword lists and creative testing sprints.'
      },
      {
        title: 'Conversion Rate Optimization (CRO)',
        description: 'Engineered lightweight, mobile-first product landing pages and a streamlined single-page checkout that improved conversion rate from 1.2% to 3.4%.'
      },
      {
        title: 'Server-Side CAPI & GA4 Attribution',
        description: 'Deployed Google Tag Manager server-side containers and Meta Conversions API to recover 100% of purchase event signals with zero cookie loss.'
      },
      {
        title: 'Technical SEO & Content Architecture',
        description: 'Audited and fixed crawl errors, deployed rich Product and Breadcrumb JSON-LD schema, and targeted high-intent commercial search terms.'
      }
    ],
    features: [
      'Google Search, Shopping & Performance Max Campaigns',
      'Meta (Facebook & Instagram) Dynamic Product Retargeting',
      'Server-Side Conversion API (CAPI) & GA4 Attribution',
      'Technical SEO Audit, Schema Markup & Crawl Optimization',
      'High-Converting Landing Page UI/UX & A/B Testing',
      'Automated Klaviyo Email Abandoned Cart Sequences',
      'Weekly Transparent ROAS, CPA & Spend Analytics Portal',
      'Iterative Creative Ad Copy & Video Reels Production'
    ],
    sarohub_role: [
      'Digital Marketing Strategy',
      'Paid Ads Campaign Architecture',
      'Technical SEO Implementation',
      'Conversion Rate Optimization (CRO)',
      'Server-Side Event Tagging & Analytics',
      'Landing Page UX Engineering',
      'Performance Reporting & Optimization'
    ],
    technologies: {
      frontend: 'Google Ads, Meta Ads Manager',
      backend: 'Google Tag Manager Server Container',
      database: 'Google Analytics 4 & BigQuery',
      architecture: 'Full-Funnel Growth & Multi-Touch Attribution Engine',
      tags: ['Google Ads', 'Meta Ads', 'Google Analytics 4', 'Google Tag Manager', 'SEMrush', 'Technical SEO', 'Klaviyo', 'CRO']
    },
    results_impact: {
      metrics: [
        { metric: '4.6x', label: 'Average ROAS', detail: 'Increased return on ad spend across Google and Meta paid channels.' },
        { metric: '+340%', label: 'Organic Traffic Growth', detail: 'Substantial surge in non-branded organic search impressions and clicks.' },
        { metric: '-42%', label: 'Reduced CAC', detail: 'Lowered customer acquisition cost through conversion rate optimization.' },
        { metric: '18,500+', label: 'Orders Generated', detail: 'Direct purchase conversions driven through optimized campaigns.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Predictable Customer Acquisition',
          description: 'Replaced erratic ad results with a predictable, scalable customer acquisition machine that consistently delivers positive unit economics.'
        },
        {
          title: 'Authoritative Organic Ranking',
          description: 'Achieved first-page rankings on Google for high-converting category keywords, creating an evergreen stream of free customer traffic.'
        },
        {
          title: 'Complete Data Transparency',
          description: 'Empowered executive leadership with real-time attribution dashboards showing exact ROAS, CPA, and customer lifetime value per ad dollar.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub revolutionized our customer acquisition. In three months, our ROAS climbed from 1.4x to over 4.6x while our organic search traffic tripled. They don\'t just run ads—they understand unit economics, conversion psychology, and technical tracking.',
      author: 'Marcus Vance',
      role: 'Chief Commercial Officer',
      company: 'Apex Retail Group'
    },
    featured: true,
    order: 2
  },
  {
    id: 8,
    title: 'The Crescent Hospitality — Tourism SEO & Paid Booking Acquisition Campaign',
    slug: 'crescent-digital-marketing',
    client_name: 'The Crescent Resorts & Hospitality',
    industry: 'Hospitality & Luxury Tourism',
    category: 'Digital Marketing',
    secondary_categories: ['Hospitality', 'Websites'],
    project_type: 'Local SEO, Google Travel Ads & Social Media Marketing Campaign',
    positioning_statement: 'Targeted hospitality marketing driving a 210% increase in direct resort bookings.',
    short_description: 'A multi-channel tourism marketing campaign combining Google Local 3-Pack optimization, Google Travel ads, high-intent travel keyword content, and targeted Meta video campaigns to acquire direct guests with zero OTA commission.',
    what_we_solved: 'Freed the resort from paying 18-22% commissions to third-party travel agencies (OTAs) by establishing a high-converting direct booking acquisition engine.',
    status: 'Delivered',
    engagement: 'Client Project',
    completion_date: '2026-06-18',
    thumbnail_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200&h=675',
    screenshots: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200&h=675',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200&h=675'
    ],
    live_url: 'https://thecrescentresorts.com',
    overview: {
      client_background: 'The Crescent Resorts operates luxury boutique resort destinations in northern Pakistan, catering to domestic travelers, international adventurers, and corporate retreats.',
      industry_context: 'Hospitality Digital Marketing, Local SEO & Travel Acquisition',
      what_sarohub_built: 'SaroHub implemented a regional and international digital marketing campaign combining Google Business Profile optimization, localized high-intent travel keyword SEO, targeted Meta travel reels, and automated booking inquiry routing.',
      project_importance: 'The resort was losing significant profit margins to third-party online travel agencies (OTAs) taking up to 22% in commission fees. They needed a high-performance direct digital marketing channel.'
    },
    challenges: [
      {
        title: 'Heavy OTA Commission Dependency',
        description: 'Over 80% of bookings came through third-party platforms charging exorbitant 18-22% commissions per stay.'
      },
      {
        title: 'Underdeveloped Local & Regional Search Presence',
        description: 'The resort was missing out on travelers searching for luxury resort stays, honeymoon packages, and mountain retreats on Google Maps.'
      },
      {
        title: 'Seasonal Demand Volatility',
        description: 'Inconsistent off-season bookings led to unoptimized occupancy rates during shoulder months.'
      }
    ],
    solutions: [
      {
        title: 'Local SEO & Google 3-Pack Optimization',
        description: 'Optimized Google Business Profiles, citation directories, and localized hotel schema markup, securing #1 rankings for northern resort searches.'
      },
      {
        title: 'Google Travel & Search Ads',
        description: 'Launched targeted pay-per-click ads for high-intent search terms (e.g. "luxury resort Skardu", "best hotel Shangrila", "honeymoon suites").'
      },
      {
        title: 'Meta Visual Storytelling & Reels Ads',
        description: 'Created scenic, experiential video reels targeting adventure travelers and corporate event planners in major metropolitan cities.'
      }
    ],
    features: [
      'Google Business Profile & Local 3-Pack Domination',
      'Targeted Google Search & Travel Hotel Campaigns',
      'Meta Experiential Video & Story Ads',
      'Direct WhatsApp Booking Fast-Track Integration',
      'Seasonal Corporate Retreat & Honeymoon Campaign Funnels',
      'Review Management & Reputation Growth Workflow'
    ],
    sarohub_role: [
      'Tourism Marketing Strategy',
      'Local SEO & Google Maps Optimization',
      'Paid Search & Social Media Advertising',
      'Ad Creative Direction & Video Reels Production',
      'Lead Generation & Booking Optimization'
    ],
    technologies: {
      frontend: 'Google Ads, Meta Business Manager',
      backend: 'Google Business Profile API',
      database: 'Google Analytics 4 & Looker Studio',
      architecture: 'Direct Hospitality Booking Funnel',
      tags: ['Local SEO', 'Google Ads', 'Meta Ads', 'Tourism Marketing', 'Google Maps', 'Hospitality Growth']
    },
    results_impact: {
      metrics: [
        { metric: '+210%', label: 'Direct Bookings Boost', detail: 'Dramatic growth in commission-free guest reservations.' },
        { metric: '#1 Rank', label: 'Google Local 3-Pack', detail: 'Top position for primary regional luxury hospitality searches.' },
        { metric: '3.8x', label: 'Ad Spend ROAS', detail: 'Return on ad spend across seasonal holiday campaigns.' },
        { metric: '120k+', label: 'Targeted Video Views', detail: 'Engaged potential luxury travelers across Instagram and Facebook.' }
      ],
      qualitative_outcomes: [
        {
          title: 'Direct Revenue Independence',
          description: 'Reduced reliance on costly travel agencies, saving substantial commission fees each tourist season.'
        },
        {
          title: 'Elevated Brand Prestige',
          description: 'Established the resort as the premier luxury destination in the region through consistent, high-aesthetic visual marketing.'
        }
      ]
    },
    testimonial: {
      quote: 'SaroHub\'s digital marketing and local SEO strategy transformed our revenue model. Over 65% of our seasonal suite reservations now come directly through our own channels rather than costly travel agency portals.',
      author: 'Karim Shah',
      role: 'General Manager',
      company: 'The Crescent Resorts'
    },
    featured: true,
    order: 3
  }
];

// Helper functions
export function getAllClientProjects(): ClientProject[] {
  return [...CLIENT_PROJECTS].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getClientProjectBySlug(slug: string): ClientProject | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return CLIENT_PROJECTS.find(p => 
    p.slug.toLowerCase() === normalized || 
    String(p.id) === normalized
  );
}

// Available categories that actually have projects
export const STANDARD_CATEGORIES = [
  'All',
  'Digital Marketing',
  'Web Applications',
  'Websites',
  'SaaS',
  'Business Software',
  'E-commerce / Commerce',
  'Hospitality',
  'Retail',
  'Education',
  'Other'
] as const;

export function getAvailableCategories(projectsList: ClientProject[] = CLIENT_PROJECTS): string[] {
  const activeSet = new Set<string>();
  
  projectsList.forEach(p => {
    if (p.category) activeSet.add(p.category);
    if (Array.isArray(p.secondary_categories)) {
      p.secondary_categories.forEach(c => activeSet.add(c));
    }
  });

  // Keep standard ordering, only including categories that have projects
  const available: string[] = ['All'];
  STANDARD_CATEGORIES.forEach(cat => {
    if (cat !== 'All' && activeSet.has(cat)) {
      available.push(cat);
    }
  });

  // Also catch any custom admin categories that might exist
  activeSet.forEach(cat => {
    if (!available.includes(cat)) {
      available.push(cat);
    }
  });

  return available;
}
