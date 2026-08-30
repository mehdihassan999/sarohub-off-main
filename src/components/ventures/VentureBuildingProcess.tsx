import React from 'react';
import { motion } from 'motion/react';

const steps = [
  {
    number: '01',
    label: 'IDENTIFY',
    title: 'Find Meaningful Problems',
    desc: 'Find meaningful problems and opportunities.',
  },
  {
    number: '02',
    label: 'VALIDATE',
    title: 'Test Assumptions',
    desc: 'Test assumptions and understand the market.',
  },
  {
    number: '03',
    label: 'BUILD',
    title: 'Develop the Product',
    desc: 'Develop the product, technology, and experience.',
  },
  {
    number: '04',
    label: 'LAUNCH',
    title: 'Into Real Hands',
    desc: 'Put the venture into the hands of real users.',
  },
  {
    number: '05',
    label: 'SCALE',
    title: 'Sustainable Growth',
    desc: 'Turn validated products into sustainable businesses.',
  },
];

export default function VentureBuildingProcess() {
  return (
    <section
      id="how-we-build-ventures"
      className="py-24 relative overflow-hidden border-b grid-bg"
      style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-app)' }}
    >
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400 mb-6">
            Our Process
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl font-black tracking-tight"
            style={{ color: 'var(--text-main)' }}
          >
            How We Build Ventures
          </h2>
          <p
            className="mt-4 text-sm font-medium leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            We believe great ventures begin with meaningful problems — not technology for technology's sake.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden lg:block absolute top-[2.5rem] left-0 right-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.15), transparent)' }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative group"
              >
                {/* Step card */}
                <div
                  className="rounded-2xl border p-6 h-full flex flex-col gap-4 transition-all duration-300 premium-card-hover"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
                >
                  {/* Number bubble */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-black text-sm border group-hover:border-blue-500/40 group-hover:text-blue-400 transition-all"
                      style={{
                        backgroundColor: 'var(--bg-app)',
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-main)',
                      }}
                    >
                      {step.number}
                    </div>
                    <span
                      className="text-[9px] font-mono font-black uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3
                      className="font-display text-sm font-extrabold mb-1 group-hover:text-blue-400 transition-colors"
                      style={{ color: 'var(--text-main)' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-xs font-medium leading-relaxed"
                      style={{ color: 'var(--text-body)' }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
