import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  IndianRupee, 
  TrendingUp, 
  MapPin, 
  Briefcase, 
  Building2, 
  Calendar, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

export default function DashboardOverview({ 
  stats, 
  onNavigateTab 
}) {
  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Loading analytics data...
      </div>
    );
  }

  const { workers = {}, bookings = {}, recentBookings = [] } = stats;

  const kpis = [
    {
      label: 'Total Registered Workers',
      value: workers.total || 0,
      subtext: `${workers.verified || 0} Verified • ${workers.available || 0} Available Now`,
      icon: Users,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-400',
      actionTab: 'workers'
    },
    {
      label: 'Total Jobs / Bookings',
      value: bookings.total || 0,
      subtext: `${bookings.completed || 0} Completed • ${bookings.pending || 0} Pending`,
      icon: ClipboardList,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-400',
      actionTab: 'bookings'
    },
    {
      label: 'Successfully Completed',
      value: bookings.completed || 0,
      subtext: '100% Service Fulfillment',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      actionTab: 'bookings'
    },
    {
      label: 'Estimated Gross Business',
      value: `₹${(bookings.totalRevenue || 0).toLocaleString('en-IN')}`,
      subtext: 'Total worker visiting revenue',
      icon: IndianRupee,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400',
      actionTab: 'bookings'
    }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Audit Engine Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            KaamSetu Enterprise Control Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Real-time tracking of worker job execution history (when, which date, which day, and where) alongside employer hiring records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('workers')}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Worker Work History</span>
          </button>
          <button
            onClick={() => onNavigateTab('employers')}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Employer Hiring History</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              onClick={() => onNavigateTab(kpi.actionTab)}
              className="glass-card rounded-3xl p-5 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {kpi.label}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${kpi.color} p-0.5 shadow-md`}>
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${kpi.textColor}`} />
                    </div>
                  </div>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-white">
                  {kpi.value}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{kpi.subtext}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Columns: Category Distribution & City Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Workers by Category */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Workers by Trade Category</span>
            </h3>
            <span className="text-xs text-amber-400 font-bold">
              {workers.byCategory ? workers.byCategory.length : 0} Trades
            </span>
          </div>

          <div className="space-y-2.5">
            {workers.byCategory && workers.byCategory.map((cat, idx) => {
              const percentage = workers.total ? Math.round((cat.count / workers.total) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{cat._id}</span>
                    <span className="text-slate-400 font-semibold">{cat.count} Workers ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City Breakdown */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Network Coverage by City</span>
            </h3>
            <span className="text-xs text-slate-400">Hubs Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {workers.byCity && workers.byCity.map((city, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200">{city._id}</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-black border border-amber-500/20">
                  {city.count} Workers
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Bookings Activity Table */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Recent Jobs & Bookings Activity</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest jobs scheduled, executed, and completed across the platform
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold">Worker</th>
                <th className="pb-3 font-bold">Employer / Hirer</th>
                <th className="pb-3 font-bold">Service Required</th>
                <th className="pb-3 font-bold">Date & Day</th>
                <th className="pb-3 font-bold">Location</th>
                <th className="pb-3 font-bold">Cost</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">
                    No recent booking activity found.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3">
                      <div className="font-bold text-white">{b.workerName}</div>
                      <div className="text-[10px] text-amber-400">{b.workerCategory}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-slate-200">{b.customerName}</div>
                      <div className="text-[10px] text-slate-400">{b.customerPhone}</div>
                    </td>
                    <td className="py-3 font-medium text-slate-300">
                      {b.serviceRequired}
                    </td>
                    <td className="py-3">
                      <div className="text-white font-semibold">{b.preferredDate}</div>
                      <div className="text-[10px] text-sky-300">{b.preferredDay || 'Scheduled Day'}</div>
                    </td>
                    <td className="py-3 text-slate-300">
                      {b.area ? `${b.area}, ` : ''}{b.city}
                    </td>
                    <td className="py-3 font-black text-amber-400">
                      ₹{b.estimatedCost}
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        b.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : b.status === 'in_progress'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : b.status === 'accepted'
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
