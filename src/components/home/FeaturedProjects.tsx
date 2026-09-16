import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Briefcase, 
  Layers, LayoutGrid, SlidersHorizontal
} from 'lucide-react';
import { STANDARD_CATEGORIES, getAllClientProjects } from '../../data/clientProjectsData';
import ClientProjectCard from './ClientProjectCard';

interface ProjectsProps {
  projects?: any[];
}

export default function FeaturedProjects({ projects: incomingProjects }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback to rich CLIENT_PROJECTS if incoming projects array is empty or partial
  const allProjects = useMemo(() => {
    const fallbackList = getAllClientProjects();
    if (!incomingProjects || incomingProjects.length === 0) {
      return fallbackList;
    }
    
    // Sort incoming dynamic projects by order, then by id descending
    const sorted = [...incomingProjects].sort((a, b) => {
      const orderA = Number(a.order) || 999;
      const orderB = Number(b.order) || 999;
      if (orderA !== orderB) return orderA - orderB;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

    // Merge incoming projects with rich client projects data, with dynamic API fields taking precedence
    return sorted.map((p) => {
      const matched = fallbackList.find(
        (f) => f.slug === p.slug || f.id === p.id || f.title.toLowerCase() === (p.title || '').toLowerCase()
      );
      if (matched) {
        return {
          ...matched,
          ...p,
          what_we_solved: p.what_we_solved || p.case_study || matched.what_we_solved,
          overview: p.overview || matched.overview,
          challenges: p.challenges || matched.challenges,
          solutions: p.solutions || matched.solutions,
          features: p.features || matched.features,
          sarohub_role: p.sarohub_role || matched.sarohub_role,
          positioning_statement: p.positioning_statement || matched.positioning_statement,
          project_type: p.project_type || matched.project_type,
          industry: p.industry || matched.industry,
          category: p.category || matched.category,
          secondary_categories: p.secondary_categories || matched.secondary_categories,
          status: p.status || matched.status || 'Delivered',
          featured: p.featured !== undefined ? p.featured : matched.featured
        };
      }
      return {
        ...p,
        status: p.status || 'Delivered',
        what_we_solved: p.what_we_solved || p.case_study || 'Engineered bespoke digital architecture solving core operational bottlenecks.'
      };
    });
  }, [incomingProjects]);

  // Derive categories that actually have projects
  const availableCategories = useMemo(() => {
    const activeSet = new Set<string>();
    allProjects.forEach((p: any) => {
      if (p.category) activeSet.add(p.category);
      if (Array.isArray(p.secondary_categories)) {
        p.secondary_categories.forEach((c: string) => activeSet.add(c));
      }
    });

    const result: string[] = ['All'];
    STANDARD_CATEGORIES.forEach((cat) => {
      if (cat !== 'All' && activeSet.has(cat)) {
        result.push(cat);
      }
    });

    // Append any other custom categories
    activeSet.forEach((cat) => {
      if (!result.includes(cat)) {
        result.push(cat);
      }
    });

    return result;
  }, [allProjects]);

  // Filter projects by selected category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter((p: any) => {
      if (!p) return false;
      if (p.category === activeCategory) return true;
      if (Array.isArray(p.secondary_categories) && p.secondary_categories.includes(activeCategory)) return true;
      return false;
    });
  }, [allProjects, activeCategory]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

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
  }, [filteredProjects, viewMode]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 420;
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

  const totalCount = filteredProjects.length;

  return (
    <section
      id="selected-client-work"
      className="py-20 lg:py-28 relative overflow-hidden border-b"
      style={{
        backgroundColor: 'var(--bg-app)',
        borderColor: 'var(--border-app)'
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-sm mb-4">
              <Briefcase className="h-3.5 w-3.5 text-blue-400" />
              <span>Client Case Studies</span>
            </div>

            <h2
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Selected Client Work
            </h2>

            <p className="mt-3 text-lg sm:text-xl font-bold text-blue-400">
              Technology built around real business needs.
            </p>

            <p className="mt-3 text-sm sm:text-base font-normal leading-relaxed text-slate-300">
              We partner with businesses and organizations to transform challenges, ideas, and opportunities into practical digital products and technology solutions.
            </p>
          </div>

          {/* View Toggle and Carousel Arrows */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-end">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Apple-style Carousel View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Carousel</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {viewMode === 'carousel' && totalCount > 1 && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900/90 border border-white/10 px-2.5 py-1 rounded-full">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                </span>

                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous slide"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                    canScrollLeft
                      ? 'bg-slate-900/90 hover:bg-blue-600 border-white/15 text-white cursor-pointer shadow-md hover:scale-105 active:scale-95'
                      : 'bg-slate-900/30 border-white/5 text-slate-600 cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next slide"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                    canScrollRight
                      ? 'bg-slate-900/90 hover:bg-blue-600 border-white/15 text-white cursor-pointer shadow-md hover:scale-105 active:scale-95'
                      : 'bg-slate-900/30 border-white/5 text-slate-600 cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Only categories that actually have projects) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Filter By Category
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25 font-bold scale-102'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Layout: Carousel or Grid */}
        {filteredProjects.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl border font-medium text-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-app)',
              color: 'var(--text-muted)'
            }}
          >
            No client projects found under the "{activeCategory}" category.
          </div>
        ) : viewMode === 'carousel' ? (
          /* Apple-Style Carousel Mode */
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-1 px-1 scrollbar-none"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {filteredProjects.map((item: any, idx: number) => (
                <div key={item.id || idx} className="w-[86vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 snap-start flex flex-col">
                  <ClientProjectCard project={item} idx={idx} className="h-full" />
                </div>
              ))}
            </div>

            {/* Apple Pill Pagination Dots */}
            {totalCount > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-4 py-2">
                {filteredProjects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === i
                        ? 'w-7 bg-blue-500 shadow-sm shadow-blue-500/50'
                        : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Grid Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((item: any, idx: number) => (
              <ClientProjectCard key={item.id || idx} project={item} idx={idx} className="h-full" />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
