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
    {
      label: 'Pending Queue',
      val: pendingQueue.length,
      sub: 'Consent verified, awaiting review',
      icon: Clock,
      iconBg: 'bg-saffron-tint text-saffron border border-saffron/20'
    },
    {
      label: 'Consent Requests',
      val: consentGrantedCount,
      sub: 'Total cases with consent granted',
      icon: ShieldCheck,
      iconBg: 'bg-teal-tint text-teal border border-teal/20'
    },
    {
      label: 'Completed Treatments',
      val: completedCount,
      sub: 'Consultations closed today',
      icon: CheckCircle2,
      iconBg: 'bg-teal-tint text-teal border border-teal/20'
    },
    {
      label: 'Total Patients',
      val: uniquePatients,
      sub: 'Distinct patients in system',
      icon: Users,
      iconBg: 'bg-teal-tint text-teal border border-teal/20'
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink font-sans flex flex-col">
      
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-tint border border-line flex items-center justify-center text-teal shrink-0">
              <Stethoscope className="w-5 h-5 text-teal" />
            </div>
            <div>
              <div className="font-serif font-semibold text-ink text-base sm:text-lg leading-tight">
                Clinical Dashboard
              </div>
              <div className="text-xs text-ink-soft mt-0.5 font-sans">
                {doctorData?.name || 'Dr. S. K. Sharma (MD, BAMS)'} • {doctorData?.dept || 'OPD / Integrative Medicine'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <button
              onClick={onGoToConsentDesk}
              className="flex items-center space-x-1.5 text-xs font-medium text-teal hover:text-teal-dark bg-surface hover:bg-teal-tint/50 border border-teal/30 px-3 sm:px-3.5 py-2 rounded-xl transition cursor-pointer font-sans"
            >
              <KeyRound className="w-3.5 h-3.5 text-teal" />
              <span>Consent Desk</span>
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-1.5 text-xs font-medium text-alert hover:text-alert/90 bg-surface hover:bg-alert-tint/60 border border-alert/30 px-3 sm:px-3.5 py-2 rounded-xl transition cursor-pointer font-sans"
            >
              <LogOut className="w-3.5 h-3.5 text-alert" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-surface rounded-2xl border border-line p-5 sm:p-6 shadow-sm flex items-start justify-between transition"
            >
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-1 font-sans">
                  {s.label}
                </div>
                <div className="text-3xl sm:text-4xl font-semibold font-serif text-teal-dark">
                  {s.val}
                </div>
                <div className="text-xs text-ink-faint mt-1 font-sans">
                  {s.sub}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Awaiting Consent Banner */}
        {awaitingConsent.length > 0 && (
          <div className="rounded-2xl border border-saffron/30 bg-saffron-tint/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-saffron-tint text-saffron border border-saffron/30 flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <p className="text-xs text-ink-soft leading-relaxed font-sans">
                <strong className="font-semibold text-ink">{awaitingConsent.length} case(s)</strong> have submitted an AI intake but are still waiting for reception to verify their keyword before entering your queue.
              </p>
            </div>
            <button
              onClick={onGoToConsentDesk}
              className="text-xs font-medium text-teal hover:text-teal-dark bg-surface hover:bg-teal-tint border border-line px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 font-sans shadow-xs"
            >
              Open Consent Desk
            </button>
          </div>
        )}

        {/* OPD Consultation Queue Section */}
        <div className="bg-surface rounded-2xl sm:rounded-3xl border border-line shadow-sm overflow-hidden">
          
          <div className="p-5 sm:p-6 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-ink">
                OPD Consultation Queue
              </h2>
              <p className="text-xs text-ink-soft mt-0.5 font-sans">
                Consent-verified cases ready for physician review, most recent first.
              </p>
            </div>
            <span className="text-xs font-semibold text-teal bg-teal-tint border border-teal/20 px-3 py-1 rounded-full font-sans self-start sm:self-auto">
              {pendingQueue.length} waiting
            </span>
          </div>

          {pendingQueue.length === 0 ? (
            <div className="p-12 sm:p-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-tint border border-line mx-auto flex items-center justify-center text-teal mb-2">
                <ClipboardCheck className="w-6 h-6 text-teal" />
              </div>
              <p className="text-sm sm:text-base font-semibold text-ink font-sans">
                No consent-verified cases in the queue right now.
              </p>
              <p className="text-xs text-ink-faint max-w-md mx-auto leading-relaxed font-sans">
                New AI-interview submissions will appear here once reception verifies the patient's keyword.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {pendingQueue.map((c) => (
                <div
                  key={c.token}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 hover:bg-teal-tint/20 transition"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        c.redFlagDetected
                          ? 'bg-alert-tint text-alert border-alert/30'
                          : 'bg-teal-tint text-teal border-teal/20'
                      }`}
                    >
                      {c.redFlagDetected ? <AlertTriangle className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-ink text-sm font-sans">{c.patient.fullName}</span>
                        <span className="text-[11px] font-mono text-ink-faint">{c.token}</span>
                        {c.redFlagDetected && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-alert text-white px-2 py-0.5 rounded-full">
                            Priority
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-ink-soft mt-0.5 font-sans">
                        {c.patient.age} Yrs • {c.patient.gender} • {c.opdStream} Protocol • Submitted {c.date}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewReport(c)}
                    className="text-xs font-medium text-white bg-teal hover:bg-teal-dark px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-sm font-sans"
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

      {/* Footer */}
      <footer className="border-t border-line py-5 px-4 bg-bg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ink-faint font-sans">
          <span>© 2026 MediKiosk Health Tech • Clinical Console</span>
          <span>ABDM Sandbox v2.4 • DPDP Act 2023 Compliant</span>
        </div>
      </footer>
    </div>
  );
}
