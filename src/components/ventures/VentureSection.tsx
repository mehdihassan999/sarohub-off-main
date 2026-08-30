import React, { useState, useEffect } from 'react';
import { Venture } from '../../types';
import VentureGrid from './VentureGrid';
import { api } from '../../api';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function VentureSection() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getVentures()
      .then((data) => {
        const published = (data as Venture[]).filter((v) => v.published);
        setVentures(published);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="ventures"
      className="py-24 relative overflow-hidden border-b grid-bg"
      style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-app)' }}
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Our Ventures
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight"
            style={{ color: 'var(--text-main)' }}
          >
            Building What Comes Next.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-3 text-base font-semibold"
            style={{ color: 'var(--text-body)' }}
          >
            We don't just build technology for others. We build ventures of our own.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-3 text-sm font-medium leading-relaxed max-w-2xl"
            style={{ color: 'var(--text-body)' }}
          >
            From education and real estate to business and healthcare, our ventures are built around real-world
            problems and opportunities. We combine entrepreneurship, technology, AI, and product thinking to develop
            solutions with the potential to become scalable businesses.
          </motion.p>
        </div>

        {/* Ventures Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border h-96 animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
              />
            ))}
          </div>
        ) : ventures.length > 0 ? (
          <VentureGrid ventures={ventures} />
        ) : (
          <div
            className="text-center py-20 rounded-2xl border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              No ventures published yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
