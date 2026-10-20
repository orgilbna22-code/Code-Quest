import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, Trophy, Zap, Sparkles } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/curriculum';
import { StudentProfile, GameSettings } from '../types';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';

interface AchievementsScreenProps {
  profile: StudentProfile;
  settings: GameSettings;
  onBack: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  profile,
  settings,
  onBack,
}) => {
  const isMn = settings.language === 'mn';
  const t = translations[settings.language];
  const [filter, setFilter] = useState<'ALL' | 'PYTHON' | 'CPP'>('ALL');

  const filteredAchievements = ACHIEVEMENTS.filter((ach) => {
    if (filter === 'CPP') return ach.id.startsWith('cpp_');
    if (filter === 'PYTHON') return !ach.id.startsWith('cpp_');
    return true;
  });

  const handleFilterChange = (f: 'ALL' | 'PYTHON' | 'CPP') => {
    soundFx.click(settings.soundEnabled);
    setFilter(f);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{isMn ? 'БУЦАХ' : 'BACK'}</span>
      </button>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>HONORS &</span> <span className="text-emerald-400">{t.achievements}</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {isMn
              ? 'Tsonjin Cyber Академи • Python & C++ сургалтын батламжууд'
              : 'Tsonjin Cyber Boarding School • Python & Modern C++ Badges'}
          </p>
        </div>

        {/* Total Badge Metric */}
        <div className="flex items-center gap-3">
          {/* Track Filter Tabs */}
          <div className="flex items-center bg-[#070c09] p-1 rounded-2xl border border-emerald-500/20 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleFilterChange('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === 'ALL'
                  ? 'bg-emerald-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('PYTHON')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                filter === 'PYTHON'
                  ? 'bg-emerald-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🐍</span>
              <span>Python</span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('CPP')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                filter === 'CPP'
                  ? 'bg-cyan-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚡</span>
              <span>C++</span>
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-[#131916] px-4 py-2 font-mono text-xs">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-white font-bold">{profile.unlockedAchievements.length}</span>
            <span className="text-slate-400">/ {ACHIEVEMENTS.length}</span>
          </div>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((ach) => {
          const isUnlocked = profile.unlockedAchievements.includes(ach.id);
          const isCpp = ach.id.startsWith('cpp_');

          return (
            <div
              key={ach.id}
              className={`flex flex-col justify-between rounded-3xl border p-5 transition-all ${
                isUnlocked
                  ? isCpp
                    ? 'border-cyan-500/30 bg-[#091414] shadow-[0_4px_20px_rgba(6,182,212,0.1)]'
                    : 'border-emerald-500/30 bg-[#131916] shadow-[0_4px_20px_rgba(16,185,129,0.08)]'
                  : 'border-slate-800/60 bg-[#0E1411]/50 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{ach.icon}</span>
                  {isUnlocked ? (
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold font-mono ${
                        isCpp
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Lock className="h-3 w-3" />
                      LOCKED
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {isCpp ? 'C++' : 'Python'}
                  </span>
                  <h3 className="text-base font-bold text-white">{ach.title}</h3>
                </div>

                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">REWARD</span>
                <span
                  className={`flex items-center gap-1 font-bold ${
                    isCpp ? 'text-cyan-400' : 'text-emerald-400'
                  }`}
                >
                  <Zap className="h-3 w-3 fill-current" />
                  +{ach.xpReward} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
