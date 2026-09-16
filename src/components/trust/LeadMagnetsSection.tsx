import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, CheckCircle2, BookOpen, Sparkles, 
  ArrowRight, X, RefreshCw, Send, ShieldCheck, FileCheck
} from 'lucide-react';
import { api } from '../../api';
import { LeadMagnet } from '../../types';

interface LeadMagnetsSectionProps {
  className?: string;
}

export const LeadMagnetsSection: React.FC<LeadMagnetsSectionProps> = ({
  className = ''
}) => {
  const [magnets, setMagnets] = useState<LeadMagnet[]>([]);
  const [activeMagnet, setActiveMagnet] = useState<LeadMagnet | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    fetchMagnets();
    const handleUpdate = () => fetchMagnets();
    window.addEventListener('sarohub-data-updated', handleUpdate);
    return () => window.removeEventListener('sarohub-data-updated', handleUpdate);
  }, []);

  const fetchMagnets = async () => {
    try {
      const data = await api.getLeadMagnets();
      setMagnets(data || []);
    } catch (err) {
      console.error('Failed to load lead magnets:', err);
    }
  };

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMagnet || !email) return;

    setDownloading(true);
    try {
      const res = await api.trackLeadMagnetDownload(activeMagnet.id, {
        email,
        full_name: fullName,
        company
      });

      if (res.success) {
        setDownloadSuccess(true);
        // Refresh counter
        fetchMagnets();

        // Trigger automatic synthetic download of a formatted summary file
        const blobContent = `================================================================================
SAROHUB TECHNOLOGIES - EXECUTIVE PLAYBOOK & BLUEPRINT
Title: ${activeMagnet.title}
Category: ${activeMagnet.category}
Pages / Format: ${activeMagnet.pages}
================================================================================

OVERVIEW:
${activeMagnet.description}

CORE TECHNICAL TAKEAWAYS & ARCHITECTURE PRINCIPLES:
${activeMagnet.key_takeaways.map((t, idx) => `[0${idx + 1}] ${t}`).join('\n')}

SECURITY & COMPLIANCE STANDARD:
All code and architecture deliverables produced by SaroHub follow zero-trust principles,
OWASP Top-10 secure coding guidelines, containerized sandboxing, and 100% IP ownership
assigned to the client under bilateral NDA covenants.

NEED AN EXPERT ARCHITECTURE REVIEW?
Request our complimentary 48-Hour Technical Feasibility & Architecture Audit
Direct: info@sarohub.com | WhatsApp: +92 343 0381473 | Web: https://sarohub.com
================================================================================`;

        const blob = new Blob([blobContent], { type: 'text/plain;charset=utf-8' });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${activeMagnet.slug || 'sarohub-resource'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download gate error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="executive-resources" className={`py-16 md:py-24 bg-white dark:bg-slate-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide uppercase mb-4">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Executive Blueprints & Playbooks
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Battle-Tested Architecture Guides & Due Diligence Playbooks
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Free high-density technical whitepapers and actionable vendor checklists crafted by our senior systems architects to help founders and CTOs make de-risked engineering decisions.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {magnets.map((magnet) => (
            <div
              key={magnet.id}
              id={`lead-magnet-${magnet.id}`}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Visual Header */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={magnet.cover_image}
                    alt={magnet.title}
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {magnet.category}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold">{magnet.pages}</span>
                    <span className="text-slate-300 text-[11px]">{magnet.download_count} Downloads</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {magnet.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {magnet.description}
                  </p>

                  <div className="space-y-1.5 mb-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Key Takeaways Inside:
                    </div>
                    {magnet.key_takeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <button
                  id={`btn-download-magnet-${magnet.id}`}
                  onClick={() => {
                    setActiveMagnet(magnet);
                    setDownloadSuccess(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Instant Access & Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* DOWNLOAD LEAD-GATE MODAL */}
      {activeMagnet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button
              onClick={() => setActiveMagnet(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-7">
              {downloadSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Download Initiated!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                    Your playbook copy has been saved to your device and also logged for <strong>{email}</strong>.
                  </p>
                  <button
                    onClick={() => setActiveMagnet(null)}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDownloadSubmit}>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                    <FileText className="w-4 h-4" />
                    Instant Whitepaper Access
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    {activeMagnet.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                    Enter your work email address below to immediately download the complete technical guide and receive our periodic architecture teardowns.
                  </p>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Company / Venture
                        </label>
                        <input
                          type="text"
                          placeholder="Company Ltd"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      Zero spam. Strict privacy.
                    </div>
                    <button
                      type="submit"
                      disabled={downloading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md disabled:opacity-50"
                    >
                      {downloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      {downloading ? 'Authorizing...' : 'Download Blueprint (.txt)'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
