import React, { useState } from 'react';
import { Globe, Stethoscope, UserRound, KeyRound, Activity } from 'lucide-react';

import LandingHero from './components/patient/LandingHero.jsx';
import Login from './components/patient/Login.jsx';
import PatientAuth from './components/patient/PatientAuth.jsx';
import OPDIntake from './components/patient/OPDIntake.jsx';
import SummaryReport from './components/patient/SummaryReport.jsx';
import PatientDashboard from './components/patient/PatientDashboard.jsx';

import DoctorLogin from './components/doctor/DoctorLogin.jsx';
import DoctorDashboard from './components/doctor/DoctorDashboard.jsx';
import OPDReportPage from './components/doctor/OPDReportPage.jsx';
import TreatmentPage from './components/doctor/TreatmentPage.jsx';

import ConsentVerify from './components/shared/ConsentVerify.jsx';

import { safeSupabaseCall, isSupabaseConfigured } from './supabaseClient.js';
import { useLanguage } from './LanguageContext.jsx';
import { LANDING_LANGS, t } from './landingStrings.js';

const DEFAULT_PATIENT = {
  fullName: '',
  email: '',
  age: '32',
  gender: 'Male',
  bloodGroup: 'O+',
  abhaId: '91-8823-1120-9941',
  abdmConsented: true,
  phone: '',
  address: '',
  emergencyContact: '',
  transcript: '',
  opdStream: 'Allopathic',
  inputMethod: 'Voice',
  redFlagDetected: false,
  vitals: { pulse: '84 bpm', bp: '138/88', spO2: '97%', temp: '99.1 °F' },
};

const RETURNING_PATIENT_TEMPLATE = {
  ...DEFAULT_PATIENT,
  fullName: 'Rajesh Kumar',
  age: '46',
  gender: 'Male',
  phone: '9876543210',
};

