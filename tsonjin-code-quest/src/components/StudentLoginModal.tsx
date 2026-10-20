import React, { useState } from 'react';
import {
  ArrowRight,
  Terminal,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  School,
  GraduationCap,
  AtSign,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';
import { GameSettings, StudentProfile } from '../types';
import { storage } from '../utils/storage';
import { CyberSpatialCore3D } from './CyberSpatialCore3D';
import { SUPPORTED_GRADES, CLASS_SECTIONS, formatGradeClass } from '../utils/gradeSystem';
import { validateUsernameRules, formatMongolianPhone, maskMongolianPhone } from '../utils/security';

interface StudentLoginModalProps {
  currentProfile: StudentProfile;
  onLogin: (profile: StudentProfile) => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const AVATAR_OPTIONS = ['⚡', '🚀', '💎', '🔮', '🌟', '🛡️', '🤖', '💻'];

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  currentProfile,
  onLogin,
  settings,
  setSettings,
}) => {
  const t = translations[settings.language];
  const isMn = settings.language === 'mn';

  // Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In state (allows username or email or phone)
  const [loginIdentifier, setLoginIdentifier] = useState(
    currentProfile.username || currentProfile.email || 'orgil'
  );
  const [loginPassword, setLoginPassword] = useState(currentProfile.password || 'Passw0rd.0813');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Sign Up state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupDisplayName, setSignupDisplayName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('+976 9911 2233');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupGradeNumber, setSignupGradeNumber] = useState<number>(10);
  const [signupClassSection, setSignupClassSection] = useState<number>(2);
  const [signupAvatar, setSignupAvatar] = useState('⚡');
  const [showSignupPass, setShowSignupPass] = useState(false);

  // Real-time username verification feedback
  const [usernameAvailability, setUsernameAvailability] = useState<{
    checked: boolean;
    available?: boolean;
    error?: string;
    suggestions?: string[];
  }>({ checked: false });

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showRosterQuickSelect, setShowRosterQuickSelect] = useState(false);

  const studentsRoster = storage.loadAllStudents();

  const setLanguage = (lang: 'en' | 'mn') => {
    soundFx.click(settings.soundEnabled);
    setSettings((prev) => {
      const updated = { ...prev, language: lang };
      storage.saveSettings(updated);
      return updated;
    });
  };

  // Real-time check on username blur or change
  const handleCheckUsername = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setUsernameAvailability({ checked: false });
      return;
    }
    const check = storage.checkUsernameAvailability(trimmed);
    setUsernameAvailability({
      checked: true,
      available: check.available,
      error: check.error,
      suggestions: check.suggestions,
    });
  };

  // Sign In Handler
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const identTrimmed = loginIdentifier.trim();
    if (!identTrimmed) {
      setErrorMessage(isMn ? 'Хэрэглэгчийн нэр эсвэл Gmail оруулна уу' : 'Username or email is required');
      soundFx.error(settings.soundEnabled);
      return;
    }

    const res = storage.loginCadetAccount(identTrimmed, loginPassword);
    if (res.success && res.profile) {
      soundFx.complete(settings.soundEnabled);
      setSuccessMessage(isMn ? 'Амжилттай нэвтэрлээ!' : 'Successfully signed in!');
      setTimeout(() => {
        onLogin(res.profile!);
      }, 350);
    } else {
      soundFx.error(settings.soundEnabled);
      setErrorMessage(res.error || (isMn ? 'Нэвтрэхэд алдаа гарлаа' : 'Sign in failed'));
    }
  };

  // Create Account Handler
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const uName = signupUsername.trim();
    const dName = signupDisplayName.trim();
    const emailTrimmed = signupEmail.trim();
    const passTrimmed = signupPassword.trim();

    // Verify username rules
    const uRules = validateUsernameRules(uName);
    if (!uRules.valid) {
      setErrorMessage(uRules.error || 'Хэрэглэгчийн нэр шаардлага хангахгүй байна');
      soundFx.error(settings.soundEnabled);
      return;
    }

    if (!dName) {
      setErrorMessage(isMn ? 'Сурагчийн нэрийг оруулна уу (Display Name)' : 'Display name is required');
      soundFx.error(settings.soundEnabled);
      return;
    }

    if (!storage.isValidGmail(emailTrimmed)) {
      setErrorMessage(
        isMn
          ? 'Зөвхөн албан ёсны @gmail.com хаягаар бүртгүүлнэ үү! (Жишээ: nersuraagch@gmail.com)'
          : 'Only official @gmail.com addresses are permitted!'
      );
      soundFx.error(settings.soundEnabled);
      return;
    }

    if (!passTrimmed || passTrimmed.length < 4) {
      setErrorMessage(
        isMn
          ? 'Нууц үг хамгийн багадаа 4 оронтой байх ёстой'
          : 'Password must be at least 4 characters long'
      );
      soundFx.error(settings.soundEnabled);
      return;
    }

    const res = storage.registerStudentWithSchoolRules({
      username: uName,
      displayName: dName,
      email: emailTrimmed,
      phone: signupPhone,
      password: passTrimmed,
      gradeNumber: signupGradeNumber,
      classSection: signupClassSection,
      avatar: signupAvatar,
      role: 'STUDENT',
    });

    if (res.success && res.profile) {
      soundFx.complete(settings.soundEnabled);
      setSuccessMessage(isMn ? 'Шинэ бүртгэл амжилттай үүслээ!' : 'Account created successfully!');
      setTimeout(() => {
        onLogin(res.profile!);
      }, 400);
    } else {
      soundFx.error(settings.soundEnabled);
      setErrorMessage(res.error || (isMn ? 'Бүртгэл үүсгэхэд алдаа гарлаа' : 'Sign up failed'));
      if (res.suggestions) {
        setUsernameAvailability({
          checked: true,
          available: false,
          error: res.error,
          suggestions: res.suggestions,
        });
      }
    }
  };

  // Quick select demo student
  const handleSelectDemoStudent = (st: StudentProfile) => {
    soundFx.click(settings.soundEnabled);
    setLoginIdentifier(st.username || st.email || 'orgil');
    setLoginPassword(st.password || '123456');
    setShowRosterQuickSelect(false);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background ambient glows */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: 3D/4D Spatial Interactive Showcase */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TSONJIN CYBER ACADEMY</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
              Cyber Academic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Identity & Portal
              </span>
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isMn
                ? 'Цонжин Кибер сургуулийн албан ёсны бүртгэл. 6–12 дугаар ангийн сурагчдын дахин давтагдашгүй @username, бодит баталгаажуулалт.'
                : 'Official student registration for Grade 6–12. Globally unique @username, role security, and permanent progress tracking.'}
            </p>
          </div>

          {/* Interactive 3D Spatial Core */}
          <CyberSpatialCore3D className="w-full" interactive={true} />

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span>Grade System · 6-1 to 12-3</span>
            <span>Security · Unique Constraints</span>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-7 w-full">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-[#0e1411]/90 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl transition-all">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {/* Header: School Brand & Language Selector */}
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/30 bg-[#070a08] text-emerald-400 shadow-sm">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    TSONJIN CYBER BOARDING SCHOOL
                  </div>
                  <div className="text-sm font-bold text-white">
                    {t.gameTitle || 'Code Quest'}
                  </div>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center rounded-xl border border-slate-800/80 bg-[#070a08]/90 p-0.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-lg px-2.5 py-1 transition-all ${
                    settings.language === 'en'
                      ? 'bg-emerald-500 text-[#070a08] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('mn')}
                  className={`rounded-lg px-2.5 py-1 transition-all ${
                    settings.language === 'mn'
                      ? 'bg-emerald-500 text-[#070a08] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  MN
                </button>
              </div>
            </div>

            {/* 2 Choice Segmented Picker */}
            <div className="mt-6">
              <div className="relative flex rounded-2xl border border-slate-800/80 bg-[#070a08]/95 p-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.click(settings.soundEnabled);
                    setAuthMode('signin');
                    setErrorMessage(null);
                  }}
                  className={`relative z-10 flex-1 py-2.5 rounded-xl font-bold transition-all text-center ${
                    authMode === 'signin'
                      ? 'bg-emerald-500 text-[#070a08] shadow-[0_2px_12px_rgba(16,185,129,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isMn ? 'Нэвтрэх (Sign In)' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.click(settings.soundEnabled);
                    setAuthMode('signup');
                    setErrorMessage(null);
                  }}
                  className={`relative z-10 flex-1 py-2.5 rounded-xl font-bold transition-all text-center ${
                    authMode === 'signup'
                      ? 'bg-emerald-500 text-[#070a08] shadow-[0_2px_12px_rgba(16,185,129,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isMn ? 'Бүртгүүлэх (Create Account)' : 'Create Account'}
                </button>
              </div>
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-semibold text-slate-300">
                      {isMn ? 'Хэрэглэгчийн нэр, Gmail эсвэл Утас' : 'Username, Gmail or Phone'}
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">@username</span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <AtSign className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="orgil эсвэл orgilbna22@gmail.com"
                      required
                      autoFocus
                      className="w-full rounded-2xl border border-slate-800 bg-[#070a08] py-3.5 pl-10 pr-4 font-mono text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-semibold text-slate-300">
                      {isMn ? 'Нууц Үг (Password)' : 'Password'}
                    </label>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showLoginPass ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-2xl border border-slate-800 bg-[#070a08] py-3.5 pl-10 pr-11 font-mono text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass(!showLoginPass)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-white"
                    >
                      {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-[#070a08] shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] active:scale-[0.99]"
                  >
                    <span>{isMn ? 'Нэвтрэх (Sign In)' : 'Sign In'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Quick Select Demo Accounts Drawer */}
                <div className="border-t border-slate-800/80 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      {isMn ? 'Цонжин сурагчдаар хурдан нэвтрэх:' : 'Quick Select Cadet:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRosterQuickSelect(!showRosterQuickSelect)}
                      className="text-[11px] font-mono text-emerald-400 hover:underline"
                    >
                      {showRosterQuickSelect ? (isMn ? 'Хаах' : 'Close') : (isMn ? 'Жагсаалт харах' : 'View Roster')}
                    </button>
                  </div>

                  {showRosterQuickSelect && (
                    <div className="mt-2.5 max-h-44 overflow-y-auto space-y-1.5 rounded-2xl border border-slate-800 bg-[#070a08] p-2">
                      {studentsRoster.slice(0, 6).map((st) => (
                        <div
                          key={st.id || st.username || st.name}
                          onClick={() => handleSelectDemoStudent(st)}
                          className="flex items-center justify-between rounded-xl p-2 hover:bg-emerald-950/30 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{st.avatar || '⚡'}</span>
                            <div>
                              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                                <span>{st.name}</span>
                                <span className="text-[10px] text-emerald-400 font-mono">@{st.username || 'cadet'}</span>
                              </div>
                              <div className="text-[10px] font-mono text-slate-500">
                                Анги: {st.grade || '10-2'} · {st.phone ? maskMongolianPhone(st.phone) : '+976 ••••'}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-emerald-400 font-bold">{st.totalXp} XP</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            )}

            {/* TAB 2: CREATE ACCOUNT (Strict School Form) */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="mt-5 space-y-3">
                {/* 1. Globally Unique Username */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono font-semibold text-slate-300">
                      USERNAME (Давтагдашгүй нэр)
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">3–20 тэмдэгт, үсэг, тоо, _</span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <AtSign className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={signupUsername}
                      onChange={(e) => {
                        setSignupUsername(e.target.value);
                        setErrorMessage(null);
                        handleCheckUsername(e.target.value);
                      }}
                      onBlur={() => handleCheckUsername(signupUsername)}
                      placeholder="Жишээ: orgil"
                      required
                      autoFocus
                      className="w-full rounded-2xl border border-slate-800 bg-[#070a08] py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Username availability alert & suggestions */}
                  {usernameAvailability.checked && (
                    <div className="mt-1.5 text-xs font-mono">
                      {usernameAvailability.available ? (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Боломжтой (@{signupUsername.toLowerCase()} available)</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-rose-400">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>{usernameAvailability.error || 'Username already taken'}</span>
                          </div>
                          {usernameAvailability.suggestions && usernameAvailability.suggestions.length > 0 && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <span>Try:</span>
                              {usernameAvailability.suggestions.map((sug) => (
                                <button
                                  type="button"
                                  key={sug}
                                  onClick={() => {
                                    const cleanSug = sug.replace(/^@/, '');
                                    setSignupUsername(cleanSug);
                                    handleCheckUsername(cleanSug);
                                  }}
                                  className="text-emerald-400 underline hover:text-emerald-300 font-bold"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Display Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono font-semibold text-slate-300">
                      DISPLAY NAME (Харагдах нэр)
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">Жишээ: Orgil эсвэл Т. Оргил</span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={signupDisplayName}
                      onChange={(e) => {
                        setSignupDisplayName(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="Оргил"
                      required
                      className="w-full rounded-2xl border border-slate-800 bg-[#070a08] py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* 3. STRICT SCHOOL GRADE & CLASS SELECTOR (6-1 to 12-3 ONLY) */}
                <div className="rounded-2xl border border-emerald-500/20 bg-[#0a0f0d] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <School className="h-4 w-4" />
                      <span>СУРГУУЛИЙН АНГИ / БҮЛЭГ</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-300 font-bold">
                      Сонгосон: <span className="text-emerald-300 font-extrabold">{formatGradeClass(signupGradeNumber, signupClassSection)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Choose Grade */}
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 mb-1">Choose Grade:</span>
                      <select
                        value={signupGradeNumber}
                        onChange={(e) => setSignupGradeNumber(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-800 bg-[#070a08] py-2 px-3 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                      >
                        {SUPPORTED_GRADES.map((g) => (
                          <option key={g} value={g} className="bg-[#0e1411]">
                            GRADE {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Choose Class */}
                    <div>
                      <span className="block text-[10px] font-mono text-slate-400 mb-1">Choose Class:</span>
                      <select
                        value={signupClassSection}
                        onChange={(e) => setSignupClassSection(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-800 bg-[#070a08] py-2 px-3 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                      >
                        {CLASS_SECTIONS.map((sec) => (
                          <option key={sec} value={sec} className="bg-[#0e1411]">
                            {signupGradeNumber}-{sec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    * Дэмжигдэх доод анги: Grade 6. Хадгалалт: grade = {signupGradeNumber}, classSection = {signupClassSection}.
                  </div>
                </div>

                {/* 4. Official Google Gmail */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono font-semibold text-slate-300">
                      Gmail Хаяг (@gmail.com)
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">Албан ёсны Google бүртгэл</span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="suragch@gmail.com"
                      required
                      className="w-full rounded-2xl border border-slate-800 bg-[#070a08] py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* 5. Password & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                      {isMn ? 'Нууц Үг (Password)' : 'Password'}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showSignupPass ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => {
                          setSignupPassword(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="Min 4 chars"
                        required
                        className="w-full rounded-2xl border border-slate-800 bg-[#070a08] py-2.5 pl-10 pr-11 font-mono text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPass(!showSignupPass)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-white"
                      >
                        {showSignupPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                      {isMn ? 'Утасны Дугаар (+976)' : 'Mongolian Phone'}
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="+976 9911 2233"
                        className="w-full rounded-2xl border border-slate-800 bg-[#070a08] py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar selection */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    {isMn ? 'Кибер Бэлгэдэл (Choose Avatar):' : 'Choose Cyber Avatar:'}
                  </label>
                  <div className="flex items-center gap-2">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSignupAvatar(emoji)}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border text-base transition-all ${
                          signupAvatar === emoji
                            ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-110'
                            : 'border-slate-800 bg-[#070a08] opacity-70 hover:opacity-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-[#070a08] shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] active:scale-[0.99]"
                  >
                    <span>{isMn ? 'Бүртгэл Үүсгээд Эхлэх' : 'Create Account & Begin Quest'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 text-center font-mono text-[10px] text-slate-400">
              <span>Tsonjin Cyber Boarding School · Academic Security 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
