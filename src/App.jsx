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
  const [lang, setLang] = useState('en');
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
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
          MK
        </div>
        <span className="font-bold text-white text-lg tracking-tight">MediKiosk</span>
      </div>
      <div className="flex items-center flex-wrap gap-2">
        <button
          onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
        </button>
        <button
          onClick={() => setScreen('patient-login')}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-lg transition cursor-pointer"
        >
          <UserRound className="w-3.5 h-3.5" />
          <span>Patient Login</span>
        </button>
        <button
          onClick={() => setScreen('doctor-login')}
          className="flex items-center space-x-1.5 text-xs font-bold text-blue-200 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-3.5 py-2 rounded-lg transition cursor-pointer"
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Doctor Login</span>
        </button>
        <button
          onClick={() => setScreen('consent-desk')}
          className="flex items-center space-x-1.5 text-xs font-bold text-cyan-200 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3.5 py-2 rounded-lg transition cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Reception Desk</span>
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
          onLogin={(email) => {
            setPatientData({ ...RETURNING_PATIENT_TEMPLATE, email });
            setScreen('patient-dashboard');
          }}
        />
      );

    case 'patient-register':
      return (
        <div className="min-h-screen bg-slate-950 px-4 py-10" style={{ background: 'linear-gradient(180deg, #020617 0%, #0b1524 100%)' }}>
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
        <div className="min-h-screen px-4 py-10" style={{ background: 'linear-gradient(180deg, #020617 0%, #0b1524 100%)' }}>
          <div className="max-w-5xl mx-auto">
            <TopNav />
            <LandingHero lang={lang} onStart={() => { setPatientData(DEFAULT_PATIENT); setScreen('patient-register'); }} />
            <div className="mt-10 flex items-center justify-center space-x-2 text-[11px] text-slate-600">
              <Activity className="w-3.5 h-3.5" />
              <span>MediKiosk AI-OPD Suite • Built for the 2-minute consultation problem</span>
            </div>
          </div>
        </div>
      );
  }
}
