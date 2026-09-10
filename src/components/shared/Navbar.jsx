import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  ChevronDown,
  LogOut,
  Stethoscope,
  LayoutDashboard,
  Mic,
  Clock,
  FileText,
  UserCircle,
  Users,
  Settings,
  KeyRound,
  Home,
  Sparkles,
  Info,
  UserPlus,
} from 'lucide-react';
import { t } from '../../translations';

/**
 * Shared Navbar used across all pages for visual consistency.
 *
 * Props:
 *   variant   – 'landing' | 'patient' | 'doctor'
 *   lang      – current language code
 *   setLang   – language setter
 *   onNavigate – (screen) => void  — route to a screen
 *   activeTab  – current active tab id
 *   userName   – display name for profile
 *   userEmail  – display email for profile
 *   onSignOut  – sign-out handler
 */
export default function Navbar({
  variant = 'landing',
  lang = 'en',
  setLang,
  onNavigate,
  activeTab,
  userName,
  userEmail,
  onSignOut,
}) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const langRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = userName
    ? userName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  // ── Navigation links per variant ────────────────────────
  const landingLinks = [
    { id: 'landing', label: t('home', lang), icon: Home },
    { id: 'features', label: t('features', lang), icon: Sparkles },
    { id: 'about', label: t('about', lang), icon: Info },
    { id: 'patient-login', label: t('login', lang), icon: UserCircle },
    { id: 'patient-register', label: t('signUp', lang), icon: UserPlus },
  ];

  const patientLinks = [
    { id: 'overview', label: t('dashboard', lang), icon: LayoutDashboard },
    { id: 'opd', label: t('aiInterview', lang), icon: Mic },
    { id: 'history', label: t('myTimeline', lang), icon: Clock },
    { id: 'documents', label: t('documents', lang), icon: FileText },
    { id: 'details', label: t('profile', lang), icon: UserCircle },
  ];

  const doctorLinks = [
    { id: 'dashboard', label: t('dashboard', lang), icon: LayoutDashboard },
    { id: 'queue', label: t('queue', lang), icon: Clock },
    { id: 'patients', label: t('patients', lang), icon: Users },
    { id: 'settings', label: t('settings', lang), icon: Settings },
    { id: 'consent-desk', label: t('consentDesk', lang), icon: KeyRound },
  ];

  const links = variant === 'landing' ? landingLinks
    : variant === 'patient' ? patientLinks
    : doctorLinks;

  return (
    <header
      className="sticky top-0 z-50 shadow-md border-b border-[#e2e8f0]"
      style={{ background: '#1A5276', height: '64px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

        {/* ── Left: Logo ─────────────────────────── */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer shrink-0"
          onClick={() => onNavigate && onNavigate(variant === 'landing' ? 'landing' : variant === 'patient' ? 'overview' : 'dashboard')}
        >
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white font-black text-sm shadow">
            MK
          </div>
          <span className="font-bold text-white text-lg tracking-tight hidden sm:inline">
            MediKiosk
          </span>
        </div>

        {/* ── Center: Nav Links ───────────────────── */}
        <nav className="hidden md:flex items-center space-x-1">
          {links.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate && onNavigate(link.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1A5276] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── Right: Language + Profile ────────────── */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Language Dropdown */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setShowLangDropdown(v => !v)}
              className="flex items-center space-x-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/10 transition cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'en' ? 'English' : 'हिंदी'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-scale-in">
                <button
                  onClick={() => { setLang('en'); setShowLangDropdown(false); }}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm transition cursor-pointer ${
                    lang === 'en' ? 'bg-blue-50 text-[#1A5276] font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                  {lang === 'en' && <span className="ml-auto w-2 h-2 rounded-full bg-[#1A5276]" />}
                </button>
                <button
                  onClick={() => { setLang('hi'); setShowLangDropdown(false); }}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm transition cursor-pointer ${
                    lang === 'hi' ? 'bg-blue-50 text-[#1A5276] font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>🇮🇳</span>
                  <span>हिंदी</span>
                  {lang === 'hi' && <span className="ml-auto w-2 h-2 rounded-full bg-[#1A5276]" />}
                </button>
              </div>
            )}
          </div>

          {/* Profile / Auth Area */}
          {variant !== 'landing' && userName ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileMenu(v => !v)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 border border-white/15 pl-2.5 sm:pl-3 pr-2 py-1.5 rounded-xl transition cursor-pointer"
              >
                <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-white leading-none">{userName}</div>
                  <div className="text-[11px] text-white/60 leading-tight truncate max-w-[120px]">{userEmail}</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#2ECC71] flex items-center justify-center text-white font-bold text-xs shadow">
                  {initials}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-scale-in">
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2ECC71] flex items-center justify-center text-white font-bold text-sm shadow">
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-slate-800 truncate">{userName}</div>
                        <div className="text-xs text-slate-500 truncate">{userEmail}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { onSignOut && onSignOut(); setShowProfileMenu(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-semibold">{t('signOut', lang)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : variant === 'landing' ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate && onNavigate('doctor-login')}
                className="flex items-center space-x-1.5 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                <span className="hidden sm:inline">{t('doctorLogin', lang)}</span>
              </button>
              <button
                onClick={() => onNavigate && onNavigate('consent-desk')}
                className="flex items-center space-x-1.5 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span className="hidden sm:inline">{t('receptionDesk', lang)}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
