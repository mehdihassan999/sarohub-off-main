import React from 'react';
import { Award, Star, Cpu, Shield, Zap, Sparkles, CheckCircle2, Linkedin, ExternalLink, Users, Code, Layers, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import SocialIcon from '../SocialIcon';

interface TeamProps {
  team: any[];
}

// Fallback executive team data (The 3 Co-Founders)
const FALLBACK_COFOUNDERS = [
  {
    id: 'f1',
    name: 'Mehdi Hassan',
    position: 'Founder & Chief Executive Officer (CEO)',
    is_founder: true,
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
    bio: 'Leads company vision, business strategy, product development, and global partnerships.',
    experience_years: '8+ Years',
    skills: ['Business Strategy', 'Executive Leadership', 'Product Development', 'Company Growth'],
    social_linkedin: 'https://linkedin.com/company/sarohub',
    social_twitter: 'https://twitter.com/sarohub',
    portfolio_url: 'https://sarohub.com'
  },
  {
    id: 'f2',
    name: 'Muhammad Nawaz',
    position: 'Co-Founder & Chief Technology Officer (CTO)',
    is_founder: true,
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
    bio: 'Leads technical architecture, cloud systems, database management, and high software engineering standards.',
    experience_years: '7+ Years',
    skills: ['Cloud Solutions', 'Web & App Development', 'System Architecture', 'Technical Leadership'],
    social_linkedin: 'https://linkedin.com/company/sarohub',
    social_github: 'https://github.com/sarohub'
  },
  {
    id: 'f3',
    name: 'Muhammad Kazim',
    position: 'Co-Founder & Head of Operations & AI',
    is_founder: true,
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
    bio: 'Manages day-to-day operations, artificial intelligence integration, on-time project delivery, and team growth.',
    experience_years: '6+ Years',
    skills: ['Artificial Intelligence', 'Operations Management', 'Smart Automation', 'Project Delivery'],
    social_linkedin: 'https://linkedin.com/company/sarohub',
    social_twitter: 'https://twitter.com/sarohub'
  }
];

// Fallback team members when not added to database
const FALLBACK_OTHER_TEAM = [
  {
    id: 't1',
    name: 'Syed Ali Raza',
    position: 'Lead Full-Stack & Cloud Architect',
    is_founder: false,
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
    bio: 'Specializes in fast server systems, secure cloud hosting, and smooth real-time web applications.',
    experience_years: '5+ Years',
    skills: ['Backend Systems', 'Web Applications', 'Cloud Deployment', 'Database Management'],
    social_linkedin: 'https://linkedin.com/company/sarohub',
    social_github: 'https://github.com/sarohub'
  },
  {
    id: 't2',
    name: 'Fatima Zahra',
    position: 'Lead UI/UX & Design Systems Engineer',
    is_founder: false,
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
    bio: 'Designs clean, user-friendly digital experiences, interactive prototypes, and modern website and app interfaces.',
    experience_years: '4+ Years',
    skills: ['UI/UX Design', 'Interactive Prototypes', 'User Experience', 'Web Design'],
    social_linkedin: 'https://linkedin.com/company/sarohub'
  },
  {
    id: 't3',
    name: 'Ahmad Hussain',
    position: 'Senior AI & Mobile Systems Engineer',
    is_founder: false,
    photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400&h=400',
    bio: 'Builds fast iOS and Android mobile apps and integrates smart AI features and workflow automation.',
    experience_years: '4+ Years',
    skills: ['Mobile App Development', 'AI Integration', 'App Security', 'System Connections'],
    social_linkedin: 'https://linkedin.com/company/sarohub',
    social_github: 'https://github.com/sarohub'
  }
];

export default function LeadershipTeam({ team }: TeamProps) {
  // Use active team data or default fallbacks
  const rawTeam = Array.isArray(team) && team.length > 0 ? team : [];

  // Group team members: Co-Founders vs. Other Team Members
  const dbFounders = rawTeam.filter(m => m.is_founder === true || m.is_founder === 1 || m.is_founder === 'true');
  const dbOtherMembers = rawTeam.filter(m => !m.is_founder || m.is_founder === 0 || m.is_founder === 'false');

  // Co-Founders: Use DB founders if present, otherwise fallback to the 3 main co-founders
  const coFounders = dbFounders.length > 0 ? dbFounders : FALLBACK_COFOUNDERS;
  
  // Other Team Members: Use DB members if present, otherwise fallback list
  const otherTeamMembers = dbOtherMembers.length > 0 ? dbOtherMembers : (rawTeam.length === 0 ? FALLBACK_OTHER_TEAM : []);

  const getMemberSocialLinks = (member: any) => {
    const links: Array<{ platform: string; url: string }> = [];

    if (Array.isArray(member.social_links) && member.social_links.length > 0) {
      member.social_links.forEach((l: any) => {
        if (l.url && l.url.trim()) links.push({ platform: l.platform || 'LinkedIn', url: l.url.trim() });
      });
    }

    if (member.social_linkedin && !links.some(l => l.platform.toLowerCase().includes('linkedin'))) {
      links.push({ platform: 'LinkedIn', url: member.social_linkedin });
    }
    if (member.social_github && !links.some(l => l.platform.toLowerCase().includes('github'))) {
      links.push({ platform: 'GitHub', url: member.social_github });
    }
    if (member.social_twitter && !links.some(l => l.platform.toLowerCase().includes('twitter') || l.platform.toLowerCase() === 'x')) {
      links.push({ platform: 'Twitter', url: member.social_twitter });
    }
    if (member.portfolio_url && !links.some(l => l.platform.toLowerCase().includes('portfolio') || l.platform.toLowerCase().includes('website'))) {
      links.push({ platform: 'Portfolio', url: member.portfolio_url });
    }

    // Default fallback link if none given
    if (links.length === 0) {
      links.push({ platform: 'LinkedIn', url: 'https://linkedin.com/company/sarohub' });
    }

    return links;
  };

  return (
    <section 
      id="leadership" 
      className="py-20 sm:py-24 relative overflow-hidden border-t border-b bg-slate-950"
      style={{ borderColor: 'var(--border-app)' }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-12 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute top-3/4 left-10 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />

      <div className="mx-auto max-w-7xl px-6 relative z-10 space-y-20">
        
        {/* ========================================================================= */}
        {/* SECTION 1: THE THREE MAIN CO-FOUNDERS */}
        {/* ========================================================================= */}
        <div className="space-y-12">
          {/* Co-Founders Header */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-sm mb-4"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Founding Leadership</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
            >
              Co-Founders & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">Executive Leadership</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              The three founding partners driving corporate strategy, technological innovation, operational excellence, and venture scaling at SaroHub Technologies.
            </motion.p>
          </div>

          {/* Co-Founders Grid: 3-column prominent display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {coFounders.map((founder, idx) => (
              <motion.div
                key={founder.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-blue-500/20 hover:border-cyan-400/50 backdrop-blur-2xl shadow-xl hover:shadow-[0_12px_40px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col justify-between overflow-hidden text-center"
              >
                {/* Top glow & border line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500 pointer-events-none" />

                <div className="flex flex-col items-center w-full">
                  {/* Portrait with Co-Founder Badge */}
                  <div className="relative mb-6 flex justify-center items-center mx-auto">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cyan-500/40 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300 p-1 bg-slate-950 flex items-center justify-center">
                      <img
                        src={founder.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400'}
                        alt={founder.name}
                        className="w-full h-full object-cover rounded-full filter group-hover:scale-105 transition-transform duration-300 mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg border border-cyan-300/40 whitespace-nowrap">
                      Co-Founder
                    </span>
                  </div>

                  {/* Name & Position */}
                  <div className="space-y-2 mt-1">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {founder.name}
                    </h3>

                    <p className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-lg inline-block">
                      {founder.position}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal pt-2 line-clamp-3">
                      {founder.bio}
                    </p>
                  </div>

                  {/* Skills / Focus */}
                  {founder.skills && (
                    <div className="flex flex-wrap justify-center gap-1.5 mt-5">
                      {(Array.isArray(founder.skills) ? founder.skills : String(founder.skills).split(',')).slice(0, 4).map((skill: string, i: number) => (
                        <span key={i} className="text-[10px] font-semibold rounded-md px-2.5 py-1 bg-slate-950/80 border border-slate-800 text-slate-300">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Channels Footer */}
                <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/80 w-full justify-center">
                  {getMemberSocialLinks(founder).map((sLink, sIdx) => {
                    const href = sLink.url.startsWith('http') ? sLink.url : `https://${sLink.url}`;
                    return (
                      <a
                        key={sIdx}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-cyan-400 transition-all duration-200 cursor-pointer shadow-sm hover:scale-110"
                        title={`${sLink.platform}: ${href}`}
                        aria-label={sLink.platform}
                      >
                        <SocialIcon platform={sLink.platform} className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: OTHER TEAM MEMBERS / CORE SPECIALISTS */}
        {/* ========================================================================= */}
        {otherTeamMembers.length > 0 && (
          <div className="space-y-12 pt-8 border-t border-slate-900/80">
            {/* Extended Team Header */}
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-cyan-400 shadow-sm mb-4"
              >
                <Users className="h-3.5 w-3.5 text-cyan-400" />
                <span>Our Core Team</span>
              </motion.div>

              <motion.h3 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3"
              >
                Core Engineering & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Specialist Team</span>
              </motion.h3>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xs sm:text-sm font-medium text-slate-400 max-w-xl mx-auto leading-relaxed"
              >
                Our multidisciplinary specialists, full-stack software engineers, and product designers executing technical solutions and high-performance platforms.
              </motion.p>
            </div>

            {/* Other Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {otherTeamMembers.map((member, idx) => (
                <motion.div
                  key={member.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 backdrop-blur-xl shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden text-center"
                >
                  {/* Subtle top border */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex flex-col items-center w-full">
                    {/* Portrait */}
                    <div className="relative mb-4 flex justify-center items-center mx-auto">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-800 group-hover:border-cyan-500/40 transition-all duration-300 p-0.5 bg-slate-950 flex items-center justify-center">
                        <img
                          src={member.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400'}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full filter group-hover:scale-105 transition-transform duration-300 mx-auto"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5">
                      <h4 className="font-display text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {member.name}
                      </h4>

                      <p className="text-[11px] font-bold font-mono text-cyan-400 uppercase tracking-wider">
                        {member.position}
                      </p>

                      <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-3 pt-1">
                        {member.bio}
                      </p>
                    </div>

                    {/* Skills */}
                    {member.skills && (
                      <div className="flex flex-wrap justify-center gap-1 mt-3.5">
                        {(Array.isArray(member.skills) ? member.skills : String(member.skills).split(',')).slice(0, 3).map((skill: string, i: number) => (
                          <span key={i} className="text-[9px] font-medium rounded px-2 py-0.5 bg-slate-950 border border-slate-800/80 text-slate-400">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Social links */}
                  <div className="flex items-center gap-2 mt-5 pt-3.5 border-t border-slate-800/60 w-full justify-center">
                    {getMemberSocialLinks(member).map((sLink, sIdx) => {
                      const href = sLink.url.startsWith('http') ? sLink.url : `https://${sLink.url}`;
                      return (
                        <a
                          key={sIdx}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer"
                          title={`${sLink.platform}: ${href}`}
                          aria-label={sLink.platform}
                        >
                          <SocialIcon platform={sLink.platform} className="h-3.5 w-3.5" />
                        </a>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

