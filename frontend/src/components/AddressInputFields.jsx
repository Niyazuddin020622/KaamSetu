import React, { useState, useEffect } from 'react';
import { MapPin, Building, Navigation, Globe, Check, Sparkles } from 'lucide-react';
import { CITIES, getCityFromPincode, getCityAreas, getCityByName } from '../utils/cityMaster';
import { formatFullAddress, parseAddressString } from '../utils/addressHelper';

/**
 * AddressInputFields Component
 * Divided address input: Building/House, Street/Landmark, City, Pincode, Country.
 * Features:
 *  - PIN Code Auto-Lookup: Automatically identifies City from 6-digit PIN code.
 *  - Popular Area Quick Chips: One-click fill for major localities in selected city.
 *  - Pre-fills saved address with zero duplicate effort.
 *  - Fixed Country (India) badge to avoid unnecessary clicks.
 */
export default function AddressInputFields({
  value = {},
  onChange,
  required = true,
  className = '',
  disabled = false,
  showPopularChips = true
}) {
  // Normalize incoming value: could be an object or legacy string
  const initialData = typeof value === 'string'
    ? parseAddressString(value)
    : {
        building: value?.building || '',
        street: value?.street || '',
        city: value?.city || 'Ahmedabad',
        pincode: value?.pincode || '',
        country: value?.country || 'India'
      };

  const [address, setAddress] = useState(initialData);
  const [autoDetectedCity, setAutoDetectedCity] = useState(null);

  // Sync if external value changes (e.g. activeUser profile loaded)
  useEffect(() => {
    if (typeof value === 'string') {
      const parsed = parseAddressString(value);
      setAddress((prev) => ({
        ...prev,
        ...parsed
      }));
    } else if (value && typeof value === 'object') {
      setAddress((prev) => ({
        building: value.building ?? prev.building,
        street: value.street ?? prev.street,
        city: value.city ?? prev.city ?? 'Ahmedabad',
        pincode: value.pincode ?? prev.pincode,
        country: value.country ?? 'India'
      }));
    }
  }, [value?.building, value?.street, value?.city, value?.pincode]);

  const updateField = (field, val) => {
    const updated = {
      ...address,
      [field]: val
    };

    // If pincode is typed and reaches 3-6 digits, check auto-match
    if (field === 'pincode') {
      const cleanPin = val.replace(/[^0-9]/g, '').slice(0, 6);
      updated.pincode = cleanPin;

      if (cleanPin.length >= 3) {
        const matched = getCityFromPincode(cleanPin);
        if (matched && matched.name !== updated.city) {
          updated.city = matched.name;
          setAutoDetectedCity(matched.name);
          setTimeout(() => setAutoDetectedCity(null), 4000);
        }
      }
    }

    setAddress(updated);

    if (onChange) {
      const full = formatFullAddress(updated);
      onChange({
        ...updated,
        fullAddress: full
      });
    }
  };

  const handleChipClick = (areaName) => {
    const currentStreet = address.street.trim();
    if (!currentStreet) {
      updateField('street', areaName);
    } else if (!currentStreet.toLowerCase().includes(areaName.toLowerCase())) {
      updateField('street', `${currentStreet}, ${areaName}`);
    }
  };

  const popularAreas = getCityAreas(address.city).slice(0, 5);
  const formattedPreview = formatFullAddress(address);

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Auto-detected notification */}
      {autoDetectedCity && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>पिनकोड से शहर पहचाना गया: <strong>{autoDetectedCity}</strong></span>
        </div>
      )}

      {/* Row 1: Flat/House No & Building Name */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          मकान / फ्लैट / दुकान नं. व बिल्डिंग (House / Building / Shop) {required && '*'}
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required={required}
            disabled={disabled}
            value={address.building}
            onChange={(e) => updateField('building', e.target.value)}
            placeholder="उदा. फ्लैट नं. 402, शांति रेजीडेंसी / दुकान नं. 12"
            autoComplete="address-line1"
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Street / Road / Landmark / Area */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">
          सड़क / लैंडमार्क / मोहल्ला (Street / Landmark / Area) {required && '*'}
        </label>
        <div className="relative">
          <Navigation className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required={required}
            disabled={disabled}
            value={address.street}
            onChange={(e) => updateField('street', e.target.value)}
            placeholder="उदा. एस.जी. हाईवे, मंदिर के पास, वस्त्रपुर"
            autoComplete="address-line2"
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Quick Area Suggestion Chips - Minimal Clicks UX */}
        {showPopularChips && popularAreas.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-medium">त्वरित चयन:</span>
            {popularAreas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => handleChipClick(area)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700 hover:border-amber-500/40 transition-colors active:scale-95"
              >
                + {area}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Row 3: City, PIN Code, Country */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {/* City Dropdown */}
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            शहर (City) {required && '*'}
          </label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-amber-400 pointer-events-none" />
            <select
              value={address.city}
              disabled={disabled}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-medium cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                  {c.name} ({c.hindiName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PIN Code / Zip Code */}
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            पिन कोड (PIN Code) {required && '*'}
          </label>
          <input
            type="text"
            required={required}
            disabled={disabled}
            inputMode="numeric"
            maxLength={6}
            value={address.pincode}
            onChange={(e) => updateField('pincode', e.target.value)}
            placeholder="उदा. 380015"
            autoComplete="postal-code"
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono tracking-wider transition-colors"
          />
        </div>

        {/* Country (India - fixed & badged to eliminate extra clicks) */}
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            देश (Country)
          </label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-300 text-xs sm:text-sm font-medium">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>भारत (India)</span>
            <span className="ml-auto text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Fixed
            </span>
          </div>
        </div>
      </div>

      {/* Live Formatted Address Preview Badge */}
      {formattedPreview && (
        <div className="pt-1 text-[11px] text-slate-400 flex items-start gap-1.5 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="truncate">
            <strong className="text-slate-300">पूर्ण पता: </strong>{formattedPreview}
          </span>
        </div>
      )}
    </div>
  );
}
