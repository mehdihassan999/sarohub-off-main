import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, Map, Paintbrush, Code2, ShieldAlert, Rocket, LifeBuoy, ArrowRight, Search, FileText, Grid, Code, Globe, TrendingUp, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../api';

const ICON_MAP: { [key: string]: any } = {
  PhoneCall, Map, Paintbrush, Code2, ShieldAlert, Rocket, LifeBuoy, Search, FileText, Grid, Code, Globe, TrendingUp, CheckCircle
};

export default function DevelopmentProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const [processSteps, setProcessSteps] = useState<any[]>([]);

  useEffect(() => {
    api.getProcessSteps()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProcessSteps(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        } else {
          setProcessSteps(defaultFallbackSteps);
        }
      })
      .catch(() => setProcessSteps(defaultFallbackSteps));
  }, []);

  const defaultFallbackSteps = [
    { id: 1, stepNumber: '01', title: 'Discover', icon: 'Search', shortDescription: 'In-depth scoping of goals, target audience, and technical requirements.' },
    { id: 2, stepNumber: '02', title: 'Strategy', icon: 'FileText', shortDescription: 'Mapping system architecture, technology stack, and milestone roadmaps.' },
    { id: 3, stepNumber: '03', title: 'Design', icon: 'Grid', shortDescription: 'Interactive UI/UX prototypes and high-fidelity component design systems.' },
    { id: 4, stepNumber: '04', title: 'Build', icon: 'Code', shortDescription: 'Full-stack engineering, clean codebase, and automated continuous integration.' },
    { id: 5, stepNumber: '05', title: 'Launch', icon: 'Globe', shortDescription: 'Zero-downtime production cloud deployment and live performance monitoring.' },
    { id: 6, stepNumber: '06', title: 'Scale', icon: 'TrendingUp', shortDescription: 'Continuous features expansion, security audits, and dedicated support.' }
  ];

  const stepsList = processSteps.length > 0 ? processSteps : defaultFallbackSteps;
  const currentStep = stepsList[activeStep] || stepsList[0];
  const StepIconComponent = ICON_MAP[currentStep?.icon] || Search;

  return (
    <section 
      id="dev-process" 
      className="py-24 relative border-t border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
            How We Work
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
            style={{ color: 'var(--text-main)' }}
          >
            From Idea to Market Scaled Product.
          </h2>
          <p 
            className="mt-4 text-sm font-medium leading-relaxed text-slate-400"
          >
            How SaroHub turns vision into software products and technology ventures, step by step.
          </p>
        </div>

        {/* Timeline Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Stepper column (Left side) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-mono text-[10px] uppercase tracking-wider font-extrabold mb-4 block text-slate-400">
              Click to Explore Lifecycle Phases:
            </h3>

            <div className="space-y-2">
              {stepsList.map((step, idx) => {
                const IconComp = ICON_MAP[step.icon] || Search;
                const isActive = idx === activeStep;

                return (
                  <button
                    key={step.id || idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-950/40 border-white/5 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-9 w-9 rounded-lg items-center justify-center transition-colors ${
                        isActive ? 'bg-blue-600 text-white font-bold' : 'bg-white/[0.04] text-slate-400 group-hover:text-slate-200'
                      }`}>
                        <IconComp className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase block leading-none font-bold text-slate-400">
                          {step.stepNumber ? `STAGE ${step.stepNumber}` : `STAGE 0${idx + 1}`}
                        </span>
                        <span 
                          className={`text-sm font-bold block mt-1 transition-colors ${isActive ? 'text-white' : 'text-slate-300'}`}
                        >
                          {step.title}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className={`h-4 w-4 transition-all ${
                      isActive ? 'text-blue-400 translate-x-1' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Details Card (Right side) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl border min-h-[380px] flex flex-col justify-between relative overflow-hidden shadow-xl bg-slate-900/90 border-white/10"
              >
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase tracking-wider font-mono">
                      STAGE {currentStep?.stepNumber || `0${activeStep + 1}`} &bull; ACTIVE LIFECYCLE
                    </span>
                    <div className="flex h-12 w-12 bg-blue-500/10 border border-blue-500/20 rounded-xl items-center justify-center text-blue-400">
                      <StepIconComponent className="h-6 w-6 stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xl sm:text-2xl font-display font-black text-white">
                      {currentStep?.title}
                    </h4>
                    <p className="text-sm font-medium leading-relaxed text-slate-300">
                      {currentStep?.detailedDescription || currentStep?.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold block text-slate-400">
                      Engineering Principles:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex gap-2 items-center text-xs font-medium text-slate-300">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>Business ROI Scoped</span>
                      </div>
                      <div className="flex gap-2 items-center text-xs font-medium text-slate-300">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>Strict Quality Assurance</span>
                      </div>
                      <div className="flex gap-2 items-center text-xs font-medium text-slate-300">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>Security & API Validation</span>
                      </div>
                      <div className="flex gap-2 items-center text-xs font-medium text-slate-300">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>Scalable Architecture</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-[10px] font-mono font-bold tracking-wider flex items-center justify-between uppercase text-slate-500 border-t border-white/5 pt-4">
                  <span>SAROHUB DEVELOPMENT LIFECYCLE</span>
                  <span>STAGE {activeStep + 1} OF {stepsList.length}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

