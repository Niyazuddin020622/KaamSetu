import React, { useState, useEffect } from 'react';
import { 
  X, 
  ClipboardList, 
  Phone, 
  Clock, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  Search,
  Check
} from 'lucide-react';
import { getBookings, updateBookingStatus } from '../api';

const STATUS_BADGES = {
  pending: {
    bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    label: '🟡 पेंडिंग (Pending)'
  },
  accepted: {
    bg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    label: '🔵 स्वीकृत (Accepted)'
  },
  in_progress: {
    bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    label: '🟣 काम जारी है (In Progress)'
  },
  completed: {
    bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    label: '🟢 पूरा हुआ (Done)'
  },
  cancelled: {
    bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    label: '🔴 रद्द (Cancelled)'
  }
};

export default function MyBookingsModal({ onClose, activePhone = '' }) {
  const [phoneFilter, setPhoneFilter] = useState(activePhone);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBookings = async (phone = phoneFilter) => {
    setLoading(true);
    setError('');
    try {
      const res = await getBookings(phone ? { phone } : {});
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      setError('बुकिंग लोड करने में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(phoneFilter);
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-500/20 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">मेरी बुकिंग (My Job Requests)</h2>
              <p className="text-[11px] text-slate-400">
                अपने काम की स्थिति और कारीगर से संपर्क देखें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter by Phone */}
        <div className="p-3 sm:p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 shrink-0">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
              placeholder="अपना मोबाइल नंबर डालकर खोजें..."
              className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
            />
          </div>
          <button
            onClick={() => fetchBookings(phoneFilter)}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow active:scale-95"
          >
            खोजें
          </button>
          {phoneFilter && (
            <button
              onClick={() => {
                setPhoneFilter('');
                fetchBookings('');
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
            >
              सभी
            </button>
          )}
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              बुकिंग लोड हो रही हैं...
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">कोई बुकिंग नहीं मिली</h3>
              <p className="text-xs text-slate-500 mt-1">
                आपने अभी तक कोई कारीगर बुक नहीं किया है। लिस्ट में से किसी भी कारीगर को चुनें और बुक करें!
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const statusStyle = STATUS_BADGES[booking.status] || STATUS_BADGES.pending;

              return (
                <div
                  key={booking._id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-white">{booking.workerName}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                          {booking.workerCategory}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 font-medium">
                        काम: <span className="text-amber-400 font-semibold">{booking.serviceRequired}</span>
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${statusStyle.bg}`}>
                      {statusStyle.label}
                    </span>
                  </div>

                  {/* Scheduled info & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{booking.preferredDate} ({booking.preferredTimeSlot})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{booking.customerAddress}, {booking.city}</span>
                    </div>
                  </div>

                  {booking.jobDescription && (
                    <p className="text-xs text-slate-300 italic bg-slate-900/30 p-2.5 rounded-lg border border-slate-800/60">
                      "{booking.jobDescription}"
                    </p>
                  )}

                  {/* Bottom Row Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 text-xs">
                    <div className="text-slate-400">
                      विजिट चार्ज: <span className="text-white font-black">₹{booking.estimatedCost}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${booking.workerPhone}`}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow"
                      >
                        <Phone className="w-3.5 h-3.5 fill-current" />
                        <span>कॉल करें ({booking.workerPhone})</span>
                      </a>

                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'accepted')}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 font-bold"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>स्वीकारें</span>
                        </button>
                      )}

                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'completed')}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>काम हो गया</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
