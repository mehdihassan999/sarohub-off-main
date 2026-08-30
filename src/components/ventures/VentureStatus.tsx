import React from 'react';
import { VentureStatusType } from '../../types';

interface VentureStatusProps {
  status: VentureStatusType | string;
  size?: 'sm' | 'md' | 'lg';
}

export default function VentureStatus({ status, size = 'sm' }: VentureStatusProps) {
  const getStatusStyles = (st: string) => {
    const s = st ? st.toLowerCase() : '';
    if (s.includes('active')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-950/20';
    }
    if (s.includes('expanding')) {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-cyan-950/20';
    }
    if (s.includes('development') || s.includes('dev')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-950/20';
    }
    if (s.includes('beta')) {
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-blue-950/20';
    }
    if (s.includes('prototype')) {
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-purple-950/20';
    }
    if (s.includes('research')) {
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-indigo-950/20';
    }
    if (s.includes('idea')) {
      return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
    return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider rounded-full border shadow-sm ${sizeClasses[size]} ${getStatusStyles(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  );
}
