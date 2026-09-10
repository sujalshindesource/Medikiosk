import React from 'react';
import { 
  ArrowRight, 
  Mic, 
  Stethoscope, 
  ShieldCheck, 
  Zap, 
  Activity,
  FileCheck2
} from 'lucide-react';
import { t } from './landingStrings';

export default function LandingHero({ onStart, lang }) {
  const stats = [
    { 
      label: t(lang, 'stats.timeSavedLabel'), 
      val: '70%', 
      desc: t(lang, 'stats.timeSavedDesc') 
    },
    { 
      label: t(lang, 'stats.accuracyLabel'), 
      val: '99.4%', 
      desc: t(lang, 'stats.accuracyDesc') 
    },
    { 
      label: t(lang, 'stats.speedLabel'), 
      val: '< 90s', 
      desc: t(lang, 'stats.speedDesc') 
    },
    { 
      label: t(lang, 'stats.abdmLinkedLabel'), 
      val: '100%', 
      desc: t(lang, 'stats.abdmLinkedDesc') 
    }
  ];

  return (
    <div className="space-y-10 py-2">
      
      {/* Hero Showcase Container */}
      <div className="py-4 sm:py-8 max-w-4xl space-y-6">
        
        {/* Tag badge / eyebrow */}
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-faint font-sans">
          {t(lang, 'hero.eyebrow')}
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.15] font-serif text-ink">
          {t(lang, 'hero.headlinePart1')}{' '}
          <span className="text-saffron">
            {t(lang, 'hero.headlinePart2')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-ink-soft text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
          {t(lang, 'hero.subtext')}
        </p>

        {/* CTA & Trust Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={onStart}
            className="bg-teal hover:bg-teal-dark text-white font-medium px-8 py-4 rounded-xl text-base shadow-sm flex items-center space-x-2.5 transition cursor-pointer"
          >
            <span>{t(lang, 'hero.primaryCta')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs text-ink-soft bg-transparent px-4 py-3 rounded-xl border border-line">
            <Zap className="w-4 h-4 text-teal" />
            <span>{t(lang, 'hero.secondaryCta')}</span>
          </div>
        </div>

        {/* Key Compliance Pills / Trust Row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-ink-faint border-t border-line">
          <div className="flex items-center space-x-1.5 text-ink-soft">
            <ShieldCheck className="w-4 h-4 text-teal" />
            <span>{t(lang, 'hero.trust1')}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5 text-ink-soft">
            <FileCheck2 className="w-4 h-4 text-teal" />
            <span>{t(lang, 'hero.trust2')}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1.5 text-ink-soft">
            <Activity className="w-4 h-4 text-teal" />
            <span>{t(lang, 'hero.trust3')}</span>
          </div>
        </div>

      </div>

      {/* Metrics Row — Unified Statistics Strip with Projected Impact Context */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 px-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-teal font-sans">
            {t(lang, 'stats.sectionBadge')}
          </div>
          <div className="text-[11px] text-ink-faint font-sans">
            {t(lang, 'stats.sectionDisclaimer')}
          </div>
        </div>

        <div className="bg-teal-tint/60 border border-line rounded-2xl p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-line">
          {stats.map((s, idx) => (
            <div 
              key={idx}
              className="flex flex-col justify-center px-3 sm:px-6 first:pl-0 last:pr-0"
            >
              <div className="text-2xl sm:text-3xl font-semibold font-serif text-teal-dark">
                {s.val}
              </div>
              <div className="text-xs font-semibold text-ink-soft mt-1 font-sans">{s.label}</div>
              <div className="text-[11px] text-ink-faint mt-0.5 font-sans">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Differentiable 3-Pillar Feature Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Pillar 1 — SOCRATES */}
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <Mic className="w-6 h-6 text-teal mb-4" />
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint font-sans">
              {t(lang, 'cards.socratesEyebrow')}
            </div>
            <h3 className="font-serif font-semibold text-xl text-ink mt-1 mb-2">{t(lang, 'cards.socratesTitle')}</h3>
            <p className="font-sans text-sm text-ink-soft leading-relaxed">
              {t(lang, 'cards.socratesBody')}
            </p>
          </div>
        </div>

        {/* Pillar 2 — AYUSH */}
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <Stethoscope className="w-6 h-6 text-saffron mb-4" />
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint font-sans">
              {t(lang, 'cards.ayushEyebrow')}
            </div>
            <h3 className="font-serif font-semibold text-xl text-ink mt-1 mb-2">{t(lang, 'cards.ayushTitle')}</h3>
            <p className="font-sans text-sm text-ink-soft leading-relaxed">
              {t(lang, 'cards.ayushBody')}
            </p>
          </div>
        </div>

        {/* Pillar 3 — ABDM */}
        <div className="bg-surface border border-line rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <ShieldCheck className="w-6 h-6 text-teal mb-4" />
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint font-sans">
              {t(lang, 'cards.abdmEyebrow')}
            </div>
            <h3 className="font-serif font-semibold text-xl text-ink mt-1 mb-2">{t(lang, 'cards.abdmTitle')}</h3>
            <p className="font-sans text-sm text-ink-soft leading-relaxed">
              {t(lang, 'cards.abdmBody')}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
