import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, ChevronLeft, ChevronRight, Play, Pause, 
  MapPin, Calendar, ExternalLink, ZoomIn, X, Sparkles, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { CompanyGalleryItem } from '../../types';

interface CompanyGallerySliderProps {
  title?: string;
  subtitle?: string;
  showViewAllLink?: boolean;
}

export const CompanyGallerySlider: React.FC<CompanyGallerySliderProps> = ({
  title = "Moments & Life at SaroHub",
  subtitle = "Keynote seminars, regional IT collaborations, engineering hackathons, and academy masterclasses.",
  showViewAllLink = true
}) => {
  const [items, setItems] = useState<CompanyGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayDuration = 5500; // 5.5s per slide

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      const data = await api.getCompanyGallery();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data.filter(i => i.published !== false));
      }
    } catch (err) {
      console.error('Failed to load gallery items for slider:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (items.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    if (items.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex || items.length === 0) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay management
  useEffect(() => {
    if (!isPlaying || items.length <= 1 || lightboxOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayDuration);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, items.length, lightboxOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'Escape' && lightboxOpen) {
        setLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, lightboxOpen]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStart(null);
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-950/60 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="aspect-[21/9] min-h-[380px] rounded-3xl bg-slate-900/50 animate-pulse border border-slate-800 flex items-center justify-center">
            <span className="text-xs font-mono text-slate-500">Loading gallery slider...</span>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <section 
      id="gallery-slider-section"
      className="py-16 sm:py-20 lg:py-24 border-b border-slate-800/80 bg-slate-950 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Header with clean, non-card presentation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
              <Camera className="h-3.5 w-3.5" />
              <span>Life &amp; Ecosystem Impact</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl">
              {subtitle}
            </p>
          </div>

          {showViewAllLink && (
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-blue-400 hover:text-blue-300 transition-colors group self-start md:self-auto"
            >
              <span>Explore Full Gallery ({items.length} Photos)</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* MODERN SLIDER STAGE — NOT IN THE FORM OF A FULL CARD */}
        <div 
          className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/9] min-h-[380px] max-h-[580px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl group select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Animated Slide Canvas */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            >
              {/* Full Image */}
              <img
                src={currentItem.image_url}
                alt={currentItem.title}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1400&h=800');
                }}
              />

              {/* Minimalist edge vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-95" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40" />

              {/* Top info badge & Zoom trigger */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-900/80 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                    {currentItem.category}
                  </span>
                  {currentItem.featured && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/90 text-slate-950 flex items-center gap-1 shadow-md">
                      <Sparkles className="h-3 w-3" /> Spotlight
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all pointer-events-auto cursor-pointer"
                  title="View Full Resolution"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom Sleek Overlay Title & Context (Integrated seamlessly into photo) */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 lg:p-10 pointer-events-none">
                <div className="max-w-3xl space-y-2">
                  {/* Event metadata line */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
                    {currentItem.event_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-400" />
                        {currentItem.event_date}
                      </span>
                    )}
                    {currentItem.location && (
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-rose-400" />
                        <span className="truncate">{currentItem.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Prominent Slide Title */}
                  <h3 className="font-display text-lg sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                    {currentItem.title}
                  </h3>

                  {/* Clean Caption Line */}
                  {currentItem.caption && (
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl leading-relaxed drop-shadow">
                      {currentItem.caption}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating Minimalist Left & Right Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-950/60 hover:bg-blue-600 text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-950/60 hover:bg-blue-600 text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Autoplay Progress Line at the very bottom edge of slider */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: autoPlayDuration / 1000, ease: 'linear' }}
                className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              />
            </div>
          )}
        </div>

        {/* BOTTOM SLIDER CONTROL BAR & THUMBNAIL SCRUB */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Pagination Indicators & Play/Pause */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title={isPlaying ? "Pause Auto-slide" : "Play Auto-slide"}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>

            {/* Slide Dots / Pill */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-blue-500 shadow-sm shadow-blue-500/50'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Numeric Counter */}
            <span className="text-xs font-mono text-slate-500">
              <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
            </span>
          </div>

          {/* Quick Thumbnail Strip for direct scrubbing */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => goToSlide(idx)}
                className={`relative w-16 sm:w-20 h-10 sm:h-12 rounded-xl overflow-hidden flex-shrink-0 transition-all cursor-pointer border ${
                  idx === currentIndex
                    ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20 ring-1 ring-blue-500'
                    : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
                title={item.title}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && currentItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 sm:p-6 animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Close Lightbox (Esc)"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 text-white hover:bg-blue-600 border border-slate-800 transition-colors cursor-pointer"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Navigation Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 text-white hover:bg-blue-600 border border-slate-800 transition-colors cursor-pointer"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Modal Content */}
          <div 
            className="w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lg:w-3/5 bg-black flex items-center justify-center min-h-[320px] lg:min-h-[480px]">
              <img
                src={currentItem.image_url}
                alt={currentItem.title}
                className="w-full h-full max-h-[75vh] object-contain"
              />
            </div>

            <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-900">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {currentItem.category}
                  </span>
                  {currentItem.event_date && (
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                      {currentItem.event_date}
                    </span>
                  )}
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                  {currentItem.title}
                </h2>

                {currentItem.caption && (
                  <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed border-l-2 border-blue-500 pl-3">
                    {currentItem.caption}
                  </p>
                )}

                {currentItem.description && (
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {currentItem.description}
                  </p>
                )}

                {currentItem.location && (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
                    <MapPin className="h-4 w-4 text-rose-400 flex-shrink-0" />
                    <span>{currentItem.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>
                  Photo {currentIndex + 1} of {items.length}
                </span>
                <a
                  href={currentItem.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Open Full Res</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
