import React from 'react';
import {
  ArrowLeft, AlertTriangle, Stethoscope, HeartPulse, Clock,
  FileText, Pill, Sparkles, ArrowRight, Fingerprint
} from 'lucide-react';

const MOCK_TIMELINE_TAIL = [
  { type: 'manual', label: 'Manual History Added', detail: 'Patient logged known allergies and family history.', when: '3 months ago' },
  { type: 'treatment', label: 'Past Treatment Closed', detail: 'General Medicine — viral URTI, symptomatic Rx given.', when: '5 months ago' },
];

export default function OPDReportPage({ consultation, onBack, onStartTreatment }) {
  const { patient, transcript, opdStream, redFlagDetected, token, date, time } = consultation;

  const timeline = [
    { type: 'ai_generated', label: 'AI Interview Submitted', detail: transcript, when: `${date} • ${time}` },
    ...MOCK_TIMELINE_TAIL
  ];

  const typeStyles = {
    ai_generated: { badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', dot: 'bg-cyan-400' },
    manual: { badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
    treatment: { badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-lg transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Queue</span>
          </button>
          <span className="text-xs font-mono text-slate-500">{token}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 page-enter">

        {/* Patient strip */}
        <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-300 font-black">
              {patient.fullName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{patient.fullName}</h1>
              <p className="text-xs text-slate-400">{patient.age} Yrs • {patient.gender} • ABHA: {patient.abhaId || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
              {opdStream} Protocol
            </span>
            {redFlagDetected && (
              <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-red-500 text-white flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Priority</span>
              </span>
            )}
          </div>
        </div>

        {redFlagDetected && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center space-x-3 text-red-200">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-xs">
              <strong className="text-red-300 font-bold">Red-flag symptoms were detected</strong> in this patient's AI narrative. Recommend prioritizing this case.
            </p>
          </div>
        )}

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: AI Summary (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-slate-900/70 rounded-3xl border border-slate-800 p-6 space-y-5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="font-bold text-white text-base">AI Pre-Consultation Summary</h2>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Chief Complaint / History of Present Illness</span>
                <p className="text-sm text-cyan-200 bg-slate-950 border border-slate-800 rounded-xl p-4 leading-relaxed">{transcript}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Past Medical History</span>
                  <p className="text-xs text-slate-300">Type 2 Diabetes Mellitus, Hypertension (Stage 1) — per Health Vault records.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Drug Allergies</span>
                  <p className="text-xs text-slate-300">Penicillin, Sulfa drugs</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Family History</span>
                  <p className="text-xs text-slate-300">Father: Coronary artery disease. Mother: Type 2 Diabetes.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Personal History</span>
                  <p className="text-xs text-slate-300">Non-smoker, occasional alcohol use, sedentary lifestyle.</p>
                </div>
              </div>

              {opdStream === 'AYUSH' && (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Dashavidha Pariksha Notes</span>
                  </div>
                  <p className="text-xs text-slate-300">Prakriti: Pitta-Vata dominant. Vikriti: mild Pitta aggravation. Agni: irregular.</p>
                </div>
              )}
            </div>

            <button
              onClick={onStartTreatment}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold py-4 rounded-2xl text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Start Treatment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Timeline (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/70 rounded-3xl border border-slate-800 p-6">
              <div className="flex items-center space-x-2 mb-5">
                <Clock className="w-4 h-4 text-slate-400" />
                <h2 className="font-bold text-white text-base">Patient History Timeline</h2>
              </div>

              <div className="space-y-5">
                {timeline.map((item, idx) => {
                  const style = typeStyles[item.type];
                  return (
                    <div key={idx} className="relative pl-6">
                      {idx !== timeline.length - 1 && (
                        <span className="absolute left-[5px] top-4 bottom-[-20px] w-px bg-slate-800" />
                      )}
                      <span className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full ${style.dot}`} />
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${style.badge}`}>
                          {item.type === 'ai_generated' ? 'AI Generated' : item.type === 'manual' ? 'Manual' : 'Treatment'}
                        </span>
                        <span className="text-[10px] text-slate-500">{item.when}</span>
                      </div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900/70 rounded-3xl border border-slate-800 p-5 flex items-center space-x-3">
              <Fingerprint className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-[11px] text-slate-400">ABHA-linked record • Consent captured via reception keyword verification for token <span className="font-mono text-cyan-300">{token}</span>.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
