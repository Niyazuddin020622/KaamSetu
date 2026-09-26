import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  RefreshCw, 
  Search, 
  Bell, 
  Calendar, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  onRefresh, 
  loading, 
  onToggleMobileMenu,
  searchQuery,
  setSearchQuery,
  notification
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'Dashboard Overview & Analytics',
          subtitle: 'Live real-time performance summary of workers, hirers, and revenue'
        };
      case 'workers':
        return {
          title: 'Workers Directory & Work History Ledger',
          subtitle: 'Audit logs: When, which date, which day, and where workers performed jobs'
        };
      case 'employers':
        return {
          title: 'Employers & Hirers History Ledger',
          subtitle: 'Client hiring records: Who called workers, when, and for what service'
        };
      case 'bookings':
        return {
          title: 'Master Bookings & Jobs Ledger',
          subtitle: 'System-wide jobs audit log with live status management and controls'
        };
      default:
        return {
          title: 'KaamSetu Admin Control',
          subtitle: 'Management Portal'
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="sticky top-0 z-30 shrink-0 bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 lg:hidden"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <span>{title}</span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Search, Refresh, Live Clock & Notification */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto">
        {/* Search input if applicable */}
        {setSearchQuery && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs w-44 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records..."
              className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
            />
          </div>
        )}

        {/* Live Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 font-semibold">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Floating alert notification */}
      {notification && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black shadow-xl shadow-amber-500/30 border border-amber-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}
    </header>
  );
}
