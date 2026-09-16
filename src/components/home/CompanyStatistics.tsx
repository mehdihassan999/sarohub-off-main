import React, { useEffect, useState } from 'react';
import { Laptop, GraduationCap, Calendar, Settings, Globe, Users, Cpu, Award, MapPin, Briefcase } from 'lucide-react';
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
  Settings
};

export default function CompanyStatistics({ apiStats }: StatsProps) {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    api.getCompanyMetrics()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const active = data.filter(m => m.active).sort((a, b) => (a.order || 0) - (b.order || 0));
          setMetrics(active.length > 0 ? active : defaultFallbackMetrics);
        } else {
          setMetrics(defaultFallbackMetrics);
        }
      })
      .catch(() => setMetrics(defaultFallbackMetrics));
  }, []);

  const defaultFallbackMetrics = [
    { id: 1, number: '3+', label: 'Products & Ventures', description: 'Proprietary platforms built & maintained', icon: 'Award', order: 1 },
    { id: 2, number: '500+', label: 'Platform Users', description: 'Active learners, administrators & businesses', icon: 'Users', order: 2 },
    { id: 3, number: '60+', label: 'Education Staff', description: 'Teachers & personnel on our platforms', icon: 'GraduationCap', order: 3 },
    { id: 4, number: '3+', label: 'Client Projects', description: 'Mission-critical systems delivered for partners', icon: 'Briefcase', order: 4 }
  ];

  const displayList = metrics.length > 0 ? metrics : defaultFallbackMetrics;

  return (
    <section 
      id="numbers" 
      className="border-b py-20 lg:py-24 relative overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400 mb-4">
            Verified Traction
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            SaroHub in Numbers
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Real metrics reflecting our active products, platforms, and client partnerships.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {displayList.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || Briefcase;

            return (
              <div
                key={item.id || idx}
                id={`metric-item-${item.id || idx}`}
                className="flex flex-col items-center p-6 sm:p-8 rounded-2xl border transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-app)' 
                }}
              >
                {/* Micro Icon */}
                <div 
                  className="flex h-12 w-12 rounded-xl border items-center justify-center transition-colors mb-4 text-blue-400 bg-blue-500/10 border-blue-500/25"
                >
                  <IconComponent className="h-5 w-5 stroke-[1.8]" />
                </div>

                {/* Number */}
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                    {item.number}
                  </span>
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

