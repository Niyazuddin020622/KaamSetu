import React, { useState, useEffect } from 'react';
import { 
  X, 
  Briefcase, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle, 
  DollarSign, 
  Check, 
  XCircle, 
  PlayCircle, 
  Star, 
  Power, 
  LogOut,
  RefreshCw,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import { 
  getWorkerSecureJobs, 
  updateBookingStatus, 
  toggleWorkerAvailability, 
  workerLogout 
} from '../api';
import { handleImageError } from '../utils/imageHelper';

const STATUS_BADGES = {
  pending: {
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    label: '🟡 नया अनुरोध (New Request)'
  },
  accepted: {
    bg: 'bg-blue-50 text-blue-800 border-blue-200',
    label: '🔵 स्वीकृत (Accepted)'
  },
  in_progress: {
    bg: 'bg-purple-50 text-purple-800 border-purple-200',
    label: '🟣 काम जारी है (In Progress)'
  },
  completed: {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    label: '🟢 पूरा हुआ (Completed)'
  },
  cancelled: {
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    label: '🔴 रद्द (Cancelled)'
  }
};

export default function WorkerDashboardModal({ 
  isOpen, 
  onClose, 
  workerUser, 
  onWorkerLogout 
}) {
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState({
    totalJobs: 0,
    completedJobs: 0,
    activeJobs: 0,
    totalEarnings: 0
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [isAvailable, setIsAvailable] = useState(workerUser?.isAvailable ?? true);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getWorkerSecureJobs();
      if (res.success) {
        setJobs(res.data || []);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'जॉब हिस्ट्री लोड करने में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
      if (workerUser) {
        setIsAvailable(workerUser.isAvailable ?? true);
      }
    }
  }, [isOpen, workerUser]);

  if (!isOpen) return null;

  const getSlotKey = (slotStr) => {
    if (!slotStr) return 'morning';
    const s = slotStr.toLowerCase();
    if (s.includes('full') || s.includes('पूरा')) return 'full_day';
    if (s.includes('emerg') || s.includes('तुरंत')) return 'emergency';
    if (s.includes('afternoon') || s.includes('दोपहर')) return 'afternoon';
    if (s.includes('even') || s.includes('शाम')) return 'evening';
    if (s.includes('morn') || s.includes('सुबह')) return 'morning';
    return 'morning';
  };

  const areSlotsConflicting = (slot1, slot2) => {
    const k1 = getSlotKey(slot1);
    const k2 = getSlotKey(slot2);
    if (k1 === 'full_day' || k2 === 'full_day') return true;
    return k1 === k2;
  };

  const getConflictingActiveJob = (pendingJob) => {
    if (!pendingJob || pendingJob.status !== 'pending') return null;
    return jobs.find((j) => 
      j._id !== pendingJob._id &&
      ['accepted', 'in_progress'].includes(j.status) &&
      j.preferredDate === pendingJob.preferredDate &&
      areSlotsConflicting(j.preferredTimeSlot, pendingJob.preferredTimeSlot)
    );
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await updateBookingStatus(bookingId, newStatus);
      if (res.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === bookingId ? { ...j, status: newStatus } : j))
        );
        setActionMsg(
          res.message ||
          (newStatus === 'completed'
            ? '🎉 बधाई! काम पूरा मार्क हो गया।'
            : newStatus === 'accepted'
            ? '✅ काम स्वीकार कर लिया गया है।'
            : newStatus === 'in_progress'
            ? '🛠️ काम शुरू मार्क कर दिया गया है।'
            : 'स्टेटस अपडेट हो गया।')
        );
        // Refresh summary & jobs
        fetchJobs();
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'स्टेटस बदलने में समस्या आई।';
      alert(msg);
    }
  };

  const handleToggleOnline = async () => {
    try {
      const res = await toggleWorkerAvailability();
      if (res.success) {
        setIsAvailable(res.isAvailable);
        setActionMsg(res.message);
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWhatsApp = (job) => {
    const cleanPhone = (job.customerPhone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${job.customerName} जी, मैं ${job.workerName || 'KaamSetu कारीगर'} बोल रहा हूँ। आपके ${job.serviceRequired} काम के सिलसिले में संपर्क कर रहा हूँ।`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleLogout = () => {
    workerLogout();
    if (onWorkerLogout) onWorkerLogout();
    onClose();
  };

  const filteredJobs = jobs.filter((j) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return j.status === 'pending';
    if (statusFilter === 'active') return ['accepted', 'in_progress'].includes(j.status);
    if (statusFilter === 'completed') return j.status === 'completed';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {workerUser?.avatar ? (
              <img 
                src={workerUser.avatar} 
                alt={workerUser.name} 
                onError={handleImageError}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0" 
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                <Briefcase className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {workerUser?.name || 'कारीगर साथी'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {workerUser?.category || 'Worker'}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{workerUser?.phone}</span>
                <span>•</span>
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{workerUser?.area ? `${workerUser.area}, ` : ''}{workerUser?.city || 'Ahmedabad'}</span>
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Availability Toggle */}
            <button
              onClick={handleToggleOnline}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isAvailable
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isAvailable ? '🟢 काम के लिए उपलब्ध' : '🔴 अभी व्यस्त (Offline)'}</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="लॉगआउट करें"
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Action Notice */}
        {actionMsg && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-2 text-xs font-bold text-center shrink-0">
            {actionMsg}
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 sm:p-4 bg-slate-50/70 border-b border-slate-200 shrink-0">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{summary.totalJobs}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">कुल काम (Total Jobs)</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-amber-700">{summary.activeJobs}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">एक्टिव काम (Active)</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-700">{summary.completedJobs}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">पूरे हुए (Done)</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-purple-700">₹{summary.totalEarnings.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">कुल कमाई (Earnings)</div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: `सभी (${jobs.length})` },
              { id: 'pending', label: `नए अनुरोध (${jobs.filter(j => j.status === 'pending').length})` },
              { id: 'active', label: `चालू काम (${jobs.filter(j => ['accepted', 'in_progress'].includes(j.status)).length})` },
              { id: 'completed', label: `पूरे हुए (${jobs.filter(j => j.status === 'completed').length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchJobs}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs flex items-center gap-1 transition-colors shrink-0"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-slate-900' : ''}`} />
          </button>
        </div>

        {/* Job List Container */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/50">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {loading && jobs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">आपके काम लोड हो रहे हैं...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-xs">
                <Briefcase className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900">इस केटेगरी में कोई काम नहीं मिला</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                जब भी कोई ग्राहक आपको काम पर बुलाएगा, वह बुकिंग तुरंत सिर्फ आपके इस डैशबोर्ड में दिखेगी।
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const badge = STATUS_BADGES[job.status] || STATUS_BADGES.pending;

              return (
                <div 
                  key={job._id}
                  className="bg-white hover:border-slate-300 border border-slate-200 rounded-2xl p-4 transition-all shadow-xs space-y-3"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{job.serviceRequired}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {job.urgency && job.urgency.includes('Emergency') && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            🚨 तुरंत चाहिए
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-sky-600" />
                          <span>{job.preferredDate} ({job.preferredDay || ''})</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-600" />
                          <span>{job.preferredTimeSlot}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">अनुमानित चार्ज</div>
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        ₹{job.estimatedCost || '—'}
                      </div>
                    </div>
                  </div>

                  {/* Customer Information (Private to this worker) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">ग्राहक का विवरण:</div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                        <span>{job.customerName}</span>
                      </div>
                      <div className="text-slate-700 flex items-center gap-1.5 font-medium">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{job.customerPhone}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">काम का पता:</div>
                      <div className="text-slate-700 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>
                          {job.customerAddress && job.city && job.customerAddress.toLowerCase().includes(job.city.toLowerCase())
                            ? job.customerAddress
                            : `${job.customerAddress || ''}${job.area ? `, ${job.area}` : ''}${job.city ? `, ${job.city}` : ''}`}
                        </span>
                      </div>
                      {job.jobDescription && (
                        <div className="text-[11px] text-slate-600 italic mt-1">
                          "{job.jobDescription}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Slot Conflict Banner if Worker already accepted another job for this exact slot */}
                  {(() => {
                    const conflict = getConflictingActiveJob(job);
                    if (!conflict) return null;
                    return (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          <strong>⚠️ समय टकराव (Conflict):</strong> आपने इस तारीख ({job.preferredDate}) और समय का दूसरा काम (<strong>{conflict.customerName}</strong>) पहले ही स्वीकार कर रखा है।
                        </span>
                      </div>
                    );
                  })()}

                  {/* Notes (e.g. cancellation reasons or system updates) */}
                  {job.notes && (
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold shrink-0">नोट:</span>
                      <span>{job.notes}</span>
                    </div>
                  )}

                  {/* Actions & Status Workflow Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {/* Contact Customer */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${job.customerPhone}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>कॉल करें</span>
                      </a>
                      <button
                        onClick={() => handleWhatsApp(job)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>व्हाट्सएप</span>
                      </button>
                    </div>

                    {/* Status Triggers */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {job.status === 'pending' && (() => {
                        const conflict = getConflictingActiveJob(job);
                        return (
                          <>
                            <button
                              disabled={Boolean(conflict)}
                              onClick={() => handleStatusChange(job._id, 'accepted')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-transform ${
                                conflict
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                  : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                              }`}
                              title={conflict ? 'इस समय का दूसरा काम पहले से स्वीकृत है' : 'काम स्वीकारें'}
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{conflict ? 'समय व्यस्त है' : 'काम स्वीकारें (Accept)'}</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange(job._id, 'cancelled')}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
                            >
                              रद्द करें
                            </button>
                          </>
                        );
                      })()}

                      {job.status === 'accepted' && (
                        <button
                          onClick={() => handleStatusChange(job._id, 'in_progress')}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>काम शुरू किया (Start Work)</span>
                        </button>
                      )}

                      {job.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusChange(job._id, 'completed')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>काम पूरा हुआ (Complete & Earn)</span>
                        </button>
                      )}

                      {job.status === 'completed' && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>काम सफलता से पूरा हुआ</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>सुरक्षा गारंटी: यह विवरण सिर्फ आपके अलावा किसी अन्य कारीगर को नहीं दिखाई देता।</span>
        </div>
      </div>
    </div>
  );
}
