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
              Turning Vision Into Ventures.
            </p>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              SaroHub Technologies is an entrepreneurship-driven technology company that builds ventures, products, and digital solutions. Founded in Gilgit-Baltistan, Pakistan. Building for a global market.
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

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-white">Explore</h4>
            <ul className="mt-6 space-y-3">
              <li>
                <Link to="/services" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Solutions & Services</Link>
              </li>
              <li>
                <Link to="/ventures" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Our Ventures</Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Selected Projects</Link>
              </li>
              <li>
                <Link to="/student-projects" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Student Projects (IT Academy)</Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Marketplace</Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Opportunities</Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-white">Contact Us</h4>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                <MapPin className="h-5 w-5 text-cyan-500 shrink-0" />
                <span>{settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan'}</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Mail className="h-5 w-5 text-cyan-500 shrink-0" />
                <a href={`mailto:${settings.email || 'info@sarohub.com'}`} className="hover:text-cyan-400 transition-colors">
                  {settings.email || 'info@sarohub.com'}
                </a>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Phone className="h-5 w-5 text-cyan-500 shrink-0" />
                <span>{settings.phone || '+92 355 58668 75'}</span>
              </li>
              {settings.whatsapp && (
                <li className="flex gap-3 text-sm text-slate-400">
                  <MessageSquare className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>WhatsApp: {settings.whatsapp}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscriber Form */}
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-white">Stay Updated</h4>
            <p className="mt-6 text-sm text-slate-400 leading-relaxed">
              Subscribe for updates on our latest ventures, technology insights, and products.
            </p>
            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 pr-12 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white transition-opacity cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {status && (
                <div className={`text-xs mt-2 font-medium ${status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
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
