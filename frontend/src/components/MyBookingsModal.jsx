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
  Check,
  MessageCircle,
  Briefcase,
  UserCheck,
  XCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { getBookings, updateBookingStatus } from '../api';

const STATUS_BADGES = {
  pending: {
    bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    label: '🟡 पेंडिंग (Pending Request)'
  },
  accepted: {
    bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    label: '🔵 कारीगर ने स्वीकारा (Accepted)'
  },
  in_progress: {
    bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    label: '🟣 काम जारी है (In Progress)'
  },
  completed: {
    bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    label: '🟢 काम पूरा हुआ (Completed)'
  },
  cancelled: {
    bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    label: '🔴 रद्द किया गया (Cancelled)'
  }
};

const getDayName = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const days = [
    'रविवार (Sunday)',
    'सोमवार (Monday)',
    'मंगलवार (Tuesday)',
    'बुधवार (Wednesday)',
    'गुरुवार (Thursday)',
    'शुक्रवार (Friday)',
    'शनिवार (Saturday)'
  ];
  return days[date.getDay()];
};

export default function MyBookingsModal({ onClose, activePhone = '' }) {
  const [phoneFilter, setPhoneFilter] = useState(activePhone);
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchBookings = async (phone = phoneFilter) => {
    setLoading(true);
    setError('');
    try {
      const res = await getBookings(phone ? { phone } : {});
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      setError('हायरिंग हिस्ट्री लोड करने में समस्या आई।');
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
        setActionMessage(
          newStatus === 'completed'
            ? 'काम पूरा मार्क कर दिया गया है!'
            : newStatus === 'cancelled'
            ? 'बुकिंग रद्द कर दी गई है।'
            : 'स्टेटस अपडेट हो गया।'
        );
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  const handleWhatsApp = (booking) => {
    const cleanPhone = (booking.workerPhone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${booking.workerName} जी, मैंने आपके साथ KaamSetu पर ${booking.serviceRequired} के लिए काम बुक किया है। कृपया अपडेट दें।`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Filter bookings by status tab
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'completed') return b.status === 'completed';
    if (statusFilter === 'active') return ['pending', 'accepted', 'in_progress'].includes(b.status);
    if (statusFilter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/90 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-600/25 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                काम पर बुलाने का इतिहास (Employer Hiring History)
              </h2>
              <p className="text-[11px] text-slate-400">
                आपने कब, किस तारीख को, किस दिन, किसको और किस काम के लिए बुलाया
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

        {/* Action toast */}
        {actionMessage && (
          <div className="bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30 px-4 py-2 text-xs font-bold text-center">
            {actionMessage}
          </div>
        )}

        {/* Search by Phone Header */}
        <div className="p-3 sm:p-4 bg-slate-950/80 border-b border-slate-800 space-y-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchBookings(phoneFilter)}
                placeholder="अपना फोन नंबर डालकर अपनी हायरिंग हिस्ट्री खोजें..."
                className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
              />
            </div>
            <button
              onClick={() => fetchBookings(phoneFilter)}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow active:scale-95 flex items-center gap-1.5"
            >
              <span>खोजें</span>
            </button>
            {phoneFilter && (
              <button
                onClick={() => {
                  setPhoneFilter('');
                  fetchBookings('');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                सभी देखें
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              सभी ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'active'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              चालू / पेंडिंग ({bookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status)).length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              पूरे हुए ({bookings.filter(b => b.status === 'completed').length})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                statusFilter === 'cancelled'
                  ? 'bg-rose-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              रद्द ({bookings.filter(b => b.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
              <span>हायरिंग रिकॉर्ड लोड हो रहे हैं...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <ClipboardList className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">कोई हायरिंग रिकॉर्ड नहीं मिला</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {phoneFilter 
                  ? `नंबर ${phoneFilter} से कोई बुकिंग नहीं मिली। कृपया सही मोबाइल नंबर जांचें या सभी लिस्ट देखें।`
                  : 'आपने अभी तक कोई कारीगर काम के लिए नहीं बुलाया है। लिस्ट से किसी भी कारीगर को चुनें और बुक करें!'}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const statusStyle = STATUS_BADGES[booking.status] || STATUS_BADGES.pending;
              const day = booking.preferredDay || getDayName(booking.preferredDate);

              return (
                <div
                  key={booking._id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-850/80 border border-slate-700/80 hover:border-slate-600 transition-all space-y-3.5"
                >
                  {/* Top: Worker called & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {booking.workerAvatar ? (
                        <img
                          src={booking.workerAvatar}
                          alt={booking.workerName}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=100';
                          }}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                          <UserCheck className="w-6 h-6" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-white">{booking.workerName}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                            {booking.workerCategory}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          काम: <strong className="text-amber-400 font-semibold">{booking.serviceRequired}</strong>
                        </p>
                      </div>
                    </div>

                    <span className={`self-start px-2.5 py-1 rounded-full text-[11px] font-black border ${statusStyle.bg}`}>
                      {statusStyle.label}
                    </span>
                  </div>

                  {/* 4 Details: Kab, Kis Date ko, Kis Din, Kaha bulaya */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-300">
                    {/* Kab & Kis Date ko */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        <strong>तारीख (Date):</strong> <span className="text-white font-bold">{booking.preferredDate}</span>
                      </span>
                    </div>

                    {/* Kis Din */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>
                        <strong>दिन (Day):</strong> <span className="text-sky-300 font-semibold">{day || 'निर्धारित दिन'}</span>
                      </span>
                    </div>

                    {/* Time slot */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        <strong>समय (Time):</strong> <span>{booking.preferredTimeSlot}</span>
                      </span>
                    </div>

                    {/* Estimated Cost */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-black text-sm">₹</span>
                      <span>
                        <strong>विजिट चार्ज:</strong> <span className="text-emerald-300 font-bold">₹{booking.estimatedCost}</span>
                      </span>
                    </div>

                    {/* Kaha bulaya (Location) */}
                    <div className="flex items-start gap-1.5 sm:col-span-2 pt-1 border-t border-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>कहाँ बुलाया (Location):</strong> <span className="text-amber-200">{booking.customerAddress}, {booking.area}, {booking.city}</span>
                      </span>
                    </div>

                    {/* Client / Hirer Info */}
                    <div className="flex items-center gap-1.5 sm:col-span-2 text-slate-400 text-[11px]">
                      <span>बुलाने वाले: <strong className="text-slate-200">{booking.customerName}</strong> ({booking.customerPhone})</span>
                      {booking.urgency && (
                        <span className="ml-auto px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                          {booking.urgency}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Job problem description */}
                  {booking.jobDescription && (
                    <div className="text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 leading-relaxed italic">
                      "{booking.jobDescription}"
                    </div>
                  )}

                  {/* Bottom Row Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 text-xs">
                    {/* Direct Contact कारीगर से बात करें */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${booking.workerPhone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5 fill-current" />
                        <span>कॉल करें ({booking.workerPhone})</span>
                      </a>

                      <button
                        onClick={() => handleWhatsApp(booking)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs font-bold active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>व्हाट्सएप</span>
                      </button>
                    </div>

                    {/* Status updater for customer */}
                    <div className="flex items-center gap-1.5">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'cancelled')}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 font-bold"
                        >
                          रद्द करें (Cancel)
                        </button>
                      )}

                      {['pending', 'accepted', 'in_progress'].includes(booking.status) && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'completed')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-bold"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>काम पूरा हुआ</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            कुल रिकॉर्ड: <strong className="text-white">{filteredBookings.length}</strong>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
