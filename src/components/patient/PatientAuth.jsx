import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Users, 
  Fingerprint, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Lock
} from 'lucide-react';
import { safeSupabaseCall, isSupabaseConfigured } from '../../supabaseClient';
import { t } from './landingStrings';

export default function PatientAuth({ patientData, setPatientData, onComplete, lang }) {
  const [abhaVerified, setAbhaVerified] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerifyAbha = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setAbhaVerified(true);
    }, 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientData.fullName || !patientData.email) {
      setErrorMsg(t(lang, 'registration.errorRequired'));
      return;
    }
    setErrorMsg('');

    // Best-effort write into the `patients` table. Silently skipped/ignored
    // if Supabase isn't configured yet or the insert fails, so the demo flow
    // never blocks on the database.
    if (isSupabaseConfigured) {
      await safeSupabaseCall((client) =>
        client.from('patients').insert([{
          full_name: patientData.fullName,
          email: patientData.email,
          age: patientData.age,
          gender: patientData.gender,
          abha_id: patientData.abhaId,
        }])
      );
    }

    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto my-4">
      
      {/* Registration Card */}
      <div className="bg-surface rounded-2xl sm:rounded-3xl border border-line shadow-sm overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="relative p-6 sm:p-8 bg-surface border-b border-line">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-teal shrink-0" />
            <div>
              <h2 className="text-2xl font-serif font-semibold text-ink tracking-tight">
                {t(lang, 'registration.title')}
              </h2>
              <p className="text-xs text-ink-soft mt-0.5 font-sans">
                {t(lang, 'registration.subtext')}
              </p>
            </div>
          </div>

          <div className="absolute right-6 top-8 hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-tint border border-teal/20 text-teal text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>{t(lang, 'registration.sslBadge')}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-alert-tint border border-alert/30 text-alert text-xs flex items-center space-x-2">
              <Info className="w-4 h-4 text-alert shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name & Email Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-2 font-sans">
                {t(lang, 'registration.nameLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder={t(lang, 'registration.namePlaceholder')}
                  value={patientData.fullName}
                  onChange={(e) => setPatientData({ ...patientData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg border border-line text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition font-sans"
                />
              </div>
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-2 font-sans">
                {t(lang, 'registration.emailLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajesh.kumar@healthvault.in"
                  value={patientData.email || ''}
                  onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg border border-line text-ink placeholder:text-ink-faint text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition font-sans"
                />
              </div>
              <p className="text-[11px] text-ink-faint mt-1 font-sans">{t(lang, 'registration.emailSubtext')}</p>
            </div>

          </div>

          {/* Age & Gender Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Age */}
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-2 font-sans">
                {t(lang, 'registration.ageLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patientData.age}
                  onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg border border-line text-ink text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition font-sans"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-2 font-sans">
                {t(lang, 'registration.genderLabel')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
                  <Users className="w-4 h-4" />
                </div>
                <select
                  value={patientData.gender}
                  onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg border border-line text-ink text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition appearance-none cursor-pointer font-sans"
                >
                  <option value="Male">{t(lang, 'registration.genderMale')}</option>
                  <option value="Female">{t(lang, 'registration.genderFemale')}</option>
                  <option value="Other">{t(lang, 'registration.genderOther')}</option>
                </select>
              </div>
            </div>

          </div>

          {/* ABHA ID Section with instant verification badge */}
          <div className="bg-teal-tint border border-line p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-ink-soft flex items-center space-x-1.5 font-sans">
                <Fingerprint className="w-4 h-4 text-teal" />
                <span>{t(lang, 'registration.abhaLabel')}</span>
              </label>

              {abhaVerified ? (
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-teal bg-teal-tint px-2.5 py-1 rounded-full border border-teal/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                  <span>{t(lang, 'registration.abhaVerified')}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyAbha}
                  disabled={isVerifying}
                  className="text-xs font-medium text-teal hover:text-teal-dark underline cursor-pointer"
                >
                  {isVerifying ? t(lang, 'registration.abhaVerifying') : t(lang, 'registration.abhaVerifyNow')}
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="e.g. 91-8823-1120-9941"
              value={patientData.abhaId}
              onChange={(e) => {
                setPatientData({ ...patientData, abhaId: e.target.value });
                setAbhaVerified(false);
              }}
              className="w-full px-4 py-3 rounded-xl bg-bg border border-line text-ink placeholder:text-ink-faint font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition"
            />
          </div>

          {/* ABDM & DPDP Consent */}
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-teal-tint border border-line">
            <input
              type="checkbox"
              id="abdmConsent"
              checked={patientData.abdmConsented}
              onChange={(e) => setPatientData({ ...patientData, abdmConsented: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-teal accent-teal bg-bg border-line focus:ring-teal cursor-pointer"
            />
            <label htmlFor="abdmConsent" className="text-xs text-ink-soft leading-relaxed cursor-pointer select-none font-sans">
              <strong className="text-ink font-semibold">
                {t(lang, 'registration.consentTitle')}
              </strong>{' '}
              {t(lang, 'registration.consentText')}
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full bg-teal hover:bg-teal-dark text-white font-medium py-4 rounded-xl text-sm shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <span>{t(lang, 'registration.submit')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>

    </div>
  );
}
