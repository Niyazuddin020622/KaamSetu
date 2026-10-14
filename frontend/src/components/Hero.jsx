import React, { useState } from 'react';
import { Search, ShieldCheck, Zap, PhoneCall, Clock, CheckCircle2, MapPin, Phone, LocateFixed, Loader2 } from 'lucide-react';
import { getCityOptions, getNearbyCities } from '../utils/cityMaster';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  selectedCity, 
  setSelectedCity, 
  emergencyOnly, 
  setEmergencyOnly,
  onSearchSubmit,
  totalWorkersCount = 12
}) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState('');
  const cityOptions = getCityOptions(true);
  const popularKeywords = ['प्लंबर (Plumber)', 'वेल्डर (Welder)', 'इलेक्ट्रीशियन (Electrician)', 'बढ़ई (Carpenter)', 'पेंटर (Painter)', 'मिस्त्री (Mason)'];

  const handleAutoDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('ब्राउज़र में GPS लोकेशन सपोर्ट उपलब्ध नहीं है।');
      return;
    }
    setGpsLoading(true);
    setGpsMessage('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearby = getNearbyCities(latitude, longitude, 120);
        if (nearby && nearby.length > 0) {
          const nearest = nearby[0];
          setSelectedCity(nearest.name);
          setGpsMessage(`📍 आपकी लोकेशन: ${nearest.name} (${nearest.distanceKm} किमी दूर)`);
          if (onSearchSubmit) onSearchSubmit();
        } else {
          setGpsMessage('निकटतम कोई सक्रिय शहर नहीं मिला, डिफ़ॉल्ट शहर चुनें।');
        }
        setGpsLoading(false);
        setTimeout(() => setGpsMessage(''), 5000);
      },
      (err) => {
        console.warn('GPS Error:', err);
        setGpsLoading(false);
        setGpsMessage('GPS लोकेशन अनुमति नहीं मिली।');
        setTimeout(() => setGpsMessage(''), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-12 sm:pb-16 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100/70">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top direct helpline banner */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs md:text-sm font-bold mb-4 sm:mb-6 shadow-xs max-w-full">
          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          <span className="truncate xs:overflow-visible">
            हेल्पलाइन: <a href="tel:+918825135461" className="underline font-extrabold hover:text-emerald-950">+91 8825135461</a> (24x7 निःशुल्क सहायता)
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.25] mb-3 px-1">
          मिनटों में भरोसेमंद <span className="text-amber-600">प्लंबर, वेल्डर, मिस्त्री</span> पाएं
          <span className="block text-slate-600 text-sm xs:text-base sm:text-xl md:text-2xl font-bold mt-1.5">
            Hire Verified Skilled Workers in 2 Minutes
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-600 font-normal mb-5 sm:mb-8 leading-relaxed px-2">
          सीधे फोन या व्हाट्सएप पर कारीगर से बात करें। कोई कमीशन नहीं, कोई बिचौलिया नहीं।
        </p>

        {/* Search & Filter Box */}
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="p-2 sm:p-2.5 rounded-2xl md:rounded-full bg-white border border-slate-300 shadow-lg shadow-slate-200/60 flex flex-col md:flex-row items-stretch md:items-center gap-2"
          >
            {/* Search Input */}
            <div className="w-full flex-1 flex items-center gap-2.5 px-3 py-2 md:py-0 min-w-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              <input
                id="heroSearchInput"
                name="searchQuery"
                type="text"
                autoComplete="off"
                aria-label="कारीगर या काम खोजें (Search trade workers)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खोजें: प्लंबर, वेल्डर, पाइप लीकेज, गेट, वायरिंग..."
                className="w-full bg-transparent text-xs sm:text-sm md:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="सर्च साफ करें (Clear search)"
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1 shrink-0"
                >
                  ✕
                </button>
              )}
            </div>

            {/* City Divider on Desktop */}
            <div className="hidden md:block h-8 w-px bg-slate-200" />

            {/* City Selection with GPS 1-Tap Auto Detect */}
            <div className="w-full md:w-auto flex items-center justify-between gap-1.5 px-3 py-1.5 md:py-0 border-t md:border-t-0 border-slate-100">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <select
                  id="heroCitySelect"
                  name="city"
                  aria-label="शहर चुनें (Select City)"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none cursor-pointer w-full md:w-auto"
                >
                  {cityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 1-Tap Auto GPS Locate Button */}
              <button
                type="button"
                onClick={handleAutoDetectGPS}
                disabled={gpsLoading}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10px] sm:text-xs font-bold transition-all shrink-0 active:scale-95"
                title="1-टैप: वर्तमान लोकेशन से शहर खोजें (Auto Detect GPS)"
              >
                {gpsLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span className="hidden xs:inline">पास खोजें</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl md:rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>कारीगर ढूंढें</span>
            </button>
          </form>

          {/* GPS Message / Status Feedback */}
          {gpsMessage && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 animate-fadeIn">
              <span>{gpsMessage}</span>
            </div>
          )}

          {/* Emergency 24x7 Quick Toggle & Suggestions */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                emergencyOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${emergencyOnly ? 'bg-rose-600 animate-ping' : 'bg-slate-400'}`} />
              <span className="text-[11px] sm:text-xs">🚨 24x7 तुरंत सेवा वाले कारीगर (Emergency)</span>
            </button>
          </div>

          {/* Quick Click Badges */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600 text-[11px] sm:text-xs">जल्दी चुनें:</span>
            {popularKeywords.map((kw) => {
              const cleanKeyword = kw.split(' ')[0];
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setSearchQuery(cleanKeyword)}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors text-[10px] sm:text-[11px] font-medium shadow-xs"
                >
                  {kw}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Trust Value Props */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 max-w-4xl mx-auto pt-4 sm:pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-xs min-w-0">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-[10px] sm:text-xs text-slate-500 truncate">सत्यापित पहचान</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">100% आधार वेरिफाइड</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-xs min-w-0">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-[10px] sm:text-xs text-slate-500 truncate">तुरंत पहुंच</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">30 मिनट में हाजिर</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-xs min-w-0">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 shrink-0">
              <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-[10px] sm:text-xs text-slate-500 truncate">सीधा संपर्क</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">कॉल या व्हाट्सएप</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-xs min-w-0">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-[10px] sm:text-xs text-slate-500 truncate">फिक्स रेट</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">कोई दलाली नहीं</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
