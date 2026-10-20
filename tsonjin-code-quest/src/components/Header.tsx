import React from 'react';
import { Volume2, VolumeX, Flame, Award, Sliders, MonitorDown, Shield } from 'lucide-react';
import { StudentProfile, GameSettings, ScreenState } from '../types';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';
import { storage } from '../utils/storage';

interface HeaderProps {
  screen: ScreenState;
  setScreen: (screen: ScreenState) => void;
  profile: StudentProfile;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onOpenAdmin: () => void;
  activeTrack?: 'python' | 'cpp';
  onToggleTrack?: (track: 'python' | 'cpp') => void;
}

export const Header: React.FC<HeaderProps> = ({
  screen,
  setScreen,
  profile,
  settings,
  setSettings,
  onOpenAdmin,
  activeTrack = 'python',
  onToggleTrack,
}) => {
  const t = translations[settings.language];

  const handleNav = (target: ScreenState) => {
    soundFx.click(settings.soundEnabled);
    setScreen(target);
  };

  const toggleSound = () => {
    setSettings((prev) => {
      const next = !prev.soundEnabled;
      soundFx.click(next);
      const updated = { ...prev, soundEnabled: next };
      storage.saveSettings(updated);
      return updated;
    });
  };

  const setLanguage = (lang: 'en' | 'mn') => {
    soundFx.click(settings.soundEnabled);
    setSettings((prev) => {
      const updated = { ...prev, language: lang };
      storage.saveSettings(updated);
      return updated;
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/15 bg-[#0B0F0D]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        {/* Zone 1: Brand Title with Overflow Protection */}
        <button
          onClick={() => handleNav('MAIN_MENU')}
          className="flex min-w-0 max-w-[200px] sm:max-w-xs md:max-w-sm items-center gap-2.5 text-left transition-opacity hover:opacity-90 shrink-0"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-[#131916] text-emerald-400">
            <span className="font-mono text-xs font-bold tracking-wider">TC</span>
          </div>
          <div className="flex min-w-0 flex-col leading-tight overflow-hidden">
            <span className="truncate text-[10px] sm:text-xs font-semibold tracking-wider text-emerald-400 uppercase font-mono">
              {t.shortSchoolName || 'TSONJIN CYBER'}
            </span>
            <span className="truncate text-xs sm:text-sm font-bold tracking-tight text-white">
              {t.gameTitle}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-300 shrink-0">
          <button
            onClick={() => handleNav('DASHBOARD')}
            className={`transition-colors hover:text-emerald-400 whitespace-nowrap ${screen === 'DASHBOARD' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            {t.dashboard}
          </button>
          <button
            onClick={() => handleNav('COURSES')}
            className={`transition-colors hover:text-emerald-400 whitespace-nowrap ${screen === 'COURSES' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            {settings.language === 'mn' ? 'ХИЧЭЭЛҮҮД' : 'COURSES'}
          </button>
          <button
            onClick={() => handleNav('LEVELS')}
            className={`transition-colors hover:text-emerald-400 whitespace-nowrap ${screen === 'LEVELS' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            {t.levels}
          </button>
          <button
            onClick={() => handleNav('ORIENTATION')}
            className={`transition-colors hover:text-emerald-400 whitespace-nowrap ${screen === 'ORIENTATION' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            {settings.language === 'mn' ? 'ТАНИЛЦУУЛГА & ТҮҮХ' : 'DOSSIER'}
          </button>
          <button
            onClick={() => handleNav('LEADERBOARD')}
            className={`transition-colors hover:text-emerald-400 whitespace-nowrap ${screen === 'LEADERBOARD' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            {t.leaderboard}
          </button>
          <button
            onClick={() => handleNav('ACHIEVEMENTS')}
            className={`transition-colors hover:text-emerald-400 whitespace-nowrap ${screen === 'ACHIEVEMENTS' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            {t.achievements}
          </button>
          <button
            onClick={() => handleNav('PROFILE')}
            className={`transition-colors hover:text-emerald-400 whitespace-nowrap ${screen === 'PROFILE' ? 'text-emerald-400 font-semibold' : ''}`}
          >
            {t.profile}
          </button>
        </nav>

        {/* Zone 3: Primary Actions, Course Switcher & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Prominent Course Switcher (Python ⇄ C++) */}
          {onToggleTrack && (
            <div className="flex items-center rounded-xl border border-emerald-500/25 bg-[#101713] p-0.5 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => onToggleTrack('python')}
                className={`rounded-lg px-2.5 py-1 transition-all flex items-center gap-1 ${
                  activeTrack === 'python'
                    ? 'bg-emerald-500 text-black shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Python Track"
              >
                <span>🐍</span>
                <span className="hidden sm:inline">Python</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleTrack('cpp')}
                className={`rounded-lg px-2.5 py-1 transition-all flex items-center gap-1 ${
                  activeTrack === 'cpp'
                    ? 'bg-cyan-500 text-black shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to C++ Track"
              >
                <span>⚡</span>
                <span className="hidden sm:inline">C++</span>
              </button>
            </div>
          )}

          {/* Prominent Language Switcher (EN / MN) */}
          <div className="flex items-center rounded-xl border border-emerald-500/20 bg-[#131916] p-0.5 font-mono text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-lg px-2 py-1 transition-all ${
                settings.language === 'en'
                  ? 'bg-emerald-500 text-[#0B0F0D] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('mn')}
              className={`rounded-lg px-2 py-1 transition-all ${
                settings.language === 'mn'
                  ? 'bg-emerald-500 text-[#0B0F0D] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Монгол хэл сонгох"
            >
              MN
            </button>
          </div>

          {/* Streak indicator */}
          <div className="hidden sm:flex items-center gap-1 rounded-xl border border-amber-500/20 bg-[#131916] px-2.5 py-1 text-xs text-amber-300">
            <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
            <span className="font-mono font-semibold">{profile.streakDays}d</span>
          </div>

          {/* XP counter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-[#131916] px-3 py-1 text-xs font-semibold text-emerald-400">
            <Award className="h-3.5 w-3.5" />
            <span className="font-mono tracking-tight">{profile.totalXp.toLocaleString()} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800/80 bg-[#131916] text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
          >
            {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
          </button>

          {/* Current Student & Switch Account */}
          <button
            onClick={() => handleNav('LOGIN')}
            title={`Нэвтэрсэн: ${profile.name} (@${profile.username || 'orgil'}) • Анги: ${profile.grade || '10-2'}. Данс солих бол энд дарна уу.`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800/80 bg-[#131916] px-2.5 py-1 text-xs text-slate-300 hover:border-emerald-500/50 hover:text-white transition-colors"
          >
            <span className="text-xs">{profile.avatar || '⚡'}</span>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="max-w-[85px] truncate font-bold text-white text-[11px]">{profile.name}</span>
              <span className="text-[9px] font-mono text-emerald-400">@{profile.username || 'orgil'} · {profile.grade || '10-2'}</span>
            </div>
          </button>

          {/* Settings button */}
          <button
            onClick={() => handleNav('SETTINGS')}
            aria-label="Settings"
            className={`flex h-8 w-8 items-center justify-center rounded-xl border bg-[#131916] transition-colors ${
              screen === 'SETTINGS'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-slate-800/80 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400'
            }`}
          >
            <Sliders className="h-4 w-4" />
          </button>

          {/* Developer Admin Console Button */}
          <button
            onClick={onOpenAdmin}
            aria-label="Admin Portal"
            title="Developer Admin Console (Orgil)"
            className={`flex h-8 items-center gap-1.5 px-2.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
              screen === 'ADMIN_PANEL'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                : 'border-slate-800/80 bg-[#131916] text-slate-400 hover:border-emerald-500/50 hover:text-emerald-300'
            }`}
          >
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">ADMIN</span>
          </button>
        </div>
      </div>
    </header>
  );
};
