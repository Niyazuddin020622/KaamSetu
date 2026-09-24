import React from 'react';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  Zap,
  MessageCircle
} from 'lucide-react';

export default function WorkerCard({ worker, onSelectWorker, onBookWorker }) {
  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const cleanPhone = worker.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${worker.name} जी, मुझे KaamSetu पर आपका ${worker.category} प्रोफाइल मिला है। मुझे काम के लिए आपकी सेवा चाहिए।`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.open(`tel:${worker.phone}`);
  };

  return (
    <div 
      onClick={() => onSelectWorker(worker)}
      className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer border border-slate-800 hover:border-amber-400/50 relative group transition-all"
    >
      <div>
        {/* Top: Photo, Online status & Verified Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="relative">
            <img
              src={worker.avatar}
              alt={worker.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=200&auto=format&fit=crop&q=80';
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-md group-hover:border-amber-400 transition-colors bg-slate-800"
            />
            {worker.isAvailable && (
              <span 
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-md" 
                title="अभी उपलब्ध हैं (Available Now)" 
              />
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {worker.emergencyAvailable && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                <Zap className="w-3 h-3 text-rose-400" />
                24x7 इमरजेंसी
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              {worker.badge || 'सत्यापित कारीगर'}
            </span>
          </div>
        </div>

        {/* Worker Name & Trade Category */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
              {worker.name}
            </h3>
            {worker.isVerified && (
              <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" title="Verified Worker" />
            )}
          </div>
          <p className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
            <span>{worker.category}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 text-xs font-semibold">{worker.experienceYears}+ साल का अनुभव</span>
          </p>
        </div>

        {/* Ratings & Completed Jobs */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mb-2.5">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-black text-white">{worker.rating}</span>
            <span className="text-slate-400 text-[11px]">({worker.reviewCount} रेटिंग)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Briefcase className="w-3 h-3 text-slate-400" />
            <span>{worker.completedJobs} काम किए</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-3">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate font-medium">{worker.area}, {worker.city}</span>
        </div>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {worker.subSkills && worker.subSkills.slice(0, 3).map((skill, idx) => (
            <span 
              key={idx}
              className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
            >
              {skill}
            </span>
          ))}
          {worker.subSkills && worker.subSkills.length > 3 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-lg bg-slate-800/60 text-slate-400">
              +{worker.subSkills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom: Pricing & Big Mobile Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 mt-auto">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">विजिटिंग चार्ज / Rate:</span>
            <div className="text-base sm:text-lg font-black text-white">
              ₹{worker.hourlyRate}
              <span className="text-xs font-normal text-slate-400"> / घंटा</span>
            </div>
          </div>
          {worker.dailyRate && (
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">पूरा दिन (8 घंटे):</span>
              <div className="text-xs sm:text-sm font-bold text-slate-300">
                ₹{worker.dailyRate}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Large touch targets for smartphones */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {/* Direct Call Button (Phone icon in green) */}
          <button
            type="button"
            onClick={handleCall}
            className="flex items-center justify-center gap-1 py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md shadow-emerald-950 transition-all active:scale-95"
            title="सीधे फोन करें"
          >
            <Phone className="w-4 h-4 shrink-0 fill-current" />
            <span>कॉल</span>
          </button>

          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1 py-3 px-2 rounded-xl bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900 text-emerald-300 text-xs font-bold transition-all active:scale-95"
            title="व्हाट्सएप पर बात करें"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>व्हाट्सएप</span>
          </button>

          {/* Book Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookWorker(worker);
            }}
            className="flex items-center justify-center gap-1 py-3 px-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all active:scale-95"
            title="अपॉइंटमेंट बुक करें"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>बुक करें</span>
          </button>
        </div>
      </div>
    </div>
  );
}
