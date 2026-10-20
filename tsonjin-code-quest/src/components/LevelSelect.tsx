import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  Award,
  Zap,
  ArrowLeft,
  ShieldAlert,
  Search,
  Cpu,
  BarChart2,
  ArrowLeftRight,
  Sparkles,
} from 'lucide-react';
import { Level, StudentProfile, GameSettings } from '../types';
import { LEVELS } from '../data/curriculum';
import { CPP_LEVELS, CppLevel } from '../data/cppCurriculum';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';
import { SpatialCard3D } from './SpatialCard3D';
import { CppMemoryVisualizer } from './CppMemoryVisualizer';
import { CppAlgorithmVisualizer } from './CppAlgorithmVisualizer';
import { PythonVsCppComparison } from './PythonVsCppComparison';

interface LevelSelectProps {
  profile: StudentProfile;
  settings: GameSettings;
  onSelectLevel: (level: Level) => void;
  onSelectCppLevel: (cppLevel: CppLevel) => void;
  onBack: () => void;
  activeTrack?: 'python' | 'cpp';
  onToggleTrack?: (track: 'python' | 'cpp') => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  profile,
  settings,
  onSelectLevel,
  onSelectCppLevel,
  onBack,
  activeTrack = 'python',
  onToggleTrack,
}) => {
  const isMn = settings.language === 'mn';
  const t = translations[settings.language];

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStageFilter, setActiveStageFilter] = useState<string>('ALL');
  const [modalVisualizer, setModalVisualizer] = useState<'none' | 'memory' | 'algorithm' | 'comparison'>('none');

  const currentTrack = profile.activeTrack || activeTrack;

  // C++ Completed / Unlocked metrics
  const cppUnlocked = profile.cppUnlockedLevels || [101];
  const cppCompleted = profile.cppCompletedLevels || [];

  // Filter C++ levels
  const filteredCppLevels = CPP_LEVELS.filter((lvl) => {
    const matchesSearch =
      lvl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lvl.titleMn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lvl.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lvl.stageTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      activeStageFilter === 'ALL' || lvl.trackStage === activeStageFilter;

    return matchesSearch && matchesStage;
  });

  // Filter Python levels
  const filteredPythonLevels = LEVELS.filter((lvl) => {
    return (
      lvl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lvl.titleMn && lvl.titleMn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lvl.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handlePythonCardClick = (level: Level, isUnlocked: boolean) => {
    if (isUnlocked) {
      soundFx.click(settings.soundEnabled);
      onSelectLevel(level);
    } else {
      soundFx.error(settings.soundEnabled);
    }
  };

  const handleCppCardClick = (level: CppLevel, isUnlocked: boolean) => {
    if (isUnlocked) {
      soundFx.click(settings.soundEnabled);
      onSelectCppLevel(level);
    } else {
      soundFx.error(settings.soundEnabled);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-emerald-500/15 pb-6">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isMn ? 'ҮНДСЭН ЦЭС РҮҮ БУЦАХ' : 'BACK TO MENU'}</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>{isMn ? 'СУРГАЛТЫН ТҮВШИН СОНГОХ' : 'SELECT LEARNING TRACK'}</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentTrack === 'cpp' ? 'C++ TRACK' : 'PYTHON TRACK'}
            </span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Tsonjin Cyber Boarding School •{' '}
            {currentTrack === 'cpp'
              ? (isMn ? 'C++20: Анхан шатнаас Алгоритм, Архитектур хүртэл' : 'Modern C++20: Foundations to Advanced Algorithms & Projects')
              : (isMn ? '12 шатлалт Python интерактив сургалт' : '12 Progressive Interactive Python Quests')}
          </p>
        </div>

        {/* Course Switcher (Python ⇄ C++) */}
        <div className="flex flex-wrap items-center gap-3">
          {onToggleTrack && (
            <div className="flex items-center rounded-2xl border border-emerald-500/30 bg-[#101713] p-1 font-mono text-xs font-bold shadow-lg">
              <button
                type="button"
                onClick={() => onToggleTrack('python')}
                className={`rounded-xl px-4 py-2 transition-all flex items-center gap-2 ${
                  currentTrack === 'python'
                    ? 'bg-emerald-500 text-black shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🐍</span>
                <span>Python Track</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleTrack('cpp')}
                className={`rounded-xl px-4 py-2 transition-all flex items-center gap-2 ${
                  currentTrack === 'cpp'
                    ? 'bg-cyan-500 text-black shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡</span>
                <span>C++ Track</span>
              </button>
            </div>
          )}

          {/* Progress Pill */}
          <div className="rounded-2xl border border-slate-800 bg-[#131916] px-4 py-2 text-right font-mono text-xs">
            <div className="text-slate-400">{isMn ? 'Явц' : 'Track Progress'}</div>
            <div className="text-emerald-400 font-bold text-sm">
              {currentTrack === 'cpp'
                ? `${cppCompleted.length} / ${CPP_LEVELS.length} Completed`
                : `${profile.completedLevels.length} / ${LEVELS.length} Completed`}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Visualizer Shortcuts Bar for C++ */}
      {currentTrack === 'cpp' && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#090f0c] p-3 border border-emerald-500/20">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isMn ? 'Интерактив визуал лабораториуд:' : 'Interactive Visual Labs:'}</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setModalVisualizer('memory')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121c17] text-xs font-mono text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isMn ? '🧠 Санах ой & Pointer' : 'Memory & Pointers'}</span>
            </button>
            <button
              type="button"
              onClick={() => setModalVisualizer('algorithm')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121c17] text-xs font-mono text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
            >
              <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isMn ? '⚡ Алгоритм & Big-O' : 'Algorithms & Big-O'}</span>
            </button>
            <button
              type="button"
              onClick={() => setModalVisualizer('comparison')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121c17] text-xs font-mono text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-amber-400" />
              <span>{isMn ? '🔄 Python vs C++' : 'Python vs C++'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Popup for Visualizer if Opened from Header */}
      {modalVisualizer !== 'none' && (
        <div className="relative animate-in fade-in zoom-in-95">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setModalVisualizer('none')}
              className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded-lg"
            >
              ✕ {isMn ? 'Хаах' : 'Close Lab'}
            </button>
          </div>
          {modalVisualizer === 'memory' && <CppMemoryVisualizer language={settings.language} />}
          {modalVisualizer === 'algorithm' && <CppAlgorithmVisualizer language={settings.language} />}
          {modalVisualizer === 'comparison' && <PythonVsCppComparison language={settings.language} />}
        </div>
      )}

      {/* Search and Stage Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              currentTrack === 'cpp'
                ? (isMn ? 'C++ сэдэв хайх (pointer, vector, oop, loop...)' : 'Search C++ topics (pointer, vector, oop, loop...)')
                : (isMn ? 'Python сэдэв хайх...' : 'Search Python quests...')
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0a0f0c] border border-emerald-500/20 text-xs font-mono text-emerald-300 outline-none focus:border-emerald-500/60 transition-colors"
          />
        </div>

        {/* C++ Stage Filters: 6 Progressive Stages */}
        {currentTrack === 'cpp' && (
          <div className="flex flex-wrap gap-1 bg-[#0a0f0c] p-1 rounded-2xl border border-emerald-500/20 text-xs font-mono">
            {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROJECTS', 'ALGORITHMS', 'PROBLEM_SOLVING'].map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setActiveStageFilter(stage)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeStageFilter === stage
                    ? 'bg-emerald-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {stage === 'PROBLEM_SOLVING' ? (isMn ? 'БОДЛОГО' : 'PROBLEM SOLVING') : stage}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TRACK VIEW: C++ MODULES & LEVELS */}
      {currentTrack === 'cpp' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCppLevels.map((lvl) => {
            const isUnlocked = cppUnlocked.includes(lvl.id);
            const isCompleted = cppCompleted.includes(lvl.id);

            return (
              <SpatialCard3D
                key={lvl.id}
                intensity={isUnlocked ? 6 : 0}
                glare={isUnlocked}
                onClick={() => handleCppCardClick(lvl, isUnlocked)}
              >
                <div
                  className={`group relative flex h-full flex-col justify-between rounded-3xl border p-6 transition-all duration-200 backdrop-blur-xl ${
                    isUnlocked
                      ? 'border-emerald-500/30 bg-[#101713]/90 hover:border-emerald-400 hover:shadow-[0_15px_35px_rgba(16,185,129,0.15)] cursor-pointer'
                      : 'border-slate-800/60 bg-[#090d0b]/80 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div>
                    {/* Top Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                        {isMn ? lvl.stageTitleMn : lvl.stageTitle}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : isUnlocked ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          READY
                        </span>
                      ) : (
                        <Lock className="h-4 w-4 text-slate-600" />
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{lvl.icon}</span>
                      <h3 className="font-bold text-sm text-white leading-snug">
                        {isMn ? lvl.titleMn : lvl.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {isMn ? lvl.summaryMn : lvl.summary}
                    </p>
                  </div>

                  {/* Bottom Stats */}
                  <div className="mt-5 pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Reward:</span>
                    <span className="text-emerald-400 font-bold">+{lvl.xpReward} XP</span>
                  </div>
                </div>
              </SpatialCard3D>
            );
          })}
        </div>
      ) : (
        /* TRACK VIEW: PYTHON LEVELS */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPythonLevels.map((level) => {
            const isUnlocked = profile.unlockedLevels.includes(level.id);
            const isCompleted = profile.completedLevels.includes(level.id);
            const isBoss = level.isBoss;

            return (
              <SpatialCard3D
                key={level.id}
                intensity={isUnlocked ? 6 : 0}
                glare={isUnlocked}
                onClick={() => handlePythonCardClick(level, isUnlocked)}
              >
                <div
                  className={`group relative flex h-full flex-col justify-between rounded-3xl border p-6 transition-all duration-200 backdrop-blur-xl ${
                    isUnlocked
                      ? isBoss
                        ? 'border-amber-500/50 bg-[#16120b]/90 hover:border-amber-400 hover:shadow-[0_15px_35px_rgba(245,158,11,0.15)] cursor-pointer'
                        : 'border-emerald-500/30 bg-[#101713]/90 hover:border-emerald-400 hover:shadow-[0_15px_35px_rgba(16,185,129,0.15)] cursor-pointer'
                      : 'border-slate-800/60 bg-[#090d0b]/80 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                        Level {String(level.id).padStart(2, '0')}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : isUnlocked ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {isBoss ? 'BOSS' : 'READY'}
                        </span>
                      ) : (
                        <Lock className="h-4 w-4 text-slate-600" />
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{isBoss ? '👑' : '🐍'}</span>
                      <h3 className="font-bold text-sm text-white leading-snug">
                        {isMn && level.titleMn ? level.titleMn : level.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {isMn && level.descriptionMn ? level.descriptionMn : level.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-emerald-500/15 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Reward:</span>
                    <span className="text-emerald-400 font-bold">+{level.xpReward} XP</span>
                  </div>
                </div>
              </SpatialCard3D>
            );
          })}
        </div>
      )}
    </div>
  );
};
