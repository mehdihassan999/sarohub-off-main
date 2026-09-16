import React, { useState } from 'react';
import { 
  ShieldCheck, Award, Lock, Users, Sparkles, Clock, 
  ArrowRight, CheckCircle2, FileText, Globe
} from 'lucide-react';
import { TrustAndAssuranceSection } from '../components/trust/TrustAndAssuranceSection';
import { EngagementModelsSection } from '../components/trust/EngagementModelsSection';
import { InteractiveSolutionMatcher } from '../components/trust/InteractiveSolutionMatcher';
import { LeadMagnetsSection } from '../components/trust/LeadMagnetsSection';
import { FeasibilityAuditModal } from '../components/trust/FeasibilityAuditModal';
import { SEOHead } from '../components/seo/SEOHead';

interface TrustAndAssuranceViewProps {
  onOpenConsultation?: (title?: string) => void;
}

export const TrustAndAssuranceView: React.FC<TrustAndAssuranceViewProps> = ({
  onOpenConsultation
}) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <SEOHead
        pageRoute="/trust"
        title="Enterprise Trust, 100% IP Guarantee & Delivery Models | SaroHub Technologies"
        description="Discover our rigorous confidentiality covenants, bilateral NDAs, 100% intellectual property ownership, verified review badges, and transparent engagement models."
        keywords="enterprise trust, software IP guarantee, bilateral NDA, fixed scope MVP sprint, dedicated engineering pod, technical feasibility audit, SaroHub"
        canonicalUrl="https://sarohub.com/trust"
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase mb-6 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Verified Enterprise Partner Standards
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Enterprise Trust, Zero Lock-In & Guaranteed IP Ownership
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              We eliminate the traditional risks of outsourced software development. Legally enforceable bilateral NDAs, continuous code handover, verified reviews, and guaranteed on-time sprints.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                id="btn-hero-audit-cta"
                onClick={() => setIsAuditModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-98"
              >
                <Clock className="w-4 h-4" />
                Request 48-Hour Architecture Audit
              </button>

              <a
                href="#engagement-models"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-semibold transition-all"
              >
                <span>Explore Engagement Models</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Micro Trust Stats Strip */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">100%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">IP Ownership Assigned</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">4.9 / 5.0</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Clutch & GoodFirms Rating</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">48 Hours</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Technical Feasibility Turnaround</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">Zero</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Vendor Lock-In Guarantee</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE TRUST, BADGES, NDA & ENDORSEMENTS SECTION */}
      <TrustAndAssuranceSection
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenConsultation={onOpenConsultation}
      />

      {/* ENGAGEMENT MODELS COMPARISON */}
      <EngagementModelsSection
        onOpenConsultation={onOpenConsultation}
      />

      {/* INTERACTIVE SOLUTION MATCHER */}
      <section className="py-16 md:py-20 bg-slate-50/50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Interactive Diagnostic Wizard
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Find Your Ideal Stack, Timeline & Model in 60 Seconds
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Answer 4 quick questions to generate an architectural recommendation, tech stack blueprint, and sprint timeline.
            </p>
          </div>

          <InteractiveSolutionMatcher
            onBookConsultationWithDiagnostic={(summary) => {
              if (onOpenConsultation) onOpenConsultation(summary);
            }}
          />
        </div>
      </section>

      {/* 48-HOUR AUDIT CALLOUT BANNER */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Complimentary 48-Hour Technical Audit
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Have a Complex Spec, Wireframe, or Stalling Codebase?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Submit your architecture, Git repo, or product specification. Our Principal Systems Architects will analyze database schemas, cloud infrastructure, security vulnerabilities, and sprint feasibility—completely free within 48 hours.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                id="btn-open-audit-banner"
                onClick={() => setIsAuditModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-white text-slate-950 hover:bg-blue-50 font-bold text-sm shadow-xl transition-all active:scale-98 flex items-center gap-2"
              >
                <span>Request Your Free 48-Hour Audit</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DOWNLOADABLE WHITE PAPERS & LEAD MAGNETS */}
      <LeadMagnetsSection />

      {/* AUDIT MODAL */}
      <FeasibilityAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

    </div>
  );
};
