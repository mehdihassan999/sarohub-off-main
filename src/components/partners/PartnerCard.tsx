import React, { useState } from 'react';
import { 
  Landmark, Building2, Briefcase, Layers, Cpu, Globe, ExternalLink, 
  ShieldCheck, Handshake, GraduationCap, LineChart, HeartHandshake, 
  Network, Star, ArrowUpRight 
} from 'lucide-react';
import { Partner } from '../../types';

interface PartnerCardProps {
  partner: Partner;
  onSelectImage?: (url: string, partnerName: string) => void;
  className?: string;
}

export function getCategoryMeta(category: string) {
  const normalized = (category || '').toLowerCase().trim();

  if (normalized.includes('government') || normalized.includes('public sector') || normalized.includes('ministry')) {
    return {
      icon: Landmark,
      label: category || 'Government Sector',
      subLabel: 'Government & Public Sector Collaboration',
      badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      gradientBorder: 'hover:from-emerald-500/50 hover:to-teal-600/50',
      accentColor: 'text-emerald-400',
      glowBg: 'from-emerald-500/5 to-teal-600/5'
    };
  }

  if (normalized.includes('agency')) {
    return {
      icon: Layers,
      label: category || 'Agency Partner',
      subLabel: 'Strategic Agency Engineering Alliance',
      badgeStyle: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      gradientBorder: 'hover:from-cyan-500/50 hover:to-blue-600/50',
      accentColor: 'text-cyan-400',
      glowBg: 'from-cyan-500/5 to-blue-600/5'
    };
  }

  if (normalized.includes('tech') || normalized.includes('cloud') || normalized.includes('software')) {
    return {
      icon: Cpu,
      label: category || 'Technology Partner',
      subLabel: 'Cloud & Technology Infrastructure Alliance',
      badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      gradientBorder: 'hover:from-blue-500/50 hover:to-indigo-600/50',
      accentColor: 'text-blue-400',
      glowBg: 'from-blue-500/5 to-indigo-600/5'
    };
  }

  if (normalized.includes('investor') || normalized.includes('venture') || normalized.includes('capital')) {
    return {
      icon: LineChart,
      label: category || 'Investor & Venture',
      subLabel: 'Venture Capital & Acceleration Partner',
      badgeStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      gradientBorder: 'hover:from-amber-500/50 hover:to-orange-600/50',
      accentColor: 'text-amber-400',
      glowBg: 'from-amber-500/5 to-orange-600/5'
    };
  }

  if (normalized.includes('academic') || normalized.includes('education') || normalized.includes('university')) {
    return {
      icon: GraduationCap,
      label: category || 'Academic & Research',
      subLabel: 'Higher Education & Research Collaboration',
      badgeStyle: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      gradientBorder: 'hover:from-purple-500/50 hover:to-pink-600/50',
      accentColor: 'text-purple-400',
      glowBg: 'from-purple-500/5 to-pink-600/5'
    };
  }

  if (normalized.includes('ngo') || normalized.includes('non-profit') || normalized.includes('community')) {
    return {
      icon: HeartHandshake,
      label: category || 'NGO & Non-Profit',
      subLabel: 'Civic & Social Impact Initiative',
      badgeStyle: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      gradientBorder: 'hover:from-rose-500/50 hover:to-red-600/50',
      accentColor: 'text-rose-400',
      glowBg: 'from-rose-500/5 to-red-600/5'
    };
  }

  if (normalized.includes('ecosystem') || normalized.includes('incubation') || normalized.includes('hub')) {
    return {
      icon: Network,
      label: category || 'Ecosystem Partner',
      subLabel: 'Regional Innovation & Startup Hub',
      badgeStyle: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      gradientBorder: 'hover:from-teal-500/50 hover:to-cyan-600/50',
      accentColor: 'text-teal-400',
      glowBg: 'from-teal-500/5 to-cyan-600/5'
    };
  }

  return {
    icon: Handshake,
    label: category || 'Strategic Partner',
    subLabel: 'Verified Strategic Ecosystem Partner',
    badgeStyle: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    gradientBorder: 'hover:from-indigo-500/50 hover:to-purple-600/50',
    accentColor: 'text-indigo-400',
    glowBg: 'from-indigo-500/5 to-purple-600/5'
  };
}

export default function PartnerCard({ partner, onSelectImage, className = '' }: PartnerCardProps) {
  const [imageError, setImageError] = useState(false);
  const meta = getCategoryMeta(partner.category);
  const Icon = meta.icon;

  const showcaseImages = (partner.images || partner.gallery || [])
    .map((img: any) => typeof img === 'string' ? img : img?.url)
    .filter(Boolean);

  const websiteHref = partner.website_url 
    ? (partner.website_url.startsWith('http') ? partner.website_url : `https://${partner.website_url}`)
    : null;

  return (
    <div 
      className={`group relative p-[1px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950 ${meta.gradientBorder} transition-all duration-500 flex flex-col h-full shadow-lg ${className}`}
    >
      {/* Card Inner Container */}
      <div className="relative h-full bg-slate-950/90 backdrop-blur-xl p-6 sm:p-7 rounded-[23px] flex flex-col justify-between overflow-hidden">
        
        {/* Glow behind content */}
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

        <div className="relative z-10 space-y-4">
          
          {/* Header with Logo, Name and Category Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              
              {/* Circular Logo Container with glow and fallback */}
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-slate-900 border-2 border-slate-800/90 p-2 overflow-hidden flex items-center justify-center shadow-md shrink-0 group-hover:border-slate-700 group-hover:scale-105 transition-all duration-300 relative">
                {partner.logo_url && !imageError ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="h-full w-full object-contain rounded-xl filter group-hover:brightness-110 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="h-full w-full rounded-xl bg-slate-950 flex items-center justify-center">
                    <span className="text-sm font-black text-cyan-400 font-display">
                      {partner.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Title and subLabel */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 line-clamp-1">
                    {partner.name}
                  </h4>
                  {partner.featured && (
                    <span title="Featured Partner" className="shrink-0 text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5 line-clamp-1">
                  {meta.subLabel}
                </span>
              </div>
            </div>

            {/* Category Pill with Icon */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${meta.badgeStyle} shadow-sm shrink-0 whitespace-nowrap`}>
              <Icon className="h-3 w-3 shrink-0" />
              <span>{meta.label}</span>
            </span>
          </div>

          {/* Description */}
          {partner.description ? (
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-300 line-clamp-3 pt-1">
              {partner.description}
            </p>
          ) : (
            <p className="text-xs text-slate-500 italic pt-1">
              Active ecosystem collaborator advancing digital technologies and strategic development.
            </p>
          )}

          {/* Showcase Portfolio Photos (if any) */}
          {showcaseImages.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
                Collaboration Showcase ({showcaseImages.length})
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {showcaseImages.map((imgUrl: string, imgIdx: number) => (
                  <div
                    key={imgIdx}
                    onClick={() => onSelectImage?.(imgUrl, partner.name)}
                    className="h-14 w-20 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shrink-0 group/img relative hover:border-cyan-500/50 transition-all shadow-sm cursor-pointer"
                    title="Click to zoom showcase asset"
                  >
                    <img
                      src={imgUrl}
                      alt={`${partner.name} asset ${imgIdx + 1}`}
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {websiteHref ? (
            <a
              href={websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono font-bold uppercase tracking-wider text-[11px] transition-colors"
            >
              <span>Visit Portal</span>
              <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Collaboration</span>
            </div>
          )}

          <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400/80" />
            <span>Verified Entity</span>
          </span>
        </div>

      </div>
    </div>
  );
}
