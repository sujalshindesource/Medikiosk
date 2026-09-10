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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full mb-1">
                Reception Desk
              </span>
              <h1 className="text-xl font-bold text-white leading-tight">Verify Patient Consent</h1>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Ask the patient for their MediKiosk code and enter it below to add them to the doctor's queue.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value); setResult(null); }}
              placeholder="e.g. MEDI-4821"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-lg tracking-widest text-center outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
            />
            <button
              type="submit"
              disabled={!code.trim()}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Verify Code
            </button>
          </form>

          {result?.ok && (
            <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/40 p-4 flex items-center space-x-3 animate-scale-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-300">Patient found — {result.patientName}</p>
                <p className="text-xs text-emerald-200/70 flex items-center space-x-1 mt-0.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Added to doctor's queue.</span>
                </p>
              </div>
            </div>
          )}

          {result?.ok === false && (
            <div className="rounded-2xl bg-red-950/40 border border-red-500/40 p-4 flex items-center space-x-3 animate-scale-in">
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm font-bold text-red-300">No matching case found for that code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
