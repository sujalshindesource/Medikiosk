import React, { useState } from 'react';
import { 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Printer, 
  Share2, 
  RotateCcw,
  KeyRound,
  Copy
} from 'lucide-react';

export default function SummaryReport({ patientData, setPatientData, onReset, onTransmit, lang }) {
  const [submitted, setSubmitted] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSendRequest = () => {
    const token = `MEDI-${Math.floor(1000 + Math.random() * 9000)}`;
    setKeyword(token);
    setSubmitted(true);
    if (onTransmit) onTransmit(token);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(keyword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — non-fatal, user can still read the code
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Submission Success Toast Card */}
      {submitted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">
                {lang === 'en' ? 'Clinical Case Pushed to Hospital OPD Queue!' : 'केस सफलतापूर्वक डॉक्टर कतार में भेजा गया!'}
              </h4>
              <p className="text-xs text-slate-300">
                {lang === 'en' 
                  ? `Summary and token confirmation sent to ${patientData.email || 'patient email'}.` 
                  : 'केस सारांश आपके ईमेल पर प्रेषित कर दिया गया है।'}
              </p>
            </div>
          </div>

          {/* Keyword Handoff Card */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                  {lang === 'en' ? 'Share this code with the receptionist' : 'यह कोड रिसेप्शनिस्ट को दें'}
                </p>
                <p className="text-2xl font-mono font-black text-white tracking-widest">{keyword}</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs font-bold text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => window.print()}
              className="text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={onReset}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Patient Consultation</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Clinical Summary Card */}
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                EHR Pre-Consultation Summary
              </span>
              <span className="text-xs text-slate-400 font-mono">
                #{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {lang === 'en' ? 'Clinical Triage Evaluation Sheet' : 'क्लीनिकल ट्राइएज मूल्यांकन शीट'}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button 
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Patient Bio Grid with Email and ABHA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
            
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Patient Name
              </span>
              <p className="font-bold text-white text-sm">{patientData.fullName}</p>
              <span className="text-slate-400">{patientData.age} Yrs • {patientData.gender}</span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Contact & Records Email
              </span>
              <p className="font-mono text-cyan-300 text-xs truncate">{patientData.email || 'N/A'}</p>
              <span className="text-emerald-400 text-[10px]">✓ E-Prescription Delivery Verified</span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                OPD Care Stream
              </span>
              <span className="inline-block font-bold text-xs px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {patientData.opdStream} Protocol
              </span>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                ABHA: {patientData.abhaId}
              </p>
            </div>

          </div>

          {/* Vitals Summary Pill-Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Pulse</div>
              <div className="text-sm font-bold text-white mt-0.5">{patientData.vitals?.pulse || '84 bpm'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Blood Pressure</div>
              <div className="text-sm font-bold text-white mt-0.5">{patientData.vitals?.bp || '138/88'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">SpO2</div>
              <div className="text-sm font-bold text-white mt-0.5">{patientData.vitals?.spO2 || '97%'}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Temperature</div>
              <div className="text-sm font-bold text-white mt-0.5">{patientData.vitals?.temp || '99.1 °F'}</div>
            </div>
          </div>

          {/* Chief Complaints & Clinical Narrative */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {lang === 'en' ? 'Synthesized Chief Complaints & Narrative' : 'दर्ज मुख्य लक्षण एवं सारांश'}
                </span>
              </label>
              <span className="text-[11px] text-slate-400">Editable by patient</span>
            </div>

            <textarea
              value={patientData.transcript}
              onChange={(e) => setPatientData({ ...patientData, transcript: e.target.value })}
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-200 text-sm font-sans focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none leading-relaxed transition"
            />
          </div>

          {/* Emergency Red Flag Notice */}
          {patientData.redFlagDetected && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center space-x-3 text-red-200">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div className="text-xs">
                <strong className="text-red-300 block font-semibold">Priority Triage Flag Attached</strong>
                This ticket will be highlighted at top of Dr. OPD Queue with high acuity badge.
              </div>
            </div>
          )}

          {/* Final Action Submission Button */}
          <button
            onClick={handleSendRequest}
            disabled={submitted}
            className={`w-full font-bold py-4 rounded-2xl text-base shadow-xl flex items-center justify-center space-x-2 transition transform cursor-pointer ${
              submitted
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {submitted ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'en' ? 'Transmitted to Hospital Physician' : 'अस्पताल को प्रेषित'}</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>{lang === 'en' ? 'Transmit to Hospital Doctor Queue' : 'अस्पताल को अनुरोध भेजें'}</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
