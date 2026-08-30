import React, { useState } from 'react';
import { Calendar, MapPin, ArrowUpRight, X, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../api';
import DynamicFormField from '../opportunities/DynamicFormField';
import { OpportunityField } from '../../types';

interface EventsProps {
  events: any[];
}

const nameField: OpportunityField = {
  id: 'applicant_name',
  type: 'full_name',
  label: 'Full Name',
  required: true,
  placeholder: 'Enter your full name'
};

const emailField: OpportunityField = {
  id: 'applicant_email',
  type: 'email',
  label: 'Email Address',
  required: true,
  placeholder: 'e.g., mail@domain.com'
};

export default function UpcomingEvents({ events }: EventsProps) {
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<any | null>(null);
  const [rsvpPayload, setRsvpPayload] = useState({
    applicant_name: '',
    applicant_email: '',
    form_data: {} as { [key: string]: any }
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Format Date Helper
  const formatEventDate = (isoString: string) => {
    try {
      if (!isoString) return { day: 'TBA', month: 'EVENT', full: 'Schedule Pending' };
      const date = new Date(isoString);
      if (isNaN(date.getTime())) {
        return { day: 'TBA', month: 'EVENT', full: isoString };
      }
      return {
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        full: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
      };
    } catch {
      return { day: 'TBA', month: 'EVENT', full: isoString || 'Schedule Pending' };
    }
  };

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!rsvpPayload.applicant_name.trim()) {
      tempErrors.applicant_name = 'Full Name is required.';
    }
    if (!rsvpPayload.applicant_email.trim()) {
      tempErrors.applicant_email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(rsvpPayload.applicant_email)) {
      tempErrors.applicant_email = 'Invalid Email format.';
    }

    // Validate custom fields
    if (selectedEventForRsvp && selectedEventForRsvp.form_fields) {
      selectedEventForRsvp.form_fields.forEach((field: any) => {
        if (field.disabled) return;
        const val = rsvpPayload.form_data[field.id];
        
        // Check required
        if (field.required) {
          if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
            tempErrors[field.id] = field.validation?.customErrorMessage || `${field.label} is required.`;
            return;
          }
        }

        // Min/Max Length checks
        if (typeof val === 'string' && val.trim() !== '') {
          if (field.validation?.minLength && val.length < field.validation.minLength) {
            tempErrors[field.id] = field.validation.customErrorMessage || `${field.label} must be at least ${field.validation.minLength} characters.`;
          }
          if (field.validation?.maxLength && val.length > field.validation.maxLength) {
            tempErrors[field.id] = field.validation.customErrorMessage || `${field.label} must not exceed ${field.validation.maxLength} characters.`;
          }
        }

        // Min/Max Value checks for number
        if (field.type === 'number' && val !== undefined && val !== '') {
          const numVal = parseFloat(val);
          if (field.validation?.minValue !== undefined && numVal < field.validation.minValue) {
            tempErrors[field.id] = field.validation.customErrorMessage || `${field.label} must be at least ${field.validation.minValue}.`;
          }
          if (field.validation?.maxValue !== undefined && numVal > field.validation.maxValue) {
            tempErrors[field.id] = field.validation.customErrorMessage || `${field.label} must be maximum ${field.validation.maxValue}.`;
          }
        }
      });
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForRsvp) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await api.submitEventRegistration(selectedEventForRsvp.id, {
        applicant_name: rsvpPayload.applicant_name,
        applicant_email: rsvpPayload.applicant_email,
        form_data: rsvpPayload.form_data
      });
      setSuccessMessage(response.message || 'Successfully registered for the event!');
    } catch (err: any) {
      setErrors({ global: err.message || 'Something went wrong during registration.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="upcoming-events" 
      className="py-24 relative border-t border-b grid-bg"
      style={{ 
        backgroundColor: 'var(--bg-app)', 
        borderColor: 'var(--border-app)' 
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/8 border border-blue-500/20 text-blue-400">
            Corporate Engagements
          </span>
          <h2 
            className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-6"
            style={{ color: 'var(--text-main)' }}
          >
            Upcoming Events & Webinars
          </h2>
          <p 
            className="mt-4 text-sm font-medium leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            Join SaroHub founders and engineers in interactive forums discussing system optimization, database integrity, and cognitive microservices.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Showing <strong>{events.length}</strong> {events.length === 1 ? 'upcoming event' : 'upcoming events'}
          </p>
        </div>

        {events.length === 0 ? (
          <div 
            className="text-center py-16 rounded-2xl border font-medium text-sm"
            style={{ 
              backgroundColor: 'var(--bg-card)', 
              borderColor: 'var(--border-app)',
              color: 'var(--text-muted)'
            }}
          >
            No upcoming events are registered on the schedule.
          </div>
        ) : (
          <div className="space-y-8">
            {events.map((event, idx) => {
              const dateMeta = formatEventDate(event.event_date);

              return (
                <motion.div
                  key={event.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border overflow-hidden flex flex-col lg:flex-row gap-8 p-6 transition-all duration-300 premium-card-hover"
                  style={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-app)' 
                  }}
                >
                  {/* Visual Date Badge + Thumbnail */}
                  <div className="w-full lg:w-1/3 relative h-56 rounded-xl overflow-hidden shrink-0 border bg-white/[0.02]" style={{ borderColor: 'var(--border-app)' }}>
                    <img
                      src={event.banner_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800&h=450'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-900/10" />
                    
                    {/* Calendar Badge overlay */}
                    <div 
                      className="absolute top-4 left-4 h-14 w-14 rounded-xl border flex flex-col items-center justify-center shadow-md font-mono bg-black/85 backdrop-blur"
                      style={{ borderColor: 'var(--border-app)' }}
                    >
                      <span className="text-blue-400 text-xs font-extrabold leading-none">{dateMeta.month}</span>
                      <span className="text-sm font-black mt-1 leading-none" style={{ color: 'var(--text-main)' }}>{dateMeta.day}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <span>{dateMeta.full}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <span>{event.venue || ' HQ Hybrid Portal'}</span>
                        </div>
                      </div>

                      <h3 className="font-display text-xl font-black leading-snug" style={{ color: 'var(--text-main)' }}>
                        {event.title}
                      </h3>
                      <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-body)' }}>
                        {event.description}
                      </p>
                    </div>

                    {/* Registration CTA */}
                    <div className="pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border-app)' }}>
                      {/* Internal Reserve Seats Button */}
                      <button
                        onClick={() => {
                          setSelectedEventForRsvp(event);
                          setRsvpPayload({ applicant_name: '', applicant_email: '', form_data: {} });
                          setErrors({});
                          setSuccessMessage(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-500/10 active:scale-95 mr-2"
                      >
                        Reserve Seats
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                      {/* External Link button removed - only Reserve Seats button remains */}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* DYNAMIC RSVP REGISTRATION MODAL */}
      <AnimatePresence>
        {selectedEventForRsvp && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="border w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-2xl"
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-app)' 
              }}
            >
              {/* Modal Header */}
              <div className="p-5 flex items-start justify-between border-b" style={{ borderColor: 'var(--border-app)', backgroundColor: 'var(--bg-app)' }}>
                <div>
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-blue-500/8 border border-blue-500/20 text-blue-400 uppercase">
                    Event RSVP Registration
                  </span>
                  <h3 className="font-display font-black text-base mt-2" style={{ color: 'var(--text-main)' }}>
                    {selectedEventForRsvp.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEventForRsvp(null)}
                  className="p-1 rounded-lg transition-colors text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                {successMessage ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>RSVP Confirmed!</h4>
                      <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-body)' }}>
                        {successMessage}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEventForRsvp(null)}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    <p 
                      className="text-xs leading-relaxed border rounded-xl p-3 flex items-start gap-2"
                      style={{ 
                        backgroundColor: 'var(--bg-app)', 
                        borderColor: 'var(--border-app)',
                        color: 'var(--text-body)'
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
                      <span>Please fill out the form below to register your reservation. Seats are limited and allocated on a first-come, first-served basis.</span>
                    </p>

                    {errors.global && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{errors.global}</span>
                      </div>
                    )}

                    {/* Standard Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DynamicFormField
                        field={nameField}
                        value={rsvpPayload.applicant_name}
                        onChange={(val) => {
                          setRsvpPayload(prev => ({ ...prev, applicant_name: val }));
                          if (errors.applicant_name) {
                            setErrors(prev => {
                              const copy = { ...prev };
                              delete copy.applicant_name;
                              return copy;
                            });
                          }
                        }}
                        error={errors.applicant_name}
                      />

                      <DynamicFormField
                        field={emailField}
                        value={rsvpPayload.applicant_email}
                        onChange={(val) => {
                          setRsvpPayload(prev => ({ ...prev, applicant_email: val }));
                          if (errors.applicant_email) {
                            setErrors(prev => {
                              const copy = { ...prev };
                              delete copy.applicant_email;
                              return copy;
                            });
                          }
                        }}
                        error={errors.applicant_email}
                      />
                    </div>

                    {/* Dynamic Custom Inputs defined by Admin */}
                    {selectedEventForRsvp.form_fields && selectedEventForRsvp.form_fields.length > 0 && (
                      <div className="border-t pt-4 mt-4 space-y-4" style={{ borderColor: 'var(--border-app)' }}>
                        <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400">
                          Additional Event-Specific Information
                        </h4>
                        <div className="space-y-4">
                          {selectedEventForRsvp.form_fields.map((field: any) => (
                            <DynamicFormField
                              key={field.id}
                              field={field}
                              value={rsvpPayload.form_data[field.id]}
                              onChange={(val) => {
                                setRsvpPayload(prev => ({
                                  ...prev,
                                  form_data: {
                                    ...prev.form_data,
                                    [field.id]: val
                                  }
                                }));
                                if (errors[field.id]) {
                                  setErrors(prev => {
                                    const copy = { ...prev };
                                    delete copy[field.id];
                                    return copy;
                                  });
                                }
                              }}
                              error={errors[field.id]}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-6 border-t mt-6" style={{ borderColor: 'var(--border-app)' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedEventForRsvp(null)}
                        className="px-4 py-2 text-xs font-semibold rounded-lg transition-all border text-slate-400 bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/10"
                      >
                        {isSubmitting ? 'Registering...' : 'Confirm RSVP'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
