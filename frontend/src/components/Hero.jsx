import React from 'react';
import { Search, ShieldCheck, Zap, PhoneCall, Clock, CheckCircle2, MapPin, Phone } from 'lucide-react';

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
  const popularKeywords = ['प्लंबर (Plumber)', 'वेल्डर (Welder)', 'इलेक्ट्रीशियन (Electrician)', 'बढ़ई (Carpenter)', 'पेंटर (Painter)', 'मिस्त्री (Mason)'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-12 sm:pb-16 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top direct helpline banner */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-sm">
          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-bounce" />
          <span>हेल्पलाइन / Direct Call: <a href="tel:+918825135461" className="underline hover:text-white">+91 8825135461</a> (24x7 सहायता)</span>
        </div>

        {/* Main Headline with Hindi translation */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2] mb-3">
          मिनटों में भरोसेमंद <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">प्लंबर, वेल्डर, मिस्त्री</span> पाएं
          <span className="block text-slate-300 text-lg sm:text-2xl font-bold mt-1.5">
            Hire Verified Skilled Workers in 2 Minutes
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 font-normal mb-6 sm:mb-8 leading-relaxed">
          सीधे फोन या व्हाट्सएप पर कारीगर से बात करें। कोई कमीशन नहीं, कोई दलाल नहीं।
        </p>

        {/* Search & Filter Box */}
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="p-2 sm:p-2.5 rounded-2xl sm:rounded-full bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-black/80 flex flex-col sm:flex-row items-center gap-2 backdrop-blur-xl"
          >
            {/* Search Input */}
            <div className="w-full flex-1 flex items-center gap-2.5 px-3 py-1.5 sm:py-0">
              <Search className="w-5 h-5 text-amber-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="खोजें: प्लंबर, वेल्डर, पाइप लीकेज, गेट..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-slate-300 font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* City Divider on Desktop */}
            <div className="hidden sm:block h-8 w-px bg-slate-800" />

            {/* City Selection with Ahmedabad included */}
            <div className="w-full sm:w-auto flex items-center gap-2 px-3 py-1.5 sm:py-0">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-slate-200 font-semibold focus:outline-none cursor-pointer w-full sm:w-auto"
              >
                <option value="All" className="bg-slate-900 text-slate-200">All Cities (सभी शहर)</option>
                <option value="Ahmedabad" className="bg-slate-900 text-slate-200">Ahmedabad (अहमदाबाद)</option>
                <option value="New Delhi" className="bg-slate-900 text-slate-200">New Delhi (दिल्ली)</option>
                <option value="Noida" className="bg-slate-900 text-slate-200">Noida (नोएडा)</option>
                <option value="Gurugram" className="bg-slate-900 text-slate-200">Gurugram (गुरुग्राम)</option>
                <option value="Faridabad" className="bg-slate-900 text-slate-200">Faridabad (फरीदाबाद)</option>
                <option value="Ghaziabad" className="bg-slate-900 text-slate-200">Ghaziabad (गाजियाबाद)</option>
                <option value="Mumbai" className="bg-slate-900 text-slate-200">Mumbai (मुंबई)</option>
                <option value="Bengaluru" className="bg-slate-900 text-slate-200">Bengaluru (बेंगलुरु)</option>
              </select>
            </div>

            {/* Submit Button - Big, easy touch target */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>कारीगर ढूंढें (Search)</span>
            </button>
          </form>

          {/* Emergency 24x7 Quick Toggle & Suggestions */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                emergencyOnly
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${emergencyOnly ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
              <span>🚨 24x7 तुरंत सेवा वाले कारीगर (Emergency)</span>
            </button>
          </div>

          {/* Quick Click Badges in Hindi */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">जल्दी चुनें:</span>
            {popularKeywords.map((kw) => {
              const cleanKeyword = kw.split(' ')[0];
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setSearchQuery(cleanKeyword)}
                  className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-400 hover:text-amber-300 transition-colors text-[11px] font-medium"
                >
                  {kw}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Trust Value Props */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto pt-4 sm:pt-6 border-t border-slate-800/60">
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs text-slate-400">सत्यापित पहचान</div>
              <div className="text-xs sm:text-sm font-bold text-white">100% आधार वेरिफाइड</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs text-slate-400">तुरंत पहुंच</div>
              <div className="text-xs sm:text-sm font-bold text-white">30 मिनट में हाजिर</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
              <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs text-slate-400">सीधा संपर्क</div>
              <div className="text-xs sm:text-sm font-bold text-white">कॉल या व्हाट्सएप</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] sm:text-xs text-slate-400">फिक्स रेट</div>
              <div className="text-xs sm:text-sm font-bold text-white">कोई दलाली नहीं</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
