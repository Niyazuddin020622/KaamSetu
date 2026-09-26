import React from 'react';
import { Hammer, ShieldCheck, MapPin, PlusCircle, ClipboardList, PhoneCall, Phone } from 'lucide-react';

export default function Navbar({ 
  selectedCity, 
  onCityChange, 
  onOpenRegister, 
  onOpenMyBookings,
  bookingCount = 0 
}) {

  const cities = [
    { value: 'All Cities', label: 'All Cities (सभी शहर)', short: 'सभी शहर' },
    { value: 'Ahmedabad', label: 'Ahmedabad (अहमदाबाद)', short: 'Ahmedabad' },
    { value: 'New Delhi', label: 'New Delhi (दिल्ली)', short: 'Delhi' },
    { value: 'Noida', label: 'Noida (नोएडा)', short: 'Noida' },
    { value: 'Gurugram', label: 'Gurugram (गुरुग्राम)', short: 'Gurugram' },
    { value: 'Faridabad', label: 'Faridabad (फरीदाबाद)', short: 'Faridabad' },
    { value: 'Ghaziabad', label: 'Ghaziabad (गाजियाबाद)', short: 'Ghaziabad' },
    { value: 'Mumbai', label: 'Mumbai (मुंबई)', short: 'Mumbai' },
    { value: 'Bengaluru', label: 'Bengaluru (बेंगलुरु)', short: 'Bengaluru' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-md sm:shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[7px] sm:rounded-[10px] md:rounded-[14px] flex items-center justify-center">
                <Hammer className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400 transform -rotate-12 transition-transform hover:rotate-0" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  KaamSetu
                </span>
                <span className="hidden xs:inline-block px-1.5 py-0.2 sm:py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  कामसेतु
                </span>
              </div>
              <p className="hidden md:block text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                Plumber, Welder & Trade Workers
              </p>
            </div>
          </div>

          {/* City Selector - Responsively constrained to never overflow */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 gap-1 sm:gap-1.5 shadow-inner max-w-[130px] xs:max-w-[160px] sm:max-w-[210px] md:max-w-xs shrink min-w-0">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-[11px] sm:text-xs md:text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer truncate w-full"
            >
              {cities.map((city) => (
                <option key={city.value} value={city.value} className="bg-slate-900 text-slate-200">
                  📍 {city.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tablet & Desktop Actions (640px+) */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Direct Helpline */}
            <a
              href="tel:+918825135461"
              className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all shrink-0"
              title="24x7 Direct Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">+91 8825135461</span>
              <span className="lg:hidden text-[11px]">हेल्पलाइन</span>
            </a>

            {/* My Bookings / Hiring History Button */}
            <button
              onClick={onOpenMyBookings}
              className="relative flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-all hover:text-white shrink-0"
              title="काम का इतिहास देखें"
            >
              <ClipboardList className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="hidden md:inline">काम का इतिहास</span>
              <span className="md:hidden text-xs">इतिहास</span>
              {bookingCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] sm:text-xs font-black bg-sky-500 text-slate-950 rounded-full">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Worker Register Button */}
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-3 lg:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/20 transition-all shrink-0 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">Join as Worker <span className="text-xs font-normal opacity-90">(कारीगर बनें)</span></span>
              <span className="lg:hidden">कारीगर बनें</span>
            </button>
          </div>

          {/* Mobile Actions (<640px) */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            {/* Direct Call Quick Link */}
            <a
              href="tel:+918825135461"
              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 transition-colors"
              title="24x7 हेल्पलाइन"
            >
              <Phone className="w-4 h-4 fill-current" />
            </a>

            {/* My Bookings History Button */}
            <button
              onClick={onOpenMyBookings}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 relative"
              title="काम का इतिहास (History)"
            >
              <ClipboardList className="w-4 h-4" />
              {bookingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-full ring-2 ring-slate-950" />
              )}
            </button>

            {/* Join Worker Quick Icon */}
            <button
              onClick={onOpenRegister}
              className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold"
              title="कारीगर बनें (Join as Worker)"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
