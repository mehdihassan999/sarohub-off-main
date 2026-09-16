import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQProps {
  faqs: any[];
}

export default function FAQAccordion({ faqs }: FAQProps) {
  // Initialize open indices with all items by default so content is not hidden
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]));

  const toggleIndex = (idx: number) => {
    setOpenIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const allOpen = faqs.length > 0 && openIndices.size === faqs.length;

  const toggleAll = () => {
    if (allOpen) {
      setOpenIndices(new Set());
    } else {
      setOpenIndices(new Set(faqs.map((_, idx) => idx)));
    }
  };

  return (
    <section 
      id="faqs" 
      className="py-24 relative border-t border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
              Knowledge Hub
            </span>
            <h2 
              className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-3"
              style={{ color: 'var(--text-main)' }}
            >
              Frequently Asked Questions
            </h2>
            <p 
              className="mt-2 text-sm font-medium leading-relaxed max-w-xl"
              style={{ color: 'var(--text-body)' }}
            >
              Find immediate answers regarding SaroHub relational database structures, custom SaaS deployment, SLAs, and data security.
            </p>
          </div>

          {faqs.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 border border-slate-700/80 text-blue-400 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <span>{allOpen ? 'Collapse All' : 'Expand All'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800/60 text-blue-300">
                {openIndices.size}/{faqs.length} Open
              </span>
            </button>
          )}
        </div>

        {faqs.length === 0 ? (
          <div 
            className="text-center py-16 rounded-2xl border font-medium text-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-app)',
              color: 'var(--text-muted)'
            }}
          >
            No corporate FAQs are registered on the platform.
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndices.has(idx);

              return (
                <div
                  key={faq.id || idx}
                  className="rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 premium-card-hover"
                  style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-app)' 
                  }}
                >
                  <button
                    onClick={() => toggleIndex(idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.01] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-400 shrink-0 stroke-[1.8]" />
                      <span 
                        className="font-display text-sm sm:text-base font-bold group-hover:text-blue-400 transition-colors"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div 
                          className="p-6 pt-0 border-t text-xs sm:text-sm font-medium leading-relaxed font-sans"
                          style={{ borderColor: 'var(--border-app)', color: 'var(--text-body)' }}
                        >
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
