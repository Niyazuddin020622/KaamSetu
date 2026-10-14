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
  RefreshCw,
  Lock,
  LogOut,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  User,
  Sparkles
} from 'lucide-react';
import { getMySecureBookings, updateBookingStatus, customerLogout, getBookings } from '../api';
import { handleImageError } from '../utils/imageHelper';

const STATUS_BADGES = {
  pending: {
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    label: '🟡 पेंडिंग (Pending Request)'
  },
  accepted: {
    bg: 'bg-blue-50 text-blue-800 border-blue-200',
    label: '🔵 कारीगर ने स्वीकारा (Accepted)'
  },
  in_progress: {
    bg: 'bg-purple-50 text-purple-800 border-purple-200',
    label: '🟣 काम जारी है (In Progress)'
  },
  completed: {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    label: '🟢 काम पूरा हुआ (Completed)'
  },
  cancelled: {
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    label: '🔴 रद्द किया गया (Cancelled)'
  }
};

export default function MyBookingsModal({ 
  onClose, 
  currentUser, 
  onOpenAuth, 
  onCustomerLogout 
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({
    totalBookings: 0,
    completedBookings: 0,
    activeBookings: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchBookings = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError('');
    try {
      const res = await getMySecureBookings();
      if (res.success) {
        setBookings(res.data || []);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      setError('आपकी निजी हायरिंग हिस्ट्री लोड करने में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

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
        fetchBookings();
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

  const handleLogout = () => {
    customerLogout();
    if (onCustomerLogout) onCustomerLogout();
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm xs:text-base sm:text-lg font-bold text-slate-900 truncate">
                मेरा काम का इतिहास (My Hiring History)
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                {currentUser ? `${currentUser.name} (${currentUser.phone}) का सुरक्षित रिकॉर्ड` : 'प्राइवेट और सुरक्षित बुकिंग रिकॉर्ड'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={handleLogout}
                title="लॉगआउट करें"
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">लॉगआउट</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action toast */}
        {actionMessage && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-2 text-xs font-bold text-center shrink-0">
            {actionMessage}
          </div>
        )}

        {/* NOT LOGGED IN LOCKED SCREEN */}
        {!currentUser ? (
          <div className="p-6 sm:p-10 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                आपकी हायरिंग हिस्ट्री सुरक्षित और लॉक है
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                प्राइवेसी नियमों के अनुसार, आपने कब, किस कारीगर को, किस काम के लिए बुलाया—यह विवरण आपके अलावा कोई दूसरा व्यक्ति नहीं देख सकता।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-sm mx-auto space-y-2 text-left">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>फोन नंबर + 4-अंकों के PIN से सुरक्षा</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                कृपया अपने 10-अंकों के मोबाइल नंबर और 4-अंकों के गुप्त PIN से लॉगिन करें। अगर नया खाता नहीं है, तो सिर्फ 10 सेकंड में साइन अप करें।
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onOpenAuth) onOpenAuth('customer');
              }}
              className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>लॉगिन करें / नया खाता बनाएं</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* LOGGED IN VIEW */
          <>
            {/* Customer Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 sm:p-4 bg-slate-50/70 border-b border-slate-200 shrink-0">
              <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-slate-900">{summary.totalBookings}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold truncate">कुल बुकिंग</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-sky-700">{summary.activeBookings}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold truncate">एक्टिव काम</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-emerald-700">{summary.completedBookings}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold truncate">पूरे हुए</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-purple-700">₹{summary.totalSpent.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold truncate">कुल खर्च</div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: `सभी (${bookings.length})` },
                  { id: 'active', label: `एक्टिव (${bookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status)).length})` },
                  { id: 'completed', label: `पूरे हुए (${bookings.filter(b => b.status === 'completed').length})` },
                  { id: 'cancelled', label: `रद्द (${bookings.filter(b => b.status === 'cancelled').length})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      statusFilter === tab.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchBookings}
                disabled={loading}
                title="रिफ्रेश करें"
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-slate-900' : ''}`} />
              </button>
            </div>

            {/* Bookings List */}
            <div className="p-3 sm:p-5 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/50">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {loading && bookings.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">आपकी निजी बुकिंग्स लोड हो रही हैं...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-xs">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">कोई बुकिंग रिकॉर्ड नहीं मिला</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    जब भी आप KaamSetu से किसी कारीगर (Plumber, Electrician, आदि) को बुलाएंगे, उसका पूरा विवरण तारीख सहित यहाँ सुरक्षित रहेगा।
                  </p>
                </div>
              ) : (
                filteredBookings.map((b) => {
                  const badge = STATUS_BADGES[b.status] || STATUS_BADGES.pending;

                  return (
                    <div 
                      key={b._id}
                      className="bg-white hover:border-slate-300 border border-slate-200 rounded-2xl p-4 transition-all shadow-xs space-y-3"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-3">
                          {b.workerAvatar ? (
                            <img 
                              src={b.workerAvatar} 
                              alt={b.workerName} 
                              onError={handleImageError}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-sm shrink-0">
                              <Briefcase className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-900">{b.workerName}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {b.workerCategory}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{b.workerPhone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <div className="text-xs font-black text-slate-900 mt-1">
                            ₹{b.estimatedCost || '—'}
                          </div>
                        </div>
                      </div>

                      {/* Job & Time Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-500 uppercase font-bold">काम का विवरण:</div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                            <span>{b.serviceRequired}</span>
                          </div>
                          {b.jobDescription && (
                            <div className="text-[11px] text-slate-600 italic">
                              "{b.jobDescription}"
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-500 uppercase font-bold">तारीख और समय:</div>
                          <div className="text-slate-800 flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{b.preferredDate} ({b.preferredDay || ''})</span>
                          </div>
                          <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{b.preferredTimeSlot}</span>
                          </div>
                        </div>
                      </div>

                      {/* Notes / Cancellation Reason Banner */}
                      {b.notes && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-800">अपडेट / सूचना: </span>
                            <span>{b.notes}</span>
                          </div>
                        </div>
                      )}

                      {/* Card Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${b.workerPhone}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>कारीगर को कॉल करें</span>
                          </a>
                          <button
                            onClick={() => handleWhatsApp(b)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>व्हाट्सएप</span>
                          </button>
                        </div>

                        {/* Customer Cancel or Complete Action */}
                        <div className="flex items-center gap-2">
                          {['pending', 'accepted'].includes(b.status) && (
                            <button
                              onClick={() => handleStatusChange(b._id, 'cancelled')}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
                            >
                              रद्द करें
                            </button>
                          )}
                          {b.status === 'in_progress' && (
                            <button
                              onClick={() => handleStatusChange(b._id, 'completed')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>काम पूरा हो गया</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Privacy bottom reassurance */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>प्राइवेट व सुरक्षित: यह हायरिंग हिस्ट्री केवल आपके PIN द्वारा सुरक्षित अकाउंट में दिखाई देती है।</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
