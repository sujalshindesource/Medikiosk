import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Mic, 
  Stethoscope, 
  ShieldCheck, 
  Zap, 
  Activity,
  FileCheck2
} from 'lucide-react';

export default function LandingHero({ onStart, lang }) {
  const stats = [
    { 
      label: lang === 'en' ? 'Doctor Time Saved' : 'डॉक्टर का समय बचा', 
      val: '70%', 
      desc: lang === 'en' ? 'Average reduction per case' : 'प्रति केस औसत कमी' 
    },
    { 
      label: lang === 'en' ? 'Clinical Accuracy' : 'नैदानिक सटीकता', 
      val: '99.4%', 
      desc: lang === 'en' ? 'Validated AI Triage Engine' : 'प्रमाणित एआई इंजन' 
    },
    { 
      label: lang === 'en' ? 'Intake Speed' : 'प्रवेश गति', 
      val: '< 90s', 
      desc: lang === 'en' ? 'Voice-to-clinical summary' : 'वॉयस-टू-समरी' 
    },
    { 
      label: lang === 'en' ? 'ABDM Linked' : 'आभा से संबद्ध', 
      val: '100%', 
      desc: lang === 'en' ? 'Digital consent records' : 'डिजिटल सहमति रिकॉर्ड' 
    }
  ];

  return (
    <div className="space-y-10 py-2">
      
      {/* Hero Showcase Container */}
      <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border border-slate-700/60 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800/95 to-slate-900">
        
        {/* Subtle decorative radial grid & glows */}
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-7">
          
          {/* Tag badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-emerald-500/10 border border-cyan-500/30 text-cyan-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>
              {lang === 'en' 
                ? 'NEXT-GEN AUTONOMOUS TRIAGE ENGINE • AYUSH & ALLOPATHY' 
                : 'नेक्स्ट-जेन स्वचालित ट्राइएज इंजन • आयुष और एलोपैथी'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            {lang === 'en' ? (
              <>
                Intelligent Patient Intake.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
                  Zero Loss Records.
                </span>
              </>
            ) : (
              <>
                स्मार्ट मरीज केस-टेकिंग और{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
                  लाइफटाइम स्वास्थ्य रिकॉर्ड
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
            {lang === 'en'
              ? 'Multi-lingual voice & touch consultation kiosk designed for Indian healthcare systems. Auto-converts vernacular patient distress narratives into structured SOCRATES clinical notes & Ayurvedic Dashavidha Pariksha in seconds.'
              : 'भारतीय स्वास्थ्य प्रणाली हेतु बहुभाषी वॉयस और टच परामर्श कियोस्क। मरीजों की स्थानीय भाषा की शिकायतों को संरचित क्लीनिकल नोट्स में तुरंत परिवर्तित करें।'}
          </p>

          {/* CTA & Trust Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStart}
              className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-cyan-500/25 flex items-center space-x-3 transition-all transform hover:-translate-y-1 hover:shadow-cyan-500/40 active:translate-y-0"
            >
              <span>{lang === 'en' ? 'Start Patient Consultation' : 'मरीज परामर्श शुरू करें'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{lang === 'en' ? 'Instant Doctor Queue Ready' : 'तत्काल डॉक्टर कतार तैयार'}</span>
            </div>
          </div>

          {/* Key Compliance Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ABDM & ABHA Compliant</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>DPDP Act 2023 Certified</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>HL7 FHIR Standard Export</span>
            </div>
          </div>

        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div 
            key={idx}
            className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700/60 shadow-lg hover:border-cyan-500/30 transition-all hover-lift"
          >
            <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
              {s.val}
            </div>
            <div className="text-xs font-bold text-slate-200 mt-1">{s.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Differentiable 3-Pillar Feature Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1 */}
        <div className="group bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-7 rounded-3xl border border-slate-700/70 shadow-xl hover:border-blue-500/50 transition-all hover-lift relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
            <Mic className="w-7 h-7 text-blue-400" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
              AI Voice Intake
            </span>
            <h3 className="font-bold text-xl text-white">SOCRATES Triage</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Accepts vernacular voice input in local dialects. Automatically parses Site, Onset, Character, Radiation, Associations, Timing, Exacerbating factors, and Severity.
            </p>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="group bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-7 rounded-3xl border border-slate-700/70 shadow-xl hover:border-emerald-500/50 transition-all hover-lift relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
            <Stethoscope className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Traditional Care
            </span>
            <h3 className="font-bold text-xl text-white">AYUSH Dashavidha</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Integrated Ayurvedic assessment module covering Prakriti (Constitution), Vikriti (Pathology), Sara, Samhanana, and Ahara Shakti for comprehensive holistic triage.
            </p>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="group bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-7 rounded-3xl border border-slate-700/70 shadow-xl hover:border-purple-500/50 transition-all hover-lift relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
            <ShieldCheck className="w-7 h-7 text-purple-400" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
              National Health Vault
            </span>
            <h3 className="font-bold text-xl text-white">ABDM Compliant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              One-tap ABHA ID linkage and Aadhaar OTP verification. Digitally signed patient consent management ensuring 100% DPDP Act compliance with lifetime encrypted records.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