export default function App() {
  const [screen, setScreen] = useState('landing');
  const { lang, setLang } = useLanguage();
  const [patientData, setPatientData] = useState(DEFAULT_PATIENT);
  const [doctorData, setDoctorData] = useState(null);
  const [queue, setQueue] = useState([]); // shared "consultations" table, in-memory
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // ── Patient: new AI-interview consultation is transmitted ─────────────
  const handleTransmit = async (token) => {
    const entry = {
      token,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      patient: { ...patientData },
      transcript: patientData.transcript,
      opdStream: patientData.opdStream,
      redFlagDetected: patientData.redFlagDetected,
      consentGiven: false,
      status: 'pending',
    };
    setQueue(prev => [entry, ...prev]);

    // Best-effort persistence into `consultations` + `ai_conversations`.
    if (isSupabaseConfigured) {
      await safeSupabaseCall((client) =>
        client.from('ai_conversations').insert([{
          token,
          transcript: patientData.transcript,
          opd_stream: patientData.opdStream,
          red_flag_detected: patientData.redFlagDetected,
        }])
      );
      await safeSupabaseCall((client) =>
        client.from('consultations').insert([{
          token,
          patient_email: patientData.email,
          status: 'pending',
          consent_given: false,
        }])
      );
    }
  };

  // ── Reception: verify keyword, grant consent ───────────────────────────
  const handleVerifyConsent = (token) => {
    setQueue(prev => prev.map(c => c.token === token ? { ...c, consentGiven: true } : c));
  };

  // ── Doctor: complete treatment ─────────────────────────────────────────
  const handleCompleteTreatment = async (treatmentData) => {
    setQueue(prev => prev.map(c =>
      c.token === treatmentData.token ? { ...c, status: 'completed', treatment: treatmentData } : c
    ));

    if (isSupabaseConfigured) {
      await safeSupabaseCall((client) =>
        client.from('treatments').insert([{
          token: treatmentData.token,
          diagnosis: treatmentData.diagnosis,
          medicines: treatmentData.medicines,
          investigations: treatmentData.investigations,
          precautions: treatmentData.precautions,
          dietary_advice: treatmentData.dietaryAdvice,
          follow_up_date: treatmentData.followUpDate || null,
          follow_up_notes: treatmentData.followUpNotes,
          is_completed: true,
        }])
      );
      await safeSupabaseCall((client) =>
        client.from('patient_histories').insert([{
          token: treatmentData.token,
          history_type: 'treatment',
          summary: treatmentData.diagnosis,
        }])
      );
    }
  };

  const resetPatientFlow = () => {
    setPatientData(DEFAULT_PATIENT);
    setScreen('landing');
  };

  // ── Shared top navigation shown on landing / auth screens ──────────────
  const TopNav = () => (
    <div className="bg-surface border-b border-line rounded-2xl px-5 py-3.5 mb-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setScreen('landing')}>
        <div className="w-9 h-9 rounded-xl bg-teal-tint border border-line flex items-center justify-center text-teal font-black text-sm">
          MK
        </div>
        <span className="font-serif text-xl font-semibold tracking-tight">
          <span className="text-teal-dark">Medi</span><span className="text-saffron">Kiosk</span>
        </span>
      </div>
      <div className="flex items-center flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-bg p-1 rounded-xl border border-line">
          {LANDING_LANGS.map((l) => {
            const isActive = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`text-xs px-2.5 py-1 rounded-lg transition cursor-pointer font-sans font-medium ${
                  isActive
                    ? 'bg-teal text-white shadow-xs'
                    : 'border border-line text-ink-soft hover:text-ink hover:bg-teal-tint/40'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setScreen('patient-login')}
          className="flex items-center space-x-1.5 text-xs font-semibold text-white bg-teal hover:bg-teal-dark px-4 py-2 rounded-xl transition cursor-pointer shadow-sm"
        >
          <UserRound className="w-3.5 h-3.5" />
          <span>{t(lang, 'nav.patientLogin')}</span>
        </button>
        <button
          onClick={() => setScreen('doctor-login')}
          className="flex items-center space-x-1.5 text-xs font-medium text-ink-soft hover:text-ink bg-transparent hover:bg-teal-tint/40 border border-line px-3.5 py-2 rounded-xl transition cursor-pointer"
        >
          <Stethoscope className="w-3.5 h-3.5 text-teal" />
          <span>{t(lang, 'nav.doctorLogin')}</span>
        </button>
        <button
          onClick={() => setScreen('consent-desk')}
          className="flex items-center space-x-1.5 text-xs font-medium text-ink-soft hover:text-ink bg-transparent hover:bg-teal-tint/40 border border-line px-3.5 py-2 rounded-xl transition cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5 text-teal" />
          <span>{t(lang, 'nav.receptionDesk')}</span>
        </button>
      </div>
    </div>
  );

  // ── Screen router ────────────────────────────────────────────────────
  switch (screen) {

    case 'patient-login':
      return (
        <Login
          lang={lang}
          onBack={() => setScreen('landing')}
          onLogin={(email) => {
            setPatientData({ ...RETURNING_PATIENT_TEMPLATE, email });
            setScreen('patient-dashboard');
          }}
        />
      );

    case 'patient-register':
      return (
        <div className="min-h-screen bg-bg text-ink font-sans px-4 py-10">
          <div className="max-w-5xl mx-auto"><TopNav /></div>
          <PatientAuth
            patientData={patientData}
            setPatientData={setPatientData}
            lang={lang}
            onComplete={() => setScreen('opd-intake')}
          />
        </div>
      );

    case 'opd-intake':
      return (
        <div className="min-h-screen bg-slate-950 px-4 py-10" style={{ background: 'linear-gradient(180deg, #020617 0%, #0b1524 100%)' }}>
          <div className="max-w-5xl mx-auto space-y-6">
            <TopNav />
            <OPDIntake
              patientData={patientData}
              setPatientData={setPatientData}
              lang={lang}
              onNext={() => setScreen('opd-summary')}
            />
          </div>
        </div>
      );

    case 'opd-summary':
      return (
        <div className="min-h-screen bg-slate-950 px-4 py-10" style={{ background: 'linear-gradient(180deg, #020617 0%, #0b1524 100%)' }}>
          <div className="max-w-5xl mx-auto space-y-6">
            <TopNav />
            <SummaryReport
              patientData={patientData}
              setPatientData={setPatientData}
              lang={lang}
              onTransmit={handleTransmit}
              onReset={resetPatientFlow}
            />
            <div className="max-w-3xl mx-auto text-center">
              <button
                onClick={() => setScreen('patient-dashboard')}
                className="text-xs font-bold text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Go to My Patient Dashboard
              </button>
            </div>
          </div>
        </div>
      );

    case 'patient-dashboard':
      return (
        <PatientDashboard
          patientData={patientData}
          setPatientData={setPatientData}
          lang={lang}
          setLang={setLang}
          onSignOut={resetPatientFlow}
        />
      );

    case 'doctor-login':
      return (
        <DoctorLogin
          onBack={() => setScreen('landing')}
          onLoginSuccess={(doc) => {
            setDoctorData(doc);
            setScreen('doctor-dashboard');
          }}
        />
      );

    case 'doctor-dashboard':
      return (
        <DoctorDashboard
          doctorData={doctorData}
          queue={queue}
          onSignOut={() => { setDoctorData(null); setScreen('landing'); }}
          onGoToConsentDesk={() => setScreen('consent-desk')}
          onViewReport={(c) => { setSelectedConsultation(c); setScreen('opd-report'); }}
        />
      );

    case 'opd-report':
      return (
        <OPDReportPage
          consultation={selectedConsultation}
          onBack={() => setScreen('doctor-dashboard')}
          onStartTreatment={() => setScreen('treatment')}
        />
      );

    case 'treatment':
      return (
        <TreatmentPage
          consultation={selectedConsultation}
          onBack={() => setScreen('opd-report')}
          onComplete={handleCompleteTreatment}
          onFinish={() => setScreen('doctor-dashboard')}
        />
      );

    case 'consent-desk':
      return (
        <ConsentVerify
          queue={queue}
          onVerify={handleVerifyConsent}
          onBack={() => setScreen(doctorData ? 'doctor-dashboard' : 'landing')}
        />
      );

    case 'landing':
    default:
      return (
        <div className="min-h-screen bg-bg text-ink font-sans px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <TopNav />
            <LandingHero lang={lang} onStart={() => { setPatientData(DEFAULT_PATIENT); setScreen('patient-register'); }} />
            <div className="mt-10 flex items-center justify-center space-x-2 text-[11px] text-ink-faint">
              <Activity className="w-3.5 h-3.5 text-teal" />
              <span>{t(lang, 'footer.tagline')}</span>
            </div>
          </div>
        </div>
      );
  }
}
