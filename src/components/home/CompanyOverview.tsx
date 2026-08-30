import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Lightbulb, Cpu, HeartHandshake, Layers, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CompanyOverviewProps {
  settings?: { [key: string]: string };
}

export default function CompanyOverview({ settings = {} }: CompanyOverviewProps) {
  const overviewTitle = settings.overview_title || 'We Turn Ideas Into Ventures.';
  const overviewDescription = settings.overview_description ||
    'SaroHub Technologies is an entrepreneurship-driven technology company focused on transforming ambitious ideas into products, ventures, and impactful digital businesses. We build ventures of our own while partnering with businesses, agencies, and entrepreneurs to develop technology that solves real problems and creates long-term value.';
  const overviewTagline = settings.overview_tagline || 'Founded in Gilgit-Baltistan, Pakistan. Building for a global market.';
  const missionText = settings.mission_text ||
    'To turn ambition into ventures by combining entrepreneurship, technology, AI, research, and execution to build products and businesses that solve meaningful problems and create lasting value.';
  const visionText = settings.vision_text ||
    'To become a global force in venture creation, transforming bold ideas and real-world challenges into technology-driven businesses that shape the future.';

  const highlights = [
    {
      icon: Lightbulb,
      title: settings.highlight_1_title || 'Entrepreneurial Mindset',
      desc: settings.highlight_1_desc || 'We think beyond development—identifying opportunities, validating ideas, and building businesses.',
    },
    {
      icon: Cpu,
      title: settings.highlight_2_title || 'Technical Capability',
      desc: settings.highlight_2_desc || 'We turn complex challenges into reliable, scalable technology.',
    },
    {
      icon: Layers,
      title: settings.highlight_3_title || 'Product Thinking',
      desc: settings.highlight_3_desc || 'We build around real users, real problems, and long-term business value.',
    },
    {
      icon: HeartHandshake,
      title: settings.highlight_4_title || 'Long-Term Partnership',
      desc: settings.highlight_4_desc || 'We build relationships designed to create lasting value for entrepreneurs, businesses, and agencies.',
    },
  ];

  return (
    <section 
      id="overview" 
      className="py-24 relative border-t border-b overflow-hidden grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: About + Mission/Vision */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
                Company Overview
              </span>
              <h2 
                className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6 leading-tight"
                style={{ color: 'var(--text-main)' }}
              >
                {overviewTitle}
              </h2>
              <p 
                className="mt-4 text-sm sm:text-base leading-relaxed font-sans font-medium"
                style={{ color: 'var(--text-body)' }}
              >
                {overviewDescription}
              </p>
              <p 
                className="mt-3 text-xs font-semibold tracking-wide uppercase text-blue-400"
              >
                {overviewTagline}
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                className="rounded-2xl p-6 border shadow-sm relative overflow-hidden group premium-card-hover transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-app)' 
                }}
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-bl-3xl group-hover:bg-blue-500/10 transition-colors" />
                <div className="flex h-10 w-10 bg-blue-500/10 rounded-lg items-center justify-center border border-blue-500/20 text-blue-400 mb-4">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>Our Mission</h3>
                <p className="mt-2 text-xs leading-relaxed font-medium" style={{ color: 'var(--text-body)' }}>
                  {missionText}
                </p>
              </motion.div>

              <motion.div
                className="rounded-2xl p-6 border shadow-sm relative overflow-hidden group premium-card-hover transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-app)' 
                }}
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-bl-3xl group-hover:bg-indigo-500/10 transition-colors" />
                <div className="flex h-10 w-10 bg-indigo-500/10 rounded-lg items-center justify-center border border-indigo-500/20 text-indigo-400 mb-4">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold" style={{ color: 'var(--text-main)' }}>Our Vision</h3>
                <p className="mt-2 text-xs leading-relaxed font-medium" style={{ color: 'var(--text-body)' }}>
                  {visionText}
                </p>
              </motion.div>
            </div>

            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 group cursor-pointer"
              >
                Learn more about SaroHub
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Why SaroHub Core Principles */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-mono text-xs uppercase tracking-wider font-extrabold mb-2" style={{ color: 'var(--text-muted)' }}>
              Why SaroHub
            </h3>

            <div className="space-y-4">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-5 rounded-xl border transition-all duration-300 premium-card-hover"
                  style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-app)' 
                  }}
                >
                  <div className="flex h-10 w-10 shrink-0 bg-blue-500/10 border border-blue-500/20 rounded-lg items-center justify-center text-blue-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold" style={{ color: 'var(--text-main)' }}>{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed font-medium" style={{ color: 'var(--text-body)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
