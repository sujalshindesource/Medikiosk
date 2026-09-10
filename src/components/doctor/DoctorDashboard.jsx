import React from 'react';
import {
  Stethoscope, LogOut, Users, ClipboardCheck, CheckCircle2, Clock,
  AlertTriangle, ArrowRight, ShieldCheck, KeyRound
} from 'lucide-react';

export default function DoctorDashboard({ doctorData, queue, onSignOut, onViewReport, onGoToConsentDesk }) {
  const pendingQueue = queue.filter(c => c.consentGiven && c.status === 'pending');
  const awaitingConsent = queue.filter(c => !c.consentGiven && c.status === 'pending');
  const consentGrantedCount = queue.filter(c => c.consentGiven).length;
  const completedCount = queue.filter(c => c.status === 'completed').length;
  const uniquePatients = new Set(queue.map(c => c.patient.fullName)).size;

  const stats = [
    { label: 'Pending Queue', val: pendingQueue.length, sub: 'Consent verified, awaiting review', icon: Clock, color: 'border-amber-500', iconBg: 'bg-amber-500/10 text-amber-400' },
    { label: 'Consent Requests', val: consentGrantedCount, sub: 'Total cases with consent granted', icon: ShieldCheck, color: 'border-cyan-500', iconBg: 'bg-cyan-500/10 text-cyan-400' },
    { label: 'Completed Treatments', val: completedCount, sub: 'Consultations closed today', icon: CheckCircle2, color: 'border-emerald-500', iconBg: 'bg-emerald-500/10 text-emerald-400' },
    { label: 'Total Patients', val: uniquePatients, sub: 'Distinct patients in system', icon: Users, color: 'border-blue-500', iconBg: 'bg-blue-500/10 text-blue-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-base leading-none">Clinical Dashboard</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{doctorData?.name} • {doctorData?.dept}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToConsentDesk}
              className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3.5 py-2 rounded-lg transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Consent Desk</span>
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-xs px-3.5 py-2 rounded-lg transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full page-enter">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className={`bg-slate-900/70 rounded-2xl border-l-4 ${s.color} border border-slate-800 p-5 shadow-lg flex items-start justify-between hover-lift`}>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{s.label}</div>
                <div className="text-3xl font-black text-white">{s.val}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{s.sub}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Awaiting Consent banner */}
        {awaitingConsent.length > 0 && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <KeyRound className="w-4.5 h-4.5" />
              </div>
              <p className="text-xs text-amber-200">
                <strong className="font-bold">{awaitingConsent.length} case(s)</strong> have submitted an AI intake but are still waiting for reception to verify their keyword before entering your queue.
              </p>
            </div>
            <button
              onClick={onGoToConsentDesk}
              className="text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-lg transition cursor-pointer shrink-0"
            >
              Open Consent Desk
            </button>
          </div>
        )}

        {/* Queue */}
        <div className="bg-slate-900/70 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">OPD Consultation Queue</h2>
              <p className="text-xs text-slate-400 mt-0.5">Consent-verified cases ready for physician review, most recent first.</p>
            </div>
            <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-full">
              {pendingQueue.length} waiting
            </span>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 text-sm">No consent-verified cases in the queue right now.</p>
              <p className="text-slate-600 text-xs mt-1">New AI-interview submissions will appear here once reception verifies the patient's keyword.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {pendingQueue.map((c) => (
                <div key={c.token} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5 hover:bg-slate-800/40 transition">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.redFlagDetected ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {c.redFlagDetected ? <AlertTriangle className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{c.patient.fullName}</span>
                        <span className="text-[10px] font-mono text-slate-500">{c.token}</span>
                        {c.redFlagDetected && (
                          <span className="text-[10px] font-extrabold uppercase bg-red-500 text-white px-2 py-0.5 rounded-full">Priority</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {c.patient.age} Yrs • {c.patient.gender} • {c.opdStream} Protocol • Submitted {c.date}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewReport(c)}
                    className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <span>View OPD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>© 2026 MediKiosk Health Tech • Clinical Console</span>
          <span>ABDM Sandbox v2.4 • DPDP Act 2023 Compliant</span>
        </div>
      </footer>
    </div>
  );
}
