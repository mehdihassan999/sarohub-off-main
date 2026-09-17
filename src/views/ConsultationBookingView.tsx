import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, Video, Phone, CheckCircle2, ShieldCheck, 
  ArrowRight, Sparkles, Globe, User, Mail, Building2, 
  DollarSign, Download, ExternalLink, MessageCircle, AlertCircle,
  Briefcase, ChevronRight, Lock, AlertTriangle, RefreshCw,
  Cpu, Layers, Smartphone, FileCode, Check, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/seo/Breadcrumbs';

interface ConsultationBookingViewProps {
  settings?: { [key: string]: string };
}

export default function ConsultationBookingView({ settings = {} }: ConsultationBookingViewProps) {
  const companyName = settings.company_name || 'SaroHub Technologies (Private) Limited';
  const companyEmail = 'mehdi.sarohub@gmail.com';
  const whatsappNumber = '+92 3430381473';
  const whatsappClean = '923430381473';

  // Helper for today's ISO date
  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // 90 days from today maximum
  const maxDateISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split('T')[0];
  }, []);

  // Initial date: tomorrow (skip Sunday)
  const initialDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Form State
  const [selectedType, setSelectedType] = useState('Discovery & Technical Feasibility (30 Min)');
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM PKT');
  const [isCustomTime, setIsCustomTime] = useState<boolean>(false);
  const [customHour, setCustomHour] = useState<string>('11');
  const [customMinute, setCustomMinute] = useState<string>('00');
  const [customPeriod, setCustomPeriod] = useState<string>('AM');
  const [platform, setPlatform] = useState<string>('Google Meet');
  const [userTimezone, setUserTimezone] = useState<string>('PKT (UTC+5)');
  
  // Client details (Placeholder Haider Ali)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [budget, setBudget] = useState('$5,000 - $15,000');
  const [timeline, setTimeline] = useState('Immediate (< 2 Weeks)');
  const [projectSummary, setProjectSummary] = useState('');
  const [ndaAgreed, setNdaAgreed] = useState(true);

  // Status & Slots
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [allSlots, setAllSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [googleCalUrl, setGoogleCalUrl] = useState<string>('');
  const [icsData, setIcsData] = useState<string>('');

  // Calendar week view offset (0 = current upcoming 7 days, 1 = week 2, etc.)
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Detect client local timezone
  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) {
        setUserTimezone(detected);
      }
    } catch {
      setUserTimezone('PKT (UTC+5)');
    }
  }, []);

  // Fetch slot availability whenever selectedDate changes
  useEffect(() => {
    let isMounted = true;
    setLoadingSlots(true);
    setSubmitError(null);

    fetch(`/api/consultations/availability?date=${encodeURIComponent(selectedDate)}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        const slots = data.allSlots || [
          '09:00 AM PKT', '10:00 AM PKT', '11:00 AM PKT', '12:00 PM PKT',
          '01:00 PM PKT', '02:00 PM PKT', '03:00 PM PKT', '04:00 PM PKT',
          '05:00 PM PKT', '06:00 PM PKT', '07:00 PM PKT', '08:00 PM PKT',
          '09:00 PM PKT', '10:00 PM PKT', '11:00 PM PKT', '11:30 PM PKT'
        ];
        const booked = data.bookedSlots || [];
        const avail = data.availableSlots || slots.filter((s: string) => !booked.includes(s));

        setAllSlots(slots);
        setBookedSlots(booked);
        setAvailableSlots(avail);

        // If current selected time is booked and not in custom mode, pick the first available
        if (!isCustomTime && booked.includes(selectedTime)) {
          if (avail.length > 0) {
            setSelectedTime(avail[0]);
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const defaults = [
          '09:00 AM PKT', '10:00 AM PKT', '11:00 AM PKT', '12:00 PM PKT',
          '01:00 PM PKT', '02:00 PM PKT', '03:00 PM PKT', '04:00 PM PKT',
          '05:00 PM PKT', '06:00 PM PKT', '07:00 PM PKT', '08:00 PM PKT',
          '09:00 PM PKT', '10:00 PM PKT', '11:00 PM PKT', '11:30 PM PKT'
        ];
        setAllSlots(defaults);
        setBookedSlots([]);
        setAvailableSlots(defaults);
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, isCustomTime]);

  // Handle custom time changes
  useEffect(() => {
    if (isCustomTime) {
      const formattedCustomTime = `${customHour.padStart(2, '0')}:${customMinute} ${customPeriod} PKT`;
      setSelectedTime(formattedCustomTime);
    }
  }, [isCustomTime, customHour, customMinute, customPeriod]);

  // Validation: Check if selected time falls in night hours (12:00 AM - 08:59 AM)
  const isNightHour = useMemo(() => {
    const timeUpper = selectedTime.toUpperCase().trim();
    return /^(12:[0-5][0-9]\s*AM|0?[1-8]:[0-5][0-9]\s*AM)/i.test(timeUpper);
  }, [selectedTime]);

  // Validation: Check if selected time is already booked
  const isSlotBooked = useMemo(() => {
    return bookedSlots.includes(selectedTime);
  }, [bookedSlots, selectedTime]);

  // Generate 28 upcoming business days
  const upcomingCalendarDays = useMemo(() => {
    const days: { 
      dateStr: string; 
      dayName: string; 
      fullDayName: string; 
      dayNum: number; 
      monthName: string; 
      year: number;
      isSunday: boolean;
      formattedFull: string;
      isToday: boolean;
      isTomorrow: boolean;
    }[] = [];

    const curr = new Date();
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    for (let i = 0; i < 35; i++) {
      const isSunday = curr.getDay() === 0;
      if (!isSunday) {
        const dateStr = curr.toISOString().split('T')[0];
        const dayName = curr.toLocaleDateString('en-US', { weekday: 'short' });
        const fullDayName = curr.toLocaleDateString('en-US', { weekday: 'long' });
        const monthName = curr.toLocaleDateString('en-US', { month: 'short' });
        const dayNum = curr.getDate();
        const year = curr.getFullYear();
        const formattedFull = curr.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });

        const isToday = curr.toDateString() === today.toDateString();
        const isTomorrow = curr.toDateString() === tomorrow.toDateString();

        days.push({
          dateStr,
          dayName,
          fullDayName,
          dayNum,
          monthName,
          year,
          isSunday: false,
          formattedFull,
          isToday,
          isTomorrow
        });
      }
      curr.setDate(curr.getDate() + 1);
    }
    return days;
  }, []);

  // Filter days by active week offset
  const displayedDays = useMemo(() => {
    const start = weekOffset * 6;
    return upcomingCalendarDays.slice(start, start + 6);
  }, [upcomingCalendarDays, weekOffset]);

  // Format currently selected date nicely
  const selectedDateFormatted = useMemo(() => {
    try {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }
      return selectedDate;
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  const consultationTracks = [
    {
      id: 'discovery',
      title: 'Discovery & Technical Feasibility (30 Min)',
      icon: Sparkles,
      duration: '30 Min Session',
      badge: 'Startups & New Products',
      accentColor: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-blue-500/40',
      iconColor: 'text-blue-400',
      deliverables: ['MVP Scoping & Roadmap', 'Tech Stack Feasibility', 'Preliminary Budget & Timeline']
    },
    {
      id: 'architecture',
      title: 'Architecture & Cloud Scoping (45 Min)',
      icon: Layers,
      duration: '45 Min Session',
      badge: 'Enterprise Architecture',
      accentColor: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/40',
      iconColor: 'text-cyan-400',
      deliverables: ['Multi-Tenant SaaS Topology', 'AWS/GCP Microservices Blueprint', 'High-Traffic Database Sharding']
    },
    {
      id: 'ai-agents',
      title: 'AI Agent & LLM Automation Strategy (45 Min)',
      icon: Cpu,
      duration: '45 Min Session',
      badge: 'Cognitive AI Systems',
      accentColor: 'from-indigo-500/20 to-cyan-500/10',
      borderColor: 'border-indigo-500/40',
      iconColor: 'text-indigo-400',
      deliverables: ['Custom LLM Agent Pipelines', 'Vector Embeddings & Enterprise RAG', 'Automated Workflow ROI Review']
    },
    {
      id: 'audit',
      title: 'Codebase Audit & Modernization (45 Min)',
      icon: ShieldCheck,
      duration: '45 Min Session',
      badge: 'Technical Due Diligence',
      accentColor: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/40',
      iconColor: 'text-emerald-400',
      deliverables: ['OWASP Security Review', 'Refactoring & Legacy Migration', 'Performance Bottleneck Remediation']
    }
  ];

  const currentTrackData = useMemo(() => {
    return consultationTracks.find(t => t.title === selectedType) || consultationTracks[0];
  }, [selectedType, consultationTracks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setSubmitError('Please provide your full name and work email address.');
      return;
    }

    if (isNightHour) {
      setSubmitError('Consultations cannot be scheduled between 12:00 Midnight and 09:00 AM (PKT). Please select an operational daytime or evening slot.');
      return;
    }

    if (isSlotBooked) {
      setSubmitError(`The selected time slot (${selectedTime} on ${selectedDateFormatted}) has already been reserved. Please select another slot or day.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: name.trim(),
          client_email: email.trim(),
          client_phone: phone.trim(),
          company_name: company.trim(),
          consultation_type: selectedType,
          meeting_platform: platform,
          scheduled_date: selectedDate,
          scheduled_time: selectedTime,
          timezone: userTimezone,
          project_summary: `[Timeline: ${timeline}] ${projectSummary.trim()}`,
          estimated_budget: budget
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reserve consultation slot.');
      }

      setConfirmedBooking(data.booking);
      setGoogleCalUrl(data.googleCalUrl || '');
      setIcsData(data.icsData || '');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong. Please try an alternate slot or message on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!icsData) return;
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `SaroHub-Consultation-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Daylight period grouping
  const morningSlots = allSlots.filter(s => s.includes('AM') && !s.startsWith('12:'));
  const afternoonSlots = allSlots.filter(s => (s.includes('PM') && (s.startsWith('12:') || s.startsWith('01:') || s.startsWith('02:') || s.startsWith('03:') || s.startsWith('04:'))));
  const eveningSlots = allSlots.filter(s => (s.includes('PM') && !afternoonSlots.includes(s)));

  const budgetTiers = [
    '<$5,000',
    '$5,000 - $15,000',
    '$15,000 - $35,000',
    '$35,000 - $75,000',
    '$75,000+'
  ];

  const timelineTiers = [
    'Immediate (< 2 Weeks)',
    '1 - 2 Months',
    '3 - 6 Months',
    'Exploratory / Feasibility'
  ];

  return (
    <div className="min-h-screen py-10 md:py-16 bg-slate-950 text-slate-100" style={{ backgroundColor: '#020617', color: '#f8fafc' }}>
      <SEOHead 
        title={`Direct Consultation Booking | ${companyName}`}
        description="Schedule a high-impact technical discovery consultation with SaroHub engineering leadership. Confidential discussion under mutual NDA."
        canonicalUrl="https://sarohub.com/book"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Book Consultation', path: '/book' }]} />

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/30 bg-blue-500/10 text-blue-400 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Access to Senior Solutions Architects
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Schedule a Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">Discovery Consultation</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Directly connect with engineering leadership. We analyze your technical requirements, cloud topology, deliverable milestones, and budget estimates under mutual NDA.
          </p>
        </div>

        {/* Interactive Progress Indicators */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          <div className="p-2.5 sm:p-3 rounded-xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-200 text-[11px] sm:text-xs truncate">Track</p>
              <p className="text-blue-400 text-[10px] sm:text-xs truncate">{currentTrackData.duration}</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-200 text-[11px] sm:text-xs truncate">Slot</p>
              <p className="text-emerald-400 text-[10px] sm:text-xs truncate">{selectedTime.replace(' PKT', '')}</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-200 text-[11px] sm:text-xs truncate">Platform</p>
              <p className="text-cyan-400 text-[10px] sm:text-xs truncate">{platform}</p>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-200 text-[11px] sm:text-xs truncate">Confidential</p>
              <p className="text-indigo-400 text-[10px] sm:text-xs truncate">Mutual NDA</p>
            </div>
          </div>
        </div>

        {/* Confirmation Screen or Form */}
        <AnimatePresence mode="wait">
          {confirmedBooking ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="max-w-2xl mx-auto rounded-3xl border border-emerald-500/40 bg-slate-900/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Discovery Session Confirmed & Dispatched
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-2">Technical Consultation Reserved!</h2>
                <p className="text-sm text-slate-400">
                  Confirmation and calendar invites have been dispatched to <strong className="text-slate-200">{confirmedBooking.client_email}</strong> and logged with SaroHub engineering leadership.
                </p>
              </div>

              {/* Notification Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3 mb-6">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Dual Automatic Sync Dispatched:</p>
                  <p className="text-emerald-300/90 mt-0.5">
                    An automated booking alert has been sent to company leadership at <strong className="text-white">mehdi.sarohub@gmail.com</strong> and logged in the SaroHub Admin Control Room.
                  </p>
                </div>
              </div>

              {/* Consultation Digital Boarding Pass */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 mb-8 space-y-3 text-xs relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Client Name</span>
                    <span className="font-bold text-sm text-white">{confirmedBooking.client_name} {confirmedBooking.company_name ? `(${confirmedBooking.company_name})` : ''}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-950 text-cyan-300 border border-blue-800 text-[10px] font-mono font-bold">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Date & Time</span>
                    <span className="font-bold text-emerald-400">{confirmedBooking.scheduled_date}</span>
                    <p className="text-slate-300">{confirmedBooking.scheduled_time}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Meeting Platform</span>
                    <span className="font-bold text-slate-200">{confirmedBooking.meeting_platform}</span>
                    <p className="text-slate-400">{confirmedBooking.timezone || 'PKT'}</p>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Direct Meeting Link</span>
                  <a 
                    href={confirmedBooking.meeting_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-cyan-400 hover:text-cyan-300 underline font-mono text-xs break-all"
                  >
                    {confirmedBooking.meeting_link}
                  </a>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="space-y-3">
                {/* 1-Click WhatsApp Direct Alert */}
                <a
                  href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(
                    `🚨 NEW CONSULTATION BOOKED ON SAROHUB.COM\n\n` +
                    `👤 Client: ${confirmedBooking.client_name}\n` +
                    `📧 Email: ${confirmedBooking.client_email}\n` +
                    `📱 Phone: ${confirmedBooking.client_phone || 'N/A'}\n` +
                    `🏢 Company: ${confirmedBooking.company_name || 'N/A'}\n` +
                    `📅 Date: ${confirmedBooking.scheduled_date}\n` +
                    `⏰ Time: ${confirmedBooking.scheduled_time}\n` +
                    `🎯 Track: ${confirmedBooking.consultation_type}\n` +
                    `💻 Platform: ${confirmedBooking.meeting_platform}\n` +
                    `🔗 Meeting URL: ${confirmedBooking.meeting_link}\n` +
                    `💰 Budget: ${confirmedBooking.estimated_budget}\n` +
                    `📝 Brief: ${confirmedBooking.project_summary || 'N/A'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 sm:px-6 rounded-xl border border-emerald-500/50 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm text-center transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="break-words">Direct WhatsApp Engineering Desk: {whatsappNumber}</span>
                </a>

                {googleCalUrl && (
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 sm:px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-lg shadow-blue-600/20 cursor-pointer text-center"
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Add to Google Calendar</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                )}

                {icsData && (
                  <button
                    onClick={handleDownloadIcs}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 sm:px-6 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-semibold text-xs transition-colors cursor-pointer text-center"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span className="truncate">Download iCal (.ics file)</span>
                  </button>
                )}

                <button
                  onClick={() => setConfirmedBooking(null)}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200 pt-2 transition-colors cursor-pointer"
                >
                  ← Book another consultation session or change options
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column: Interactive Steppers */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                
                {/* Step 1: Interactive Track Selection */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7 backdrop-blur-xl shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
                        1
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-white">Select Consultation Track</h2>
                    </div>
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Confidential Strategy Session</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
                    {consultationTracks.map((track) => {
                      const isSelected = selectedType === track.title;
                      const Icon = track.icon;

                      return (
                        <div
                          key={track.id}
                          onClick={() => setSelectedType(track.title)}
                          className={`p-3.5 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                            isSelected
                              ? 'border-blue-500 bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-slate-900/80 shadow-lg shadow-blue-500/15 ring-2 ring-blue-500/30'
                              : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 mb-2">
                            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-slate-800 text-slate-400'
                              }`}>
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className={`text-xs sm:text-sm font-bold break-words leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                  {track.title}
                                </h3>
                                <span className="text-[11px] text-cyan-400 font-semibold block mt-0.5">{track.duration}</span>
                              </div>
                            </div>

                            <span className="self-start sm:self-auto text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80 shrink-0">
                              {track.badge}
                            </span>
                          </div>

                          {/* Deliverables tags */}
                          <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="text-[10px] text-slate-400 font-semibold shrink-0">Includes:</span>
                            {track.deliverables.map((item, idx) => (
                              <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/50 text-slate-300 border border-slate-700/50 flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                <span>{item}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Interactive Date Selector */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-7 backdrop-blur-xl shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-blue-600/30">
                        2
                      </span>
                      <h2 className="text-lg font-bold text-white">Select Complete Date</h2>
                    </div>
                    
                    {/* Week Navigation Controls */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        type="button"
                        disabled={weekOffset === 0}
                        onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Previous Week"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-mono text-slate-400 px-2">
                        Week {weekOffset + 1}
                      </span>
                      <button
                        type="button"
                        disabled={weekOffset >= 3}
                        onClick={() => setWeekOffset(prev => Math.min(3, prev + 1))}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Next Week"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Active Selected Date Highlight Banner */}
                  <div className="mb-4 p-3.5 sm:p-4 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner min-w-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                        <Calendar className="w-5 h-5 shrink-0" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider truncate">Confirmed Scheduled Date:</div>
                        <div className="text-xs sm:text-base font-extrabold text-white break-words">{selectedDateFormatted}</div>
                      </div>
                    </div>

                    {/* Direct HTML5 Date Picker for Complete Custom Freedom */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <label className="text-xs text-slate-400 font-medium shrink-0">Pick Any Date:</label>
                      <input
                        type="date"
                        min={todayISO}
                        max={maxDateISO}
                        value={selectedDate}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedDate(e.target.value);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-0"
                      />
                    </div>
                  </div>

                  {/* Complete Day Cards Grid with interactive states */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
                    {displayedDays.map((day) => {
                      const isSelected = selectedDate === day.dateStr;
                      return (
                        <button
                          key={day.dateStr}
                          type="button"
                          onClick={() => setSelectedDate(day.dateStr)}
                          className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer relative min-w-0 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40 scale-[1.02]'
                              : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-900/60 text-slate-300'
                          }`}
                        >
                          {day.isTomorrow && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 text-[8px] font-bold uppercase tracking-wider whitespace-nowrap">
                              Tomorrow
                            </span>
                          )}
                          <span className={`text-[10px] font-bold uppercase tracking-wider truncate max-w-full ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {day.dayName}
                          </span>
                          <span className="text-base sm:text-lg font-extrabold my-0.5">
                            {day.dayNum}
                          </span>
                          <span className={`text-[10px] font-medium truncate max-w-full ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {day.monthName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Interactive Time Slots with Strict 9AM - 12 Midnight Rule */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7 backdrop-blur-xl shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
                        3
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-white">Select Time Window</h2>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setIsCustomTime(false)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          !isCustomTime 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Verified Slots
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCustomTime(true)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isCustomTime 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Custom Time
                      </button>
                    </div>
                  </div>

                  {/* Operational Rule Indicator */}
                  <div className="mb-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-start sm:items-center gap-2.5 min-w-0">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
                    <span className="break-words leading-relaxed text-[11px] sm:text-xs">
                      Engineering directors available: <strong className="text-white">09:00 AM – 12:00 Midnight PKT</strong>. Night hours (12:00 AM – 09:00 AM) are strictly blocked.
                    </span>
                  </div>

                  {/* Custom Time Selector Mode */}
                  {isCustomTime ? (
                    <div className="p-4 rounded-2xl border border-slate-700/80 bg-slate-950/80 space-y-3 sm:space-y-4 mb-4 min-w-0">
                      <div className="text-xs font-bold text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 min-w-0">
                        <span className="text-slate-300 text-[11px] sm:text-xs">Set Specific Consultation Time (PKT):</span>
                        <span className="text-cyan-400 font-mono text-xs sm:text-sm font-bold">{selectedTime}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Hour</label>
                          <select
                            value={customHour}
                            onChange={(e) => setCustomHour(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-0"
                          >
                            <option value="09">09 AM (Morning)</option>
                            <option value="10">10 AM (Morning)</option>
                            <option value="11">11 AM (Morning)</option>
                            <option value="12">12 PM (Noon)</option>
                            <option value="01">01 PM (Afternoon)</option>
                            <option value="02">02 PM (Afternoon)</option>
                            <option value="03">03 PM (Afternoon)</option>
                            <option value="04">04 PM (Afternoon)</option>
                            <option value="05">05 PM (Evening)</option>
                            <option value="06">06 PM (Evening)</option>
                            <option value="07">07 PM (Evening)</option>
                            <option value="08">08 PM (Night)</option>
                            <option value="09">09 PM (Night)</option>
                            <option value="10">10 PM (Night)</option>
                            <option value="11">11 PM (Late Night)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Minute</label>
                          <select
                            value={customMinute}
                            onChange={(e) => setCustomMinute(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-0"
                          >
                            <option value="00">:00</option>
                            <option value="15">:15</option>
                            <option value="30">:30</option>
                            <option value="45">:45</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Period</label>
                          <select
                            value={customPeriod}
                            onChange={(e) => setCustomPeriod(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-0"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Standard Verified Slots Grouped by Daylight Period */
                    <div>
                      {loadingSlots ? (
                        <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                          <span>Checking engineering calendar availability...</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Morning Group */}
                          <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <span>🌅 Morning Sessions (09:00 AM – 12:00 PM)</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {morningSlots.map((slotTime) => {
                                const isBooked = bookedSlots.includes(slotTime);
                                const isSelected = selectedTime === slotTime;
                                return (
                                  <button
                                    key={slotTime}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => setSelectedTime(slotTime)}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-between gap-1 min-w-0 transition-all cursor-pointer ${
                                      isBooked
                                        ? 'border-rose-900/30 bg-rose-950/10 text-rose-400/50 cursor-not-allowed line-through'
                                        : isSelected
                                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20 font-bold ring-2 ring-cyan-500/30'
                                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-200'
                                    }`}
                                  >
                                    <span className="truncate">{slotTime.replace(' PKT', '')}</span>
                                    {isBooked ? (
                                      <span className="text-[9px] text-rose-400 font-bold shrink-0">Booked</span>
                                    ) : isSelected ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                    ) : (
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Afternoon Group */}
                          <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <span>☀️ Afternoon Sessions (12:00 PM – 05:00 PM)</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {afternoonSlots.map((slotTime) => {
                                const isBooked = bookedSlots.includes(slotTime);
                                const isSelected = selectedTime === slotTime;
                                return (
                                  <button
                                    key={slotTime}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => setSelectedTime(slotTime)}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-between gap-1 min-w-0 transition-all cursor-pointer ${
                                      isBooked
                                        ? 'border-rose-900/30 bg-rose-950/10 text-rose-400/50 cursor-not-allowed line-through'
                                        : isSelected
                                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20 font-bold ring-2 ring-cyan-500/30'
                                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-200'
                                    }`}
                                  >
                                    <span className="truncate">{slotTime.replace(' PKT', '')}</span>
                                    {isBooked ? (
                                      <span className="text-[9px] text-rose-400 font-bold shrink-0">Booked</span>
                                    ) : isSelected ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                    ) : (
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Evening & Night Group */}
                          <div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <span>🌙 Evening & Night Sessions (05:00 PM – 12:00 Midnight)</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {eveningSlots.map((slotTime) => {
                                const isBooked = bookedSlots.includes(slotTime);
                                const isSelected = selectedTime === slotTime;
                                return (
                                  <button
                                    key={slotTime}
                                    type="button"
                                    disabled={isBooked}
                                    onClick={() => setSelectedTime(slotTime)}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center justify-between gap-1 min-w-0 transition-all cursor-pointer ${
                                      isBooked
                                        ? 'border-rose-900/30 bg-rose-950/10 text-rose-400/50 cursor-not-allowed line-through'
                                        : isSelected
                                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20 font-bold ring-2 ring-cyan-500/30'
                                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-200'
                                    }`}
                                  >
                                    <span className="truncate">{slotTime.replace(' PKT', '')}</span>
                                    {isBooked ? (
                                      <span className="text-[9px] text-rose-400 font-bold shrink-0">Booked</span>
                                    ) : isSelected ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                    ) : (
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Real-time Validation Alerts */}
                  {isNightHour && (
                    <div className="mt-4 p-3.5 rounded-2xl border border-rose-500/40 bg-rose-950/40 text-rose-300 text-xs flex items-start gap-2.5 min-w-0">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 break-words">
                        <strong className="block text-rose-200">You cannot book this time:</strong>
                        Consultations cannot be scheduled between 12:00 Midnight and 09:00 AM. Please select an operational daytime or evening slot.
                      </div>
                    </div>
                  )}

                  {isSlotBooked && (
                    <div className="mt-4 p-3.5 rounded-2xl border border-amber-500/40 bg-amber-950/40 text-amber-300 text-xs flex items-start gap-2.5 min-w-0">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 break-words">
                        <strong className="block text-amber-200">You cannot book this date or time:</strong>
                        The slot <span className="underline font-bold">{selectedTime}</span> on <span className="underline font-bold">{selectedDateFormatted}</span> has already been reserved by another client.
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 4: Meeting Platform Selection */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
                      4
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white">Choose Meeting Platform</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {[
                      { id: 'Google Meet', icon: Video, label: 'Google Meet', sub: 'Instant link' },
                      { id: 'Zoom', icon: Video, label: 'Zoom', sub: 'HD Video/Audio' },
                      { id: 'WhatsApp Call', icon: MessageCircle, label: 'WhatsApp', sub: 'Voice & Video' },
                      { id: 'Direct Phone', icon: Phone, label: 'Direct Phone', sub: 'Cellular' },
                    ].map((p) => {
                      const isSelected = platform === p.id;
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPlatform(p.id)}
                          className={`p-2.5 sm:p-3.5 rounded-2xl border text-center transition-all cursor-pointer min-w-0 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-600/15 text-blue-400 ring-2 ring-blue-500/30 shadow-md shadow-blue-500/20'
                              : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/40 text-slate-400'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mx-auto mb-1.5 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                          <p className="text-[11px] sm:text-xs font-bold text-slate-200 truncate">{p.label}</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">{p.sub}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Consultation Ticket & Project Form */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 backdrop-blur-xl sticky top-24 shadow-2xl">
                  
                  {/* Digital Boarding Pass Ticket Header */}
                  <div className="p-4 rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 mb-6 shadow-inner relative overflow-hidden min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider truncate">
                        SaroHub Consultation Pass
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        {currentTrackData.duration}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white break-words mb-1">
                      {selectedType}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-300 mt-2 font-mono">
                      <span className="text-emerald-400 font-bold">{selectedDate}</span>
                      <span>•</span>
                      <span className="text-cyan-300 font-bold">{selectedTime}</span>
                    </div>

                    <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-[10px] text-slate-400">
                      <span>Host: Senior Principal Engineer</span>
                      <span>Platform: {platform}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {submitError && (
                      <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2 min-w-0">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="break-words">{submitError}</span>
                      </div>
                    )}

                    {/* Client Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Your Full Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none shrink-0" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors min-w-0"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Work Email <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none shrink-0" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors min-w-0"
                        />
                      </div>
                    </div>

                    {/* Phone & Company in responsive 2-column or stacked layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 min-w-0">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Phone / WhatsApp
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none shrink-0" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+92 343 0381473"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors min-w-0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Company / Venture
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none shrink-0" />
                          <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="SaroHub Ecosystem"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950/80 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors min-w-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Interactive Budget Pills */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Target Budget Range
                      </label>
                      <div className="flex flex-wrap gap-1.5 min-w-0">
                        {budgetTiers.map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setBudget(tier)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                              budget === tier
                                ? 'bg-blue-600 text-white font-bold shadow-sm'
                                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {tier}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Chips */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Anticipated Launch Timeline
                      </label>
                      <div className="flex flex-wrap gap-1.5 min-w-0">
                        {timelineTiers.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTimeline(t)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                              timeline === t
                                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Project Brief */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-300">
                          Project Brief & Key Bottlenecks
                        </label>
                        <span className="text-[10px] text-slate-500 font-mono">{projectSummary.length} chars</span>
                      </div>
                      <textarea
                        rows={3}
                        value={projectSummary}
                        onChange={(e) => setProjectSummary(e.target.value)}
                        placeholder="Share a brief overview of your system requirements, current challenges, or goals..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950/80 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors min-w-0"
                      />
                    </div>

                    {/* Mutual NDA & Confidentiality Checkbox */}
                    <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex items-start gap-2.5 cursor-pointer min-w-0" onClick={() => setNdaAgreed(!ndaAgreed)}>
                      <input
                        type="checkbox"
                        checked={ndaAgreed}
                        onChange={(e) => setNdaAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer shrink-0"
                      />
                      <div className="text-[11px] text-slate-300 leading-tight select-none min-w-0 flex-1 break-words">
                        <span className="font-semibold text-white">Execute Mutual NDA First: </span>
                        I request all technical disclosures in this session be strictly protected under standard mutual non-disclosure.
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isNightHour || isSlotBooked}
                      className="w-full py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-0"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                          <span className="truncate">Reserving Technical Session...</span>
                        </>
                      ) : (
                        <>
                          <span className="truncate">Confirm & Reserve Consultation</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </>
                      )}
                    </button>

                    {/* Security footer text */}
                    <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 pt-1 min-w-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="break-words">Instant email confirmation to you & auto-alert to leadership desk</span>
                    </div>

                    <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                      Prefer manual email? Reach us directly at{' '}
                      <a href="mailto:info@sarohub.com" className="text-cyan-400 font-bold hover:underline">
                        info@sarohub.com
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
