/**
 * SaroHub Technologies (Private) Limited
 * Enterprise Portal & Corporate Website Application Core
 */

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
  Navigate
} from 'react-router-dom';
import {
  Cpu, Mail, Phone, MapPin, Send, MessageSquare, Plus, Edit, Trash2,
  LogOut, Key, Settings, Globe, Calendar, DollarSign, Award, Users,
  CheckCircle, Clock, ArrowRight, Search, FileText, Check, Lock, User,
  TrendingUp, Briefcase, Grid, Tag, Activity, Eye, BookOpen, AlertCircle, ChevronDown, X,
  Star, ChevronLeft, ChevronRight, Sparkles, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, getAuthToken, setAuthToken } from './api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TestimonialCarousel from './components/TestimonialCarousel';
import ChatWidget from './components/ChatWidget';
import ImageUploadField from './components/ImageUploadField';
import PublicOpportunitiesView from './components/opportunities/PublicOpportunitiesView';
import AdminOpportunitiesModule from './components/opportunities/AdminOpportunitiesModule';
import AdminPartnersModule from './components/admin/AdminPartnersModule';
import FieldSettingsEditor from './components/opportunities/FieldSettingsEditor';
import { FIELD_TYPES } from './components/opportunities/FormBuilderPresets';
import { OpportunityField } from './types';

// Modular Homepage Sections
import HeroSection from './components/home/HeroSection';
import CEOMessage from './components/home/CEOMessage';
import CompanyOverview from './components/home/CompanyOverview';
import CompanyStatistics from './components/home/CompanyStatistics';
import OurServices from './components/home/OurServices';
import WhyChooseUs from './components/home/WhyChooseUs';
import FeaturedProjects from './components/home/FeaturedProjects';
import StudentProjectsCarousel from './components/home/StudentProjectsCarousel';
import CompanyProducts from './components/home/CompanyProducts';
import ProjectsForSale from './components/home/ProjectsForSale';
import DevelopmentProcess from './components/home/DevelopmentProcess';
import TechnologiesWeUse from './components/home/TechnologiesWeUse';
import ClientTestimonials from './components/home/ClientTestimonials';
import LatestBlogs from './components/home/LatestBlogs';
import UpcomingEvents from './components/home/UpcomingEvents';
import EventApplicantsTable from './components/events/EventApplicantsTable';
import { UserCheck } from 'lucide-react';
import LeadershipTeam from './components/home/LeadershipTeam';
import FAQAccordion from './components/home/FAQAccordion';
import CallToAction from './components/home/CallToAction';
import NewsletterSubscription from './components/home/NewsletterSubscription';
import ContactPreview from './components/home/ContactPreview';
import PartnersCarousel from './components/home/PartnersCarousel';

// Venture System
import VentureSection from './components/ventures/VentureSection';
import VentureDetail from './components/ventures/VentureDetail';
import VentureBuildingProcess from './components/ventures/VentureBuildingProcess';
import BuildWithSaroHub from './components/ventures/BuildWithSaroHub';
import VentureAdmin from './components/ventures/VentureAdmin';

// =========================================================================
// MAIN APP COMPONENT
// =========================================================================

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!getAuthToken());
  const [globalSettings, setGlobalSettings] = useState<{ [key: string]: string }>({
    company_name: 'SaroHub Technologies (Private) Limited',
    office_address: 'Roshan Electric Store Building 3rd Floor, Skardu, Gilgit-Baltistan, Pakistan',
    email: 'info@sarohub.com',
    phone: '+92 355 58668 75',
    whatsapp: '+92 355 58668 75',
    business_hours: 'Monday - Saturday: 9:00 AM - 6:00 PM (PKT)'
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sarohub-theme') || 'theme-obsidian';
  });

  useEffect(() => {
    api.getSettings().then(setGlobalSettings).catch(console.error);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className={`flex min-h-screen flex-col font-sans antialiased selection:bg-blue-600/10 selection:text-blue-900 relative ${theme}`}>
        {/* Navigation Bar */}
        <Navbar isAdminLoggedIn={isAdminLoggedIn} />

        {/* Core Layout Pages */}
        <main className="flex-1 relative z-10 overflow-x-hidden">
          {/* Ambient Background Mesh */}
          <div className="pointer-events-none absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-blue-500/5 rounded-full blur-[120px] z-0"></div>
          <div className="pointer-events-none absolute bottom-0 right-[-10%] w-[60vw] h-[60vh] bg-indigo-500/5 rounded-full blur-[150px] z-0"></div>
          <div className="pointer-events-none absolute top-[20%] right-[10%] w-[30vw] h-[30vh] bg-slate-300/10 rounded-full blur-[100px] z-0"></div>

          <Routes>
            <Route path="/" element={<HomeView settings={globalSettings} />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/services" element={<ServicesView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/student-projects" element={<StudentProjectsView />} />
            <Route path="/ventures" element={<VenturesView />} />
            <Route path="/products" element={<VenturesView />} />
            <Route path="/marketplace" element={<MarketplaceView />} />
            <Route path="/blog" element={<BlogView />} />
            <Route path="/events" element={<EventsView />} />
            <Route path="/careers" element={<CareersView />} />
            <Route path="/opportunities" element={<PublicOpportunitiesView />} />
            <Route path="/contact" element={<ContactView settings={globalSettings} />} />

            {/* Venture Detail Pages */}
            <Route path="/ventures/:slug" element={<VentureDetail />} />

            {/* Policies */}
            <Route path="/privacy-policy" element={<PolicyView title="Privacy Policy" />} />
            <Route path="/terms" element={<PolicyView title="Terms & Conditions" />} />
            <Route path="/cookie-policy" element={<PolicyView title="Cookie Policy" />} />

            {/* Portal Authentication & Hidden Panels */}
            <Route path="/admin" element={<PortalLoginView onLoginSuccess={() => setIsAdminLoggedIn(true)} />} />
            <Route path="/portal-login" element={<Navigate to="/admin" replace />} />
            <Route
              path="/control-room"
              element={
                isAdminLoggedIn ? (
                  <ControlRoomView
                    onLogout={() => {
                      api.logout();
                      setIsAdminLoggedIn(false);
                    }}
                    onSettingsChange={setGlobalSettings}
                  />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            {/* Venture Admin */}
            <Route
              path="/admin/ventures"
              element={
                isAdminLoggedIn ? (
                  <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
                    <div className="max-w-5xl mx-auto py-16">
                      <VentureAdmin />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
          </Routes>
        </main>

        {/* Corporate Footer */}
        <Footer settings={globalSettings} />

        {/* Global floating live chat portal widget */}
        <ChatWidget />


      </div>
    </Router>
  );
}

// =========================================================================
// 1. PUBLIC VIEW COMPONENTS
// =========================================================================

// --- HOME VIEW ---
function HomeView({ settings }: { settings: { [key: string]: string } }) {
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [saleProjects, setSaleProjects] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error);
    api.getProjects().then(setProjects).catch(console.error);
    api.getProducts().then(setProducts).catch(console.error);
    api.getTeam().then(setTeam).catch(console.error);
    api.getBlogs().then(setBlogs).catch(console.error);
    api.getSaleProjects().then(setSaleProjects).catch(console.error);
    api.getEvents().then(setEvents).catch(console.error);

    const onDataUpdated = () => {
      api.getProjects().then(setProjects).catch(console.error);
      api.getProducts().then(setProducts).catch(console.error);
      api.getSaleProjects().then(setSaleProjects).catch(console.error);
      api.getEvents().then(setEvents).catch(console.error);
      api.getBlogs().then(setBlogs).catch(console.error);
      api.getServices().then(setServices).catch(console.error);
      api.getTeam().then(setTeam).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  useEffect(() => {
    console.debug('[HOME] projects loaded:', projects.length);
  }, [projects]);

  return (
    <div className="relative">
      <HeroSection settings={settings} />
      <CompanyOverview settings={settings} />
      <CEOMessage settings={settings} />
      <OurServices services={services} />
      <VentureSection />
      <FeaturedProjects projects={projects} />
      <ProjectsForSale saleProjects={saleProjects} />
      <LatestBlogs blogs={blogs} />
      <UpcomingEvents events={events} />
      <LeadershipTeam team={team} />
      <BuildWithSaroHub />
      <PartnersCarousel />
      <ContactPreview settings={settings} />
    </div>
  );
}


// --- ABOUT VIEW ---
function AboutView() {
  const [stats, setStats] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [aboutSettings, setAboutSettings] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
    api.getTeam().then(setTeam).catch(console.error);
    api.getTestimonials().then(setTestimonials).catch(console.error);
    api.getFAQs().then(setFaqs).catch(console.error);
    api.getSettings().then(setAboutSettings).catch(console.error);
  }, []);

  return (
    <div className="relative">
      <div className="py-16 border-b text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            Corporate Overview
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
            About SaroHub Technologies
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Architecting enterprise software solutions, transactional database infrastructures, and cognitive technology platforms globally.
          </p>
        </div>
      </div>
      <CompanyOverview settings={aboutSettings} />
      <WhyChooseUs settings={aboutSettings} />
      <CompanyStatistics apiStats={stats} />
      <CEOMessage settings={aboutSettings} />
      <LeadershipTeam team={team} />
      <ClientTestimonials testimonials={testimonials} />
      <FAQAccordion faqs={faqs} />
    </div>
  );
}

// --- SERVICES VIEW ---
function ServicesView() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error);

    const onDataUpdated = () => {
      api.getServices().then(setServices).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  return (
    <div className="relative">
      <div className="py-16 border-b text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-app)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            Capabilities & Verticals
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
            Enterprise Software Engineering
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Full-stack software engineering, bespoke cloud architecture, SaaS development, and cognitive AI model deployment.
          </p>
        </div>
      </div>
      <OurServices services={services} />
      <DevelopmentProcess />
      <TechnologiesWeUse />
      <WhyChooseUs />
      <CallToAction />
    </div>
  );
}

// --- CLIENT PROJECTS VIEW ---
function ProjectsView() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    const onDataUpdated = () => {
      api.getProjects().then(setProjects).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg-app)' }}>
      <FeaturedProjects projects={projects} />
    </div>
  );
}

