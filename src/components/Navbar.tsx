import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ChevronDown, Award, Briefcase, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface NavbarProps {
  isAdminLoggedIn: boolean;
}

export default function Navbar({ isAdminLoggedIn }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('theme-obsidian');
  const location = useLocation();
  const moreRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

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

  // Direct primary links shown directly in navbar
  const primaryLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Our Ventures', path: '/ventures' },
  ];

  // Projects sub-items for the Projects dropdown
  const projectLinks = [
    {
      name: 'Client Projects',
      path: '/projects',
      desc: 'Projects and custom solutions built & delivered for our clients',
      icon: Briefcase,
      badge: 'Client Work'
    },
    {
      name: 'Student Projects',
      path: '/student-projects',
      desc: 'Real-world capstones built by IT Academy trainees',
      icon: Award,
      badge: 'IT Academy'
    },
  ];

  // Secondary links grouped under "More" dropdown
  const moreLinks = [
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
  ];

  // All links for mobile menu
  const allLinks = [
    ...primaryLinks,
    { name: 'Projects', path: '/projects' },
    { name: 'Student Projects', path: '/student-projects' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Opportunities', path: '/opportunities' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isProjectsActive = location.pathname.startsWith('/projects') || location.pathname.startsWith('/student-projects');

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
      if (projectsRef.current && !projectsRef.current.contains(event.target as Node)) {
        setProjectsDropdownOpen(false);
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
          {primaryLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap ${isActive(link.path)
                ? (isDark
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold'
                  : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
                : (isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
                }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Projects Dropdown Menu */}
          <div className="relative" ref={projectsRef}>
            <button
              onClick={() => {
                setProjectsDropdownOpen(!projectsDropdownOpen);
                setMoreOpen(false);
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${isProjectsActive
                ? (isDark
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold'
                  : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
                : (isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
                }`}
            >
              <span>Projects</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${projectsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {projectsDropdownOpen && (
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
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Project Portfolios
                  </div>
                  {projectLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setProjectsDropdownOpen(false)}
                        className={`block p-2.5 rounded-xl transition-all ${isActive(item.path)
                          ? (isDark ? 'bg-blue-500/15 border border-blue-500/30' : 'bg-blue-50 border border-blue-100')
                          : (isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50')
                          }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-lg shrink-0 ${isActive(item.path) ? 'bg-blue-600 text-white' : 'bg-blue-500/10 text-blue-400'}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-bold ${isActive(item.path) ? 'text-blue-400' : ''}`}>
                                {item.name}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-semibold">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Marketplace Link */}
          <Link
            to="/marketplace"
            className={`px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap ${isActive('/marketplace')
              ? (isDark
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold'
                : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
              : (isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
              }`}
          >
            Marketplace
          </Link>

          {/* More Dropdown Menu */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => {
                setMoreOpen(!moreOpen);
                setProjectsDropdownOpen(false);
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${moreLinks.some(l => isActive(l.path))
                ? (isDark
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold'
                  : 'bg-blue-50 text-blue-700 font-bold border border-blue-100/40')
                : (isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50')
                }`}
            >
              <span>More</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-52 rounded-xl border p-1.5 shadow-xl z-50 ${isDark
                    ? 'bg-slate-950/98 border-slate-800 text-slate-100 backdrop-blur-md'
                    : 'bg-white/98 border-slate-200 text-slate-800 backdrop-blur-md'
                    }`}
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMoreOpen(false)}
                      className={`block px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${isActive(link.path)
                        ? (isDark ? 'bg-blue-500/20 text-blue-400 font-bold' : 'bg-blue-50 text-blue-700 font-bold')
                        : (isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600')
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* CTA Actions - Desktop */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <Link
            to="/contact"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
          >
            Partner With Us
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
              className={`absolute top-full left-0 right-0 w-full border-b z-50 lg:hidden shadow-2xl overflow-hidden ${isDark
                ? 'bg-slate-950 border-slate-900 text-slate-100'
                : 'bg-white border-slate-200 text-slate-800'
                }`}
            >
              <div className="px-6 py-6 flex flex-col gap-1.5 max-w-7xl mx-auto">
                <p className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-3 px-3 ${isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                  Navigation
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-3.5 py-3 rounded-xl text-xs font-semibold transition-all border flex items-center justify-between ${isActive(link.path)
                        ? (isDark
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold'
                          : 'bg-blue-50 text-blue-700 border-blue-100 font-bold')
                        : (isDark
                          ? 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900/40'
                          : 'text-slate-600 border-transparent hover:text-blue-600 hover:bg-slate-50')
                        }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${isActive(link.path) ? 'opacity-40' : ''
                        }`} />
                    </Link>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-inherit">
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Partner With Us
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
