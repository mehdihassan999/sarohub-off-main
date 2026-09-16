import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, FolderGit2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export interface ClientProjectCardProps {
  project: any;
  idx?: number;
  className?: string;
  key?: any;
}

export default function ClientProjectCard({ 
  project, 
  idx = 0, 
  className = '' 
}: ClientProjectCardProps) {
  // Normalize technologies
  const techList = Array.isArray(project.technologies)
    ? project.technologies
    : typeof project.technologies === 'string'
    ? project.technologies.split(',').map((t: string) => t.trim())
    : [];

  const projectUrl = `/projects/${project.slug || project.id}`;
  const displayImage = project.thumbnail_url || project.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450';
  const whatWeSolvedText = project.what_we_solved || project.case_study || 'Engineered bespoke digital architecture solving core operational bottlenecks.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.25) }}
      id={`work-card-${project.id || idx}`}
      className={`group flex flex-col rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-app)'
      }}
    >
      {/* Visual Header / Showcase Banner (Apple 16:9 style) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 border-b border-white/10">
        <img
          src={displayImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2 pointer-events-none">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 text-blue-400 shadow-sm">
            {project.category || 'Client Project'}
          </span>

          <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {project.status || 'Delivered'}
          </span>
        </div>

        {/* Client & Industry floating overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-end gap-2 pointer-events-none">
          <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider truncate drop-shadow-md">
            {project.client_name ? `Client: ${project.client_name}` : project.title}
          </span>
          {project.industry && (
            <span className="text-[9px] font-mono text-slate-300 font-medium px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-white/10 shrink-0">
              {project.industry}
            </span>
          )}
        </div>
      </div>

      {/* Card Body - Tight, Professional & Proportional (Zero dead vertical space) */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
          <Link to={projectUrl} className="hover:underline">
            {project.title}
          </Link>
        </h3>

        {/* Executive summary */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {project.short_description || project.description}
        </p>

        {/* "What We Solved" Feature Box - Sleek, Snug, No Empty Space */}
        <div className="rounded-xl p-2.5 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-900/40 border border-blue-500/20 mb-3">
          <div className="flex items-center gap-1.5 mb-1 text-cyan-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300">
              What We Solved
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-200 leading-snug font-medium line-clamp-2">
            {whatWeSolvedText}
          </p>
        </div>

        {/* Key Technologies Tags - Flush under What We Solved */}
        {techList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {techList.slice(0, 4).map((tech: string, i: number) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700/60 bg-slate-800/60 text-slate-300 font-medium"
              >
                {tech}
              </span>
            ))}
            {techList.length > 4 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-slate-700/40 bg-slate-800/40 text-slate-400 font-medium">
                +{techList.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Card Footer Actions - Mounts cleanly without empty gap */}
        <div 
          className="mt-auto pt-3 border-t flex items-center justify-between gap-2" 
          style={{ borderColor: 'var(--border-app)' }}
        >
          <Link
            to={projectUrl}
            id={`view-case-study-${project.id || idx}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 rounded-xl transition-all shadow-sm hover:shadow-blue-500/25 group/btn cursor-pointer"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>View Case Study</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
          </Link>

          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-700/80 transition-all cursor-pointer"
              title="Launch Live Project"
            >
              <span>Live Demo</span>
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
