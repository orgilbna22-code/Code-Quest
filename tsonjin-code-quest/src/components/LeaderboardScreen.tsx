import React from 'react';
import { Trophy, ArrowLeft, Award, Sparkles, User, Terminal } from 'lucide-react';
import { StudentProfile, GameSettings } from '../types';
import { storage } from '../utils/storage';
import { translations } from '../utils/i18n';

interface LeaderboardScreenProps {
  profile: StudentProfile;
  settings: GameSettings;
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  profile,
  settings,
  onBack,
}) => {
  const t = translations[settings.language];
  const list = storage.getLeaderboard(profile);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>BACK</span>
      </button>

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Terminal className="h-3.5 w-3.5" />
            <span>{t.schoolName}</span>
          </div>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
            CADET <span className="text-emerald-400">{t.leaderboard}</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {settings.language === 'mn' ? 'Нийт цуглуулсан оноогоор эрэмбэлэгдсэн сурагчдын жагсаалт' : 'Top Python coders ranked by total earned quest XP'}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-[#131916] px-4 py-2 text-xs font-mono text-slate-300">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span>Active Season: 2026 Q1</span>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-[#131916] shadow-xl">
        <div className="divide-y divide-slate-800/60">
          {list.map((cadet, index) => {
            const rank = index + 1;
            const isFirst = rank === 1;
            const isTopThree = rank <= 3;
            const isCurrent = cadet.isCurrentStudent;

            return (
              <div
                key={cadet.id}
                className={`flex items-center justify-between p-4 sm:px-6 transition-colors ${
                  isCurrent
                    ? 'border-l-4 border-l-emerald-400 bg-emerald-500/10'
                    : 'hover:bg-[#1A221E]/50'
                }`}
              >
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-4">
                  {/* Rank number badge */}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                      isFirst
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                        : rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : rank === 3
                        ? 'bg-amber-700/80 text-white'
                        : 'border border-slate-800/80 bg-[#0B0F0D] text-slate-400'
                    }`}
                  >
                    {rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm sm:text-base">
                        {cadet.name}
                      </span>
                      {cadet.username && (
                        <span className="text-xs font-mono text-emerald-400">
                          @{cadet.username}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="rounded bg-emerald-400 px-1.5 py-0.5 text-[10px] font-bold text-[#0B0F0D] uppercase font-mono">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Анги: {cadet.grade || '10-2'} • {cadet.completedCount} quests completed
                    </div>
                  </div>
                </div>

                {/* Right: Badge & XP */}
                <div className="flex items-center gap-4 text-right">
                  {cadet.badge && (
                    <span className="hidden sm:inline-block font-mono text-xs text-slate-400">
                      {cadet.badge}
                    </span>
                  )}
                  <div className="font-mono text-sm sm:text-base font-black text-emerald-400">
                    {cadet.xp.toLocaleString()} XP
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
