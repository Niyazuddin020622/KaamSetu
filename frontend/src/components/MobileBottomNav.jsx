import React from 'react';
import { Home, Users, ClipboardList, PlusCircle, PhoneCall, MessageCircle } from 'lucide-react';

export default function MobileBottomNav({ 
  onGoHome, 
  onScrollToWorkers, 
  onOpenBookings, 
  onOpenRegister, 
  bookingCount = 0 
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-8px_25px_rgba(0,0,0,0.6)] px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around">
        
        {/* 1. Home */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-amber-400 transition-colors focus:outline-none"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">होम</span>
        </button>

        {/* 2. Workers */}
        <button
          onClick={onScrollToWorkers}
          className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-amber-400 transition-colors focus:outline-none"
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">कारीगर</span>
        </button>

        {/* 3. Join / Register (Highlighted Center Button) */}
        <button
          onClick={onOpenRegister}
          className="flex flex-col items-center justify-center -mt-5 focus:outline-none group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 group-active:scale-95 transition-transform border-2 border-slate-900">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold text-amber-400 mt-1">कारीगर बनें</span>
        </button>

        {/* 4. My Bookings */}
        <button
          onClick={onOpenBookings}
          className="relative flex flex-col items-center justify-center py-1 text-slate-400 hover:text-sky-400 transition-colors focus:outline-none"
        >
          <ClipboardList className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">बुकिंग</span>
          {bookingCount > 0 && (
            <span className="absolute top-0 right-3 w-4 h-4 rounded-full bg-sky-500 text-slate-950 text-[9px] font-black flex items-center justify-center">
              {bookingCount}
            </span>
          )}
        </button>

        {/* 5. Direct Support */}
        <a
          href="tel:+918825135461"
          className="flex flex-col items-center justify-center py-1 text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none"
        >
          <PhoneCall className="w-5 h-5 mb-0.5 animate-pulse" />
          <span className="text-[10px] font-bold">मदद/Help</span>
        </a>

      </div>
    </div>
  );
}
