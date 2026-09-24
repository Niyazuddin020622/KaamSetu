import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  ClipboardList,
  IndianRupee,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  MapPin,
  Phone,
  Calendar,
  Lock,
  ArrowLeft,
  RefreshCw,
  PlusCircle,
  SlidersHorizontal,
  Briefcase,
  Star,
  Activity,
  AlertCircle
} from 'lucide-react';
import {
  adminLogin,
  getAdminStats,
  getWorkers,
  getBookings,
  updateWorker,
  deleteWorker,
  updateBookingStatus,
  deleteBooking
} from '../api';

export default function AdminDashboard({ onClose, onOpenRegisterWorker }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'workers' | 'bookings'
  const [stats, setStats] = useState(null);
  const [workersList, setWorkersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Search & filter in admin
  const [workerSearch, setWorkerSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await adminLogin(pin.trim());
      if (res.success) {
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        setAuthError(res.message || 'गलत पिन (Invalid PIN)');
      }
    } catch (err) {
      setAuthError('लॉगिन विफल रहा। कृपया सही पिन डालें।');
    } finally {
      setAuthLoading(false);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, workersRes, bookingsRes] = await Promise.all([
        getAdminStats(),
        getWorkers({ limit: 100 }),
        getBookings()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (workersRes.success) setWorkersList(workersRes.data || []);
      if (bookingsRes.success) setBookingsList(bookingsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle worker verification
  const handleToggleVerified = async (worker) => {
    try {
      const res = await updateWorker(worker._id, { isVerified: !worker.isVerified });
      if (res.success) {
        setWorkersList(prev => prev.map(w => w._id === worker._id ? { ...w, isVerified: !w.isVerified } : w));
        showNotification(`${worker.name} का वेरिफिकेशन स्टेटस अपडेट हो गया।`);
      }
    } catch (err) {
      showNotification('वेरिफिकेशन अपडेट नहीं हो सका।');
    }
  };

  // Toggle worker availability
  const handleToggleAvailable = async (worker) => {
    try {
      const res = await updateWorker(worker._id, { isAvailable: !worker.isAvailable });
      if (res.success) {
        setWorkersList(prev => prev.map(w => w._id === worker._id ? { ...w, isAvailable: !w.isAvailable } : w));
        showNotification(`${worker.name} का उपलब्धता स्टेटस अपडेट हो गया।`);
      }
    } catch (err) {
      showNotification('उपलब्धता अपडेट नहीं हो सकी।');
    }
  };

  // Delete worker
  const handleDeleteWorker = async (workerId, name) => {
    if (!window.confirm(`क्या आप सच में ${name} को हटाना चाहते हैं?`)) return;
    try {
      const res = await deleteWorker(workerId);
      if (res.success) {
        setWorkersList(prev => prev.filter(w => w._id !== workerId));
        showNotification(`${name} को सफलतापूर्वक हटा दिया गया।`);
        loadDashboardData();
      }
    } catch (err) {
      showNotification('कारीगर को हटाने में समस्या आई।');
    }
  };

  // Update booking status
  const handleBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setBookingsList(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        showNotification(`बुकिंग स्टेटस '${newStatus}' कर दिया गया।`);
      }
    } catch (err) {
      showNotification('स्टेटस अपडेट नहीं हो सका।');
    }
  };

  // Delete booking
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('क्या आप इस बुकिंग को हटाना चाहते हैं?')) return;
    try {
      const res = await deleteBooking(bookingId);
      if (res.success) {
        setBookingsList(prev => prev.filter(b => b._id !== bookingId));
        showNotification('बुकिंग हटा दी गई।');
      }
    } catch (err) {
      showNotification('बुकिंग हटाने में समस्या आई।');
    }
  };

  // Filtered workers
  const filteredWorkers = workersList.filter(w =>
    w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.category.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.city.toLowerCase().includes(workerSearch.toLowerCase())
  );

  // Filtered bookings
  const filteredBookings = bookingsList.filter(b =>
    bookingStatusFilter === 'all' ? true : b.status === bookingStatusFilter
  );

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">एडमिन पैनल लॉगिन</h2>
            <p className="text-xs text-slate-400">
              KaamSetu Admin Control Dashboard • सुरक्षित पहुंच
            </p>
          </div>

          {authError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                एडमिन सुरक्षा पिन (Admin PIN)
              </label>
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="पिन दर्ज करें..."
                className="w-full px-4 py-3 text-center text-lg tracking-widest font-mono rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-slate-400 block mt-1 text-center">
                (डिफ़ॉल्ट पिन: <code className="text-amber-300 font-bold bg-slate-800 px-1.5 py-0.5 rounded">8605498460</code> या आपका मोबाइल नंबर)
              </span>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              {authLoading ? 'सत्यापित हो रहा है...' : 'एडमिन लॉगिन करें'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-colors"
            >
              वापस जाएं (Back to Site)
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD SCREEN
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 px-4 sm:px-8 py-3.5 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-white">KaamSetu Admin Control Panel</h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                Super Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              कारीगर, ग्राहक बुकिंग और प्लेटफॉर्म एनालिटिक्स प्रबंधन
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadDashboardData}
            title="रिफ्रेश करें"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>साइट पर जाएं</span>
          </button>
        </div>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 animate-bounce">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-xl">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Admin Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">कुल कारीगर (Workers)</span>
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats?.workers?.total || workersList.length}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1">
              {stats?.workers?.verified || workersList.filter(w => w.isVerified).length} सत्यापित (Verified)
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">कुल बुकिंग्स (Bookings)</span>
              <ClipboardList className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats?.bookings?.total || bookingsList.length}
            </div>
            <div className="text-[11px] text-amber-400 font-semibold mt-1">
              {stats?.bookings?.pending || bookingsList.filter(b => b.status === 'pending').length} पेंडिंग रिक्वेस्ट
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">काम पूरा हुआ (Completed)</span>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats?.bookings?.completed || bookingsList.filter(b => b.status === 'completed').length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              सफलतापूर्वक डिलीवर
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">अनुमानित बिजनेस (Value)</span>
              <IndianRupee className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              ₹{stats?.bookings?.totalRevenue || 12450}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              0% प्लेटफॉर्म कमीशन
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 gap-4 sm:gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            समरी व रिपोर्ट (Overview)
          </button>

          <button
            onClick={() => setActiveTab('workers')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'workers'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            <span>कारीगर सूची ({workersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'bookings'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
          >
            <span>ग्राहक बुकिंग्स ({bookingsList.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trade Categories Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>काम के अनुसार कारीगर (By Category)</span>
              </h3>
              <div className="space-y-2.5">
                {stats?.workers?.byCategory ? (
                  stats.workers.byCategory.map((cat) => (
                    <div key={cat._id} className="flex items-center justify-between text-xs bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-200">{cat._id}</span>
                      <span className="font-black text-amber-400 px-2 py-0.5 rounded-md bg-amber-400/10">
                        {cat.count} कारीगर
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">डेटा लोड हो रहा है...</p>
                )}
              </div>
            </div>

            {/* City Distribution */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>शहर अनुसार वितरण (By City)</span>
              </h3>
              <div className="space-y-2.5">
                {stats?.workers?.byCity ? (
                  stats.workers.byCity.map((c) => (
                    <div key={c._id} className="flex items-center justify-between text-xs bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                      <span className="font-bold text-slate-200">{c._id}</span>
                      <span className="font-black text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-400/10">
                        {c.count} कारीगर
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">डेटा लोड हो रहा है...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE WORKERS */}
        {activeTab === 'workers' && (
          <div className="space-y-4">
            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-full sm:w-80 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  placeholder="कारीगर का नाम, काम या शहर खोजें..."
                  className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full"
                />
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenRegisterWorker) onOpenRegisterWorker();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ नया कारीगर जोड़ें</span>
              </button>
            </div>

            {/* Workers Table / Cards */}
            <div className="space-y-3">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker._id}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{worker.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                          {worker.category}
                        </span>
                        {worker.isVerified ? (
                          <span className="text-[10px] text-sky-400 font-bold">✓ वेरिफाइड</span>
                        ) : (
                          <span className="text-[10px] text-slate-500">अवेरिफाइड</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                        <span>📞 {worker.phone}</span>
                        <span>📍 {worker.area}, {worker.city}</span>
                        <span className="text-amber-400 font-bold">₹{worker.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>

                  {/* Worker Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 text-xs">
                    <button
                      onClick={() => handleToggleVerified(worker)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${worker.isVerified
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                    >
                      {worker.isVerified ? '✓ Verified' : 'Mark Verified'}
                    </button>

                    <button
                      onClick={() => handleToggleAvailable(worker)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${worker.isAvailable
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                    >
                      {worker.isAvailable ? '🟢 Online' : '🔴 Offline'}
                    </button>

                    <button
                      onClick={() => handleDeleteWorker(worker._id, worker.name)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                      title="डिलीट करें"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {/* Filter by Status */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${bookingStatusFilter === st
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <div className="space-y-3">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  कोई बुकिंग नहीं मिली।
                </div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b._id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-sm">ग्राहक: {b.customerName}</span>
                          <span className="text-xs text-amber-400 font-bold">({b.customerPhone})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          कारीगर: <span className="text-white font-semibold">{b.workerName} ({b.workerCategory})</span> • 📞 {b.workerPhone}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase border ${b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                        b.status === 'pending' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                          b.status === 'accepted' ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' :
                            'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-800">
                      <div>📍 {b.customerAddress}, {b.city}</div>
                      <div>📅 {b.preferredDate} ({b.preferredTimeSlot})</div>
                      {b.jobDescription && <div className="sm:col-span-2 italic text-slate-400">"{b.jobDescription}"</div>}
                    </div>

                    {/* Status Changer & Delete */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">स्टेटस बदलें:</span>
                        <select
                          value={b.status}
                          onChange={(e) => handleBookingStatus(b._id, e.target.value)}
                          className="bg-slate-800 text-white font-bold px-2.5 py-1 rounded-lg border border-slate-700 text-xs focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDeleteBooking(b._id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>हटाएं</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
