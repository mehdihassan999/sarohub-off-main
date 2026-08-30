import React from 'react';
import { Award, Star, Cpu, Shield, Zap, Sparkles, CheckCircle2, Linkedin, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import SocialIcon from '../SocialIcon';

interface TeamProps {
  team: any[];
}

// Fallback executive team data when database is empty
const FALLBACK_TEAM = [
  {
    id: 'f1',
    name: 'Mehdi Hassan',
    position: 'Founder & Chief Executive Officer (CEO)',
    is_founder: true,
    is_executive: true,
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Leads strategic vision, venture development, and overall corporate growth across global digital technology markets.',
    experience_years: '8+ Years Exp',
    skills: ['Product Vision', 'Venture Strategy', 'Software Architecture', 'Executive Leadership'],
    social_linkedin: 'https://linkedin.com/company/sarohub',
    social_twitter: 'https://twitter.com/sarohub',
    portfolio_url: 'https://sarohub.com'
  },
  {
    id: 'f2',
    name: 'Muhammad Nawaz',
    position: 'Co-Founder & Chief Technology Officer (CTO)',
    is_founder: true,
    is_executive: true,
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Oversees technology architecture, cloud infrastructure, full-stack systems engineering, and technical execution.',
    experience_years: '7+ Years Exp',
    skills: ['Cloud Architecture', 'Full-Stack Dev', 'Database Systems', 'Engineering Management'],
    social_linkedin: 'https://linkedin.com/company/sarohub',
    social_github: 'https://github.com/sarohub'
  },
  {
    id: 'f3',
    name: 'Muhammad Kazim',
    position: 'Co-Founder & Head of Operations & AI',
    is_founder: true,
    is_executive: false,
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
    bio: 'Directs operational delivery, artificial intelligence research, and product execution pipelines across client ventures.',
    experience_years: '6+ Years Exp',
    skills: ['AI Systems', 'Operations Management', 'Machine Learning', 'Project Delivery'],
    social_linkedin: 'https://linkedin.com/company/sarohub',
    social_twitter: 'https://twitter.com/sarohub'
  }
];

export default function LeadershipTeam({ team }: TeamProps) {
  // Use active team data or default fallbacks
  const activeTeam = Array.isArray(team) && team.length > 0 ? team : FALLBACK_TEAM;

  // Separate CEO & CTO (Top Leadership) from the rest of the core team
  const isExecutiveRole = (pos: string = '') => {
    const p = pos.toLowerCase();
    return p.includes('ceo') || p.includes('chief executive') || p.includes('cto') || p.includes('chief technology');
  };

  const executiveLeadership = activeTeam.filter(m => isExecutiveRole(m.position));
  const coreTeam = activeTeam.filter(m => !isExecutiveRole(m.position));

  // If filter logic leaves executives empty, default first 2 items as top leadership
  const topLeaders = executiveLeadership.length > 0 ? executiveLeadership : activeTeam.slice(0, 2);
  const remainingTeam = executiveLeadership.length > 0 ? coreTeam : activeTeam.slice(2);

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

    // Default to at least a LinkedIn fallback if no links provided
    if (links.length === 0) {
      links.push({ platform: 'LinkedIn', url: 'https://linkedin.com/company/sarohub' });
    }

    return links;
  };

  return (
    <section 
      id="leadership" 
      className="py-16 sm:py-20 relative overflow-hidden border-t border-b bg-slate-950"
      style={{ borderColor: 'var(--border-app)' }}
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[110px] pointer-events-none -z-10 mix-blend-screen" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-blue-400 shadow-sm mb-4"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Leadership & Team</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white mb-3"
          >
            Meet the Team Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">What's Next.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm font-medium text-slate-400 max-w-xl mx-auto leading-relaxed"
          >
            A dedicated technology team combining engineering excellence, strategic product vision, and operational execution.
          </motion.p>
        </div>

        {/* ALL TEAM CARDS IN ONE SINGLE ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activeTeam.map((member, idx) => (
            <motion.div
              key={member.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-blue-500/40 backdrop-blur-xl shadow-lg transition-all duration-300 flex flex-col items-center text-center overflow-hidden h-full justify-between"
            >
              {/* Glowing top accent border */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none" />

              <div className="flex flex-col items-center w-full">
                {/* Circular Portrait */}
                <div className="relative mb-5 flex justify-center items-center mx-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-blue-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-300 p-0.5 bg-slate-950 flex items-center justify-center">
                    <img
                      src={member.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300'}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full filter group-hover:scale-105 transition-transform duration-300 mx-auto"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {member.is_founder && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider shadow-md border border-blue-400/40 whitespace-nowrap">
                      Executive
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {member.name}
                  </h3>

                  <p className="text-[11px] font-bold font-mono text-cyan-400 uppercase tracking-wider">
                    {member.position}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-3 pt-1">
                    {member.bio}
                  </p>
                </div>

                {/* Skills tags */}
                {member.skills && (
                  <div className="flex flex-wrap justify-center gap-1 mt-4">
                    {(Array.isArray(member.skills) ? member.skills : String(member.skills).split(',')).slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="text-[9px] font-semibold rounded-md px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/70 w-full justify-center">
                {getMemberSocialLinks(member).map((sLink, sIdx) => {
                  const href = sLink.url.startsWith('http') ? sLink.url : `https://${sLink.url}`;
                  return (
                    <a
                      key={sIdx}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-200 cursor-pointer"
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
    </section>
  );
}
