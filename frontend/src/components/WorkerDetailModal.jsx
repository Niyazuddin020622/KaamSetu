import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  Zap, 
  MessageCircle, 
  Wrench, 
  Languages, 
  Check, 
  Send 
} from 'lucide-react';
import { addWorkerReview } from '../api';

export default function WorkerDetailModal({ 
  worker, 
  onClose, 
  onBookWorker, 
  onWorkerUpdated 
}) {
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'reviews'
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  if (!worker) return null;

  const handleWhatsApp = () => {
    const cleanPhone = worker.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${worker.name} जी, मुझे KaamSetu पर आपका प्रोफाइल मिला। मुझे ${worker.category} काम के लिए आपसे बात करनी है।`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !comment) return;

    setSubmittingReview(true);
    setReviewMessage('');

    try {
      const res = await addWorkerReview(worker._id, {
        customerName,
        rating,
        comment
      });
      if (res.success && res.data) {
        setReviewMessage('आपकी रेटिंग और समीक्षा दर्ज कर ली गई है!');
        setCustomerName('');
        setComment('');
        if (onWorkerUpdated) {
          onWorkerUpdated(res.data);
        }
      }
    } catch (err) {
      setReviewMessage('समीक्षा दर्ज करने में समस्या आई।');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className="relative h-24 sm:h-32 bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-slate-900 border-b border-slate-800 p-4 sm:p-6 flex justify-between items-start shrink-0">
          <div className="flex gap-2">
            {worker.emergencyAvailable && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <Zap className="w-3.5 h-3.5" />
                24x7 इमरजेंसी
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              {worker.badge || 'सत्यापित कारीगर'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header Info */}
        <div className="px-4 sm:px-6 pb-3 pt-0 -mt-10 sm:-mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-3 shrink-0">
          <div className="flex items-end gap-3 sm:gap-4">
            <img
              src={worker.avatar}
              alt={worker.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=200&auto=format&fit=crop&q=80';
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-900 shadow-xl bg-slate-800 shrink-0"
            />
            <div className="mb-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-white">{worker.name}</h2>
                <CheckCircle className="w-4 h-4 text-sky-400" title="Verified Worker" />
              </div>
              <p className="text-amber-400 font-bold text-xs sm:text-sm">
                {worker.category} • <span className="text-slate-300 font-semibold">{worker.experienceYears}+ साल का अनुभव</span>
              </p>
            </div>
          </div>

          {/* Quick Call & WhatsApp Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${worker.phone}`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow transition-all active:scale-95"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>सीधे कॉल करें</span>
            </a>
            <button
              onClick={handleWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900 text-emerald-300 text-xs font-bold transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>व्हाट्सएप</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 flex border-b border-slate-800 gap-6 mt-1 shrink-0">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            जानकारी व हुनर (Overview)
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>ग्राहकों की रेटिंग (Reviews)</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300">
              {worker.reviews ? worker.reviews.length : 0}
            </span>
          </button>
        </div>

        {/* Tab 1: Overview & Skills */}
        {activeTab === 'about' && (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Rates & Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">प्रति घंटा रेट</span>
                <span className="text-lg font-black text-white">₹{worker.hourlyRate}</span>
                <span className="text-[10px] text-slate-500 block">/ घंटा</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">दिन का रेट</span>
                <span className="text-lg font-black text-white">₹{worker.dailyRate || worker.hourlyRate * 7}</span>
                <span className="text-[10px] text-slate-500 block">/ 8 घंटे</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">रेटिंग</span>
                <div className="flex items-center gap-1 text-lg font-black text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{worker.rating}</span>
                </div>
                <span className="text-[10px] text-slate-500 block">{worker.reviewCount} रेटिंग्स</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">काम किए</span>
                <span className="text-lg font-black text-white">{worker.completedJobs}+</span>
                <span className="text-[10px] text-slate-500 block">काम पूरे किए</span>
              </div>
            </div>

            {/* About / Bio */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">कारीगर का परिचय</h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/40">
                {worker.bio}
              </p>
            </div>

            {/* Core Sub-skills */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">मुख्य काम / हुनर</h3>
              <div className="flex flex-wrap gap-1.5">
                {worker.subSkills && worker.subSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-semibold"
                  >
                    <Check className="w-3 h-3 text-amber-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Service Area */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3 text-xs">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">सर्विस का इलाका (Location)</span>
                <span className="text-white font-bold">{worker.area}, {worker.city}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">ग्राहकों की राय</h3>
              {(!worker.reviews || worker.reviews.length === 0) ? (
                <p className="text-slate-400 text-xs italic">अभी कोई समीक्षा नहीं है। आप पहली समीक्षा दें!</p>
              ) : (
                worker.reviews.map((rev, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{rev.customerName}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Review Form */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <h4 className="text-xs font-bold text-white mb-2">{worker.name} के काम को रेटिंग दें</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-2.5">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="आपका नाम..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">रेटिंग:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-amber-400"
                      >
                        <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  required
                  rows="2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="कारीगर का काम कैसा लगा? बताएं..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                />

                {reviewMessage && (
                  <p className="text-xs font-bold text-emerald-400">{reviewMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow"
                >
                  {submittingReview ? 'जमा हो रहा है...' : 'रेटिंग भेजें (Submit)'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer with Book CTA */}
        <div className="p-3 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 block">विजिटिंग चार्ज:</span>
            <div className="text-base sm:text-lg font-black text-white">
              ₹{worker.hourlyRate} <span className="text-xs text-slate-400 font-normal">/ घंटा</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold"
            >
              बंद करें
            </button>
            <button
              onClick={() => {
                onClose();
                onBookWorker(worker);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>अपॉइंटमेंट बुक करें</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
