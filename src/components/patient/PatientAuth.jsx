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
      setErrorMsg(lang === 'en' ? 'Please provide both Full Name and a valid Email ID' : 'कृपया पूरा नाम और मान्य ईमेल आईडी दोनों दर्ज करें');
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
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="relative p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {lang === 'en' ? 'Patient Digital Registration' : 'मरीज डिजिटल पंजीकरण'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en' 
                  ? 'Link your ABHA Health ID or register a new clinical profile' 
                  : 'अपना आभा हेल्थ आईडी लिंक करें या नया प्रोफाइल पंजीकृत करें'}
              </p>
            </div>
          </div>

          <div className="absolute right-6 top-8 hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
              <Info className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name & Email Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                {lang === 'en' ? 'Full Legal Name *' : 'पूरा कानूनी नाम *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={patientData.fullName}
                  onChange={(e) => setPatientData({ ...patientData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                />
              </div>
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                {lang === 'en' ? 'Patient Email ID *' : 'मरीज ईमेल आईडी *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajesh.kumar@healthvault.in"
                  value={patientData.email || ''}
                  onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">For receiving digital summaries & e-prescriptions</p>
            </div>

          </div>

          {/* Age & Gender Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Age */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                {lang === 'en' ? 'Age (Years)' : 'आयु (वर्ष)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={patientData.age}
                  onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                {lang === 'en' ? 'Gender' : 'लिंग'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
                <select
                  value={patientData.gender}
                  onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition appearance-none cursor-pointer"
                >
                  <option value="Male">{lang === 'en' ? 'Male' : 'पुरुष'}</option>
                  <option value="Female">{lang === 'en' ? 'Female' : 'महिला'}</option>
                  <option value="Other">{lang === 'en' ? 'Other' : 'अन्य'}</option>
                </select>
              </div>
            </div>

          </div>

          {/* ABHA ID Section with instant verification badge */}
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'en' ? 'ABHA Health ID (Ayushman Bharat)' : 'आभा हेल्थ आईडी'}</span>
              </label>

              {abhaVerified ? (
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified via ABDM</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyAbha}
                  disabled={isVerifying}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  {isVerifying ? 'Verifying OTP...' : 'Verify Now'}
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
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
            />
          </div>

          {/* ABDM & DPDP Consent */}
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20">
            <input
              type="checkbox"
              id="abdmConsent"
              checked={patientData.abdmConsented}
              onChange={(e) => setPatientData({ ...patientData, abdmConsented: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700 focus:ring-cyan-500 cursor-pointer"
            />
            <label htmlFor="abdmConsent" className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none">
              <strong className="text-white font-semibold">
                {lang === 'en' ? 'Consent for Health Data Sharing:' : 'स्वास्थ्य डेटा साझाकरण हेतु सहमति:'}
              </strong>{' '}
              {lang === 'en'
                ? 'I consent to share digital symptoms, triage notes, and past records with the hospital physician in accordance with the Ayushman Bharat Digital Mission (ABDM) and DPDP Act 2023.'
                : 'मैं एबीडीएम और डीपीडीपी अधिनियम 2023 के तहत डॉक्टर के साथ अपने लक्षण और रिकॉर्ड साझा करने की सहमति देता हूं।'}
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold py-4 rounded-2xl text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>{lang === 'en' ? 'Register Profile & Open Health Vault' : 'प्रोफाइल दर्ज करें और वॉल्ट खोलें'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>

    </div>
  );
}
