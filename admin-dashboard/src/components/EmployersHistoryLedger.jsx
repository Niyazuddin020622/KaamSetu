import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Briefcase, 
  UserCheck, 
  CheckCircle, 
  MessageCircle, 
  ExternalLink, 
  X, 
  History, 
  IndianRupee, 
  AlertCircle 
} from 'lucide-react';

export default function EmployersHistoryLedger({ employers = [] }) {
  const [search, setSearch] = useState('');
  const [selectedEmployerForHistory, setSelectedEmployerForHistory] = useState(null);

  const filteredEmployers = employers.filter(emp => {
    return (
      (emp.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.customerPhone || '').includes(search) ||
      (emp.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.area || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Top Banner & Search */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-400" />
              <span>Employers & Hirers Ledger</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
              {employers.length} Registered Hirers
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Comprehensive audit of which client called workers, when, who was called, and for what service
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employer by name, phone, or city..."
            className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
          />
        </div>
      </div>

      {/* Employers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEmployers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-300">No Employers Found</h3>
            <p className="text-xs text-slate-500">Try searching with a different name, phone, or city</p>
          </div>
        ) : (
          filteredEmployers.map((emp, idx) => {
            const historyList = emp.history || [];

            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div>
                  {/* Employer Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-black text-lg border border-sky-500/30 shrink-0">
                        {emp.customerName ? emp.customerName[0].toUpperCase() : 'C'}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">{emp.customerName}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-semibold text-slate-300">{emp.customerPhone}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sky-500/10 text-sky-300 border border-sky-500/30 shrink-0">
                      {emp.totalBookings} Hires Logged
                    </span>
                  </div>

                  {/* Location Info & Financials */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{emp.customerAddress || 'Address on file'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                      <span>City: <strong className="text-white">{emp.city}</strong></span>
                      <span>Total Spent: <strong className="text-emerald-400">₹{emp.totalSpent}</strong></span>
                    </div>
                  </div>
                </div>

                {/* History Trigger CTA */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Completed Jobs:</span>
                    <span className="font-black text-emerald-400">{emp.completedBookings} Completed</span>
                  </div>

                  <button
                    onClick={() => setSelectedEmployerForHistory(emp)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-slate-800 hover:from-sky-500/30 hover:to-slate-700 text-sky-300 hover:text-white font-bold text-xs border border-sky-500/40 transition-all flex items-center justify-center gap-1.5 shadow active:scale-95"
                  >
                    <History className="w-4 h-4 text-sky-400" />
                    <span>View Hiring History (When, Who, What Service)</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Full Hiring History of Selected Employer */}
      {selectedEmployerForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-600/25 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-black text-xl border-2 border-sky-500/40 shrink-0">
                  {selectedEmployerForHistory.customerName ? selectedEmployerForHistory.customerName[0].toUpperCase() : 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedEmployerForHistory.customerName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                      Employer / Hirer
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Phone: <strong className="text-white">{selectedEmployerForHistory.customerPhone}</strong> • City: {selectedEmployerForHistory.city}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployerForHistory(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Hires Logged</span>
                <span className="text-base font-black text-sky-400">
                  {selectedEmployerForHistory.totalBookings} Jobs
                </span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-400 block">Completed Jobs</span>
                <span className="text-base font-black text-emerald-400">
                  {selectedEmployerForHistory.completedBookings} Completed
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Amount Spent</span>
                <span className="text-base font-black text-amber-400">
                  ₹{selectedEmployerForHistory.totalSpent}
                </span>
              </div>
            </div>

            {/* Content: List of all hiring jobs made by this employer */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-sky-400" />
                  <span>Hiring Records Log (When, Who, What Service, Where)</span>
                </h4>
                <span className="text-[11px] text-slate-400">Date, Day & Worker Details</span>
              </div>

              {(!selectedEmployerForHistory.history || selectedEmployerForHistory.history.length === 0) ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No detailed hiring history records found.
                </div>
              ) : (
                selectedEmployerForHistory.history.map((record) => (
                  <div
                    key={record._id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-700/80 hover:border-slate-600 transition-all space-y-3.5"
                  >
                    {/* Top row: Worker Name & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {record.workerAvatar ? (
                          <img
                            src={record.workerAvatar}
                            alt={record.workerName}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=100';
                            }}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black shrink-0">
                            <UserCheck className="w-6 h-6" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-base font-black text-white">{record.workerName}</h5>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                              {record.workerCategory}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Worker Phone: <strong className="text-emerald-400">{record.workerPhone}</strong>
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        record.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : record.status === 'in_progress'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : record.status === 'accepted'
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {record.status === 'completed' ? '🟢 Completed' : record.status === 'in_progress' ? '🟣 In Progress' : record.status === 'accepted' ? '🔵 Accepted' : '🟡 Pending'}
                      </span>
                    </div>

                    {/* 4 Points: When, Which Day, What Service, Where */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-300">
                      {/* Date */}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          <strong>Date:</strong> <span className="text-white font-bold">{record.preferredDate}</span>
                        </span>
                      </div>

                      {/* Day of Week */}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>
                          <strong>Day:</strong> <span className="text-sky-300 font-bold">{record.preferredDay || 'Scheduled Day'}</span>
                        </span>
                      </div>

                      {/* Time Slot */}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          <strong>Time Slot:</strong> <span>{record.preferredTimeSlot}</span>
                        </span>
                      </div>

                      {/* Visiting Charge */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-black text-sm">₹</span>
                        <span>
                          <strong>Visiting Fee:</strong> <span className="text-emerald-300 font-black">₹{record.estimatedCost}</span>
                        </span>
                      </div>

                      {/* Service Required */}
                      <div className="sm:col-span-2 pt-1 border-t border-slate-800">
                        <span className="text-amber-300 font-bold block mb-0.5">
                          🛠️ Service Required: {record.serviceRequired}
                        </span>
                        {record.jobDescription && (
                          <p className="text-xs text-slate-300 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                            "{record.jobDescription}"
                          </p>
                        )}
                      </div>

                      {/* Location Called */}
                      <div className="sm:col-span-2 pt-1 border-t border-slate-800 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Job Location:</strong> <span className="text-slate-200 font-medium">{record.customerAddress}, {record.area}, {record.city}</span>
                        </span>
                      </div>
                    </div>

                    {/* Direct Contact Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${record.workerPhone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                      >
                        <Phone className="w-3 h-3 fill-current" />
                        <span>Call Worker ({record.workerPhone})</span>
                      </a>

                      <a
                        href={`https://wa.me/${(record.workerPhone || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs font-bold"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedEmployerForHistory(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
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
