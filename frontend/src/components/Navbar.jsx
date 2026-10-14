import React, { useState, useEffect, useRef } from 'react';
import {
  Hammer,
  MapPin,
  PlusCircle,
  ClipboardList,
  Phone,
  User,
  Briefcase,
  LogIn,
  KeyRound,
  LogOut
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
  onOpenAuth = () => { },
  onOpenWorkerDashboard = () => { },
  onCustomerLogout = () => { },
  onWorkerLogout = () => { }
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
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm'
            : 'bg-white/90 backdrop-blur-sm border-b border-slate-200/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2">

            {/* Logo */}
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                <Hammer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transform -rotate-12 transition-transform hover:rotate-0" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-900">
                    Kaam<span className="text-amber-600">Setu</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                    कामसेतु
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-500 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>भारत का भरोसेमंद कारीगर नेटवर्क</span>
                  <span className="hidden lg:inline text-slate-300">•</span>
                  <span className="hidden lg:inline text-emerald-700 font-bold">0% कमीशन</span>
                </div>
              </div>
            </div>

            {/* City Selector */}
            <div className="flex items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 gap-1.5 shadow-xs max-w-[125px] sm:max-w-[200px] md:max-w-xs shrink min-w-0 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                id="citySelector"
                name="city"
                aria-label="शहर चुनें (Select City)"
                value={selectedCity}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent text-[11px] sm:text-xs md:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer truncate w-full"
              >
                {cities.map((city) => (
                  <option key={city.value} value={city.value} className="bg-white text-slate-800">
                    📍 {city.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tablet & Desktop Actions (640px+) */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3 shrink-0">
              
              {/* SCENARIO A: Worker Logged In */}
              {currentWorker && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={onOpenWorkerDashboard}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all shrink-0 shadow-xs"
                    title="कारीगर डैशबोर्ड खोलें"
                  >
                    <Briefcase className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="max-w-[110px] truncate">{currentWorker.name}</span>
                    <span className="px-1.5 py-0.5 text-[10px] bg-sky-600 text-white rounded-full font-bold">
                      कारीगर
                    </span>
                  </button>

                  <button
                    onClick={onWorkerLogout}
                    className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shrink-0"
                    title="कारीगर खाता लॉगआउट करें"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">लॉगआउट</span>
                  </button>
                </div>
              )}

              {/* SCENARIO B: Customer / Employer Logged In */}
              {currentUser && !currentWorker && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={onOpenMyBookings}
                    className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100 shadow-xs"
                    title="मेरा काम का इतिहास देखें"
                  >
                    <User className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="max-w-[120px] truncate font-bold text-slate-900">{currentUser.name}</span>
                    <span className="hidden md:inline text-xs font-medium text-slate-500">• इतिहास</span>
                    {bookingCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] sm:text-xs font-black bg-slate-900 text-white rounded-full">
                        {bookingCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={onCustomerLogout}
                    className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shrink-0"
                    title="ग्राहक खाता लॉगआउट करें"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">लॉगआउट</span>
                  </button>
                </div>
              )}

              {/* SCENARIO C: Not Logged In */}
              {!isLoggedIn && (
                <>
                  <button
                    onClick={onOpenMyBookings}
                    className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all shrink-0"
                    title="काम का इतिहास देखें"
                  >
                    <ClipboardList className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="hidden md:inline">काम का इतिहास</span>
                    <span className="md:hidden text-xs">इतिहास</span>
                  </button>

                  <button
                    onClick={() => onOpenAuth('customer')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 transition-all shrink-0 shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                    <span>लॉगिन</span>
                  </button>

                  <button
                    onClick={() => onOpenAuth('worker')}
                    className="hidden xl:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all shrink-0"
                    title="कारीगर लॉगिन"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                    <span>कारीगर लॉगिन</span>
                  </button>
                </>
              )}

              {/* Join as Worker CTA */}
              {!currentWorker && (
                <button
                  onClick={onOpenRegister}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all shrink-0 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="hidden lg:inline">Join as Worker <span className="text-xs font-normal text-slate-300">(कारीगर बनें)</span></span>
                  <span className="lg:hidden">कारीगर बनें</span>
                </button>
              )}
            </div>

            {/* Mobile Actions (<640px) */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0">
              {/* Direct Call Quick Link */}
              <a
                href="tel:+918825135461"
                className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 transition-colors"
                title="24x7 हेल्पलाइन"
              >
                <Phone className="w-4 h-4 fill-current" />
              </a>

              {/* Worker Logged in */}
              {currentWorker ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={onOpenWorkerDashboard}
                    className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 relative"
                    title="कारीगर डैशबोर्ड"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  </button>
                  <button
                    onClick={onWorkerLogout}
                    className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700"
                    title="कारीगर लॉगआउट करें"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : currentUser ? (
                /* Customer Logged in */
                <div className="flex items-center gap-1">
                  <button
                    onClick={onOpenMyBookings}
                    className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 relative"
                    title="मेरा इतिहास"
                  >
                    <ClipboardList className="w-4 h-4 text-slate-700" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-slate-900 rounded-full ring-2 ring-white" />
                  </button>
                  <button
                    onClick={onCustomerLogout}
                    className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700"
                    title="ग्राहक लॉगआउट करें"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Not logged in */
                <>
                  <button
                    onClick={() => onOpenAuth('customer')}
                    className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700"
                    title="लॉगिन करें"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onOpenMyBookings}
                    className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700"
                    title="काम का इतिहास (History)"
                  >
                    <ClipboardList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onOpenRegister}
                    className="p-2 rounded-xl bg-slate-900 text-white font-bold"
                    title="कारीगर बनें (Join as Worker)"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-400" />
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
