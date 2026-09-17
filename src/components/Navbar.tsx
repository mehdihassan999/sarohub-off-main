import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, ChevronDown, Award, Briefcase, Sparkles,
  Calendar, Calculator, FileText, Factory, Rocket, Handshake, Workflow,
  Cpu, Newspaper, Presentation, Users, GraduationCap, ArrowRight, ShieldCheck, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface NavbarProps {
  isAdminLoggedIn: boolean;
}

export default function Navbar({ isAdminLoggedIn }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('theme-obsidian');
  const location = useLocation();
  const moreRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Detect theme class on parent elements
  useEffect(() => {
    const detectTheme = () => {
      const element = document.querySelector('.theme-obsidian, .theme-nordic, .theme-stripe, .theme-alabaster');
      if (element) {
        const classes = Array.from(element.classList);
        const foundTheme = classes.find(c => c.startsWith('theme-'));
        if (foundTheme) {
          setActiveTheme(foundTheme);
        }
      }
    };
    detectTheme();
    // Observe classList changes on root wrapper/body hierarchy
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const isDark = activeTheme === 'theme-obsidian' || activeTheme === 'theme-nordic';

  // Services dropdown items
  const serviceItems = [
    { name: 'Custom Software', path: '/services/custom-software', desc: 'Enterprise architecture & bespoke systems' },
    { name: 'Web Development', path: '/services/web-development', desc: 'Fast, secure, responsive web platforms' },
    { name: 'Mobile Development', path: '/services/mobile-development', desc: 'Native & cross-platform iOS/Android' },
    { name: 'SaaS Development', path: '/services/saas-development', desc: 'Multi-tenant cloud subscription products' },
    { name: 'AI & Automation', path: '/services/ai-automation', desc: 'LLM workflows, agents & intelligent tools' },
    { name: 'E-Commerce Platforms', path: '/services/ecommerce-platforms', desc: 'Scalable digital stores & payment gateways' },
    { name: 'Digital Solutions', path: '/services/digital-solutions', desc: 'Modernizing internal business workflows' },
    { name: 'UI/UX Design', path: '/services/ui-ux-design', desc: 'User-centered design & interactive prototypes' },
    { name: 'Graphic Designing', path: '/services/graphic-design', desc: 'Brand identity, visual design & vector assets' },
    { name: 'Digital Marketing', path: '/services/digital-marketing', desc: 'Data-driven growth, SEO & performance ads' },
  ];

  // Secondary pages grouped under "Client Tools"
  const featuredClientTools = [
    { name: 'Book Consultation', path: '/book', desc: 'Reserve 30-min discovery call', icon: Calendar },
    { name: 'Scope Calculator', path: '/estimate', desc: 'Instant pricing & roadmap', icon: Calculator },
    { name: 'Trust & Guarantees', path: '/trust', desc: '100% IP rights & strict NDAs', icon: ShieldCheck },
    { name: 'Executive Deck (PDF)', path: '/capabilities', desc: 'Downloadable one-pager', icon: FileText },
  ];

  const solutionsLinks = [
    { name: 'Trust & Guarantees', path: '/trust', desc: '100% IP rights & strict NDAs', icon: ShieldCheck },
    { name: 'Industries', path: '/industries', desc: 'Sector-specific engineering', icon: Factory },
    { name: 'For Startups', path: '/startups', desc: 'MVP to venture acceleration', icon: Rocket },
    { name: 'Agency Partners', path: '/agency-partners', desc: 'White-label tech under NDA', icon: Handshake },
    { name: 'How We Work', path: '/process', desc: '6-phase delivery lifecycle', icon: Workflow },
  ];

  const ecosystemLinks = [
    { name: 'Technology Stack', path: '/technology', desc: 'Frameworks, clouds & AI', icon: Cpu },
    { name: 'Insights & Articles', path: '/insights', desc: 'Engineering thought leadership', icon: Newspaper },
    { name: 'Events & Masterclasses', path: '/events', desc: 'Tech summits & hackathons', icon: Presentation },
    { name: 'Company Gallery', path: '/gallery', desc: 'Seminars, collaborations & culture', icon: Camera },
    { name: 'Careers & Hiring', path: '/careers', desc: 'Join engineering & ventures', icon: Users },
    { name: 'Student Projects', path: '/student-projects', desc: 'IT Academy capstones', icon: GraduationCap },
  ];

  const moreLinks = [...solutionsLinks, ...ecosystemLinks];

  // All links for mobile menu
  const allMobileLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Ventures', path: '/ventures' },
    { name: 'Work', path: '/work' },
    { name: 'Partnerships', path: '/partnerships' },
    { name: 'Trust & Guarantees', path: '/trust' },
    { name: 'Industries', path: '/industries' },
    { name: 'Startups', path: '/startups' },
    { name: 'Agency Partners', path: '/agency-partners' },
    { name: 'Process', path: '/process' },
    { name: 'Technology', path: '/technology' },
    { name: 'Insights', path: '/insights' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isServicesActive = location.pathname.startsWith('/services');
  const isWorkActive = location.pathname.startsWith('/work') || location.pathname.startsWith('/projects');
  const isToolsActive = featuredClientTools.some(l => isActive(l.path));
  const isMoreActive = moreLinks.some(l => isActive(l.path));

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
      if (projectsRef.current && !projectsRef.current.contains(event.target as Node)) {
        setProjectsDropdownOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
    setProjectsDropdownOpen(false);
    setToolsDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-md ${isDark
        ? 'border-slate-900 bg-slate-950/85 text-slate-100'
        : 'border-slate-200/80 bg-white/85 text-slate-800'
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
        {/* Company Logo */}
        <Link to="/" className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02] flex-shrink-0">
          <Logo height={40} showText={false} variant={isDark ? 'dark' : 'light'} />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {/* Home */}
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap ${isActive('/')
              ? (isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold' : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
              : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
            }`}
          >
            Home
          </Link>

          {/* About */}
          <Link
            to="/about"
            className={`px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap ${isActive('/about')
              ? (isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold' : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
              : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
            }`}
          >
            About
          </Link>

          {/* Services Dropdown Menu */}
          <div className="relative" ref={projectsRef}>
            <button
              onClick={() => {
                setProjectsDropdownOpen(!projectsDropdownOpen);
                setToolsDropdownOpen(false);
                setMoreOpen(false);
              }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${isServicesActive
                ? (isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold' : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
                : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
              }`}
            >
              <span>Services</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${projectsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {projectsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute left-0 mt-2 w-80 rounded-2xl border p-2 shadow-2xl z-50 ${isDark
                    ? 'bg-slate-950/98 border-slate-800 text-slate-100 backdrop-blur-xl'
                    : 'bg-white/98 border-slate-200 text-slate-800 backdrop-blur-xl'
                  }`}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/60 mb-1">
                    Services & Capabilities
                  </div>
                  {serviceItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setProjectsDropdownOpen(false)}
                      className={`block px-3 py-2 rounded-xl transition-all ${isActive(item.path)
                        ? (isDark ? 'bg-blue-500/15 text-blue-400 font-bold' : 'bg-blue-50 text-blue-700 font-bold')
                        : (isDark ? 'hover:bg-slate-900/60 text-slate-200' : 'hover:bg-slate-50 text-slate-700')
                      }`}
                    >
                      <div className="text-xs font-bold">{item.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</div>
                    </Link>
                  ))}
                  <div className="pt-2 mt-1 border-t border-slate-800/60">
                    <Link
                      to="/services"
                      onClick={() => setProjectsDropdownOpen(false)}
                      className="block px-3 py-1.5 text-center text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                      View All Services Overview →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ventures */}
          <Link
            to="/ventures"
            className={`px-2.5 xl:px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap ${isActive('/ventures')
              ? (isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold' : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
              : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
            }`}
          >
            Ventures
          </Link>

          {/* Work */}
          <Link
            to="/work"
            className={`px-2.5 xl:px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap ${isWorkActive
              ? (isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold' : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
              : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
            }`}
          >
            Work
          </Link>

          {/* Partnerships */}
          <Link
            to="/partnerships"
            className={`px-2.5 xl:px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap ${isActive('/partnerships')
              ? (isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold' : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
              : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
            }`}
          >
            Partnerships
          </Link>

          {/* Dedicated Client Tools Dropdown Menu */}
          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => {
                setToolsDropdownOpen(!toolsDropdownOpen);
                setProjectsDropdownOpen(false);
                setMoreOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${isToolsActive
                ? (isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold' : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
                : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Client Tools</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {toolsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute left-0 mt-2 w-72 rounded-2xl border p-2 shadow-2xl z-50 ${isDark
                    ? 'bg-slate-950/98 border-slate-800 text-slate-100 backdrop-blur-xl'
                    : 'bg-white/98 border-slate-200 text-slate-800 backdrop-blur-xl'
                  }`}
                >
                  <div className="space-y-1">
                    {featuredClientTools.map((tool) => {
                      const Icon = tool.icon;
                      const active = isActive(tool.path);
                      return (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          onClick={() => setToolsDropdownOpen(false)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                            active
                              ? (isDark ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800')
                              : (isDark ? 'border-transparent hover:border-slate-800 hover:bg-slate-900/70 text-slate-200' : 'border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700')
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            active 
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' 
                              : (isDark ? 'bg-slate-900 border border-slate-800 text-cyan-400' : 'bg-slate-100 text-blue-600')
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate">{tool.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{tool.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Dropdown Menu */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => {
                setMoreOpen(!moreOpen);
                setProjectsDropdownOpen(false);
                setToolsDropdownOpen(false);
              }}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${isMoreActive
                ? (isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold' : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
                : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
              }`}
            >
              <span>More</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-[480px] lg:w-[520px] rounded-2xl border p-3.5 shadow-2xl z-50 ${isDark
                    ? 'bg-slate-950/98 border-slate-800 text-slate-100 backdrop-blur-xl'
                    : 'bg-white/98 border-slate-200 text-slate-800 backdrop-blur-xl'
                  }`}
                >
                  {/* 2 Structured Columns: Solutions & Ecosystem */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Solutions & Engagement Column */}
                    <div>
                      <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1 border-b border-slate-800/50 pb-1">
                        Solutions & Engagement
                      </div>
                      <div className="space-y-0.5">
                        {solutionsLinks.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.path);
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMoreOpen(false)}
                              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all ${
                                active
                                  ? (isDark ? 'bg-blue-500/15 text-blue-400 font-bold' : 'bg-blue-50 text-blue-700 font-bold')
                                  : (isDark ? 'text-slate-300 hover:bg-slate-900/80 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600')
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-500'
                              }`}>
                                <Icon className="w-3 h-3" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold leading-none truncate">{item.name}</p>
                                <p className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">{item.desc}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ecosystem & Knowledge Column */}
                    <div>
                      <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1 border-b border-slate-800/50 pb-1">
                        Ecosystem & Knowledge
                      </div>
                      <div className="space-y-0.5">
                        {ecosystemLinks.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.path);
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMoreOpen(false)}
                              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all ${
                                active
                                  ? (isDark ? 'bg-blue-500/15 text-blue-400 font-bold' : 'bg-blue-50 text-blue-700 font-bold')
                                  : (isDark ? 'text-slate-300 hover:bg-slate-900/80 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600')
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                isDark ? 'bg-slate-800/80 text-slate-400' : 'bg-slate-100 text-slate-500'
                              }`}>
                                <Icon className="w-3 h-3" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold leading-none truncate">{item.name}</p>
                                <p className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">{item.desc}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact */}
          <Link
            to="/contact"
            className={`px-2.5 xl:px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap ${isActive('/contact')
              ? (isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold' : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
              : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* CTA Actions - Desktop */}
        <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
          <Link
            to="/book"
            id="navbar-cta-book-call"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer uppercase tracking-wider"
          >
            <span>Book Consultation</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center rounded-lg p-2 lg:hidden transition-colors ${isDark
            ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Backdrop and Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 sm:top-18 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Card */}
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`absolute top-full left-0 right-0 w-full border-b z-50 lg:hidden shadow-2xl overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto ${isDark
                ? 'bg-slate-950 border-slate-900 text-slate-100'
                : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="px-5 py-5 flex flex-col gap-4 max-w-7xl mx-auto">
                {/* Featured Client Tools in Mobile */}
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-2 px-1 flex items-center ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Client Tools</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {featuredClientTools.map((tool) => {
                      const Icon = tool.icon;
                      const active = isActive(tool.path);
                      return (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          onClick={() => setIsOpen(false)}
                          className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                            active
                              ? (isDark ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800')
                              : (isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700')
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            active ? 'bg-blue-600 text-white shadow-sm' : (isDark ? 'bg-slate-800 text-cyan-400' : 'bg-white text-blue-600')
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold truncate block">{tool.name}</span>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{tool.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* General Navigation in Mobile */}
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-2 px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    General Navigation
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {allMobileLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center justify-between min-w-0 ${isActive(link.path)
                          ? (isDark
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold'
                            : 'bg-blue-50 text-blue-700 border-blue-100 font-bold')
                          : (isDark
                            ? 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/40'
                            : 'text-slate-600 border-transparent hover:text-blue-600 hover:bg-slate-50')
                        }`}
                      >
                        <span className="truncate">{link.name}</span>
                        <ChevronRight className={`h-3 w-3 shrink-0 transition-opacity ${isActive(link.path) ? 'opacity-70 text-blue-400' : 'opacity-30'}`} />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-inherit">
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <span>Start a Project</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
