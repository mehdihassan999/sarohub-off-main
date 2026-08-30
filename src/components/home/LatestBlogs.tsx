import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogsProps {
  blogs: any[];
}

export default function LatestBlogs({ blogs }: BlogsProps) {
  // Format Date Helper
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  // Get first 3 blogs for homepage
  const recentBlogs = blogs.slice(0, 3);

  return (
    <section 
      id="latest-blogs" 
      className="py-24 relative overflow-hidden border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
              Articles & Guides
            </span>
            <h2 
              className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
              style={{ color: 'var(--text-main)' }}
            >
              Latest Blogs & Insights
            </h2>
          </div>
          <div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 group cursor-pointer"
            >
              Explore all articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {recentBlogs.length === 0 ? (
          <div 
            className="text-center py-16 rounded-2xl border font-medium text-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-app)',
              color: 'var(--text-muted)'
            }}
          >
            No articles found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBlogs.map((item, idx) => (
              <Link
                key={item.id || idx}
                to={`/blog?id=${item.id}`}
                className="block"
              >
                <motion.div
                  whileHover={{ y: -3 }}
                  className="h-full rounded-2xl border overflow-hidden flex flex-col justify-between group transition-all duration-300 premium-card-hover"
                  style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-app)' 
                  }}
                >
                  <div>
                    {/* Featured Image */}
                    <div className="h-48 overflow-hidden relative bg-white/[0.02] border-b" style={{ borderColor: 'var(--border-app)' }}>
                      <img
                        src={item.featured_image_url || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450'}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                      <span 
                        className="absolute bottom-4 left-4 rounded px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase border bg-black/60 backdrop-blur"
                        style={{ 
                          color: 'var(--text-main)',
                          borderColor: 'var(--border-app)'
                        }}
                      >
                        SYS BRIEFING
                      </span>
                    </div>

                    {/* Body Details */}
                    <div className="p-6 space-y-4">
                      {/* Meta stats */}
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-blue-400" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-blue-400" />
                          <span>{item.reading_time || '5 min read'}</span>
                        </div>
                      </div>

                      <h3 
                        className="font-display text-base sm:text-lg font-bold group-hover:text-blue-400 transition-colors line-clamp-2"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {item.title}
                      </h3>

                      {/* Content preview snippet */}
                      <p className="text-xs sm:text-sm font-medium leading-relaxed line-clamp-3" style={{ color: 'var(--text-body)' }}>
                        {item.content ? item.content.replace(/[#*`_]/g, '') : ''}
                      </p>
                    </div>
                  </div>

                  {/* Foot Read Link */}
                  <div className="p-6 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-app)' }}>
                    <div className="flex items-center gap-2">
                      {item.author_avatar && (
                        <img
                          src={item.author_avatar}
                          alt={item.author_name}
                          className="h-6 w-6 rounded-full object-cover border"
                          style={{ borderColor: 'var(--border-app)' }}
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{item.author_name || 'SaroHub Team'}</span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300">
                      Read More
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
