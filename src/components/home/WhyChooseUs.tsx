import React, { useEffect, useState } from 'react';
import { 
  Lightbulb, Cpu, Target, HeartHandshake, CheckCircle, TrendingUp, Grid, Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../../api';

interface WhyChooseUsProps {
  settings?: { [key: string]: string };
}

const ICON_MAP: { [key: string]: any } = {
  Lightbulb,
  Cpu,
  Target,
  HeartHandshake,
  CheckCircle,
  TrendingUp,
  Grid,
  Award
};

export default function WhyChooseUs({ settings = {} }: WhyChooseUsProps) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api.getWhySaroHub()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.filter(i => i.status === 'active'));
        } else {
          setItems(defaultFallbackPoints);
        }
      })
      .catch(() => setItems(defaultFallbackPoints));
  }, []);

  const defaultFallbackPoints = [
    {
      icon: 'CheckCircle',
      title: settings.why_1_title || 'Business-First Engineering',
      shortDescription: settings.why_1_desc || 'We solve the business problem before selecting technology.',
    },
    {
      icon: 'Cpu',
      title: settings.why_2_title || 'AI Where It Matters',
      shortDescription: settings.why_2_desc || 'Targeted AI models that create measurable impact.',
    },
    {
      icon: 'TrendingUp',
      title: settings.why_3_title || 'Product Thinking',
      shortDescription: settings.why_3_desc || 'Built for usability, retention, and long-term growth.',
    },
    {
      icon: 'Award',
      title: settings.why_4_title || 'One Technology Partner',
      shortDescription: settings.why_4_desc || 'Strategy, design, development, and support under one partner.',
    },
  ];

  const sectionHeading = settings.why_heading || 'Why Build With SaroHub?';
  const sectionSubtitle = settings.why_subtitle || 'Combining business-first insight, product-driven engineering, and dedicated long-term partnership.';

  const displayPoints = items.length > 0 ? items : defaultFallbackPoints;

  return (
    <section 
      id="why-choose-us" 
      className="py-24 relative border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="absolute bottom-12 left-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
            Why SaroHub
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
            style={{ color: 'var(--text-main)' }}
          >
            {sectionHeading}
          </h2>
          <p 
            className="mt-4 text-sm font-medium leading-relaxed text-slate-400"
          >
            {sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPoints.map((point, idx) => {
            const IconComponent = ICON_MAP[point.icon] || Lightbulb;

            return (
              <motion.div
                key={point.id || idx}
                className="p-6 rounded-2xl border shadow-sm premium-card-hover flex flex-col justify-between transition-all duration-300 bg-slate-900/90 border-white/10"
              >
                <div>
                  <div className="flex h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-xl items-center justify-center text-blue-400 mb-5">
                    <IconComponent className="h-5 w-5 stroke-[1.8]" />
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed font-medium text-slate-300">
                    {point.shortDescription || point.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

