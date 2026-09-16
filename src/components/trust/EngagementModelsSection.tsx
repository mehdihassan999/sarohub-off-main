import React, { useState, useEffect } from 'react';
import { 
  Briefcase, CheckCircle2, Zap, Users, Rocket, Shield, 
  ArrowRight, Clock, DollarSign, Award, Layers, HelpCircle
} from 'lucide-react';
import { api } from '../../api';
import { EngagementModel } from '../../types';

interface EngagementModelsSectionProps {
  onSelectModel?: (model: EngagementModel) => void;
  onOpenConsultation?: (modelTitle?: string) => void;
  className?: string;
}

export const EngagementModelsSection: React.FC<EngagementModelsSectionProps> = ({
  onSelectModel,
  onOpenConsultation,
  className = ''
}) => {
  const [models, setModels] = useState<EngagementModel[]>([]);
  const [activeModelId, setActiveModelId] = useState<number | null>(null);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
    const handleUpdate = () => fetchModels();
    window.addEventListener('sarohub-data-updated', handleUpdate);
    return () => window.removeEventListener('sarohub-data-updated', handleUpdate);
  }, []);

  const fetchModels = async () => {
    try {
      const data = await api.getEngagementModels();
      if (data && data.length > 0) {
        setModels(data);
        const featured = data.find(m => m.is_featured) || data[0];
        setActiveModelId(featured.id);
      }
    } catch (err) {
      console.error('Failed to load engagement models:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModelIcon = (slug: string) => {
    if (slug.includes('mvp')) return <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    if (slug.includes('pod')) return <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    if (slug.includes('equity') || slug.includes('venture')) return <Zap className="w-6 h-6 text-amber-500" />;
    return <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
  };

  return (
    <section id="engagement-models" className={`py-16 md:py-24 bg-slate-50 dark:bg-slate-950/70 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-4">
            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Transparent Engagement Models
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Structure That Fits Your Stage, Runway & Growth Ambition
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            No cookie-cutter packages. Whether you need a lightning-fast MVP sprint, a dedicated engineering pod integrated into your Git repo, or venture co-founding alignment, we deliver with 100% transparent terms.
          </p>
        </div>

        {/* 4 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {models.map((model) => {
            const isSelected = activeModelId === model.id;
            return (
              <div
                key={model.id}
                id={`engagement-card-${model.id}`}
                onClick={() => setActiveModelId(model.id)}
                className={`relative rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-xl ring-4 ring-blue-500/10'
                    : 'bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Badge if featured */}
                {model.badge && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase shadow-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    {model.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {getModelIcon(model.slug)}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {model.turnaround}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    {model.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[38px] mb-4">
                    {model.tagline}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pricing Model</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{model.pricing_type}</div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Key Inclusions:
                    </div>
                    {model.features.slice(0, 4).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{model.sla_guarantee}</span>
                  </div>

                  <button
                    id={`btn-select-model-${model.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectModel) onSelectModel(model);
                      if (onOpenConsultation) onOpenConsultation(`${model.title} Engagement`);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                    }`}
                  >
                    <span>{model.cta_label || 'Discuss This Model'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPARISON TOGGLE BUTTON */}
        <div className="text-center mb-8">
          <button
            id="btn-toggle-engagement-matrix"
            onClick={() => setShowComparisonTable(!showComparisonTable)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold shadow-xs transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            {showComparisonTable ? 'Hide Detailed Comparison Matrix' : 'View Detailed Side-by-Side Comparison Matrix'}
          </button>
        </div>

        {/* COMPARISON MATRIX TABLE */}
        {showComparisonTable && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4 sm:p-5">Delivery Dimension</th>
                  {models.map(m => (
                    <th key={m.id} className="p-4 sm:p-5 min-w-[200px]">{m.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                    Primary Objective
                  </td>
                  {models.map(m => (
                    <td key={m.id} className="p-4 sm:p-5">{m.best_for}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                    Turnaround / Ramp-up
                  </td>
                  {models.map(m => (
                    <td key={m.id} className="p-4 sm:p-5 font-semibold text-blue-600 dark:text-blue-400">{m.turnaround}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                    Pricing Structure
                  </td>
                  {models.map(m => (
                    <td key={m.id} className="p-4 sm:p-5">{m.pricing_type}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                    IP & Code Ownership
                  </td>
                  {models.map(m => (
                    <td key={m.id} className="p-4 sm:p-5 font-medium text-emerald-700 dark:text-emerald-400">{m.ip_ownership}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                    Dedicated Team Structure
                  </td>
                  {models.map(m => (
                    <td key={m.id} className="p-4 sm:p-5">{m.team_structure}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                    SLA & Guarantee
                  </td>
                  {models.map(m => (
                    <td key={m.id} className="p-4 sm:p-5">{m.sla_guarantee}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
};
