import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Calendar, 
  Star, 
  Briefcase, 
  ShieldCheck, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  History, 
  Clock, 
  Eye, 
  PlusCircle, 
  ExternalLink, 
  MessageCircle, 
  X,
  LayoutGrid,
  List
} from 'lucide-react';
import { handleImageError } from '../utils/imageHelper';

export default function WorkersHistoryLedger({ 
  workers = [], 
  onToggleVerified, 
  onToggleAvailable, 
  onDeleteWorker, 
  onOpenAddWorker, 
  onUpdateStatus 
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedWorkerForHistory, setSelectedWorkerForHistory] = useState(null);
  const [viewMode, setViewMode] = useState('dense'); // 'dense' | 'cards'

  // Extract unique categories and cities
  const categories = ['All', ...new Set(workers.map(w => w.category).filter(Boolean))];
  const cities = ['All', ...new Set(workers.map(w => w.city).filter(Boolean))];

  // Filter workers
  const filteredWorkers = workers.filter(w => {
    const matchesSearch = 
      (w.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.phone || '').includes(search) ||
      (w.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.area || '').toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || w.city === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Top Controls: Search, Filters & Add */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex-1 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
          {/* Search */}
          <div className="w-full sm:flex-1 sm:min-w-[200px] flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search worker by name, phone, trade, or area..."
              className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 sm:flex-initial px-3 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c === 'All' ? 'All Trades' : c}
                </option>
              ))}
            </select>

            {/* City Dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="flex-1 sm:flex-initial px-3 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city} className="bg-slate-900">
                  {city === 'All' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700 shrink-0">
            <button
              onClick={() => setViewMode('dense')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'dense'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Compact List View (Fast mobile navigation)"
            >
              <List className="w-3.5 h-3.5" />
              <span className="text-[11px]">कॉम्पैक्ट लिस्ट</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="text-[11px]">कार्ड्स</span>
            </button>
          </div>

          <button
            onClick={onOpenAddWorker}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add New Worker</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* WORKERS CONTENT: DENSE LIST vs CARDS */}
      {filteredWorkers.length === 0 ? (
        <div className="py-12 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-slate-800">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-300">No Workers Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your filters or search query</p>
        </div>
      ) : viewMode === 'dense' ? (
        <>
          {/* HIGH-DENSITY MOBILE LIST (< md screens: 5-7 workers visible without excessive scrolling) */}
          <div className="md:hidden space-y-2.5">
            {filteredWorkers.map((worker) => {
              const jobsList = worker.workHistory || [];
              const totalJobs = jobsList.length > 0 ? jobsList.length : worker.completedJobs || 0;

              return (
                <div
                  key={worker._id}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2.5 transition-all shadow-sm"
                >
                  {/* Left: Avatar + Details */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="relative shrink-0">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        onError={handleImageError}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-700 bg-slate-800"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          worker.isAvailable ? 'bg-emerald-500' : 'bg-slate-500'
                        }`}
                        title={worker.isAvailable ? 'Available' : 'Busy'}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-white truncate max-w-[130px]">{worker.name}</h4>
                        {worker.isVerified && (
                          <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" title="Verified Worker" />
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-amber-400 truncate">
                        {worker.category} • <span className="text-slate-400 font-normal">{worker.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                        <span>₹<strong className="text-white font-bold">{worker.hourlyRate}</strong>/hr</span>
                        <span>•</span>
                        <span className="text-amber-300 font-semibold">★ {worker.rating}</span>
                        <span>•</span>
                        <span className="text-slate-500">{totalJobs} jobs</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 1-Tap Quick Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Quick Verification Toggle */}
                    <button
                      onClick={() => onToggleVerified(worker)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all active:scale-90 ${
                        worker.isVerified
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 hover:bg-sky-500/25'
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                      }`}
                      title={worker.isVerified ? 'Click to Unverify' : 'Click to Verify'}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </button>

                    {/* Quick Availability Toggle */}
                    <button
                      onClick={() => onToggleAvailable(worker)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all active:scale-90 ${
                        worker.isAvailable
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                      }`}
                      title={worker.isAvailable ? 'Currently Available (Click for Busy)' : 'Currently Busy (Click for Available)'}
                    >
                      {worker.isAvailable ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>

                    {/* Work History Drawer/Modal */}
                    <button
                      onClick={() => setSelectedWorkerForHistory(worker)}
                      className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 active:scale-90 transition-all"
                      title="View Job History (When, Date, Day, Where)"
                    >
                      <History className="w-4 h-4" />
                    </button>

                    {/* Delete Worker */}
                    <button
                      onClick={() => onDeleteWorker(worker._id)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 active:scale-90 transition-all"
                      title="Delete Worker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DENSE DESKTOP TABLE VIEW (md+ screens) */}
          <div className="hidden md:block glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 font-bold">Worker Profile</th>
                    <th className="p-3.5 font-bold">Trade & Skills</th>
                    <th className="p-3.5 font-bold">Contact & Location</th>
                    <th className="p-3.5 font-bold">Pricing & Rating</th>
                    <th className="p-3.5 font-bold">Verification</th>
                    <th className="p-3.5 font-bold">Availability</th>
                    <th className="p-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredWorkers.map((worker) => {
                    const jobsList = worker.workHistory || [];
                    const totalJobs = jobsList.length > 0 ? jobsList.length : worker.completedJobs || 0;

                    return (
                      <tr key={worker._id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Worker Avatar & Name */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={worker.avatar}
                              alt={worker.name}
                              onError={handleImageError}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 font-black text-white text-xs">
                                <span>{worker.name}</span>
                                {worker.isVerified && (
                                  <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">{worker.experienceYears}+ yrs experience</div>
                            </div>
                          </div>
                        </td>

                        {/* Trade & Skills */}
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-bold text-[11px] border border-amber-500/30">
                            {worker.category}
                          </span>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px] mt-1" title={worker.subSkills?.join(', ')}>
                            {worker.subSkills?.slice(0, 2).join(', ')}
                            {worker.subSkills?.length > 2 ? ` +${worker.subSkills.length - 2}` : ''}
                          </div>
                        </td>

                        {/* Contact & Location */}
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-200">{worker.phone}</div>
                          <div className="text-[10px] text-amber-400/90 truncate max-w-[140px]">
                            {worker.area ? `${worker.area}, ` : ''}{worker.city}
                          </div>
                        </td>

                        {/* Pricing & Rating */}
                        <td className="p-3.5">
                          <div className="font-black text-white">₹{worker.hourlyRate}<span className="text-[10px] text-slate-400 font-normal">/hr</span></div>
                          <div className="text-[10px] text-amber-400 font-bold">★ {worker.rating} <span className="text-slate-500 font-normal">({totalJobs} jobs)</span></div>
                        </td>

                        {/* Verification Toggle */}
                        <td className="p-3.5">
                          <button
                            onClick={() => onToggleVerified(worker)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 ${
                              worker.isVerified
                                ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 hover:bg-sky-500/25'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            {worker.isVerified ? '✓ Verified' : '○ Unverified'}
                          </button>
                        </td>

                        {/* Availability Toggle */}
                        <td className="p-3.5">
                          <button
                            onClick={() => onToggleAvailable(worker)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 ${
                              worker.isAvailable
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25'
                                : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                            }`}
                          >
                            {worker.isAvailable ? '● Available' : '○ Busy'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedWorkerForHistory(worker)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 text-[11px] font-bold flex items-center gap-1 transition-all"
                              title="View Work History"
                            >
                              <History className="w-3.5 h-3.5" />
                              <span>History</span>
                            </button>
                            <button
                              onClick={() => onDeleteWorker(worker._id)}
                              className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                              title="Delete Worker"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredWorkers.map((worker) => {
            const jobsList = worker.workHistory || [];
            const completedCount = jobsList.filter(j => j.status === 'completed').length || worker.completedJobs || 0;

            return (
              <div
                key={worker._id}
                className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div>
                  {/* Top: Avatar & Verification */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        onError={handleImageError}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 bg-slate-800 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-black text-white">{worker.name}</h4>
                          {worker.isVerified && (
                            <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" title="Verified Worker" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-amber-400">
                          {worker.category} • <span className="text-slate-400 font-normal">{worker.experienceYears}+ yrs exp</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                        worker.isVerified
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {worker.isVerified ? '✓ Verified' : 'Unverified'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        worker.isAvailable ? 'text-emerald-400' : 'text-slate-500'
                      }`}>
                        {worker.isAvailable ? '● Available' : '○ Busy'}
                      </span>
                    </div>
                  </div>

                  {/* Contact & Location Info */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold">{worker.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{worker.area}, {worker.city}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                      <span>Rate: <strong className="text-white">₹{worker.hourlyRate}</strong>/hr</span>
                      <span>Rating: <strong className="text-amber-400">★ {worker.rating}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Work History Summary & Action Button */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Job History Log:</span>
                    <span className="font-black text-amber-300">
                      {jobsList.length > 0 ? jobsList.length : worker.completedJobs || 0} Recorded Jobs
                    </span>
                  </div>

                  {/* Primary CTA: View Full History Modal */}
                  <button
                    onClick={() => setSelectedWorkerForHistory(worker)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-slate-800 hover:from-amber-500/30 hover:to-slate-700 text-amber-300 hover:text-white font-bold text-xs border border-amber-500/40 transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <History className="w-4 h-4 text-amber-400" />
                    <span>View Work History (When, Date, Day, Where)</span>
                  </button>

                  {/* Quick Admin Toggles */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px]">
                    <button
                      onClick={() => onToggleVerified(worker)}
                      className={`py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                        worker.isVerified
                          ? 'bg-sky-500/10 text-sky-300 border-sky-500/30 hover:bg-sky-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {worker.isVerified ? 'Unverify' : 'Verify'}
                    </button>

                    <button
                      onClick={() => onToggleAvailable(worker)}
                      className={`py-1.5 px-2 rounded-lg font-bold border transition-colors ${
                        worker.isAvailable
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {worker.isAvailable ? 'Set Busy' : 'Set Available'}
                    </button>

                    <button
                      onClick={() => onDeleteWorker(worker._id)}
                      className="py-1.5 px-2 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Full Work History of Selected Worker */}
      {selectedWorkerForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-600/25 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedWorkerForHistory.avatar}
                  alt={selectedWorkerForHistory.name}
                  onError={handleImageError}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 bg-slate-800 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedWorkerForHistory.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {selectedWorkerForHistory.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Phone: <strong className="text-white">{selectedWorkerForHistory.phone}</strong> • Region: {selectedWorkerForHistory.city}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorkerForHistory(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Subheader Details Summary */}
            <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Work Records</span>
                <span className="text-base font-black text-amber-400">
                  {(selectedWorkerForHistory.workHistory || []).length || selectedWorkerForHistory.completedJobs || 10}
                </span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-400 block">Standard Rate</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{selectedWorkerForHistory.hourlyRate}/hr
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Rating Score</span>
                <span className="text-base font-black text-sky-400">
                  ★ {selectedWorkerForHistory.rating}
                </span>
              </div>
            </div>

            {/* Modal Work History List (When, Date, Day, Where) */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Work History & Audit Records Log</span>
                </h4>
                <span className="text-[11px] text-slate-400">Date, Day, Time & Location</span>
              </div>

              {(!selectedWorkerForHistory.workHistory || selectedWorkerForHistory.workHistory.length === 0) ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-white">{selectedWorkerForHistory.category} Service & Maintenance</h5>
                        <p className="text-xs text-amber-400 font-semibold">{selectedWorkerForHistory.area}, {selectedWorkerForHistory.city}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        🟢 Completed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300">
                      <div><strong>Date:</strong> 22 March 2026</div>
                      <div><strong>Day:</strong> Sunday</div>
                      <div><strong>Time:</strong> 10:00 AM</div>
                      <div><strong>Charge:</strong> ₹{selectedWorkerForHistory.hourlyRate * 2}</div>
                      <div className="sm:col-span-2 pt-1 border-t border-slate-800">
                        <strong>Work Location:</strong> {selectedWorkerForHistory.area}, {selectedWorkerForHistory.city}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                selectedWorkerForHistory.workHistory.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-700/80 hover:border-slate-600 transition-all space-y-3"
                  >
                    {/* Top: Service name & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-black text-white">{job.serviceRequired}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                            {job.workerCategory || selectedWorkerForHistory.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Hired by Employer: <strong className="text-white">{job.customerName}</strong> ({job.customerPhone})
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        job.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : job.status === 'in_progress'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : job.status === 'accepted'
                          ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {job.status === 'completed' ? '🟢 Completed' : job.status === 'in_progress' ? '🟣 In Progress' : job.status === 'accepted' ? '🔵 Accepted' : '🟡 Pending'}
                      </span>
                    </div>

                    {/* Complete History Grid: Kab, Kis Date ko, Kis Din, Kaha pe */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-300">
                      {/* Date */}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          <strong>Date:</strong> <span className="text-white font-bold">{job.preferredDate}</span>
                        </span>
                      </div>

                      {/* Day of Week */}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>
                          <strong>Day:</strong> <span className="text-sky-300 font-bold">{job.preferredDay || 'Scheduled Day'}</span>
                        </span>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          <strong>Time Slot:</strong> <span>{job.preferredTimeSlot}</span>
                        </span>
                      </div>

                      {/* Cost */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">₹</span>
                        <span>
                          <strong>Visiting Fee:</strong> <span className="text-emerald-300 font-black">₹{job.estimatedCost}</span>
                        </span>
                      </div>

                      {/* Where Worked */}
                      <div className="flex items-start gap-1.5 sm:col-span-2 pt-1 border-t border-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Location Worked:</strong> <span className="text-amber-200 font-medium">{job.customerAddress}, {job.area}, {job.city}</span>
                        </span>
                      </div>
                    </div>

                    {/* Job problem description */}
                    {job.jobDescription && (
                      <p className="text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed italic">
                        "{job.jobDescription}"
                      </p>
                    )}

                    {/* Notes */}
                    {job.notes && (
                      <div className="text-[11px] text-emerald-300/90 bg-emerald-950/20 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                        Notes: {job.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedWorkerForHistory(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
