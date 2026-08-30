import React from 'react';
import { ShoppingCart, Check, Globe, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface SaleProjectsProps {
  saleProjects: any[];
}

export default function ProjectsForSale({ saleProjects }: SaleProjectsProps) {
  const handleInquiry = (title: string) => {
    // Scroll to contact and populate name/subject if possible
    const contactSection = document.getElementById('contact-preview');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const subjectInput = document.getElementById('contact-subject') as HTMLInputElement;
      if (subjectInput) {
        subjectInput.value = `Inquiry regarding acquisition of "${title}"`;
      }
    }
  };

  return (
    <section 
      id="sale-projects" 
      className="py-24 relative overflow-hidden border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/8 border border-emerald-500/20 text-emerald-400">
            Commercial Software Assets
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
            style={{ color: 'var(--text-main)' }}
          >
            Pre-Built Systems for Purchase
          </h2>
          <p 
            className="mt-4 text-sm font-medium leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            Acquire fully-tested, source-code-complete enterprise software templates to bootstrap your product delivery instantly.
          </p>
        </div>

        {saleProjects.length === 0 ? (
          <div 
            className="text-center py-16 rounded-2xl border font-medium text-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-app)',
              color: 'var(--text-muted)'
            }}
          >
            No software templates are listed for acquisition at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saleProjects.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                whileHover={{ y: -3 }}
                className="rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between group premium-card-hover"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-app)' 
                }}
              >
                <div>
                  {/* Thumbnail */}
                  <div className="h-48 overflow-hidden relative bg-white/[0.02] border-b" style={{ borderColor: 'var(--border-app)' }}>
                    <img
                      src={item.thumbnail_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600&h=400'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Price tag */}
                    <div 
                      className="absolute top-4 right-4 rounded-xl border px-3.5 py-1.5 shadow-md flex items-center gap-1 bg-black/75 backdrop-blur"
                      style={{ borderColor: 'var(--border-app)' }}
                    >
                      <span className="text-[10px] font-mono font-bold text-slate-400">USD</span>
                      <span className="text-sm font-black text-emerald-400">
                        ${item.price || 'Contact'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 
                        className="font-display text-base sm:text-lg font-bold group-hover:text-blue-400 transition-colors"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {item.title}
                      </h3>
                      <p 
                        className="mt-2 text-xs sm:text-sm font-medium leading-relaxed line-clamp-3"
                        style={{ color: 'var(--text-body)' }}
                      >
                        {item.short_description}
                      </p>
                    </div>

                    {/* Features checklist */}
                    {Array.isArray(item.features) && (
                      <ul className="space-y-1.5">
                        {item.features.slice(0, 3).map((feat: string, i: number) => (
                          <li key={i} className="flex gap-2 items-start text-xs font-medium" style={{ color: 'var(--text-body)' }}>
                            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Foot Action Buttons */}
                <div className="p-6 pt-0">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {Array.isArray(item.technology) ? item.technology.map((tech: string, i: number) => (
                      <span 
                        key={i} 
                        className="text-[9px] font-bold rounded px-2.5 py-1 uppercase tracking-wider border"
                        style={{ 
                          backgroundColor: 'var(--bg-app)', 
                          borderColor: 'var(--border-app)',
                          color: 'var(--text-body)'
                        }}
                      >
                        {tech}
                      </span>
                    )) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-app)' }}>
                    {item.demo_url ? (
                      <a
                        href={item.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        style={{ 
                          backgroundColor: 'var(--bg-app)', 
                          borderColor: 'var(--border-app)',
                          color: 'var(--text-body)'
                        }}
                      >
                        <Globe className="h-4 w-4 stroke-[1.8]" />
                        Live Demo
                      </a>
                    ) : (
                      <div />
                    )}
                    <button
                      onClick={() => handleInquiry(item.title)}
                      className="px-3 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 stroke-[1.8]" />
                      Inquire now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
