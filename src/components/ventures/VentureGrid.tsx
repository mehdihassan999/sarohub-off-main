import React, { useState, useMemo } from 'react';
import { Venture } from '../../types';
import VentureCard from './VentureCard';
import { motion } from 'motion/react';

interface VentureGridProps {
  ventures: Venture[];
}

export default function VentureGrid({ ventures }: VentureGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Derive unique filter tags from venture data (status + categories)
  const filters = useMemo(() => {
    const tags = new Set<string>(['All']);
    ventures.forEach((v) => {
      if (v.status) tags.add(v.status);
      if (v.category) {
        // Split "EdTech • SaaS" into individual tags
        v.category.split(/[•,\/]/g).forEach((c) => {
          const clean = c.trim();
          if (clean) tags.add(clean);
        });
      }
    });
    return Array.from(tags);
  }, [ventures]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return ventures;
    return ventures.filter(
      (v) =>
        v.status === activeFilter ||
        (v.category && v.category.includes(activeFilter))
    );
  }, [ventures, activeFilter]);

  return (
    <div>
      {/* Filter Tabs */}
      {filters.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                activeFilter === f
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-white/10 hover:border-blue-500/30 hover:text-blue-300'
              }`}
              style={activeFilter === f ? {} : { color: 'var(--text-body)', backgroundColor: 'transparent' }}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Venture Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm font-medium">No ventures match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((venture, idx) => (
            <VentureCard key={venture.id} venture={venture} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
