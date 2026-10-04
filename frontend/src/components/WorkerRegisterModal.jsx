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
import { handleImageError } from '../utils/imageHelper';
import { CITIES, getCityAreas, getCityFromPincode } from '../utils/cityMaster';
import { TRADE_CATEGORIES, getSkillsByCategory } from '../utils/tradeSkills';

const CATEGORIES = TRADE_CATEGORIES;

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
    pin: '',
    email: '',
    category: 'Plumber',
    subSkills: getSkillsByCategory('Plumber').slice(0, 4),
    experienceYears: 4,
    hourlyRate: 350,
    dailyRate: 1800,
    city: 'Ahmedabad',
    area: '',
    pincode: '',
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
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      if (name === 'category') {
        updated.category = value;
        // Auto-populate default core skills for the newly selected category
        updated.subSkills = getSkillsByCategory(value).slice(0, 4);
      }
      if (name === 'pincode') {
        const cleanPin = value.replace(/[^0-9]/g, '').slice(0, 6);
        updated.pincode = cleanPin;
        if (cleanPin.length >= 3) {
          const matched = getCityFromPincode(cleanPin);
          if (matched) {
            updated.city = matched.name;
          }
        }
      }
      return updated;
    });
  };

  const handleToggleSkill = (skill) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.subSkills) ? prev.subSkills : [];
      const updated = current.includes(skill)
        ? current.filter((s) => s !== skill)
        : [...current, skill];
      return { ...prev, subSkills: updated };
    });
  };

  const handleSelectAllSkills = () => {
    const all = getSkillsByCategory(formData.category);
    setFormData((prev) => ({ ...prev, subSkills: [...all] }));
  };

  const handleClearSkills = () => {
    setFormData((prev) => ({ ...prev, subSkills: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.area.trim()) {
      setError('कृपया अपना नाम, मोबाइल नंबर और सर्विस का इलाका भरें।');
      return;
    }

    if (!formData.pin || formData.pin.toString().trim().length < 4) {
      setError('कृपया कम से कम 4 अंकों का गुप्त लॉगिन PIN बनाएं।');
      return;
    }

    if (!formData.subSkills || formData.subSkills.length === 0) {
      setError('कृपया अपने काम का कम से कम 1 विशेष कौशल (Special Skill) चेकबॉक्स से चुनें।');
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
                  onError={handleImageError}
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
                      <img src={av.url} alt={av.label} onError={handleImageError} className="w-10 h-10 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="workerRegName" className="text-xs font-bold text-slate-300 block mb-1">
                  पूरा नाम (Full Name) *
                </label>
                <input
                  id="workerRegName"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="उदा. रमेश भाई पटेल"
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label htmlFor="workerRegPhone" className="text-xs font-bold text-slate-300 block mb-1">
                  मोबाइल नंबर (Phone Number) *
                </label>
                <input
                  id="workerRegPhone"
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="उदा. 9876543210"
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label htmlFor="workerRegPin" className="text-xs font-bold text-amber-300 block mb-1">
                  4-अंकों का गुप्त PIN (Login PIN) *
                </label>
                <input
                  id="workerRegPin"
                  type="password"
                  name="pin"
                  required
                  maxLength={6}
                  autoComplete="new-password"
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="उदा. 2468 (डैशबोर्ड लॉगिन के लिए)"
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-amber-500/40 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-widest"
                />
              </div>
            </div>

            {/* Trade & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="workerRegCategory" className="text-xs font-bold text-slate-300 block mb-1">
                  काम का प्रकार (Trade Category) *
                </label>
                <select
                  id="workerRegCategory"
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
                <label htmlFor="workerRegExp" className="text-xs font-bold text-slate-300 block mb-1">
                  कितने साल का अनुभव है? (Years of Exp) *
                </label>
                <input
                  id="workerRegExp"
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
                <label htmlFor="workerRegHourly" className="text-xs font-bold text-slate-300 block mb-1">
                  1 घंटे का चार्ज (₹ / hour) *
                </label>
                <input
                  id="workerRegHourly"
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
                <label htmlFor="workerRegDaily" className="text-xs font-bold text-slate-300 block mb-1">
                  पूरे दिन (8 घंटे) का रेट (₹ / day)
                </label>
                <input
                  id="workerRegDaily"
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

            {/* City, PIN & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="workerRegCity" className="text-xs font-bold text-slate-300 block mb-1">
                  शहर (City) *
                </label>
                <select
                  id="workerRegCity"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-semibold"
                >
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                      {c.name} ({c.hindiName}) - {c.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="workerRegPincode" className="text-xs font-bold text-slate-300 block mb-1">
                  पिन कोड (PIN Code)
                </label>
                <input
                  id="workerRegPincode"
                  type="text"
                  name="pincode"
                  maxLength={6}
                  inputMode="numeric"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="उदा. 380015 (ऑटो शहर खोज)"
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="workerRegArea" className="text-xs font-bold text-slate-300 block mb-1">
                इलाका / मोहल्ला (Area / Locality) *
              </label>
              <input
                id="workerRegArea"
                type="text"
                name="area"
                required
                value={formData.area}
                onChange={handleChange}
                placeholder="उदा. SG Highway, Maninagar, Satellite..."
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              {/* Quick Area Chips */}
              {getCityAreas(formData.city).length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">त्वरित सुझाव:</span>
                  {getCityAreas(formData.city).slice(0, 6).map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, area }))}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 transition-colors"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sub-skills: Checkboxes per category (NO manual typing mistakes) */}
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <label className="text-xs font-bold text-amber-300 block">
                    विशेष कौशल (Special Skills / काम का विवरण) *
                  </label>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    आप <strong>{formData.category}</strong> में क्या-क्या काम करते हैं? चेकबॉक्स चुनिए (टाइप करने की आवश्यकता नहीं):
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleSelectAllSkills}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors"
                  >
                    सभी चुनें (Select All)
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSkills}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                  >
                    हटाएं (Clear)
                  </button>
                </div>
              </div>

              {/* Checkbox Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
                {getSkillsByCategory(formData.category).map((skill) => {
                  const isSelected = Array.isArray(formData.subSkills) && formData.subSkills.includes(skill);
                  return (
                    <label
                      key={skill}
                      className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                          : 'bg-slate-900/60 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSkill(skill)}
                        className="w-4 h-4 rounded text-amber-400 bg-slate-800 border-slate-600 focus:ring-amber-400 shrink-0 mt-0.5"
                      />
                      <span className="leading-snug select-none">{skill}</span>
                    </label>
                  );
                })}
              </div>

              {/* Counter / Validation status */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[11px] text-slate-400">
                <span>
                  चुने गए कौशल: <strong className="text-amber-400">{formData.subSkills?.length || 0}</strong>
                </span>
                {(!formData.subSkills || formData.subSkills.length === 0) && (
                  <span className="text-rose-400 font-bold">⚠️ कम से कम 1 काम अवश्य चुनें</span>
                )}
              </div>
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
