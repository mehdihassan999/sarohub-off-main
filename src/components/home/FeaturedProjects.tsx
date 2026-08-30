import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, FolderGit2, ChevronLeft, ChevronRight, X, ExternalLink, Calendar, User, Sparkles, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsProps {
  projects: any[];
}

export default function FeaturedProjects({ projects }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Derive categories from projects data so admin-driven categories show up
  const derivedCategories = React.useMemo(() => {
    const cats = (projects || []).flatMap((p) => {
      if (!p || !p.category) return [];
      if (Array.isArray(p.category)) return p.category.map((c: any) => String(c).trim()).filter(Boolean);
      return String(p.category).split(/[,|•]/).map(s => s.trim()).filter(Boolean);
    });
    return ['All', ...Array.from(new Set(cats))];
  }, [projects]);

  const filteredProjects = React.useMemo(() => {
    if (activeCategory === 'All') return projects || [];
    return (projects || []).filter(p => {
      if (!p || !p.category) return false;
      const cats = Array.isArray(p.category)
        ? p.category.map((c: any) => String(c).trim())
        : String(p.category).split(/[,|•]/).map(s => s.trim());
      return cats.includes(activeCategory);
    });
  }, [projects, activeCategory]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate exact active slide index by matching element offsets
    const container = scrollRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length > 0) {
      let closestIdx = 0;
      let minDistance = Infinity;
      const containerLeft = container.getBoundingClientRect().left;
      children.forEach((child, idx) => {
        const childLeft = child.getBoundingClientRect().left;
        const dist = Math.abs(childLeft - containerLeft);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [filteredProjects]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 360;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children && children[index]) {
      const targetChild = children[index];
      const targetLeft = targetChild.offsetLeft - container.offsetLeft;
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="featured-projects"
      className="py-20 relative overflow-hidden border-b grid-bg"
      style={{
        backgroundColor: 'var(--bg-app)',
        borderColor: 'var(--border-app)'
      }}
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" /> Client Work Portfolio
            </span>
            <h2
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-3"
              style={{ color: 'var(--text-main)' }}
            >
              Projects We've Delivered for Clients
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed max-w-xl text-slate-400">
              Interactive portfolio showcasing custom software, enterprise platforms, and scalable digital solutions delivered to our clients.
            </p>
          </div>

          {/* Right side: Category Filters & Carousel Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 max-w-xl">
              {derivedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer border ${activeCategory === cat
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] text-slate-300'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Prev / Next Nav Buttons */}
            {filteredProjects.length > 0 && (
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous slide"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 ${canScrollLeft
                    ? 'bg-white/10 hover:bg-blue-600 border-white/20 text-white shadow-md cursor-pointer hover:scale-105 active:scale-95'
                    : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed opacity-40'
                    }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next slide"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 ${canScrollRight
                    ? 'bg-white/10 hover:bg-blue-600 border-white/20 text-white shadow-md cursor-pointer hover:scale-105 active:scale-95'
                    : 'bg-white/5 border-white/5 text-slate-600 cursor-not-allowed opacity-40'
                    }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Container */}
        {filteredProjects.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border font-medium text-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-app)',
              color: 'var(--text-muted)'
            }}
          >
            No client projects found for the selected category.
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 scrollbar-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {filteredProjects.map((item, idx) => {
                const screenshotsCount = Array.isArray(item.screenshots) ? item.screenshots.filter(Boolean).length : 0;
                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.25) }}
                    className="w-[300px] sm:w-[330px] lg:w-[350px] shrink-0 snap-start rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group/card cursor-pointer"
                    onClick={() => {
                      setSelectedProject(item);
                      setActiveModalImage(0);
                    }}
                  >
                    <div>
                      {/* Compact Banner Thumbnail Container */}
                      <div className="h-44 sm:h-48 overflow-hidden relative bg-slate-950 border-b border-white/10">
                        <img
                          src={item.thumbnail_url || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450'}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-108"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 right-3 left-3 flex justify-between items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-blue-400 border border-blue-500/30 shadow-sm"
                          >
                            {item.category}
                          </span>

                          {screenshotsCount > 0 && (
                            <span className="rounded-full px-2.5 py-1 text-[10px] font-mono font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/15 flex items-center gap-1">
                              <ImageIcon className="h-3 w-3 text-cyan-400" />
                              {screenshotsCount}
                            </span>
                          )}
                        </div>

                        {/* Bottom Client Tag */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 flex justify-between items-end">
                          <div>
                            <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest block drop-shadow-md">
                              Client: {item.client_name}
                            </span>
                          </div>
                          {item.completion_date && (
                            <span className="text-[9px] font-mono text-slate-400 font-medium drop-shadow-md">
                              {item.completion_date}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2">
                        <h3
                          className="font-display text-base sm:text-lg font-bold text-white group-hover/card:text-blue-400 transition-colors line-clamp-1"
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-xs font-normal text-slate-300 leading-relaxed line-clamp-2"
                        >
                          {item.short_description}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Tech Tags & Action Row */}
                    <div className="p-5 pt-0 mt-2">
                      <div className="flex flex-wrap gap-1 mb-3.5">
                        {Array.isArray(item.technologies) ? item.technologies.slice(0, 3).map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="rounded-md px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider bg-slate-800/80 border border-slate-700/60 text-slate-300"
                          >
                            {tech}
                          </span>
                        )) : null}
                      </div>

                      <div className="flex gap-2 items-center justify-between pt-3 border-t border-white/10">
                        <button
                          type="button"
                          className="text-xs font-bold text-slate-300 group-hover/card:text-blue-400 flex items-center gap-1.5 cursor-pointer transition-colors group/btn"
                        >
                          <FolderGit2 className="h-3.5 w-3.5 text-blue-400" />
                          <span>View Details</span>
                          <ArrowRight className="h-3 w-3 text-blue-400 transition-transform group-hover/btn:translate-x-0.5" />
                        </button>

                        {item.live_url && (
                          <a
                            href={item.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-md border border-blue-500/20 transition-all"
                          >
                            <span>Live Demo</span>
                            <Globe className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Apple iPhone Style Interactive Pagination Dots */}
            {filteredProjects.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-5 py-2">
                {filteredProjects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer border ${activeIndex === i
                      ? 'w-8 bg-blue-500 border-blue-400 shadow-md shadow-blue-500/50 scale-105'
                      : 'w-2 bg-white/20 border-transparent hover:bg-white/40'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Details Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur shrink-0">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 border border-blue-500/30 text-blue-400 uppercase">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline-flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-cyan-400" /> Client: <strong className="text-white">{selectedProject.client_name}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                    {selectedProject.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-cyan-400" /> Client: <strong className="text-white">{selectedProject.client_name}</strong>
                    </span>
                    {selectedProject.completion_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-blue-400" /> Delivered: <strong className="text-white">{selectedProject.completion_date}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Screenshot Lightbox Gallery */}
                {(() => {
                  const gallery = [selectedProject.thumbnail_url, ...(Array.isArray(selectedProject.screenshots) ? selectedProject.screenshots : [])].filter(Boolean);
                  if (gallery.length === 0) return null;
                  return (
                    <div className="space-y-3">
                      <div className="h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative group flex items-center justify-center">
                        <img
                          src={gallery[activeModalImage] || gallery[0]}
                          alt={selectedProject.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      {gallery.length > 1 && (
                        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                          {gallery.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveModalImage(i)}
                              className={`h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeModalImage === i ? 'border-blue-500 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Description */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Overview</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {selectedProject.short_description || selectedProject.full_description}
                  </p>
                </div>

                {/* Case Study Impact */}
                {selectedProject.case_study && (
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs sm:text-sm">
                    <span className="font-bold text-blue-400 block mb-1 uppercase tracking-wider font-mono">
                      Metrics &amp; Impact
                    </span>
                    <p className="leading-relaxed italic">{selectedProject.case_study}</p>
                  </div>
                )}

                {/* Tech Stack */}
                {Array.isArray(selectedProject.technologies) && selectedProject.technologies.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 border border-slate-700 text-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center shrink-0">
                <Link
                  to="/projects"
                  onClick={() => setSelectedProject(null)}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <FolderGit2 className="h-4 w-4 text-blue-400" />
                  View All Projects
                </Link>

                {selectedProject.live_url && (
                  <a
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}


