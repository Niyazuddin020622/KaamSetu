import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ClipboardList, 
  PlusCircle, 
  LogOut, 
  Hammer, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenAddWorker, 
  onLogout,
  workersCount = 0,
  employersCount = 0,
  bookingsCount = 0,
  isMobileOpen = false,
  setIsMobileOpen
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard & Analytics',
      subLabel: 'Platform Overview & KPI',
      icon: LayoutDashboard,
    },
    {
      id: 'workers',
      label: 'Workers & Work History',
      subLabel: 'Verified Directory & Job Logs',
      icon: Users,
      badge: workersCount
    },
    {
      id: 'employers',
      label: 'Employers & Hirers',
      subLabel: 'Customer Hiring History',
      icon: Building2,
      badge: employersCount
    },
    {
      id: 'bookings',
      label: 'Master Bookings Ledger',
      subLabel: 'All Job Tickets & Statuses',
      icon: ClipboardList,
      badge: bookingsCount
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Fixed Sidebar - h-screen, fixed / sticky, does not scroll with page */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        h-screen w-72 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between
        flex-shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out backdrop-blur-xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Branding */}
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Hammer className="w-5 h-5 text-amber-400 transform -rotate-12" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-white">KaamSetu</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full">
                    Admin
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Control Center & Audit</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
              Main Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setIsMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-[1.01]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <div className="truncate">
                      <div className="text-xs leading-snug">{item.label}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
                        {item.subLabel}
                      </div>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Action: Add Worker */}
            <div className="pt-4">
              <button
                onClick={() => {
                  onOpenAddWorker();
                  if (setIsMobileOpen) setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950 transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>Add New Worker</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">Super Admin</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Online" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">admin@kaamsetu.in</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Link to view public client frontend */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
              title="Open Client Website"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Client Site</span>
            </a>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