// --- IT ACADEMY STUDENT PROJECTS VIEW ---
function StudentProjectsView() {
  const [studentProjects, setStudentProjects] = useState<any[]>([]);

  useEffect(() => {
    api.getStudentProjects().then(setStudentProjects).catch(console.error);

    const onDataUpdated = () => {
      api.getStudentProjects().then(setStudentProjects).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--bg-app)' }}>
      <StudentProjectsCarousel studentProjects={studentProjects} />
    </div>
  );
}

// --- OUR VENTURES & PRODUCTS VIEW ---
function VenturesView() {
  return (
    <div className="relative">
      <VentureSection />
      <VentureBuildingProcess />
      <BuildWithSaroHub />
    </div>
  );
}

// --- MARKETPLACE VIEW ---
function MarketplaceView() {
  const [saleProjects, setSaleProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showInquiryModal, setShowInquiryModal] = useState<any | null>(null);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    api.getSaleProjects().then(setSaleProjects).catch(console.error);
    api.getSettings().then(setSettings).catch(console.error);

    const onDataUpdated = () => {
      api.getSaleProjects().then(setSaleProjects).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  const derivedCategories = React.useMemo(() => {
    const cats = saleProjects.flatMap((p) => {
      if (!p) return [];
      const tech = Array.isArray(p.technology) ? p.technology : (p.technology ? String(p.technology).split(/[,|•]/) : []);
      return tech.map((t: any) => String(t).trim()).filter(Boolean);
    });
    return ['All', ...Array.from(new Set(cats))];
  }, [saleProjects]);

  const filteredSaleProjects = React.useMemo(() => {
    if (activeTab === 'All') return saleProjects;
    return saleProjects.filter(p => {
      if (!p) return false;
      const tech = Array.isArray(p.technology)
        ? p.technology.map((t: any) => String(t).trim())
        : String(p.technology || '').split(/[,|•]/).map(s => s.trim());
      return tech.includes(activeTab);
    });
  }, [saleProjects, activeTab]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitContactForm({
        name: inquiryForm.name,
        email: inquiryForm.email,
        subject: 'Marketplace Inquiry: ' + (showInquiryModal?.title || 'Software Template'),
        message: inquiryForm.message
      });
      setSuccessMsg('Thank you! Your inquiry message has been successfully sent to info@sarohub.com. We will contact you at ' + inquiryForm.email + ' shortly.');
      setInquiryForm({ name: '', email: '', message: '' });
      setTimeout(() => {
        setShowInquiryModal(null);
        setSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      setSuccessMsg('❌ Failed to send inquiry. Please try again or contact us directly at info@sarohub.com');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : '';
  };

  const parseScreenshots = (screenshots: any): string[] => {
    if (!screenshots) return [];
    if (Array.isArray(screenshots)) return screenshots.filter(Boolean);
    if (typeof screenshots === 'string') {
      return screenshots.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  return (
    <div className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/50 mb-4">
          <Tag className="h-3 w-3" /> Ready Templates
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900">Commercial Software Templates</h1>
        <p className="mt-4 text-sm text-slate-600 max-w-2xl">
          Purchase fully developed, production-ready source code templates. All items come with modular structures, database setups, and 12-month technical SLA support.
        </p>

        <p className="mt-2 text-xs text-slate-500">Showing <strong>{filteredSaleProjects.length}</strong> {filteredSaleProjects.length === 1 ? 'template' : 'templates'}</p>

        {/* Tab filters */}
        {derivedCategories.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-200 pb-6">
            {derivedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`rounded-lg px-4 py-2 text-xs font-mono font-semibold transition-all cursor-pointer ${activeTab === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {filteredSaleProjects.length === 0 ? (
          <div className="mt-12 bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 font-medium">
            No commercial templates found for the selected filter.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredSaleProjects.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="h-48 overflow-hidden relative bg-slate-100">
                    <img src={item.thumbnail_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <span className="absolute top-4 right-4 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold font-mono text-white shadow-sm">
                      {item.price ? `$${item.price}` : 'Inquire'}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">{item.short_description}</p>

                    {/* Features */}
                    <div className="mt-4 space-y-2">
                      {Array.isArray(item.features) ? item.features.slice(0, 3).map((f: string, i: number) => (
                        <div key={i} className="flex gap-2 text-xs text-slate-600">
                          <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      )) : null}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-6 border-t border-slate-100 flex gap-4 justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400 font-medium truncate">Tech: {Array.isArray(item.technology) ? item.technology.join(', ') : 'React/Node'}</span>
                  <button
                    onClick={() => setShowInquiryModal(item)}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all shadow-md hover:shadow-cyan-500/20 cursor-pointer font-mono"
                  >
                    View Details & Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inquiry Modal */}
        <AnimatePresence>
          {showInquiryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto" onClick={() => setShowInquiryModal(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl my-3 sm:my-8 max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] overflow-hidden flex flex-col relative"
              >
                <div className="flex justify-between items-start mb-6 border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1.5 uppercase">
                      Commercial Software Solution
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">{showInquiryModal.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
                        USD {showInquiryModal.price ? `$${showInquiryModal.price}` : 'Pricing Upon Request'}
                      </span>
                      {Array.isArray(showInquiryModal.technology) && showInquiryModal.technology.map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] font-semibold bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowInquiryModal(null)}
                    aria-label="Close product inquiry"
                    className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="min-h-0 overflow-y-auto pr-1 sm:pr-2 space-y-6">
                  {/* VIDEO SHOWCASE */}
                  {showInquiryModal.video_url && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Product Demo Video:</h4>
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner">
                        {getYoutubeEmbedUrl(showInquiryModal.video_url) ? (
                          <iframe
                            src={getYoutubeEmbedUrl(showInquiryModal.video_url)}
                            title="Product Demo"
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950">
                            <Globe className="h-8 w-8 text-cyan-400 mb-2 animate-pulse" />
                            <p className="text-[11px] text-slate-400">External demo presentation link:</p>
                            <a
                              href={showInquiryModal.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-colors"
                            >
                              Launch Presentation <ArrowRight className="h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* IMAGES & SCREENSHOTS */}
                  {parseScreenshots(showInquiryModal.screenshots).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Product Screenshots:</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {parseScreenshots(showInquiryModal.screenshots).map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative h-24 rounded-xl overflow-hidden border border-slate-800 group bg-slate-900">
                            <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DESCRIPTION & FEATURES */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Product Capability Overview:</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                      {showInquiryModal.description || showInquiryModal.short_description}
                    </p>

                    {Array.isArray(showInquiryModal.features) && showInquiryModal.features.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {showInquiryModal.features.map((feat: string, i: number) => (
                          <div key={i} className="flex gap-2 items-start text-xs text-slate-300">
                            <CheckCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CONTACT & BUY OPTIONS */}
                  <div className="border-t border-slate-800 pt-6 space-y-4">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">Procurement & Licensing Channels:</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Email inquiry card */}
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('info@sarohub.com')}&su=${encodeURIComponent('Inquiry: Procurement of Software Product - ' + showInquiryModal.title)}&body=${encodeURIComponent('Hello SaroHub, I am interested in procuring a license for the "' + showInquiryModal.title + '" corporate software product.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 transition-all group"
                      >
                        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">Email</span>
                          <span className="block text-xs font-bold text-white group-hover:text-blue-300 truncate">info@sarohub.com</span>
                        </div>
                      </a>

                      {/* WhatsApp 1 */}
                      <a
                        href={`https://wa.me/923430381473?text=${encodeURIComponent('Hello SaroHub! I am interested in the "' + showInquiryModal.title + '" software product. Please share more details.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all group"
                      >
                        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">WhatsApp</span>
                          <span className="block text-xs font-bold text-white group-hover:text-emerald-300">0343 0381473</span>
                        </div>
                      </a>

                      {/* WhatsApp 2 */}
                      <a
                        href={`https://wa.me/923555866875?text=${encodeURIComponent('Hello SaroHub! I am interested in the "' + showInquiryModal.title + '" software product. Please share more details.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all group"
                      >
                        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">WhatsApp</span>
                          <span className="block text-xs font-bold text-white group-hover:text-emerald-300">0355 5866875</span>
                        </div>
                      </a>
                    </div>

                    {/* MESSAGE INBOX BOX */}
                    <div className="bg-slate-900/70 rounded-2xl p-5 border border-slate-800 mt-4">
                      <span className="block text-xs font-mono text-slate-400 uppercase mb-3">Leave an instant inquiry message:</span>
                      {successMsg ? (
                        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-emerald-400 font-medium">
                          {successMsg}
                        </div>
                      ) : (
                        <form onSubmit={handleInquirySubmit} className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              required
                              placeholder="Your Name"
                              value={inquiryForm.name}
                              onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                            <input
                              type="email"
                              required
                              placeholder="Corporate Email"
                              value={inquiryForm.email}
                              onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                          </div>
                          <textarea
                            required
                            rows={2}
                            placeholder="Please specify customization or licensing requirements..."
                            value={inquiryForm.message}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                          />
                          <button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-md cursor-pointer"
                          >
                            Send Procurement Inquiry
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// --- BLOG VIEW (CMS) ---
function BlogView() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [activePost, setActivePost] = useState<any | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loadBlogs = () => {
      Promise.all([
        api.getBlogs(),
        api.getBlogCategories(),
        api.getBlogTags()
      ]).then(([blogsData, catsData, tagsData]) => {
        setBlogs(blogsData || []);
        setCategories(catsData || []);
        setTags(tagsData || []);

        const postId = searchParams.get('id') || searchParams.get('post');
        if (postId && Array.isArray(blogsData)) {
          const found = blogsData.find((b: any) => String(b.id) === String(postId));
          if (found) setActivePost(found);
        }
      }).catch(console.error);
    };

    loadBlogs();

    window.addEventListener('sarohub-data-updated', loadBlogs);
    return () => window.removeEventListener('sarohub-data-updated', loadBlogs);
  }, []);

  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePost]);

  const openPost = (item: any) => {
    setActivePost(item);
    setSearchParams({ id: String(item.id) });
  };

  const closePost = () => {
    setActivePost(null);
    setSearchParams({});
  };

  const filteredBlogs = blogs.filter(b => {
    const matchSearch = (b.title || '').toLowerCase().includes(search.toLowerCase()) || (b.content || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === null || b.category_id === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">

        <div className="flex flex-col lg:flex-row gap-12 justify-between items-start">
          <div className="w-full lg:w-3/4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/50 mb-4">
              <BookOpen className="h-3 w-3" /> Technical Hub
            </span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900">Engineering Bulletins</h1>
            <p className="mt-4 text-sm text-slate-600 mb-12 max-w-2xl">
              Technical articles, relational database indices walkthroughs, and secure deployment blueprints compiled by our research teams.
            </p>

            {/* Blogs List */}
            <div className="space-y-8">
              {filteredBlogs.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 font-medium">
                  No blog articles found matching your criteria.
                </div>
              ) : (
                filteredBlogs.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openPost(item)}
                    className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-full md:w-2/5 h-64 overflow-hidden relative bg-slate-100 shrink-0">
                      <img src={item.featured_image_url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                    <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex gap-4 items-center text-xs text-slate-400">
                          <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[10px] text-blue-700 font-mono font-bold">
                            {categories.find(c => c.id === item.category_id)?.name || 'Technical'}
                          </span>
                          <span>{item.reading_time || '5 min read'}</span>
                          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</span>
                        </div>
                        <h3 className="mt-4 font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">{item.content ? item.content.replace(/[#*`_]/g, '') : ''}</p>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img src={item.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'} alt={item.author_name} className="h-8 w-8 rounded-full object-cover bg-slate-100" referrerPolicy="no-referrer" />
                          <span className="text-xs text-slate-700 font-semibold">{item.author_name || 'SaroHub Team'}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPost(item);
                          }}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Read Article <BookOpen className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/4 space-y-8 lg:sticky lg:top-24">
            {/* Search */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-bold">Search Bulletin</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Query syntax..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 pr-10 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
                <Search className="absolute right-3 top-3 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 font-bold">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCat(null)}
                  className={`block w-full text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors ${selectedCat === null ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  All Research Areas
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className={`block w-full text-left text-xs px-3 py-2 rounded-lg font-medium transition-colors ${selectedCat === c.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Blog Post Overlay */}
        <AnimatePresence>
          {activePost && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden"
              onClick={closePost}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl h-[calc(100dvh-3rem)] max-h-[calc(100dvh-3rem)] sm:h-[78vh] sm:max-h-[78vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Fixed Top Modal Header with Guaranteed Visible Close Button */}
                <div className="relative z-50 flex items-center gap-2 px-4 pr-16 py-3 bg-white border-b border-slate-200 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">Engineering Article</span>
                  </div>
                  <button
                    onClick={closePost}
                    aria-label="Close article modal"
                    className="absolute top-2 right-3 z-[60] h-10 w-10 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-sm transition-all hover:scale-105 cursor-pointer flex items-center justify-center"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Scrollable Modal Content Container */}
                <div className="overflow-y-auto overscroll-contain flex-1 min-h-0">
                  {/* Hero / Banner Image */}
                  <div className="h-40 sm:h-64 md:h-72 overflow-hidden relative bg-slate-100">
                    <img
                      src={activePost.featured_image_url || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800&h=450'}
                      alt={activePost.title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                  </div>

                  {/* Article Detail Body */}
                  <div className="p-4 pb-8 sm:p-6 sm:pb-10 md:p-8 md:pb-12">
                    <div className="flex flex-wrap gap-2.5 items-center text-xs text-slate-500">
                      <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[10px] text-blue-700 font-mono font-bold">
                        {categories.find(c => c.id === activePost.category_id)?.name || 'Technical'}
                      </span>
                      <span>{activePost.reading_time || '5 min read'}</span>
                      <span>&bull;</span>
                      <span>{activePost.created_at ? new Date(activePost.created_at).toLocaleDateString() : ''}</span>
                    </div>

                    <h2 className="mt-4 font-display text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                      {activePost.title}
                    </h2>

                    {/* Author detail */}
                    <div className="mt-5 flex items-center gap-3 border-b border-slate-100 pb-5">
                      <img
                        src={activePost.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'}
                        alt={activePost.author_name}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover bg-slate-100 border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">{activePost.author_name || 'SaroHub Team'}</h5>
                        <span className="text-[10px] font-mono text-slate-400 font-medium">Research & Development Lead</span>
                      </div>
                    </div>

                    <div className="mt-6 text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
                      {activePost.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// --- EVENTS VIEW ---
function EventsView() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    api.getEvents().then(setEvents).catch(console.error);

    const onDataUpdated = () => {
      api.getEvents().then(setEvents).catch(console.error);
    };
    window.addEventListener('sarohub-data-updated', onDataUpdated);
    return () => window.removeEventListener('sarohub-data-updated', onDataUpdated);
  }, []);

  return (
    <div className="relative pt-6">
      <UpcomingEvents events={events} />
    </div>
  );
}

// --- CAREERS VIEW ---
function CareersView() {
  const [careers, setCareers] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '', cvUrl: '', coverLetter: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.getCareers().then(setCareers).catch(console.error);
  }, []);

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvError('');
    const file = e.target.files?.[0];
    if (!file) { setCvFile(null); return; }
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      setCvError('Only PDF and Word documents (.pdf, .doc, .docx) are accepted.');
      setCvFile(null);
      e.target.value = '';
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setCvError('File size must be under 5MB. Please upload a smaller file.');
      setCvFile(null);
      e.target.value = '';
      return;
    }
    setCvFile(file);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setCvError('Please upload your CV/Resume (PDF or Word format).');
      return;
    }
    try {
      let uploadedCvUrl = '';
      try {
        const uploadRes = await api.uploadCv(cvFile);
        uploadedCvUrl = uploadRes.url;
      } catch (uploadErr) {
        // Fallback to base64 encoding if direct upload encounters an error
        const reader = new FileReader();
        uploadedCvUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(cvFile);
        });
      }

      await api.submitApplication({
        career_id: activeJob.id,
        full_name: applyForm.name,
        email: applyForm.email,
        phone: applyForm.phone,
        resume_url: uploadedCvUrl,
        resume_filename: cvFile.name,
        cover_letter: applyForm.coverLetter
      });
      setSuccess('Application submitted successfully! Our talent acquisition team will review your profile and get back to you shortly.');
      setApplyForm({ name: '', email: '', phone: '', cvUrl: '', coverLetter: '' });
      setCvFile(null);
      setTimeout(() => {
        setActiveJob(null);
        setSuccess('');
      }, 4000);
    } catch (err: any) {
      alert(err.message || 'Submission failed.');
    }
  };

  return (
    <div className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/50 mb-4">
          <Briefcase className="h-3 w-3" /> Careers
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900">Build the Future With Us</h1>
        <p className="mt-4 text-sm text-slate-600 max-w-2xl mb-12">
          Join SaroHub Technologies to build next-generation enterprise software, AI-driven solutions, and digital infrastructures that power businesses worldwide. We're looking for passionate individuals ready to make an impact.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {careers.map((job) => (
            <div key={job.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              {job.banner_url && (
                <div className="w-full h-44 overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img src={job.banner_url} alt={job.position} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-8">
                <span className="font-mono text-xs text-blue-600 font-bold">{job.department} &bull; {job.experience}</span>
                <h3 className="mt-2 font-display text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.position}</h3>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed line-clamp-3">{job.description}</p>
                <div className="mt-6 flex flex-wrap gap-1">
                  {Array.isArray(job.skills) ? job.skills.map((s: string, idx: number) => (
                    <span key={idx} className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-[10px] font-mono text-slate-600">{s}</span>
                  )) : null}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setActiveJob(job)}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white cursor-pointer shadow-sm transition-colors"
                  >
                    Apply Vacancy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Apply Modal */}
        <AnimatePresence>
          {activeJob && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white rounded-2xl p-8 border border-slate-200 shadow-xl"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">Applying: {activeJob.position}</h3>
                    <p className="text-xs text-slate-500 mt-1">{activeJob.department} | Requirement: {activeJob.experience}</p>
                  </div>
                  <button onClick={() => setActiveJob(null)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {success ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-800 leading-relaxed font-medium mt-4">
                    {success}
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={applyForm.name}
                          onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                          className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Phone Number</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter phone number"
                          value={applyForm.phone}
                          onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                          className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Upload CV / Resume <span className="text-slate-400">(PDF or Word, max 5MB)</span></label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleCvFileChange}
                          className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        {cvFile && (
                          <p className="mt-1.5 text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <Check className="h-3 w-3" /> {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                        {cvError && (
                          <p className="mt-1.5 text-xs text-rose-600 font-medium">{cvError}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Cover Letter Summary</label>
                      <textarea
                        rows={3}
                        value={applyForm.coverLetter}
                        onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                        className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setActiveJob(null)}
                        className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-sm"
                      >
                        File Application
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- CONTACT VIEW ---
function ContactView({ settings }: { settings: { [key: string]: string } }) {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const subjectParam = searchParams.get('subject');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: serviceParam ? `Consultation: ${serviceParam}` : (subjectParam || ''),
    message: serviceParam ? `Hello, I would like to consult with your engineering team regarding ${serviceParam}.` : ''
  });
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (serviceParam) {
      setForm(prev => ({
        ...prev,
        subject: `Consultation: ${serviceParam}`,
        message: prev.message || `Hello, I would like to consult with your engineering team regarding ${serviceParam}.`
      }));
    }
  }, [serviceParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.submitContactForm(form);
      setMsg({ type: 'success', text: 'Thank you! Your corporate query has been logged securely in our system database. An expert will reach out to you.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Submission failed.' });
    }
  };

  return (
    <div className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Details */}
          <div>
            <span className="font-mono text-xs text-blue-600 uppercase font-bold tracking-wider">Operational Center</span>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Contact Our Experts</h1>
            <p className="mt-6 text-sm text-slate-600 leading-relaxed">
              We operate standard communications desks out of our World Trade Center headquarters complex. Use our query form or connect directly via phone/WhatsApp.
            </p>

            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Corporate Registry Location</h4>
                  <p className="text-xs text-slate-500 mt-1">{settings.office_address}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Engineering Helpdesk Desk</h4>
                  <p className="text-xs text-slate-500 mt-1">{settings.email}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Operations Registry Phone</h4>
                  <p className="text-xs text-slate-500 mt-1">{settings.phone}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Standard Business Hours</h4>
                  <p className="text-xs text-slate-500 mt-1">{settings.business_hours}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm">
            <h3 className="font-display text-xl font-bold text-slate-900 mb-6">Dispatch Corporate Query</h3>

            {msg && (
              <div className={`mb-6 p-4 rounded-xl border text-xs leading-relaxed font-medium ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Contact Phone (Optional)</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Topic Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Detailed Inquiry Specification</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-3 text-sm font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Log Query Payload <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- STANDARD POLICY VIEW ---
function PolicyView({ title }: { title: string }) {
  return (
    <div className="py-24 bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-sm">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 mb-8">{title}</h1>
        <div className="text-slate-600 leading-relaxed space-y-6 text-sm">
          <p>
            Operating as an official software institution (SaroHub Technologies (Private) Limited), we enforce security headers and isolated virtual private networks to maintain user protection.
          </p>
          <h3 className="font-display font-bold text-slate-900 text-base mt-8">1. Database Security Protocol</h3>
          <p>
            All application credentials, emails, and phone logs registered through our site are parsed securely utilizing parameterized SQL configurations to completely prevent SQL injection vectors.
          </p>
          <h3 className="font-display font-bold text-slate-900 text-base mt-8">2. Operational SLA Warranties</h3>
          <p>
            Systems, purchase queries, and client data arrays are maintained on continuous replication disks to prevent transaction loss.
          </p>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 2. ADMIN PANEL / CONTROL ROOM VIEWS
// =========================================================================

// --- LOGIN VIEW ---
interface PortalLoginProps {
  onLoginSuccess: () => void;
}

function PortalLoginView({ onLoginSuccess }: PortalLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password States
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login(username, password);
      onLoginSuccess();
      navigate('/control-room');
    } catch (err: any) {
      setError(err.message || 'Access Denied. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);
    try {
      const response = await api.forgotPassword(forgotEmail);
      setForgotSuccess(response.message || 'Password reset email sent successfully.');
    } catch (err: any) {
      setForgotError(err.message || 'Failed to submit recovery request.');
    } finally {
      setForgotLoading(false);
    }
  };

  if (showForgot) {
    return (
      <div className="flex min-h-[70vh] bg-slate-50 items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
              <Key className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900">Reset Credentials</h2>
            <p className="mt-2 text-xs font-mono text-slate-500 font-medium">Security Authorization & Identity Verification</p>
          </div>

          {forgotError && (
            <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <span>{forgotError}</span>
            </div>
          )}

          {forgotSuccess ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex flex-col gap-2 font-medium">
                <div className="flex items-center gap-2 font-bold font-mono">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>RECOVERY SENT SUCCESSFULLY</span>
                </div>
                <p className="leading-relaxed mt-1 text-slate-600">{forgotSuccess}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setForgotSuccess('');
                  setForgotEmail('');
                }}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all cursor-pointer shadow-sm"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Administrative Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="cyberm0101noirhat@gmail.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                {forgotLoading ? 'Verifying Identity...' : 'Dispatch Reset Email'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setForgotError('');
                }}
                className="w-full rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] bg-slate-50 items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900">Secure Control Room</h2>
          <p className="mt-2 text-xs font-mono text-slate-500 font-medium">SuperAdmin Gateway Credentials Required</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">Administrative Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono text-slate-500">Encrypted Password Core</label>
              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setError('');
                }}
                className="text-[10px] font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- PORTAL CONTROL ROOM PANEL ---
function ControlRoomView({ onLogout, onSettingsChange }: { onLogout: () => void; onSettingsChange?: (settings: { [key: string]: string }) => void }) {
  const [activeModule, setActiveModule] = useState<string>('stats');
  const [eventApplicants, setEventApplicants] = useState<any[]>([]);
  // Load event registrations when tab is active
  const loadEventApplicants = async () => {
    try {
      const data = await api.getEventRegistrations();
      setEventApplicants(data);
    } catch (err) {
      console.error('Failed to load event applicants', err);
    }
  };
  const [stats, setStats] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [replyModal, setReplyModal] = useState<{ msg: any; mode: 'email' | 'whatsapp' } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState<string>('');
  const [whatsappSenderNumber, setWhatsappSenderNumber] = useState('03430381473');

  const [opps, setOpps] = useState<any[]>([]);
  const [oppApps, setOppApps] = useState<any[]>([]);

  // Settings edit
  const [officeAdd, setOfficeAdd] = useState('');
  const [compMail, setCompMail] = useState('');
  const [compPhone, setCompPhone] = useState('');
  const [compWhatsapp, setCompWhatsapp] = useState('');
  const [compHours, setCompHours] = useState('');
  const [smFacebook, setSmFacebook] = useState('');
  const [smLinkedin, setSmLinkedin] = useState('');
  const [smTwitter, setSmTwitter] = useState('');
  const [smInstagram, setSmInstagram] = useState('');
  const [smGithub, setSmGithub] = useState('');
  const [smYoutube, setSmYoutube] = useState('');
  const [smTiktok, setSmTiktok] = useState('');
  const [customCompanySocials, setCustomCompanySocials] = useState<Array<{ platform: string; url: string }>>([]);

  // Admin profile & credentials states
  const [profileUsername, setProfileUsername] = useState('');
  const [profileFullName, setProfileFullName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form toggles
  const [services, setServices] = useState<any[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [servicePayload, setServicePayload] = useState({ title: '', banner_url: '', short_description: '', description: '', benefits: '', technologies: '' });

  // CEO Message Settings
  const [ceoName, setCeoName] = useState('');
  const [ceoTitle, setCeoTitle] = useState('');
  const [ceoPhoto, setCeoPhoto] = useState('');
  const [ceoMessage, setCeoMessage] = useState('');
  const [founderYear, setFounderYear] = useState('2022');
  const [registeredYear, setRegisteredYear] = useState('2026');
  const [ceoVenturesSaas, setCeoVenturesSaas] = useState('5+ Built');
  const [ceoEngineeringTeam, setCeoEngineeringTeam] = useState('20+ Minds');
  const [ceoStrategicFocus, setCeoStrategicFocus] = useState('GB & Global');

  // Hero Section Dynamic Settings
  const [heroHeading, setHeroHeading] = useState('');
  const [heroHeadingAccent, setHeroHeadingAccent] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroTypedPhrases, setHeroTypedPhrases] = useState('');

  // Company Overview / Mission / Vision Settings
  const [overviewTitle, setOverviewTitle] = useState('');
  const [overviewDescription, setOverviewDescription] = useState('');
  const [overviewTagline, setOverviewTagline] = useState('');
  const [missionText, setMissionText] = useState('');
  const [visionText, setVisionText] = useState('');

  // Why Choose Us Settings
  const [whyHeading, setWhyHeading] = useState('');
  const [whySubtitle, setWhySubtitle] = useState('');

  // Blogs CMS
  const [blogs, setBlogs] = useState<any[]>([]);
  const [adminBlogCategories, setAdminBlogCategories] = useState<any[]>([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogPayload, setBlogPayload] = useState({
    title: '',
    category_id: '1',
    author_name: 'Mehdi Hassan',
    author_avatar: '',
    reading_time: '5 min read',
    featured_image_url: '',
    content: '',
    is_featured: false
  });

  // Testimonials CMS
  const [adminTestimonials, setAdminTestimonials] = useState<any[]>([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialPayload, setTestimonialPayload] = useState({ client_name: '', client_role: '', client_company: '', feedback: '', rating: '5', client_avatar: '' });

  // Projects CMS
  const [adminProjects, setAdminProjects] = useState<any[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectPayload, setProjectPayload] = useState({
    title: '',
    client_name: '',
    category: 'Web',
    custom_category: '',
    technologies: '',
    short_description: '',
    description: '',
    case_study: '',
    live_url: '',
    github_url: '',
    completion_date: '',
    thumbnail_url: '',
    screenshots: ['', '', '', '', '']
  });

  // Team / About CMS
  const [adminTeam, setAdminTeam] = useState<any[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamPayload, setTeamPayload] = useState({
    name: '',
    position: '',
    photo_url: '',
    bio: '',
    skills: '',
    social_linkedin: '',
    social_github: '',
    social_twitter: '',
    portfolio_url: '',
    social_links: [] as Array<{ platform: string; url: string }>,
    experience_years: '5 Years',
    is_founder: false,
    sort_order: '10'
  });

  // Products CMS
  const [adminProducts, setAdminProducts] = useState<any[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productPayload, setProductPayload] = useState({
    title: '',
    short_description: '',
    description: '',
    features: '',
    demo_url: '',
    video_url: '',
    download_url: '',
    thumbnail_url: ''
  });

  // Projects for Sale CMS
  const [adminSaleProjects, setAdminSaleProjects] = useState<any[]>([]);
  const [showSaleProjectForm, setShowSaleProjectForm] = useState(false);
  const [saleProjectPayload, setSaleProjectPayload] = useState({
    title: '',
    price: '',
    technology: '',
    short_description: '',
    features: '',
    demo_url: '',
    video_url: '',
    screenshots: [] as Array<{ url: string; description: string }>,
    thumbnail_url: ''
  });

  // Events CMS
  const [adminEvents, setAdminEvents] = useState<any[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventPayload, setEventPayload] = useState({
    title: '',
    banner_url: '',
    event_date: '',
    venue: '',
    description: '',
    registration_link: '',
    form_fields: [] as OpportunityField[]
  });
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  const [eventNewFieldType, setEventNewFieldType] = useState<OpportunityField['type']>('text');
  const [eventNewFieldLabel, setEventNewFieldLabel] = useState('');
  const [eventNewFieldPlaceholder, setEventNewFieldPlaceholder] = useState('');
  const [eventNewFieldOptions, setEventNewFieldOptions] = useState('');
  const [eventNewFieldRequired, setEventNewFieldRequired] = useState(false);

  // Careers CMS
  const [adminCareers, setAdminCareers] = useState<any[]>([]);
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [careerPayload, setCareerPayload] = useState({
    position: '',
    department: '',
    salary: '',
    experience: '',
    skills: '',
    description: '',
    banner_url: '',
    is_active: true
  });

  // FAQs CMS
  const [adminFAQs, setAdminFAQs] = useState<any[]>([]);
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [faqPayload, setFaqPayload] = useState({
    category: 'General',
    question: '',
    answer: ''
  });

  // SEO Settings CMS
  const [adminSEO, setAdminSEO] = useState<any[]>([]);
  const [showSEOForm, setShowSEOForm] = useState(false);
  const [seoPayload, setSeoPayload] = useState({
    page_route: 'home',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  // Newsletter CMS
  const [adminNewsletter, setAdminNewsletter] = useState<any[]>([]);

  // Editing state for full CRUD
  const [editingItem, setEditingItem] = useState<{ id: number; type: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [adminAlert, setAdminAlert] = useState<{ title: string; message: string } | null>(null);

  // Chat Support Panel
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [agentAvailability, setAgentAvailability] = useState<'online' | 'away' | 'offline'>('online');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatReplyText, setChatReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);

  // IT Academy Student Projects CMS State
  const [adminStudentProjects, setAdminStudentProjects] = useState<any[]>([]);
  const [showStudentProjectForm, setShowStudentProjectForm] = useState(false);
  const [studentProjectPayload, setStudentProjectPayload] = useState({
    title: '',
    student_name: '',
    batch_course: '',
    category: 'Full-Stack Software',
    thumbnail_url: '',
    images: ['', '', '', '', ''],
    short_description: '',
    description: '',
    technologies: '',
    live_url: '',
    github_url: ''
  });

  const loadAllAdminData = () => {
    api.getStats().then(setStats).catch(console.error);
    api.getContactMessages().then(setMessages).catch(console.error);
    api.getApplications().then(setApps).catch(console.error);
    api.getLogs().then(setLogs).catch(console.error);
    api.getServices().then(setServices).catch(console.error);
    api.getBlogs().then(setBlogs).catch(console.error);
    api.getBlogCategories().then(setAdminBlogCategories).catch(console.error);
    api.getTestimonials().then(setAdminTestimonials).catch(console.error);
    api.getProjects().then(setAdminProjects).catch(console.error);
    api.getStudentProjects().then(setAdminStudentProjects).catch(console.error);
    api.getTeam().then(setAdminTeam).catch(console.error);
    api.getProducts().then(setAdminProducts).catch(console.error);
    api.getSaleProjects().then(setAdminSaleProjects).catch(console.error);
    api.getEvents().then(setAdminEvents).catch(console.error);
    api.getEventRegistrations().then(setEventApplicants).catch(console.error);
    api.getCareers().then(setAdminCareers).catch(console.error);
    api.getOpportunities().then(setOpps).catch(console.error);
    api.getOpportunityApplications().then(setOppApps).catch(console.error);
    api.getFAQs().then(setAdminFAQs).catch(console.error);
    api.getNewsletterSubscribers().then(setAdminNewsletter).catch(console.error);
    api.getSEO().then(setAdminSEO).catch(console.error);
    api.getChats().then(data => {
      setChatSessions(data.sessions || []);
      setAgentAvailability(data.availability || 'online');
    }).catch(console.error);
    api.getSettings().then(s => {
      setOfficeAdd(s.office_address || '');
      setCompMail(s.email || '');
      setCompPhone(s.phone || '');
      setCompWhatsapp(s.whatsapp || '');
      setCompHours(s.business_hours || '');
      setSmFacebook(s.facebook || '');
      setSmLinkedin(s.linkedin || '');
      setSmTwitter(s.twitter || '');
      setSmInstagram(s.instagram || '');
      setSmGithub(s.github || '');
      setSmYoutube(s.youtube || '');
      setSmTiktok(s.tiktok || '');
      setCeoName(s.ceo_name || '');
      setCeoTitle(s.ceo_title || '');
      setCeoPhoto(s.ceo_photo || '');
      setCeoMessage(s.ceo_message || '');
      setFounderYear(s.founder_year || '2022');
      setRegisteredYear(s.registered_year || '2026');
      setCeoVenturesSaas(s.ceo_ventures_saas || '5+ Built');
      setCeoEngineeringTeam(s.ceo_engineering_team || '20+ Minds');
      setCeoStrategicFocus(s.ceo_strategic_focus || 'GB & Global');
      // Hero Section
      setHeroHeading(s.hero_heading || '');
      setHeroHeadingAccent(s.hero_heading_accent || '');
      setHeroDescription(s.hero_description || '');
      setHeroTypedPhrases(s.hero_typed_phrases || '');
      // Overview / Mission / Vision
      setOverviewTitle(s.overview_title || '');
      setOverviewDescription(s.overview_description || '');
      setOverviewTagline(s.overview_tagline || '');
      setMissionText(s.mission_text || '');
      setVisionText(s.vision_text || '');
      // Why Choose Us
      setWhyHeading(s.why_heading || '');
      setWhySubtitle(s.why_subtitle || '');
      if (s.custom_socials) {
        try {
          setCustomCompanySocials(JSON.parse(s.custom_socials));
        } catch (e) {
          setCustomCompanySocials([]);
        }
      } else {
        setCustomCompanySocials([]);
      }
    }).catch(console.error);
    api.getProfile().then(p => {
      setProfileUsername(p.username || '');
      setProfileFullName(p.full_name || '');
      setProfileEmail(p.email || '');
      setProfileBio(p.bio || '');
    }).catch(console.error);
    // Notify public views that admin data was refreshed so they can re-fetch if needed
    try {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('sarohub-data-updated'));
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Poll chat sessions while either admin chat-related view is active.
  useEffect(() => {
    if (activeModule !== 'chats' && activeModule !== 'messages') return;

    const pollInterval = setInterval(() => {
      api.getChats().then(data => {
        setChatSessions(data.sessions || []);
        setAgentAvailability(data.availability || 'online');
      }).catch(console.error);
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [activeModule]);

  const handleUpdateAgentStatus = async (status: 'online' | 'away' | 'offline') => {
    try {
      const res = await api.updateAgentStatus(status);
      setAgentAvailability(res.availability);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCloseSession = async (id: string) => {
    if (!confirm('Are you sure you want to archive and close this support ticket?')) return;
    try {
      await api.closeChatSession(id);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSendAgentMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatId || !chatReplyText.trim() || isSendingReply) return;

    const textToSend = chatReplyText;
    setChatReplyText('');
    setIsSendingReply(true);

    try {
      await api.sendChatMessage(selectedChatId, {
        sender: 'agent',
        text: textToSend
      });
      // Refresh chats instantly
      const updated = await api.getChats();
      setChatSessions(updated.sessions || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleSuggestReply = async () => {
    if (!selectedChatId || isGeneratingSuggestion) return;
    setIsGeneratingSuggestion(true);
    try {
      const res = await api.suggestChatReply(selectedChatId);
      setChatReplyText(res.suggestion || '');
    } catch (err: any) {
      alert('Failed to fetch AI suggestions: ' + err.message);
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveSettings({
        office_address: officeAdd,
        email: compMail,
        phone: compPhone,
        whatsapp: compWhatsapp,
        business_hours: compHours,
        facebook: smFacebook,
        linkedin: smLinkedin,
        twitter: smTwitter,
        instagram: smInstagram,
        github: smGithub,
        youtube: smYoutube,
        tiktok: smTiktok,
        ceo_name: ceoName,
        ceo_title: ceoTitle,
        ceo_photo: ceoPhoto,
        ceo_message: ceoMessage,
        founder_year: founderYear,
        registered_year: registeredYear,
        ceo_ventures_saas: ceoVenturesSaas,
        ceo_engineering_team: ceoEngineeringTeam,
        ceo_strategic_focus: ceoStrategicFocus,
        // Hero Section
        hero_heading: heroHeading,
        hero_heading_accent: heroHeadingAccent,
        hero_description: heroDescription,
        hero_typed_phrases: heroTypedPhrases,
        // Overview / Mission / Vision
        overview_title: overviewTitle,
        overview_description: overviewDescription,
        overview_tagline: overviewTagline,
        mission_text: missionText,
        vision_text: visionText,
        // Why Choose Us
        why_heading: whyHeading,
        why_subtitle: whySubtitle,
        custom_socials: JSON.stringify(customCompanySocials.filter(c => c.url && c.url.trim()))
      });
      // Refresh global settings used by public pages (Footer social links etc.)
      api.getSettings().then((s) => {
        if (onSettingsChange) onSettingsChange(s);
      }).catch(console.error);
      setAdminAlert({ title: 'Settings Saved', message: 'Corporate settings, CEO message, and social media channels have been synchronized successfully.' });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Settings', message: err.message });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile({
        username: profileUsername,
        full_name: profileFullName,
        email: profileEmail,
        bio: profileBio
      } as any);
      alert('Administrator profile settings updated successfully!');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and password confirmation do not match.');
      return;
    }
    try {
      await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      alert('Administrator password credential successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditService = (s: any) => {
    setServicePayload({
      title: s.title,
      banner_url: s.banner_url || '',
      short_description: s.short_description || '',
      description: s.description || '',
      benefits: Array.isArray(s.benefits) ? s.benefits.join(', ') : (s.benefits || ''),
      technologies: Array.isArray(s.technologies) ? s.technologies.join(', ') : (s.technologies || '')
    });
    setEditingItem({ id: s.id, type: 'service' });
    setShowServiceForm(true);
  };

  const handleEditBlog = (b: any) => {
    setBlogPayload({
      title: b.title || '',
      category_id: String(b.category_id || 1),
      author_name: b.author_name || 'Mehdi Hassan',
      author_avatar: b.author_avatar || '',
      reading_time: b.reading_time || '5 min read',
      featured_image_url: b.featured_image_url || '',
      content: b.content || '',
      is_featured: !!b.is_featured
    });
    setEditingItem({ id: b.id, type: 'blog' });
    setShowBlogForm(true);
  };

  const handleEditProject = (p: any) => {
    const existingScreenshots = Array.isArray(p.screenshots) ? p.screenshots : [];
    const isCustomCat = !['Web', 'Mobile', 'SaaS', 'AI', 'UI/UX', 'E-Commerce'].includes(p.category || 'Web');
    setProjectPayload({
      title: p.title || '',
      client_name: p.client_name || '',
      category: isCustomCat ? 'Custom' : (p.category || 'Web'),
      custom_category: isCustomCat ? p.category : '',
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''),
      short_description: p.short_description || '',
      description: p.description || '',
      case_study: p.case_study || '',
      live_url: p.live_url || '',
      github_url: p.github_url || '',
      completion_date: p.completion_date || '',
      thumbnail_url: p.thumbnail_url || '',
      screenshots: [
        existingScreenshots[0] || '',
        existingScreenshots[1] || '',
        existingScreenshots[2] || '',
        existingScreenshots[3] || '',
        existingScreenshots[4] || ''
      ]
    });
    setEditingItem({ id: p.id, type: 'project' });
    setShowProjectForm(true);
  };

  const handleEditTeamMember = (t: any) => {
    const initialSocials: Array<{ platform: string; url: string }> = Array.isArray(t.social_links) && t.social_links.length > 0
      ? [...t.social_links]
      : [];

    if (initialSocials.length === 0) {
      if (t.social_linkedin) initialSocials.push({ platform: 'LinkedIn', url: t.social_linkedin });
      if (t.social_github) initialSocials.push({ platform: 'GitHub', url: t.social_github });
      if (t.social_twitter) initialSocials.push({ platform: 'Twitter / X', url: t.social_twitter });
      if (t.portfolio_url) initialSocials.push({ platform: 'Portfolio', url: t.portfolio_url });
    }

    setTeamPayload({
      name: t.name,
      position: t.position || '',
      photo_url: t.photo_url || '',
      bio: t.bio || '',
      skills: Array.isArray(t.skills) ? t.skills.join(', ') : (t.skills || ''),
      social_linkedin: t.social_linkedin || '',
      social_github: t.social_github || '',
      social_twitter: t.social_twitter || '',
      portfolio_url: t.portfolio_url || '',
      social_links: initialSocials,
      experience_years: t.experience_years || '5 Years',
      is_founder: !!t.is_founder,
      sort_order: String(t.sort_order || '10')
    });
    setEditingItem({ id: t.id, type: 'team' });
    setShowTeamForm(true);
  };

  const handleEditProduct = (pr: any) => {
    setProductPayload({
      title: pr.title,
      short_description: pr.short_description || '',
      description: pr.description || '',
      features: Array.isArray(pr.features) ? pr.features.join(', ') : (pr.features || ''),
      demo_url: pr.demo_url || '',
      video_url: pr.video_url || '',
      download_url: pr.download_url || '',
      thumbnail_url: pr.thumbnail_url || ''
    });
    setEditingItem({ id: pr.id, type: 'product' });
    setShowProductForm(true);
  };

  const handleEditTestimonial = (t: any) => {
    setTestimonialPayload({
      client_name: t.client_name,
      client_role: t.client_role || '',
      client_company: t.client_company || '',
      feedback: t.feedback || '',
      rating: String(t.rating || '5'),
      client_avatar: t.client_avatar || ''
    });
    setEditingItem({ id: t.id, type: 'testimonial' });
    setShowTestimonialForm(true);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: servicePayload.title,
        banner_url: servicePayload.banner_url,
        short_description: servicePayload.short_description,
        description: servicePayload.description,
        benefits: servicePayload.benefits.split(',').map(s => s.trim()),
        technologies: servicePayload.technologies.split(',').map(s => s.trim()),
        faqs: []
      };
      if (editingItem && editingItem.type === 'service') {
        await api.updateService(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createService(data);
      }
      setShowServiceForm(false);
      setServicePayload({ title: '', banner_url: '', short_description: '', description: '', benefits: '', technologies: '' });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Service', message: err.message });
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: blogPayload.title,
        category_id: parseInt(blogPayload.category_id) || 1,
        author_name: blogPayload.author_name,
        author_avatar: blogPayload.author_avatar,
        reading_time: blogPayload.reading_time,
        featured_image_url: blogPayload.featured_image_url,
        content: blogPayload.content,
        is_featured: blogPayload.is_featured,
        tags: [1, 2]
      };
      if (editingItem && editingItem.type === 'blog') {
        await api.updateBlog(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createBlog(data);
      }
      setShowBlogForm(false);
      setBlogPayload({
        title: '',
        category_id: '1',
        author_name: 'Mehdi Hassan',
        author_avatar: '',
        reading_time: '5 min read',
        featured_image_url: '',
        content: '',
        is_featured: false
      });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Article', message: err.message });
    }
  };

  const handleDeleteService = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this service blueprint?',
      onConfirm: async () => {
        try {
          await api.deleteService(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Service', message: err.message });
        }
      }
    });
  };

  const handleDeleteBlog = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this blog post?',
      onConfirm: async () => {
        try {
          await api.deleteBlog(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Article', message: err.message });
        }
      }
    });
  };

  const handleMarkMsgRead = async (id: number) => {
    try {
      await api.markMessageAsRead(id);
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Marking Message', message: err.message });
    }
  };

  const handleReviewApp = async (id: number, status: 'reviewed' | 'shortlisted' | 'rejected') => {
    try {
      await api.updateApplicationStatus(id, status);
      if (status === 'shortlisted') {
        setAdminAlert({
          title: 'Candidate Shortlisted',
          message: 'Application status updated to Shortlisted. An automated confirmation email has been dispatched to the candidate.'
        });
      }
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Reviewing Application', message: err.message });
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryVal = projectPayload.category === 'Custom'
        ? (projectPayload.custom_category.trim() || 'Custom')
        : projectPayload.category;
      const cleanScreenshots = (projectPayload.screenshots || []).filter((s: any) => typeof s === 'string' && s.trim());
      const data = {
        title: projectPayload.title,
        client_name: projectPayload.client_name,
        category: categoryVal,
        technologies: projectPayload.technologies.split(',').map(t => t.trim()).filter(Boolean),
        short_description: projectPayload.short_description,
        description: projectPayload.description,
        case_study: projectPayload.case_study,
        live_url: projectPayload.live_url,
        github_url: projectPayload.github_url,
        completion_date: projectPayload.completion_date,
        thumbnail_url: projectPayload.thumbnail_url || cleanScreenshots[0] || '',
        screenshots: cleanScreenshots
      };
      if (editingItem && editingItem.type === 'project') {
        await api.updateProject(editingItem.id, data);
        setAdminAlert({ title: 'Client Project Saved', message: 'Client project details updated successfully.' });
        setEditingItem(null);
      } else {
        await api.createProject(data);
        setAdminAlert({ title: 'Client Project Published', message: 'New client project published successfully.' });
      }
      setShowProjectForm(false);
      setProjectPayload({
        title: '',
        client_name: '',
        category: 'Web',
        custom_category: '',
        technologies: '',
        short_description: '',
        description: '',
        case_study: '',
        live_url: '',
        github_url: '',
        completion_date: '',
        thumbnail_url: '',
        screenshots: ['', '', '', '', '']
      });
      loadAllAdminData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Client Project', message: err.message });
    }
  };

  const handleDeleteProject = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this client project?',
      onConfirm: async () => {
        try {
          await api.deleteProject(id);
          loadAllAdminData();
          window.dispatchEvent(new Event('sarohub-data-updated'));
          setAdminAlert({ title: 'Client Project Deleted', message: 'Project removed successfully.' });
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Client Project', message: err.message });
        }
      }
    });
  };

  const handleCreateStudentProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanImages = (studentProjectPayload.images || []).filter((img: any) => typeof img === 'string' && img.trim()).slice(0, 5);
      const payload = {
        ...studentProjectPayload,
        images: cleanImages,
        thumbnail_url: studentProjectPayload.thumbnail_url || cleanImages[0] || ''
      };

      if (editingItem && editingItem.type === 'student_project') {
        await api.updateStudentProject(editingItem.id, payload);
        setAdminAlert({ title: 'Student Project Saved', message: 'Student project details updated successfully.' });
      } else {
        await api.createStudentProject(payload);
        setAdminAlert({ title: 'Student Project Published', message: 'New student project published successfully.' });
      }
      setShowStudentProjectForm(false);
      setEditingItem(null);
      setStudentProjectPayload({
        title: '',
        student_name: '',
        batch_course: '',
        category: 'Full-Stack Software',
        thumbnail_url: '',
        images: ['', '', '', '', ''],
        short_description: '',
        description: '',
        technologies: '',
        live_url: '',
        github_url: ''
      });
      loadAllAdminData();
      window.dispatchEvent(new Event('sarohub-data-updated'));
    } catch (err: any) {
      setAdminAlert({ title: 'Operation Failed', message: err.message || 'Failed to save student project.' });
    }
  };

  const handleEditStudentProject = (item: any) => {
    setEditingItem({ id: item.id, type: 'student_project' });
    const existingImages = Array.isArray(item.images) ? item.images : (item.thumbnail_url ? [item.thumbnail_url] : []);
    const imageSlots = [
      existingImages[0] || '',
      existingImages[1] || '',
      existingImages[2] || '',
      existingImages[3] || '',
      existingImages[4] || ''
    ];

    setStudentProjectPayload({
      title: item.title || '',
      student_name: item.student_name || '',
      batch_course: item.batch_course || '',
      category: item.category || 'Full-Stack Software',
      thumbnail_url: item.thumbnail_url || existingImages[0] || '',
      images: imageSlots,
      short_description: item.short_description || '',
      description: item.description || '',
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies || '',
      live_url: item.live_url || '',
      github_url: item.github_url || ''
    });
    setShowStudentProjectForm(true);
  };

  const handleDeleteStudentProject = (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this student project?',
      onConfirm: async () => {
        try {
          await api.deleteStudentProject(id);
          loadAllAdminData();
          window.dispatchEvent(new Event('sarohub-data-updated'));
          setAdminAlert({ title: 'Deleted', message: 'Student project removed successfully.' });
        } catch (err: any) {
          setAdminAlert({ title: 'Delete Failed', message: err.message || 'Failed to delete student project.' });
        }
      }
    });
  };

  const handleDeleteChatSession = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this chat session?')) return;
    try {
      await api.deleteChatSession(id);
      setChatSessions(prev => prev.filter(s => s.id !== id));
      if (selectedChatId === id) setSelectedChatId(null);
      setAdminAlert({ title: 'Chat Cleared', message: 'Chat session deleted successfully.' });
    } catch (err: any) {
      setAdminAlert({ title: 'Delete Failed', message: err.message || 'Failed to delete chat session.' });
    }
  };

  const handleClearAllChats = async () => {
    if (!window.confirm('Are you sure you want to clear ALL assistant chat history?')) return;
    try {
      await api.clearAllChatSessions();
      setChatSessions([]);
      setSelectedChatId(null);
      setAdminAlert({ title: 'Assistant History Cleared', message: 'All assistant chat history cleared successfully.' });
    } catch (err: any) {
      setAdminAlert({ title: 'Clear Failed', message: err.message || 'Failed to clear chat history.' });
    }
  };

  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: teamPayload.name,
        position: teamPayload.position,
        photo_url: teamPayload.photo_url,
        bio: teamPayload.bio,
        skills: teamPayload.skills.split(',').map(s => s.trim()).filter(Boolean),
        social_linkedin: teamPayload.social_linkedin,
        social_github: teamPayload.social_github,
        social_twitter: teamPayload.social_twitter,
        portfolio_url: teamPayload.portfolio_url,
        social_links: (teamPayload.social_links || []).filter(s => s.url && s.url.trim()),
        experience_years: teamPayload.experience_years,
        is_founder: teamPayload.is_founder,
        sort_order: parseInt(teamPayload.sort_order) || 10
      };
      if (editingItem && editingItem.type === 'team') {
        await api.updateTeamMember(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createTeamMember(data);
      }
      setShowTeamForm(false);
      setTeamPayload({
        name: '',
        position: '',
        photo_url: '',
        bio: '',
        skills: '',
        social_linkedin: '',
        social_github: '',
        social_twitter: '',
        portfolio_url: '',
        social_links: [],
        experience_years: '5 Years',
        is_founder: false,
        sort_order: '10'
      });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Team Member', message: err.message });
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this team member?',
      onConfirm: async () => {
        try {
          await api.deleteTeamMember(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Removing Team Member', message: err.message });
        }
      }
    });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: productPayload.title,
        short_description: productPayload.short_description,
        description: productPayload.description,
        features: productPayload.features.split(',').map(f => f.trim()),
        demo_url: productPayload.demo_url,
        video_url: productPayload.video_url,
        download_url: productPayload.download_url,
        thumbnail_url: productPayload.thumbnail_url
      };
      if (editingItem && editingItem.type === 'product') {
        await api.updateProduct(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createProduct(data);
      }
      setShowProductForm(false);
      setProductPayload({
        title: '',
        short_description: '',
        description: '',
        features: '',
        demo_url: '',
        video_url: '',
        download_url: '',
        thumbnail_url: ''
      });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Updating Product', message: err.message });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this product?',
      onConfirm: async () => {
        try {
          await api.deleteProduct(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Product', message: err.message });
        }
      }
    });
  };

  const handleCreateSaleProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: saleProjectPayload.title,
        price: parseFloat(saleProjectPayload.price) || 0,
        technology: saleProjectPayload.technology.split(',').map(t => t.trim()),
        short_description: saleProjectPayload.short_description,
        features: saleProjectPayload.features.split(',').map(f => f.trim()),
        demo_url: saleProjectPayload.demo_url,
        video_url: saleProjectPayload.video_url,
        screenshots: saleProjectPayload.screenshots.map(image => image.url),
        screenshot_descriptions: saleProjectPayload.screenshots.map(image => image.description),
        thumbnail_url: saleProjectPayload.thumbnail_url
      };
      if (editingItem && editingItem.type === 'sale_project') {
        await api.updateSaleProject(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createSaleProject(data);
      }
      setShowSaleProjectForm(false);
      setSaleProjectPayload({ title: '', price: '', technology: '', short_description: '', features: '', demo_url: '', video_url: '', screenshots: [], thumbnail_url: '' });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Template', message: err.message });
    }
  };

  const handleDeleteSaleProject = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this template?',
      onConfirm: async () => {
        try {
          await api.deleteSaleProject(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Template', message: err.message });
        }
      }
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: eventPayload.title,
        banner_url: eventPayload.banner_url,
        event_date: eventPayload.event_date,
        venue: eventPayload.venue,
        description: eventPayload.description,
        registration_link: eventPayload.registration_link,
        form_fields: eventPayload.form_fields || []
      };
      if (editingItem && editingItem.type === 'event') {
        await api.updateEvent(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createEvent(data);
      }
      setShowEventForm(false);
      setEventPayload({ title: '', banner_url: '', event_date: '', venue: '', description: '', registration_link: '', form_fields: [] });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Event', message: err.message });
    }
  };

  const handleAddEventField = () => {
    if (!eventNewFieldLabel.trim()) {
      alert('Field Label/Name is required.');
      return;
    }

    const fieldId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newField: OpportunityField = {
      id: fieldId,
      type: eventNewFieldType,
      label: eventNewFieldLabel.trim(),
      required: eventNewFieldRequired,
      placeholder: eventNewFieldPlaceholder.trim() || undefined,
    };

    if (['dropdown', 'radio', 'checkbox_multi', 'multi_select'].includes(eventNewFieldType)) {
      const opts = eventNewFieldOptions.split(',').map(s => s.trim()).filter(Boolean);
      newField.options = opts.length > 0 ? opts : ['Choice A', 'Choice B', 'Choice C'];
    }

    setEventPayload(prev => ({
      ...prev,
      form_fields: [...(prev.form_fields || []), newField]
    }));

    // Reset helper inputs
    setEventNewFieldLabel('');
    setEventNewFieldPlaceholder('');
    setEventNewFieldOptions('');
    setEventNewFieldRequired(false);
    setExpandedFieldId(fieldId);
  };

  const handleUpdateEventField = (index: number, updated: OpportunityField) => {
    setEventPayload(prev => {
      const copy = [...(prev.form_fields || [])];
      copy[index] = updated;
      return { ...prev, form_fields: copy };
    });
  };

  const handleRemoveEventField = (fieldId: string) => {
    setEventPayload(prev => ({
      ...prev,
      form_fields: (prev.form_fields || []).filter(f => f.id !== fieldId)
    }));
    if (expandedFieldId === fieldId) {
      setExpandedFieldId(null);
    }
  };

  const handleMoveEventField = (index: number, direction: 'up' | 'down') => {
    setEventPayload(prev => {
      const fields = [...(prev.form_fields || [])];
      if (direction === 'up' && index > 0) {
        const temp = fields[index];
        fields[index] = fields[index - 1];
        fields[index - 1] = temp;
      } else if (direction === 'down' && index < fields.length - 1) {
        const temp = fields[index];
        fields[index] = fields[index + 1];
        fields[index + 1] = temp;
      }
      return { ...prev, form_fields: fields };
    });
  };

  const handleMoveEventFieldToLimit = (index: number, limit: 'top' | 'bottom') => {
    setEventPayload(prev => {
      const fields = [...(prev.form_fields || [])];
      const target = fields[index];
      const filtered = fields.filter((_, i) => i !== index);
      if (limit === 'top') {
        return { ...prev, form_fields: [target, ...filtered] };
      } else {
        return { ...prev, form_fields: [...filtered, target] };
      }
    });
  };

  const handleDeleteEvent = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to delete this corporate event?',
      onConfirm: async () => {
        try {
          await api.deleteEvent(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Event', message: err.message });
        }
      }
    });
  };

  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        position: careerPayload.position,
        department: careerPayload.department,
        salary: careerPayload.salary,
        experience: careerPayload.experience,
        skills: careerPayload.skills.split(',').map(s => s.trim()),
        description: careerPayload.description,
        banner_url: careerPayload.banner_url,
        is_active: careerPayload.is_active
      };
      if (editingItem && editingItem.type === 'career') {
        await api.updateCareer(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createCareer(data);
      }
      setShowCareerForm(false);
      setCareerPayload({ position: '', department: '', salary: '', experience: '', skills: '', description: '', banner_url: '', is_active: true });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Job Vacancy', message: err.message });
    }
  };

  const handleDeleteCareer = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this job vacancy?',
      onConfirm: async () => {
        try {
          await api.deleteCareer(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Job Vacancy', message: err.message });
        }
      }
    });
  };


  const handleDeleteApplication = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to permanently delete this job application?',
      onConfirm: async () => {
        try {
          await api.deleteApplication(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Application', message: err.message });
        }
      }
    });
  };

  const handleCreateFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        category: faqPayload.category,
        question: faqPayload.question,
        answer: faqPayload.answer
      };
      if (editingItem && editingItem.type === 'faq') {
        await api.updateFAQ(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createFAQ(data);
      }
      setShowFAQForm(false);
      setFaqPayload({ category: 'General', question: '', answer: '' });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving FAQ', message: err.message });
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this FAQ?',
      onConfirm: async () => {
        try {
          await api.deleteFAQ(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting FAQ', message: err.message });
        }
      }
    });
  };

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        client_name: testimonialPayload.client_name,
        client_role: testimonialPayload.client_role,
        client_company: testimonialPayload.client_company,
        feedback: testimonialPayload.feedback,
        rating: parseInt(testimonialPayload.rating) || 5,
        client_avatar: testimonialPayload.client_avatar
      };
      if (editingItem && editingItem.type === 'testimonial') {
        await api.updateTestimonial(editingItem.id, data);
        setEditingItem(null);
      } else {
        await api.createTestimonial(data);
      }
      setShowTestimonialForm(false);
      setTestimonialPayload({ client_name: '', client_role: '', client_company: '', feedback: '', rating: '5', client_avatar: '' });
      loadAllAdminData();
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving Endorsement', message: err.message });
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    setDeleteConfirm({
      message: 'Are you sure you want to remove this review testimonial?',
      onConfirm: async () => {
        try {
          await api.deleteTestimonial(id);
          loadAllAdminData();
        } catch (err: any) {
          setAdminAlert({ title: 'Error Deleting Testimonial', message: err.message });
        }
      }
    });
  };

  const handleSaveSEO = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveSEO({
        page_route: seoPayload.page_route,
        meta_title: seoPayload.meta_title,
        meta_description: seoPayload.meta_description,
        meta_keywords: seoPayload.meta_keywords
      });
      setShowSEOForm(false);
      setSeoPayload({ page_route: 'home', meta_title: '', meta_description: '', meta_keywords: '' });
      loadAllAdminData();
      setAdminAlert({ title: 'Success', message: 'SEO profile updated successfully!' });
    } catch (err: any) {
      setAdminAlert({ title: 'Error Saving SEO Profile', message: err.message });
    }
  };

  return (
    <>
      {/* Email/WhatsApp Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
          <div className="relative w-full max-w-lg rounded-2xl p-8 shadow-2xl border border-slate-800 bg-slate-950">
            <button onClick={() => { setReplyModal(null); setReplyText(''); setReplySubject(''); setReplyStatus(''); }} className="absolute top-4 right-4 text-slate-500 hover:text-white text-xl font-bold">✕</button>
            {replyModal.mode === 'email' ? (
              <>
                <h3 className="font-display text-lg font-bold text-white mb-1">Reply via Email</h3>
                <p className="text-xs text-slate-500 mb-4">From: <span className="text-cyan-400">info@sarohub.com</span> → To: <span className="text-cyan-400">{replyModal.msg.email}</span></p>
                <input
                  type="text"
                  value={replySubject}
                  onChange={e => setReplySubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full mb-3 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
                <textarea
                  rows={6}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply message here..."
                  className="w-full mb-3 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                />
                {replyStatus && <p className={`text-xs mb-3 font-semibold ${replyStatus.startsWith('✅') ? 'text-emerald-400' : 'text-rose-400'}`}>{replyStatus}</p>}
                <button
                  disabled={sendingReply || !replyText.trim()}
                  onClick={async () => {
                    setSendingReply(true);
                    setReplyStatus('');
                    try {
                      await api.replyContactMessage(replyModal.msg.id, { subject: replySubject || `Re: ${replyModal.msg.subject}`, message: replyText });
                      setReplyStatus('✅ Email sent successfully from info@sarohub.com!');
                      setReplyText('');
                      setReplySubject('');
                    } catch (err: any) {
                      setReplyStatus('❌ Failed: ' + (err.message || String(err)));
                    } finally {
                      setSendingReply(false);
                    }
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-sm transition-all"
                >
                  {sendingReply ? 'Sending...' : '📧 Send from info@sarohub.com'}
                </button>
              </>
            ) : (
              <>
                <h3 className="font-display text-lg font-bold text-white mb-1">Reply via WhatsApp</h3>
                <p className="text-xs text-slate-500 mb-4">Send from SaroHub Business → To: <span className="text-green-400">{replyModal.msg.phone}</span></p>
                <div className="mb-4">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Select Sender Number</label>
                  <select
                    value={whatsappSenderNumber}
                    onChange={e => setWhatsappSenderNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-green-400 text-sm font-mono focus:outline-none focus:border-green-500 appearance-none cursor-pointer"
                  >
                    <option value="03430381473">0343 0381473 — Primary Business Line</option>
                    <option value="03555866875">0355 5866875 — Mehdi Hassan (CEO)</option>
                    <option value="03445312774">0344 5312774 — Muhammad Kazim (CMO)</option>
                    <option value="03239171065">0323 9171065 — Support Line</option>
                  </select>
                </div>
                <textarea
                  rows={5}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your WhatsApp message here..."
                  className="w-full mb-4 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-green-500 resize-none"
                />
                <p className="text-[10px] text-slate-500 mb-3">💡 Make sure WhatsApp Web is open and logged in with the selected number <strong className="text-green-400">{whatsappSenderNumber.replace(/(\d{4})(\d{7})/, '$1 $2')}</strong>. The chat will open automatically.</p>
                <a
                  href={`https://web.whatsapp.com/send?phone=${(replyModal.msg.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '92')}&text=${encodeURIComponent(replyText || 'Hello from SaroHub Technologies!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm transition-all text-center"
                  onClick={() => setReplyModal(null)}
                >
                  💬 Open WhatsApp Web & Send
                </a>
              </>
            )}
          </div>
        </div>
      )}

      <div className="admin-panel-root mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Navigation Sidebar */}
          <div className="w-full md:w-1/4 space-y-2">
            <div className="glass rounded-2xl p-6 mb-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Authenticated User</h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-cyan-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">SuperAdmin</h5>
                  <span className="text-[10px] font-mono text-emerald-400">Security Clearance</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-rose-950 bg-rose-950/20 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-950 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out Session
              </button>
            </div>

            <div className="glass rounded-2xl p-4 space-y-1">
              <button
                onClick={() => setActiveModule('stats')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'stats' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <TrendingUp className="h-4 w-4" /> Dashboard Analytics
              </button>
              <button
                onClick={() => setActiveModule('messages')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'messages' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Mail className="h-4 w-4" /> Message Logs ({messages.filter(m => !m.is_read).length})
              </button>
              <button
                onClick={() => setActiveModule('apps')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'apps' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Briefcase className="h-4 w-4" /> Job CV Portals ({apps.length})
              </button>
              <button
                onClick={() => setActiveModule('services')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'services' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Grid className="h-4 w-4" /> Services Blueprints
              </button>
              <button
                onClick={() => setActiveModule('projects')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'projects' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Briefcase className="h-4 w-4" /> Client Projects
              </button>
              <button
                onClick={() => setActiveModule('ventures')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'ventures' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <TrendingUp className="h-4 w-4" /> Our Ventures & Products CMS
              </button>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveModule('student_projects')}
                  className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center justify-between ${activeModule === 'student_projects' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Student Projects CMS
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                    {adminStudentProjects.length}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveModule('student_projects');
                    setEditingItem(null);
                    setStudentProjectPayload({
                      title: '',
                      student_name: '',
                      batch_course: '',
                      category: 'Full-Stack Software',
                      thumbnail_url: '',
                      images: ['', '', '', '', ''],
                      short_description: '',
                      description: '',
                      technologies: '',
                      live_url: '',
                      github_url: ''
                    });
                    setShowStudentProjectForm(true);
                  }}
                  className="w-full text-left rounded-lg pl-9 pr-3 py-1.5 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:bg-slate-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Student Project
                </button>
              </div>
              <button
                onClick={() => setActiveModule('about')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'about' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Users className="h-4 w-4" /> Leadership Team
              </button>
              <button
                onClick={() => setActiveModule('blogs')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'blogs' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <FileText className="h-4 w-4" /> Research CMS Blogs
              </button>
              <button
                onClick={() => setActiveModule('testimonials')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'testimonials' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Award className="h-4 w-4" /> Testimonial Reviews
              </button>
              <button
                onClick={() => setActiveModule('chats')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'chats' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <MessageSquare className="h-4 w-4" /> Live Support Desk {chatSessions.filter(s => s.agent_unread).length > 0 && `(${chatSessions.filter(s => s.agent_unread).length})`}
              </button>
              <button
                onClick={() => setActiveModule('sale_projects')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'sale_projects' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <DollarSign className="h-4 w-4" /> Projects For Sale
              </button>
              <button
                onClick={() => setActiveModule('event_applicants')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'event_applicants' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <UserCheck className="h-4 w-4" /> Event Applicants
              </button>
              <button
                onClick={() => setActiveModule('events')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'events' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Calendar className="h-4 w-4" /> Corporate Events
              </button>
              <button
                onClick={() => setActiveModule('opportunities')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'opportunities' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Award className="h-4 w-4" /> Opportunities
              </button>
              <button
                onClick={() => setActiveModule('faqs')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'faqs' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <AlertCircle className="h-4 w-4" /> FAQs Knowledgebase
              </button>
              <button
                onClick={() => setActiveModule('seo')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'seo' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Globe className="h-4 w-4" /> SEO Marketing CMS
              </button>
              <button
                onClick={() => setActiveModule('newsletter')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'newsletter' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Tag className="h-4 w-4" /> Newsletter Subs
              </button>
              <button
                onClick={() => setActiveModule('partners')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'partners' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Users className="h-4 w-4" /> Partners & Investors
              </button>
              <button
                onClick={() => setActiveModule('settings')}
                className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-mono flex items-center gap-2 ${activeModule === 'settings' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'}`}
              >
                <Settings className="h-4 w-4" /> System Settings
              </button>
            </div>
          </div>

          {/* Content Pane */}
          <div className="w-full md:w-3/4 glass rounded-3xl p-8 border border-slate-900 min-h-[60vh]">

            {/* Module 1: Stats */}
            {activeModule === 'stats' && (

              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Platform Telemetry</h2>
                  <p className="text-xs text-slate-500 mt-1">Real-time dynamic operations summary across all relational modules</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 text-center">
                    <span className="text-2xl font-extrabold text-cyan-400 block">{stats?.visitors || 18450}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Impression Logs</span>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 text-center">
                    <span className="text-2xl font-extrabold text-white block">{messages.length}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Queries Sent</span>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 text-center">
                    <span className="text-2xl font-extrabold text-white block">{apps.length}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">CV Candidates</span>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-6 text-center">
                    <span className="text-2xl font-extrabold text-blue-500 block">99.999%</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">SLA Target</span>
                  </div>
                </div>

                {/* Opportunities Module Statistics Section */}
                <div className="border-t border-slate-900 pt-8">
                  <h3 className="font-display font-bold text-white mb-4">Scholarship & Internship Portal Telemetry</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-blue-400 block">{opps.length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight">Total Blueprints</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-cyan-400 block">{opps.filter(o => o.status === 'Open').length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight">Active Cycles</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-white block">{oppApps.length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight">Applications Logged</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-yellow-500 block">{oppApps.filter(a => a.status === 'Shortlisted').length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight font-bold">Shortlisted</span>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-5 text-center">
                      <span className="text-xl font-extrabold text-emerald-500 block">{oppApps.filter(a => a.status === 'Selected').length}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight font-bold">Executive Selects</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Settings Modification */}
                <div className="border-t border-slate-900 pt-8">
                  <h3 className="font-display font-bold text-white mb-4">WTC Corporate Registry Sync</h3>
                  <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Corporate Headquarters Registry Address</label>
                      <input
                        type="text"
                        value={officeAdd}
                        onChange={(e) => setOfficeAdd(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Corporate Contact Registry Email</label>
                      <input
                        type="email"
                        value={compMail}
                        onChange={(e) => setCompMail(e.target.value)}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="rounded bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950">Synchronize Registry</button>
                    </div>
                  </form>
                </div>

                {/* Security Audit Activity Logs */}
                <div className="border-t border-slate-900 pt-8">
                  <h3 className="font-display font-bold text-white flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-cyan-400" /> Administrative Audit Trail
                  </h3>
                  <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-900 bg-slate-950/50 font-mono text-[10px] text-slate-400 p-4 divide-y divide-slate-900">
                    {logs.map((log) => (
                      <div key={log.id} className="py-2.5 flex items-start gap-4 justify-between">
                        <div>
                          <span className="text-cyan-400 font-bold">[{log.action_type}]</span>
                          <p className="mt-1 text-slate-300 leading-normal">{log.details}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-slate-600 block">ADMIN_SECURE</span>
                          <span className="text-[9px] text-slate-700 block">{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Module 2: Messages */}
            {activeModule === 'event_applicants' && (
              <EventApplicantsTable applicants={eventApplicants} refresh={loadEventApplicants} />
            )}
            {activeModule === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Corporate Message Registries</h2>
                  <p className="text-xs text-slate-500 mt-1">Direct inquiries and RinaAI assistant conversations dispatched through the public consultant grids</p>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {chatSessions.flatMap((session) => (session.messages || []).map((chatMessage: any) => ({ session, chatMessage }))).map(({ session, chatMessage }) => {
                    const chatContact = {
                      id: session.id,
                      name: session.visitor_name || 'Anonymous Visitor',
                      email: session.visitor_email || '',
                      phone: session.visitor_phone || '',
                      subject: 'RinaAI Assistant Conversation',
                      message: chatMessage.text
                    };

                    return (
                      <div key={`${session.id}-${chatMessage.id}`} className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/10">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <span className="text-xs font-mono text-slate-500">
                              From: {chatMessage.sender === 'agent' ? 'RinaAI Assistant' : chatContact.name} &bull; {chatContact.email || 'No email'} &bull; {chatContact.phone || 'No phone'}
                            </span>
                            <h4 className="font-display font-bold text-white mt-1">Topic: {chatContact.subject}</h4>
                            <p className="mt-2 text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-3 rounded-lg break-words">{chatContact.message}</p>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <div className="flex flex-wrap justify-end gap-2">
                              <button
                                disabled={!chatContact.email}
                                onClick={() => { setReplyModal({ msg: chatContact, mode: 'email' }); setReplySubject(`Re: ${chatContact.subject}`); setReplyText(''); setReplyStatus(''); }}
                                className="rounded bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-[10px] font-bold text-blue-400 flex items-center gap-1 hover:bg-blue-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title={chatContact.email ? 'Reply via Email' : 'No visitor email provided'}
                              >
                                <Mail className="h-3 w-3" /> Email
                              </button>
                              <button
                                disabled={!chatContact.phone}
                                onClick={() => { setReplyModal({ msg: chatContact, mode: 'whatsapp' }); setReplyText('Hello from SaroHub Technologies! We have reviewed your inquiry and would like to get in touch.'); setWhatsappSenderNumber('03430381473'); }}
                                className="rounded bg-green-500/10 border border-green-500/20 px-2 py-1 text-[10px] font-bold text-green-400 flex items-center gap-1 hover:bg-green-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title={chatContact.phone ? 'Reply via WhatsApp' : 'No visitor phone provided'}
                              >
                                <MessageSquare className="h-3 w-3" /> WhatsApp
                              </button>
                              <button
                                onClick={() => handleDeleteChatSession(session.id)}
                                className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-1 text-[10px] font-bold text-rose-400 flex items-center gap-1 hover:bg-rose-500/20 transition-colors"
                                title="Delete Chat Session"
                              >
                                <Trash2 className="h-3 w-3" /> Delete
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono text-right">{new Date(chatMessage.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {messages.map((m) => (
                    <div key={m.id} className={`p-6 rounded-2xl border ${m.is_read ? 'bg-slate-950/30 border-slate-900/50' : 'bg-cyan-950/5 border-cyan-500/20 glow-cyan'}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-xs font-mono text-slate-500">From: {m.name} &bull; {m.email} &bull; {m.phone || 'No phone'}</span>
                          <h4 className="font-display font-bold text-white mt-1">Topic: {m.subject}</h4>
                          <p className="mt-2 text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-3 rounded-lg">{m.message}</p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setReplyModal({ msg: m, mode: 'email' }); setReplySubject(`Re: ${m.subject}`); setReplyText(''); setReplyStatus(''); }}
                              className="rounded bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-[10px] font-bold text-blue-400 flex items-center gap-1 hover:bg-blue-500/20 transition-colors"
                              title="Reply via Email (from info@sarohub.com)"
                            >
                              <Mail className="h-3 w-3" /> Email
                            </button>
                            {m.phone && (
                              <button
                                onClick={() => { setReplyModal({ msg: m, mode: 'whatsapp' }); setReplyText('Hello from SaroHub Technologies! We have reviewed your inquiry and would like to get in touch.'); setWhatsappSenderNumber('03430381473'); }}
                                className="rounded bg-green-500/10 border border-green-500/20 px-2 py-1 text-[10px] font-bold text-green-400 flex items-center gap-1 hover:bg-green-500/20 transition-colors"
                                title="Reply via WhatsApp (select sender number)"
                              >
                                <MessageSquare className="h-3 w-3" /> WhatsApp
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this message?')) {
                                  try {
                                    await api.deleteContactMessage(m.id);
                                    loadAllAdminData();
                                  } catch (err: any) {
                                    alert('Error deleting message: ' + (err.message || String(err)));
                                  }
                                }
                              }}
                              className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-1 text-[10px] font-bold text-rose-400 flex items-center gap-1 hover:bg-rose-500/20 transition-colors"
                              title="Delete Message"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                          </div>
                          <div className="flex flex-col items-end mt-1">
                            {!m.is_read && (
                              <button
                                onClick={() => handleMarkMsgRead(m.id)}
                                className="rounded bg-cyan-500 px-3 py-1 text-[10px] font-bold text-slate-950 flex items-center gap-1 mb-1"
                              >
                                <Check className="h-3 w-3" /> Mark Read
                              </button>
                            )}
                            <span className="text-[10px] text-slate-500 font-mono text-right">{new Date(m.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 3: Career Apps */}
            {activeModule === 'apps' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Job Candidates Portal ({apps.length})</h2>
                  <p className="text-xs text-slate-500 mt-1">Incoming job applications, candidate contact info, cover letters, and uploaded CV documents</p>
                </div>

                {apps.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/30 text-center">
                    <p className="text-sm text-slate-500">No job applications submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apps.map((a) => {
                      const matchedJob = adminCareers.find(c => c.id === a.career_id);
                      const positionName = matchedJob ? matchedJob.position : `Position ID #${a.career_id}`;
                      return (
                        <div key={a.id} className="p-6 rounded-2xl border border-slate-900 bg-slate-950/50 hover:border-slate-800 transition-colors">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-display font-bold text-white text-base">{a.full_name}</h4>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono font-medium">
                                  Applied for: {positionName}
                                </span>
                              </div>
                              <div className="text-xs font-mono text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                                <span>📧 {a.email}</span>
                                <span>📞 {a.phone}</span>
                                <span>📅 {new Date(a.applied_at).toLocaleDateString()}</span>
                              </div>

                              {a.resume_url && (
                                <div className="pt-2">
                                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Attached CV Document:</span>
                                  <a
                                    href={a.resume_url}
                                    download={a.resume_filename || `CV_${a.full_name.replace(/\s+/g, '_')}.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-cyan-400 font-mono hover:bg-slate-850 hover:border-cyan-500/40 transition-colors"
                                  >
                                    <FileText className="h-4 w-4 text-cyan-400" />
                                    <span>{a.resume_filename || 'Download_CV_Document.pdf'}</span>
                                  </a>
                                </div>
                              )}

                              {a.cover_letter && (
                                <div className="pt-2">
                                  <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Cover Letter Summary:</span>
                                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-900 italic">
                                    "{a.cover_letter}"
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="shrink-0 text-right space-y-3 self-stretch sm:self-auto flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                              <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-mono font-extrabold uppercase border ${a.status === 'shortlisted' ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' :
                                a.status === 'rejected' ? 'bg-rose-950/60 border-rose-500/30 text-rose-400' :
                                  'bg-amber-950/60 border-amber-500/30 text-amber-400'
                                }`}>
                                Status: {a.status}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleReviewApp(a.id, 'shortlisted')}
                                  className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs text-slate-950 font-bold transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" /> Shortlist
                                </button>
                                <button
                                  onClick={() => handleReviewApp(a.id, 'rejected')}
                                  className="rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleDeleteApplication(a.id)}
                                  className="rounded-lg bg-rose-950/40 border border-rose-900/60 hover:bg-rose-950 text-rose-400 p-1.5 text-xs font-bold transition-colors cursor-pointer"
                                  title="Delete Application"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Module 4: Services */}
            {activeModule === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Services Blueprints CMS</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure and list core service operations dynamically</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setServicePayload({ title: '', banner_url: '', short_description: '', description: '', benefits: '', technologies: '' });
                      setShowServiceForm(!showServiceForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Blueprint
                  </button>
                </div>

                {showServiceForm && (
                  <form onSubmit={handleCreateService} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'service' ? 'Edit Service Blueprint' : 'Create New Service Blueprint'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Service Title</label>
                        <input
                          type="text"
                          required
                          value={servicePayload.title}
                          onChange={(e) => setServicePayload({ ...servicePayload, title: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <ImageUploadField
                        label="Featured Banner Image"
                        value={servicePayload.banner_url}
                        onChange={(url) => setServicePayload({ ...servicePayload, banner_url: url })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Short Description (Summary)</label>
                      <input
                        type="text"
                        required
                        value={servicePayload.short_description}
                        onChange={(e) => setServicePayload({ ...servicePayload, short_description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Detailed Technical Copy</label>
                      <textarea
                        rows={3}
                        required
                        value={servicePayload.description}
                        onChange={(e) => setServicePayload({ ...servicePayload, description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Advantages / Benefits (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="Advantage 1, Advantage 2"
                          value={servicePayload.benefits}
                          onChange={(e) => setServicePayload({ ...servicePayload, benefits: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Technologies Frameworks (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="MySQL, Node.js"
                          value={servicePayload.technologies}
                          onChange={(e) => setServicePayload({ ...servicePayload, technologies: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowServiceForm(false);
                          setEditingItem(null);
                          setServicePayload({ title: '', banner_url: '', short_description: '', description: '', benefits: '', technologies: '' });
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer">
                        {editingItem && editingItem.type === 'service' ? 'Save Changes' : 'Publish Blueprint'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {services.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">{s.title}</h4>
                        <p className="text-[10px] font-mono text-slate-500">{s.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditService(s)}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                          title="Edit Blueprint"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                          title="Delete Blueprint"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 5: Blogs */}
            {activeModule === 'blogs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Research Blogs CMS</h2>
                    <p className="text-xs text-slate-500 mt-1">Author and organize corporate engineering articles dynamically</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setBlogPayload({
                        title: '',
                        category_id: '1',
                        author_name: 'Mehdi Hassan',
                        author_avatar: '',
                        reading_time: '5 min read',
                        featured_image_url: '',
                        content: '',
                        is_featured: false
                      });
                      setShowBlogForm(!showBlogForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Author Article
                  </button>
                </div>

                {showBlogForm && (
                  <form onSubmit={handleCreateBlog} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'blog' ? 'Edit Research Article' : 'Author New Engineering Article'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Article Title</label>
                        <input
                          type="text"
                          required
                          value={blogPayload.title}
                          onChange={(e) => setBlogPayload({ ...blogPayload, title: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Category</label>
                        <select
                          value={blogPayload.category_id}
                          onChange={(e) => setBlogPayload({ ...blogPayload, category_id: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        >
                          {adminBlogCategories.length > 0 ? (
                            adminBlogCategories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))
                          ) : (
                            <option value="1">Technical & Engineering</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Author Name</label>
                        <input
                          type="text"
                          required
                          value={blogPayload.author_name}
                          onChange={(e) => setBlogPayload({ ...blogPayload, author_name: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Reading Time</label>
                        <input
                          type="text"
                          placeholder="5 min read"
                          value={blogPayload.reading_time}
                          onChange={(e) => setBlogPayload({ ...blogPayload, reading_time: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <ImageUploadField
                        label="Author Avatar Image"
                        value={blogPayload.author_avatar}
                        onChange={(url) => setBlogPayload({ ...blogPayload, author_avatar: url })}
                        placeholder="https://..."
                      />
                    </div>

                    <ImageUploadField
                      label="Featured Banner Image"
                      value={blogPayload.featured_image_url}
                      onChange={(url) => setBlogPayload({ ...blogPayload, featured_image_url: url })}
                      placeholder="https://..."
                    />

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Full Article Content (Markdown Text)</label>
                      <textarea
                        rows={6}
                        required
                        value={blogPayload.content}
                        onChange={(e) => setBlogPayload({ ...blogPayload, content: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="blog_is_featured"
                        checked={blogPayload.is_featured}
                        onChange={(e) => setBlogPayload({ ...blogPayload, is_featured: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                      />
                      <label htmlFor="blog_is_featured" className="text-xs font-mono text-slate-400 select-none">
                        Mark as Featured Article
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBlogForm(false);
                          setEditingItem(null);
                          setBlogPayload({
                            title: '',
                            category_id: '1',
                            author_name: 'Mehdi Hassan',
                            author_avatar: '',
                            reading_time: '5 min read',
                            featured_image_url: '',
                            content: '',
                            is_featured: false
                          });
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer">
                        {editingItem && editingItem.type === 'blog' ? 'Save Changes' : 'Publish Article'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {blogs.map((b) => (
                    <div key={b.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">{b.title}</h4>
                        <p className="text-[10px] font-mono text-slate-500">Author: {b.author_name} &bull; {b.reading_time}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBlog(b)}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(b.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 6: Testimonials Admin Panel */}
            {activeModule === 'testimonials' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Client Testimonials Reviews</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage public-facing enterprise recommendations and endorsements</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setTestimonialPayload({ client_name: '', client_role: '', client_company: '', client_avatar: '', rating: '5', feedback: '' });
                      setShowTestimonialForm(!showTestimonialForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Review
                  </button>
                </div>

                {showTestimonialForm && (
                  <form onSubmit={handleCreateTestimonial} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'testimonial' ? 'Edit Testimonial Review' : 'Create Client Testimonial Review'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Client Name</label>
                        <input
                          type="text"
                          required
                          value={testimonialPayload.client_name}
                          onChange={(e) => setTestimonialPayload({ ...testimonialPayload, client_name: e.target.value })}
                          placeholder="e.g. Ruwan Silva"
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Client Role/Designation</label>
                        <input
                          type="text"
                          required
                          value={testimonialPayload.client_role}
                          onChange={(e) => setTestimonialPayload({ ...testimonialPayload, client_role: e.target.value })}
                          placeholder="e.g. VP of Operations"
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Client Company</label>
                        <input
                          type="text"
                          required
                          value={testimonialPayload.client_company}
                          onChange={(e) => setTestimonialPayload({ ...testimonialPayload, client_company: e.target.value })}
                          placeholder="e.g. Apex Cargo Systems"
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ImageUploadField
                        label="Client Avatar Image"
                        value={testimonialPayload.client_avatar}
                        onChange={(url) => setTestimonialPayload({ ...testimonialPayload, client_avatar: url })}
                        placeholder="https://..."
                      />
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Rating Stars</label>
                        <select
                          value={testimonialPayload.rating}
                          onChange={(e) => setTestimonialPayload({ ...testimonialPayload, rating: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                        >
                          <option value="5">5 Stars (Excellent)</option>
                          <option value="4">4 Stars (Good)</option>
                          <option value="3">3 Stars (Average)</option>
                          <option value="2">2 Stars (Poor)</option>
                          <option value="1">1 Star (Critical)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Feedback/Recommendation Message</label>
                      <textarea
                        rows={4}
                        required
                        value={testimonialPayload.feedback}
                        onChange={(e) => setTestimonialPayload({ ...testimonialPayload, feedback: e.target.value })}
                        placeholder="Type testimonial feedback text..."
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTestimonialForm(false);
                          setEditingItem(null);
                          setTestimonialPayload({ client_name: '', client_role: '', client_company: '', client_avatar: '', rating: '5', feedback: '' });
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer">
                        {editingItem && editingItem.type === 'testimonial' ? 'Save Changes' : 'Add Endorsement'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminTestimonials.map((t) => (
                    <div key={t.id} className="p-5 rounded-2xl border border-slate-900 bg-slate-950/50 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex gap-1 text-cyan-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < t.rating ? 'fill-current text-cyan-400' : 'text-slate-700'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-300 italic">"{t.feedback}"</p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-900/40 gap-4">
                        <div className="flex items-center gap-3">
                          <img src={t.client_avatar} alt={t.client_name} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <h5 className="font-display font-bold text-white text-xs">{t.client_name}</h5>
                            <span className="text-[10px] text-slate-500 block">{t.client_role} &bull; {t.client_company}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTestimonial(t)}
                            className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                            title="Edit Review"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module: Client Projects CMS */}
            {activeModule === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Client Projects CMS</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure and display client projects, custom solutions, and delivered software dynamically</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setProjectPayload({
                        title: '',
                        client_name: '',
                        category: 'Web',
                        custom_category: '',
                        technologies: '',
                        short_description: '',
                        description: '',
                        case_study: '',
                        live_url: '',
                        github_url: '',
                        completion_date: '',
                        thumbnail_url: '',
                        screenshots: ['', '', '', '', '']
                      });
                      setShowProjectForm(!showProjectForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Client Project
                  </button>
                </div>

                {showProjectForm && (
                  <form onSubmit={handleCreateProject} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'project' ? 'Edit Client Project' : 'Create New Client Project'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projectPayload.title}
                          onChange={(e) => setProjectPayload({ ...projectPayload, title: e.target.value })}
                          placeholder="e.g. Omnichannel Supply Grid Engine"
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Client Name</label>
                        <input
                          type="text"
                          required
                          value={projectPayload.client_name}
                          onChange={(e) => setProjectPayload({ ...projectPayload, client_name: e.target.value })}
                          placeholder="e.g. Apex Global Logistics"
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Category</label>
                        <select
                          value={projectPayload.category}
                          onChange={(e) => setProjectPayload({ ...projectPayload, category: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          {['Web', 'Mobile', 'SaaS', 'AI', 'UI/UX', 'E-Commerce', 'Custom'].map(cat => (
                            <option key={cat} value={cat}>{cat === 'Custom' ? 'Custom Category (Specify Below)' : cat}</option>
                          ))}
                        </select>
                      </div>

                      {projectPayload.category === 'Custom' ? (
                        <div>
                          <label className="block text-xs font-mono text-cyan-400 mb-1">Custom Category Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Cloud Infrastructure, Fintech"
                            value={projectPayload.custom_category}
                            onChange={(e) => setProjectPayload({ ...projectPayload, custom_category: e.target.value })}
                            className="w-full rounded bg-slate-900 border border-cyan-500/50 px-3 py-2 text-xs text-white"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-mono text-slate-500 mb-1">Technologies (Comma separated)</label>
                          <input
                            type="text"
                            placeholder="React.js, Node.js, PostgreSQL"
                            value={projectPayload.technologies}
                            onChange={(e) => setProjectPayload({ ...projectPayload, technologies: e.target.value })}
                            className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Completion / Delivery Date</label>
                        <input
                          type="date"
                          value={projectPayload.completion_date}
                          onChange={(e) => setProjectPayload({ ...projectPayload, completion_date: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {projectPayload.category === 'Custom' && (
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Technologies (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="React.js, Node.js, PostgreSQL"
                          value={projectPayload.technologies}
                          onChange={(e) => setProjectPayload({ ...projectPayload, technologies: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    )}

                    <ImageUploadField
                      label="Thumbnail / Primary Cover Image"
                      value={projectPayload.thumbnail_url}
                      onChange={(url) => setProjectPayload({ ...projectPayload, thumbnail_url: url })}
                      placeholder="https://images.unsplash.com/... or upload from system"
                    />

                    {/* Screenshot Images Option */}
                    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                          Project Screenshots &amp; Gallery Showcase (Up to 5 images)
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          {(projectPayload.screenshots || []).filter((s: any) => typeof s === 'string' && s.trim()).length} Images Added
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Upload application screenshots or paste URLs. Visitors can view these in the interactive project gallery.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {[0, 1, 2, 3, 4].map((slotIdx) => (
                          <div key={slotIdx} className="p-2.5 rounded-lg border border-slate-800/60 bg-slate-950/60">
                            <ImageUploadField
                              label={`Screenshot #${slotIdx + 1}`}
                              value={(projectPayload.screenshots && projectPayload.screenshots[slotIdx]) || ''}
                              onChange={(url) => {
                                const newScreenshots = [...(projectPayload.screenshots || ['', '', '', '', ''])];
                                while (newScreenshots.length <= slotIdx) newScreenshots.push('');
                                newScreenshots[slotIdx] = url;
                                setProjectPayload({ ...projectPayload, screenshots: newScreenshots });
                              }}
                              placeholder="https://... or upload from system"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Short Summary / Teaser</label>
                      <input
                        type="text"
                        required
                        value={projectPayload.short_description}
                        onChange={(e) => setProjectPayload({ ...projectPayload, short_description: e.target.value })}
                        placeholder="Brief 1-2 line description of the project"
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Detailed Project Overview &amp; Specifications</label>
                      <textarea
                        rows={3}
                        required
                        value={projectPayload.description}
                        onChange={(e) => setProjectPayload({ ...projectPayload, description: e.target.value })}
                        placeholder="Complete architectural overview and delivery scope"
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Metrics Impact / Results Summary</label>
                      <input
                        type="text"
                        placeholder="e.g. Decreased latency by 72% and saved $1.2M annually..."
                        value={projectPayload.case_study}
                        onChange={(e) => setProjectPayload({ ...projectPayload, case_study: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Live Demo / Production URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={projectPayload.live_url}
                          onChange={(e) => setProjectPayload({ ...projectPayload, live_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">GitHub / Code Repository URL</label>
                        <input
                          type="text"
                          placeholder="https://github.com/..."
                          value={projectPayload.github_url}
                          onChange={(e) => setProjectPayload({ ...projectPayload, github_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProjectForm(false);
                          setEditingItem(null);
                          setProjectPayload({
                            title: '',
                            client_name: '',
                            category: 'Web',
                            custom_category: '',
                            technologies: '',
                            short_description: '',
                            description: '',
                            case_study: '',
                            live_url: '',
                            github_url: '',
                            completion_date: '',
                            thumbnail_url: '',
                            screenshots: ['', '', '', '', '']
                          });
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer">
                        {editingItem && editingItem.type === 'project' ? 'Save Changes' : 'Publish Client Project'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {adminProjects.map((p) => {
                    const screenshotCount = (Array.isArray(p.screenshots) ? p.screenshots : []).filter(Boolean).length;
                    return (
                      <div key={p.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <img src={p.thumbnail_url} alt={p.title} className="h-12 w-16 object-cover rounded-lg border border-slate-800" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="font-display font-bold text-white text-sm">{p.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[10px] font-mono text-slate-400">Client: <span className="text-white">{p.client_name}</span> &bull; Category: <span className="text-cyan-400">{p.category}</span></p>
                              {screenshotCount > 0 && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                                  📷 {screenshotCount} screenshots
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProject(p)}
                            className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Module: Leadership Team CMS */}
            {activeModule === 'about' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Board of Directors & Leadership CMS</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure and manage corporate board of directors and founders</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setTeamPayload({
                        name: '',
                        position: '',
                        bio: '',
                        skills: '',
                        photo_url: '',
                        experience_years: '',
                        sort_order: 1,
                        is_founder: false,
                        social_linkedin: '',
                        social_github: '',
                        social_twitter: '',
                        portfolio_url: ''
                      });
                      setShowTeamForm(!showTeamForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Board Member
                  </button>
                </div>

                {showTeamForm && (
                  <form onSubmit={handleCreateTeamMember} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'team' ? 'Edit Board/Team Member' : 'Create New Board/Team Member'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={teamPayload.name}
                          onChange={(e) => setTeamPayload({ ...teamPayload, name: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Executive Position / Title</label>
                        <input
                          type="text"
                          required
                          placeholder="Co-Founder & CEO"
                          value={teamPayload.position}
                          onChange={(e) => setTeamPayload({ ...teamPayload, position: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ImageUploadField
                        label="Photo"
                        value={teamPayload.photo_url}
                        onChange={(url) => setTeamPayload({ ...teamPayload, photo_url: url })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Years of Experience</label>
                        <input
                          type="text"
                          placeholder="10 Years"
                          value={teamPayload.experience_years}
                          onChange={(e) => setTeamPayload({ ...teamPayload, experience_years: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Sort Order</label>
                        <input
                          type="number"
                          value={teamPayload.sort_order}
                          onChange={(e) => setTeamPayload({ ...teamPayload, sort_order: Number(e.target.value) })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Skills (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="Leadership, Strategy, Cloud Architecture"
                        value={teamPayload.skills}
                        onChange={(e) => setTeamPayload({ ...teamPayload, skills: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Professional Biography</label>
                      <textarea
                        rows={3}
                        required
                        value={teamPayload.bio}
                        onChange={(e) => setTeamPayload({ ...teamPayload, bio: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    {/* Dynamic Social Media Channels Section for Co-Founders / Members */}
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                          Dynamic Social Media Channels
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(teamPayload.social_links || []).length} channel(s)
                        </span>
                      </div>

                      {/* Active Channels List */}
                      {(teamPayload.social_links || []).length > 0 ? (
                        <div className="space-y-2">
                          {(teamPayload.social_links || []).map((link, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                                {link.platform}
                              </span>
                              <input
                                type="text"
                                value={link.url}
                                onChange={(e) => {
                                  const updated = [...(teamPayload.social_links || [])];
                                  updated[sIdx].url = e.target.value;
                                  setTeamPayload({ ...teamPayload, social_links: updated });
                                }}
                                placeholder="https://..."
                                className="flex-1 text-xs bg-transparent border-none text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (teamPayload.social_links || []).filter((_, idx) => idx !== sIdx);
                                  setTeamPayload({ ...teamPayload, social_links: updated });
                                }}
                                className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 cursor-pointer"
                                title="Remove Channel"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] font-mono text-slate-500 italic">No social media channels added yet for this profile.</p>
                      )}

                      {/* Add Channel Controls */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 border-t border-slate-800">
                        <select
                          id="new_social_platform_select"
                          className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="GitHub">GitHub</option>
                          <option value="Twitter / X">Twitter / X</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Instagram">Instagram</option>
                          <option value="YouTube">YouTube</option>
                          <option value="TikTok">TikTok</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Telegram">Telegram</option>
                          <option value="Discord">Discord</option>
                          <option value="Medium">Medium</option>
                          <option value="Portfolio">Portfolio / Website</option>
                        </select>

                        <input
                          type="text"
                          id="new_social_url_input"
                          placeholder="https://linkedin.com/in/... or URL"
                          className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none min-w-[180px]"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const platformEl = document.getElementById('new_social_platform_select') as HTMLSelectElement;
                            const urlEl = document.getElementById('new_social_url_input') as HTMLInputElement;
                            if (urlEl && urlEl.value.trim()) {
                              const newLink = { platform: platformEl.value, url: urlEl.value.trim() };
                              setTeamPayload({
                                ...teamPayload,
                                social_links: [...(teamPayload.social_links || []), newLink]
                              });
                              urlEl.value = '';
                            }
                          }}
                          className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Channel</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="is_founder"
                        checked={teamPayload.is_founder}
                        onChange={(e) => setTeamPayload({ ...teamPayload, is_founder: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                      />
                      <label htmlFor="is_founder" className="text-xs font-mono text-slate-400 select-none">Identify as Founding Member</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTeamForm(false);
                          setEditingItem(null);
                          setTeamPayload({ name: '', position: '', bio: '', skills: '', photo_url: '', experience_years: '', sort_order: '10', is_founder: false, social_linkedin: '', social_github: '', social_twitter: '', portfolio_url: '', social_links: [] });
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer">
                        {editingItem && editingItem.type === 'team' ? 'Save Changes' : 'Add Board Member'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {adminTeam.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img src={t.photo_url} alt={t.name} className="h-10 w-10 object-cover rounded-full" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-display font-bold text-white text-sm">{t.name}</h4>
                          <p className="text-[10px] font-mono text-slate-500">{t.position} &bull; {t.experience_years}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTeamMember(t)}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                          title="Edit Board Member"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(t.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                          title="Delete Board Member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module: Products CMS */}
            {activeModule === 'products' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">SaroHub Software Products CMS</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure SaroHub modular software systems listed in the directory catalogs</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setProductPayload({
                        title: '',
                        thumbnail_url: '',
                        features: '',
                        short_description: '',
                        description: '',
                        demo_url: '',
                        video_url: '',
                        download_url: ''
                      });
                      setShowProductForm(!showProductForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Product
                  </button>
                </div>

                {showProductForm && (
                  <form onSubmit={handleCreateProduct} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'product' ? 'Edit Product Catalog Profile' : 'Create New Product Catalog Profile'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Product Title</label>
                        <input
                          type="text"
                          required
                          value={productPayload.title}
                          onChange={(e) => setProductPayload({ ...productPayload, title: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <ImageUploadField
                        label="Product Thumbnail Image"
                        value={productPayload.thumbnail_url}
                        onChange={(url) => setProductPayload({ ...productPayload, thumbnail_url: url })}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Key Features (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="Relational logging, Auto document generator, Dynamic multi-currency pipelines"
                        value={productPayload.features}
                        onChange={(e) => setProductPayload({ ...productPayload, features: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Short Description</label>
                      <input
                        type="text"
                        required
                        value={productPayload.short_description}
                        onChange={(e) => setProductPayload({ ...productPayload, short_description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Detailed Product Copy</label>
                      <textarea
                        rows={3}
                        required
                        value={productPayload.description}
                        onChange={(e) => setProductPayload({ ...productPayload, description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Demo Live URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={productPayload.demo_url}
                          onChange={(e) => setProductPayload({ ...productPayload, demo_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Demo Embed YouTube Video ID/URL</label>
                        <input
                          type="text"
                          placeholder="https://youtube.com/embed/..."
                          value={productPayload.video_url}
                          onChange={(e) => setProductPayload({ ...productPayload, video_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Installer Download URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={productPayload.download_url}
                          onChange={(e) => setProductPayload({ ...productPayload, download_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingItem(null);
                          setProductPayload({ title: '', thumbnail_url: '', features: '', short_description: '', description: '', demo_url: '', video_url: '', download_url: '' });
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 cursor-pointer">
                        {editingItem && editingItem.type === 'product' ? 'Save Changes' : 'Publish Product'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {adminProducts.map((pr) => (
                    <div key={pr.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img src={pr.thumbnail_url} alt={pr.title} className="h-10 w-16 object-cover rounded" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-display font-bold text-white text-sm">{pr.title}</h4>
                          <p className="text-[10px] font-mono text-slate-500">{pr.slug}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(pr)}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(pr.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 7: Live Support Desk Panel */}
            {activeModule === 'chats' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header Status & Availability Controller */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                      Live Chat Support Desk
                      <span className="animate-pulse block h-2 w-2 rounded-full bg-emerald-500" />
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time metadata communication matrix with corporate clients</p>
                  </div>

                  {/* Agent Availability selector */}
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
                    <span className="text-[10px] font-mono text-slate-500 px-2">Set Status:</span>
                    {(['online', 'away', 'offline'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateAgentStatus(status)}
                        className={`text-[9px] font-mono uppercase font-bold tracking-wider rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${agentAvailability === status
                          ? status === 'online'
                            ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                            : status === 'away'
                              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                              : 'bg-slate-500 text-slate-950 font-extrabold'
                          : 'text-slate-400 hover:text-white'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Split Pane */}
                <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">

                  {/* Left pane: Session List */}
                  <div className="w-full lg:w-1/3 space-y-3 lg:max-h-[550px] lg:overflow-y-auto">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        Active Tickets ({chatSessions.length})
                      </span>
                      {chatSessions.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllChats}
                          className="text-[9px] font-mono text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
                          title="Clear all assistant chats"
                        >
                          <Trash2 className="h-3 w-3" /> Clear All Chats
                        </button>
                      )}
                    </div>

                    {chatSessions.length === 0 ? (
                      <div className="bg-slate-950/30 rounded-2xl border border-slate-900 p-8 text-center">
                        <p className="text-slate-500 text-xs">No support channels opened currently.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chatSessions.map((sess) => {
                          const isSelected = selectedChatId === sess.id;
                          const unread = sess.agent_unread;
                          const isClosed = sess.status === 'closed';

                          return (
                            <button
                              key={sess.id}
                              onClick={() => {
                                setSelectedChatId(sess.id);
                                sess.agent_unread = false;
                                api.getChatSession(sess.id);
                              }}
                              className={`w-full text-left rounded-2xl p-4 border transition-all flex flex-col gap-2 relative cursor-pointer ${isSelected
                                ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                                : 'bg-slate-950/50 border-slate-900/60 hover:border-slate-800'
                                }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-xs font-bold text-white truncate max-w-[80%]">
                                  {sess.visitor_name}
                                </span>
                                <div className="flex gap-1 shrink-0">
                                  {unread && (
                                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold uppercase animate-pulse">
                                      Unread
                                    </span>
                                  )}
                                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${isClosed ? 'bg-slate-900 text-slate-500' : 'bg-emerald-950 text-emerald-400 border border-emerald-900/30'
                                    }`}>
                                    {sess.status}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-sans line-clamp-1 block">
                                {sess.visitor_email || 'No email attached'}
                              </span>
                              <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 border-t border-slate-900/30 pt-2 mt-1 w-full">
                                <span>ID: {sess.id.slice(-6).toUpperCase()}</span>
                                <span>{new Date(sess.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right pane: Active Conversation window */}
                  <div className="w-full lg:w-2/3 glass bg-slate-950/30 border border-slate-900/60 rounded-3xl p-6 flex flex-col min-h-[450px] lg:max-h-[550px]">
                    {selectedChatId ? (
                      (() => {
                        const session = chatSessions.find(s => s.id === selectedChatId);
                        if (!session) return <p className="text-slate-500 text-xs my-auto text-center">Ticket reference missing.</p>;
                        const isClosed = session.status === 'closed';

                        return (
                          <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Chat Window Header */}
                            <div className="border-b border-slate-900/80 pb-4 flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-display text-sm font-bold text-white">{session.visitor_name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{session.visitor_email || 'No registered email'}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteChatSession(session.id)}
                                  className="rounded bg-rose-950/40 border border-rose-800/50 px-3 py-1.5 text-[10px] font-mono text-rose-400 hover:bg-rose-900 tracking-wider font-semibold uppercase flex items-center gap-1 cursor-pointer"
                                  title="Delete & Clear Chat Session"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Clear Chat
                                </button>
                                {!isClosed && (
                                  <button
                                    onClick={() => handleCloseSession(session.id)}
                                    className="rounded bg-slate-900 border border-slate-800 px-3 py-1.5 text-[10px] font-mono text-amber-400 hover:bg-slate-800 tracking-wider font-semibold uppercase cursor-pointer"
                                  >
                                    Close Session
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Message Logs Area */}
                            <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1 min-h-[250px] max-h-[320px]">
                              {session.messages?.map((msg: any) => {
                                const isAgent = msg.sender === 'agent';
                                const isSystem = msg.sender === 'system';
                                const isAI = msg.text.startsWith('[AI Assistant]');
                                const text = isAI ? msg.text.replace('[AI Assistant]', '').trim() : msg.text;

                                if (isSystem) {
                                  return (
                                    <div key={msg.id} className="text-center py-1">
                                      <span className="inline-block rounded-md bg-slate-900/60 px-2.5 py-1 text-[9px] font-mono text-slate-500">
                                        {msg.text}
                                      </span>
                                    </div>
                                  );
                                }

                                return (
                                  <div key={msg.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'} items-start gap-2.5`}>
                                    {!isAgent && (
                                      <div className="h-7 w-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                        {session.visitor_name.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <div className={`flex flex-col max-w-[80%] ${isAgent ? 'items-end' : 'items-start'}`}>
                                      <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${isAgent
                                        ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tr-none'
                                        : 'bg-cyan-950/30 border border-cyan-500/20 text-cyan-100 rounded-tl-none font-sans'
                                        }`}>
                                        {isAI && <span className="font-mono text-[9px] text-cyan-400 font-bold tracking-wider block mb-1">AUTO COGNITIVE SYSTEM</span>}
                                        {text}
                                      </div>
                                      <span className="text-[8px] font-mono text-slate-600 mt-1">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Action Input Footer */}
                            {!isClosed ? (
                              <form onSubmit={handleSendAgentMessage} className="border-t border-slate-900/80 pt-4 mt-auto">
                                {/* Sparkles suggest-reply bar */}
                                <div className="flex justify-between items-center gap-3 mb-3">
                                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Operator Console</span>
                                  <button
                                    type="button"
                                    disabled={isGeneratingSuggestion}
                                    onClick={handleSuggestReply}
                                    className="text-[9px] font-mono font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 hover:bg-cyan-950 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
                                  >
                                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
                                    {isGeneratingSuggestion ? 'Synthesizing...' : 'Suggest AI Reply'}
                                  </button>
                                </div>

                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={chatReplyText}
                                    onChange={e => setChatReplyText(e.target.value)}
                                    placeholder={isGeneratingSuggestion ? "Reading conversation parameters..." : "Write message as support operator..."}
                                    disabled={isSendingReply}
                                    className="flex-1 text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                                  />
                                  <button
                                    type="submit"
                                    disabled={!chatReplyText.trim() || isSendingReply}
                                    className="rounded-xl bg-cyan-500 text-slate-950 font-bold px-4 py-3 hover:bg-cyan-400 text-xs font-mono uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                                  >
                                    Send
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="border-t border-slate-900/80 pt-4 text-center mt-auto">
                                <span className="text-[10px] font-mono text-slate-500 uppercase">This session is closed and archived.</span>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="my-auto text-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                          <MessageSquare className="h-6 w-6" />
                        </div>
                        <h4 className="font-display font-bold text-white text-sm">Secure Terminal Terminal</h4>
                        <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                          Select a client communications session from the session matrix to read context-history and engage operators.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* Module: Student Projects CMS */}
            {activeModule === 'student_projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                      SaroHub IT Academy — Student Projects CMS
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Manage and publish dynamic student capstone projects trained at our IT Center</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setStudentProjectPayload({
                        title: '',
                        student_name: '',
                        batch_course: '',
                        category: 'Full-Stack Software',
                        thumbnail_url: '',
                        images: ['', '', '', '', ''],
                        short_description: '',
                        description: '',
                        technologies: '',
                        live_url: '',
                        github_url: ''
                      });
                      setShowStudentProjectForm(!showStudentProjectForm);
                    }}
                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Add Student Project
                  </button>
                </div>

                {showStudentProjectForm && (
                  <form onSubmit={handleCreateStudentProject} className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">
                      {editingItem && editingItem.type === 'student_project' ? 'Edit Student Project Showcase' : 'Publish New Student Project'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Project Title</label>
                        <input
                          type="text"
                          required
                          value={studentProjectPayload.title}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, title: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="e.g. Smart Health Diagnostics Platform"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Student / Team Name(s)</label>
                        <input
                          type="text"
                          required
                          value={studentProjectPayload.student_name}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, student_name: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="e.g. Ruwan Silva & Team"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Batch / Course Title</label>
                        <input
                          type="text"
                          required
                          value={studentProjectPayload.batch_course}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, batch_course: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="e.g. Full-Stack Web Development - Batch 2026"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Category Domain</label>
                        <input
                          type="text"
                          required
                          value={studentProjectPayload.category}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, category: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="e.g. AI & Web SaaS, Cloud & IoT, Mobile Apps"
                        />
                      </div>
                    </div>

                    <div className="border border-slate-900 bg-slate-900/40 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                        <label className="block text-xs font-mono font-bold text-cyan-400">
                          📷 Project Showcase Images (Up to 5 Screenshots/Images)
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          {(studentProjectPayload.images || []).filter(img => typeof img === 'string' && img.trim()).length} / 5 Uploaded
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[0, 1, 2, 3, 4].map((idx) => (
                          <div key={idx}>
                            <ImageUploadField
                              label={`Image ${idx + 1} ${idx === 0 ? '(Cover Thumbnail)' : '(Optional)'}`}
                              value={(studentProjectPayload.images && studentProjectPayload.images[idx]) || ''}
                              onChange={(url) => {
                                const currentImages = Array.isArray(studentProjectPayload.images) ? [...studentProjectPayload.images] : ['', '', '', '', ''];
                                currentImages[idx] = url;
                                const coverImg = currentImages[0] || studentProjectPayload.thumbnail_url;
                                setStudentProjectPayload({
                                  ...studentProjectPayload,
                                  images: currentImages,
                                  thumbnail_url: coverImg
                                });
                              }}
                              placeholder={`https://... (Image ${idx + 1} URL or Upload)`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Short Description (Summary)</label>
                      <input
                        type="text"
                        required
                        value={studentProjectPayload.short_description}
                        onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, short_description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-500 mb-1">Full Technical Architecture & Description</label>
                      <textarea
                        rows={3}
                        value={studentProjectPayload.description}
                        onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, description: e.target.value })}
                        className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                        placeholder="Detailed copy about how the students built this project..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Technologies Trained (Comma separated)</label>
                        <input
                          type="text"
                          value={studentProjectPayload.technologies}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, technologies: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="React, Node.js, Python, Tailwind"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">Live Demo URL (Optional)</label>
                        <input
                          type="text"
                          value={studentProjectPayload.live_url}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, live_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1">GitHub Repo Link (Optional)</label>
                        <input
                          type="text"
                          value={studentProjectPayload.github_url}
                          onChange={(e) => setStudentProjectPayload({ ...studentProjectPayload, github_url: e.target.value })}
                          className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowStudentProjectForm(false);
                          setEditingItem(null);
                        }}
                        className="rounded border border-slate-800 px-4 py-2 text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 cursor-pointer"
                      >
                        {editingItem && editingItem.type === 'student_project' ? 'Save Changes' : 'Publish Student Project'}
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Student Projects */}
                <div className="grid grid-cols-1 gap-4">
                  {adminStudentProjects.length === 0 ? (
                    <div className="bg-slate-950/40 rounded-2xl border border-slate-900 p-8 text-center text-slate-500 text-xs">
                      No student projects recorded yet. Click "Add Student Project" above to create one.
                    </div>
                  ) : (
                    adminStudentProjects.map((sp) => (
                      <div key={sp.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 flex justify-between items-center gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={sp.thumbnail_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=450'}
                            alt={sp.title}
                            className="h-12 w-20 object-cover rounded-lg shrink-0 border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-white text-sm truncate">{sp.title}</h4>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold shrink-0">
                                {sp.category}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              Student: <strong className="text-white">{sp.student_name}</strong> &bull; {sp.batch_course}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEditStudentProject(sp)}
                            className="rounded bg-slate-900 border border-slate-800 p-2 text-cyan-400 hover:bg-slate-800 cursor-pointer"
                            title="Edit Student Project"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudentProject(sp.id)}
                            className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                            title="Delete Student Project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Module 8: Commercial Templates for Sale */}
            {activeModule === 'sale_projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Commercial Software Templates</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Control ready-made products and SaaS templates listed for sale</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setSaleProjectPayload({ title: '', price: '', technology: '', short_description: '', features: '', demo_url: '', video_url: '', screenshots: [], thumbnail_url: '' });
                      setShowSaleProjectForm(!showSaleProjectForm);
                    }}
                    className="rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                  >
                    <Plus className="h-4 w-4" /> {showSaleProjectForm ? 'Close Form' : 'Add Template'}
                  </button>
                </div>

                {showSaleProjectForm && (
                  <form onSubmit={handleCreateSaleProject} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">{editingItem ? 'Edit Template' : 'Add New Commercial Template'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Template Title</label>
                        <input
                          type="text"
                          value={saleProjectPayload.title}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, title: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Price (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={saleProjectPayload.price}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, price: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Technologies Used (comma separated)</label>
                        <input
                          type="text"
                          placeholder="React, Node.js, Express, MySQL"
                          value={saleProjectPayload.technology}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, technology: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <ImageUploadField
                        label="Thumbnail Image"
                        value={saleProjectPayload.thumbnail_url}
                        onChange={(url) => setSaleProjectPayload({ ...saleProjectPayload, thumbnail_url: url })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <ImageUploadField
                        label="Upload Additional Product Image"
                        value=""
                        multiple
                        onChange={(url) => setSaleProjectPayload(prev => ({ ...prev, screenshots: [...prev.screenshots, { url, description: '' }] }))}
                        placeholder="Upload from your system or paste an image URL"
                      />
                      {saleProjectPayload.screenshots.length > 0 && (
                        <div className="md:col-span-2 space-y-2">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Uploaded Additional Images</label>
                          {saleProjectPayload.screenshots.map((image, index) => (
                            <div key={`${image.url}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-2">
                              <img src={image.url} alt={image.description || `Additional image ${index + 1}`} className="h-14 w-20 rounded object-cover shrink-0" referrerPolicy="no-referrer" />
                              <input
                                type="text"
                                value={image.description}
                                onChange={e => setSaleProjectPayload(prev => ({
                                  ...prev,
                                  screenshots: prev.screenshots.map((entry, entryIndex) => entryIndex === index ? { ...entry, description: e.target.value } : entry)
                                }))}
                                placeholder="Image description"
                                className="min-w-0 flex-1 text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                              />
                              <button type="button" onClick={() => setSaleProjectPayload(prev => ({ ...prev, screenshots: prev.screenshots.filter((_, entryIndex) => entryIndex !== index) }))} className="rounded-lg p-2 text-rose-400 hover:bg-rose-950/40 cursor-pointer" title="Remove additional image">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Short Description</label>
                        <input
                          type="text"
                          value={saleProjectPayload.short_description}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, short_description: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Features / Modules (comma separated list)</label>
                        <input
                          type="text"
                          placeholder="Complete Admin Dashboard, JWT Auth, Interactive Analytics"
                          value={saleProjectPayload.features}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, features: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Live Demo URL</label>
                        <input
                          type="text"
                          value={saleProjectPayload.demo_url}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, demo_url: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Product Presentation / Demo Video URL (e.g. YouTube/Loom)</label>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={saleProjectPayload.video_url}
                          onChange={e => setSaleProjectPayload({ ...saleProjectPayload, video_url: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSaleProjectForm(false)}
                        className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 cursor-pointer">
                        {editingItem ? 'Update Template' : 'Save Template'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminSaleProjects.map((item) => (
                    <div key={item.id} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-bold text-white text-sm">{item.title}</h4>
                          <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-500/20 rounded px-2 py-0.5">${item.price}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.short_description}</p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.technology?.map((tech: string, index: number) => (
                            <span key={index} className="text-[9px] font-mono bg-slate-900 border border-slate-800/80 rounded text-slate-500 px-1.5 py-0.5">{tech}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 border-t border-slate-900/50 pt-4 mt-4">
                        <button
                          onClick={() => {
                            setEditingItem({ id: item.id, type: 'sale_project' });
                            setSaleProjectPayload({
                              title: item.title,
                              price: item.price.toString(),
                              technology: Array.isArray(item.technology) ? item.technology.join(', ') : '',
                              short_description: item.short_description,
                              features: Array.isArray(item.features) ? item.features.join(', ') : '',
                              demo_url: item.demo_url || '',
                              video_url: item.video_url || '',
                              screenshots: (Array.isArray(item.screenshots) ? item.screenshots : []).map((url: string, index: number) => ({
                                url,
                                description: Array.isArray(item.screenshot_descriptions) ? item.screenshot_descriptions[index] || '' : ''
                              })),
                              thumbnail_url: item.thumbnail_url || ''
                            });
                            setShowSaleProjectForm(true);
                          }}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSaleProject(item.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 9: Corporate Events */}
            {activeModule === 'events' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Corporate Conferences & Hackathons</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Publish community conferences, guest masterclasses, and tech hackathons</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setEventPayload({ title: '', banner_url: '', event_date: '', venue: '', description: '', registration_link: '', form_fields: [] });
                      setShowEventForm(!showEventForm);
                    }}
                    className="rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                  >
                    <Plus className="h-4 w-4" /> {showEventForm ? 'Close Form' : 'Publish Event'}
                  </button>
                </div>

                {showEventForm && (
                  <form onSubmit={handleCreateEvent} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">{editingItem ? 'Edit Corporate Event' : 'Add New Corporate Event'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Event Title *</label>
                        <input
                          type="text"
                          value={eventPayload.title}
                          onChange={e => setEventPayload({ ...eventPayload, title: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Event Date & Time *</label>
                        <input
                          type="text"
                          placeholder="Oct 12, 2026 - 10:00 AM"
                          value={eventPayload.event_date}
                          onChange={e => setEventPayload({ ...eventPayload, event_date: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Venue Location *</label>
                        <input
                          type="text"
                          placeholder="WTC Ballroom / Online Webinar"
                          value={eventPayload.venue}
                          onChange={e => setEventPayload({ ...eventPayload, venue: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <ImageUploadField
                        label="Banner Image"
                        value={eventPayload.banner_url}
                        onChange={(url) => setEventPayload({ ...eventPayload, banner_url: url })}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Event Details & Description *</label>
                        <textarea
                          rows={3}
                          value={eventPayload.description}
                          onChange={e => setEventPayload({ ...eventPayload, description: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Registration RSVP URL (Optional External Link Override)</label>
                        <input
                          type="text"
                          placeholder="Leave blank to use SaroHub's built-in dynamic RSVP form"
                          value={eventPayload.registration_link}
                          onChange={e => setEventPayload({ ...eventPayload, registration_link: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>

                      {/* DYNAMIC FORM FIELDS BUILDER SECTOR */}
                      <div className="md:col-span-2 border-t border-slate-800/80 pt-6 mt-4 space-y-4">
                        <div>
                          <h4 className="font-display font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <Settings className="h-4 w-4 text-cyan-400" /> Dynamic Event Registration Form Builder
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            Define custom input fields that attendees must fill out when registering for this corporate event on the public events page (T-shirt sizes, food restrictions, designations etc.).
                          </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Left Column: Form Fields List */}
                          <div className="lg:col-span-2 space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                            {(eventPayload.form_fields || []).length === 0 ? (
                              <div className="text-center py-10 bg-slate-950/25 border border-slate-900/40 rounded-xl flex flex-col items-center justify-center">
                                <Sparkles className="h-6 w-6 text-slate-600 mb-2 animate-pulse" />
                                <p className="text-xs text-slate-500 font-mono text-center px-4">No custom fields added yet. Only default Name and Email fields will be requested during registration.</p>
                              </div>
                            ) : (
                              (eventPayload.form_fields || []).map((field, idx) => (
                                <FieldSettingsEditor
                                  key={field.id}
                                  field={field}
                                  index={idx}
                                  totalFields={(eventPayload.form_fields || []).length}
                                  isExpanded={expandedFieldId === field.id}
                                  onToggleExpand={() => setExpandedFieldId(expandedFieldId === field.id ? null : field.id)}
                                  onUpdateField={(updated) => handleUpdateEventField(idx, updated)}
                                  onRemoveField={() => handleRemoveEventField(field.id)}
                                  onMoveField={(dir) => handleMoveEventField(idx, dir)}
                                  onMoveToLimit={(limit) => handleMoveEventFieldToLimit(idx, limit)}
                                />
                              ))
                            )}
                          </div>

                          {/* Right Column: Quick Create custom fields panel */}
                          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-3 self-start">
                            <h5 className="font-display font-bold text-slate-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                              <Plus className="h-3.5 w-3.5 text-cyan-400" /> Create Custom Field
                            </h5>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-500 mb-1">Field Type</label>
                              <select
                                value={eventNewFieldType}
                                onChange={(e) => setEventNewFieldType(e.target.value as any)}
                                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs text-white"
                              >
                                {FIELD_TYPES.map(t => (
                                  <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-500 mb-1">Field Label / Title *</label>
                              <input
                                type="text"
                                placeholder="e.g., Designation, Food allergies"
                                value={eventNewFieldLabel}
                                onChange={(e) => setEventNewFieldLabel(e.target.value)}
                                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-mono text-slate-500 mb-1">Placeholder (Optional)</label>
                              <input
                                type="text"
                                placeholder="e.g., Enter your details..."
                                value={eventNewFieldPlaceholder}
                                onChange={(e) => setEventNewFieldPlaceholder(e.target.value)}
                                className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                              />
                            </div>

                            {['dropdown', 'radio', 'checkbox_multi', 'multi_select'].includes(eventNewFieldType) && (
                              <div>
                                <label className="block text-[9px] font-mono text-cyan-400 mb-1 font-bold">Choices (Comma-separated) *</label>
                                <input
                                  type="text"
                                  placeholder="e.g., Choice A, Choice B, Choice C"
                                  value={eventNewFieldOptions}
                                  onChange={(e) => setEventNewFieldOptions(e.target.value)}
                                  className="w-full rounded bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                                />
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="checkbox"
                                id="event_field_req"
                                checked={eventNewFieldRequired}
                                onChange={(e) => setEventNewFieldRequired(e.target.checked)}
                                className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
                              />
                              <label htmlFor="event_field_req" className="text-[10px] font-mono text-slate-400 cursor-pointer select-none">
                                Mandatory input field
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddEventField}
                              className="w-full mt-2 rounded bg-slate-850 hover:bg-slate-700 border border-slate-750 text-slate-200 py-2 text-xs font-mono font-bold transition-all cursor-pointer"
                            >
                              + Append Field
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-850/60">
                      <button
                        type="button"
                        onClick={() => setShowEventForm(false)}
                        className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer"
                      >
                        {editingItem ? 'Save Changes' : 'Publish Event'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminEvents.map((item) => (
                    <div key={item.id} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-5 flex flex-col justify-between animate-fade-in">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-display font-bold text-white text-sm">{item.title}</h4>
                          {item.form_fields && item.form_fields.length > 0 && (
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/40 shrink-0">
                              Custom Form: {item.form_fields.length} fields
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5 mt-3">
                          <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-cyan-400" /> {item.event_date}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-cyan-400" /> {item.venue}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex justify-end gap-2 border-t border-slate-900/50 pt-4 mt-4">
                        <button
                          onClick={() => {
                            setEditingItem({ id: item.id, type: 'event' });
                            setEventPayload({
                              title: item.title,
                              banner_url: item.banner_url || '',
                              event_date: item.event_date,
                              venue: item.venue,
                              description: item.description,
                              registration_link: item.registration_link || '',
                              form_fields: item.form_fields || []
                            });
                            setShowEventForm(true);
                          }}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
                          title="Edit Event & Form Fields"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(item.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 10: Careers */}
            {activeModule === 'careers' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">Job Openings & Vacancy Matrices</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage job descriptions, required skill stacks, and experiences</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setCareerPayload({ position: '', department: '', salary: '', experience: '', skills: '', description: '', banner_url: '', is_active: true });
                      setShowCareerForm(!showCareerForm);
                    }}
                    className="rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                  >
                    <Plus className="h-4 w-4" /> {showCareerForm ? 'Close Form' : 'Publish Job'}
                  </button>
                </div>

                {showCareerForm && (
                  <form onSubmit={handleCreateCareer} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">{editingItem ? 'Edit Job Opening' : 'Add New Job Opening'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Job Position Title</label>
                        <input
                          type="text"
                          value={careerPayload.position}
                          onChange={e => setCareerPayload({ ...careerPayload, position: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Department Name</label>
                        <input
                          type="text"
                          placeholder="R&D, CyberSec, Enterprise Engineering"
                          value={careerPayload.department}
                          onChange={e => setCareerPayload({ ...careerPayload, department: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Salary Range / Package</label>
                        <input
                          type="text"
                          placeholder="Rs. 150,000 - Rs. 250,000 LKR / negotiable"
                          value={careerPayload.salary}
                          onChange={e => setCareerPayload({ ...careerPayload, salary: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Experience Target</label>
                        <input
                          type="text"
                          placeholder="3+ Years, Mid-Senior"
                          value={careerPayload.experience}
                          onChange={e => setCareerPayload({ ...careerPayload, experience: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Required Skills (comma separated list)</label>
                        <input
                          type="text"
                          placeholder="React, TypeScript, AWS, Next.js, Docker"
                          value={careerPayload.skills}
                          onChange={e => setCareerPayload({ ...careerPayload, skills: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Job Description & Responsibilities</label>
                        <textarea
                          rows={4}
                          value={careerPayload.description}
                          onChange={e => setCareerPayload({ ...careerPayload, description: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                          Banner Image <span className="text-slate-600">(Upload from system OR enter image URL link)</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/... or paste image URL link"
                            value={careerPayload.banner_url}
                            onChange={e => setCareerPayload({ ...careerPayload, banner_url: e.target.value })}
                            className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                          />
                          <label className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 px-4 py-3 text-xs font-mono text-cyan-400 cursor-pointer transition-colors">
                            <Plus className="h-4 w-4" />
                            <span>Upload from System</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setCareerPayload(prev => ({ ...prev, banner_url: reader.result as string }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {careerPayload.banner_url && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 relative group max-h-40">
                            <img src={careerPayload.banner_url} alt="Banner preview" className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            <button
                              type="button"
                              onClick={() => setCareerPayload({ ...careerPayload, banner_url: '' })}
                              className="absolute top-2 right-2 rounded-lg bg-rose-950/80 text-rose-400 px-2.5 py-1 text-xs font-mono border border-rose-800 hover:bg-rose-900 cursor-pointer"
                            >
                              Remove Banner
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="jobActive"
                          checked={careerPayload.is_active}
                          onChange={e => setCareerPayload({ ...careerPayload, is_active: e.target.checked })}
                          className="rounded bg-slate-950 border-slate-800 text-cyan-500 h-4 w-4 cursor-pointer"
                        />
                        <label htmlFor="jobActive" className="text-xs font-mono text-slate-300 select-none cursor-pointer">Active vacancy (accepts submissions)</label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCareerForm(false)}
                        className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer"
                      >
                        {editingItem ? 'Save Changes' : 'Publish Job'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminCareers.map((item) => (
                    <div key={item.id} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-bold text-white text-sm">{item.position}</h4>
                          <span className={`text-[10px] font-mono tracking-wider font-extrabold uppercase rounded px-2 py-0.5 border ${item.is_active
                            ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500'
                            }`}>
                            {item.is_active ? 'Active' : 'Draft'}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-1">{item.department}</div>
                        <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-900/40 rounded-xl border border-slate-900 p-3 text-[11px] font-mono text-slate-400">
                          <div>
                            <span className="block text-[8px] uppercase text-slate-600 tracking-wider">Salary</span>
                            {item.salary}
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-slate-600 tracking-wider">Experience</span>
                            {item.experience}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-4">
                          {item.skills?.map((skill: string, index: number) => (
                            <span key={index} className="text-[9px] font-mono bg-slate-900 border border-slate-800/80 rounded text-slate-400 px-1.5 py-0.5">{skill}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 border-t border-slate-900/50 pt-4 mt-4">
                        <button
                          onClick={() => {
                            setEditingItem({ id: item.id, type: 'career' });
                            setCareerPayload({
                              position: item.position,
                              department: item.department,
                              salary: item.salary,
                              experience: item.experience,
                              skills: Array.isArray(item.skills) ? item.skills.join(', ') : '',
                              description: item.description,
                              banner_url: item.banner_url || '',
                              is_active: !!item.is_active
                            });
                            setShowCareerForm(true);
                          }}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCareer(item.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 11: FAQs */}
            {activeModule === 'faqs' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">FAQs Knowledgebase CMS</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Maintain frequent corporate services questions and answers</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setFaqPayload({ category: 'General', question: '', answer: '' });
                      setShowFAQForm(!showFAQForm);
                    }}
                    className="rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                  >
                    <Plus className="h-4 w-4" /> {showFAQForm ? 'Close Form' : 'Add FAQ'}
                  </button>
                </div>

                {showFAQForm && (
                  <form onSubmit={handleCreateFAQ} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">{editingItem ? 'Edit FAQ Entry' : 'Add New FAQ Entry'}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">FAQ Category</label>
                        <input
                          type="text"
                          placeholder="General, Custom Development, Pricing, Integration"
                          value={faqPayload.category}
                          onChange={e => setFaqPayload({ ...faqPayload, category: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Question Formulation</label>
                        <input
                          type="text"
                          value={faqPayload.question}
                          onChange={e => setFaqPayload({ ...faqPayload, question: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Corporate Response / Answer</label>
                        <textarea
                          rows={4}
                          value={faqPayload.answer}
                          onChange={e => setFaqPayload({ ...faqPayload, answer: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowFAQForm(false)}
                        className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer"
                      >
                        {editingItem ? 'Save Changes' : 'Submit FAQ'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {adminFAQs.map((item) => (
                    <div key={item.id} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-5 flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <span className="inline-block text-[9px] font-mono uppercase bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded px-2 py-0.5 mb-2 font-bold tracking-wider">{item.category}</span>
                        <h4 className="font-display font-bold text-white text-sm">{item.question}</h4>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.answer}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingItem({ id: item.id, type: 'faq' });
                            setFaqPayload({
                              category: item.category,
                              question: item.question,
                              answer: item.answer
                            });
                            setShowFAQForm(true);
                          }}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFAQ(item.id)}
                          className="rounded bg-rose-950/20 border border-rose-900/50 p-2 text-rose-400 hover:bg-rose-950 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 12: SEO Configurations */}
            {activeModule === 'seo' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">SEO Marketing Configs</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Optimize meta-titles, keywords, and descriptions for search indexing bots</p>
                  </div>
                  <button
                    onClick={() => {
                      setSeoPayload({ page_route: 'home', meta_title: '', meta_description: '', meta_keywords: '' });
                      setShowSEOForm(!showSEOForm);
                    }}
                    className="rounded-xl bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                  >
                    <Plus className="h-4 w-4" /> {showSEOForm ? 'Close Panel' : 'Sync Meta Profile'}
                  </button>
                </div>

                {showSEOForm && (
                  <form onSubmit={handleSaveSEO} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-display font-bold text-white text-sm">Synchronize Page SEO Blueprint</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Target Route Identifier</label>
                        <select
                          value={seoPayload.page_route}
                          onChange={e => setSeoPayload({ ...seoPayload, page_route: e.target.value })}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40 cursor-pointer"
                        >
                          <option value="home">Homepage (/) </option>
                          <option value="services">Services (/services) </option>
                          <option value="projects">Case Studies (/projects) </option>
                          <option value="products">Digital Products (/products) </option>
                          <option value="about">About & Leadership (/about) </option>
                          <option value="blogs">Research Blogs (/blogs) </option>
                          <option value="careers">Careers Portals (/careers) </option>
                          <option value="events">Corporate Events (/events) </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Index Meta Title</label>
                        <input
                          type="text"
                          value={seoPayload.meta_title}
                          onChange={e => setSeoPayload({ ...seoPayload, meta_title: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Index Target Keywords (comma separated)</label>
                        <input
                          type="text"
                          value={seoPayload.meta_keywords}
                          onChange={e => setSeoPayload({ ...seoPayload, meta_keywords: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Index Meta Description</label>
                        <textarea
                          rows={3}
                          value={seoPayload.meta_description}
                          onChange={e => setSeoPayload({ ...seoPayload, meta_description: e.target.value })}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSEOForm(false)}
                        className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer"
                      >
                        Sync Profile
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {adminSEO.map((item) => (
                    <div key={item.id} className="bg-slate-950/40 rounded-2xl border border-slate-900 p-5">
                      <div className="flex justify-between items-start border-b border-slate-900/60 pb-3 mb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
                            Route: /{item.page_route === 'home' ? '' : item.page_route}
                          </span>
                          <h4 className="font-display font-bold text-white text-sm mt-2">{item.meta_title}</h4>
                        </div>
                        <button
                          onClick={() => {
                            setSeoPayload({
                              page_route: item.page_route,
                              meta_title: item.meta_title,
                              meta_description: item.meta_description,
                              meta_keywords: item.meta_keywords
                            });
                            setShowSEOForm(true);
                          }}
                          className="rounded bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.meta_description}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-2.5">
                        <span className="text-slate-600">Keywords:</span> {item.meta_keywords}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module 13: Newsletter Subscribers */}
            {activeModule === 'newsletter' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <h2 className="font-display text-xl font-bold text-white">Newsletter Subscriptions Matrix</h2>
                  <p className="text-xs text-slate-500 mt-0.5">View weekly technical research paper subscribers</p>
                </div>

                <div className="glass rounded-2xl border border-slate-900 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-900 font-mono text-[9px] uppercase tracking-wider text-slate-400">
                        <th className="p-4">Subscriber ID</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Subscription Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {adminNewsletter.length > 0 ? (
                        adminNewsletter.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-900/10">
                            <td className="p-4 font-mono text-[10px] text-slate-500">#SUB-{1000 + sub.id}</td>
                            <td className="p-4 font-mono text-white">{sub.email}</td>
                            <td className="p-4 text-slate-400">{new Date(sub.subscribed_at).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                            <td className="p-4">
                              <span className="inline-block text-[8px] font-mono font-extrabold uppercase bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded px-1.5 py-0.5">ACTIVE</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-xs">No active newsletter subscription profiles recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Module: Partners & Investors */}
            {activeModule === 'partners' && (
              <div className="animate-fade-in">
                <AdminPartnersModule onNotify={(title, message) => setAdminAlert({ title, message })} />
              </div>
            )}

            {/* Module 14: System Settings */}
            {activeModule === 'settings' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-950/40 rounded-2xl border border-slate-900 p-6">
                  <h2 className="font-display text-xl font-bold text-white">Enterprise System Settings</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Synchronize corporate addresses, secure support emails, and manage administrator credentials</p>
                </div>

                {/* Profile Setting Form */}
                <form onSubmit={handleUpdateProfile} className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm">Administrator Profile Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Admin Username</label>
                      <input
                        type="text"
                        value={profileUsername}
                        onChange={e => setProfileUsername(e.target.value)}
                        required
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profileFullName}
                        onChange={e => setProfileFullName(e.target.value)}
                        required
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={e => setProfileEmail(e.target.value)}
                        required
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Biography</label>
                      <input
                        type="text"
                        value={profileBio}
                        onChange={e => setProfileBio(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                    >
                      Update Profile
                    </button>
                  </div>
                </form>

                {/* Security Credentials Form */}
                <form onSubmit={handleChangePassword} className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-4">
                  <h3 className="font-display font-bold text-white text-sm">Security & Access Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                    >
                      Change Password
                    </button>
                  </div>
                </form>

                <form onSubmit={handleUpdateSettings} className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-6">

                  {/* ── Hero Section Settings ── */}
                  <div>
                    <h3 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
                      Hero Section Text
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-4">Controls the main heading, gradient accent word, supporting description, and the rotating typed phrases on the homepage hero.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Hero Main Heading</label>
                        <input
                          type="text"
                          value={heroHeading}
                          onChange={e => setHeroHeading(e.target.value)}
                          placeholder="Turning Vision Into"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Gradient Accent Word / Phrase</label>
                        <input
                          type="text"
                          value={heroHeadingAccent}
                          onChange={e => setHeroHeadingAccent(e.target.value)}
                          placeholder="Ventures."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Hero Supporting Description</label>
                        <textarea
                          rows={3}
                          value={heroDescription}
                          onChange={e => setHeroDescription(e.target.value)}
                          placeholder="We turn ambitious ideas into technology-driven ventures..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Rotating Typed Phrases (JSON Array)</label>
                        <textarea
                          rows={3}
                          value={heroTypedPhrases}
                          onChange={e => setHeroTypedPhrases(e.target.value)}
                          placeholder={'["Building Scalable Ventures","Developing AI-Powered Products","Turning Ideas Into Reality"]'}
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-cyan-500/40"
                        />
                        <p className="text-[9px] text-slate-500 mt-1">Enter a valid JSON array of strings. Leave empty to use the default phrases.</p>
                      </div>
                    </div>
                  </div>

                  {/* ── Company Overview / Mission / Vision ── */}
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                      Company Overview, Mission &amp; Vision
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-4">Text shown in the "Company Overview" section on the homepage and about page, including mission and vision card text.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Overview Section Heading</label>
                        <input
                          type="text"
                          value={overviewTitle}
                          onChange={e => setOverviewTitle(e.target.value)}
                          placeholder="We Turn Ideas Into Ventures."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Overview Tagline / Sub-caption</label>
                        <input
                          type="text"
                          value={overviewTagline}
                          onChange={e => setOverviewTagline(e.target.value)}
                          placeholder="Founded in Gilgit-Baltistan, Pakistan."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Overview Description Paragraph</label>
                        <textarea
                          rows={3}
                          value={overviewDescription}
                          onChange={e => setOverviewDescription(e.target.value)}
                          placeholder="SaroHub Technologies is an entrepreneurship-driven technology company..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Our Mission Statement</label>
                        <textarea
                          rows={3}
                          value={missionText}
                          onChange={e => setMissionText(e.target.value)}
                          placeholder="To turn ambition into ventures by combining entrepreneurship, technology, AI..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Our Vision Statement</label>
                        <textarea
                          rows={3}
                          value={visionText}
                          onChange={e => setVisionText(e.target.value)}
                          placeholder="To become a global force in venture creation..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Why Choose Us ── */}
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" />
                      Why Choose Us Section
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-4">Controls the heading, subtitle, and all 4 reason cards in the "Why Build With SaroHub?" section.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Section Heading</label>
                        <input
                          type="text"
                          value={whyHeading}
                          onChange={e => setWhyHeading(e.target.value)}
                          placeholder="Why Build With SaroHub?"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Section Subtitle</label>
                        <input
                          type="text"
                          value={whySubtitle}
                          onChange={e => setWhySubtitle(e.target.value)}
                          placeholder="Combining entrepreneurial insight, product-driven engineering..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── CEO Message ── */}
                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-4">CEO Message &amp; Leadership Vision Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">CEO Name</label>
                        <input
                          type="text"
                          value={ceoName}
                          onChange={e => setCeoName(e.target.value)}
                          placeholder="Mehdi Hassan"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">CEO Executive Title</label>
                        <input
                          type="text"
                          value={ceoTitle}
                          onChange={e => setCeoTitle(e.target.value)}
                          placeholder="CEO & Founder"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <ImageUploadField
                        label="CEO Profile Photo"
                        value={ceoPhoto}
                        onChange={(url) => setCeoPhoto(url)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">CEO Statement / Message</label>
                      <textarea
                        rows={6}
                        value={ceoMessage}
                        onChange={e => setCeoMessage(e.target.value)}
                        placeholder="Write the message from the CEO..."
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                      />
                    </div>

                    {/* CEO Leadership Metrics Settings */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                      <label className="block text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-3">
                        Leadership Metrics &amp; Key Figures (Dynamic)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Founder Year</label>
                          <input
                            type="text"
                            value={founderYear}
                            onChange={e => setFounderYear(e.target.value)}
                            placeholder="2022"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Fully Registered Year</label>
                          <input
                            type="text"
                            value={registeredYear}
                            onChange={e => setRegisteredYear(e.target.value)}
                            placeholder="2026"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Ventures &amp; SaaS Metric</label>
                          <input
                            type="text"
                            value={ceoVenturesSaas}
                            onChange={e => setCeoVenturesSaas(e.target.value)}
                            placeholder="5+ Built"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Engineering Team Metric</label>
                          <input
                            type="text"
                            value={ceoEngineeringTeam}
                            onChange={e => setCeoEngineeringTeam(e.target.value)}
                            placeholder="20+ Minds"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-2">
                          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Strategic Focus Metric</label>
                          <input
                            type="text"
                            value={ceoStrategicFocus}
                            onChange={e => setCeoStrategicFocus(e.target.value)}
                            placeholder="GB & Global"
                            className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h3 className="font-display font-bold text-white text-sm mb-4">Corporate Physical & Electronic Address Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Registered Office Address</label>
                        <input
                          type="text"
                          value={officeAdd}
                          onChange={e => setOfficeAdd(e.target.value)}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Primary Support & Sales Email</label>
                        <input
                          type="email"
                          value={compMail}
                          onChange={e => setCompMail(e.target.value)}
                          required
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          value={compPhone}
                          onChange={e => setCompPhone(e.target.value)}
                          placeholder="+92 343 0381471"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">WhatsApp Number</label>
                        <input
                          type="text"
                          value={compWhatsapp}
                          onChange={e => setCompWhatsapp(e.target.value)}
                          placeholder="+92 343 0381471"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Business Hours</label>
                        <input
                          type="text"
                          value={compHours}
                          onChange={e => setCompHours(e.target.value)}
                          placeholder="Monday - Friday: 9:00 AM - 6:00 PM (PKT)"
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="font-display font-bold text-white text-sm mb-3">Official Social Media Channels</h4>
                    <p className="text-[10px] text-slate-500 mb-4">Enter the full URL for each social platform. Leave empty to hide the icon from public pages.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Facebook</label>
                        <input
                          type="text"
                          value={smFacebook}
                          onChange={e => setSmFacebook(e.target.value)}
                          placeholder="https://facebook.com/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">LinkedIn</label>
                        <input
                          type="text"
                          value={smLinkedin}
                          onChange={e => setSmLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/company/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Twitter / X</label>
                        <input
                          type="text"
                          value={smTwitter}
                          onChange={e => setSmTwitter(e.target.value)}
                          placeholder="https://twitter.com/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Instagram</label>
                        <input
                          type="text"
                          value={smInstagram}
                          onChange={e => setSmInstagram(e.target.value)}
                          placeholder="https://instagram.com/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">GitHub</label>
                        <input
                          type="text"
                          value={smGithub}
                          onChange={e => setSmGithub(e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">YouTube</label>
                        <input
                          type="text"
                          value={smYoutube}
                          onChange={e => setSmYoutube(e.target.value)}
                          placeholder="https://youtube.com/@..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">TikTok</label>
                        <input
                          type="text"
                          value={smTiktok}
                          onChange={e => setSmTiktok(e.target.value)}
                          placeholder="https://tiktok.com/@..."
                          className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/40"
                        />
                      </div>
                    </div>

                    {/* Dynamic Custom Company Channels Manager */}
                    <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Additional Dynamic Company Channels</h5>
                        <span className="text-[10px] text-slate-500 font-mono">{customCompanySocials.length} dynamic channel(s)</span>
                      </div>

                      {customCompanySocials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {customCompanySocials.map((channel, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                                {channel.platform}
                              </span>
                              <input
                                type="text"
                                value={channel.url}
                                onChange={(e) => {
                                  const updated = [...customCompanySocials];
                                  updated[cIdx].url = e.target.value;
                                  setCustomCompanySocials(updated);
                                }}
                                placeholder="https://..."
                                className="flex-1 text-xs bg-transparent border-none text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomCompanySocials(customCompanySocials.filter((_, idx) => idx !== cIdx));
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10 cursor-pointer"
                                title="Delete Channel"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] font-mono text-slate-500 italic">No extra dynamic channels added. Add custom channels like WhatsApp, Telegram, Discord, Medium, Threads below.</p>
                      )}

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2">
                        <select
                          id="new_company_social_platform"
                          className="text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                        >
                          <option value="WhatsApp">WhatsApp Channel</option>
                          <option value="Telegram">Telegram Group</option>
                          <option value="Discord">Discord Server</option>
                          <option value="Medium">Medium Blog</option>
                          <option value="LinkedIn">LinkedIn Company</option>
                          <option value="Twitter / X">Twitter / X</option>
                          <option value="Facebook">Facebook Page</option>
                          <option value="Instagram">Instagram</option>
                          <option value="YouTube">YouTube Channel</option>
                          <option value="Portfolio">Custom Website / Portal</option>
                        </select>

                        <input
                          type="text"
                          id="new_company_social_url"
                          placeholder="https://chat.whatsapp.com/... or URL"
                          className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none min-w-[200px]"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            const platformEl = document.getElementById('new_company_social_platform') as HTMLSelectElement;
                            const urlEl = document.getElementById('new_company_social_url') as HTMLInputElement;
                            if (urlEl && urlEl.value.trim()) {
                              setCustomCompanySocials([
                                ...customCompanySocials,
                                { platform: platformEl.value, url: urlEl.value.trim() }
                              ]);
                              urlEl.value = '';
                            }
                          }}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Company Channel</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="rounded-xl bg-cyan-500 text-slate-950 px-5 py-2.5 text-xs font-bold font-mono uppercase tracking-wider cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                    >
                      Synchronize Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeModule === 'opportunities' && (
              <div className="space-y-6 animate-fade-in">
                <AdminOpportunitiesModule onNotify={(title, msg) => setAdminAlert({ title, message: msg })} />
              </div>
            )}

            {activeModule === 'ventures' && (
              <div className="space-y-6 animate-fade-in">
                <VentureAdmin />
              </div>
            )}

            {activeModule === 'partners' && (
              <div className="space-y-6 animate-fade-in">
                <AdminPartnersModule onNotify={(title, msg) => setAdminAlert({ title, message: msg })} />
              </div>
            )}

          </div>

        </div>

        {/* Custom Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-display font-bold text-white text-lg mb-2">Are you absolutely sure?</h3>
              <p className="text-sm text-slate-400 mb-6">{deleteConfirm.message}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteConfirm.onConfirm();
                    setDeleteConfirm(null);
                  }}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Alert Modal */}
        {adminAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-display font-bold text-white text-lg mb-2">{adminAlert.title}</h3>
              <p className="text-sm text-slate-400 mb-6">{adminAlert.message}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setAdminAlert(null)}
                  className="px-4 py-2 text-xs font-mono rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
