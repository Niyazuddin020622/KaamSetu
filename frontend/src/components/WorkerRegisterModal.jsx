import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Briefcase, 
  Phone, 
  MapPin, 
  Camera, 
  Image, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { registerWorker } from '../api';

const CATEGORIES = [
  'Plumber', 
  'Welder', 
  'Electrician', 
  'Carpenter', 
  'Painter', 
  'Mason (Mistri)', 
  'AC & Appliance', 
  'Mechanic', 
  'Cleaner & Housekeeping', 
  'General Helper / Labour'
];

const PRESET_AVATARS = [
  { label: 'प्लंबर (Plumber)', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=400&auto=format&fit=crop&q=80' },
  { label: 'वेल्डर (Welder)', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80' },
  { label: 'इलेक्ट्रीशियन (Electrician)', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80' },
  { label: 'बढ़ई (Carpenter)', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80' },
  { label: 'पेंटर (Painter)', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80' },
  { label: 'मिस्त्री (Mason)', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&auto=format&fit=crop&q=80' },
];

export default function WorkerRegisterModal({ onClose, onWorkerRegistered }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Plumber',
    subSkills: '',
    experienceYears: 4,
    hourlyRate: 350,
    dailyRate: 1800,
    city: 'Ahmedabad',
    area: '',
    bio: '',
    avatar: PRESET_AVATARS[0].url,
    emergencyAvailable: false,
    toolsProvided: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // File upload handler - converts camera or gallery picture to base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.area.trim()) {
      setError('कृपया अपना नाम, मोबाइल नंबर और सर्विस का इलाका भरें।');
      return;
    }

    setLoading(true);

    try {
      const res = await registerWorker(formData);
      if (res.success && res.data) {
        setRegisteredSuccess(true);
        if (onWorkerRegistered) {
          onWorkerRegistered(res.data);
        }
      } else {
        setError(res.message || 'पंजीकरण विफल रहा। कृपया विवरण जांचें।');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during worker registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/90 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm xs:text-base sm:text-lg font-black text-white truncate">कारीगर रजिस्ट्रेशन (Join as Worker)</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                सीधे ग्राहकों से काम पाएं • 0% कमीशन • तुरंत शुरुआत
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Screen */}
        {registeredSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">आपका प्रोफाइल बन गया है!</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              आपकी प्रोफाइल अब KaamSetu पर लाइव है। ग्राहक अब सीधे आपके फोन पर कॉल और व्हाट्सएप कर सकेंगे।
            </p>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md"
            >
              कारीगर लिस्ट में देखें (View in Directory)
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Profile Photo Uploader Section */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80">
              <label className="text-xs font-bold text-amber-400 block mb-2">
                📸 कारीगर की प्रोफाइल फोटो (Worker Profile Photo) *
              </label>

              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
                <img
                  src={formData.avatar}
                  alt="Profile Preview"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow bg-slate-900 shrink-0"
                />

                <div className="flex-1 space-y-1.5 sm:space-y-2 w-full min-w-0">
                  <label className="inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer shadow transition-all active:scale-95 w-full xs:w-auto">
                    <Camera className="w-4 h-4 shrink-0" />
                    <span>फोटो अपलोड करें</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400">
                    अपने फोन से अपनी साफ फोटो चुनें ताकि ग्राहक आप पर तुरंत भरोसा कर सकें।
                  </p>
                </div>
              </div>

              {/* Ready-made avatar presets */}
              <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-1.5 font-medium">या इनमें से कोई फोटो चुनें:</span>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData((prev) => ({ ...prev, avatar: av.url }))}
                      className={`relative rounded-xl overflow-hidden border-2 shrink-0 ${
                        formData.avatar === av.url ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-700'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-10 h-10 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="उदा. रमेश भाई पटेल"
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  मोबाइल नंबर (Phone Number) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="उदा. +91 98765 43210"
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Trade & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  काम का प्रकार (Trade Category) *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-semibold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  कितने साल का अनुभव है? (Years of Exp) *
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  min="0"
                  max="50"
                  required
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Rates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  1 घंटे का चार्ज (₹ / hour) *
                </label>
                <input
                  type="number"
                  name="hourlyRate"
                  min="100"
                  step="50"
                  required
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  पूरे दिन (8 घंटे) का रेट (₹ / day)
                </label>
                <input
                  type="number"
                  name="dailyRate"
                  min="500"
                  step="100"
                  value={formData.dailyRate}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* City & Area - Ahmedabad Included */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  शहर (City) *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-semibold"
                >
                  <option value="Ahmedabad">Ahmedabad (अहमदाबाद)</option>
                  <option value="New Delhi">New Delhi (दिल्ली)</option>
                  <option value="Noida">Noida (नोएडा)</option>
                  <option value="Gurugram">Gurugram (गुरुग्राम)</option>
                  <option value="Faridabad">Faridabad (फरीदाबाद)</option>
                  <option value="Ghaziabad">Ghaziabad (गाजियाबाद)</option>
                  <option value="Mumbai">Mumbai (मुंबई)</option>
                  <option value="Bengaluru">Bengaluru (बेंगलुरु)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  इलाका / मोहल्ला (Area / Locality) *
                </label>
                <input
                  type="text"
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="उदा. SG Highway, Maninagar, Satellite..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Sub-skills */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                विशेष कौशल (Special Skills / काम का विवरण)
              </label>
              <input
                type="text"
                name="subSkills"
                value={formData.subSkills}
                onChange={handleChange}
                placeholder="उदा. मेन गेट वेल्डिंग, शेड, ग्रिल, ताला रिपेयर"
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Emergency Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200 font-semibold">
                <input
                  type="checkbox"
                  name="emergencyAvailable"
                  checked={formData.emergencyAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-amber-400 bg-slate-800 border-slate-700"
                />
                <span>🚨 मैं 24x7 इमरजेंसी काम के लिए उपलब्ध हूँ</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
              >
                रद्द करें (Cancel)
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{loading ? 'जमा हो रहा है...' : 'प्रोफाइल बनाएं (Register)'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
