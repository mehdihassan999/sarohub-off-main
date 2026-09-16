import React, { useState, useEffect } from 'react';
import { 
  Globe, Smartphone, Layers, Cpu, Code2, Server, Layout, HeartHandshake, 
  ArrowRight, ExternalLink, Sparkles, Building2, Users2, LineChart, Rocket, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../api';
import { Partner } from '../../types';
import PartnerCard from '../partners/PartnerCard';

export default function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartnerImage, setSelectedPartnerImage] = useState<{ url: string; partnerName: string } | null>(null);

  useEffect(() => {
    api.getPartners()
      .then((data) => {
        setPartners(data || []);
      })
      .catch((err) => {
        console.error('Failed to load dynamic partners:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const partnerServices = [
    { name: 'Web Development', icon: Globe },
    { name: 'Mobile Development', icon: Smartphone },
    { name: 'SaaS Development', icon: Layers },
    { name: 'AI Integration', icon: Cpu },
    { name: 'Custom Software', icon: Code2 },
    { name: 'Backend & API Dev', icon: Server },
    { name: 'UI Implementation', icon: Layout },
    { name: 'Maintenance & Support', icon: HeartHandshake },
  ];

  const marqueeList = [...partnerServices, ...partnerServices];

  const categories = ['all', ...Array.from(new Set(partners.map(p => p.category)))];

  const filteredPartners = activeCategory === 'all' 
    ? partners 
    : partners.filter(p => p.category === activeCategory);

  const handlePartnerClick = () => {
    const contactSection = document.getElementById('contact-preview');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const msgInput = document.getElementById('contact-message') as HTMLTextAreaElement;
      if (msgInput) {
        msgInput.value = `Hello SaroHub Team, I am interested in exploring a partnership...`;
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Investor': return 'from-amber-400 to-orange-500 text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Agency': return 'from-cyan-400 to-blue-500 text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Partner': return 'from-emerald-400 to-teal-500 text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'from-indigo-400 to-purple-500 text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  return (
    <section 
      id="partnerships" 
      className="py-24 relative border-t border-b overflow-hidden bg-slate-950"
      style={{ borderColor: 'var(--border-app)' }}
    >
      {/* Premium ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay -z-10"></div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/80 border border-slate-800 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] backdrop-blur-md mb-6"
          >
            <Sparkles className="h-4 w-4" />
            Partnerships &amp; Collaboration
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white mb-6"
          >
            Partner With <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">SaroHub.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base font-medium leading-relaxed text-slate-400 max-w-2xl mx-auto"
          >
            We collaborate with government sectors, public institutions, agencies, enterprises, and tech founders to deliver resilient digital infrastructure, mission-critical software, and scalable ventures.
          </motion.p>
        </div>

        {/* Dynamic Corporate Partners Grid */}
        <div className="mb-20">
          
          {/* Filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                      : 'bg-slate-900/50 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700 backdrop-blur-sm'
                  }`}
                >
                  {cat === 'all' ? 'All Collaborations' : cat}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
            </div>
          ) : filteredPartners.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredPartners.map((p) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={p.id}
                    className="h-full"
                  >
                    <PartnerCard
                      partner={p}
                      onSelectImage={(url, name) => setSelectedPartnerImage({ url, partnerName: name })}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800/50 backdrop-blur-md">
              <Users2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-300">Partnership Network Growing</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                We are currently updating our partner and government collaboration profiles. Check back soon for the latest deployments.
              </p>
            </div>
          )}
        </div>

        {/* 3 Step Partnership Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
          
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent -z-0" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md text-center relative overflow-hidden group hover:bg-slate-900/80 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto mb-6 shadow-inner relative group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all">
                <LineChart className="h-7 w-7" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center justify-center font-mono shadow-md">1</div>
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-3">
                Share Your Vision
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tell us about your product idea, client project, or business challenge so we can align on goals.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md text-center relative overflow-hidden group hover:bg-slate-900/80 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 mx-auto mb-6 shadow-inner relative group-hover:border-blue-500/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all">
                <Code2 className="h-7 w-7" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center font-mono shadow-md">2</div>
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-3">
                We Build the Technology
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our team handles architecture, UI/UX design, development, quality testing, and deployment.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-md text-center relative overflow-hidden group hover:bg-slate-900/80 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 mx-auto mb-6 shadow-inner relative group-hover:border-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all">
                <Rocket className="h-7 w-7" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-black flex items-center justify-center font-mono shadow-md">3</div>
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-3">
                Deliver &amp; Grow
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Launch reliable software that solves real problems, satisfies users, and scales with your business.
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-16 relative z-10">
          <button
            onClick={handlePartnerClick}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-xs tracking-[0.2em] uppercase transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Become a Partner
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
          </button>
        </div>
      </div>

      {/* Marquee of Partnership Services */}
      <div className="relative w-full flex overflow-x-hidden border-t border-b py-5 border-slate-900 bg-slate-950/80 backdrop-blur-xl">
        {/* Soft edge masking gradients */}
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-8 animate-marquee whitespace-nowrap min-w-full">
          {marqueeList.map((service, idx) => {
            const Icon = service.icon;

            return (
              <div
                key={idx}
                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-bold font-mono uppercase tracking-wider text-slate-300 select-none shadow-sm"
              >
                <div className="flex h-6 w-6 rounded-full bg-cyan-500/10 items-center justify-center text-cyan-400">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span>{service.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Resolution Partner Showcase Lightbox Modal */}
      <AnimatePresence>
        {selectedPartnerImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPartnerImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-2 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  {selectedPartnerImage.partnerName} — Showcase Asset
                </span>
                <button
                  onClick={() => setSelectedPartnerImage(null)}
                  className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 flex items-center justify-center overflow-hidden max-h-[75vh]">
                <img
                  src={selectedPartnerImage.url}
                  alt={selectedPartnerImage.partnerName}
                  className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-md"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
