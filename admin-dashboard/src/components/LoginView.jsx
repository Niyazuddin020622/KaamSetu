import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertCircle, Hammer } from 'lucide-react';
import { adminLogin } from '../api';

export default function LoginView({ onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setError('');
    setLoading(true);

    try {
      const res = await adminLogin(pin.trim());
      if (res.success) {
        localStorage.setItem('kaamsetu_admin_token', res.token || 'admin-active');
        onLoginSuccess();
      } else {
        setError(res.message || 'Invalid Admin PIN');
      }
    } catch (err) {
      setError('Unable to connect to server or invalid PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (quickPin) => {
    setPin(quickPin);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-xl shadow-amber-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Hammer className="w-8 h-8 text-amber-400 transform -rotate-12" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
              KaamSetu Admin
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
              Control Center
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Complete audit and management of worker job logs & employer hiring history
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Security Authentication</h2>
              <p className="text-xs text-slate-400">Enter your administrative master PIN</p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin PIN</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (e.g. admin123)..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm tracking-wider font-semibold shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !pin}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying PIN...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick test credentials helper */}
          <div className="pt-2 text-center border-t border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">Quick Access PINs:</span>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin123')}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-colors"
              >
                admin123
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('8825135461')}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-colors"
              >
                8825135461
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          © {new Date().getFullYear()} KaamSetu Enterprise Admin. Secure & Encrypted.
        </p>
      </div>
    </div>
  );
}
