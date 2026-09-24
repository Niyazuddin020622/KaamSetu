import React, { useState, useEffect } from 'react';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryChips from './components/CategoryChips';
import WorkerCard from './components/WorkerCard';
import WorkerDetailModal from './components/WorkerDetailModal';
import BookingModal from './components/BookingModal';
import WorkerRegisterModal from './components/WorkerRegisterModal';
import MyBookingsModal from './components/MyBookingsModal';
import AdminDashboard from './components/AdminDashboard';
import MobileBottomNav from './components/MobileBottomNav';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';
import { getWorkers, getCategories } from './api';
import { 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Search,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function App() {
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search - Default to Ahmedabad or All
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  // Modals
  const [selectedWorkerDetail, setSelectedWorkerDetail] = useState(null);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMyBookingsModal, setShowMyBookingsModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);


  // App notification toast
  const [toast, setToast] = useState(null);
  const [bookingCount, setBookingCount] = useState(2);
  const [lastBookingPhone, setLastBookingPhone] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [workersRes, categoriesRes] = await Promise.all([
        getWorkers({
          category: selectedCategory,
          city: selectedCity,
          search: searchQuery,
          emergencyOnly: emergencyOnly ? 'true' : undefined,
          availableOnly: availableOnly ? 'true' : undefined,
          sortBy
        }),
        getCategories()
      ]);

      if (workersRes.success) {
        setWorkers(workersRes.data || []);
      }
      if (categoriesRes.success) {
        setCategories(categoriesRes.data || []);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('सर्वर से कनेक्ट नहीं हो पा रहा है। कृपया कुछ देर में प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedCity, emergencyOnly, availableOnly, sortBy]);

  const handleSearchSubmit = () => {
    fetchData();
  };

  const handleWorkerRegistered = (newWorker) => {
    setWorkers((prev) => [newWorker, ...prev]);
    showToast(`स्वागत है ${newWorker.name} जी! आपका प्रोफाइल KaamSetu पर लाइव हो गया है।`);
    getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  };

  const handleBookingSuccess = (newBooking) => {
    setBookingCount((prev) => prev + 1);
    setLastBookingPhone(newBooking.customerPhone);
    showToast(`काम की रिक्वेस्ट भेज दी गई है! ${newBooking.workerName} जी जल्द संपर्क करेंगे।`);
  };

  const handleWorkerUpdated = (updatedWorker) => {
    setWorkers((prev) =>
      prev.map((w) => (w._id === updatedWorker._id ? updatedWorker : w))
    );
    if (selectedWorkerDetail && selectedWorkerDetail._id === updatedWorker._id) {
      setSelectedWorkerDetail(updatedWorker);
    }
    showToast('धन्यवाद! आपकी समीक्षा व रेटिंग जुड़ गई है।');
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedCity('All');
    setSearchQuery('');
    setEmergencyOnly(false);
    setAvailableOnly(false);
    setSortBy('rating');
  };

  const scrollToWorkers = () => {
    const el = document.getElementById('workers-directory');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 pb-16 md:pb-0">
      
      {/* Dynamic SEO Meta Tags via Helmet */}
      <SEO 
        title="KaamSetu - भारत का भरोसेमंद कारीगर नेटवर्क | Plumber, Welder, Electrician Near You"
        description="अहमदाबाद, दिल्ली, नोएडा में प्लंबर, वेल्डर, इलेक्ट्रीशियन और मिस्त्री को सीधे कॉल या व्हाट्सएप करें। 100% वेरिफाइड कारीगर, 0% कमीशन।"
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl shadow-amber-500/40 border border-amber-300">
            <CheckCircle2 className="w-5 h-5 text-slate-950 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onCityChange={(city) => setSelectedCity(city)}
        onOpenRegister={() => setShowRegisterModal(true)}
        onOpenMyBookings={() => setShowMyBookingsModal(true)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
        bookingCount={bookingCount}
      />


      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        emergencyOnly={emergencyOnly}
        setEmergencyOnly={setEmergencyOnly}
        onSearchSubmit={handleSearchSubmit}
        totalWorkersCount={workers.length}
      />

      {/* Main Directory Area */}
      <main id="workers-directory" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Category Selector Chips */}
        <CategoryChips
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          totalWorkers={workers.length}
        />

        {/* Directory Header & Sorting Controls */}
        <div className="mt-4 sm:mt-8 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div>
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span>{selectedCategory === 'All' ? 'उपलब्ध कारीगर (Available Workers)' : `${selectedCategory} कारीगर`}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                {workers.length} कारीगर हाजिर
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedCity !== 'All' ? `स्थान: ${selectedCity}` : 'सभी शहरों में'}
            </p>
          </div>

          {/* Quick Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Available Today toggle */}
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                availableOnly
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span>अभी खाली हैं (Available)</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="rating" className="bg-slate-900">⭐ सबसे अच्छी रेटिंग (Rating)</option>
                <option value="rate_asc" className="bg-slate-900">₹ कम रेट पहले (Lowest Rate)</option>
                <option value="rate_desc" className="bg-slate-900">₹ ज्यादा रेट (Highest Rate)</option>
                <option value="experience" className="bg-slate-900">अनुभव के अनुसार (Experience)</option>
                <option value="completed" className="bg-slate-900">ज्यादा काम किए (Most Jobs)</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              title="रिफ्रेश करें"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Workers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 my-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-10 bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center max-w-lg mx-auto my-8 space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">कनेक्शन में समस्या</h3>
            <p className="text-xs text-rose-300">{error}</p>
            <button
              onClick={fetchData}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs"
            >
              दोबारा कोशिश करें
            </button>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-900/30 border border-slate-800 rounded-3xl my-6 max-w-2xl mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">इस इलाके में कोई कारीगर नहीं मिला</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              कृपया दूसरा शहर या दूसरा काम चुनकर देखें, या सभी फिल्टर रीसेट करें।
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow"
              >
                सभी फिल्टर हटाएं (Reset)
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                इस इलाके का पहला कारीगर बनें
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {workers.map((worker) => (
              <WorkerCard
                key={worker._id}
                worker={worker}
                onSelectWorker={(w) => setSelectedWorkerDetail(w)}
                onBookWorker={(w) => setSelectedWorkerForBooking(w)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Trust & How It Works */}
      <TrustSection
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToWorkers();
        }}
        onOpenRegister={() => setShowRegisterModal(true)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToWorkers();
        }}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* Mobile Bottom Navigation Bar (1-Thumb Navigation for Smartphones) */}
      <MobileBottomNav
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onScrollToWorkers={scrollToWorkers}
        onOpenBookings={() => setShowMyBookingsModal(true)}
        onOpenRegister={() => setShowRegisterModal(true)}
        bookingCount={bookingCount}
      />

      {/* Modals */}
      {selectedWorkerDetail && (
        <WorkerDetailModal
          worker={selectedWorkerDetail}
          onClose={() => setSelectedWorkerDetail(null)}
          onBookWorker={(w) => {
            setSelectedWorkerDetail(null);
            setSelectedWorkerForBooking(w);
          }}
          onWorkerUpdated={handleWorkerUpdated}
        />
      )}

      {selectedWorkerForBooking && (
        <BookingModal
          worker={selectedWorkerForBooking}
          onClose={() => setSelectedWorkerForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {showRegisterModal && (
        <WorkerRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onWorkerRegistered={handleWorkerRegistered}
        />
      )}

      {showMyBookingsModal && (
        <MyBookingsModal
          onClose={() => setShowMyBookingsModal(false)}
          activePhone={lastBookingPhone}
        />
      )}

      {/* Admin Dashboard */}
      {showAdminDashboard && (
        <AdminDashboard
          onClose={() => setShowAdminDashboard(false)}
          onOpenRegisterWorker={() => setShowRegisterModal(true)}
        />
      )}

    </div>
  );
}

