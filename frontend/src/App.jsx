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
import AuthModal from './components/AuthModal';
import WorkerDashboardModal from './components/WorkerDashboardModal';
import MobileBottomNav from './components/MobileBottomNav';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';
import { 
  getWorkers, 
  getCategories, 
  getValidCustomerSession, 
  getValidWorkerSession, 
  customerLogout, 
  workerLogout 
} from './api';
import { 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Search,
  MapPin,
  LayoutGrid,
  List
} from 'lucide-react';

export default function App() {
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Customer & Worker Authentication States (24-Hour Verified Sessions)
  const [currentUser, setCurrentUser] = useState(() => getValidCustomerSession());
  const [currentWorker, setCurrentWorker] = useState(() => getValidWorkerSession());

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('customer');
  const [showWorkerDashboard, setShowWorkerDashboard] = useState(false);

  // Filters & Search - Default to registered customer's city or All
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState(() => {
    const session = getValidCustomerSession();
    return session?.city || 'All';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('auto'); // 'auto' | 'compact' | 'grid'

  // Modals
  const [selectedWorkerDetail, setSelectedWorkerDetail] = useState(null);
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMyBookingsModal, setShowMyBookingsModal] = useState(false);

  // App notification toast
  const [toast, setToast] = useState(null);
  const [bookingCount, setBookingCount] = useState(2);
  const [lastBookingPhone, setLastBookingPhone] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 24-Hour Active Session Checker: Automatically logs out when 24h duration expires
  useEffect(() => {
    const checkActiveSessions = () => {
      if (currentUser) {
        const validUser = getValidCustomerSession();
        if (!validUser) {
          setCurrentUser(null);
          setShowMyBookingsModal(false);
          showToast('सुरक्षा कारणों से आपका 24 घंटे का सत्र (session) समाप्त हो गया है। कृपया पुनः लॉगिन करें।', 'info');
        }
      }

      if (currentWorker) {
        const validWorker = getValidWorkerSession();
        if (!validWorker) {
          setCurrentWorker(null);
          setShowWorkerDashboard(false);
          showToast('सुरक्षा कारणों से आपका 24 घंटे का कारीगर सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।', 'info');
        }
      }
    };

    const interval = setInterval(checkActiveSessions, 30000); // Check every 30 seconds
    window.addEventListener('focus', checkActiveSessions);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkActiveSessions);
    };
  }, [currentUser, currentWorker]);

  const handleAuthSuccess = (role, data) => {
    if (role === 'customer') {
      setCurrentUser(data);
      if (data.city) {
        setSelectedCity(data.city); // Auto-filter workers to employer's registered city!
      }
      showToast(`नमस्ते ${data.name}! आपका स्वागत है${data.city ? ` (${data.city} के कारीगर दिखाए जा रहे हैं)` : ''}।`);
    } else if (role === 'worker') {
      setCurrentWorker(data);
      setShowWorkerDashboard(true);
      showToast(`नमस्ते ${data.name}! आपका कारीगर डैशबोर्ड खुला है (24 घंटे का सत्र सक्रिय)।`);
    }
  };

  // Guard against re-opening login options when already authenticated without logging out
  const handleOpenAuth = (role = 'customer') => {
    if (currentUser || currentWorker) {
      const activeName = (currentUser || currentWorker).name;
      showToast(`आप पहले से ${activeName} के रूप में लॉगिन हैं। नया खाता इस्तेमाल करने के लिए पहले 'लॉगआउट' करें।`, 'info');
      return;
    }
    setAuthInitialRole(role);
    setShowAuthModal(true);
  };

  const handleCustomerLogout = () => {
    customerLogout();
    setCurrentUser(null);
    setShowMyBookingsModal(false);
    setSelectedCity('All');
    showToast('ग्राहक खाता सफलतापूर्वक लॉगआउट हो गया।');
  };

  const handleWorkerLogout = () => {
    workerLogout();
    setCurrentWorker(null);
    setShowWorkerDashboard(false);
    showToast('कारीगर खाता सफलतापूर्वक लॉगआउट हो गया।');
  };

  // 1. Load categories once on initial mount
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((res) => {
        if (isMounted && res.success) {
          setCategories(res.data || []);
        }
      })
      .catch((err) => console.error('Categories load error:', err));
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch workers when filters change
  const fetchWorkers = async () => {
    setLoading(true);
    setError('');
    try {
      const workersRes = await getWorkers({
        category: selectedCategory,
        city: selectedCity,
        search: searchQuery,
        emergencyOnly: emergencyOnly ? 'true' : undefined,
        availableOnly: availableOnly ? 'true' : undefined,
        sortBy
      });

      if (workersRes.success) {
        setWorkers(workersRes.data || []);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('सर्वर से कनेक्ट नहीं हो पा रहा है। कृपया कुछ देर में प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  // 3. Full refresh handler (workers + categories)
  const fetchData = () => {
    fetchWorkers();
    getCategories(true)
      .then((res) => {
        if (res.success) setCategories(res.data || []);
      })
      .catch((err) => console.error('Categories refresh error:', err));
  };

  useEffect(() => {
    fetchWorkers();
  }, [selectedCategory, selectedCity, emergencyOnly, availableOnly, sortBy]);

  const handleSearchSubmit = () => {
    fetchWorkers();
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 pb-24 md:pb-0 overflow-x-hidden">
      
      {/* Dynamic SEO Meta Tags via Helmet */}
      <SEO 
        title="KaamSetu - भारत का भरोसेमंद कारीगर नेटवर्क | Plumber, Welder, Electrician Near You"
        description="अहमदाबाद, दिल्ली, नोएडा में प्लंबर, वेल्डर, इलेक्ट्रीशियन और मिस्त्री को सीधे कॉल या व्हाट्सएप करें। 100% वेरिफाइड कारीगर, 0% कमीशन।"
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-16 sm:top-20 right-3 sm:right-6 z-50 animate-bounce max-w-[90vw]">
          <div className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-xl border border-slate-700">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
            <span className="truncate">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Dynamic SEO Meta & Structured Data */}
      <SEO city={selectedCity} category={selectedCategory} />

      {/* Top Navbar */}
      <Navbar
        selectedCity={selectedCity}
        onCityChange={(city) => setSelectedCity(city)}
        onOpenRegister={() => setShowRegisterModal(true)}
        onOpenMyBookings={() => setShowMyBookingsModal(true)}
        bookingCount={bookingCount}
        currentUser={currentUser}
        currentWorker={currentWorker}
        onOpenAuth={handleOpenAuth}
        onOpenWorkerDashboard={() => setShowWorkerDashboard(true)}
        onCustomerLogout={handleCustomerLogout}
        onWorkerLogout={handleWorkerLogout}
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
      <main id="workers-directory" className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-8">
        
        {/* Customer Location Context Banner */}
        {currentUser?.city && (
          <div className="mb-3 sm:mb-4 p-3 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  आपका पंजीकृत शहर: <span className="text-amber-700 font-extrabold">{currentUser.city}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  {selectedCity === currentUser.city ? (
                    <span className="text-emerald-700 font-semibold">✓ आपके शहर के स्थानीय कारीगर दिखाए जा रहे हैं</span>
                  ) : (
                    <span>
                      अभी आप <strong className="text-slate-800">'{selectedCity === 'All' ? 'सभी शहरों' : selectedCity}'</strong> के कारीगर देख रहे हैं।
                    </span>
                  )}
                </p>
              </div>
            </div>

            {selectedCity !== currentUser.city && (
              <button
                onClick={() => setSelectedCity(currentUser.city)}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs active:scale-95 shrink-0"
              >
                📍 वापस {currentUser.city} के कारीगर देखें
              </button>
            )}
          </div>
        )}

        {/* Category Selector Chips */}
        <CategoryChips
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          totalWorkers={workers.length}
        />

        {/* Directory Header & Sorting Controls */}
        <div className="mt-3 sm:mt-8 mb-4 sm:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="min-w-0">
            <h2 className="text-sm xs:text-base sm:text-xl font-black text-slate-900 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span>{selectedCategory === 'All' ? 'उपलब्ध कारीगर (Available Workers)' : `${selectedCategory} कारीगर`}</span>
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200 shrink-0">
                {workers.length} हाजिर
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              {selectedCity !== 'All' ? `स्थान: ${selectedCity}` : 'सभी शहरों में'}
            </p>
          </div>

          {/* Quick Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Available Today toggle */}
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 shrink-0 ${
                availableOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="text-[11px] sm:text-xs">अभी खाली (Available)</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 sm:px-2.5 py-1.5 text-xs shrink-0 max-w-[170px] xs:max-w-none">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-[11px] sm:text-xs truncate w-full"
              >
                <option value="rating" className="bg-white text-slate-800">⭐ रेटिंग (Rating)</option>
                <option value="rate_asc" className="bg-white text-slate-800">₹ कम रेट (Lowest)</option>
                <option value="rate_desc" className="bg-white text-slate-800">₹ ज्यादा रेट (Highest)</option>
                <option value="experience" className="bg-white text-slate-800">अनुभव (Experience)</option>
                <option value="completed" className="bg-white text-slate-800">ज्यादा काम (Jobs)</option>
              </select>
            </div>

            {/* View Mode Toggle: Grid vs Compact List */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'compact' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="कॉम्पैक्ट लिस्ट व्यू (स्मार्टफोन के लिए बेस्ट)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="ग्रिड कार्ड व्यू"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              title="रिफ्रेश करें"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Workers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 my-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="p-5 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-10 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto my-8 space-y-3 shadow-xs">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">कनेक्शन में समस्या</h3>
            <p className="text-xs text-rose-700">{error}</p>
            <button
              onClick={fetchData}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              दोबारा कोशिश करें
            </button>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white border border-slate-200 rounded-3xl my-6 max-w-2xl mx-auto space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">इस इलाके में कोई कारीगर नहीं मिला</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              कृपया दूसरा शहर या दूसरा काम चुनकर देखें, या सभी फिल्टर रीसेट करें।
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                सभी फिल्टर हटाएं (Reset)
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold"
              >
                इस इलाके का पहला कारीगर बनें
              </button>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'compact'
              ? 'flex flex-col gap-2.5 max-w-4xl mx-auto'
              : viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6'
          }>
            {workers.map((worker) => (
              <WorkerCard
                key={worker._id}
                worker={worker}
                viewMode={viewMode}
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
      />

      {/* Mobile Bottom Navigation Bar (1-Thumb Navigation for Smartphones) */}
      <MobileBottomNav
        onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onScrollToWorkers={scrollToWorkers}
        onOpenBookings={() => setShowMyBookingsModal(true)}
        onOpenRegister={() => setShowRegisterModal(true)}
        bookingCount={bookingCount}
        currentWorker={currentWorker}
        currentUser={currentUser}
        onOpenWorkerDashboard={() => setShowWorkerDashboard(true)}
      />

      {/* Modals */}
      {selectedWorkerDetail && (
        <WorkerDetailModal
          worker={selectedWorkerDetail}
          currentUser={currentUser}
          initialTab={selectedWorkerDetail.defaultTab || 'about'}
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
          currentUser={currentUser}
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
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onCustomerLogout={handleCustomerLogout}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          initialRole={authInitialRole}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          onOpenWorkerRegister={() => setShowRegisterModal(true)}
          currentUser={currentUser}
          currentWorker={currentWorker}
          onCustomerLogout={handleCustomerLogout}
          onWorkerLogout={handleWorkerLogout}
        />
      )}

      {showWorkerDashboard && (
        <WorkerDashboardModal
          isOpen={showWorkerDashboard}
          workerUser={currentWorker}
          onClose={() => setShowWorkerDashboard(false)}
          onWorkerLogout={handleWorkerLogout}
        />
      )}

    </div>
  );
}

