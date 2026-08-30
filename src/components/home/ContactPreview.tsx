import React, { useState } from 'react';
import {
  MapPin, Mail, Phone, Clock, Send, MessageSquare, Linkedin, Facebook, Twitter, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { api } from '../../api';

interface ContactPreviewProps {
  settings: { [key: string]: string };
}

export default function ContactPreview({ settings }: ContactPreviewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceRequired: 'Custom Software Development',
    estimatedBudget: '$1K - $5K',
    projectDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.projectDescription.trim()) return;

    setLoading(true);
    setStatus(null);
    try {
      await api.submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceRequired: formData.serviceRequired,
        estimatedBudget: formData.estimatedBudget,
        projectDescription: formData.projectDescription
      });
      setStatus({
        type: 'success',
        message: 'Your project inquiry has been received! Our engineering team will review it and get back to you shortly.'
      });
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 6000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceRequired: 'Custom Software Development',
        estimatedBudget: '$1K - $5K',
        projectDescription: ''
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Inquiry submission failed. Please try again or reach out directly.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="relative max-w-md w-full rounded-2xl p-8 text-center shadow-2xl border border-emerald-500/30 bg-slate-900">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2 text-white">Project Inquiry Received!</h3>
            <p className="text-sm leading-relaxed mb-6 text-slate-300">
              Thank you for reaching out! Your inquiry has been routed to our enterprise technical leads. We will review your project scope and contact you promptly.
            </p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <section
      id="contact-preview"
      className="py-24 relative overflow-hidden border-b grid-bg"
      style={{
        backgroundColor: 'var(--bg-app)',
        borderColor: 'var(--border-app)'
      }}
    >
      {/* Light highlights */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
            Connect
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
            style={{ color: 'var(--text-main)' }}
          >
            Start a Project Inquiry
          </h2>
          <p
            className="mt-4 text-sm font-medium leading-relaxed text-slate-400"
          >
            Have an enterprise project, software solution, or partnership idea? Send us your requirements and budget range to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Column 1: Contact Form (Left) */}
          <div
            className="lg:col-span-7 rounded-2xl border p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-sm premium-card-hover bg-slate-900/90 border-white/10"
          >
            <div>
              <h3 className="font-display text-lg font-bold mb-1.5 flex items-center gap-2 text-white">
                <MessageSquare className="h-5 w-5 text-blue-400 stroke-[1.8]" />
                Project Scoping Form
              </h3>
              <p className="text-xs font-medium mb-6 text-slate-400">
                Fill out your details below to schedule an architectural consultation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold font-mono uppercase tracking-wider block mb-1.5 text-slate-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border p-3.5 text-xs sm:text-sm placeholder-slate-500 focus:border-blue-500 bg-slate-950/80 border-white/10 text-white focus:outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold font-mono uppercase tracking-wider block mb-1.5 text-slate-400">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border p-3.5 text-xs sm:text-sm placeholder-slate-500 focus:border-blue-500 bg-slate-950/80 border-white/10 text-white focus:outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold font-mono uppercase tracking-wider block mb-1.5 text-slate-400">Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border p-3.5 text-xs sm:text-sm placeholder-slate-500 focus:border-blue-500 bg-slate-950/80 border-white/10 text-white focus:outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold font-mono uppercase tracking-wider block mb-1.5 text-slate-400">Target Service</label>
                    <select
                      value={formData.serviceRequired}
                      onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                      className="w-full rounded-lg border p-3.5 text-xs sm:text-sm focus:border-blue-500 bg-slate-950/80 border-white/10 text-white focus:outline-none transition-all font-medium"
                    >
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="Cognitive AI & Neural Systems">Cognitive AI & Neural Systems</option>
                      <option value="SaaS Architecture & Cloud">SaaS Architecture & Cloud</option>
                      <option value="Mobile Application Engineering">Mobile Application Engineering</option>
                      <option value="Dedicated Engineering Squad">Dedicated Engineering Squad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold font-mono uppercase tracking-wider block mb-1.5 text-slate-400">Estimated Budget Range</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Under $1K', '$1K - $5K', '$5K - $10K', '$10K+'].map((budget) => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setFormData({ ...formData, estimatedBudget: budget })}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          formData.estimatedBudget === budget
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                            : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold font-mono uppercase tracking-wider block mb-1.5 text-slate-400">Project Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your software goals, key requirements, or system scope..."
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="w-full rounded-lg border p-3.5 text-xs sm:text-sm placeholder-slate-500 focus:border-blue-500 bg-slate-950/80 border-white/10 text-white focus:outline-none transition-all font-medium"
                  />
                </div>

                {status && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                    }`}>
                    {status.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-rose-400" />
                    )}
                    <span className="text-xs sm:text-sm leading-relaxed font-semibold">{status.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10 cursor-pointer transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                      Submitting Inquiry...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Project Inquiry
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Registry Coordinates & Map (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Coordinates detail card */}
            <div
              className="rounded-2xl border p-6 flex-1 space-y-5 shadow-sm premium-card-hover"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-app)'
              }}
            >
              <h3 className="font-display text-sm font-bold uppercase tracking-wider border-b pb-3" style={{ color: 'var(--text-main)', borderColor: 'var(--border-app)' }}>
                Get In Touch
              </h3>

              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex h-9 w-9 bg-blue-500/10 border border-blue-500/20 rounded-lg items-center justify-center text-blue-400 shrink-0">
                    <MapPin className="h-4.5 w-4.5 stroke-[1.8]" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold font-mono text-slate-500 block uppercase">Address</span>
                    {settings.google_maps_link ? (
                      <a
                        href={settings.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-blue-400 font-bold hover:underline block leading-normal"
                      >
                        {settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan'}
                      </a>
                    ) : (
                      <span className="text-xs sm:text-sm font-medium leading-normal" style={{ color: 'var(--text-body)' }}>
                        {settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan'}
                      </span>
                    )}
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex h-9 w-9 bg-blue-500/10 border border-blue-500/20 rounded-lg items-center justify-center text-blue-400 shrink-0">
                    <Mail className="h-4.5 w-4.5 stroke-[1.8]" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold font-mono text-slate-500 block uppercase">Email</span>
                    <a href={`mailto:${settings.email || 'info@sarohub.com'}`} className="text-xs sm:text-sm text-blue-400 font-bold hover:underline">
                      {settings.email || 'info@sarohub.com'}
                    </a>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex h-9 w-9 bg-blue-500/10 border border-blue-500/20 rounded-lg items-center justify-center text-blue-400 shrink-0">
                    <Phone className="h-4.5 w-4.5 stroke-[1.8]" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold font-mono text-slate-500 block uppercase">Phone</span>
                    <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-body)' }}>
                      {settings.phone || '+92 355 58668 75'}
                    </span>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="flex h-9 w-9 bg-blue-500/10 border border-blue-500/20 rounded-lg items-center justify-center text-blue-400 shrink-0">
                    <Clock className="h-4.5 w-4.5 stroke-[1.8]" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold font-mono text-slate-500 block uppercase">Business Hours</span>
                    <span className="text-xs sm:text-sm font-mono font-medium" style={{ color: 'var(--text-body)' }}>
                      {settings.business_hours || 'Monday - Saturday: 9:00 AM - 6:00 PM (PKT)'}
                    </span>
                  </div>
                </li>
              </ul>

              {/* Social Channels Row */}
              <div className="pt-4 border-t flex items-center gap-4 text-slate-500" style={{ borderColor: 'var(--border-app)' }}>
                <span className="text-[9px] font-bold font-mono uppercase block text-slate-500">Channels:</span>
                <div className="flex gap-3">
                  {settings.linkedin && (
                    <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
                      <Linkedin className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {settings.facebook && (
                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
                      <Facebook className="h-4.5 w-4.5" />
                    </a>
                  )}
                  {settings.twitter && (
                    <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
                      <Twitter className="h-4.5 w-4.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Google Map Preview Embed */}
            <div className="h-52 rounded-2xl border overflow-hidden relative shadow-sm" style={{ borderColor: 'var(--border-app)' }}>
              <iframe
                title="SaroHub Technologies Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.office_address || 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="hover:opacity-95 transition-opacity duration-300 opacity-90"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
    </>
  );
}
