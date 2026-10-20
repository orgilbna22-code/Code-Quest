import React, { useState } from 'react';
import {
  ArrowLeft,
  Terminal,
  Cpu,
  Sparkles,
  HelpCircle,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Layers,
  ArrowLeftRight,
} from 'lucide-react';
import { CppLevel, CppExercise } from '../data/cppCurriculum';
import { GameSettings, AnswerRecord } from '../types';
import { executeCppCode, CppExecutionResult } from '../utils/cppRunner';
import { CppCodeEditor } from './CppCodeEditor';
import { CppAiTutorModal } from './CppAiTutorModal';
import { CppMemoryVisualizer } from './CppMemoryVisualizer';
import { CppAlgorithmVisualizer } from './CppAlgorithmVisualizer';
import { PythonVsCppComparison } from './PythonVsCppComparison';
import { soundFx } from '../utils/sound';

interface CppGamePlayProps {
  level: CppLevel;
  settings: GameSettings;
  isReplay?: boolean;
  onFinishLevel: (stats: {
    score: number;
    xpEarned: number;
    correctCount: number;
    totalQuestions: number;
    timeSpentSeconds: number;
    answersLog: AnswerRecord[];
  }) => void;
  onExitToLevels: () => void;
}

export const CppGamePlay: React.FC<CppGamePlayProps> = ({
  level,
  settings,
  isReplay = false,
  onFinishLevel,
  onExitToLevels,
}) => {
  const isMn = settings.language === 'mn';
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);
  const exercise: CppExercise = level.exercises[selectedExerciseIndex] || level.exercises[0];

  const [activeTab, setActiveTab] = useState<'editor' | 'visualizer' | 'quiz'>('editor');
  const [code, setCode] = useState<string>(exercise?.starterCode || level.codeSnippet);
  const [stdinInput, setStdinInput] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<CppExecutionResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAiHelpOpen, setIsAiHelpOpen] = useState<boolean>(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const [startTime] = useState<number>(Date.now());

  const handleSelectExercise = (idx: number) => {
    soundFx.click(settings.soundEnabled);
    setSelectedExerciseIndex(idx);
    const newEx = level.exercises[idx];
    setCode(newEx?.starterCode || level.codeSnippet);
    setExecutionResult(null);
    setIsPassed(false);
  };

  const handleRunCode = () => {
    soundFx.click(settings.soundEnabled);
    const res = executeCppCode(code, stdinInput);
    setExecutionResult(res);

    if (res.success) {
      soundFx.click(settings.soundEnabled);
    } else {
      soundFx.error(settings.soundEnabled);
    }
  };

  const handleResetCode = () => {
    soundFx.click(settings.soundEnabled);
    setCode(exercise?.starterCode || level.codeSnippet);
    setExecutionResult(null);
    setIsPassed(false);
  };

  const handleSubmitSolution = () => {
    soundFx.click(settings.soundEnabled);
    setIsSubmitting(true);

    const res = executeCppCode(code, stdinInput);
    setExecutionResult(res);

    let passedAll = true;
    if (exercise && exercise.testCases && exercise.testCases.length > 0) {
      for (const tc of exercise.testCases) {
        if (!res.output.trim().includes(tc.expectedOutput.trim())) {
          passedAll = false;
          break;
        }
      }
    } else {
      passedAll = res.success;
    }

    if (passedAll) {
      setIsPassed(true);
      soundFx.correct(settings.soundEnabled);

      const timeSpent = Math.max(15, Math.floor((Date.now() - startTime) / 1000));
      setTimeout(() => {
        onFinishLevel({
          score: level.xpReward * 2,
          xpEarned: level.xpReward,
          correctCount: 1,
          totalQuestions: 1,
          timeSpentSeconds: timeSpent,
          answersLog: [
            {
              questionId: exercise ? exercise.id : `cpp_${level.id}`,
              questionPrompt: exercise?.title || level.title,
              userAnswerText: code,
              correctAnswerText: exercise?.solutionCode || '',
              isCorrect: true,
              explanation: level.summary,
              explanationMn: level.summaryMn,
            },
          ],
        });
      }, 1000);
    } else {
      setIsPassed(false);
      soundFx.error(settings.soundEnabled);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 py-6 space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <button
          type="button"
          onClick={onExitToLevels}
          className="flex items-center gap-2 rounded-xl bg-[#0f1713] border border-emerald-500/20 px-3.5 py-2 text-xs font-mono text-emerald-400 hover:bg-emerald-500/15 transition-all shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isMn ? 'Буцах (C++ Tracks)' : 'Back to Tracks'}</span>
        </button>

        <div className="text-center">
          <div className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase">
            {isMn ? level.stageTitleMn : level.stageTitle}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-2">
            <span>{level.icon}</span>
            <span>{isMn ? level.titleMn : level.title}</span>
          </h2>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#101914] p-1 rounded-xl border border-emerald-500/20 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'editor'
                ? 'bg-emerald-500 text-black font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Editor</span>
          </button>

          {level.hasVisualizer && (
            <button
              type="button"
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-cyan-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>{isMn ? 'Визуал загвар' : 'Visualizer'}</span>
            </button>
          )}

          {level.quiz && level.quiz.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Quiz ({level.quiz.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW: INTERACTIVE VISUALIZER */}
      {activeTab === 'visualizer' && level.hasVisualizer && (
        <div className="animate-in fade-in slide-in-from-top-2">
          {level.hasVisualizer === 'pointer' || level.hasVisualizer === 'memory' ? (
            <CppMemoryVisualizer language={settings.language} />
          ) : level.hasVisualizer === 'algorithm' ? (
            <CppAlgorithmVisualizer language={settings.language} />
          ) : (
            <PythonVsCppComparison language={settings.language} />
          )}
        </div>
      )}

      {/* VIEW: QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="rounded-3xl border border-emerald-500/25 bg-[#090d0b]/95 p-6 backdrop-blur-xl shadow-2xl space-y-6">
          <h3 className="font-mono text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{isMn ? 'C++ Ойлголтын шалгах асуултууд' : 'Concept Check Quiz'}</span>
          </h3>

          <div className="space-y-5">
            {level.quiz.map((q, qIdx) => (
              <div key={qIdx} className="rounded-2xl bg-[#060a08] p-4 border border-emerald-500/20 space-y-3">
                <p className="font-semibold text-sm text-white">
                  {qIdx + 1}. {isMn ? q.questionMn : q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(isMn ? q.optionsMn : q.options).map((opt, oIdx) => {
                    const isSelected = quizAnswers[qIdx] === oIdx;
                    const isCorrect = q.correctIndex === oIdx;

                    let btnClass = 'bg-[#101713] text-slate-300 border-slate-800 hover:border-emerald-500/40';
                    if (quizSubmitted) {
                      if (isCorrect) btnClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold';
                      else if (isSelected) btnClass = 'bg-rose-500/20 text-rose-300 border-rose-500';
                    } else if (isSelected) {
                      btnClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/80 font-bold';
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => {
                          const updated = [...quizAnswers];
                          updated[qIdx] = oIdx;
                          setQuizAnswers(updated);
                        }}
                        className={`text-left p-3 rounded-xl border text-xs font-mono transition-all ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="mt-2 text-xs text-slate-400 p-2.5 rounded-lg bg-[#0e1410] border border-emerald-500/10">
                    💡 {isMn ? q.explanationMn : q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                soundFx.click(settings.soundEnabled);
                setQuizSubmitted(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-mono font-bold text-xs hover:bg-emerald-400 transition-all shadow"
            >
              {isMn ? 'Хариулт шалгах' : 'Check Answers'}
            </button>
          </div>
        </div>
      )}

      {/* VIEW: MAIN WORKSPACE (Theory, Code Editor, Test Console) */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Theory & Instructions (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Multiple Exercises Selector if level has > 1 */}
            {level.exercises && level.exercises.length > 1 && (
              <div className="rounded-2xl border border-emerald-500/25 bg-[#0b120e] p-3 flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {isMn ? 'Дасгалууд:' : 'Exercises:'}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {level.exercises.map((ex, idx) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => handleSelectExercise(idx)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono transition-all ${
                        selectedExerciseIndex === idx
                          ? 'bg-emerald-500 text-black font-bold shadow'
                          : 'bg-[#121c17] text-slate-300 hover:text-white border border-emerald-500/20'
                      }`}
                    >
                      #{idx + 1} {isMn ? ex.titleMn : ex.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Task Card */}
            <div className="rounded-3xl border border-emerald-500/25 bg-[#090d0b]/90 p-5 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  {exercise?.difficulty || 'Practice'} · {exercise?.category || 'C++'}
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  +{level.xpReward} XP
                </span>
              </div>

              <h3 className="font-bold text-base text-white">
                {isMn ? exercise?.titleMn : exercise?.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isMn ? exercise?.descriptionMn : exercise?.description}
              </p>

              {/* Hints */}
              {exercise?.hints && exercise.hints.length > 0 && showHint && (
                <div className="mt-2 rounded-xl bg-[#141209] p-3 border border-amber-500/30 text-xs text-amber-200 font-mono space-y-1">
                  {(isMn ? exercise.hintsMn : exercise.hints).map((h, i) => (
                    <div key={i}>• {h}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Theory Breakdown Accordion */}
            <div className="rounded-3xl border border-emerald-500/20 bg-[#090d0b]/80 p-5 backdrop-blur-xl shadow-lg space-y-2">
              <h4 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isMn ? 'Онолын товч ойлголт:' : 'Theory Overview:'}
              </h4>
              <div className="text-xs text-slate-300 leading-relaxed space-y-2 max-h-[220px] overflow-y-auto pr-2">
                <p>{isMn ? level.summaryMn : level.summary}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Code Editor & Execution Terminal (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <CppCodeEditor
              code={code}
              onChange={setCode}
              onRun={handleRunCode}
              onSubmit={handleSubmitSolution}
              onReset={handleResetCode}
              onOpenAiHelp={() => setIsAiHelpOpen(true)}
              onToggleHint={() => setShowHint((p) => !p)}
              hasHint={Boolean(exercise?.hints && exercise.hints.length > 0)}
              showHint={showHint}
              isSubmitting={isSubmitting}
              isPassed={isPassed}
              errorLine={executionResult?.errorLine}
              language={settings.language}
              soundEnabled={settings.soundEnabled}
            />

            {/* Optional Stdin input */}
            <div className="px-4 py-2.5 bg-[#0a0f0c] rounded-2xl border border-emerald-500/20 flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 flex-shrink-0">std::cin:</span>
              <input
                type="text"
                value={stdinInput}
                onChange={(e) => setStdinInput(e.target.value)}
                placeholder={isMn ? 'Гараас өгөх утга (заавал биш)...' : 'Standard input (optional)...'}
                className="w-full bg-[#050806] border border-emerald-500/20 rounded-xl px-3 py-1.5 text-emerald-300 text-xs outline-none"
              />
            </div>

            {/* Terminal Output Area */}
            <div className="p-4 bg-[#030504] rounded-3xl border border-emerald-500/20 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Console Output</span>
                </span>
                {executionResult && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded ${
                      executionResult.success
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                    }`}
                  >
                    {executionResult.success ? 'Exit Code: 0 (Success)' : 'Compile / Runtime Error'}
                  </span>
                )}
              </div>

              {executionResult ? (
                <div className="space-y-3">
                  {executionResult.output && (
                    <pre className="text-emerald-300 whitespace-pre-wrap">{executionResult.output}</pre>
                  )}

                  {/* Compile error & friendly explainer */}
                  {executionResult.error && (
                    <div className="rounded-2xl bg-rose-950/40 border border-rose-500/30 p-4 space-y-3">
                      <pre className="text-rose-400 font-bold whitespace-pre-wrap">{executionResult.error}</pre>
                      {executionResult.friendlyExplanation && (
                        <div className="border-t border-rose-500/20 pt-2 text-rose-200 text-xs leading-relaxed flex items-start gap-2">
                          <span className="text-sm">💡</span>
                          <div>
                            <strong>{isMn ? 'Багшийн тайлбар (AI Tutor):' : 'Pedagogical Explanation:'}</strong>{' '}
                            {isMn
                              ? executionResult.friendlyExplanationMn
                              : executionResult.friendlyExplanation}
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setIsAiHelpOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-mono hover:bg-rose-500/30 transition-colors"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{isMn ? 'AI Багшаас дэлгэрэнгүй асуух' : 'Ask AI Tutor for guidance'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-600 italic">
                  {isMn ? 'Кодоо ажиллуулахын тулд "Run" товчийг дарна уу...' : 'Press "Run" to compile and execute code...'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* C++ AI Tutor Interactive Assistant Modal */}
      <CppAiTutorModal
        isOpen={isAiHelpOpen}
        onClose={() => setIsAiHelpOpen(false)}
        language={settings.language}
        currentCode={code}
        currentError={executionResult?.error}
        soundEnabled={settings.soundEnabled}
      />
    </div>
  );
};
