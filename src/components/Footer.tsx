import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Logo from './Logo';
import SocialIcon from './SocialIcon';
import { api } from '../api';

interface FooterProps {
  settings: { [key: string]: string };
}

const getCompanySocialLinks = (settings: { [key: string]: string }) => {
  const links: Array<{ platform: string; url: string }> = [];
  if (settings.facebook) links.push({ platform: 'Facebook', url: settings.facebook });
  if (settings.linkedin) links.push({ platform: 'LinkedIn', url: settings.linkedin });
  if (settings.twitter) links.push({ platform: 'Twitter', url: settings.twitter });
  if (settings.instagram) links.push({ platform: 'Instagram', url: settings.instagram });
  if (settings.github) links.push({ platform: 'GitHub', url: settings.github });
  if (settings.youtube) links.push({ platform: 'YouTube', url: settings.youtube });
  if (settings.tiktok) links.push({ platform: 'TikTok', url: settings.tiktok });

  if (settings.custom_socials) {
    try {
      const custom = JSON.parse(settings.custom_socials);
      if (Array.isArray(custom)) {
        custom.forEach((c: any) => {
          if (c.url && c.url.trim()) links.push({ platform: c.platform || 'Social', url: c.url.trim() });
        });
      }
    } catch (e) {}
  }
  return links;
};

export default function Footer({ settings }: FooterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus({ type: 'success', message: res.message });
      setEmail('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Newsletter registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-6 text-slate-300 relative z-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Column 1: Brand & Bio */}
          <div>
            <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-[1.01]">
              <Logo height={36} showText={false} variant="dark" />
            </Link>
            
            <p className="mt-2 text-xs font-semibold text-blue-400 tracking-wide">
              Building Technology That Turns Ideas Into Ventures.
            </p>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              SaroHub Technologies is a technology company that builds digital products, provides technology solutions to businesses, and develops its own ventures. Founded in Gilgit-Baltistan, Pakistan, building for a global market.
            </p>

            {/* Dynamic Social Media Icons */}
            {getCompanySocialLinks(settings).length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {getCompanySocialLinks(settings).map((link, idx) => {
                  const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
                  return (
                    <a
                      key={idx}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 hover:bg-blue-600/20 hover:text-blue-400 transition-all duration-200"
                      aria-label={link.platform}
                      title={`${link.platform}: ${href}`}
                    >
                      <SocialIcon platform={link.platform} className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}

          </div>

          {/* Column 2: Solutions */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200">Client Engines</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/book" className="text-xs text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-1.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Direct Consultation Booking
                </Link>
              </li>
              <li>
                <Link to="/estimate" className="text-xs text-cyan-400 font-semibold hover:text-cyan-300 flex items-center gap-1.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Scope & Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/capabilities" className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  Executive Deck (PDF One-Pager)
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-xs text-emerald-400 font-semibold hover:text-emerald-300 flex items-center gap-1.5 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Trust, 100% IP &amp; Models
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-800/60">
                <Link to="/services" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">All Engineering Services</Link>
              </li>
              <li>
                <Link to="/services/custom-software" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Custom Software</Link>
              </li>
              <li>
                <Link to="/services/saas-development" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">SaaS Development</Link>
              </li>
              <li>
                <Link to="/services/ai-automation" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">AI & Automation</Link>
              </li>
              <li>
                <Link to="/services/ui-ux-design" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">UI/UX & Design Systems</Link>
              </li>
              <li>
                <Link to="/services/graphic-design" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Graphic Design & Brand</Link>
              </li>
              <li>
                <Link to="/services/digital-marketing" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Digital Marketing & SEO</Link>
              </li>
              <li>
                <Link to="/industries" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Industry Solutions</Link>
              </li>
              <li>
                <Link to="/startups" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">For Startups & MVPs</Link>
              </li>
              <li>
                <Link to="/agency-partners" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Agency Partnerships</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Ventures & Engineering */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200">Ventures & Craft</h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/ventures" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Proprietary Ventures</Link>
              </li>
              <li>
                <Link to="/work" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Selected Work & Case Studies</Link>
              </li>
              <li>
                <Link to="/partnerships" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Partnership Programs</Link>
              </li>
              <li>
                <Link to="/process" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Development Process</Link>
              </li>
              <li>
                <Link to="/technology" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Technology Stack</Link>
              </li>
              <li>
                <Link to="/insights" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Insights & Articles</Link>
              </li>
              <li>
                <Link to="/events" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Events & Webinars</Link>
              </li>
              <li>
                <Link to="/student-projects" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">IT Academy Capstones</Link>
              </li>
              <li>
                <Link to="/careers" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">Careers at SaroHub</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200">Connect With Us</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-2.5 text-xs text-slate-400 leading-relaxed">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan'}</span>
              </li>
              <li className="flex gap-2.5 text-xs text-slate-400">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.email || 'info@sarohub.com'}`} className="hover:text-blue-400 transition-colors">
                  {settings.email || 'info@sarohub.com'}
                </a>
              </li>
              <li className="flex gap-2.5 text-xs text-slate-400">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <span>{settings.phone || '+92 355 58668 75'}</span>
              </li>
            </ul>

            <form onSubmit={handleSubscribe} className="mt-5 flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="haider.ali@sarohub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3.5 py-2 pr-10 text-xs text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-opacity cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>

              {status && (
                <div className={`text-[11px] mt-1 font-medium ${status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {status.message}
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} SaroHub Technologies (Private) Limited. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link to="/privacy-policy" className="hover:text-cyan-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan-400">Terms & Conditions</Link>
            <Link to="/cookie-policy" className="hover:text-cyan-400">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
