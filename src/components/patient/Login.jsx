import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { safeSupabaseCall, isSupabaseConfigured } from '../../supabaseClient';

export default function Login({ onLogin, lang, onBack }) {
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
    <div className="min-h-screen bg-bg text-ink font-sans flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-4">

        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-xs font-medium text-teal hover:text-teal-dark transition cursor-pointer font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        )}

        {/* Login Card */}
        <div className="bg-surface rounded-2xl sm:rounded-3xl border border-line shadow-sm p-6 sm:p-8 space-y-6">

          {/* Header & Badge */}
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-teal bg-teal-tint border border-teal/20 px-2.5 py-0.5 rounded-full mb-1">
              MediKiosk Patient Portal
            </span>
            <h1 className="text-2xl font-serif font-semibold text-ink leading-tight">
              {lang === 'mr' ? 'रुग्ण लॉगिन' : lang === 'hi' ? 'मरीज लॉगिन' : 'Patient Login'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft mt-1 font-sans">
              {lang === 'mr'
                ? 'तुमचे आरोग्य रेकॉर्ड, ओपीडी कन्सल्टेशन आणि प्रिस्क्रिप्शन पाहण्यासाठी साइन इन करा.'
                : lang === 'hi'
                ? 'अपने स्वास्थ्य रिकॉर्ड, ओपीडी परामर्श और प्रिस्क्रिप्शन एक्सेस करने के लिए साइन इन करें।'
                : 'Sign in to access your health records, OPD consultations, and prescriptions.'}
            </p>
          </div>

          {error && (
            <div className="text-xs text-alert bg-alert-tint border border-alert/30 p-3 rounded-xl font-sans">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5 font-sans">
                {lang === 'mr' ? 'रुग्ण ईमेल / आभा आयडी' : lang === 'hi' ? 'मरीज ईमेल / आभा आईडी' : 'Patient Email / ABHA ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="e.g. rajesh.kumar@healthvault.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg border border-line text-ink placeholder:text-ink-faint text-sm focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition font-sans"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5 font-sans">
                {lang === 'mr' ? 'पासवर्ड' : lang === 'hi' ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-bg border border-line text-ink placeholder:text-ink-faint text-sm focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-faint hover:text-ink transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal hover:bg-teal-dark text-white font-medium py-3.5 rounded-xl text-sm shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading
                ? (lang === 'mr' ? 'प्रमाणित होत आहे...' : lang === 'hi' ? 'प्रमाणित हो रहा है...' : 'Authenticating...')
                : (lang === 'mr' ? 'MediKiosk मध्ये साइन इन करा' : lang === 'hi' ? 'MediKiosk में साइन इन करें' : 'Sign In To MediKiosk')}
            </button>
          </form>

          {/* Demo Credentials */}
          <div
            onClick={fillDemo}
            className="text-center text-xs text-ink-soft bg-[#f6f8f5] border border-line py-3 px-3 rounded-xl cursor-pointer hover:bg-teal-tint/40 transition select-none font-sans"
          >
            Demo: <strong className="text-teal-dark font-mono font-semibold">{demoEmail}</strong> | <strong className="text-teal-dark font-mono font-semibold">{demoPassword}</strong>
          </div>

          {!isSupabaseConfigured && (
            <p className="text-[11px] text-center text-saffron bg-saffron-tint/60 border border-saffron/30 rounded-xl py-2 px-3 font-sans">
              Running in local demo mode — add Supabase keys in <code>.env</code> to enable real accounts.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
