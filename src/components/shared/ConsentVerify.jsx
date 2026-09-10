import React, { useState } from 'react';
import { KeyRound, CheckCircle2, XCircle, ArrowLeft, UserCheck } from 'lucide-react';

export default function ConsentVerify({ queue, onVerify, onBack }) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null); // { ok: bool, patientName? }

  const handleVerify = (e) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    const match = queue.find(c => c.token === trimmed);
    if (!match) {
      setResult({ ok: false });
      return;
    }
    onVerify(trimmed);
    setResult({ ok: true, patientName: match.patient.fullName });
    setCode('');
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

        <div className="bg-surface rounded-2xl sm:rounded-3xl border border-line shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-tint border border-line flex items-center justify-center text-teal shrink-0">
              <KeyRound className="w-6 h-6 text-teal" />
            </div>
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-teal bg-teal-tint border border-teal/20 px-2.5 py-0.5 rounded-full mb-1">
                Reception Desk
              </span>
              <h1 className="text-2xl font-serif font-semibold text-ink leading-tight">Verify Patient Consent</h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft -mt-1 font-sans">
            Ask the patient for their MediKiosk code and enter it below to add them to the doctor's queue.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value); setResult(null); }}
              placeholder="e.g. MEDI-4821"
              className="w-full px-4 py-3.5 rounded-xl bg-bg border border-line text-ink placeholder:text-ink-faint font-mono text-lg tracking-widest text-center outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition"
            />
            <button
              type="submit"
              disabled={!code.trim()}
              className="w-full bg-teal hover:bg-teal-dark text-white font-medium py-3.5 rounded-xl text-sm shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Verify Code
            </button>
          </form>

          {result?.ok && (
            <div className="rounded-2xl bg-teal-tint border border-teal/30 p-4 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
              <div>
                <p className="text-sm font-semibold text-teal-dark">Patient found — {result.patientName}</p>
                <p className="text-xs text-teal/80 flex items-center space-x-1 mt-0.5 font-sans">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Added to doctor's queue.</span>
                </p>
              </div>
            </div>
          )}

          {result?.ok === false && (
            <div className="rounded-2xl bg-alert-tint border border-alert/30 p-4 flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-alert shrink-0" />
              <p className="text-sm font-semibold text-alert">No matching case found for that code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
