import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, Globe, Github, Calendar, Briefcase, Check, Award,
  Quote, ChevronLeft, ChevronRight, X, ZoomIn, Cpu, ArrowUpRight, 
  Building2, CheckSquare, Layers, Sparkles, MessageSquare, Terminal,
  Server, Database, Code2, ShieldCheck, HelpCircle, ExternalLink, CheckCircle2
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import { api } from '../api';
import { 
  getClientProjectBySlug, getAllClientProjects, ClientProject 
} from '../data/clientProjectsData';
import { getCaseStudyBySlug } from '../data/seoContent';

export default function ProjectDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any | null>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [testimonial, setTestimonial] = useState<any | null>(null);
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadProjectData() {
      if (!slug) return;
      
      const richStaticProject = getClientProjectBySlug(slug);
      let loadedProject: any = null;

      try {
        // 1. Fetch project and all projects from API
        const [dbProject, projectsList] = await Promise.all([
          api.getProject(slug).catch(() => null),
          api.getProjects().catch(() => [])
        ]);

        if (isMounted && Array.isArray(projectsList) && projectsList.length > 0) {
          setAllProjects(projectsList);
        }

        if (dbProject) {
          loadedProject = richStaticProject ? { ...richStaticProject, ...dbProject } : dbProject;
        }
      } catch (err) {
        console.warn('API getProject fallback to static client projects data:', err);
      }

      // 2. Fallback to rich clientProjectsData
      if (!loadedProject && richStaticProject) {
        loadedProject = richStaticProject;
      }

      // 3. Fallback to seoContent case study
      if (!loadedProject) {
        const staticCaseStudy = getCaseStudyBySlug(slug || '');
        if (staticCaseStudy) {
          loadedProject = {
            title: staticCaseStudy.title,
            slug: staticCaseStudy.slug,
            client_name: staticCaseStudy.clientName,
            category: staticCaseStudy.industry,
            industry: staticCaseStudy.industry,
            project_type: 'Bespoke Enterprise Software',
            positioning_statement: staticCaseStudy.shortDescription,
            short_description: staticCaseStudy.shortDescription,
            what_we_solved: 'Engineered custom digital architecture solving operational bottlenecks.',
            description: staticCaseStudy.overview,
            overview: {
              client_background: staticCaseStudy.overview,
              industry_context: staticCaseStudy.industry,
              what_sarohub_built: staticCaseStudy.sarohubSolution,
              project_importance: staticCaseStudy.clientProblem
            },
            challenges: [
              { title: 'Operational Bottleneck', description: staticCaseStudy.clientProblem }
            ],
            solutions: [
              { title: 'Targeted Engineering', description: staticCaseStudy.sarohubSolution }
            ],
            features: staticCaseStudy.keyFeatures || [],
            sarohub_role: ['UI/UX Design', 'Full-Stack Development', 'Cloud Deployment'],
            technologies: {
              tags: staticCaseStudy.technologies || []
            },
            results_impact: {
              qualitative_outcomes: [
                { title: 'Accelerated Operations', description: 'Streamlined workflows and improved reliability.' }
              ]
            },
            thumbnail_url: staticCaseStudy.bannerImage,
            screenshots: [staticCaseStudy.bannerImage],
            status: 'Delivered',
            engagement: 'Client Project',
            completion_date: staticCaseStudy.completionDate,
            live_url: '',
            github_url: ''
          };
        }
      }

      if (isMounted) {
        if (loadedProject) {
          setProject(loadedProject);

          // Handle testimonial
          if (loadedProject.testimonial) {
            setTestimonial(loadedProject.testimonial);
          } else if (loadedProject.testimonial_id) {
            try {
              const testimonials = await api.getTestimonials();
              const matched = testimonials.find((t: any) => t.id === loadedProject.testimonial_id);
              if (matched && isMounted) setTestimonial(matched);
            } catch (err) {
              console.error('Failed to load project testimonial', err);
            }
          }
        }
        setLoading(false);
      }
    }

    loadProjectData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleDataUpdated = () => {
      loadProjectData();
    };
    window.addEventListener('sarohub-data-updated', handleDataUpdated);

    return () => { 
      isMounted = false; 
      window.removeEventListener('sarohub-data-updated', handleDataUpdated);
    };
  }, [slug]);

  // Gallery images normalization
  const validGallery: string[] = useMemo(() => {
    if (!project) return [];
    const pool = [
      ...(Array.isArray(project.screenshots) ? project.screenshots : []),
      ...(Array.isArray(project.gallery) ? project.gallery : []),
      project.thumbnail_url,
      project.image_url
    ].filter(Boolean);
    return Array.from(new Set(pool));
  }, [project]);

  // Normalized Tech List
  const techList: string[] = useMemo(() => {
    if (!project) return [];
    if (project.technologies?.tags && Array.isArray(project.technologies.tags)) {
      return project.technologies.tags;
    }
    if (Array.isArray(project.technologies)) {
      return project.technologies;
    }
    if (typeof project.technologies === 'string') {
      return project.technologies.split(',').map((t: string) => t.trim());
    }
    return [];
  }, [project]);

  // Related Projects for Section 14: "More Client Work"
  const relatedProjects = useMemo(() => {
    if (!project) return [];
    const sourceList = allProjects && allProjects.length > 0 ? allProjects : getAllClientProjects();
    const others = sourceList.filter((p: any) => p.slug !== project.slug && String(p.id) !== String(project.id));
    
    // Prefer matching category or secondary categories
    const matching = others.filter((p: any) => p.category === project.category);
    const nonMatching = others.filter((p: any) => p.category !== project.category);
    return [...matching, ...nonMatching].slice(0, 3);
  }, [project, allProjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Loading Case Study...
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center p-8 rounded-2xl bg-slate-900 border border-slate-800">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Case Study Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">
            The requested client work case study does not exist or has been relocated.
          </p>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
          >
            <span>Return to Selected Client Work</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const openModalAt = (idx: number) => {
    setActiveImageIndex(idx);
    setActiveImageModal(validGallery[idx]);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (activeImageIndex + 1) % validGallery.length;
    setActiveImageIndex(nextIdx);
    setActiveImageModal(validGallery[nextIdx]);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (activeImageIndex - 1 + validGallery.length) % validGallery.length;
    setActiveImageIndex(prevIdx);
    setActiveImageModal(validGallery[prevIdx]);
  };

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${project.title} — Client Case Study`,
    "description": project.short_description || project.positioning_statement,
    "image": project.thumbnail_url,
    "author": {
      "@type": "Organization",
      "name": "SaroHub Technologies",
      "url": "https://sarohub.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SaroHub Technologies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sarohub.com/logo.png"
      }
    }
  };

  // Extract structured challenges & solutions
  const challengesList: Array<{ title: string; description: string }> = 
    project.challenges && Array.isArray(project.challenges) && project.challenges.length > 0
      ? project.challenges
      : project.problem_challenge
      ? project.problem_challenge.split('\n').filter(Boolean).map((line: string) => {
          const parts = line.split(':');
          return {
            title: parts[0]?.trim() || 'Key Challenge',
            description: parts.slice(1).join(':').trim() || line
          };
        })
      : [
          { title: 'Digital Accessibility', description: 'The client required an intuitive, modern platform to connect with users seamlessly.' },
          { title: 'Operational Efficiency', description: 'Legacy workflows caused delays and required unified digital synchronization.' }
        ];

  const solutionsList: Array<{ title: string; description: string }> = 
    project.solutions && Array.isArray(project.solutions) && project.solutions.length > 0
      ? project.solutions
      : project.solution
      ? project.solution.split('\n').filter(Boolean).map((line: string) => {
          const parts = line.split(':');
          return {
            title: parts[0]?.trim() || 'Tailored Solution',
            description: parts.slice(1).join(':').trim() || line
          };
        })
      : [
          { title: 'Custom Digital Architecture', description: 'A purpose-built web platform engineered directly around the client\'s workflow.' },
          { title: 'High-Performance Foundation', description: 'Modular, scalable system ready for high concurrency and future expansions.' }
        ];

  // Features list
  const featuresList: string[] = 
    project.features && Array.isArray(project.features) && project.features.length > 0
      ? project.features
      : project.key_features && Array.isArray(project.key_features)
      ? project.key_features
      : typeof project.key_features === 'string'
      ? project.key_features.split('\n').filter(Boolean)
      : [
          'Responsive Multi-Device Interface',
          'High-Speed Architecture & Low Latency',
          'Role-Based Administrative Management',
          'Secure Data Ingestion & Storage'
        ];

  // SaroHub's Role
  const roleList: string[] = 
    project.sarohub_role && Array.isArray(project.sarohub_role) && project.sarohub_role.length > 0
      ? project.sarohub_role
      : [
          'UI/UX Design',
          'Frontend Development',
          'Backend Development',
          'Database Development',
          'API Development',
          'System Architecture',
          'Deployment & Cloud Setup',
          'Quality Assurance Testing',
          'Technical Support'
        ];

  // Results & Impact
  const metricResults = project.results_impact?.metrics || (Array.isArray(project.results_impact) ? project.results_impact : []);
  const qualitativeResults = project.results_impact?.qualitative_outcomes || [
    { title: 'Improved Visibility', description: 'Established a commanding digital presence enabling customers to access offerings anytime.' },
    { title: 'Streamlined Operations', description: 'Eliminated manual bottlenecks and provided centralized digital management.' },
    { title: 'Future-Proof Foundation', description: 'Engineered a scalable codebase ready to support upcoming business expansion.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      <SEOHead
        title={`${project.title} — Case Study | SaroHub Technologies`}
        description={project.short_description || project.positioning_statement || `Discover how SaroHub Technologies built ${project.title} for ${project.client_name}.`}
        canonicalUrl={`https://sarohub.com/projects/${project.slug || project.id}`}
        ogType="article"
        ogImage={project.thumbnail_url}
        structuredData={structuredData}
      />

      {/* Breadcrumb Navigation Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: 'Home', url: '/' },
              { name: 'Selected Client Work', url: '/work' },
              { name: project.title, url: `/projects/${project.slug || project.id}`, isCurrent: true }
            ]}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/70 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Briefcase className="h-3.5 w-3.5" /> {project.industry || project.category || 'Client Solution'}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {project.status || 'Delivered'}
              </span>

              {project.completion_date && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-800">
                  <Calendar className="h-3.5 w-3.5" /> Delivered: {project.completion_date}
                </span>
              )}
            </div>

            {/* Project Name */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              {project.title}
            </h1>

            {/* One-Line Positioning Statement */}
            <p className="mt-4 text-lg sm:text-xl font-semibold text-blue-400 leading-relaxed">
              {project.positioning_statement || project.short_description}
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-xs font-bold text-white transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  <Globe className="h-4 w-4" />
                  <span>Launch Live Project</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-950/30 hover:bg-blue-950/60 px-5 py-3 text-xs font-semibold text-blue-300 transition-all"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 px-5 py-3 text-xs font-semibold text-slate-300 transition-all"
              >
                <span>All Client Work</span>
              </Link>
            </div>
          </div>

          {/* Large Project Hero Image */}
          {project.thumbnail_url && (
            <div 
              onClick={() => openModalAt(0)}
              className="mt-12 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group cursor-pointer"
            >
              <img
                src={project.thumbnail_url}
                alt={`${project.title} interface showcase`}
                className="w-full h-80 sm:h-[480px] lg:h-[540px] object-cover transition-transform duration-700 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end justify-between p-6">
                <span className="text-xs font-mono text-blue-300 font-bold flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/10">
                  <ZoomIn className="h-4 w-4" /> Click to enlarge full screen
                </span>
                <span className="text-xs font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/10">
                  {validGallery.length} Image{validGallery.length > 1 ? 's' : ''} in Showcase
                </span>
              </div>
            </div>
          )}

          {/* Section 10: Project Metadata Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Client</span>
              <span className="text-xs sm:text-sm font-bold text-white block truncate">{project.client_name || project.title}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Industry</span>
              <span className="text-xs sm:text-sm font-bold text-blue-400 block truncate">{project.industry || project.category}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Project Type</span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 block truncate">{project.project_type || 'Custom Web Application'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Engagement</span>
              <span className="text-xs sm:text-sm font-bold text-slate-200 block truncate">{project.engagement || 'Client Project'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Technology</span>
              <span className="text-xs sm:text-sm font-bold text-cyan-400 block truncate">
                {project.technologies?.architecture || (techList.length > 0 ? techList.slice(0, 2).join(', ') : 'MERN Stack')}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Status</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 block flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {project.status || 'Delivered'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 01 — OVERVIEW */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 block mb-2">
              01 — Overview
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Understanding the Client & Project Mandate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Who the Client Is</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.overview?.client_background || `${project.client_name} is an ambitious commercial business seeking to expand its operational capabilities and customer reach.`}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Industry Context</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.overview?.industry_context || `Operating in the ${project.industry || project.category} sector with a focus on speed, customer accessibility, and dependable service.`}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-bold text-white">What SaroHub Built</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.overview?.what_sarohub_built || project.what_we_solved || `Engineered a custom, production-ready digital platform tailored to ${project.client_name}'s daily operational requirements.`}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Why It Was Important</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.overview?.project_importance || project.description || 'The project addressed critical operational bottlenecks, modernized client interactions, and laid the foundation for sustainable scale.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 — THE CHALLENGE & 03 — OUR SOLUTION */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* 02 — The Challenge */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400 block mb-2">
                  02 — The Challenge
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Business Problems Faced by the Client
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Before SaroHub was engaged, the business contended with operational friction and systemic bottlenecks:
                </p>
              </div>

              <div className="space-y-3">
                {challengesList.map((ch, i) => (
                  <div 
                    key={i} 
                    className="p-5 rounded-2xl bg-rose-950/10 border border-rose-900/30 hover:border-rose-900/50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Problem 0{i + 1}
                      </span>
                      <h4 className="font-display text-sm sm:text-base font-bold text-white">
                        {ch.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                      {ch.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 03 — Our Solution */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-2">
                  03 — Our Solution
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  How SaroHub Solved the Problem
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  We engineered a targeted, resilient software system tailored directly to their operational realities:
                </p>
              </div>

              <div className="space-y-3">
                {solutionsList.map((sol, i) => (
                  <div 
                    key={i} 
                    className="p-5 rounded-2xl bg-emerald-950/10 border border-emerald-900/30 hover:border-emerald-900/50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Solution 0{i + 1}
                      </span>
                      <h4 className="font-display text-sm sm:text-base font-bold text-white">
                        {sol.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                      {sol.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 — KEY FEATURES */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 block mb-2">
              04 — Key Features
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Delivered Capabilities & System Modules
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every feature was designed to solve a specific operational need and deliver immediate business utility:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuresList.map((feature, i) => (
              <div 
                key={i} 
                className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-blue-500/30 transition-all group"
              >
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-display text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {feature}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 — SAROHUB'S ROLE */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 block mb-2">
              05 — SaroHub's Role
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Full-Cycle Engineering & Strategic Execution
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              SaroHub functioned as an embedded technology partner across the complete software delivery lifecycle:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {roleList.map((roleItem, i) => (
              <div 
                key={i} 
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2 hover:border-blue-500/40 transition-colors"
              >
                <div className="w-8 h-8 mx-auto rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold">
                  0{i + 1}
                </div>
                <span className="block text-xs font-bold text-slate-200">
                  {roleItem}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06 — TECHNOLOGY (Placed further down so it does not dominate) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-2">
              06 — Technology
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Architecture & Technology Stack
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              We selected modern, battle-tested technologies chosen specifically for stability, low latency, and long-term maintainability:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Frontend</span>
                <Code2 className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                {project.technologies?.frontend || 'React.js, Tailwind CSS'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Responsive, component-driven client architecture designed for fast render speeds and smooth mobile interactions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Backend</span>
                <Server className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                {project.technologies?.backend || 'Node.js, Express.js'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-throughput REST API with asynchronous request pipelines, tokenized security, and robust error validation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Database</span>
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                {project.technologies?.database || 'PostgreSQL / MySQL'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optimized relational or document schemas with indexed query paths ensuring rapid data lookups and zero collisions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Architecture</span>
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-display text-base font-bold text-white">
                {project.technologies?.architecture || 'Modular Monolith / Cloud'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clean separation of concerns with containerized deployment scripts and continuous monitoring.
              </p>
            </div>
          </div>

          {/* Technology Tag Pills */}
          {techList.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 mr-2">Key Stack Components:</span>
              {techList.map((t, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-950 border border-slate-800 text-cyan-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07 — RESULTS & IMPACT */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-2">
              07 — Results & Impact
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Verified Business Outcomes & Measurable Delivery
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              We focus on delivering measurable operational improvements, customer satisfaction, and reliable technology:
            </p>
          </div>

          {/* Verified Metric Highlights (if verified data exists) */}
          {metricResults.length > 0 && (
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {metricResults.map((m: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-2">
                  <span className="block font-display text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                    {m.metric || '100%'}
                  </span>
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                    {m.label}
                  </h4>
                  {m.detail && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {m.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Qualitative Impact Outcomes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualitativeResults.map((item: any, i: number) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="font-display text-base font-bold text-white">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08 — PROJECT SHOWCASE (GALLERY) */}
      {/* ========================================================================= */}
      {validGallery.length > 0 && (
        <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 block mb-2">
                  08 — Project Showcase
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Interface Gallery & System Screenshots
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">
                  Click any screenshot to view full resolution.
                </p>
              </div>

              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
                {validGallery.length} Image{validGallery.length > 1 ? 's' : ''} in Showcase
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {validGallery.map((img: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => openModalAt(idx)}
                  className="rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 bg-slate-900 group aspect-video cursor-pointer relative shadow-lg transition-all hover:scale-101"
                >
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <ZoomIn className="h-4 w-4" /> View Fullscreen
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 09 — CLIENT FEEDBACK (Shown ONLY if verified testimonial exists) */}
      {/* ========================================================================= */}
      {testimonial && (
        <section className="py-16 sm:py-20 border-b border-slate-800/80">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/30 border border-blue-500/30 relative overflow-hidden shadow-2xl">
              <Quote className="absolute -top-4 -right-4 h-32 w-32 text-blue-500/5 pointer-events-none" />
              
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 block mb-4">
                09 — Client Feedback
              </span>

              <p className="font-display text-lg sm:text-2xl text-white italic leading-relaxed mb-8">
                &ldquo;{testimonial.quote || testimonial.feedback}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                {testimonial.client_avatar || testimonial.avatar_url ? (
                  <img
                    src={testimonial.client_avatar || testimonial.avatar_url}
                    alt={testimonial.author || testimonial.client_name}
                    className="h-12 w-12 rounded-full object-cover border border-blue-500/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/30">
                    {(testimonial.author || testimonial.client_name || 'C').charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-display text-base font-bold text-white">
                    {testimonial.author || testimonial.client_name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {testimonial.role || testimonial.client_role}
                    {(testimonial.company || testimonial.client_company) ? ` • ${testimonial.company || testimonial.client_company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 13 — CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to Build?</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Have a similar challenge?
          </h2>

          <p className="text-lg sm:text-xl font-bold text-blue-400">
            Let's build the right technology for your business.
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We partner with businesses to turn challenges into high-performance web applications, commercial platforms, and scalable digital solutions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-blue-500/25"
            >
              <span>Start a Project</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>Talk to SaroHub</span>
              <MessageSquare className="h-4 w-4 text-blue-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14 — MORE CLIENT WORK (Related Projects) */}
      {/* ========================================================================= */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400 block mb-2">
                  Portfolio
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  More Client Work
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Explore other digital solutions built for modern businesses:
                </p>
              </div>

              <Link
                to="/work"
                className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <span>View All Projects</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relItem: ClientProject, idx: number) => {
                const relUrl = `/projects/${relItem.slug || relItem.id}`;
                return (
                  <div
                    key={relItem.id || idx}
                    className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="h-44 relative overflow-hidden bg-slate-950 border-b border-slate-800">
                      <img
                        src={relItem.thumbnail_url}
                        alt={relItem.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-black/80 text-blue-400 border border-white/10">
                          {relItem.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                          {relItem.industry}
                        </span>
                        <h3 className="font-display text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                          <Link to={relUrl}>{relItem.title}</Link>
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                          {relItem.short_description}
                        </p>

                        <div className="mt-3 rounded-xl p-2.5 bg-gradient-to-br from-blue-950/35 via-slate-900/60 to-slate-900/40 border border-blue-500/25">
                          <div className="flex items-center gap-1.5 mb-1 text-blue-400">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-400">
                              What We Solved
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-200 leading-snug line-clamp-2 font-medium">
                            {relItem.what_we_solved}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <Link
                          to={relUrl}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
                        >
                          <span>View Case Study</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        {relItem.live_url && (
                          <a
                            href={relItem.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {activeImageModal && (
        <div 
          onClick={() => setActiveImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {validGallery.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 cursor-pointer"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <img
              src={activeImageModal}
              alt="Expanded Preview"
              className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain border border-slate-800 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 text-xs font-mono text-slate-400">
              Screenshot {activeImageIndex + 1} of {validGallery.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
