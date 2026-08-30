import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQProps {
  faqs: any[];
}

export default function FAQAccordion({ faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
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
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
            Knowledge Hub
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
            style={{ color: 'var(--text-main)' }}
          >
            Frequently Asked Questions
          </h2>
          <p 
            className="mt-4 text-sm font-medium leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            Find immediate answers regarding SaroHub relational database structures, custom SaaS deployment, SLAs, and data security.
          </p>
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
              const isOpen = openIndex === idx;

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
