import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { Venture } from '../../types';
import VentureStatus from './VentureStatus';

interface VentureCardProps {
  venture: Venture;
  index: number;
}

const VentureCard: React.FC<VentureCardProps> = ({ venture, index }) => {
  const detailUrl = venture.learnMoreUrl || `/ventures/${venture.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      className="group flex flex-col justify-between rounded-2xl border overflow-hidden transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 h-full"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-app)',
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
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-slate-200">
              {venture.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <Link to={detailUrl}>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors tracking-tight">
              {venture.name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4 font-normal">
            {venture.tagline || venture.description}
          </p>
        </div>

        <div className="pt-4 border-t flex items-center justify-between mt-auto" style={{ borderColor: 'var(--border-app)' }}>
          <Link
            to={detailUrl}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors group/btn"
          >
            <span>View Venture</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>

          {(venture.websiteUrl || venture.demoUrl) && (
            <a
              href={venture.websiteUrl || venture.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="Live Link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VentureCard;
