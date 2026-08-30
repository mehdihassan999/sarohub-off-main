import React from 'react';
import { Sparkles, ArrowRight, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';

export default function CallToAction() {
  const handleScrollToContact = (topic: string) => {
    const contactSection = document.getElementById('contact-preview');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const msgInput = document.getElementById('contact-message') as HTMLTextAreaElement;
      if (msgInput) {
        msgInput.value = `I would like to discuss a potential partnership regarding ${topic}...`;
      }
    }
  };

  return (
    <section 
      id="cta" 
      className="py-24 relative overflow-hidden border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      {/* Light background glowing ambient details */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <motion.div
          className="p-10 sm:p-16 rounded-3xl text-center relative overflow-hidden group transition-all duration-300 border premium-card-hover"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-app)' 
          }}
        >
          {/* Top Decorative Floating Elements */}
          <div className="absolute -top-12 -left-12 h-24 w-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            {/* Promotional badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/8 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-blue-400" />
              <span>Turning Vision Into Ventures</span>
            </div>

            <h2 
              className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]"
              style={{ color: 'var(--text-main)' }}
            >
              Have an Idea Worth Building?
            </h2>
            <p className="text-sm sm:text-base font-medium leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-body)' }}>
              Whether you're building a new venture, scaling a business, or looking for a technology partner, let's build what comes next.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <a
                href="#contact-preview"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 group cursor-pointer"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <button
                onClick={() => handleScrollToContact('technology delivery & product development')}
                className="px-6 py-3.5 rounded-lg font-bold transition-all flex items-center gap-2 group cursor-pointer border hover:bg-white/[0.04]"
                style={{ 
                  backgroundColor: 'var(--bg-app)', 
                  borderColor: 'var(--border-app)',
                  color: 'var(--text-main)'
                }}
              >
                <HeartHandshake className="h-4 w-4 text-blue-400" />
                Partner With Us
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
