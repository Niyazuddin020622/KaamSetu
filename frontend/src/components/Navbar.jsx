import React from 'react';
import { Hammer, ShieldCheck, MapPin, PlusCircle, ClipboardList, PhoneCall, Headphones } from 'lucide-react';

export default function Navbar({ 
  selectedCity, 
  onCityChange, 
  onOpenRegister, 
  onOpenMyBookings,
  bookingCount = 0 
}) {

  const cities = [
    'All Cities', 
    'Ahmedabad', 
    'New Delhi', 
    'Noida', 
    'Gurugram', 
    'Faridabad', 
    'Ghaziabad', 
    'Mumbai', 
    'Bengaluru'
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
                <Hammer className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 transform -rotate-12 transition-transform hover:rotate-0" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  KaamSetu
                </span>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  कामसेतु
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate max-w-[150px] sm:max-w-none">
                Plumber, Welder & Trade Workers
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 gap-1.5 shadow-inner">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city} className="bg-slate-900 text-slate-200">
                  {city === 'All Cities' ? '📍 All Cities (सभी शहर)' : `📍 ${city}`}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Support & CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Direct Helpline */}
            <a
              href="tel:+918825135461"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
              title="Direct Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+91 8825135461</span>
            </a>

            {/* My Bookings / Hiring History Button */}
            <button
              onClick={onOpenMyBookings}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition-all hover:text-white"
            >
              <ClipboardList className="w-4 h-4 text-sky-400" />
              <span>काम का इतिहास (History)</span>
              {bookingCount > 0 && (
                <span className="px-1.5 py-0.2 text-xs font-bold bg-sky-500 text-slate-950 rounded-full">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Worker Register Button */}
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Join as Worker <span className="text-xs font-normal opacity-90">(कारीगर बनें)</span></span>
            </button>
          </div>

          {/* Mobile Quick Action */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenMyBookings}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 text-xs font-bold relative"
              title="काम का इतिहास (History)"
            >
              <ClipboardList className="w-4 h-4" />
              {bookingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-full" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
