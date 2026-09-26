import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye, 
  Filter, 
  X, 
  MessageCircle, 
  FileSpreadsheet 
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: '🟡 Pending' },
  { value: 'accepted', label: '🔵 Accepted' },
  { value: 'in_progress', label: '🟣 In Progress' },
  { value: 'completed', label: '🟢 Completed' },
  { value: 'cancelled', label: '🔴 Cancelled' }
];

export default function MasterBookingsTable({ 
  bookings = [], 
  onUpdateStatus, 
  onDeleteBooking 
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);

  // English days filter
  const daysList = [
    { key: 'all', label: 'All Days' },
    { key: 'Monday', label: 'Monday (सोमवार)' },
    { key: 'Tuesday', label: 'Tuesday (मंगलवार)' },
    { key: 'Wednesday', label: 'Wednesday (बुधवार)' },
    { key: 'Thursday', label: 'Thursday (गुरुवार)' },
    { key: 'Friday', label: 'Friday (शुक्रवार)' },
    { key: 'Saturday', label: 'Saturday (शनिवार)' },
    { key: 'Sunday', label: 'Sunday (रविवार)' }
  ];

  // Filter bookings
  const filtered = bookings.filter((b) => {
    const matchesSearch = 
      (b.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.customerPhone || '').includes(search) ||
      (b.workerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.workerCategory || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.serviceRequired || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.area || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesDay = dayFilter === 'all' || (b.preferredDay || '').toLowerCase().includes(dayFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesDay;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 flex flex-wrap items-center gap-2">
          {/* Keyword Search */}
          <div className="flex-1 min-w-[220px] flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, worker, phone, service, or location..."
              className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Day of Week Filter */}
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
          >
            {daysList.map((d) => (
              <option key={d.key} value={d.key} className="bg-slate-900">
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400 self-center font-bold">
          Showing: <span className="text-amber-400">{filtered.length}</span> of {bookings.length}
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-bold">Worker</th>
                <th className="p-4 font-bold">Employer (Customer)</th>
                <th className="p-4 font-bold">Work Required</th>
                <th className="p-4 font-bold">Date & Day</th>
                <th className="p-4 font-bold">Location</th>
                <th className="p-4 font-bold">Fee</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-slate-400">
                    <ClipboardList className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="font-bold">No Bookings or Jobs Found</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting your filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Worker */}
                    <td className="p-4">
                      <div className="font-black text-white">{b.workerName}</div>
                      <div className="text-[10px] text-amber-400 font-semibold">{b.workerCategory}</div>
                      <div className="text-[10px] text-slate-400">{b.workerPhone}</div>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-black text-slate-200">{b.customerName}</div>
                      <div className="text-[10px] text-emerald-400 font-medium">{b.customerPhone}</div>
                    </td>

                    {/* Service */}
                    <td className="p-4 max-w-[180px]">
                      <div className="font-bold text-white truncate" title={b.serviceRequired}>
                        {b.serviceRequired}
                      </div>
                      {b.jobDescription && (
                        <div className="text-[10px] text-slate-400 truncate italic mt-0.5" title={b.jobDescription}>
                          "{b.jobDescription}"
                        </div>
                      )}
                    </td>

                    {/* Date, Day, Time */}
                    <td className="p-4">
                      <div className="font-black text-white">{b.preferredDate}</div>
                      <div className="text-[10px] text-sky-300 font-semibold">
                        {b.preferredDay || 'Scheduled Day'}
                      </div>
                      <div className="text-[10px] text-slate-400">{b.preferredTimeSlot}</div>
                    </td>

                    {/* Location */}
                    <td className="p-4 max-w-[150px]">
                      <div className="text-slate-200 truncate" title={b.customerAddress}>
                        {b.customerAddress}
                      </div>
                      <div className="text-[10px] text-amber-300 font-medium">
                        {b.area ? `${b.area}, ` : ''}{b.city}
                      </div>
                    </td>

                    {/* Cost */}
                    <td className="p-4 font-black text-amber-400 text-sm">
                      ₹{b.estimatedCost}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => onUpdateStatus(b._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-black border focus:outline-none cursor-pointer ${
                          b.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : b.status === 'in_progress'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : b.status === 'accepted'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : b.status === 'cancelled'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        <option value="pending" className="bg-slate-900 text-amber-300">🟡 Pending</option>
                        <option value="accepted" className="bg-slate-900 text-sky-300">🔵 Accepted</option>
                        <option value="in_progress" className="bg-slate-900 text-purple-300">🟣 In Progress</option>
                        <option value="completed" className="bg-slate-900 text-emerald-300">🟢 Completed</option>
                        <option value="cancelled" className="bg-slate-900 text-rose-300">🔴 Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBookingForModal(b)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="View Full Ticket"
                        >
                          <Eye className="w-4 h-4 text-amber-400" />
                        </button>
                        <button
                          onClick={() => onDeleteBooking(b._id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL: Single Booking Full Audit */}
      {selectedBookingForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600/20 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Job Ticket Audit • #{selectedBookingForModal._id}
                </span>
                <h3 className="text-lg font-black text-white">
                  {selectedBookingForModal.serviceRequired}
                </h3>
              </div>

              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              
              {/* Worker & Employer 2-Col Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Worker Box */}
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Worker Profile</span>
                  <div className="font-black text-base text-white">{selectedBookingForModal.workerName}</div>
                  <div className="text-amber-300 font-semibold">{selectedBookingForModal.workerCategory}</div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{selectedBookingForModal.workerPhone}</span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={`tel:${selectedBookingForModal.workerPhone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                    >
                      <Phone className="w-3 h-3 fill-current" />
                      <span>Call Worker</span>
                    </a>
                  </div>
                </div>

                {/* Employer Box */}
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Employer / Hirer</span>
                  <div className="font-black text-base text-white">{selectedBookingForModal.customerName}</div>
                  <div className="text-slate-300 font-semibold">Phone: {selectedBookingForModal.customerPhone}</div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{selectedBookingForModal.customerAddress}, {selectedBookingForModal.area}, {selectedBookingForModal.city}</span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={`tel:${selectedBookingForModal.customerPhone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
                    >
                      <Phone className="w-3 h-3 fill-current" />
                      <span>Call Employer</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Timing Grid: When, Date, Day, Cost */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 block">Date:</span>
                  <span className="font-bold text-white text-sm">{selectedBookingForModal.preferredDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Day:</span>
                  <span className="font-bold text-sky-300 text-sm">{selectedBookingForModal.preferredDay || 'Scheduled Day'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Time Slot:</span>
                  <span className="font-bold text-amber-300 text-sm">{selectedBookingForModal.preferredTimeSlot}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Fee:</span>
                  <span className="font-black text-emerald-400 text-base">₹{selectedBookingForModal.estimatedCost}</span>
                </div>
              </div>

              {/* Job Description */}
              {selectedBookingForModal.jobDescription && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Job Description & Task Details:</span>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 leading-relaxed italic">
                    "{selectedBookingForModal.jobDescription}"
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedBookingForModal.notes && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Audit Notes:</span>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-300">
                    {selectedBookingForModal.notes}
                  </div>
                </div>
              )}

              {/* Status Update Control */}
              <div className="p-3 rounded-2xl bg-slate-850 border border-slate-700 flex items-center justify-between gap-3">
                <span className="font-bold text-white">Update Job Status:</span>
                <select
                  value={selectedBookingForModal.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    onUpdateStatus(selectedBookingForModal._id, newStatus);
                    setSelectedBookingForModal(prev => ({ ...prev, status: newStatus }));
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                >
                  <option value="pending">🟡 Pending</option>
                  <option value="accepted">🔵 Accepted</option>
                  <option value="in_progress">🟣 In Progress</option>
                  <option value="completed">🟢 Completed</option>
                  <option value="cancelled">🔴 Cancelled</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedBookingForModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
