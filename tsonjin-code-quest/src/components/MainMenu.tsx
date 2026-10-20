import React from 'react';
import { Play, Grid, Trophy, User, Sliders, LogOut, Code, Terminal, Sparkles, Globe, BookOpen, Cpu, Zap } from 'lucide-react';
import { ScreenState, GameSettings, StudentProfile } from '../types';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';
import { storage } from '../utils/storage';
import { SpatialCard3D } from './SpatialCard3D';

interface MainMenuProps {
  setScreen: (screen: ScreenState) => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  profile: StudentProfile;
  startPlaying: () => void;
  startCppPlaying?: () => void;
  activeTrack?: 'python' | 'cpp';
  onToggleTrack?: (track: 'python' | 'cpp') => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  setScreen,
  settings,
  setSettings,
  profile,
  startPlaying,
  startCppPlaying,
  activeTrack = 'python',
  onToggleTrack,
}) => {
  const isMn = settings.language === 'mn';
  const t = translations[settings.language];
  const currentTrack = profile.activeTrack || activeTrack;

  const handleAction = (action: () => void) => {
    soundFx.click(settings.soundEnabled);
    action();
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
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-between px-3 py-6 text-center sm:px-6 w-full max-w-full overflow-hidden">
      {/* Top Branding Section with 3D Holographic Aura */}
      <div className="relative z-10 flex flex-col items-center pt-2 max-w-full">
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-400/10 to-transparent blur-[80px] animate-pulse" />
        <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 h-44 w-44 rounded-full border border-emerald-500/20 [animation:spin_25s_linear_infinite]" />
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full border border-dashed border-emerald-500/10 [animation:spin_40s_linear_infinite_reverse]" />

        {/* School Name Badge */}
        <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-500/25 bg-[#0e1411]/85 px-4 py-1.5 text-center shadow-lg backdrop-blur-xl">
          <Terminal className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-400 uppercase truncate">
            {t.schoolName}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[10px] font-mono text-emerald-300">2026</span>
        </div>

        {/* Main Title */}
        <h1 className="relative text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl max-w-3xl break-words px-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          TSONJIN{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
            CODE QUEST
          </span>
        </h1>

        <p className="mt-3 max-w-lg text-sm sm:text-base text-slate-300 font-medium px-4 leading-relaxed">
          “{t.subtitle}”
        </p>

        {/* Dual Language & Track Switchers */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-2xl border border-slate-800/80 bg-[#070a08]/90 p-1 font-mono text-xs shadow-md backdrop-blur-xl">
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-bold transition-all ${
                settings.language === 'en'
                  ? 'bg-emerald-500 text-[#070a08] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇬🇧 English</span>
            </button>
            <button
              onClick={() => setLanguage('mn')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-bold transition-all ${
                settings.language === 'mn'
                  ? 'bg-emerald-500 text-[#070a08] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇲🇳 Монгол</span>
            </button>
          </div>

          {/* Track Switcher */}
          {onToggleTrack && (
            <div className="flex items-center rounded-2xl border border-emerald-500/25 bg-[#070a08]/90 p-1 font-mono text-xs shadow-md">
              <button
                onClick={() => onToggleTrack('python')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
                  currentTrack === 'python'
                    ? 'bg-emerald-500 text-[#070a08] shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🐍 Python</span>
              </button>
              <button
                onClick={() => onToggleTrack('cpp')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
                  currentTrack === 'cpp'
                    ? 'bg-cyan-500 text-[#070a08] shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡ C++</span>
              </button>
            </div>
          )}
        </div>

        {/* Active Student Status */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 font-mono">
          <span>{t.cadet}: <strong className="text-white">{profile.name}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Python Lvl: <strong className="text-emerald-400">{profile.completedLevels.length || 1}</strong></span>
          <span className="text-slate-600">•</span>
          <span>C++ Lvl: <strong className="text-cyan-400">{(profile.cppCompletedLevels || []).length || 1}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Total XP: <strong className="text-emerald-400">{(profile.totalXp + (profile.cppXp || 0)).toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Main Menu Buttons Container with 3D Spatial Tilt */}
      <div className="relative z-10 my-6 w-full max-w-md px-2">
        <SpatialCard3D intensity={5} glare={true}>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-[#0e1411]/85 p-3.5 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl space-y-2.5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {/* 1. PLAY BUTTON (Context-aware: Python or C++) */}
            {currentTrack === 'cpp' ? (
              <button
                onClick={() => handleAction(startCppPlaying || startPlaying)}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-cyan-400 px-5 py-3.5 text-left font-bold text-[#070a08] shadow-[0_0_24px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#070a08]/15">
                    <Zap className="h-5 w-5 fill-current text-[#070a08]" />
                  </div>
                  <div>
                    <div className="text-base tracking-wide font-extrabold uppercase">
                      1. {isMn ? 'C++ СУРГАЛТ ЭХЛЭХ' : 'START C++ TRACK'}
                    </div>
                    <div className="text-xs font-medium text-[#070a08]/80">
                      6 Progressive Stages · C++20
                    </div>
                  </div>
                </div>
                <Sparkles className="h-5 w-5 opacity-70 transition-transform group-hover:rotate-12" />
              </button>
            ) : (
              <button
                onClick={() => handleAction(startPlaying)}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-emerald-500 px-5 py-3.5 text-left font-bold text-[#070a08] shadow-[0_0_24px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#070a08]/15">
                    <Play className="h-5 w-5 fill-current text-[#070a08]" />
                  </div>
                  <div>
                    <div className="text-base tracking-wide font-extrabold uppercase">1. {t.play}</div>
                    <div className="text-xs font-medium text-[#070a08]/80">
                      {t.resumeLevel} {profile.currentLevel}
                    </div>
                  </div>
                </div>
                <Sparkles className="h-5 w-5 opacity-70 transition-transform group-hover:rotate-12" />
              </button>
            )}

            {/* CYBER DOSSIER & ORIENTATION */}
            <button
              onClick={() => handleAction(() => setScreen('ORIENTATION'))}
              className="group relative flex w-full items-center justify-between rounded-2xl border border-emerald-500/25 bg-[#070a08]/80 px-5 py-3 text-left font-semibold text-white transition-all hover:border-emerald-500/50 hover:bg-[#121814] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/25 bg-[#0e1411] text-emerald-400">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wide uppercase text-emerald-300">
                    {t.orientationBtn}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isMn ? 'Сургуулийн зорилго ба Хөтөлбөр' : 'Academy Dossier & Curriculum'}
                  </div>
                </div>
              </div>
              <span className="rounded-xl bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/20">
                +50 XP
              </span>
            </button>

            {/* EXPANDABLE COURSE CATALOG */}
            <button
              onClick={() => handleAction(() => setScreen('COURSES'))}
              className="group relative flex w-full items-center justify-between rounded-2xl border border-emerald-500/25 bg-[#070a08]/80 px-5 py-3 text-left font-semibold text-white transition-all hover:border-emerald-500/50 hover:bg-[#121814] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/25 bg-[#0e1411] text-emerald-400">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wide uppercase text-white">
                    {isMn ? 'ХИЧЭЭЛИЙН КАТАЛОГ' : 'COURSE CATALOG'}
                  </div>
                  <div className="text-xs text-slate-400">
                    Grade {profile.gradeNumber || 10}+ · Python, C++, Web, AI, SQL
                  </div>
                </div>
              </div>
              <span className="rounded-xl bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/20">
                10 Tracks
              </span>
            </button>

            {/* 2. LEVELS / MODULES */}
            <button
              onClick={() => handleAction(() => setScreen('LEVELS'))}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-[#070a08]/80 px-5 py-3 text-left font-semibold text-white transition-all hover:border-emerald-500/40 hover:bg-[#121814] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-[#0e1411] text-emerald-400">
                  <Grid className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wide uppercase">2. {t.levels}</div>
                  <div className="text-xs text-slate-400">
                    {currentTrack === 'cpp' ? '6 Progressive Stages' : '12 Modules'}
                  </div>
                </div>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-semibold">
                {currentTrack === 'cpp'
                  ? `${(profile.cppCompletedLevels || []).length} Cleared`
                  : `${profile.completedLevels.length}/12`}
              </span>
            </button>

            {/* 3. LEADERBOARD */}
            <button
              onClick={() => handleAction(() => setScreen('LEADERBOARD'))}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-[#070a08]/80 px-5 py-3 text-left font-semibold text-white transition-all hover:border-emerald-500/40 hover:bg-[#121814] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-[#0e1411] text-emerald-400">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wide uppercase">3. {t.leaderboard}</div>
                  <div className="text-xs text-slate-400">School Rankings</div>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-400">Top Cadets</span>
            </button>

            {/* 4. PROFILE */}
            <button
              onClick={() => handleAction(() => setScreen('PROFILE'))}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-[#070a08]/80 px-5 py-3 text-left font-semibold text-white transition-all hover:border-emerald-500/40 hover:bg-[#121814] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-[#0e1411] text-emerald-400">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wide uppercase">4. {t.profile}</div>
                  <div className="text-xs text-slate-400">Python & C++ Stats</div>
                </div>
              </div>
              <span className="font-mono text-xs text-slate-400">
                {profile.unlockedAchievements.length} Badges
              </span>
            </button>

            {/* 5. SETTINGS */}
            <button
              onClick={() => handleAction(() => setScreen('SETTINGS'))}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-800/80 bg-[#070a08]/80 px-5 py-3 text-left font-semibold text-white transition-all hover:border-emerald-500/40 hover:bg-[#121814] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-[#0e1411] text-emerald-400">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wide uppercase">5. {t.settings}</div>
                  <div className="text-xs text-slate-400">Audio & Options</div>
                </div>
              </div>
              <span className="font-mono text-xs uppercase text-emerald-400 font-semibold">
                {settings.language.toUpperCase()}
              </span>
            </button>
          </div>
        </SpatialCard3D>
      </div>
    </div>
  );
};
