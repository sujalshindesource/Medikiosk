import React from 'react';
import { 
  Stethoscope, 
  HeartPulse, 
  Mic, 
  Hand, 
  AlertTriangle, 
  Check, 
  ArrowRight
} from 'lucide-react';

const EMERGENCY_KEYWORDS = [
  'chest pain', 'chest tightness', 'breathing difficulty', 'shortness of breath',
  'can\'t breathe', 'cannot breathe', 'stroke', 'unconscious', 'severe bleeding',
  'radiating to left arm', 'collapsed', 'seizure'
];

export default function OPDIntake({ patientData, setPatientData, onNext, lang }) {


  const sampleTranscripts = [
    'Severe chest tightness radiating to left arm with mild fever since yesterday morning.',
    'Sharp epigastric pain after meals with burning sensation and nausea for 3 days.',
    'Persistent dry cough with shortness of breath during exertion for past one week.'
  ];

  const symptomTags = [
    'Chest Pain', 'Shortness of Breath', 'Fever (>100°F)', 'Palpitations',
    'Dizziness', 'Persistent Cough', 'Abdominal Pain', 'Fatigue'
  ];

  const handleToggleTag = (tag) => {
    let current = patientData.transcript || '';
    if (current.includes(tag)) {
      current = current.replace(tag, '').replace(/,\s*,/g, ',').trim();
    } else {
      current = current ? `${current}, ${tag}` : tag;
    }
    setPatientData({ ...patientData, transcript: current });
  };

  const detectRedFlag = (text) => {
    const lower = (text || '').toLowerCase();
    return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
  };

  const handleNext = () => {
    const flagged = detectRedFlag(patientData.transcript);
    if (flagged !== patientData.redFlagDetected) {
      setPatientData({ ...patientData, redFlagDetected: flagged });
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      
      {/* Stream Selector: Allopathic vs AYUSH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Allopathic Option */}
        <div
          onClick={() => setPatientData({ ...patientData, opdStream: 'Allopathic' })}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
            patientData.opdStream === 'Allopathic'
              ? 'border-cyan-500 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950/40 shadow-xl shadow-cyan-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3.5 rounded-2xl ${
              patientData.opdStream === 'Allopathic' 
                ? 'bg-cyan-500 text-slate-950' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              <Stethoscope className="w-7 h-7" />
            </div>
            {patientData.opdStream === 'Allopathic' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Selected
              </span>
            )}
          </div>

          <h4 className="font-bold text-lg text-white">
            {lang === 'en' ? 'Allopathic OPD (SOCRATES Protocol)' : 'एलोपैथिक ओपीडी (सुकरैट्स प्रोटोकॉल)'}
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Standard clinical triage analyzing Site, Onset, Character, Radiation, Associations, Timing, Exacerbating factors, and Severity scale (1-10).
          </p>
        </div>

        {/* AYUSH Option */}
        <div
          onClick={() => setPatientData({ ...patientData, opdStream: 'AYUSH' })}
          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
            patientData.opdStream === 'AYUSH'
              ? 'border-emerald-500 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/40 shadow-xl shadow-emerald-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3.5 rounded-2xl ${
              patientData.opdStream === 'AYUSH' 
                ? 'bg-emerald-500 text-slate-950' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              <HeartPulse className="w-7 h-7" />
            </div>
            {patientData.opdStream === 'AYUSH' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Selected
              </span>
            )}
          </div>

          <h4 className="font-bold text-lg text-white">
            {lang === 'en' ? 'AYUSH OPD (Dashavidha Pariksha)' : 'आयुष ओपीडी (दशविध परीक्षा)'}
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Ayurvedic evaluation tracking Prakriti (Vata/Pitta/Kapha constitution), Vikriti (Imbalance), Agni (Digestive fire), and Ahara-Vihara patterns.
          </p>
        </div>

      </div>

      {/* Main Interactive Input Engine Panel */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        
        {/* Panel Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg text-white">
                {lang === 'en' ? 'Clinical Triage Intake' : 'क्लीनिकल ट्राइएज इनपुट'}
              </h3>
              <span className="text-xs text-cyan-400 font-mono">
                [{patientData.opdStream.toUpperCase()}]
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en' 
                ? 'Speak in native language or use touch key indicators.'
                : 'अपनी भाषा में बोलें या टच विकल्पों का उपयोग करें।'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setPatientData({ ...patientData, inputMethod: 'Voice' })}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                patientData.inputMethod === 'Voice' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Voice Engine' : 'वॉयस मोड'}</span>
            </button>

            <button
              onClick={() => setPatientData({ ...patientData, inputMethod: 'Touch' })}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                patientData.inputMethod === 'Touch' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Touch Grid' : 'टच मोड'}</span>
            </button>
          </div>
        </div>

        {/* Voice Mode Visualizer */}
        {patientData.inputMethod === 'Voice' ? (
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-5">
            
            {/* Live Engine Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping absolute" />
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white tracking-wide">
                    {lang === 'en' ? 'AI Voice Engine Listening (Hindi / English / Vernacular)' : 'एआई वॉयस इंजन सुन रहा है'}
                  </span>
                  <p className="text-[11px] text-slate-400">Low-latency clinical speech-to-text converter</p>
                </div>
              </div>

              {/* Animated Waveform Visualization */}
              <div className="flex items-center space-x-1.5 h-7">
                <span className="wave-bar h-3 animate-wave-1" />
                <span className="wave-bar h-6 animate-wave-2" />
                <span className="wave-bar h-4 animate-wave-3" />
                <span className="wave-bar h-7 animate-wave-4" />
                <span className="wave-bar h-5 animate-wave-5" />
                <span className="wave-bar h-3 animate-wave-2" />
              </div>
            </div>

            {/* Live Transcript Container */}
            <div className="relative">
              <textarea
                rows={3}
                value={patientData.transcript}
                onChange={(e) => setPatientData({ ...patientData, transcript: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-sm leading-relaxed outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 resize-none"
                placeholder="Spoken symptoms will appear here in real time..."
              />
            </div>

            {/* Quick Demo Prompts */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold">Simulate Voice Input:</span>
              {sampleTranscripts.map((text, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPatientData({ ...patientData, transcript: text })}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
                >
                  Case #{i + 1}
                </button>
              ))}
            </div>

          </div>
        ) : (
          /* Touch Mode Tag Grid */
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Observed Symptoms (Tap to attach)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {symptomTags.map((tag) => {
                const isSelected = patientData.transcript?.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={patientData.transcript}
              onChange={(e) => setPatientData({ ...patientData, transcript: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
              placeholder="Additional notes..."
            />
          </div>
        )}

        {/* Emergency Red-Flag Banner */}
        {patientData.redFlagDetected && (
          <div className="bg-red-950/50 border border-red-500/40 rounded-2xl p-5 flex items-start space-x-4 text-red-200">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 text-red-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h5 className="font-bold text-sm text-red-300">
                  {lang === 'en' ? 'Red-Flag Symptom Alert Triggered' : 'आपातकालीन चेतावनी चिन्ह'}
                </h5>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500 text-white">
                  PRIORITY #1
                </span>
              </div>
              <p className="text-xs text-red-200/80 leading-relaxed">
                {lang === 'en' 
                  ? 'Emergency symptoms detected in the patient narrative. Triage algorithm has flagged this case for zero-wait physician escalation.'
                  : 'आपातकालीन लक्षणों का पता चला। ट्राइएज एल्गोरिदम ने इस केस को त्वरित डॉक्टर परामर्श हेतु चिह्नित किया है।'}
              </p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold py-4 rounded-2xl text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>{lang === 'en' ? 'Synthesize Clinical Pre-Consultation Summary' : 'केस सारांश तैयार करें'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
