import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Award, Star, CheckCircle2, Lock, Shield, 
  Play, Volume2, ExternalLink, Download, FileText, Globe, Clock,
  ArrowRight, Check, X, Sparkles, Video, Copy, FileCode, Printer,
  Building, UserCheck, ShieldAlert
} from 'lucide-react';
import { api } from '../../api';
import { TrustBadge, ClientEndorsement, IpGuarantee } from '../../types';
import { getVideoEmbedInfo } from '../../utils/videoEmbed';
import { 
  downloadNdaFile, 
  getFullNdaAgreementText, 
  getFullNdaAgreementMarkdown, 
  NDA_CLAUSES, 
  SAROHUB_LEGAL_INFO 
} from '../../utils/ndaContract';

interface TrustAndAssuranceSectionProps {
  onOpenAuditModal?: () => void;
  onOpenConsultation?: (type?: string) => void;
  className?: string;
  showAllSections?: boolean;
}

export const TrustAndAssuranceSection: React.FC<TrustAndAssuranceSectionProps> = ({
  onOpenAuditModal,
  onOpenConsultation,
  className = '',
  showAllSections = true
}) => {
  const [badges, setBadges] = useState<TrustBadge[]>([]);
  const [endorsements, setEndorsements] = useState<ClientEndorsement[]>([]);
  const [ipGuarantee, setIpGuarantee] = useState<IpGuarantee | null>(null);
  const [loading, setLoading] = useState(true);

  // Video modal state
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  // Audio state
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // NDA preview modal
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [ndaModalTab, setNdaModalTab] = useState<'clauses' | 'fulltext'>('clauses');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>('confidentiality');
  const [copiedNda, setCopiedNda] = useState(false);
  const [ndaToast, setNdaToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNdaAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setNdaToast({ text, type });
    setTimeout(() => setNdaToast(null), 3500);
  };

  const handleDownloadNda = (format: 'pdf' | 'doc' | 'txt' | 'md' = 'pdf') => {
    const success = downloadNdaFile(format);
    if (success) {
      const formatLabels: Record<string, string> = {
        pdf: 'Official Legal PDF (.pdf)',
        doc: 'Microsoft Word Document (.doc)',
        txt: 'Plain Text (.txt)',
        md: 'Markdown Document (.md)'
      };
      showNdaAlert(`${formatLabels[format] || format} downloaded successfully.`);
    } else {
      showNdaAlert('Failed to generate file. Please copy the agreement text directly.', 'error');
    }
  };

  const handleCopyNda = async () => {
    try {
      const fullText = getFullNdaAgreementText();
      await navigator.clipboard.writeText(fullText);
      setCopiedNda(true);
      showNdaAlert('Full legal agreement copied to clipboard.');
      setTimeout(() => setCopiedNda(false), 2500);
    } catch {
      showNdaAlert('Please select and copy the agreement text manually.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
    const handleUpdate = () => fetchData();
    window.addEventListener('sarohub-data-updated', handleUpdate);
    return () => {
      window.removeEventListener('sarohub-data-updated', handleUpdate);
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      const [badgesRes, endorsementsRes, ipRes] = await Promise.all([
        api.getTrustBadges().catch(() => []),
        api.getClientEndorsements().catch(() => []),
        api.getIpGuarantee().catch(() => null)
      ]);
      setBadges(badgesRes || []);
      setEndorsements(endorsementsRes || []);
      setIpGuarantee(ipRes);
    } catch (err) {
      console.error('Failed to load trust data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = (id: number, audioUrl: string) => {
    if (playingAudioId === id) {
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingAudioId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const newAudio = new Audio(audioUrl);
      newAudio.play().catch(e => console.log('Audio playback prevented:', e));
      newAudio.onended = () => setPlayingAudioId(null);
      setAudioElement(newAudio);
      setPlayingAudioId(id);
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-5 h-5 text-amber-500" />;
      case 'Star': return <Star className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case 'Lock': return <Lock className="w-5 h-5 text-indigo-500" />;
      default: return <Shield className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <section id="trust-and-assurance" className={`py-16 md:py-24 bg-white dark:bg-slate-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Enterprise Trust & Client Assurance
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built on Rigorous Confidentiality, 100% IP Ownership & Verified Results
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            We operate as an engineering partner you can bank on. Transparent governance, enforceable bilateral NDAs, zero vendor lock-in, and battle-tested global delivery standards.
          </p>
        </div>

        {/* 1. THIRD-PARTY VERIFIED REVIEW BADGES */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Verified Industry Ratings & Accreditation
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">Continuous Independent Audits</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {badges.filter(b => b.is_active).map((badge) => (
              <a
                key={badge.id}
                id={`trust-badge-${badge.id}`}
                href={badge.external_url || '#'}
                target={badge.external_url.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-1.5 rounded-lg bg-white dark:bg-slate-700/80 shadow-xs border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform">
                      {getBadgeIcon(badge.badge_icon)}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{badge.platform}</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                    {badge.badge_title}
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400">{badge.rating_score}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{badge.review_count}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 2. NDA & 100% IP PROTECTION GUARANTEE HERO BANNER */}
        <div id="ip-protection-banner" className="mb-16 relative overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
                <Lock className="w-3.5 h-3.5 text-blue-300" />
                Legal Covenants & Code Escrow
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {ipGuarantee?.guarantee_headline || '100% Intellectual Property Ownership & Strict NDA Commitment'}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {ipGuarantee?.guarantee_subheading || 'Your proprietary concepts, business logic, algorithms, and source code belong exclusively to you. Guaranteed in writing from Day 1.'}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium">Bilateral NDA executed before architecture review</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium">100% Code & IP assigned directly to your repos</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium">Zero vendor lock-in or proprietary runtime taxes</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2.5 justify-center">
              <button
                id="btn-preview-nda"
                type="button"
                onClick={() => {
                  setShowNdaModal(true);
                  setNdaModalTab('clauses');
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-cyan-50 hover:text-blue-700 font-semibold text-sm transition-all shadow-md active:scale-98 cursor-pointer group"
              >
                <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>Preview Bilateral NDA</span>
              </button>

              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  id="btn-download-nda-pdf"
                  type="button"
                  onClick={() => handleDownloadNda('pdf')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-blue-900/30 active:scale-98 cursor-pointer group"
                  title="Download verified official legal PDF (.pdf)"
                >
                  <Download className="w-3.5 h-3.5 text-white group-hover:translate-y-0.5 transition-transform" />
                  <span>PDF (.pdf)</span>
                </button>

                <button
                  id="btn-download-nda-word"
                  type="button"
                  onClick={() => handleDownloadNda('doc')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 hover:text-white font-medium text-xs sm:text-sm transition-all active:scale-98 cursor-pointer group"
                  title="Download editable Microsoft Word document (.doc)"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>Word (.doc)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. VERIFIED CLIENT ENDORSEMENTS (VIDEO, AUDIO & OUTCOMES) */}
        {showAllSections && (
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                  Verifiable Track Record
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Client Endorsements & Real-World Outcomes
                </h3>
              </div>
              {onOpenConsultation && (
                <button
                  id="btn-talk-to-team-endorsements"
                  onClick={() => onOpenConsultation('Executive Reference & Architecture Review')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Speak with an Executive Reference
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {endorsements.map((item) => (
                <div
                  key={item.id}
                  id={`client-endorsement-${item.id}`}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Rating Stars & Media Pill */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      {(item.media_type === 'video' || item.video_url) && item.video_url && (
                        <button
                          onClick={() => setActiveVideoUrl(item.video_url || null)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                            getVideoEmbedInfo(item.video_url).provider === 'loom'
                              ? 'bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
                              : 'bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-100'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{getVideoEmbedInfo(item.video_url).provider === 'loom' ? 'Watch on Loom' : 'Watch Video'}</span>
                        </button>
                      )}
                      {item.media_type === 'audio' && item.audio_url && (
                        <button
                          onClick={() => toggleAudio(item.id, item.audio_url!)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-colors ${
                            playingAudioId === item.id 
                              ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                              : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-100'
                          }`}
                        >
                          <Volume2 className="w-3 h-3" />
                          {playingAudioId === item.id ? 'Playing Snippet' : 'Listen Audio'}
                        </button>
                      )}
                    </div>

                    {/* Outcome Highlight Metric */}
                    {item.outcome_metric && (
                      <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{item.outcome_metric}</span>
                      </div>
                    )}

                    {/* Project Context */}
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {item.project_title}
                    </div>

                    {/* Quote Body */}
                    <blockquote className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic mb-6">
                      "{item.quote}"
                    </blockquote>
                  </div>

                  {/* Author Details */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
                    <img
                      src={item.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"}
                      alt={item.client_name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.client_name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.client_title} • <span className="font-semibold text-slate-700 dark:text-slate-300">{item.company_name}</span>
                      </div>
                      {item.country && (
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {item.country}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. GLOBAL DELIVERY & COLLABORATION MATRIX */}
        {showAllSections && (
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                  <Globe className="w-4 h-4" />
                  Global Delivery Standards
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Collaborate in Real-Time Across Timezones
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Headquartered in Pakistan with distributed pods designed for zero lag. We guarantee active 4-6 hour working overlaps with North America (EST/CST/PST), Europe (GMT/CET), and the Gulf (GST).
                </p>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">US & Americas</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Dedicated night/morning pods overlapping with New York, Austin & San Francisco hours.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">UK & Europe</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Direct daytime alignment with London, Berlin & Paris. Same-day sprint reviews and standups.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Gulf & APAC</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Full 8-hour workday overlap with Dubai, Riyadh, Singapore & Sydney teams.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* VIDEO PLAYER MODAL */}
      {activeVideoUrl && (() => {
        const videoInfo = getVideoEmbedInfo(activeVideoUrl);
        const embedSrc = videoInfo.embedUrl.includes('?') ? `${videoInfo.embedUrl}&autoplay=1` : `${videoInfo.embedUrl}?autoplay=1`;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
            <div className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              {/* Top Bar with Provider & Close */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-white text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span>Client Verified Endorsement Video</span>
                  {videoInfo.provider === 'youtube' && (
                    <span className="px-2 py-0.5 rounded bg-red-600/80 text-white text-[10px] font-bold uppercase">YouTube</span>
                  )}
                  {videoInfo.provider === 'loom' && (
                    <span className="px-2 py-0.5 rounded bg-purple-600/80 text-white text-[10px] font-bold uppercase">Loom</span>
                  )}
                  {videoInfo.provider === 'vimeo' && (
                    <span className="px-2 py-0.5 rounded bg-sky-600/80 text-white text-[10px] font-bold uppercase">Vimeo</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={activeVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs transition-colors"
                  >
                    <span>Open Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => setActiveVideoUrl(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Video Player Box */}
              <div className="aspect-video w-full bg-black">
                {videoInfo.isDirectVideo ? (
                  <video
                    src={activeVideoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={embedSrc}
                    title="Client Endorsement Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* BILATERAL NDA PREVIEW MODAL - SAROHUB CYBER-ENTERPRISE THEME */}
      {showNdaModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setShowNdaModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-slate-950 text-white border border-slate-800 rounded-3xl shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Accents */}
            <div className="absolute -top-32 -right-32 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="relative p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Legal Protection Covenant
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                    SECP Verified • v2026.1
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                  SaroHub Bilateral Non-Disclosure Agreement
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  100% Intellectual Property Assignment & Mutual Confidentiality Covenant
                </p>
              </div>

              <button
                onClick={() => setShowNdaModal(false)}
                aria-label="Close Bilateral NDA modal"
                className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Toast inside Modal */}
            {ndaToast && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{ndaToast.text}</span>
                </div>
                <button 
                  onClick={() => setNdaToast(null)}
                  className="text-cyan-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Tabs Control */}
            <div className="px-6 pt-4 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNdaModalTab('clauses')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    ndaModalTab === 'clauses'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Executive Covenants (5 Core Protections)
                </button>
                <button
                  type="button"
                  onClick={() => setNdaModalTab('fulltext')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    ndaModalTab === 'fulltext'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  Complete Legal Agreement
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Legal Standard
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {ndaModalTab === 'clauses' ? (
                <>
                  {/* High-level Assurance Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">IP Assignment</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-lg font-bold text-white">100% Client Owned</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Zero proprietary lock-in or developer royalties</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold">Continuous Escrow</span>
                        <Globe className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-lg font-bold text-white">Direct Git Delivery</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Commits pushed live to your GitHub / GitLab org</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold">Enforceability</span>
                        <Lock className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-lg font-bold text-white">3 Years Duration</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Governed under international arbitration rules</div>
                    </div>
                  </div>

                  {/* 5 Clauses List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Key Contractual Clauses & Protections:
                    </h4>

                    {NDA_CLAUSES.map((clause) => {
                      const isExpanded = expandedClauseId === clause.id;
                      return (
                        <div
                          key={clause.id}
                          className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all overflow-hidden"
                        >
                          <div 
                            className="p-4 cursor-pointer flex items-start justify-between gap-4"
                            onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                  {clause.clauseNumber}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                  {clause.badge}
                                </span>
                                <h5 className="text-sm font-bold text-white">
                                  {clause.title}
                                </h5>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {clause.summary}
                              </p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                                {clause.keyPoints.map((point, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>{point}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button
                              type="button"
                              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono shrink-0 py-1 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
                            >
                              {isExpanded ? 'Hide Legal Text' : 'View Legal Text'}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/70">
                              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
                                {clause.fullLegalText}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Signatory Seal */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <Building className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {SAROHUB_LEGAL_INFO.companyName}
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {SAROHUB_LEGAL_INFO.registration} • {SAROHUB_LEGAL_INFO.headquarters}
                        </div>
                        <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                          Authorized Signatory: {SAROHUB_LEGAL_INFO.representative} ({SAROHUB_LEGAL_INFO.title})
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">Direct Inquiries:</div>
                      <div className="text-xs font-bold text-slate-200">{SAROHUB_LEGAL_INFO.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{SAROHUB_LEGAL_INFO.phone}</div>
                    </div>
                  </div>
                </>
              ) : (
                /* Tab 2: Verbatim Legal Text */
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-400">
                      Verbatim plain-text contractual document (ready for corporate legal review)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyNda}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                      >
                        {copiedNda ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{copiedNda ? 'Copied' : 'Copy All Text'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner">
                    <pre className="p-4 sm:p-6 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text max-h-[52vh] overflow-y-auto">
                      {getFullNdaAgreementText()}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 self-start sm:self-center">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Standard bilateral execution prior to project kick-off.</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyNda}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  {copiedNda ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedNda ? 'Copied to Clipboard' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadNda('pdf')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-900/30 cursor-pointer active:scale-95"
                  title="Download verified official legal PDF agreement"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download PDF (.pdf)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadNda('doc')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
                  title="Download editable Microsoft Word document"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Word (.doc)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadNda('txt')}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Download plain text agreement (.txt)"
                >
                  <span>.txt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowNdaModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
