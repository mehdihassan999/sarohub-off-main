import React, { useState, useEffect } from 'react';
import { 
  Camera, Calendar, MapPin, Users, Tag, Search, Filter, 
  ExternalLink, ChevronLeft, ChevronRight, X, Sparkles, 
  Building2, GraduationCap, Award, RefreshCw, ZoomIn
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { CompanyGalleryItem } from '../types';
import { CompanyGallerySlider } from '../components/home/CompanyGallerySlider';

export const CompanyGalleryView: React.FC = () => {
  const [items, setItems] = useState<CompanyGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Lightbox modal state
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await api.getCompanyGallery();
      setItems(data || []);
    } catch (err) {
      console.error('Failed to load company gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, items]);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      item.title.toLowerCase().includes(q) ||
      (item.caption && item.caption.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
    return matchesCat && matchesSearch;
  });

  const handleNextPhoto = () => {
    if (activePhotoIndex === null || filteredItems.length === 0) return;
    setActivePhotoIndex((activePhotoIndex + 1) % filteredItems.length);
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex === null || filteredItems.length === 0) return;
    setActivePhotoIndex((activePhotoIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const activePhoto = activePhotoIndex !== null ? filteredItems[activePhotoIndex] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white pb-24">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-12 pb-12 border-b border-slate-800/80">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-[300px] h-[200px] bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium mb-4">
              <Camera className="h-3.5 w-3.5" />
              <span>Life, Milestones &amp; Regional Impact</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Company Gallery &amp; Ecosystem Collaborations
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              An inside look at SaroHub in action — keynote engineering seminars, technical SEO collaborations with regional IT centers, sprint hackathons, and developer masterclasses.
            </p>

            {/* Quick stats pills */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
                <span>Technical Seminars</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>IT Center Collaborations</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <Users className="h-3.5 w-3.5 text-purple-400" />
                <span>Culture &amp; Hackathons</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Modern Slider Showcase */}
      <div className="border-b border-slate-900 bg-slate-950/50">
        <CompanyGallerySlider 
          title="Interactive Moments Slider" 
          subtitle="Explore our seminars, SEO collaborations, and team hackathons through a modern widescreen photography slider."
          showViewAllLink={false}
        />
      </div>

      {/* Main Content Area — Streamlined Photo Archive (Not bulky cards) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map(cat => {
              const count = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search seminars, SEO, topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Gallery Visual Grid — Photography Centric, NOT bulky full cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm font-mono">Loading company gallery...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
            <Camera className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No photos found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              No gallery images match the selected filter or search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
              <span>Showing {filteredItems.length} {filteredItems.length === 1 ? 'photograph' : 'photographs'}</span>
              <span>Filter: {selectedCategory}</span>
            </div>

            {/* Cinematic Edge-to-Edge Photo Frames without bulky card bodies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  id={`gallery-photo-${item.id}`}
                  onClick={() => setActivePhotoIndex(index)}
                  className="group relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/90 hover:border-blue-500/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=500');
                    }}
                  />

                  {/* Dynamic Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Top Category Badge & Zoom Icon */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/70 border border-white/10 text-white backdrop-blur-md">
                      {item.category}
                    </span>
                    <div className="p-1.5 rounded-full bg-slate-950/70 text-slate-300 group-hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                      <ZoomIn className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Seamless Bottom Overlay Title & Location (No separate boxy card body) */}
                  <div className="absolute bottom-0 inset-x-0 p-4 space-y-1.5">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
                      {item.event_date && (
                        <span className="flex items-center gap-1 text-blue-400">
                          <Calendar className="h-3 w-3" />
                          {item.event_date}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1 truncate text-slate-300">
                          <MapPin className="h-3 w-3 text-rose-400 flex-shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-blue-400 transition-colors line-clamp-1 drop-shadow-md">
                      {item.title}
                    </h3>

                    {item.caption && (
                      <p className="text-xs text-slate-300 line-clamp-1 drop-shadow opacity-90">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 sm:p-6 animate-fadeIn"
          onClick={() => setActivePhotoIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
            title="Close Lightbox (Esc)"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPhoto();
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
              handleNextPhoto();
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
            {/* Image viewer */}
            <div className="lg:w-3/5 bg-black flex items-center justify-center min-h-[320px] lg:min-h-[480px]">
              <img
                src={activePhoto.image_url}
                alt={activePhoto.title}
                className="w-full h-full max-h-[75vh] object-contain"
              />
            </div>

            {/* Metadata sidebar */}
            <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-slate-900">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {activePhoto.category}
                  </span>
                  {activePhoto.event_date && (
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                      {activePhoto.event_date}
                    </span>
                  )}
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                  {activePhoto.title}
                </h2>

                {activePhoto.caption && (
                  <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed border-l-2 border-blue-500 pl-3">
                    {activePhoto.caption}
                  </p>
                )}

                {activePhoto.description && (
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {activePhoto.description}
                  </p>
                )}

                {activePhoto.location && (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
                    <MapPin className="h-4 w-4 text-rose-400 flex-shrink-0" />
                    <span>{activePhoto.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>
                  Photo {activePhotoIndex !== null ? activePhotoIndex + 1 : 0} of {filteredItems.length}
                </span>
                <a
                  href={activePhoto.image_url}
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
    </div>
  );
};
