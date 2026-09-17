import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Quote, 
  ShieldCheck, 
  LayoutGrid, 
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  Building2,
  RefreshCw
} from 'lucide-react';
import TestimonialCarousel from '../TestimonialCarousel';
import { Testimonial } from '../../types';
import { api } from '../../api';

interface TestimonialsProps {
  testimonials?: any[];
}

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 35, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 220, 
      damping: 22,
      mass: 0.85,
    } 
  },
};

export default function ClientTestimonials({ testimonials }: TestimonialsProps) {
  const [items, setItems] = useState<Testimonial[]>(
    Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : []
  );
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'enterprise' | 'ai'>('all');

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await api.getTestimonials();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Array.isArray(testimonials)) {
      setItems(testimonials);
    } else {
      fetchTestimonials();
    }
  }, [testimonials]);

  // Synchronize live with Admin Panel changes via custom event
  useEffect(() => {
    const handleDataUpdated = () => {
      fetchTestimonials();
    };
    window.addEventListener('sarohub-data-updated', handleDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', handleDataUpdated);
  }, []);

  // Use dynamic items from database (admin panel) directly
  const displayList: Testimonial[] = items;

  // Calculate dynamic rating average
  const avgRating = displayList.length > 0
    ? (displayList.reduce((acc, cur) => acc + (cur.rating || 5), 0) / displayList.length).toFixed(2)
    : '5.00';

  // Filter items dynamically if user selects specific focus
  const filteredList = displayList.filter(item => {
    if (selectedFilter === 'all') return true;
    const text = `${item.client_company || ''} ${item.feedback || ''} ${item.client_role || ''} ${item.client_name || ''}`.toLowerCase();
    if (selectedFilter === 'enterprise') {
      return (
        text.includes('enterprise') || text.includes('vanguard') || text.includes('erp') || 
        text.includes('industrial') || text.includes('nexus') || text.includes('financial') || 
        text.includes('director') || text.includes('operations') || text.includes('infrastructure') ||
        text.includes('systems') || (item.rating && item.rating >= 5)
      );
    }
    if (selectedFilter === 'ai') {
      return (
        text.includes('ai') || text.includes('sentinel') || text.includes('cloud') || 
        text.includes('telemetry') || text.includes('technology') || text.includes('digital') ||
        text.includes('automation') || text.includes('software') || text.includes('platform') ||
        text.includes('pipeline') || text.includes('developer')
      );
    }
    return true;
  });

  return (
    <section 
      id="testimonials" 
      className="py-24 relative border-t border-b overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header with Motion */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headerVariants}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Client Endorsements & Reviews</span>
          </div>

          <h2 
            className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
            style={{ color: 'var(--text-main)' }}
          >
            Trusted by Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">Industry Leaders</span>
          </h2>

          <p 
            className="mt-4 text-sm sm:text-base font-medium leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            Read verbatim accounts from corporate directors, engineering executives, and startup founders who scaled their platforms with SaroHub.
          </p>

          {/* Social Proof Metric Bar */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-5 py-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{avgRating} / 5.0 Rating</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{displayList.length} Verified Reviews</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Global Enterprise Deployments</span>
            </div>
          </div>
        </motion.div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-800/60">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              All Testimonials ({displayList.length})
            </button>
            <button
              onClick={() => setSelectedFilter('enterprise')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'enterprise'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              Enterprise & Core Systems
            </button>
            <button
              onClick={() => setSelectedFilter('ai')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === 'ai'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              AI & Cloud Infrastructure
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Staggered Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Staggered Grid</span>
            </button>
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Spotlight Carousel View"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Spotlight Carousel</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {displayList.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Client Reviews</h3>
            <p className="text-xs text-slate-400 mt-1">Verified partner testimonials will appear here once published from the Admin Panel.</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-12 px-6 rounded-2xl border border-slate-800/60 bg-slate-900/30 max-w-md mx-auto">
            <p className="text-xs text-slate-400">No reviews found matching this filter category.</p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-3 text-xs font-semibold text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              View all testimonials ({displayList.length})
            </button>
          </div>
        ) : viewMode === 'carousel' ? (
          <TestimonialCarousel items={filteredList} />
        ) : (
          /* Staggered Entrance Animation Grid */
          <motion.div
            key={selectedFilter}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {filteredList.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
                className="group relative rounded-3xl p-7 sm:p-8 border border-slate-800/80 hover:border-blue-500/40 bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-xl shadow-lg hover:shadow-[0_12px_36px_rgba(59,130,246,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top accent gradient */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Ambient glow in card background */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

                {/* Watermark Quote Icon */}
                <div className="absolute top-6 right-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors pointer-events-none">
                  <Quote className="h-16 w-16 stroke-[1.2]" />
                </div>

                <div className="relative z-10 space-y-5">
                  {/* Rating Stars & Verified Tag */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < (item.rating || 5)
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-slate-700'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-amber-400/90 ml-1">
                        {(item.rating || 5).toFixed(1)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Verified Review</span>
                    </span>
                  </div>

                  {/* Feedback Text */}
                  <blockquote 
                    className="text-sm sm:text-base font-normal leading-relaxed text-slate-200 tracking-normal italic pt-1"
                  >
                    "{item.feedback}"
                  </blockquote>
                </div>

                {/* Author Card Footer */}
                <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/70 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <img 
                        src={item.client_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'} 
                        alt={item.client_name} 
                        className="h-12 w-12 rounded-full object-cover border-2 border-blue-500/30 group-hover:border-cyan-400/60 transition-colors shadow-sm"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Fallback placeholder image if URL fails
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <cite className="not-italic font-display text-sm sm:text-base font-bold text-white block truncate">
                        {item.client_name}
                      </cite>
                      <span className="text-xs font-mono text-slate-400 block truncate mt-0.5">
                        <span className="text-slate-300 font-medium">{item.client_role}</span>
                        {item.client_company && (
                          <> &bull; <span className="text-cyan-400">{item.client_company}</span></>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Corporate Verified Pill */}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 py-1 rounded bg-slate-950 border border-slate-800/80 whitespace-nowrap">
                    Enterprise
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}

