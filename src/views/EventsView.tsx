import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, MapPin, Clock, ArrowUpRight, Search, Filter, 
  Sparkles, CheckCircle2, AlertCircle, X, Download, Share2, 
  ChevronRight, Users, Bell, ExternalLink, Loader2, FileText,
  User, Mail, ShieldCheck, Ticket, Check, Phone, Building2, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../api';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import DynamicFormField from '../components/opportunities/DynamicFormField';

export default function EventsView() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  
  // RSVP Modal State
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<any | null>(null);
  const [rsvpPayload, setRsvpPayload] = useState({
    applicant_name: '',
    applicant_email: '',
    form_data: {} as { [key: string]: any }
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileUpload = async (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFieldId(fieldId);
    try {
      const formData = new FormData();
      formData.append('document', file);
      const token = localStorage.getItem('sarohub_auth_token') || localStorage.getItem('sarohub_token') || '';
      const res = await fetch('/api/upload-document', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setRsvpPayload(prev => ({
          ...prev,
          form_data: { ...prev.form_data, [fieldId]: data.url }
        }));
      } else {
        alert(data.error || 'Failed to upload document.');
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading file.');
    } finally {
      setUploadingFieldId(null);
    }
  };

  const fetchEvents = () => {
    setIsLoading(true);
    api.getEvents()
      .then((data) => {
        setEvents(data || []);
      })
      .catch((err) => {
        console.error('Failed to load corporate events:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();

    const onDataUpdated = () => {
      fetchEvents();
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  // Format Date Helper
  const parseEventDate = (isoString: string) => {
    try {
      if (!isoString) return { day: 'TBA', month: 'EVENT', year: '', full: 'Schedule Pending', timestamp: 0, isPast: false };
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return { day: 'TBA', month: 'EVENT', year: '', full: isoString, timestamp: 0, isPast: false };
      }
      const now = new Date();
      return {
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        year: date.getFullYear().toString(),
        full: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }),
        timestamp: date.getTime(),
        isPast: date.getTime() < now.getTime()
      };
    } catch {
      return { day: 'TBA', month: 'EVENT', year: '', full: isoString || 'Schedule Pending', timestamp: 0, isPast: false };
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const dateMeta = parseEventDate(event.event_date);
      
      // Time filter
      if (timeFilter === 'upcoming' && dateMeta.isPast) return false;
      if (timeFilter === 'past' && !dateMeta.isPast) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title?.toLowerCase().includes(q);
        const matchesDesc = event.description?.toLowerCase().includes(q);
        const matchesVenue = event.venue?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesVenue) return false;
      }

      return true;
    });
  }, [events, searchQuery, timeFilter]);

  // Google Calendar Link generator
  const getGoogleCalendarUrl = (event: any) => {
    const title = encodeURIComponent(event.title || 'SaroHub Corporate Event');
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.venue || 'SaroHub Hybrid Portal');
    
    let dates = '';
    try {
      const d = new Date(event.event_date);
      if (!isNaN(d.getTime())) {
        const start = d.toISOString().replace(/-|:|\.\d+/g, '');
        const endD = new Date(d.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
        const end = endD.toISOString().replace(/-|:|\.\d+/g, '');
        dates = `&dates=${start}/${end}`;
      }
    } catch (e) {
      // ignore
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dates}`;
  };

  // iCal (.ics) download generator
  const downloadIcal = (event: any) => {
    try {
      const d = new Date(event.event_date);
      const start = !isNaN(d.getTime()) ? d.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z' : '';
      const endD = !isNaN(d.getTime()) ? new Date(d.getTime() + 2 * 60 * 60 * 1000) : new Date();
      const end = endD.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';

      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SaroHub Technologies//Events//EN',
        'BEGIN:VEVENT',
        `SUMMARY:${event.title || 'SaroHub Corporate Event'}`,
        `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
        `LOCATION:${event.venue || 'Hybrid Portal'}`,
        start ? `DTSTART:${start}` : '',
        end ? `DTEND:${end}` : '',
        'END:VEVENT',
        'END:VCALENDAR'
      ].filter(Boolean).join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(event.title || 'event').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate iCal:', err);
    }
  };

  const validateRsvpForm = () => {
    const errs: { [key: string]: string } = {};
    if (!rsvpPayload.applicant_name.trim()) {
      errs.applicant_name = 'Full Name is required.';
    }
    if (!rsvpPayload.applicant_email.trim()) {
      errs.applicant_email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(rsvpPayload.applicant_email)) {
      errs.applicant_email = 'Please enter a valid email address.';
    }

    if (selectedEventForRsvp && selectedEventForRsvp.form_fields) {
      selectedEventForRsvp.form_fields.forEach((field: any) => {
        if (field.disabled) return;
        const val = rsvpPayload.form_data[field.id];
        if (field.required) {
          if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
            errs[field.id] = field.validation?.customErrorMessage || `${field.label} is required.`;
            return;
          }
        }
      });
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForRsvp) return;
    if (!validateRsvpForm()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitEventRegistration(selectedEventForRsvp.id, {
        applicant_name: rsvpPayload.applicant_name,
        applicant_email: rsvpPayload.applicant_email,
        form_data: rsvpPayload.form_data
      });
      setSuccessMessage(res.message || 'Seat reservation registered successfully! You will receive confirmation via email.');
    } catch (err: any) {
      setFormErrors({ global: err.message || 'Failed to submit registration. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-slate-950">
      <SEOHead
        title="Corporate Events & Tech Summits | SaroHub Technologies"
        description="Join SaroHub founders, software engineers, and enterprise leaders in keynote summits, technical masterclasses, and developer hackathons."
      />

      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Breadcrumb Navigation */}
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Events & Webinars' }
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-400 mb-6">
            <Calendar className="h-3.5 w-3.5" /> Corporate Engagements & Tech Summits
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Events, Summits &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Masterclasses</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed">
            Connect directly with SaroHub venture architects, core system engineers, and technology partners. We host technical deep-dives, developer hackathons, and corporate conferences on scalable digital architecture.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 backdrop-blur">
            <span className="text-2xl font-bold font-display text-white">{events.length}</span>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Total Scheduled</p>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 backdrop-blur">
            <span className="text-2xl font-bold font-display text-cyan-400">
              {events.filter(e => !parseEventDate(e.event_date).isPast).length}
            </span>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Upcoming Sessions</p>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 backdrop-blur">
            <span className="text-2xl font-bold font-display text-blue-400">Hybrid &amp; Online</span>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Global Access</p>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 backdrop-blur">
            <span className="text-2xl font-bold font-display text-emerald-400">Instant RSVP</span>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">Seat Reservation</p>
          </div>
        </div>
      </section>

      {/* Main Events Directory */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 mb-10 backdrop-blur">
          {/* Time Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800/60 overflow-x-auto">
            <button
              type="button"
              onClick={() => setTimeFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                timeFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                timeFilter === 'upcoming'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming ({events.filter(e => !parseEventDate(e.event_date).isPast).length})
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('past')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                timeFilter === 'past'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Archives ({events.filter(e => parseEventDate(e.event_date).isPast).length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent mb-4" />
            <p className="text-xs font-mono text-slate-400">Loading scheduled conferences and forums...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center max-w-md mx-auto">
            <Calendar className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <h3 className="font-display font-bold text-white text-base">No Matching Events Found</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {searchQuery
                ? `No events match "${searchQuery}". Try a different keyword or reset filters.`
                : 'There are currently no events matching this filter category.'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs font-mono text-cyan-400 hover:bg-slate-700 cursor-pointer"
              >
                Reset Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => {
              const dateMeta = parseEventDate(event.event_date);
              const isPast = dateMeta.isPast;

              return (
                <div
                  key={event.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:border-cyan-500/40 hover:bg-slate-900/70 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-md shadow-black/30"
                >
                  {/* Banner / Media */}
                  <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-950 border-b border-slate-800/60">
                    <img
                      src={event.banner_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Date Badge */}
                    <div className="absolute top-2.5 left-2.5 rounded-xl border border-slate-700/60 bg-slate-950/90 backdrop-blur px-2 py-1.5 flex flex-col items-center min-w-[46px] shadow-lg">
                      <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider">{dateMeta.month}</span>
                      <span className="text-base font-black text-white leading-none mt-0.5">{dateMeta.day}</span>
                      {dateMeta.year && (
                        <span className="text-[8px] font-mono text-slate-400">{dateMeta.year}</span>
                      )}
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-2.5 right-2.5">
                      {isPast ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-slate-800/80 text-slate-400 border border-slate-700">
                          Past Event
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                          RSVP Open
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-2.5">
                      {/* Meta chips */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[130px]">{dateMeta.full}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="h-3 w-3 text-rose-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{event.venue || 'Hybrid Portal'}</span>
                        </div>
                      </div>

                      <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {event.title}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>

                      {/* Dynamic Form Tag Indicator */}
                      {event.form_fields && event.form_fields.length > 0 && (
                        <div className="pt-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-800/50 text-[10px] font-mono text-cyan-300">
                            <FileText className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
                            <span>Custom RSVP Form ({event.form_fields.length} dynamic field{event.form_fields.length === 1 ? '' : 's'})</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      {/* Quick Calendar Link */}
                      <a
                        href={getGoogleCalendarUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Add to Google Calendar"
                        className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-950/70 text-[10px] font-mono text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="h-3 w-3 text-cyan-400" />
                        <span>Google Cal</span>
                      </a>

                      {/* Primary Dynamic RSVP / Reserve a Seat Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEventForRsvp(event);
                          setRsvpPayload({ applicant_name: '', applicant_email: '', form_data: {} });
                          setFormErrors({});
                          setSuccessMessage(null);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                          isPast
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                            : 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20 hover:shadow-cyan-500/30'
                        }`}
                      >
                        <Ticket className="h-3 w-3" />
                        <span>{isPast ? 'Archive / RSVP' : 'Reserve a Seat'}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* RSVP Registration Modal - High-Craft, Responsive & Attractive */}
      <AnimatePresence>
        {selectedEventForRsvp && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 w-full max-w-lg sm:max-w-xl shadow-[0_25px_60px_-15px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[90vh] rounded-3xl"
            >
              {/* Vibrant Top Accent Line */}
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shrink-0" />

              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/80 relative shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        Seat Reservation Pass
                      </span>
                      {selectedEventForRsvp.form_fields?.length > 0 && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-850 px-2 py-0.5 rounded border border-slate-750">
                          {selectedEventForRsvp.form_fields.length} Custom Requirements
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-display font-bold text-white text-base sm:text-lg leading-snug">
                      {selectedEventForRsvp.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-mono text-slate-400">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                        <Calendar className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span>{parseEventDate(selectedEventForRsvp.event_date).full}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                        <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{selectedEventForRsvp.venue}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEventForRsvp(null)}
                    className="h-8 w-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 border border-slate-700/60"
                    aria-label="Close dialog"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {successMessage ? (
                  <div className="py-4 space-y-5 text-center animate-fade-in">
                    {/* Glowing Pass Certificate */}
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-display font-bold text-white text-lg sm:text-xl">
                        Seat Reserved Successfully!
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {successMessage}
                      </p>
                    </div>

                    {/* Digital Attendee Ticket Card */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 text-left space-y-3 relative overflow-hidden max-w-md mx-auto shadow-inner">
                      <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Attendee Digital Pass</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                          SEAT CONFIRMED
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Event</p>
                        <p className="text-xs sm:text-sm font-bold text-white line-clamp-1">{selectedEventForRsvp.title}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-mono">Attendee</p>
                          <p className="text-xs font-semibold text-slate-200 truncate">{rsvpPayload.applicant_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-mono">Date</p>
                          <p className="text-xs font-semibold text-slate-200 truncate">{parseEventDate(selectedEventForRsvp.event_date).full}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">Sent to: {rsvpPayload.applicant_email}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                      <a
                        href={getGoogleCalendarUrl(selectedEventForRsvp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Add to Calendar</span>
                      </a>
                      <button
                        onClick={() => setSelectedEventForRsvp(null)}
                        className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                      >
                        Done / Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    {/* Welcome Announcement */}
                    <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 to-blue-950/20 border border-cyan-500/20 rounded-2xl text-xs text-cyan-200/90 leading-relaxed flex items-start gap-2.5">
                      <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block text-xs">Reserve Your Spot for this Session</span>
                        <span className="text-slate-300 text-[11px]">
                          Complete your attendee profile below. Your digital pass and admission records will be automatically registered.
                        </span>
                      </div>
                    </div>

                    {formErrors.global && (
                      <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                        <span>{formErrors.global}</span>
                      </div>
                    )}

                    {/* Attendee Identity Fields */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1 font-semibold">
                          Attendee Full Name <span className="text-cyan-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={rsvpPayload.applicant_name}
                            onChange={(e) => setRsvpPayload({ ...rsvpPayload, applicant_name: e.target.value })}
                            placeholder="Your Full Name"
                            className="w-full text-xs bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          />
                        </div>
                        {formErrors.applicant_name && (
                          <span className="text-[10px] text-rose-400 mt-1 block font-mono">{formErrors.applicant_name}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1 font-semibold">
                          Work / Primary Email Address <span className="text-cyan-400">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="email"
                            required
                            value={rsvpPayload.applicant_email}
                            onChange={(e) => setRsvpPayload({ ...rsvpPayload, applicant_email: e.target.value })}
                            placeholder="you@company.com"
                            className="w-full text-xs bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                          Digital access badge and calendar confirmation will be sent to this email.
                        </span>
                        {formErrors.applicant_email && (
                          <span className="text-[10px] text-rose-400 mt-1 block font-mono">{formErrors.applicant_email}</span>
                        )}
                      </div>

                      {/* Attendee Optional Details (Phone & Organization) in responsive 2-column layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1 font-semibold">
                            Phone / WhatsApp <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
                          </label>
                          <div className="relative">
                            <Phone className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                              type="tel"
                              value={rsvpPayload.form_data['phone'] || ''}
                              onChange={(e) => setRsvpPayload(prev => ({
                                ...prev,
                                form_data: { ...prev.form_data, phone: e.target.value }
                              }))}
                              placeholder="e.g. +1 (555) 019-2834"
                              className="w-full text-xs bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-1 font-semibold">
                            Company / University <span className="text-slate-500 text-[10px] font-normal">(Optional)</span>
                          </label>
                          <div className="relative">
                            <Building2 className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                              type="text"
                              value={rsvpPayload.form_data['organization'] || ''}
                              onChange={(e) => setRsvpPayload(prev => ({
                                ...prev,
                                form_data: { ...prev.form_data, organization: e.target.value }
                              }))}
                              placeholder="e.g. Acme Corp or MIT"
                              className="w-full text-xs bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Custom Fields configured by Admin in Event Setup */}
                    {selectedEventForRsvp.form_fields && selectedEventForRsvp.form_fields.length > 0 && (
                      <div className="pt-3 border-t border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-cyan-400" />
                            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                              Event Organizer Requirements
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900/40">
                            {selectedEventForRsvp.form_fields.length} Field{selectedEventForRsvp.form_fields.length === 1 ? '' : 's'}
                          </span>
                        </div>

                        <div className="space-y-3 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-850">
                          {selectedEventForRsvp.form_fields.map((field: any) => (
                            <div key={field.id} className="space-y-1">
                              <DynamicFormField
                                field={field}
                                value={rsvpPayload.form_data[field.id]}
                                onChange={(val) => {
                                  setRsvpPayload(prev => ({
                                    ...prev,
                                    form_data: { ...prev.form_data, [field.id]: val }
                                  }));
                                }}
                                error={formErrors[field.id]}
                                uploading={uploadingFieldId === field.id}
                                onFileUpload={(e) => handleFileUpload(field.id, e)}
                                onRemoveFile={() => {
                                  setRsvpPayload(prev => {
                                    const nextFormData = { ...prev.form_data };
                                    delete nextFormData[field.id];
                                    return { ...prev, form_data: nextFormData };
                                  });
                                }}
                                darkTheme={true}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trust & Guarantee Note */}
                    <div className="pt-1 flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500 font-mono">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>Instant confirmation pass delivered directly to your inbox. No spam.</span>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedEventForRsvp(null)}
                        className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !!uploadingFieldId}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold font-mono uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25 transition-all"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Confirming...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm &amp; Reserve Seat</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
