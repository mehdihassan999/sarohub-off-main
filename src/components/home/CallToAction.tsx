import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake } from 'lucide-react';
import { motion } from 'motion/react';

interface CallToActionProps {
  settings?: { [key: string]: string };
}

export default function CallToAction({ settings = {} }: CallToActionProps) {
  const heading = settings.cta_heading || 'Have an idea or a business challenge?';
  const subtext = settings.cta_subtext || "Let's build something meaningful together. Whether you are launching a new product, scaling a business system, or exploring a technology partnership.";
  const primaryBtn = settings.cta_primary_btn || 'Book Discovery Call';
  const primaryLink = settings.cta_primary_link || '/book';
  const secondaryBtn = settings.cta_secondary_btn || 'Calculate Scope & Cost';
  const secondaryLink = settings.cta_secondary_link || '/estimate';
  const tertiaryBtn = settings.cta_tertiary_btn || 'Executive Deck (PDF)';
  const tertiaryLink = settings.cta_tertiary_link || '/capabilities';

  return (
    <section 
      id="cta" 
      className="py-20 lg:py-28 relative overflow-hidden border-b"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      {/* Light background glowing ambient details */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-10 sm:p-16 rounded-3xl text-center relative overflow-hidden group border shadow-xl shadow-blue-950/20"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-app)' 
          }}
        >
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {heading}
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-xl mx-auto">
              {subtext}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to={primaryLink}
                id="cta-book-consultation"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{primaryBtn}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={secondaryLink}
                id="cta-calculate-scope"
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 group cursor-pointer border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-900/30 text-cyan-300"
              >
                <span>{secondaryBtn}</span>
              </Link>
              <Link
                to={tertiaryLink}
                id="cta-download-deck"
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 group cursor-pointer border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <span>{tertiaryBtn}</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
