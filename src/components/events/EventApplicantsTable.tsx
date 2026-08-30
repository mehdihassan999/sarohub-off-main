import React, { useState } from 'react';
import { api } from '../../api';
import { CheckCircle, Trash2, Search, Mail, Calendar, User, Clock, AlertCircle } from 'lucide-react';

interface Applicant {
  id: number;
  event_id: number;
  event_title: string;
  applicant_name: string;
  applicant_email: string;
  applied_at: string;
  form_data: Record<string, any>;
  status?: string;
}

interface Props {
  applicants: Applicant[];
  refresh: () => void;
}

const EventApplicantsTable: React.FC<Props> = ({ applicants, refresh }) => {
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const confirmSeat = async (id: number, name: string, email: string) => {
    if (!confirm(`Are you sure you want to confirm the seat reservation for ${name}? An automated confirmation email will be dispatched to ${email}.`)) {
      return;
    }
    setProcessingId(id);
    try {
      await api.confirmEventReservation(id);
      showNotification('success', `Seat confirmed for ${name}! Confirmation email sent to ${email}.`);
      refresh();
    } catch (err: any) {
      showNotification('error', 'Failed to confirm seat: ' + (err.message || err));
    } finally {
      setProcessingId(null);
    }
  };

  const deleteApplicant = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the reservation application for "${name}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteEventRegistration(id);
      showNotification('success', `Reservation record for "${name}" removed successfully.`);
      refresh();
    } catch (err: any) {
      showNotification('error', 'Failed to delete applicant: ' + (err.message || err));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredApplicants = applicants.filter(app => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (app.applicant_name || '').toLowerCase().includes(query) ||
      (app.applicant_email || '').toLowerCase().includes(query) ||
      (app.event_title || '').toLowerCase().includes(query);

    if (statusFilter === 'confirmed') return matchesSearch && app.status === 'Confirmed';
    if (statusFilter === 'pending') return matchesSearch && app.status !== 'Confirmed';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <span>Event Seat Applicants</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-normal">
              {applicants.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage, confirm, and process attendee seat reservations for corporate events</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search applicant or event..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-52"
            />
          </div>

          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${statusFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              All ({applicants.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${statusFilter === 'pending' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Pending ({applicants.filter(a => a.status !== 'Confirmed').length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${statusFilter === 'confirmed' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Confirmed ({applicants.filter(a => a.status === 'Confirmed').length})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
          notification.type === 'success' 
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' 
            : 'bg-red-950/30 border-red-500/30 text-red-400'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Table */}
      {filteredApplicants.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-slate-900 bg-slate-950/30">
          <Calendar className="h-8 w-8 text-slate-600 mx-auto mb-2 opacity-50" />
          <p className="text-slate-400 text-sm font-medium">No event reservations found</p>
          <p className="text-slate-600 text-xs mt-1">When visitors reserve seats via the website, their details will display here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-900 bg-slate-950/50 shadow-xl">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-left">Applicant</th>
                <th className="px-4 py-3 text-left">Contact Info</th>
                <th className="px-4 py-3 text-left">Target Event</th>
                <th className="px-4 py-3 text-left">Applied At</th>
                <th className="px-4 py-3 text-left">Extra Form Details</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredApplicants.map(app => (
                <tr key={app.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Name */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                        {(app.applicant_name || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{app.applicant_name || 'Unnamed Applicant'}</span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: #{app.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3.5">
                    <a 
                      href={`mailto:${app.applicant_email}`}
                      className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <Mail className="h-3 w-3 text-slate-500 group-hover:text-cyan-400" />
                      <span>{app.applicant_email || '-'}</span>
                    </a>
                  </td>

                  {/* Event */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium text-[11px]">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[180px]">{app.event_title || `Event #${app.event_id}`}</span>
                    </span>
                  </td>

                  {/* Applied At */}
                  <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                    {app.applied_at ? new Date(app.applied_at).toLocaleString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '-'}
                  </td>

                  {/* Form Data */}
                  <td className="px-4 py-3.5">
                    {app.form_data && Object.keys(app.form_data).length > 0 ? (
                      <details className="cursor-pointer group">
                        <summary className="text-[11px] text-cyan-400 group-hover:text-cyan-300 font-mono list-none flex items-center gap-1">
                          <span>View {Object.keys(app.form_data).length} detail(s)</span>
                        </summary>
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5 text-[11px] max-w-xs shadow-lg">
                          {Object.entries(app.form_data).map(([key, val]) => (
                            <div key={key} className="flex flex-col border-b border-slate-800/50 pb-1 last:border-0 last:pb-0">
                              <span className="text-[10px] text-slate-500 uppercase font-mono">{key.replace(/_/g, ' ')}</span>
                              <span className="text-slate-200 font-medium break-words">{String(val || '-')}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <span className="text-slate-600 text-[11px]">No custom fields</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    {app.status === 'Confirmed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wide">
                        <CheckCircle className="h-3 w-3" /> CONFIRMED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-mono font-bold tracking-wide">
                        <Clock className="h-3 w-3" /> PENDING
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {app.status !== 'Confirmed' ? (
                        <button
                          disabled={processingId === app.id || deletingId === app.id}
                          onClick={() => confirmSeat(app.id, app.applicant_name, app.applicant_email)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-sm disabled:opacity-50"
                          title="Confirm seat and send reservation email"
                        >
                          {processingId === app.id ? (
                            <span>Confirming...</span>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Confirm Seat</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-emerald-500/70 text-[11px] font-mono px-2 py-1 bg-emerald-500/5 rounded border border-emerald-500/10">
                          Seat Verified
                        </span>
                      )}

                      {/* Delete button */}
                      <button
                        disabled={deletingId === app.id || processingId === app.id}
                        onClick={() => deleteApplicant(app.id, app.applicant_name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors disabled:opacity-50"
                        title="Delete this applicant record"
                      >
                        {deletingId === app.id ? (
                          <span className="text-[10px] text-red-400">...</span>
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventApplicantsTable;
