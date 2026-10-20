import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Star,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Home,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import { Level, GameSettings, AnswerRecord } from '../types';
import { translations } from '../utils/i18n';
import { soundFx } from '../utils/sound';

interface LevelCompleteModalProps {
  level: Level;
  stats: {
    score: number;
    xpEarned: number;
    correctCount: number;
    totalQuestions: number;
    timeSpentSeconds: number;
    answersLog?: AnswerRecord[];
  };
  settings: GameSettings;
  isReplay?: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
  onMainMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  stats,
  settings,
  isReplay = false,
  onNextLevel,
  onRetry,
  onMainMenu,
}) => {
  const t = translations[settings.language];
  const isMn = settings.language === 'mn';
  const missedQuestions = (stats.answersLog || []).filter((r) => !r.isCorrect);

  // Auto-expand review if there are mistakes to ensure educational value
  const [showReview, setShowReview] = useState<boolean>(missedQuestions.length > 0);

  // Trigger confetti and victory fanfare on mount
  useEffect(() => {
    soundFx.complete(settings.soundEnabled);

    if (settings.animationsEnabled) {
      try {
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#F1F5F9', '#F59E0B'],
        });
      } catch {
        // ignore
      }
    }
  }, [settings.soundEnabled, settings.animationsEnabled]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const levelTitle = (isMn && level.titleMn) ? level.titleMn : level.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F0D]/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-8 w-full max-w-xl overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#131916] p-6 shadow-2xl sm:p-8 text-center max-h-[90vh] overflow-y-auto">
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* School Branding */}
        <div className="relative z-10 flex items-center justify-center gap-2 font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-400 uppercase">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>{t.schoolName}</span>
        </div>

        {/* Title */}
        <div className="relative z-10 mt-3">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t.levelComplete}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">
            LEVEL {String(level.id).padStart(2, '0')}: {levelTitle}
          </p>
        </div>

        {/* 4 Stat Cards in clean, soft grid */}
        <div className="relative z-10 my-6 grid grid-cols-2 gap-3 text-left">
          {/* Score */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F0D] p-4">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{t.scoreEarned}</span>
            </div>
            <div className="mt-1 text-2xl font-black font-mono text-white">
              {stats.score.toLocaleString()}
            </div>
          </div>

          {/* XP */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F0D] p-4">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{t.xpEarned}</span>
            </div>
            {isReplay ? (
              <div className="mt-1">
                <div className="text-2xl font-black font-mono text-slate-400">
                  +0 XP
                </div>
                <div className="text-[10px] text-amber-400 font-mono font-medium truncate">
                  {isMn ? 'Өмнө нь авсан (Давтан дасгал)' : 'Already claimed (Replay)'}
                </div>
              </div>
            ) : (
              <div className="mt-1 text-2xl font-black font-mono text-emerald-400">
                +{stats.xpEarned} XP
              </div>
            )}
          </div>

          {/* Correct Count */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F0D] p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{t.accuracy}</span>
            </div>
            <div className="mt-1 text-2xl font-black font-mono text-white">
              {stats.correctCount} / {stats.totalQuestions}
            </div>
          </div>

          {/* Time Elapsed */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F0D] p-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{t.timeElapsed}</span>
            </div>
            <div className="mt-1 text-2xl font-black font-mono text-white">
              {formatTime(stats.timeSpentSeconds)}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MISTAKE BREAKDOWN & REVIEW CARD                           */}
        {/* ========================================================= */}
        {missedQuestions.length > 0 ? (
          <div className="relative z-10 mb-6 rounded-2xl border border-amber-500/25 bg-[#171410] p-4 sm:p-5 text-left transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  {missedQuestions.length} {t.mistakesFound}
                </span>
              </div>

              <button
                onClick={() => {
                  soundFx.click(settings.soundEnabled);
                  setShowReview((prev) => !prev);
                }}
                className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>{showReview ? t.hideReview : t.reviewMistakes}</span>
                {showReview ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>

            {/* Expanded Detailed Breakdown with Explanatory Sentences */}
            {showReview && (
              <div className="mt-4 space-y-4 pt-3 border-t border-amber-900/30">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.retryExplanation}
                </p>

                {missedQuestions.map((record, idx) => {
                  const prompt = (isMn && record.questionPromptMn) ? record.questionPromptMn : record.questionPrompt;
                  const whyWrong = (isMn && record.whyWrongMn) ? record.whyWrongMn : record.whyWrong;
                  const explanation = (isMn && record.explanationMn) ? record.explanationMn : record.explanation;

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-800/90 bg-[#0B0F0D] p-4 space-y-3 text-xs"
                    >
                      <div className="font-bold text-white text-xs sm:text-sm leading-snug">
                        #{idx + 1}. {prompt}
                      </div>

                      {record.codeSnippet && (
                        <pre className="rounded-xl bg-[#131916] p-2.5 font-mono text-[11px] text-emerald-300 overflow-x-auto border border-slate-800/60">
                          {record.codeSnippet}
                        </pre>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="rounded-xl bg-rose-950/20 border border-rose-900/40 p-2.5 text-rose-300">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">
                            {t.yourChoice}
                          </span>
                          <span className="font-bold">{record.userAnswerText}</span>
                        </div>

                        <div className="rounded-xl bg-emerald-950/20 border border-emerald-900/40 p-2.5 text-emerald-300">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">
                            {t.correctSolution}
                          </span>
                          <span className="font-bold">{record.correctAnswerText}</span>
                        </div>
                      </div>

                      {/* Detailed Sentence: Why this was wrong */}
                      {whyWrong && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-950/15 p-3 text-slate-200">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 font-mono text-[11px]">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{t.whyWrongTitle}</span>
                          </span>
                          <p className="leading-relaxed text-xs text-slate-300">{whyWrong}</p>
                        </div>
                      )}

                      {/* Key Rule to Remember */}
                      <div className="rounded-xl border border-emerald-500/15 bg-emerald-950/10 p-3 text-slate-300 leading-relaxed text-xs">
                        <strong className="text-emerald-400 block font-mono text-[11px] mb-0.5">
                          {t.conceptRuleTitle}
                        </strong>
                        <p>{explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="relative z-10 mb-6 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{t.allCorrectMessage}</span>
          </div>
        )}

        {/* Action Buttons: NEXT LEVEL, RETRY, MAIN MENU */}
        <div className="relative z-10 space-y-2.5">
          {level.id < 12 ? (
            <button
              onClick={onNextLevel}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-[#0B0F0D] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-[0.98]"
            >
              <span>{t.nextLevel}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-bold text-amber-300">
              🎉 Congratulations! You have conquered the final Boss Challenge of Tsonjin Code Quest!
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <button
              onClick={onRetry}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-800 bg-[#0B0F0D] py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t.retry}</span>
            </button>

            <button
              onClick={onMainMenu}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-800 bg-[#0B0F0D] py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-white"
            >
              <Home className="h-3.5 w-3.5" />
              <span>{t.mainMenu}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
