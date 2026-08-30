import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Rocket, Cpu, Code, Lightbulb, Globe, Briefcase, Users } from 'lucide-react';

const collaborationTypes = [
  { icon: Rocket, label: 'Venture Collaboration' },
  { icon: Globe, label: 'Technology Partnerships' },
  { icon: Code, label: 'Product Development' },
  { icon: Cpu, label: 'Software Development' },
  { icon: Lightbulb, label: 'AI Solutions' },
  { icon: Briefcase, label: 'Agency Partnerships' },
  { icon: Users, label: 'Startup Partnerships' },
];

const targetAudiences = [
  'Entrepreneurs',
  'Startups',
  'Technology Companies',
  'Software Agencies',
  'Businesses',
  'Organizations',
];

export default function BuildWithSaroHub() {
  return (
    <section
      id="build-with-sarohub"
      className="py-24 relative overflow-hidden border-b"
      style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-app)' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Heading + CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400 mb-6"
            >
              Partnership & Collaboration
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight"
              style={{ color: 'var(--text-main)' }}
            >
              Build With SaroHub
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-4 text-sm sm:text-base font-medium leading-relaxed max-w-xl"
              style={{ color: 'var(--text-body)' }}
            >
              Have an idea, product, business challenge, or technology opportunity? Let's build it together.
            </motion.p>

            {/* Audience tags */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {targetAudiences.map((audience) => (
                <span
                  key={audience}
                  className="px-3 py-1.5 rounded-full border text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-app)',
                    color: 'var(--text-body)',
                  }}
                >
                  {audience}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-[1.01] cursor-pointer"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Collaboration type cards */}
          <div>
            <p
              className="text-[10px] font-mono font-bold uppercase tracking-widest mb-6"
              style={{ color: 'var(--text-muted)' }}
            >
              How We Collaborate
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collaborationTypes.map((type, i) => (
                <motion.div
                  key={type.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer group"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
                >
                  <div className="flex h-9 w-9 shrink-0 rounded-lg bg-blue-500/10 border border-blue-500/20 items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <type.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold group-hover:text-blue-300 transition-colors" style={{ color: 'var(--text-main)' }}>
                    {type.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
