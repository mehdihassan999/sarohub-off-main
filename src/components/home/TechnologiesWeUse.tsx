import React from 'react';
import { 
  Atom, Database, Code2, Server, Layout, FileCode, Cloud, Terminal, Compass, Palette
} from 'lucide-react';
import { motion } from 'motion/react';

export default function TechnologiesWeUse() {
  const techs = [
    { name: 'React', icon: Atom, desc: 'Responsive interfaces & layouts', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { name: 'Node.js', icon: Server, desc: 'High-speed runtime engines', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Express.js', icon: Code2, desc: 'Enterprise REST & JSON pipelines', color: 'text-slate-300', bg: 'bg-slate-500/10 border-slate-500/20' },
    { name: 'MySQL', icon: Database, desc: 'Relational 3NF transactional data', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'Tailwind CSS', icon: Layout, desc: 'Modern responsive layouts', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { name: 'JavaScript', icon: FileCode, desc: 'Highly optimized scripting rules', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { name: 'TypeScript', icon: Terminal, desc: 'Static type integrity safeguards', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'Docker', icon: Cloud, desc: 'Isolated sandbox microservices', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { name: 'Git', icon: Compass, desc: 'Complete version tracing', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { name: 'Figma', icon: Palette, desc: 'Collaborative UI/UX wireframes', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { name: 'Cloud Tech', icon: Cloud, desc: 'Serverless containers on GCP/AWS', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  ];

  return (
    <section 
      id="technologies" 
      className="py-24 relative overflow-hidden border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
            Our Stack
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
            style={{ color: 'var(--text-main)' }}
          >
            Technologies We Use
          </h2>
          <p 
            className="mt-4 text-sm font-medium leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            We build with modern, reliable technologies and frameworks.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {techs.map((tech, idx) => {
            const Icon = tech.icon;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="p-5 rounded-2xl border flex flex-col items-center text-center justify-between group transition-all duration-300 premium-card-hover"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-app)' 
                }}
              >
                <div className={`flex h-12 w-12 ${tech.bg} ${tech.color} border rounded-xl items-center justify-center transition-all duration-300 group-hover:scale-105 mb-4`}>
                  <Icon className="h-5 w-5 stroke-[1.8]" />
                </div>
                
                <div>
                  <h3 
                    className="font-display text-sm font-bold group-hover:text-blue-400 transition-colors"
                    style={{ color: 'var(--text-main)' }}
                  >
                    {tech.name}
                  </h3>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider leading-normal line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                    {tech.desc}
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
