import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { createWorker } from '../api';

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

export default function AddWorkerModal({ onClose, onWorkerCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Plumber',
    experienceYears: 3,
    hourlyRate: 350,
    dailyRate: 1800,
    city: 'Ahmedabad',
    area: 'Satellite',
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await createWorker({
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
        dailyRate: Number(formData.dailyRate),
        experienceYears: Number(formData.experienceYears)
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
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
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar Mistri"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Phone Number *</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
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
                required
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
                required
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
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Ahmedabad / New Delhi"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Area / Locality *</label>
              <input
                type="text"
                name="area"
                required
                value={formData.area}
                onChange={handleChange}
                placeholder="Satellite / Rohini"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
              />
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
