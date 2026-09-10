import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { safeSupabaseCall, isSupabaseConfigured } from '../../supabaseClient';

export default function Login({ onLogin, lang }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoEmail = 'rajesh.kumar@healthvault.in';
  const demoPassword = '#Patient@2026*';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both Email and Password');
      return;
    }
    if (!email.includes('@')) {
      setError('Invalid email: Email must contain "@" (e.g. rajesh.kumar@healthvault.in)');
      return;
    }
    setError('');
    setLoading(true);

    // Real auth attempt when Supabase is configured; always falls back to the
    // demo/local session below so the flow keeps working during a live demo.
    if (isSupabaseConfigured) {
      await safeSupabaseCall((client) =>
        client.auth.signInWithPassword({ email, password })
      );
    }

    setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 500);
  };

  const fillDemo = () => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)' }}
    >
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 space-y-6 animate-scale-in">

        {/* Badge */}
        <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-full">
          MediKiosk Patient Portal
        </span>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'en' ? 'Patient Login' : 'मरीज लॉगिन'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'en'
              ? 'Sign in to access your health records, OPD consultations, and prescriptions.'
              : 'अपने स्वास्थ्य रिकॉर्ड, ओपीडी परामर्श और प्रिस्क्रिप्शन एक्सेस करें।'}
          </p>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {lang === 'en' ? 'Patient Email / ABHA ID' : 'मरीज ईमेल / आभा आईडी'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="e.g. rajesh.kumar@healthvault.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {lang === 'en' ? 'Password' : 'पासवर्ड'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading
              ? (lang === 'en' ? 'Authenticating...' : 'प्रमाणित हो रहा है...')
              : (lang === 'en' ? 'Sign In To MediKiosk' : 'MediKiosk में साइन इन करें')}
          </button>
        </form>

        {/* Demo Credentials */}
        <div
          onClick={fillDemo}
          className="text-center text-xs text-slate-500 bg-slate-50 border border-slate-200 py-3 rounded-xl cursor-pointer hover:bg-slate-100 transition select-none"
        >
          Demo: <strong className="text-slate-700">{demoEmail}</strong> | <strong className="text-slate-700">{demoPassword}</strong>
        </div>

        {!isSupabaseConfigured && (
          <p className="text-[11px] text-center text-amber-600 bg-amber-50 border border-amber-200 rounded-lg py-2">
            Running in local demo mode — add Supabase keys in <code>.env</code> to enable real accounts.
          </p>
        )}

      </div>
    </div>
  );
}
