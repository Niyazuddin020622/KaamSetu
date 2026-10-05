import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { createWorker } from '../api';
import { CITIES, getCityAreas, getCityFromPincode } from '../utils/cityMaster';
import { TRADE_CATEGORIES, getSkillsByCategory } from '../utils/tradeSkills';

const CATEGORIES = TRADE_CATEGORIES;

export default function AddWorkerModal({ onClose, onWorkerCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Plumber',
    subSkills: getSkillsByCategory('Plumber').slice(0, 4),
    experienceYears: 3,
    hourlyRate: 350,
    dailyRate: 1800,
    city: 'Ahmedabad',
    area: 'Satellite',
    pincode: '',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?w=400',
    isVerified: true,
    isAvailable: true,
    badge: 'Verified Pro'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      if (name === 'category') {
        updated.category = value;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide worker full name.');
      return;
    }
    const cleanPhone = (formData.phone || '').replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) {
      setError('Please enter a valid hourly rate.');
      return;
    }
    if (!formData.area.trim()) {
      setError('Please provide service area/locality.');
      return;
    }
    if (!formData.subSkills || formData.subSkills.length === 0) {
      setError('Please select at least 1 skill.');
      return;
    }

    setLoading(true);

    try {
      const res = await createWorker({
        ...formData,
        phone: cleanPhone,
        hourlyRate: Number(formData.hourlyRate),
        dailyRate: Number(formData.dailyRate) || Number(formData.hourlyRate) * 7,
        experienceYears: Number(formData.experienceYears) || 1
      });

      if (res.success) {
        onWorkerCreated(res.data);
        onClose();
      } else {
        setError(res.message || 'Error creating worker profile.');
      }
    } catch (err) {
      setError('Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600/20 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Add New Worker</h3>
              <p className="text-xs text-slate-400">Register and verify a trade professional in the platform</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Worker Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar Mistri"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Phone Number *</label>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-xs font-bold text-amber-400 select-none flex items-center gap-1 z-10 pointer-events-none">
                  <span>🇮🇳</span>
                  <span>+91</span>
                  <span className="text-slate-600">|</span>
                </span>
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    setFormData(prev => ({ ...prev, phone: clean }));
                  }}
                  placeholder="98765 43210"
                  className="w-full pl-14 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs font-mono tracking-wider"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Trade Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-slate-900">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Experience (Years) *</label>
              <input
                type="number"
                name="experienceYears"
                min="0"
                max="50"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Hourly Rate (₹) *</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Daily Rate (8 hrs) (₹)</label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                    {c.name} ({c.hindiName}) - {c.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">PIN / Zip Code</label>
              <input
                type="text"
                name="pincode"
                maxLength={6}
                inputMode="numeric"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="380015 (Auto detects city)"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Area / Locality *</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Satellite / SG Highway / Rohini"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
            />
            {getCityAreas(formData.city).length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400">Quick suggestions:</span>
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

          {/* Category-based Sub-skills */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-amber-300 block text-xs">
                Special Skills / Trade Services ({formData.category})
              </label>
              <span className="text-[10px] text-slate-400">
                Selected: {formData.subSkills?.length || 0}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {getSkillsByCategory(formData.category).map((skill) => {
                const isSelected = Array.isArray(formData.subSkills) && formData.subSkills.includes(skill);
                return (
                  <label
                    key={skill}
                    className={`flex items-start gap-2 p-1.5 rounded-lg border text-[11px] cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSkill(skill)}
                      className="w-3.5 h-3.5 rounded text-amber-500 mt-0.5"
                    />
                    <span className="leading-tight">{skill}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Professional Bio</label>
            <textarea
              name="bio"
              rows="2"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Key skills, tools, and background details..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0"
              />
              <span className="font-bold text-slate-200">ID & Police Verified</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
              />
              <span className="font-bold text-slate-200">Available for Jobs Now</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow"
            >
              {loading ? 'Saving...' : 'Save Worker'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
