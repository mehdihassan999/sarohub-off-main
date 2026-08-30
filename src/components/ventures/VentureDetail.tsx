import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Venture } from '../../types';
import { api } from '../../api';
import VentureStatus from './VentureStatus';
import { motion } from 'motion/react';
import {
  ArrowLeft, ExternalLink, Globe, Cpu, Users, Target, Layers,
  Lightbulb, TrendingUp, ChevronLeft, ChevronRight, CheckCircle2, Tag
} from 'lucide-react';

export default function VentureDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [venture, setVenture] = useState<Venture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .getVentureBySlug(slug)
      .then((data) => setVenture(data as Venture))
      .catch(() => setError('Venture not found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Update document meta
  useEffect(() => {
    if (venture) {
      document.title = `${venture.name} | SaroHub Technologies`;
    }
    return () => {
      document.title = 'SaroHub Technologies';
    };
  }, [venture]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !venture) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ backgroundColor: 'var(--bg-app)' }}>
        <p className="text-lg font-bold text-red-400">{error || 'Venture not found.'}</p>
        <Link to="/#ventures" className="text-blue-400 hover:text-blue-300 text-sm font-bold underline">
          ← Back to Ventures
        </Link>
      </div>
    );
  }

  const ventureLabel = `VENTURE ${String(venture.order || 1).padStart(2, '0')}`;
  const rawGallery = (venture.gallery || venture.galleryImages || []) as any[];
  const gallery = rawGallery.map((item) => {
    if (typeof item === 'string') return { url: item, caption: '', description: '' };
    return {
      url: item?.url || '',
      caption: item?.caption || '',
      description: item?.description || item?.caption || '',
    };
  }).filter((item) => Boolean(item.url));

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Hero */}
      <div className="relative border-b overflow-hidden" style={{ borderColor: 'var(--border-app)' }}>
        {venture.coverImage && (
          <div className="absolute inset-0 z-0">
            <img src={venture.coverImage} alt={venture.name} className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-app)]/80 to-[var(--bg-app)]" />
          </div>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
          <div className="mb-6">
            <Link
              to="/#ventures"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Ventures
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              {ventureLabel}
            </span>
            <VentureStatus status={venture.status} size="md" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight"
            style={{ color: 'var(--text-main)' }}
          >
            {venture.name}
          </motion.h1>

          {venture.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-4 text-lg sm:text-xl font-semibold italic"
              style={{ color: 'var(--text-body)' }}
            >
              "{venture.tagline}"
            </motion.p>
          )}

          {venture.category && (
            <div className="mt-5">
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)', color: 'var(--text-muted)' }}
              >
                {venture.category}
              </span>
            </div>
          )}

          {/* External links */}
          <div className="mt-8 flex flex-wrap gap-3">
            {venture.websiteUrl && (
              <a
                href={venture.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20"
              >
                <Globe className="h-3.5 w-3.5" />
                Visit Website
              </a>
            )}
            {venture.demoUrl && (
              <a
                href={venture.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider hover:border-blue-400 hover:text-blue-400 transition-all"
                style={{ borderColor: 'var(--border-app)', color: 'var(--text-main)' }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* Description */}
        {venture.description && (
          <section>
            <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>About</h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-body)' }}>{venture.description}</p>
          </section>
        )}

        {/* Problem & Solution */}
        {(venture.problem || venture.solution) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {venture.problem && (
              <div className="rounded-2xl border p-7" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <Target className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>The Problem</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>{venture.problem}</p>
              </div>
            )}
            {venture.solution && (
              <div className="rounded-2xl border p-7" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>The Solution</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>{venture.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Key Capabilities */}
        {venture.keyCapabilities && venture.keyCapabilities.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>
              Key Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {venture.keyCapabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
                  <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{cap}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technologies */}
        {venture.technologies && venture.technologies.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold mb-5" style={{ color: 'var(--text-main)' }}>
              Technology
            </h2>
            <div className="flex flex-wrap gap-2">
              {venture.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)', color: 'var(--text-body)' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">Platform Showcase</span>
                <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Gallery & Screenshots</h2>
              </div>
              {gallery.length > 1 && (
                <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ borderColor: 'var(--border-app)', color: 'var(--text-muted)' }}>
                  {galleryIdx + 1} / {gallery.length}
                </span>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden border shadow-xl bg-slate-950" style={{ borderColor: 'var(--border-app)' }}>
              <div className="relative aspect-video sm:h-[440px] w-full overflow-hidden flex items-center justify-center bg-slate-900">
                <img
                  src={gallery[galleryIdx].url}
                  alt={gallery[galleryIdx].caption || `${venture.name} screenshot ${galleryIdx + 1}`}
                  className="w-full h-full object-contain sm:object-cover"
                />

                {/* Description / Caption Overlay */}
                {(gallery[galleryIdx].caption || gallery[galleryIdx].description) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-5 pt-10">
                    <p className="text-sm font-semibold text-white">
                      {gallery[galleryIdx].caption || gallery[galleryIdx].description}
                    </p>
                    {gallery[galleryIdx].description && gallery[galleryIdx].caption && gallery[galleryIdx].description !== gallery[galleryIdx].caption && (
                      <p className="text-xs text-slate-300 mt-1">
                        {gallery[galleryIdx].description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryIdx((prev) => (prev - 1 + gallery.length) % gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-cyan-500 hover:text-slate-950 transition-all border border-slate-700 shadow-lg cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setGalleryIdx((prev) => (prev + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-cyan-500 hover:text-slate-950 transition-all border border-slate-700 shadow-lg cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Preview Strip */}
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {gallery.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryIdx(idx)}
                    className={`relative rounded-xl overflow-hidden border text-left transition-all group cursor-pointer ${galleryIdx === idx ? 'ring-2 ring-cyan-400 border-cyan-400 shadow-md' : 'opacity-70 hover:opacity-100'}`}
                    style={{ borderColor: 'var(--border-app)' }}
                  >
                    <div className="h-20 bg-slate-900 overflow-hidden">
                      <img src={item.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    {item.caption && (
                      <p className="p-1 text-[10px] truncate font-medium text-slate-300 bg-slate-900/90">{item.caption}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Target Market & Business Model */}
        {(venture.targetMarket || venture.businessModel || venture.industry) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {venture.industry && (
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Industry</p>
                <p className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>{venture.industry}</p>
              </div>
            )}
            {venture.targetMarket && (
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Target Market</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{venture.targetMarket}</p>
              </div>
            )}
            {venture.businessModel && (
              <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Business Model</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{venture.businessModel}</p>
              </div>
            )}
          </div>
        )}

        {/* Current Status */}
        <section className="rounded-2xl border p-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
          <h2 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-main)' }}>Current Status</h2>
          <div className="flex items-center gap-4">
            <VentureStatus status={venture.status} size="lg" />
            {venture.launchDate && (
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Launch planned: {venture.launchDate}
              </span>
            )}
          </div>
        </section>

        {/* CTA */}
        <section
          className="rounded-2xl border p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.08) 100%)',
            borderColor: 'var(--border-app)'
          }}
        >
          <h2 className="font-display text-2xl font-black" style={{ color: 'var(--text-main)' }}>
            Interested in {venture.name}?
          </h2>
          <p className="mt-3 text-sm font-medium mb-8" style={{ color: 'var(--text-body)' }}>
            Get in touch to learn more, explore collaboration, or stay updated on our progress.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20"
            >
              Start a Conversation
            </Link>
            <Link
              to="/#ventures"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-xs font-bold uppercase tracking-wider hover:border-blue-400 hover:text-blue-400 transition-all"
              style={{ borderColor: 'var(--border-app)', color: 'var(--text-main)' }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Ventures
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
