import React, { useState } from 'react';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, Cpu, Smartphone, 
  Globe, Bot, RefreshCw, Send, CheckCircle2, ShieldCheck, Download
} from 'lucide-react';
import { api } from '../../api';
import { SolutionMatch } from '../../types';

interface InteractiveSolutionMatcherProps {
  onBookConsultationWithDiagnostic?: (summary: string) => void;
  className?: string;
}

export const InteractiveSolutionMatcher: React.FC<InteractiveSolutionMatcherProps> = ({
  onBookConsultationWithDiagnostic,
  className = ''
}) => {
  const [step, setStep] = useState(1);

  // Selections
  const [projectType, setProjectType] = useState('Enterprise SaaS Platform');
  const [stage, setStage] = useState('Product Specification / Idea');
  const [timeline, setTimeline] = useState('4 - 8 Weeks (Rapid MVP)');
  const [budget, setBudget] = useState('$10,000 - $25,000');

  // Contact for saving
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [company, setCompany] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedMatch, setSavedMatch] = useState<SolutionMatch | null>(null);

  // Recommendations logic based on choices
  const getRecommendations = () => {
    let stack = ['React / Next.js', 'TypeScript', 'Node.js Express', 'PostgreSQL / Prisma', 'Tailwind CSS', 'Docker Cloud Run'];
    let model = 'Fixed-Scope MVP Sprint';
    let weeks = '6 - 8 Weeks';

    if (projectType.includes('Mobile')) {
      stack = ['React Native (Expo)', 'TypeScript', 'Node.js Backend', 'PostgreSQL', 'Redis Cache', 'AWS S3'];
      weeks = '8 - 10 Weeks';
    } else if (projectType.includes('AI')) {
      stack = ['Next.js App Router', 'Python FastAPI / Node.js', 'Gemini 2.5 Flash / OpenAI', 'Pinecone / pgvector', 'PostgreSQL', 'Cloud Run'];
      model = 'Dedicated Engineering Pod';
      weeks = '5 - 7 Weeks';
    } else if (stage.includes('Scale') || stage.includes('Legacy')) {
      model = 'Enterprise Retainer & Modernization';
      weeks = 'Continuous 2-Week Sprints';
    } else if (budget.includes('Equity') || stage.includes('Venture')) {
      model = 'Venture Co-Founding & Sweat Equity';
      weeks = 'Strategic 12-Month Alignment';
    }

    return { stack, model, weeks };
  };

  const currentRecs = getRecommendations();

  const handleSaveAndSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;

    setSaving(true);
    try {
      const res = await api.submitSolutionMatch({
        contact_name: contactName,
        email: contactEmail,
        company: company,
        project_type: projectType,
        stage: stage,
        timeline: timeline,
        budget: budget,
        recommended_stack: currentRecs.stack,
        recommended_model: currentRecs.model,
        estimated_weeks: currentRecs.weeks
      });

      if (res.success && res.solutionMatch) {
        setSavedMatch(res.solutionMatch);
      }
    } catch (err) {
      console.error('Failed to submit solution match:', err);
    } finally {
      setSaving(false);
    }
  };

  const projectTypeOptions = [
    { label: 'Enterprise SaaS Platform', icon: <Globe className="w-5 h-5 text-blue-500" />, desc: 'B2B subscription, multi-tenant database & client portal' },
    { label: 'Native / Hybrid Mobile App', icon: <Smartphone className="w-5 h-5 text-indigo-500" />, desc: 'iOS & Android app with real-time push and cloud APIs' },
    { label: 'AI Agent & Workflow Automation', icon: <Bot className="w-5 h-5 text-purple-500" />, desc: 'LLM fine-tuning, RAG vector pipeline & autonomous bots' },
    { label: 'Venture MVP / Startup Prototype', icon: <Sparkles className="w-5 h-5 text-amber-500" />, desc: 'De-risked prototype built to close seed investment' },
    { label: 'Legacy Modernization & Cloud Refactor', icon: <RefreshCw className="w-5 h-5 text-emerald-500" />, desc: 'Slashing query latency, zero-downtime microservices' }
  ];

  const stageOptions = [
    { label: 'Idea & Specification', desc: 'Concept stage, wireframes or functional brief' },
    { label: 'Figma Prototype Ready', desc: 'UI designs ready, need robust engineering execution' },
    { label: 'Live MVP in Production', desc: 'Active customers, need senior speed to scale features' },
    { label: 'Legacy Tech Overhaul', desc: 'Existing system has technical debt or scalability limits' }
  ];

  const timelineOptions = [
    { label: 'Immediate Sprint (< 4 Weeks)', desc: 'Fastest turnaround for critical launch date' },
    { label: '4 - 8 Weeks (Rapid MVP)', desc: 'Standard comprehensive agile production sprint' },
    { label: '2 - 4 Months (Complex Architecture)', desc: 'Multi-module platform with custom microservices' },
    { label: 'Ongoing Engineering Pod', desc: 'Dedicated team scaling product continuously' }
  ];

  const budgetOptions = [
    { label: '$5,000 - $10,000', desc: 'Early MVP prototype or isolated core module' },
    { label: '$10,000 - $25,000', desc: 'Production-ready commercial SaaS / Mobile app' },
    { label: '$25,000 - $60,000+', desc: 'High-scale enterprise platform with advanced microservices' },
    { label: 'Venture Sweat Equity / Subsidized Cash', desc: 'Co-founding partnership with equity alignment' }
  ];

  return (
    <div id="solution-matcher" className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden ${className}`}>
      
      {/* Top Wizard Indicator */}
      <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Interactive Solution Diagnostic & Architecture Matcher
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                step === i 
                  ? 'w-6 bg-blue-600 dark:bg-blue-400' 
                  : step > i 
                    ? 'w-3 bg-emerald-500' 
                    : 'w-3 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-10">

        {/* STEP 1: WHAT ARE YOU BUILDING? */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Step 1 of 4</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                What type of product or solution are you building?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select your primary system archetype so we can calibrate the optimal cloud stack.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {projectTypeOptions.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => setProjectType(opt.label)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    projectType === opt.label
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs mt-0.5">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all active:scale-98"
              >
                Next: Project Maturity
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROJECT STAGE */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Step 2 of 4</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                What is your project's current developmental stage?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Helps us determine the discovery, UX design, and architecture needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {stageOptions.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => setStage(opt.label)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    stage === opt.label
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all active:scale-98"
              >
                Next: Target Timeline
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TIMELINE & BUDGET */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Step 3 of 4</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Target Timeline & Estimated Capital Allocation
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                We calibrate team sprint velocity and engagement structure around your constraints.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-2">
                Desired Launch Speed:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timelineOptions.map((opt) => (
                  <div
                    key={opt.label}
                    onClick={() => setTimeline(opt.label)}
                    className={`p-3.5 rounded-xl border cursor-pointer text-xs ${
                      timeline === opt.label
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{opt.label}</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-2">
                Budget / Capital Framework:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {budgetOptions.map((opt) => (
                  <div
                    key={opt.label}
                    onClick={() => setBudget(opt.label)}
                    className={`p-3.5 rounded-xl border cursor-pointer text-xs ${
                      budget === opt.label
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{opt.label}</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all active:scale-98"
              >
                Calculate Diagnostic Blueprint
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DIAGNOSTIC RESULTS & BLUEPRINT */}
        {step === 4 && (
          <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Diagnostic Architecture Calculated
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  Your Recommended Solution Blueprint
                </h3>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline self-start"
              >
                Reconfigure Parameters
              </button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              
              {/* Box 1: Recommended Model */}
              <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Recommended Model
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {currentRecs.model}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Best aligned with your {stage} stage and budget parameters.
                </div>
              </div>

              {/* Box 2: Sprint Velocity */}
              <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Estimated Sprint Velocity
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {currentRecs.weeks}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Includes discovery, click-through UX Figma prototyping, and QA staging audits.
                </div>
              </div>

              {/* Box 3: IP & Confidentiality */}
              <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Covenant & IP Rights
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  100% Client Owned
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Bilateral NDA signed prior to kick-off. Code committed directly to your repository.
                </div>
              </div>

            </div>

            {/* Recommended Tech Stack Badges */}
            <div className="mb-8 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                Recommended Enterprise Architecture Stack:
              </div>
              <div className="flex flex-wrap gap-2">
                {currentRecs.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Form to save/email this blueprint */}
            {!savedMatch ? (
              <form onSubmit={handleSaveAndSend} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-md">
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Save & Email This Architecture Diagnostic
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Enter your email to receive a formal copy of this stack recommendation along with our standard Bilateral NDA.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name *"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email Address *"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Company / Venture Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    Strict confidentiality guaranteed. No sales spam.
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                    >
                      {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      {saving ? 'Saving...' : 'Send Blueprint to My Email'}
                    </button>
                    {onBookConsultationWithDiagnostic && (
                      <button
                        type="button"
                        onClick={() => {
                          const summary = `Diagnostic Match: ${projectType} (${stage}) -> Recommended ${currentRecs.model}, Stack: ${currentRecs.stack.join(', ')}`;
                          onBookConsultationWithDiagnostic(summary);
                        }}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-semibold shadow-xs"
                      >
                        Book Discovery Call
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-6 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Blueprint Saved & Dispatched Successfully!
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-4">
                  We've registered your architecture requirements. Our technical lead will follow up with an actionable roadmap within 24 hours.
                </p>
                {onBookConsultationWithDiagnostic && (
                  <button
                    onClick={() => onBookConsultationWithDiagnostic(`Diagnostic ID #${savedMatch.id}: ${projectType}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    Lock in 30-Min Discovery Slot Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
