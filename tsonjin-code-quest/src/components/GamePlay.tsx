import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Award,
  Terminal,
  Zap,
  Shield,
  Sparkles,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Level, Question, GameSettings, AnswerRecord } from '../types';
import { executePythonCode } from '../utils/pythonRunner';
import { soundFx } from '../utils/sound';
import { translations } from '../utils/i18n';

interface GamePlayProps {
  level: Level;
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

export const GamePlay: React.FC<GamePlayProps> = ({
  level,
  settings,
  isReplay = false,
  onFinishLevel,
  onExitToLevels,
}) => {
  const t = translations[settings.language];
  const isMn = settings.language === 'mn';

  // Stage: 'BRIEFING' -> 'QUESTIONS'
  const [showBriefing, setShowBriefing] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Concept Sandbox in Briefing
  const [sandboxCode, setSandboxCode] = useState<string>(level.conceptSummary.codeExample);
  const [sandboxOutput, setSandboxOutput] = useState<string>('');
  const [hasTestedSandbox, setHasTestedSandbox] = useState<boolean>(false);

  // Question state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [codeError, setCodeError] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Answer Logging for Mistake Breakdown
  const [answersLog, setAnswersLog] = useState<AnswerRecord[]>([]);

  // Scoring & Stats
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [accumulatedScore, setAccumulatedScore] = useState<number>(0);
  const [accumulatedXp, setAccumulatedXp] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(180); // 3 minutes per quest
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const question: Question = level.questions[currentQuestionIndex] || level.questions[0];

  // Initialize question state when index changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsShaking(false);
    setCodeOutput('');
    setCodeError('');

    if (question.type === 'code_challenge') {
      setUserCode(question.starterCode || '# Write your Python code here\n');
    }
  }, [currentQuestionIndex, question]);

  // Timer effect
  useEffect(() => {
    if (showBriefing || !settings.timerEnabled) return;

    timerRef.current = setInterval(() => {
      setTimeSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showBriefing, settings.timerEnabled]);

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  // Run concept sandbox code during briefing
  const handleRunSandbox = () => {
    soundFx.click(settings.soundEnabled);
    const res = executePythonCode(sandboxCode);
    setSandboxOutput(res.output || (res.error ? `Error: ${res.error}` : 'Code executed with no output'));
    setHasTestedSandbox(true);
  };

  // Start the challenge from briefing
  const handleStartQuestions = () => {
    soundFx.click(settings.soundEnabled);
    setShowBriefing(false);
  };

  // Handle standard option click
  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  // Compute pedagogical reason why a chosen option is wrong
  const generateMistakeAnalysis = (
    q: Question,
    chosenIdx: number,
    correctIdx: number
  ): { whyWrongEn: string; whyWrongMn: string } => {
    const optionsEn = q.options || [];
    const optionsMn = q.optionsMn || optionsEn;
    const chosenText = optionsEn[chosenIdx] || `Option ${chosenIdx + 1}`;
    const chosenTextMn = optionsMn[chosenIdx] || chosenText;
    const correctText = optionsEn[correctIdx] || `Option ${correctIdx + 1}`;
    const correctTextMn = optionsMn[correctIdx] || correctText;

    // Check if question has customized mistakeDetails
    if (q.mistakeDetails && q.mistakeDetails[chosenIdx]) {
      return {
        whyWrongEn: q.mistakeDetails[chosenIdx].whyWrong,
        whyWrongMn: q.mistakeDetails[chosenIdx].whyWrongMn,
      };
    }

    // Context-sensitive dynamic generator
    if (q.type === 'true_false') {
      return {
        whyWrongEn: `You selected "${chosenText}". In Python, this statement contradicts the language rules. The correct state is "${correctText}".`,
        whyWrongMn: `Та "${chosenTextMn}" гэж сонгосон байна. Энэ нь буруу бөгөөд Python хэлний үндсэн зарчим, дүрмийн дагуу зөв төлөв нь "${correctTextMn}" байх ёстой.`,
      };
    }

    if (q.type === 'predict_output') {
      return {
        whyWrongEn: `You predicted: "${chosenText}". When Python evaluates this code, it produces "${correctText}" because of operator precedence, syntax rules, and type conversion.`,
        whyWrongMn: `Та "${chosenTextMn}" гэж таамагласан байна. Python энэ кодыг ажиллуулахдаа үйлдлийн дараалал болон өгөгдлийн төрлийн дүрмийн дагуу "${correctTextMn}" гэсэн үр дүнг гаргадаг.`,
      };
    }

    return {
      whyWrongEn: `You selected "${chosenText}". In Python programming, this choice is invalid because the syntax strictly mandates "${correctText}".`,
      whyWrongMn: `Та "${chosenTextMn}" гэж сонгосон байна. Энэ сонголт нь буруу бөгөөд Python хэлний дүрэм нь заавал "${correctTextMn}" гэсэн бүтцийг шаарддаг.`,
    };
  };

  // Submit standard question
  const handleSubmitOption = () => {
    if (selectedOption === null || isAnswered) return;

    const correctIdx = Number(question.correctAnswer);
    const correct = selectedOption === correctIdx;
    setIsAnswered(true);
    setIsCorrect(correct);

    const activeOpts = (isMn && question.optionsMn) ? question.optionsMn : (question.options || []);
    const optsEn = question.options || [];

    const userText = activeOpts[selectedOption] || `Option ${selectedOption + 1}`;
    const correctText = activeOpts[correctIdx] || `Option ${correctIdx + 1}`;

    const { whyWrongEn, whyWrongMn } = correct
      ? { whyWrongEn: '', whyWrongMn: '' }
      : generateMistakeAnalysis(question, selectedOption, correctIdx);

    const record: AnswerRecord = {
      questionId: question.id,
      questionPrompt: question.prompt,
      questionPromptMn: question.promptMn,
      codeSnippet: question.codeSnippet,
      userAnswerText: userText,
      correctAnswerText: correctText,
      isCorrect: correct,
      explanation: question.explanation,
      explanationMn: question.explanationMn,
      whyWrong: whyWrongEn,
      whyWrongMn: whyWrongMn,
    };

    setAnswersLog((prev) => [...prev, record]);

    if (correct) {
      soundFx.correct(settings.soundEnabled);
      setCorrectAnswersCount((prev) => prev + 1);
      setAccumulatedScore((prev) => prev + 100);
      setAccumulatedXp((prev) => prev + 25);
    } else {
      soundFx.error(settings.soundEnabled);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setAccumulatedScore((prev) => Math.max(0, prev - 20));
    }
  };

  // Run and validate code challenge
  const handleRunCode = () => {
    const res = executePythonCode(userCode);
    setCodeOutput(res.output);
    setCodeError(res.error || '');

    if (!res.success) {
      soundFx.error(settings.soundEnabled);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const trimmedOutput = res.output.trim();
    const expected = (question.expectedOutput || '').trim();

    const isMatch =
      expected ? trimmedOutput === expected : res.success && trimmedOutput.length > 0;

    setIsAnswered(true);
    setIsCorrect(isMatch);

    const record: AnswerRecord = {
      questionId: question.id,
      questionPrompt: question.prompt,
      questionPromptMn: question.promptMn,
      codeSnippet: userCode,
      userAnswerText: trimmedOutput || '(No terminal output produced)',
      correctAnswerText: expected || String(question.correctAnswer),
      isCorrect: isMatch,
      explanation: question.explanation,
      explanationMn: question.explanationMn,
      whyWrong: isMatch
        ? ''
        : `Your code produced output "${trimmedOutput}", but the quest challenge expected "${expected}". Carefully check quotation marks, exact spelling, spaces, and variable names.`,
      whyWrongMn: isMatch
        ? ''
        : `Таны код "${trimmedOutput}" гэсэн үр дүн гаргасан боловч даалгавар "${expected}" гэсэн үр дүнг хүлээж байна. Үгийн зөв бичиглэл, том жижиг үсэг, хашилт, зайг дахин нарийвчлан шалгаарай.`,
    };

    setAnswersLog((prev) => [...prev, record]);

    if (isMatch) {
      soundFx.correct(settings.soundEnabled);
      setCorrectAnswersCount((prev) => prev + 1);
      setAccumulatedScore((prev) => prev + 150);
      setAccumulatedXp((prev) => prev + 40);
    } else {
      soundFx.error(settings.soundEnabled);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Reset code challenge
  const handleResetCode = () => {
    soundFx.click(settings.soundEnabled);
    setUserCode(question.starterCode || '');
    setCodeOutput('');
    setCodeError('');
    setIsAnswered(false);
    setIsCorrect(false);
  };

  // Next question or finish
  const handleNext = () => {
    soundFx.click(settings.soundEnabled);
    if (currentQuestionIndex + 1 < level.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all questions in level!
      // If student is replaying an already completed level, XP is 0 (prevent duplicate XP farming)
      const finalXp = isReplay ? 0 : (accumulatedXp + level.xpReward);
      const timeBonus = Math.max(0, Math.floor(timeSeconds / 2));
      const finalScore = accumulatedScore + timeBonus;

      onFinishLevel({
        score: finalScore,
        xpEarned: finalXp,
        correctCount: correctAnswersCount,
        totalQuestions: level.questions.length,
        timeSpentSeconds: elapsedSeconds,
        answersLog,
      });
    }
  };

  // Active question details
  const activePrompt = (isMn && question.promptMn) ? question.promptMn : question.prompt;
  const activeOptions = (isMn && question.optionsMn) ? question.optionsMn : question.options;
  const activeExplanation = (isMn && question.explanationMn) ? question.explanationMn : question.explanation;

  const latestRecord = answersLog[answersLog.length - 1];

  // ==========================================
  // BRIEFING VIEW (SOFTER MINIMALIST EYE-FRIENDLY HUD)
  // ==========================================
  if (showBriefing) {
    const headingText = isMn ? level.conceptSummary.headingMn : level.conceptSummary.heading;
    const explanationText = isMn ? level.conceptSummary.explanationMn : level.conceptSummary.explanation;
    const directiveText = isMn
      ? (level.conceptSummary.missionDirectiveMn || level.conceptSummary.missionDirective)
      : (level.conceptSummary.missionDirective || 'Execute the computational directive to advance cadet rank.');
    const cyberTipText = isMn
      ? (level.conceptSummary.cyberTipMn || level.conceptSummary.cyberTip)
      : level.conceptSummary.cyberTip;
    const takeawayText = isMn ? level.conceptSummary.keyTakeawayMn : level.conceptSummary.keyTakeaway;

    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#131916] p-6 shadow-xl sm:p-10">
          {/* Top Mission HUD Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-emerald-400">
              <Shield className="h-4 w-4" />
              <span>{t.conceptIntro}</span>
              <span className="text-slate-600">•</span>
              <span>LEVEL {String(level.id).padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono font-medium text-emerald-300">
                <Zap className="h-3.5 w-3.5 fill-current text-emerald-400" />
                <span>{t.potentialBounty}: +{level.xpReward} XP</span>
              </span>

              <span className="rounded-xl border border-slate-800/80 bg-[#0B0F0D] px-2.5 py-1 text-[11px] font-mono font-medium text-slate-300">
                {level.difficulty}
              </span>
            </div>
          </div>

          <div className="mt-6">
            {/* Mission Directive Callout */}
            {directiveText && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-[#0B0F0D] p-4 text-xs font-mono text-emerald-200/90 leading-relaxed">
                <Terminal className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-400 block mb-1">
                    &gt; {t.missionDirective}
                  </span>
                  <span className="text-slate-200">{directiveText}</span>
                </div>
              </div>
            )}

            {/* Main Lesson Heading */}
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {headingText}
            </h2>

            {/* Explanation Prose */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
              {explanationText}
            </p>

            {/* Interactive Concept Preview / Sandbox */}
            <div className="mt-6 rounded-2xl border border-slate-800/80 bg-[#0B0F0D] p-5">
              <div className="mb-3 flex items-center justify-between font-mono text-xs text-slate-400">
                <span className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>{t.interactivePreview}</span>
                </span>
                <span className="text-[11px] text-slate-500">Python 3 Sandbox</span>
              </div>

              <textarea
                value={sandboxCode}
                onChange={(e) => setSandboxCode(e.target.value)}
                rows={4}
                spellCheck={false}
                className="w-full resize-none rounded-xl border border-slate-800/80 bg-[#131916] p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500/60"
              />

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={handleRunSandbox}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-[#0B0F0D] hover:bg-emerald-400 transition-all shadow-sm active:scale-[0.98]"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{t.runSandboxCode}</span>
                </button>

                {hasTestedSandbox && (
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Tested</span>
                  </span>
                )}
              </div>

              {sandboxOutput && (
                <div className="mt-3 rounded-xl border border-slate-800 bg-[#0F1512] p-3 font-mono text-xs text-emerald-300 whitespace-pre-wrap">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    {t.testingResult}:
                  </div>
                  {sandboxOutput}
                </div>
              )}
            </div>

            {/* Cyber Architect Hint */}
            {cyberTipText && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-950/15 p-4 text-xs text-slate-300">
                <Sparkles className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <div className="font-mono font-semibold text-amber-300 uppercase">
                    {t.cyberTip}
                  </div>
                  <p className="mt-0.5 text-slate-300 leading-relaxed">
                    {cyberTipText}
                  </p>
                </div>
              </div>
            )}

            {/* Key Takeaway */}
            <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-950/15 p-4">
              <div className="text-xs font-mono font-semibold text-emerald-400 uppercase">
                {t.coreTakeaway}
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {takeawayText}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <button
              onClick={onExitToLevels}
              className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              ← {t.back} to Quests
            </button>

            <button
              onClick={handleStartQuestions}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-sm font-bold text-[#0B0F0D] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-[0.99]"
            >
              <span>{t.startChallenge}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE QUESTION VIEW
  // ==========================================
  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / level.questions.length) * 100
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Top Status HUD */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#131916] px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-emerald-400">
            LEVEL {String(level.id).padStart(2, '0')}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-medium text-slate-300">
            {t.question} {String(currentQuestionIndex + 1).padStart(2, '0')} / {String(level.questions.length).padStart(2, '0')}
          </span>
        </div>

        {/* Timer, Score & XP indicators */}
        <div className="flex items-center gap-4 text-xs font-mono">
          {settings.timerEnabled && (
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-bold">{formatTime(timeSeconds)}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-amber-300">
            <span>Score:</span>
            <span className="font-bold">{accumulatedScore}</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-400">
            <Award className="h-3.5 w-3.5" />
            <span className="font-bold">+{accumulatedXp} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#131916]">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div
        className={`rounded-3xl border border-slate-800/80 bg-[#131916] p-6 shadow-xl sm:p-8 ${
          isShaking ? 'animate-shake border-rose-500/40' : ''
        }`}
      >
        {/* Question Prompt */}
        <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          {activePrompt}
        </h3>

        {/* Code Snippet Box (if provided) */}
        {question.codeSnippet && (
          <div className="my-5 rounded-2xl border border-slate-800/80 bg-[#0B0F0D] p-4">
            <pre className="font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-relaxed">
              {question.codeSnippet}
            </pre>
          </div>
        )}

        {/* Fill in the blank template preview */}
        {question.type === 'fill_blank' && question.blankTemplate && (
          <div className="my-5 rounded-2xl border border-slate-800/80 bg-[#0B0F0D] p-4 font-mono text-sm text-emerald-300">
            {question.blankTemplate}
          </div>
        )}

        {/* 1. Standard Choice / Option Selection */}
        {question.type !== 'code_challenge' && activeOptions && (
          <div className="mt-6 space-y-3">
            {activeOptions.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedOption === idx;
              const isThisCorrect = idx === question.correctAnswer;

              let btnStyle = 'border-slate-800/80 bg-[#0B0F0D] text-slate-200 hover:border-emerald-500/40 hover:bg-[#151D18]';

              if (isAnswered) {
                if (isThisCorrect) {
                  btnStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold';
                } else if (isSelected && !isThisCorrect) {
                  btnStyle = 'border-rose-500/50 bg-rose-950/20 text-rose-300';
                } else {
                  btnStyle = 'border-slate-800/40 bg-[#0B0F0D]/60 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'border-emerald-500 bg-emerald-500/10 text-white font-semibold ring-1 ring-emerald-500/50';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-[#131916] font-mono text-xs font-bold text-white">
                      {letter}
                    </span>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </div>

                  {isAnswered && isThisCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isAnswered && isSelected && !isThisCorrect && (
                    <XCircle className="h-5 w-5 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}

            {!isAnswered && (
              <div className="pt-4">
                <button
                  onClick={handleSubmitOption}
                  disabled={selectedOption === null}
                  className={`w-full rounded-2xl py-3.5 text-sm font-bold transition-all ${
                    selectedOption !== null
                      ? 'bg-emerald-500 text-[#0B0F0D] hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-[0.99]'
                      : 'cursor-not-allowed bg-slate-800 text-slate-500'
                  }`}
                >
                  {t.submitAnswer}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. Interactive Python Code Editor Sandbox */}
        {question.type === 'code_challenge' && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F0D]">
              <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>solution.py</span>
                </span>
                <button
                  onClick={handleResetCode}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{t.resetCode}</span>
                </button>
              </div>

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                disabled={isAnswered && isCorrect}
                rows={6}
                spellCheck={false}
                className="w-full resize-y bg-transparent p-4 font-mono text-sm text-[#F1F5F2] focus:outline-none"
                placeholder="# Type your Python code here..."
              />
            </div>

            {/* Terminal Output Console */}
            {(codeOutput || codeError) && (
              <div className="rounded-2xl border border-slate-800 bg-[#0F1512] p-4 font-mono text-xs">
                <div className="mb-2 text-slate-400 uppercase tracking-wider text-[10px]">
                  {t.outputTerminal}
                </div>
                {codeOutput && (
                  <pre className="text-emerald-300 whitespace-pre-wrap">{codeOutput}</pre>
                )}
                {codeError && (
                  <pre className="text-rose-400 whitespace-pre-wrap mt-1">{codeError}</pre>
                )}
              </div>
            )}

            {!isAnswered && (
              <button
                onClick={handleRunCode}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-[#0B0F0D] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-[0.99]"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{t.runCode}</span>
              </button>
            )}
          </div>
        )}

        {/* Immediate In-Depth Educational Explanation & Mistake Analysis */}
        {isAnswered && (
          <div
            className={`mt-6 rounded-2xl border p-5 transition-all ${
              isCorrect
                ? 'border-emerald-500/25 bg-emerald-950/15'
                : 'border-rose-500/25 bg-[#171315]'
            }`}
          >
            {/* Header state */}
            <div className="flex items-center gap-2 font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-400 text-base">{t.correct}</span>
                  <span className="font-mono text-xs font-semibold text-emerald-400">
                    +25 XP
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-400" />
                  <span className="text-rose-300 text-base">{t.incorrect}</span>
                </>
              )}
            </div>

            {/* When Incorrect: Sentence-by-sentence analysis of why it was wrong! */}
            {!isCorrect && latestRecord && (
              <div className="mt-4 space-y-3 border-t border-rose-900/30 pt-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  <div className="rounded-xl border border-rose-900/40 bg-[#1F1416] p-3 text-rose-300">
                    <span className="text-slate-400 block mb-1 text-[11px]">{t.yourChoice}</span>
                    <span className="font-bold">{latestRecord.userAnswerText}</span>
                  </div>
                  <div className="rounded-xl border border-emerald-900/40 bg-[#0E1712] p-3 text-emerald-300">
                    <span className="text-slate-400 block mb-1 text-[11px]">{t.correctSolution}</span>
                    <span className="font-bold">{latestRecord.correctAnswerText}</span>
                  </div>
                </div>

                {/* Why it was wrong sentence */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/15 p-3.5 text-xs text-slate-200">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1.5 font-mono text-xs">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    <span>{t.whyWrongTitle}</span>
                  </span>
                  <p className="leading-relaxed text-slate-200 text-xs sm:text-sm">
                    {isMn ? (latestRecord.whyWrongMn || latestRecord.whyWrong) : latestRecord.whyWrong}
                  </p>
                </div>
              </div>
            )}

            {/* General Concept Rule & Pedagogical Explanation */}
            <div className="mt-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-400 block text-xs font-mono uppercase mb-1">
                {t.conceptRuleTitle}
              </span>
              <p>{activeExplanation}</p>
            </div>

            {/* Next Question / Finish Action */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-[#0B0F0D] transition-all hover:bg-emerald-400 hover:shadow-[0_0_16px_rgba(16,185,129,0.25)] active:scale-[0.98]"
              >
                <span>
                  {currentQuestionIndex + 1 < level.questions.length
                    ? t.nextQuestion
                    : t.finishLevel}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
