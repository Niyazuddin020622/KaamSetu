import React from 'react';
import { Home, Users, ClipboardList, PlusCircle, PhoneCall, Briefcase } from 'lucide-react';

export default function MobileBottomNav({ 
  onGoHome, 
  onScrollToWorkers, 
  onOpenBookings, 
  onOpenRegister, 
  bookingCount = 0,
  currentWorker = null,
  currentUser = null,
  onOpenWorkerDashboard = () => {}
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around">
        
        {/* 1. Home */}
        <button
          onClick={onGoHome}
          className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">होम</span>
        </button>

        {/* 2. Workers */}
        <button
          onClick={onScrollToWorkers}
          className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 transition-colors focus:outline-none"
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">कारीगर</span>
        </button>

        {/* 3. Join / Register (Highlighted Center Button) */}
        <button
          onClick={onOpenRegister}
          className="flex flex-col items-center justify-center -mt-5 focus:outline-none group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-md shadow-slate-900/20 group-active:scale-95 transition-transform border-2 border-white">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-slate-900 mt-1">कारीगर बनें</span>
        </button>

        {/* 4. Worker Dashboard or My Bookings */}
        {currentWorker ? (
          <button
            onClick={onOpenWorkerDashboard}
            className="relative flex flex-col items-center justify-center py-1 text-sky-700 hover:text-sky-800 transition-colors focus:outline-none"
          >
            <Briefcase className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">डैशबोर्ड</span>
            <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>
        ) : (
          <button
            onClick={onOpenBookings}
            className={`relative flex flex-col items-center justify-center py-1 transition-colors focus:outline-none ${
              currentUser ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">{currentUser ? 'मेरी बुकिंग' : 'बुकिंग'}</span>
            {currentUser && (
              <span className="absolute top-0 right-3 w-2 h-2 rounded-full bg-slate-900 ring-2 ring-white" />
            )}
          </button>
        )}

        {/* 5. Direct Support */}
        <a
          href="tel:+918825135461"
          className="flex flex-col items-center justify-center py-1 text-emerald-700 hover:text-emerald-800 transition-colors focus:outline-none"
        >
          <PhoneCall className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">मदद/Help</span>
        </a>

      </div>
    </div>
  );
}
