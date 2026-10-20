import React from 'react';
import {
  ArrowRight,
  Flame,
  Award,
  CheckCircle2,
  Trophy,
  BookOpen,
  Sparkles,
  Terminal,
  Cpu,
  BarChart2,
  ArrowLeftRight,
  Zap,
} from 'lucide-react';
import { StudentProfile, GameSettings, Level } from '../types';
import { LEVELS } from '../data/curriculum';
import { CPP_LEVELS, CppLevel } from '../data/cppCurriculum';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';
import { SpatialCard3D } from './SpatialCard3D';
import { CyberSpatialCore3D } from './CyberSpatialCore3D';

interface DashboardProps {
  profile: StudentProfile;
  settings: GameSettings;
  onContinue: () => void;
  onSelectLevel: (lvl: Level) => void;
  onSelectCppLevel?: (cppLvl: CppLevel) => void;
  onViewAchievements: () => void;
  onViewLeaderboard: () => void;
  onOpenOrientation?: () => void;
  activeTrack?: 'python' | 'cpp';
  onToggleTrack?: (track: 'python' | 'cpp') => void;
  onOpenVisualizer?: (type: 'memory' | 'algorithm' | 'comparison') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  settings,
  onContinue,
  onSelectLevel,
  onSelectCppLevel,
  onViewAchievements,
  onViewLeaderboard,
  onOpenOrientation,
  activeTrack = 'python',
  onToggleTrack,
  onOpenVisualizer,
}) => {
  const isMn = settings.language === 'mn';
  const t = translations[settings.language];
  const currentTrack = profile.activeTrack || activeTrack;

  // Python active level & progress
  const activePythonLevel = LEVELS.find((l) => l.id === profile.currentLevel) || LEVELS[0];
  const pythonProgressPercent = Math.round((profile.completedLevels.length / LEVELS.length) * 100);

  // C++ active level & progress
  const activeCppLevel =
    CPP_LEVELS.find((l) => l.id === (profile.cppCurrentLevel || 101)) || CPP_LEVELS[0];
  const cppCompletedCount = (profile.cppCompletedLevels || []).length;
  const cppProgressPercent = Math.round((cppCompletedCount / CPP_LEVELS.length) * 100);

  const isCpp = currentTrack === 'cpp';

  const handleContinue = () => {
    soundFx.click(settings.soundEnabled);
    if (isCpp && onSelectCppLevel) {
      onSelectCppLevel(activeCppLevel);
    } else {
      onContinue();
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Welcome Section & Course Track Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/15 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase font-mono">
            <Terminal className="h-3.5 w-3.5 shrink-0" />
            <span>{t.schoolName}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">GRADE {profile.grade || '10-2'}</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl flex items-center gap-2">
            <span>{t.goodMorning} <span className="text-emerald-400">{profile.name}</span></span>
            <span className="text-sm font-mono text-slate-400 font-normal">(@{profile.username || 'orgil'})</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {isMn
              ? `Цонжин Кибер Сургууль · Анги: ${profile.grade || '10-2'} · ${isCpp ? 'Modern C++20' : 'Python'} сургалтын танхим.`
              : `Tsonjin Cyber Academy · Grade ${profile.grade || '10-2'} · ${isCpp ? 'Modern C++20' : 'Python'} learning track.`}
          </p>
        </div>

        {/* Track Switcher Button */}
        {onToggleTrack && (
          <div className="flex items-center rounded-2xl border border-emerald-500/25 bg-[#0e1612] p-1 font-mono text-xs font-bold shadow-lg shrink-0">
            <button
              type="button"
              onClick={() => onToggleTrack('python')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                !isCpp
                  ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🐍</span>
              <span>Python Track</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleTrack('cpp')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
                isCpp
                  ? 'bg-cyan-500 text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚡</span>
              <span>C++ Track</span>
            </button>
          </div>
        )}
      </div>

      {/* Hero Section: Primary Highlight Card & 3D Spatial Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Primary Highlight Card (Continue Learning) wrapped in SpatialCard3D */}
        <div className="lg:col-span-7 flex flex-col">
          <SpatialCard3D intensity={6} className="h-full">
            <div
              className={`relative h-full flex flex-col justify-between overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ${
                isCpp
                  ? 'border-cyan-500/30 bg-gradient-to-b from-[#0e1a17]/95 via-[#081210]/95 to-[#050b09]'
                  : 'border-emerald-500/25 bg-gradient-to-b from-[#131b17]/90 via-[#0e1411]/95 to-[#080c09]'
              }`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div
                className={`absolute top-0 right-0 h-44 w-44 rounded-full blur-3xl pointer-events-none ${
                  isCpp ? 'bg-cyan-500/15' : 'bg-emerald-500/10'
                }`}
              />

              <div className="relative z-10">
                <div
                  className={`flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase ${
                    isCpp ? 'text-cyan-400' : 'text-emerald-400'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {isCpp ? (isMn ? 'C++ ҮРГЭЛЖЛҮҮЛЭХ' : 'CONTINUE C++ QUEST') : t.continueLearning}
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl leading-snug">
                  {isCpp ? (
                    <>
                      {activeCppLevel.icon} {isMn ? activeCppLevel.titleMn : activeCppLevel.title}
                    </>
                  ) : (
                    <>
                      LEVEL {String(activePythonLevel.id).padStart(2, '0')}:{' '}
                      {isMn && activePythonLevel.titleMn ? activePythonLevel.titleMn : activePythonLevel.title}
                    </>
                  )}
                </h3>

                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {isCpp
                    ? isMn
                      ? activeCppLevel.summaryMn
                      : activeCppLevel.summary
                    : isMn && activePythonLevel.descriptionMn
                    ? activePythonLevel.descriptionMn
                    : activePythonLevel.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80">
                {/* Clean Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                    <span>
                      {isCpp ? (isMn ? 'C++ Хөтөлбөрийн биелэлт' : 'C++ Track Progress') : 'Curriculum Completion'}
                    </span>
                    <span className={isCpp ? 'text-cyan-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {isCpp ? cppProgressPercent : pythonProgressPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#070a08]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCpp
                          ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${Math.max(isCpp ? cppProgressPercent : pythonProgressPercent, 6)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="text-[11px] font-mono text-slate-400">
                    +{isCpp ? activeCppLevel.xpReward : activePythonLevel.xpReward} XP Reward ·{' '}
                    {isCpp ? `${activeCppLevel.trackStage}` : `${activePythonLevel.questions.length} Challenges`}
                  </div>
                  <button
                    type="button"
                    onClick={handleContinue}
                    className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-[#070a08] transition-all active:scale-[0.98] ${
                      isCpp
                        ? 'bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                        : 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                    }`}
                  >
                    <span>{t.continueLearning}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </SpatialCard3D>
        </div>

        {/* Right: Interactive 3D Spatial Core Widget */}
        <div className="lg:col-span-5 flex flex-col">
          <CyberSpatialCore3D className="h-full" interactive={true} />
        </div>
      </div>

      {/* C++ INTERACTIVE LABS SHOWCASE (Available to test anytime!) */}
      <div className="rounded-3xl border border-emerald-500/20 bg-[#0e1612]/90 p-6 backdrop-blur-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/15 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              {isMn ? 'C++ Интерактив Лаборатори ба Визуал багажууд' : 'C++ Interactive Labs & Visualizers'}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            3 ACTIVE LABS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onOpenVisualizer?.('memory')}
            className="flex flex-col justify-between p-4 rounded-2xl border border-emerald-500/20 bg-[#080e0b] hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-left"
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Cpu className="h-5 w-5" />
                <span className="font-bold text-sm text-white font-mono">Pointers & Memory</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isMn
                  ? 'RAM хаяг, заагч (* &) болон Stack vs Heap санах ойн бодит хөдөлгөөнт загварчлал.'
                  : 'Interactive memory addresses, pointer dereferencing, and Stack vs Heap dynamics.'}
              </p>
            </div>
            <div className="mt-3 text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span>{isMn ? 'Нээх' : 'Launch Lab'} →</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenVisualizer?.('algorithm')}
            className="flex flex-col justify-between p-4 rounded-2xl border border-cyan-500/20 bg-[#080e0b] hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-left"
          >
            <div>
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <BarChart2 className="h-5 w-5" />
                <span className="font-bold text-sm text-white font-mono">Binary Search & Big-O</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isMn
                  ? 'Хоёртын хайлтыг алхам алхмаар туршиж, O(log N) хурдыг график дээр харах.'
                  : 'Step-by-step Binary Search animation and Big-O computational growth curves.'}
              </p>
            </div>
            <div className="mt-3 text-[11px] font-mono text-cyan-400 font-bold flex items-center gap-1">
              <span>{isMn ? 'Нээх' : 'Launch Lab'} →</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenVisualizer?.('comparison')}
            className="flex flex-col justify-between p-4 rounded-2xl border border-amber-500/20 bg-[#080e0b] hover:border-amber-500/50 hover:bg-amber-500/10 transition-all text-left"
          >
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <ArrowLeftRight className="h-5 w-5" />
                <span className="font-bold text-sm text-white font-mono">Python vs C++</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isMn
                  ? 'Зэрэгцүүлсэн код болон хэл тус бүрийн онцлог, хэзээ алийг нь сонгох тухай тайлбар.'
                  : 'Side-by-side code syntax and architectural trade-offs between both languages.'}
              </p>
            </div>
            <div className="mt-3 text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
              <span>{isMn ? 'Нээх' : 'Launch Lab'} →</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4 Key Stat Cards with Spatial 3D Tilt */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
        {/* XP Card */}
        <SpatialCard3D intensity={8}>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0e1411]/80 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">
                {isCpp ? 'C++ XP' : t.xp}
              </span>
              <Award className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold font-mono text-white sm:text-3xl">
                {isCpp ? (profile.cppXp || 0).toLocaleString() : profile.totalXp.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-400">Total earned XP</div>
            </div>
          </div>
        </SpatialCard3D>

        {/* STREAK Card */}
        <SpatialCard3D intensity={8}>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0e1411]/80 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">
                {t.streak}
              </span>
              <Flame className="h-4 w-4 text-amber-400 fill-amber-400/20" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold font-mono text-white sm:text-3xl">
                {profile.streakDays} DAYS
              </div>
              <div className="mt-1 text-xs text-slate-400">Continuous study</div>
            </div>
          </div>
        </SpatialCard3D>

        {/* LEVEL Card */}
        <SpatialCard3D intensity={8}>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0e1411]/80 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">
                {isCpp ? 'C++ STAGE' : t.level}
              </span>
              <BookOpen className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold font-mono text-emerald-400 sm:text-3xl truncate">
                {isCpp ? activeCppLevel.trackStage : `LVL ${String(profile.currentLevel).padStart(2, '0')}`}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {isCpp ? `${cppCompletedCount} / ${CPP_LEVELS.length} cleared` : 'Current mission'}
              </div>
            </div>
          </div>
        </SpatialCard3D>

        {/* ACHIEVEMENTS Card */}
        <SpatialCard3D intensity={8}>
          <button
            type="button"
            onClick={onViewAchievements}
            className="flex h-full w-full flex-col justify-between rounded-3xl border border-slate-800/80 bg-[#0e1411]/80 p-5 text-left backdrop-blur-xl transition-colors hover:border-emerald-500/40"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">
                {t.achievements}
              </span>
              <Trophy className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-extrabold font-mono text-white sm:text-3xl">
                {profile.unlockedAchievements.length} Badges
              </div>
              <div className="mt-1 text-xs text-slate-400">Honors unlocked</div>
            </div>
          </button>
        </SpatialCard3D>
      </div>
    </div>
  );
};
