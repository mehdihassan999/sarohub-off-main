import React, { useEffect, useState, useRef } from 'react';
import { 
  Laptop, GraduationCap, Calendar, Settings, Globe, Users, Cpu, 
  Award, MapPin, Briefcase, Activity, Sparkles 
} from 'lucide-react';
import { api } from '../../api';

interface StatsProps {
  apiStats?: any;
}

const ICON_MAP: { [key: string]: any } = {
  Briefcase,
  Globe,
  Users,
  Cpu,
  Award,
  MapPin,
  Laptop,
  GraduationCap,
  Calendar,
  Settings,
  Activity,
  Sparkles
};

// Animated dynamic count-up component
function AnimatedNumber({ targetValue, duration = 1800 }: { targetValue: string; duration?: number }) {
  const [currentDisplay, setCurrentDisplay] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Parse numeric portion and prefix/suffix
  const match = targetValue.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  const prefix = match ? match[1] : '';
  const numericTarget = match ? parseFloat(match[2]) : null;
  const suffix = match ? match[3] : '';

  useEffect(() => {
    if (numericTarget === null || isNaN(numericTarget)) {
      setCurrentDisplay(targetValue);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Ease out cubic: 1 - pow(1 - progress, 3)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * numericTarget);

            setCurrentDisplay(`${prefix}${currentVal.toLocaleString()}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCurrentDisplay(targetValue);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [targetValue, numericTarget, prefix, suffix, duration, hasAnimated]);

  return (
    <span ref={elementRef} className="tabular-nums font-extrabold tracking-tight text-white">
      {hasAnimated ? currentDisplay : (numericTarget !== null ? `${prefix}0${suffix}` : targetValue)}
    </span>
  );
}

export default function CompanyStatistics({ apiStats }: StatsProps) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());

  const defaultFallbackMetrics = [
    { id: 1, number: '10+', label: 'Products & Ventures', description: 'Proprietary platforms & ventures built', icon: 'Award', order: 1, active: true },
    { id: 2, number: '560+', label: 'Platform Users', description: 'Active learners, administrators & businesses', icon: 'Users', order: 2, active: true },
    { id: 3, number: '64+', label: 'Tech Mentors & Staff', description: 'Engineers, instructors & core personnel', icon: 'GraduationCap', order: 3, active: true },
    { id: 4, number: '10+', label: 'Delivered Projects', description: 'Mission-critical systems delivered for partners', icon: 'Briefcase', order: 4, active: true }
  ];

  const fetchDynamicMetrics = async () => {
    try {
      const data = await api.getCompanyMetrics();
      if (Array.isArray(data) && data.length > 0) {
        const active = data.filter((m: any) => m.active !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setMetrics(active.length > 0 ? active : defaultFallbackMetrics);
      } else {
        setMetrics(defaultFallbackMetrics);
      }
      setLastSynced(new Date());
    } catch {
      setMetrics(defaultFallbackMetrics);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDynamicMetrics();

    // Listen for custom data updates from admin CMS
    const handleDataUpdate = () => {
      fetchDynamicMetrics();
    };

    window.addEventListener('sarohub-data-updated', handleDataUpdate);
    return () => window.removeEventListener('sarohub-data-updated', handleDataUpdate);
  }, []);

  const displayList = metrics.length > 0 ? metrics : defaultFallbackMetrics;

  return (
    <section 
      id="numbers" 
      className="border-b py-20 lg:py-24 relative overflow-hidden bg-slate-950/70"
      style={{ 
        borderColor: 'var(--border-app, #1e293b)' 
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Platform Metrics</span>
          </div>

          <h2 
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            SaroHub in Numbers
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Real dynamic metrics reflecting our active products, platforms, and client engineering partnerships.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {displayList.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || Briefcase;

            return (
              <div
                key={item.id || idx}
                id={`metric-item-${item.id || idx}`}
                className="flex flex-col items-center p-6 sm:p-8 rounded-2xl border transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1 relative group bg-slate-900/60 backdrop-blur-sm"
                style={{ 
                  borderColor: 'var(--border-app, #1e293b)' 
                }}
              >
                {/* Micro Icon */}
                <div 
                  className="flex h-12 w-12 rounded-xl border items-center justify-center transition-colors mb-4 text-blue-400 bg-blue-500/10 border-blue-500/25 group-hover:border-blue-500/50 group-hover:bg-blue-500/20"
                >
                  <IconComponent className="h-5 w-5 stroke-[1.8]" />
                </div>

                {/* Dynamic Number with Animated Count-up */}
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
                  <AnimatedNumber targetValue={item.number || '0'} />
                </div>

                {/* Label */}
                <p 
                  className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200"
                >
                  {item.label}
                </p>

                {item.description && (
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
