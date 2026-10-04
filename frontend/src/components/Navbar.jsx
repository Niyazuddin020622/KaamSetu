import React, { useState, useEffect, useRef } from 'react';
import { 
  Hammer, 
  MapPin, 
  PlusCircle, 
  ClipboardList, 
  PhoneCall, 
  Phone,
  User,
  Briefcase,
  LogIn,
  KeyRound,
  LogOut,
  ShieldCheck
} from 'lucide-react';

import { getCityOptions } from '../utils/cityMaster';

export default function Navbar({ 
  selectedCity, 
  onCityChange, 
  onOpenRegister, 
  onOpenMyBookings,
  bookingCount = 0,
  currentUser = null,
  currentWorker = null,
  onOpenAuth = () => {},
  onOpenWorkerDashboard = () => {},
  onCustomerLogout = () => {},
  onWorkerLogout = () => {}
}) {

  const isLoggedIn = Boolean(currentUser || currentWorker);

  const cities = getCityOptions(true);

  // Smart Auto-Hide Scroll Logic
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
          
          setIsScrolled(currentScrollY > 20);

          // Top area buffer: always keep header visible near the top
          if (currentScrollY <= 60) {
            setIsVisible(true);
          } else {
            const diff = currentScrollY - lastScrollY.current;
            // 8px threshold to prevent jitter on micro-scrolls
            if (Math.abs(diff) > 8) {
              if (diff > 0) {
                // Scrolling down -> hide navbar
                setIsVisible(false);
              } else {
                // Scrolling up -> show navbar
                setIsVisible(true);
              }
            }
          }

          lastScrollY.current = Math.max(0, currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'glass-panel bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-black/40'
            : 'glass-panel bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60'
        }`}
      >
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

          {/* City Selector */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 gap-1 sm:gap-1.5 shadow-inner max-w-[120px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-xs shrink min-w-0">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              id="citySelector"
              name="city"
              aria-label="शहर चुनें (Select City)"
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

            {/* SCENARIO A: Worker Logged In (Show Worker Profile & Logout, NO LOGIN BUTTONS) */}
            {currentWorker && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onOpenWorkerDashboard}
                  className="flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-sky-300 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 transition-all shrink-0 shadow-md shadow-sky-500/10"
                  title="कारीगर डैशबोर्ड खोलें"
                >
                  <Briefcase className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="max-w-[110px] truncate">{currentWorker.name}</span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-sky-400 text-slate-950 rounded-full font-black">
                    कारीगर
                  </span>
                </button>

                <button
                  onClick={onWorkerLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all shrink-0"
                  title="कारीगर खाता लॉगआउट करें"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">लॉगआउट</span>
                </button>
              </div>
            )}

            {/* SCENARIO B: Customer / Employer Logged In (Show User Profile & Logout, NO LOGIN BUTTONS) */}
            {currentUser && !currentWorker && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onOpenMyBookings}
                  className="relative flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                  title="मेरा काम का इतिहास देखें"
                >
                  <User className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="max-w-[120px] truncate font-bold">{currentUser.name}</span>
                  <span className="hidden md:inline text-xs font-medium text-amber-200/80">• इतिहास</span>
                  {bookingCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] sm:text-xs font-black bg-amber-500 text-slate-950 rounded-full">
                      {bookingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={onCustomerLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all shrink-0"
                  title="ग्राहक खाता लॉगआउट करें"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">लॉगआउट</span>
                </button>
              </div>
            )}

            {/* SCENARIO C: Not Logged In (ONLY NOW SHOW LOGIN BUTTONS) */}
            {!isLoggedIn && (
              <>
                <button
                  onClick={onOpenMyBookings}
                  className="relative flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:text-white transition-all shrink-0"
                  title="काम का इतिहास देखें"
                >
                  <ClipboardList className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="hidden md:inline">काम का इतिहास</span>
                  <span className="md:hidden text-xs">इतिहास</span>
                </button>

                <button
                  onClick={() => onOpenAuth('customer')}
                  className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>लॉगिन</span>
                </button>

                <button
                  onClick={() => onOpenAuth('worker')}
                  className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all shrink-0"
                  title="कारीगर लॉगिन"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>कारीगर लॉगिन</span>
                </button>
              </>
            )}

            {/* Join as Worker CTA */}
            {!currentWorker && (
              <button
                onClick={onOpenRegister}
                className="flex items-center gap-1.5 px-3 lg:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/20 transition-all shrink-0 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="hidden lg:inline">Join as Worker <span className="text-xs font-normal opacity-90">(कारीगर बनें)</span></span>
                <span className="lg:hidden">कारीगर बनें</span>
              </button>
            )}
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

            {/* Worker Logged in: Dashboard + Direct Logout */}
            {currentWorker ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenWorkerDashboard}
                  className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 relative"
                  title="कारीगर डैशबोर्ड"
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
                </button>
                <button
                  onClick={onWorkerLogout}
                  className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300"
                  title="कारीगर लॉगआउट करें"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : currentUser ? (
              /* Customer Logged in: History + Direct Logout (NO LOGIN BUTTON) */
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenMyBookings}
                  className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 relative"
                  title="मेरा इतिहास"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-950" />
                </button>
                <button
                  onClick={onCustomerLogout}
                  className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300"
                  title="ग्राहक लॉगआउट करें"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Not logged in: Show Login & History & Register */
              <>
                <button
                  onClick={() => onOpenAuth('customer')}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400"
                  title="लॉगिन करें"
                >
                  <User className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenMyBookings}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400"
                  title="काम का इतिहास (History)"
                >
                  <ClipboardList className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenRegister}
                  className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold"
                  title="कारीगर बनें (Join as Worker)"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>

      {/* Spacer to prevent page content from hiding beneath fixed navbar */}
      <div className="h-14 sm:h-16 md:h-20 shrink-0" aria-hidden="true" />
    </>
  );
}
