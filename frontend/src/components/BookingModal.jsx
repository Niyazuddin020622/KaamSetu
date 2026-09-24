import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Wrench
} from 'lucide-react';
import { createBooking } from '../api';

export default function BookingModal({ worker, onClose, onBookingSuccess }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [city, setCity] = useState(worker ? worker.city : 'Ahmedabad');
  const [area, setArea] = useState(worker ? worker.area : '');
  const [serviceRequired, setServiceRequired] = useState(
    worker ? `${worker.category} काम / सर्विस` : 'Service'
  );
  const [jobDescription, setJobDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('सुबह 9 से 12 बजे (Morning)');
  const [urgency, setUrgency] = useState('Today');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  if (!worker) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setError('कृपया अपना नाम, मोबाइल नंबर और पूरा पता दर्ज करें।');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        workerId: worker._id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        city,
        area,
        serviceRequired,
        jobDescription: jobDescription.trim(),
        preferredDate,
        preferredTimeSlot,
        urgency: urgency === 'Emergency' ? 'Emergency (Within 2 Hours)' : urgency,
        estimatedCost: worker.hourlyRate
      };

      const res = await createBooking(payload);
      if (res.success && res.data) {
        setBookingConfirmed(res.data);
        if (onBookingSuccess) {
          onBookingSuccess(res.data);
        }
      } else {
        setError(res.message || 'बुकिंग दर्ज नहीं हो सकी। कृपया दोबारा प्रयास करें।');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'बुकिंग रिक्वेस्ट भेजने में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/90 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-10 h-10 rounded-xl object-cover border border-amber-400"
            />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">{worker.name} को बुक करें</h2>
              <p className="text-[11px] text-amber-400 font-semibold">
                {worker.category} • ₹{worker.hourlyRate}/घंटा
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {bookingConfirmed ? (
          <div className="p-6 sm:p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-1">बुकिंग सफल रही!</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                <span className="text-amber-400 font-bold">{worker.name}</span> को आपका काम भेज दिया गया है।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-slate-400">
                <span>बुकिंग संख्या:</span>
                <span className="font-mono text-white font-bold">{bookingConfirmed._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>कारीगर:</span>
                <span className="text-white font-semibold">{bookingConfirmed.workerName} ({bookingConfirmed.workerCategory})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>दिनांक व समय:</span>
                <span className="text-white font-semibold">{bookingConfirmed.preferredDate}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>विजिटिंग चार्ज:</span>
                <span className="text-amber-400 font-black">₹{bookingConfirmed.estimatedCost}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              कारीगर थोड़ी देर में आपको सीधे कॉल करेगा। या आप अभी खुद भी कॉल कर सकते हैं:
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <a
                href={`tel:${worker.phone}`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md active:scale-95"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>कारीगर को तुरंत कॉल करें ({worker.phone})</span>
              </a>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Urgency Selection - Big Tap Friendly Buttons */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1.5">
                काम कब करवाना है? (When do you need service?)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Emergency', label: '🚨 तुरंत', sub: '2 घंटे में' },
                  { id: 'Today', label: '📅 आज ही', sub: 'आज किसी समय' },
                  { id: 'Tomorrow', label: '🗓️ कल / आगे', sub: 'तय तारीख' }
                ].map((u) => (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => setUrgency(u.id)}
                    className={`p-2.5 rounded-xl text-center border transition-all active:scale-95 ${
                      urgency === u.id
                        ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{u.label}</div>
                    <div className="text-[10px] opacity-80">{u.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  तारीख चुनें (Select Date)
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  पसंदीदा समय (Time Slot)
                </label>
                <select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-semibold"
                >
                  <option value="सुबह 9 से 12 बजे (Morning)">सुबह 9 से 12 बजे (Morning)</option>
                  <option value="दोपहर 12 से 3 बजे (Afternoon)">दोपहर 12 से 3 बजे (Afternoon)</option>
                  <option value="शाम 3 से 7 बजे (Evening)">शाम 3 से 7 बजे (Evening)</option>
                  <option value="तुरंत इमरजेंसी (Emergency)">तुरंत इमरजेंसी (Emergency)</option>
                </select>
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                काम क्या है? (Describe the problem)
              </label>
              <textarea
                rows="2"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="उदा. नल टपक रहा है, पाइप बदलना है, या गेट का कब्जा वेल्ड करना है..."
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Customer Contact */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                आपका नाम व पता (Customer Information)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">आपका नाम (Your Name) *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="उदा. राहुल शर्मा"
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">मोबाइल नंबर (Phone Number) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="उदा. +91 98765 43210"
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">घर का पूरा पता (Full Address) *</label>
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="मकान नंबर, गली/मोहल्ला, लैंडमार्क..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Rate Banner */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-300 font-bold block">विजिटिंग चार्ज: ₹{worker.hourlyRate}</span>
                <span className="text-[10px] text-slate-400">काम पूरा होने पर कारीगर को सीधे भुगतान करें</span>
              </div>
              <span className="text-xs font-black text-white bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                0% कमीशन
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold"
              >
                रद्द करें
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'रिक्वेस्ट जा रही है...' : 'कारीगर को बुक करें (Confirm)'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
