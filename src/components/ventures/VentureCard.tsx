import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Venture } from '../../types';
import VentureStatus from './VentureStatus';

interface VentureCardProps {
  venture: Venture;
  index: number;
}

const VentureCard: React.FC<VentureCardProps> = ({ venture, index }) => {
  const ventureLabel = `VENTURE ${String(venture.order || index + 1).padStart(2, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      className="group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
    >
      {/* Cover Image - Compact & Sleek */}
      {venture.coverImage && (
        <div className="relative h-36 sm:h-40 overflow-hidden bg-slate-950">
          <img
            src={venture.coverImage}
            alt={venture.name}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-[1.05] transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/40 to-transparent" />
          {/* Status badge on cover */}
          <div className="absolute top-2.5 right-2.5">
            <VentureStatus status={venture.status} size="sm" />
          </div>
          {/* Venture label tag */}
          <div className="absolute bottom-2.5 left-3">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-slate-300">
              {ventureLabel}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 sm:p-5">
        {/* Venture number + status (when no cover) */}
        {!venture.coverImage && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
              {ventureLabel}
            </span>
            <VentureStatus status={venture.status} size="sm" />
          </div>
        )}

        {/* Name */}
        <h3
          className="font-display text-base sm:text-lg font-bold tracking-tight group-hover:text-blue-400 transition-colors duration-200"
          style={{ color: 'var(--text-main)' }}
        >
          {venture.name}
        </h3>

        {/* Tagline */}
        {venture.tagline && (
          <p className="mt-1 text-xs font-medium italic text-blue-400/90">
            "{venture.tagline}"
          </p>
        )}

        {/* Description - Clamped to 2 lines */}
        <p
          className="mt-2.5 text-xs leading-relaxed font-medium line-clamp-2"
          style={{ color: 'var(--text-body)' }}
        >
          {venture.description}
        </p>

        {/* Category Badge */}
        {venture.category && (
          <div className="mt-3 flex flex-wrap gap-1">
            <span
              className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
              style={{ backgroundColor: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.18)', color: '#60a5fa' }}
            >
              {venture.category}
            </span>
          </div>
        )}

        {/* Key Capabilities - Compact 3 items */}
        {venture.keyCapabilities && venture.keyCapabilities.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-dashed" style={{ borderColor: 'var(--border-app)' }}>
            <ul className="space-y-1">
              {venture.keyCapabilities.slice(0, 3).map((cap, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: 'var(--text-body)' }}>
                  <CheckCircle2 className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Footer */}
        <div className="mt-5 pt-3 border-t flex items-center justify-between gap-2 text-xs" style={{ borderColor: 'var(--border-app)' }}>
          {venture.learnMoreUrl ? (
            <Link
              to={venture.learnMoreUrl}
              className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 transition-colors text-[11px]"
            >
              Details
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : <div />}

          {venture.demoUrl && (
            <a
              href={venture.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors text-[11px]"
            >
              Live Demo
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VentureCard;
