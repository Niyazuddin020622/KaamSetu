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
import { handleImageError } from '../utils/imageHelper';
import AddressInputFields from './AddressInputFields';
import { formatFullAddress, parseAddressString } from '../utils/addressHelper';

export default function BookingModal({ worker, onClose, onBookingSuccess, currentUser = null }) {
  // Check localStorage if currentUser prop wasn't passed directly
  const activeUser = currentUser || (() => {
    try {
      const stored = localStorage.getItem('kaamsetu_customer_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();

  const [customerName, setCustomerName] = useState(activeUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(activeUser?.phone || '');
  
  const [addressDetails, setAddressDetails] = useState(() => {
    if (activeUser?.addressDetails && typeof activeUser.addressDetails === 'object') {
      return activeUser.addressDetails;
    }
    if (activeUser?.address) {
      return parseAddressString(activeUser.address, activeUser.city || worker?.city || 'Ahmedabad');
    }
    return {
      building: '',
      street: activeUser?.area || '',
      city: activeUser?.city || (worker ? worker.city : 'Ahmedabad'),
      pincode: activeUser?.pincode || (worker?.pincode || ''),
      country: 'India'
    };
  });

  const [customerAddress, setCustomerAddress] = useState(
    activeUser?.address || formatFullAddress(addressDetails)
  );
  const [city, setCity] = useState(activeUser?.city || (worker ? worker.city : 'Ahmedabad'));
  const [area, setArea] = useState(activeUser?.area || (worker ? worker.area : ''));
  const [serviceRequired, setServiceRequired] = useState(
    worker ? `${worker.category} काम / सर्विस` : 'Service'
  );
  const [jobDescription, setJobDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('सुबह 9 से 12 बजे (Morning)');
  const [urgency, setUrgency] = useState('Today');
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  if (!worker) return null;

  const handleAddressChange = (addr) => {
    setAddressDetails(addr);
    setCustomerAddress(addr.fullAddress);
    if (addr.city) setCity(addr.city);
    if (addr.street) setArea(addr.street);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalAddress = customerAddress || formatFullAddress(addressDetails);

    if (!customerName.trim() || !customerPhone.trim() || !finalAddress.trim()) {
      setError('कृपया अपना नाम, मोबाइल नंबर और पूरा पता (मकान, सड़क, शहर, पिन कोड) दर्ज करें।');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        workerId: worker._id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: finalAddress.trim(),
        addressDetails,
        pincode: addressDetails.pincode || '',
        city: addressDetails.city || city || worker.city,
        area: addressDetails.street || area || worker.area,
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
              onError={handleImageError}
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

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2 w-full">
              <a
                href={`tel:${worker.phone}`}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 truncate"
              >
                <Phone className="w-4 h-4 fill-current shrink-0" />
                <span className="truncate">कारीगर को तुरंत कॉल करें ({worker.phone})</span>
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2.5 sm:py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold"
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

            {/* City Mismatch Notice Banner */}
            {activeUser?.city && worker?.city && activeUser.city.toLowerCase() !== worker.city.toLowerCase() && (
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>सावधानी: शहर अलग है (City Mismatch Notice)</span>
                </div>
                <p className="leading-relaxed">
                  आपका पंजीकृत शहर <strong className="text-white">{activeUser.city}</strong> है, जबकि कारीगर <strong className="text-white">{worker.name}</strong> केवल <strong className="text-amber-300">{worker.city}</strong> में उपलब्ध हैं।
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p>• यदि आप <strong>{worker.city}</strong> के पते के लिए काम करवाना चाहते हैं, तो नीचे {worker.city} का सटीक पता दर्ज करें।</p>
                  <p>• यदि आप अपने शहर <strong>{activeUser.city}</strong> में कारीगर चाहते हैं, तो कृपया बैक जाकर {activeUser.city} का कारीगर चुनें।</p>
                </div>
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
                <label htmlFor="preferredDate" className="text-xs font-bold text-slate-300 block mb-1">
                  तारीख चुनें (Select Date)
                </label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              <div>
                <label htmlFor="preferredTimeSlot" className="text-xs font-bold text-slate-300 block mb-1">
                  पसंदीदा समय (Time Slot)
                </label>
                <select
                  id="preferredTimeSlot"
                  name="preferredTimeSlot"
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
              <label htmlFor="jobDescription" className="text-xs font-bold text-slate-300 block mb-1">
                काम क्या है? (Describe the problem)
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                rows="2"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="उदा. नल टपक रहा है, पाइप बदलना है, या गेट का कब्जा वेल्ड करना है..."
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Customer Contact */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  आपका नाम व पता (Customer Information)
                </h4>
                {activeUser && (
                  <button
                    type="button"
                    onClick={() => setShowEditAddress(!showEditAddress)}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                  >
                    {showEditAddress ? '✓ सहेजा गया पता रखें' : '✏️ पता बदलें'}
                  </button>
                )}
              </div>

              {activeUser && !showEditAddress ? (
                /* 1-Tap Fast Checkout Card */
                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/80 border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-bold text-white text-xs sm:text-sm truncate">{customerName}</span>
                      <span className="text-slate-400 text-xs">({customerPhone})</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      📍 {customerAddress || `${area}, ${city}`}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    सत्यापित पता
                  </span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="bookingCustomerName" className="text-xs font-bold text-slate-300 block mb-1">आपका नाम (Your Name) *</label>
                      <input
                        id="bookingCustomerName"
                        name="customerName"
                        type="text"
                        required
                        autoComplete="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="उदा. राहुल शर्मा"
                        className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="bookingCustomerPhone" className="text-xs font-bold text-slate-300 block mb-1">मोबाइल नंबर (Phone Number) *</label>
                      <input
                        id="bookingCustomerPhone"
                        name="customerPhone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="उदा. 9876543210"
                        className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <AddressInputFields
                      value={addressDetails}
                      onChange={handleAddressChange}
                      required={true}
                      showPopularChips={true}
                    />
                  </div>
                </>
              )}
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
            <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold"
              >
                रद्द करें
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{loading ? 'रिक्वेस्ट जा रही है...' : 'कारीगर को बुक करें (Confirm)'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
