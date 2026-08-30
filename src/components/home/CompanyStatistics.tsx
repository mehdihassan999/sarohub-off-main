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
          setMetrics(data.filter(m => m.active));
        } else {
          setMetrics(defaultFallbackMetrics);
        }
      })
      .catch(() => setMetrics(defaultFallbackMetrics));
  }, []);

  const defaultFallbackMetrics = [
    { id: 1, number: (apiStats?.products || 50) + '+', label: 'Projects Delivered', description: 'Enterprise platforms & web systems', icon: 'Briefcase' },
    { id: 2, number: (apiStats?.clients || 18) + '+', label: 'Organizations Served', description: 'Corporate clients & institutions', icon: 'Globe' },
    { id: 3, number: '100K+', label: 'Active Users Reached', description: 'Across deployed SaaS applications', icon: 'Users' },
    { id: 4, number: (apiStats?.team || 25) + '+', label: 'Engineering Experts', description: 'Full-stack & AI developers', icon: 'Cpu' }
  ];

  const displayList = metrics.length > 0 ? metrics : defaultFallbackMetrics;

  return (
    <section 
      id="stats" 
      className="border-b py-16 relative overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 text-center">
          {displayList.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || Briefcase;

            return (
              <div
                key={item.id || idx}
                className="flex flex-col items-center p-5 rounded-2xl border transition-all duration-300 premium-card-hover"
                style={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-app)' 
                }}
              >
                {/* Micro Icon */}
                <div 
                  className="flex h-10 w-10 rounded-xl border items-center justify-center transition-colors mb-3 text-blue-400 bg-blue-500/10 border-blue-500/25"
                >
                  <IconComponent className="h-4.5 w-4.5 stroke-[1.8]" />
                </div>

                {/* Number */}
                <div className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                    {item.number}
                  </span>
                </div>

                {/* Label */}
                <p 
                  className="mt-2 text-[10px] font-bold uppercase tracking-wider transition-colors text-slate-300"
                >
                  {item.label}
                </p>

                {item.description && (
                  <p className="mt-1 text-[9px] font-mono text-slate-500 line-clamp-1">
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

