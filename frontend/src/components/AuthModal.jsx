import React, { useState } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  LogOut
} from 'lucide-react';
import { 
  customerLogin, 
  customerRegister, 
  workerLogin, 
  workerSetPin 
} from '../api';
import AddressInputFields from './AddressInputFields';
import { formatFullAddress } from '../utils/addressHelper';
import { cleanPhoneNumber } from '../utils/phoneHelper';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialRole = 'customer', 
  onAuthSuccess,
  onOpenWorkerRegister,
  currentUser = null,
  currentWorker = null,
  onCustomerLogout = () => {},
  onWorkerLogout = () => {}
}) {
  const [role, setRole] = useState(initialRole); // 'customer' | 'worker'
  const [mode, setMode] = useState('login'); // 'login' | 'register' (for customer)
  
  // Customer fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerPin, setCustomerPin] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Ahmedabad');
  const [addressDetails, setAddressDetails] = useState({
    building: '',
    street: '',
    city: 'Ahmedabad',
    pincode: '',
    country: 'India'
  });

  // Worker fields
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerPin, setWorkerPin] = useState('');
  const [needsWorkerPinSetup, setNeedsWorkerPinSetup] = useState(false);
  const [workerPromptName, setWorkerPromptName] = useState('');
  const [newWorkerPin, setNewWorkerPin] = useState('');

  // UI state
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset inputs and error messages cleanly on modal open, mode change or role switch
  React.useEffect(() => {
    setError('');
    setSuccessMsg('');
    setCustomerPhone('');
    setCustomerPin('');
    setCustomerName('');
    setWorkerPhone('');
    setWorkerPin('');
    setNewWorkerPin('');
  }, [isOpen, mode, role]);

  if (!isOpen) return null;

  // SESSION GUARD: If already logged in, do NOT show login options without logging out
  const activeSessionUser = currentUser || currentWorker;
  if (activeSessionUser) {
    const isWorker = Boolean(currentWorker);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <div 
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center space-y-5 text-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-8 h-8 text-slate-800" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              सत्र सक्रिय (Active Session)
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              आप पहले से लॉगिन हैं!
            </h3>
            <p className="text-xs text-slate-500">
              सुरक्षा नियमों के अनुसार, बिना लॉगआउट किए दोबारा लॉगिन करने की अनुमति नहीं है।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">नाम:</span>
              <span className="font-bold text-slate-900">{activeSessionUser.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">मोबाइल:</span>
              <span className="font-bold text-slate-900">{activeSessionUser.phone}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">खाता प्रकार:</span>
              <span className="font-bold text-slate-800">{isWorker ? 'कारीगर (Worker Pro)' : 'ग्राहक / नियोक्ता (Customer)'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => {
                if (isWorker) onWorkerLogout();
                else onCustomerLogout();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>लॉगआउट करें (Logout to Switch Account)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all"
            >
              रद्द करें / वापस जाएं
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'register') {
      if (!customerName.trim()) {
        setError('कृपया अपना पूरा नाम दर्ज करें।');
        return;
      }
    }

    const cleanPhone = cleanPhoneNumber(customerPhone);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (!customerPin.trim() || customerPin.trim().length < 4) {
      setError('PIN कम से कम 4 अंकों का होना चाहिए।');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const finalAddress = customerAddress.trim() || formatFullAddress(addressDetails);

        const res = await customerRegister({
          name: customerName.trim(),
          phone: cleanPhone,
          pin: customerPin.trim(),
          address: finalAddress,
          addressDetails,
          pincode: addressDetails.pincode || '',
          city: addressDetails.city || customerCity.trim(),
          area: addressDetails.street || ''
        });

        if (res.success) {
          setSuccessMsg('खाता सफलतापूर्वक बन गया!');
          if (onAuthSuccess) onAuthSuccess('customer', res.user);
          setTimeout(() => onClose(), 800);
        } else {
          setError(res.message || 'रजिस्ट्रेशन विफल रहा।');
        }
      } else {
        // Login
        const res = await customerLogin({
          phone: cleanPhone,
          pin: customerPin.trim()
        });

        if (res.success) {
          setSuccessMsg('लॉगिन सफल रहा!');
          if (onAuthSuccess) onAuthSuccess('customer', res.user);
          setTimeout(() => onClose(), 800);
        } else {
          setError(res.message || 'लॉगिन विफल रहा।');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'सर्वर से कनेक्ट करने में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanPhone = cleanPhoneNumber(workerPhone);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('कृपया 10-अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    setLoading(true);

    try {
      if (needsWorkerPinSetup) {
        // Set PIN for worker
        if (!newWorkerPin.trim() || newWorkerPin.trim().length < 4) {
          setError('नया PIN कम से कम 4 अंकों का होना चाहिए।');
          setLoading(false);
          return;
        }

        const res = await workerSetPin({
          phone: cleanPhone,
          pin: newWorkerPin.trim()
        });

        if (res.success) {
          setSuccessMsg('PIN सेट हो गया और आप लॉगिन हो गए!');
          if (onAuthSuccess) onAuthSuccess('worker', res.worker);
          setTimeout(() => onClose(), 800);
        } else {
          setError(res.message || 'PIN सेट नहीं हो सका।');
        }
      } else {
        // Worker login
        const res = await workerLogin({
          phone: cleanPhone,
          pin: workerPin.trim()
        });

        if (res.needsPinSetup) {
          setNeedsWorkerPinSetup(true);
          setWorkerPromptName(res.workerName || 'कारीगर साथी');
          setSuccessMsg(res.message);
        } else if (res.success) {
          setSuccessMsg('कारीगर लॉगिन सफल रहा!');
          if (onAuthSuccess) onAuthSuccess('worker', res.worker);
          setTimeout(() => onClose(), 800);
        } else {
          setError(res.message || 'लॉगिन विफल रहा।');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'कारीगर लॉगिन में समस्या आई।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className={`relative w-full ${role === 'customer' && mode === 'register' ? 'max-w-4xl' : 'max-w-md'} bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto transition-all duration-300 text-slate-900`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-slate-50 px-6 pt-6 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-slate-800" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">सुरक्षित लॉगिन (Secure Access)</h3>
                <p className="text-xs text-slate-500">प्राइवेट हिस्ट्री और डेटा सुरक्षा के लिए</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-200/70 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => { setRole('customer'); setError(''); setSuccessMsg(''); }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'customer'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>ग्राहक (Customer)</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('worker'); setError(''); setSuccessMsg(''); }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'worker'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>कारीगर (Worker)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Status Message */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= CUSTOMER FORM ================= */}
          {role === 'customer' && (
            <div>
              {/* Login / Register Toggle */}
              <div className="flex border-b border-slate-200 mb-4">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all ${
                    mode === 'login'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  लॉगिन करें (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all ${
                    mode === 'register'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  नया खाता बनाएं (Sign Up)
                </button>
              </div>

              <form onSubmit={handleCustomerSubmit} className="space-y-4" noValidate>
                {mode === 'register' ? (
                  /* HORIZONTAL 2-COLUMN RESPONSIVE LAYOUT */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
                    {/* Left Column: Personal Credentials */}
                    <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <User className="w-3.5 h-3.5 text-slate-600" />
                        <span>1. व्यक्तिगत विवरण (Personal Details)</span>
                      </div>

                      <div>
                        <label htmlFor="customerName" className="block text-xs font-semibold text-slate-700 mb-1">
                          आपका पूरा नाम <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                          <input
                            id="customerName"
                            name="customerName"
                            type="text"
                            autoComplete="name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="जैसे: राहुल शर्मा"
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="customerPhone" className="block text-xs font-semibold text-slate-700 mb-1">
                          मोबाइल नंबर <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-bold text-slate-700 select-none flex items-center gap-1 z-10 pointer-events-none">
                            <span>🇮🇳</span>
                            <span>+91</span>
                            <span className="text-slate-300">|</span>
                          </span>
                          <input
                            id="customerPhone"
                            name="customerPhone"
                            type="tel"
                            maxLength={10}
                            autoComplete="tel"
                            value={customerPhone}
                            onChange={(e) => {
                              const cleaned = cleanPhoneNumber(e.target.value);
                              setCustomerPhone(cleaned.slice(0, 10));
                            }}
                            placeholder="98765 43210"
                            className="w-full pl-16 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 font-mono tracking-wider"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="customerPin" className="block text-xs font-semibold text-slate-700 mb-1">
                          4-अंकों का गुप्त PIN <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                          <input
                            id="customerPin"
                            name="customerPin"
                            type={showPin ? 'text' : 'password'}
                            maxLength={6}
                            autoComplete="new-password"
                            value={customerPin}
                            onChange={(e) => setCustomerPin(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="अपना 4-अंकों का PIN बनाएं (उदा. 1234)"
                            className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 font-mono tracking-widest"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            aria-label={showPin ? "PIN छुपाएं" : "PIN देखें"}
                          >
                            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          💡 यह 4 अंकों का गुप्त पिन ATM पिन जैसा है। इसे याद रखें।
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Divided Address */}
                    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-1.5 pb-1 border-b border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-slate-600" />
                        <span>2. सेवा का पता (Service Address - वैकल्पिक)</span>
                      </div>
                      <AddressInputFields
                        value={addressDetails}
                        onChange={(addr) => {
                          setAddressDetails(addr);
                          setCustomerAddress(addr.fullAddress);
                          setCustomerCity(addr.city);
                        }}
                        required={false}
                        showPopularChips={true}
                      />
                    </div>
                  </div>
                ) : (
                  /* LOGIN MODE (Compact single-column) */
                  <div className="space-y-3.5">
                    <div>
                      <label htmlFor="customerPhone" className="block text-xs font-semibold text-slate-700 mb-1">
                        मोबाइल नंबर <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-slate-700 select-none flex items-center gap-1 z-10 pointer-events-none">
                          <span>🇮🇳</span>
                          <span>+91</span>
                          <span className="text-slate-300">|</span>
                        </span>
                        <input
                          id="customerPhone"
                          name="customerPhone"
                          type="tel"
                          maxLength={10}
                          autoComplete="tel"
                          value={customerPhone}
                          onChange={(e) => {
                            const cleaned = cleanPhoneNumber(e.target.value);
                            setCustomerPhone(cleaned.slice(0, 10));
                          }}
                          placeholder="98765 43210"
                          className="w-full pl-16 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 font-mono tracking-wider"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="customerPin" className="block text-xs font-semibold text-slate-700 mb-1">
                        4-अंकों का गुप्त PIN <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          id="customerPin"
                          name="customerPin"
                          type={showPin ? 'text' : 'password'}
                          maxLength={6}
                          autoComplete="current-password"
                          value={customerPin}
                          onChange={(e) => setCustomerPin(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="अपना 4-अंकों का PIN दर्ज करें"
                          className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 font-mono tracking-widest"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin(!showPin)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                          aria-label={showPin ? "PIN छुपाएं" : "PIN देखें"}
                        >
                          {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        सिर्फ आपका मोबाइल नंबर और PIN चाहिए, कोई OTP की प्रतीक्षा नहीं।
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'register' ? 'खाता बनाएं और लॉगिन करें' : 'सुरक्षित लॉगिन करें'}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ================= WORKER FORM ================= */}
          {role === 'worker' && (
            <div>
              <div className="mb-3 p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-2 text-sky-800 text-xs">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-sky-600" />
                <span>
                  {needsWorkerPinSetup 
                    ? `नमस्ते ${workerPromptName}! कृपया पहली बार अपना 4-अंकों का गुप्त PIN बनाएं।`
                    : 'कारीगर अपने मोबाइल नंबर और 4-अंकों के PIN से लॉगिन करके अपने सारे काम देख सकते हैं।'}
                </span>
              </div>

              <form onSubmit={handleWorkerSubmit} className="space-y-3.5" noValidate>
                <div>
                  <label htmlFor="workerPhone" className="block text-xs font-semibold text-slate-700 mb-1">
                    कारीगर मोबाइल नंबर <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-700 select-none flex items-center gap-1 z-10 pointer-events-none">
                      <span>🇮🇳</span>
                      <span>+91</span>
                      <span className="text-slate-300">|</span>
                    </span>
                    <input
                      id="workerPhone"
                      name="workerPhone"
                      type="tel"
                      maxLength={10}
                      autoComplete="tel"
                      disabled={needsWorkerPinSetup}
                      value={workerPhone}
                      onChange={(e) => {
                        const cleaned = cleanPhoneNumber(e.target.value);
                        setWorkerPhone(cleaned.slice(0, 10));
                      }}
                      placeholder="98765 43210"
                      className="w-full pl-16 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 font-mono tracking-wider disabled:opacity-60"
                    />
                  </div>
                </div>

                {!needsWorkerPinSetup ? (
                  <div>
                    <label htmlFor="workerPin" className="block text-xs font-semibold text-slate-700 mb-1">
                      4-अंकों का कारीगर PIN
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        id="workerPin"
                        name="workerPin"
                        type={showPin ? 'text' : 'password'}
                        maxLength={6}
                        autoComplete="current-password"
                        value={workerPin}
                        onChange={(e) => setWorkerPin(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="आपका 4-अंकों का गुप्त PIN"
                        className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 font-mono tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        aria-label={showPin ? "PIN छुपाएं" : "PIN देखें"}
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      (अगर पहली बार लॉगिन कर रहे हैं और PIN नहीं है, तो सिर्फ नंबर डालकर लॉगिन दबाएं)
                    </p>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="newWorkerPin" className="block text-xs font-semibold text-slate-700 mb-1">
                      नया 4-अंकों का PIN बनाएं <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        id="newWorkerPin"
                        name="newWorkerPin"
                        type={showPin ? 'text' : 'password'}
                        maxLength={6}
                        autoComplete="new-password"
                        value={newWorkerPin}
                        onChange={(e) => setNewWorkerPin(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="जैसे: 2468"
                        className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-slate-900 font-mono tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        aria-label={showPin ? "PIN छुपाएं" : "PIN देखें"}
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      भविष्य में लॉगिन करने के लिए इस 4 अंकों के गुप्त पिन को याद रखें।
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{needsWorkerPinSetup ? 'PIN सेट करें और डैशबोर्ड खोलें' : 'कारीगर डैशबोर्ड में लॉगिन करें'}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </form>

              {/* Link to Worker Registration */}
              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-500">
                  क्या आप नए कारीगर हैं और अभी तक रजिस्टर नहीं किया?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenWorkerRegister) onOpenWorkerRegister();
                  }}
                  className="mt-1 text-xs font-bold text-slate-900 hover:underline"
                >
                  यहाँ नया कारीगर प्रोफाइल बनाएं (Register as Worker)
                </button>
              </div>
            </div>
          )}

          {/* Privacy badge guarantee */}
          <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% प्राइवेट: आपकी हिस्ट्री सिर्फ आपको ही दिखाई देगी।</span>
          </div>
        </div>
      </div>
    </div>
  );
}
