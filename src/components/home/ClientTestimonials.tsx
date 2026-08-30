import React from 'react';
import TestimonialCarousel from '../TestimonialCarousel';

interface TestimonialsProps {
  testimonials: any[];
}

export default function ClientTestimonials({ testimonials }: TestimonialsProps) {
  return (
    <section 
      id="testimonials" 
      className="py-24 relative border-t border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
            Trusted Partners
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
            style={{ color: 'var(--text-main)' }}
          >
            Trusted by Global Enterprises
          </h2>
          <p 
            className="mt-4 text-sm font-medium leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            Discover what industry operators and directors say about SaroHub relational portals and container safety.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div 
            className="text-center py-16 rounded-2xl border font-medium text-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-app)',
              color: 'var(--text-muted)'
            }}
          >
            No customer reviews registered with the database.
          </div>
        ) : (
          <TestimonialCarousel items={testimonials} />
        )}

      </div>
    </section>
  );
}
