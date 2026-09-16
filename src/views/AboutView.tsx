import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api } from '../api';
import SEOHead from '../components/seo/SEOHead';
import CompanyOverview from '../components/home/CompanyOverview';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CompanyStatistics from '../components/home/CompanyStatistics';
import CEOMessage from '../components/home/CEOMessage';
import LeadershipTeam from '../components/home/LeadershipTeam';
import ClientTestimonials from '../components/home/ClientTestimonials';
import FAQAccordion from '../components/home/FAQAccordion';

export default function AboutView() {
  const [stats, setStats] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [aboutSettings, setAboutSettings] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
    api.getTeam().then(setTeam).catch(console.error);
    api.getTestimonials().then(setTestimonials).catch(console.error);
    api.getFAQs().then(setFaqs).catch(console.error);
    api.getSettings().then(setAboutSettings).catch(console.error);
  }, []);

  return (
    <div className="relative">
      <SEOHead
        title="About Us | SaroHub Technologies"
        description="Learn about SaroHub Technologies: our mission, executive leadership, technological philosophy, and journey building global digital solutions."
        keywords="about SaroHub, SaroHub leadership, technology company Skardu, IT firm Gilgit Baltistan"
        canonicalUrl="https://sarohub.com/about"
      />
      <div className="py-16 border-b text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4"
          >
            Corporate Overview
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight"
          >
            About SaroHub Technologies
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Building modern software solutions, scalable cloud systems, and AI-powered digital products globally.
          </motion.p>
        </div>
      </div>
      <CompanyOverview settings={aboutSettings} />
      <WhyChooseUs settings={aboutSettings} />
      <CompanyStatistics apiStats={stats} />
      <CEOMessage settings={aboutSettings} />
      <LeadershipTeam team={team} />
      
      {/* Testimonials with Framer Motion Staggered Entrance Animation */}
      <ClientTestimonials testimonials={testimonials} />
      
      <FAQAccordion faqs={faqs} />
    </div>
  );
}
