import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '../../api';
import { Venture } from '../../types';
import VentureStatus from '../ventures/VentureStatus';

export default function SelectedVenturesSection() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVentures()
      .then((data) => {
        const published = (data as Venture[]).filter((v) => v.published);
        // Show 3-4 featured or first items
        const featured = published.filter(v => v.featured);
        setVentures(featured.length >= 3 ? featured.slice(0, 4) : published.slice(0, 4));
      })
      .catch((err) => {
        console.error('Error fetching ventures:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section 
      id="selected-ventures" 
      className="py-20 lg:py-28 relative border-b overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
              <Rocket className="w-3.5 h-3.5" />
              <span>Proprietary Products</span>
            </div>
            <h2 
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Selected Ventures
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              We engineer, launch, and operate our own software products, applying rigorous venture-building standards to address real market problems.
            </p>
          </div>

          <Link
            to="/ventures"
            id="view-all-ventures-top"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group shrink-0"
          >
            <span>Explore All Ventures</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Ventures Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ventures.map((venture) => (
              <div
                key={venture.id}
                id={`venture-card-${venture.id}`}
                className="flex flex-col justify-between rounded-2xl border overflow-hidden transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1 group"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-app)' 
                }}
              >
                {/* Media Header */}
                <div className="relative h-44 bg-slate-900 overflow-hidden border-b" style={{ borderColor: 'var(--border-app)' }}>
                  {venture.coverImage ? (
                    <img 
                      src={venture.coverImage} 
                      alt={venture.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-95"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
                      <Rocket className="w-12 h-12 text-blue-500/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-80" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <VentureStatus status={venture.status} size="sm" />
                  </div>

                  {/* Category Pill */}
                  {venture.category && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-slate-200">
                        {venture.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {venture.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">
                      {venture.tagline || venture.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between mt-auto" style={{ borderColor: 'var(--border-app)' }}>
                    <Link
                      to={`/ventures/${venture.slug}`}
                      id={`view-venture-${venture.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group/btn"
                    >
                      <span>View Venture</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>

                    {venture.websiteUrl && (
                      <a
                        href={venture.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors p-1"
                        title="Live Site"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA to All Ventures */}
        <div className="mt-12 text-center">
          <Link
            to="/ventures"
            id="view-all-ventures-btn"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200"
          >
            <span>Explore All Ventures & Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
