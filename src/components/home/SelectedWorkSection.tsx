import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllClientProjects } from '../../data/clientProjectsData';
import ClientProjectCard from './ClientProjectCard';

interface SelectedWorkSectionProps {
  projects?: any[];
}

export default function SelectedWorkSection({ projects = [] }: SelectedWorkSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Merge incoming projects with rich client projects and prioritize dynamic items
  const displayProjects = useMemo(() => {
    const fallbackList = getAllClientProjects();
    if (!projects || projects.length === 0) {
      return fallbackList;
    }
    
    // Sort incoming dynamic projects by order, then by id descending
    const sorted = [...projects].sort((a, b) => {
      const orderA = Number(a.order) || 999;
      const orderB = Number(b.order) || 999;
      if (orderA !== orderB) return orderA - orderB;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

    // Merge with any rich details from fallback if needed, with dynamic fields taking precedence
    const enriched = sorted.map((p) => {
      const matched = fallbackList.find(
        (f) => f.slug === p.slug || f.id === p.id || f.title.toLowerCase() === (p.title || '').toLowerCase()
      );
      if (matched) {
        return {
          ...matched,
          ...p,
          what_we_solved: p.what_we_solved || p.case_study || matched.what_we_solved,
          industry: p.industry || matched.industry,
          project_type: p.project_type || matched.project_type,
          status: p.status || matched.status || 'Delivered',
          featured: p.featured !== undefined ? p.featured : matched.featured
        };
      }
      return {
        ...p,
        status: p.status || 'Delivered',
        what_we_solved: p.what_we_solved || p.case_study || 'Delivered custom software engineered to solve core operational bottlenecks.'
      };
    });

    const featured = enriched.filter((p: any) => p.featured);
    const nonFeatured = enriched.filter((p: any) => !p.featured);
    return [...featured, ...nonFeatured];
  }, [projects]);

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
  }, [displayProjects]);

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

  const totalCount = displayProjects.length;

  return (
    <section 
      id="selected-client-work-home" 
      className="py-20 lg:py-28 relative border-b overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Apple-Style Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Client Case Studies</span>
            </div>
            
            <h2 
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Selected Client Work
            </h2>

            <p className="text-lg sm:text-xl font-bold text-blue-400 mb-3">
              Technology built around real business needs.
            </p>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              We partner with businesses and organizations to transform challenges, ideas, and opportunities into practical digital products and technology solutions.
            </p>
          </div>

          {/* Right Action & Carousel Controls (Apple Style) */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <Link
              to="/work"
              id="view-all-projects-top"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 mr-2 transition-colors"
            >
              <span>Explore All ({totalCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {totalCount > 1 && (
              <div className="flex items-center gap-2">
                {/* Active index counter */}
                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900/90 border border-white/10 px-2.5 py-1 rounded-full">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                </span>

                {/* Left Button */}
                <button
                  type="button"
                  onClick={() => handleScroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous project"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                    canScrollLeft
                      ? 'bg-slate-900/90 hover:bg-blue-600 border-white/15 text-white cursor-pointer shadow-md hover:scale-105 active:scale-95'
                      : 'bg-slate-900/30 border-white/5 text-slate-600 cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Right Button */}
                <button
                  type="button"
                  onClick={() => handleScroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next project"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                    canScrollRight
                      ? 'bg-slate-900/90 hover:bg-blue-600 border-white/15 text-white cursor-pointer shadow-md hover:scale-105 active:scale-95'
                      : 'bg-slate-900/30 border-white/5 text-slate-600 cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Apple-Style Horizontal Carousel Track */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-1 px-1 scrollbar-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {displayProjects.map((project: any, idx: number) => (
              <div 
                key={project.id || idx} 
                className="w-[86vw] sm:w-[380px] md:w-[410px] lg:w-[430px] shrink-0 snap-start flex flex-col"
              >
                <ClientProjectCard project={project} idx={idx} className="h-full" />
              </div>
            ))}
          </div>

          {/* Pagination Indicators (Apple Pill Style) */}
          {totalCount > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-4 py-2">
              {displayProjects.map((_, i) => (
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

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/work"
            id="view-all-projects-btn"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 font-semibold text-xs tracking-wider uppercase transition-all duration-200"
          >
            <span>Explore All Client Work</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
