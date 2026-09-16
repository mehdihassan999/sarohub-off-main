import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Venture } from '../../types';
import { api } from '../../api';
import VentureStatus from './VentureStatus';
import VentureStrategicBlueprint from './VentureStrategicBlueprint';
import { motion } from 'motion/react';
import {
  ArrowLeft, ExternalLink, Globe, Cpu, Users, Target, Layers,
  Lightbulb, TrendingUp, ChevronLeft, ChevronRight, CheckCircle2, Tag
} from 'lucide-react';

export default function VentureDetail() {
  const { slug } = useParams<{ slug: string }>();
  const cached = api.getCachedVentures();
  const initialVenture = (() => {
    if (cached) {
      const match = cached.find((v: any) => v.slug === slug || String(v.id) === slug);
      if (match) return match as Venture;
    }
    // Instant fallback if slug is default venture
    if (slug === 'alin316-school-management-system' || slug === '1') {
      return {
        id: 1,
        name: 'Alin316 (School Management System)',
        slug: 'alin316-school-management-system',
        tagline: 'Comprehensive school and institute management ecosystem',
        description: 'An enterprise-grade, cloud-based education management system engineered to automate admissions, academics, fee operations, exams, attendance, and multi-campus reporting.',
        category: 'EdTech • Enterprise SaaS',
        status: 'In Development',
        keyCapabilities: ['Multi-Campus Administration', 'Automated Fee Management', 'Student & Parent Portals'],
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        featured: true,
        order: 1,
        published: true,
        coverImage: '/uploads/venture-cover-0-17886',
        websiteUrl: '',
        demoUrl: '',
        industry: 'Education Technology (EdTech)',
        targetMarket: 'Private Schools, Academies & Multi-Campus Institutions',
        businessModel: 'B2B SaaS Subscription Model',
      } as Venture;
    }
    return null;
  })();

  const [venture, setVenture] = useState<Venture | null>(initialVenture);
  const [loading, setLoading] = useState<boolean>(() => !initialVenture);
  const [error, setError] = useState<string | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    if (!slug) return;
    api
      .getVentureBySlug(slug)
      .then((data) => {
        if (data) setVenture(data as Venture);
      })
      .catch(() => {
        if (!initialVenture) setError('Venture not found.');
      })
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
        <Link to="/ventures" className="text-blue-400 hover:text-blue-300 text-sm font-bold underline">
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
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-5 pb-4 sm:pt-6 sm:pb-5">
          <div className="mb-2.5">
            <Link
              to="/ventures"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Ventures
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-2.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              {ventureLabel}
            </span>
            <VentureStatus status={venture.status} size="md" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
            style={{ color: 'var(--text-main)' }}
          >
            {venture.name}
          </motion.h1>

          {venture.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-1.5 text-base sm:text-lg font-semibold italic"
              style={{ color: 'var(--text-body)' }}
            >
              "{venture.tagline}"
            </motion.p>
          )}

          {venture.category && (
            <div className="mt-2.5">
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)', color: 'var(--text-muted)' }}
              >
                {venture.category}
              </span>
            </div>
          )}

          {/* External links */}
          {(venture.websiteUrl || venture.demoUrl) && (
            <div className="mt-4 flex flex-wrap gap-3">
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
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-4 sm:pt-5 pb-16 space-y-7 sm:space-y-8">

        {/* Description / About */}
        {venture.description && (
          <section className="rounded-2xl border p-5 sm:p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">Venture Overview</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-2.5" style={{ color: 'var(--text-main)' }}>
              About {venture.name}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium" style={{ color: 'var(--text-body)' }}>
              {venture.description}
            </p>
          </section>
        )}

        {/* Strategic Blueprint: Industry & Sector, Target Market & Business Model */}
        {(venture.industry || venture.targetMarket || venture.businessModel) && (
          <VentureStrategicBlueprint
            industry={venture.industry}
            targetMarket={venture.targetMarket}
            businessModel={venture.businessModel}
            ventureName={venture.name}
          />
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
