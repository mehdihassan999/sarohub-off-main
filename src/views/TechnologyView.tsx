import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Server, Smartphone, Database, Cpu, Cloud, 
  CheckCircle2, ArrowRight, ShieldCheck, Layers 
} from 'lucide-react';
import { api } from '../api';
import { TechStackItem } from '../types';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';

const CATEGORY_ICONS: { [key: string]: any } = {
  Frontend: Code,
  Backend: Server,
  Mobile: Smartphone,
  Databases: Database,
  'AI / Automation': Cpu,
  'Cloud / DevOps': Cloud
};

const DEFAULT_CATEGORIES = [
  'Frontend',
  'Backend',
  'Mobile',
  'Databases',
  'AI / Automation',
  'Cloud / DevOps'
];

export default function TechnologyView() {
  const [techItems, setTechItems] = useState<TechStackItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTechStack()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTechItems(data.filter(t => t.active));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...DEFAULT_CATEGORIES];

  const filteredItems = selectedCategory === 'All'
    ? techItems
    : techItems.filter(t => t.category === selectedCategory);

  const groupedByCategory: { [cat: string]: TechStackItem[] } = {};
  filteredItems.forEach(item => {
    const cat = item.category || 'Other';
    if (!groupedByCategory[cat]) groupedByCategory[cat] = [];
    groupedByCategory[cat].push(item);
  });

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
      <SEOHead
        title="Technology Stack & Architecture | SaroHub Technologies"
        description="Our modern engineering stack spans React, Next.js, Node.js, Python, PostgreSQL, Flutter, Docker, AWS, and enterprise AI models."
      />

      {/* Hero Header */}
      <div 
        className="py-16 sm:py-24 border-b text-center relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border-app)' 
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-4">
            <Breadcrumbs items={[{ label: 'Technology', path: '/technology' }]} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6">
            Core Engineering Stack
          </div>

          <h1 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Built on Battle-Tested Technologies
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            We build with modern, scalable, and secure technologies chosen for real-world reliability, type safety, performance, and long-term maintainability.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Grid grouped by Category */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 space-y-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="h-40 rounded-2xl border animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}
              />
            ))}
          </div>
        ) : Object.keys(groupedByCategory).length > 0 ? (
          Object.entries(groupedByCategory).map(([category, items]) => {
            const Icon = CATEGORY_ICONS[category] || Code;

            return (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Icon className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {category}
                  </h2>
                  <span className="text-xs font-mono text-slate-500 ml-auto">
                    {items.length} {items.length === 1 ? 'framework' : 'frameworks'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {items.map((tech) => (
                    <div
                      key={tech.id}
                      className="p-6 rounded-2xl border transition-all duration-200 hover:border-blue-500/40 flex flex-col justify-between"
                      style={{ 
                        backgroundColor: 'var(--bg-card)', 
                        borderColor: 'var(--border-app)' 
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            {tech.category}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">
                          {tech.name}
                        </h3>
                        {tech.description && (
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {tech.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-400">
            No technologies found in this category.
          </div>
        )}
      </div>

      {/* Architectural Principles */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 border-t" style={{ borderColor: 'var(--border-app)' }}>
        <div className="rounded-3xl border p-8 sm:p-12 lg:p-16" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Engineering Standards
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2 mb-4">
              How We Choose and Maintain Our Stack
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We do not chase transient tech fads. Every library, database, and cloud framework in our stack is vetted against four core engineering principles:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Strict Type Safety',
                desc: 'TypeScript across front-end and back-end ensures fewer runtime bugs and seamless refactoring.'
              },
              {
                title: 'Relational Integrity',
                desc: 'PostgreSQL-first architecture provides ACID compliance and structured relational schemas.'
              },
              {
                title: 'Practical AI Grounding',
                desc: 'Targeted integration of Gemini and OpenAI models for real automation rather than gimmicks.'
              },
              {
                title: 'Low Operational Burn',
                desc: 'Dockerized microservices and edge CDNs maximize throughput while minimizing cloud costs.'
              }
            ].map((principle, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mb-3" />
                <h3 className="text-sm font-bold text-white mb-2">
                  {principle.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {principle.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contact"
              id="tech-cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/20 transition-all"
            >
              <span>Discuss Your Technical Requirements</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
