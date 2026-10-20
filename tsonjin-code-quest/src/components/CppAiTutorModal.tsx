import React, { useState } from 'react';
import {
  Sparkles,
  X,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Code2,
  AlertTriangle,
  Send,
  Layers,
  Cpu,
} from 'lucide-react';
import { getCppTutorAdvice } from '../utils/cppRunner';
import { soundFx } from '../utils/sound';

interface CppAiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'mn';
  currentCode?: string;
  currentError?: string;
  soundEnabled?: boolean;
}

export const CppAiTutorModal: React.FC<CppAiTutorModalProps> = ({
  isOpen,
  onClose,
  language = 'mn',
  currentCode = '',
  currentError = '',
  soundEnabled = true,
}) => {
  const isMn = language === 'mn';
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedTopic, setSelectedTopic] = useState<string>('pointer');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'tutor'; textEn: string; textMn: string; code?: string }[]
  >([]);

  if (!isOpen) return null;

  const topicsList = [
    { key: 'pointer', labelEn: 'What is a pointer?', labelMn: 'Pointer (заагч) гэж юу вэ?' },
    { key: 'reference', labelEn: 'What is a reference (&)?', labelMn: 'Reference (лавлагаа, &) гэж юу вэ?' },
    { key: 'constructor', labelEn: 'Why do we need constructors?', labelMn: 'Яагаад байгуулагч (constructor) хэрэгтэй вэ?' },
    { key: 'vector', labelEn: 'What is std::vector?', labelMn: 'std::vector яагаад массивыг орлодог вэ?' },
    { key: 'stack_heap', labelEn: 'Stack vs Heap memory?', labelMn: 'Stack болон Heap-ийн ялгаа юу вэ?' },
    { key: 'raii', labelEn: 'What is RAII in Modern C++?', labelMn: 'Modern C++-ийн RAII зарчим гэж юу вэ?' },
  ];

  const currentAdvice = getCppTutorAdvice(selectedTopic, userLevel);

  const handleAskQuestion = (topicKey: string) => {
    soundFx.click(soundEnabled);
    setSelectedTopic(topicKey);
  };

  const handleSendCustom = () => {
    if (!customQuestion.trim()) return;
    soundFx.click(soundEnabled);

    const q = customQuestion.toLowerCase();
    let replyKey = 'pointer';
    if (q.includes('reference') || q.includes('лавлагаа')) replyKey = 'reference';
    else if (q.includes('construct') || q.includes('байгуулагч')) replyKey = 'constructor';
    else if (q.includes('vector') || q.includes('вектор')) replyKey = 'vector';
    else if (q.includes('stack') || q.includes('heap') || q.includes('санах ой')) replyKey = 'stack_heap';
    else if (q.includes('raii') || q.includes('smart')) replyKey = 'raii';

    const advice = getCppTutorAdvice(replyKey, userLevel);

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', textEn: customQuestion, textMn: customQuestion },
      {
        sender: 'tutor',
        textEn: advice.answerEn,
        textMn: advice.answerMn,
        code: advice.codeSnippet,
      },
    ]);
    setCustomQuestion('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#0a0f0d] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 px-6 py-4 bg-[#0d1612]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{isMn ? 'C++ Кибер Багш (AI Tutor)' : 'C++ Cyber AI Tutor'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ONLINE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isMn
                  ? 'C++-ийн хүнд ойлголтууд, алдаа болон кодын зарчмыг энгийнээр тайлбарлана'
                  : 'Explains complex C++ concepts, compiler errors, and memory dynamics simply'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Level Selector */}
            <div className="hidden sm:flex items-center bg-[#070c09] p-1 rounded-xl border border-emerald-500/20 text-xs font-mono">
              {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    soundFx.click(soundEnabled);
                    setUserLevel(lvl);
                  }}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    userLevel === lvl
                      ? 'bg-emerald-500 text-black font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Compiler Error Highlight if any exists */}
          {currentError && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <AlertTriangle className="h-4 w-4" />
                <span>{isMn ? 'Илэрсэн компиляторын алдаа:' : 'Detected Compiler Error:'}</span>
              </div>
              <pre className="text-xs font-mono text-rose-300 whitespace-pre-wrap bg-[#1a0505] p-2.5 rounded-xl border border-rose-500/20">
                {currentError}
              </pre>
              <div className="text-xs text-rose-200 leading-relaxed pt-1">
                💡 <strong>{isMn ? 'Зөвлөгөө:' : 'Tip:'}</strong>{' '}
                {isMn
                  ? 'Цэг таслал `;` эсвэл хаалтууд `{ }` бүрэн хаагдсан эсэхийг сайтар шалгаарай.'
                  : 'Double-check punctuation like semicolons `;` or matching braces `{ }`.'}
              </div>
            </div>
          )}

          {/* Preset Questions Chips */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-2">
              {isMn ? 'Түгээмэл асуултуудаас сонгох:' : 'Common C++ Concepts to Explore:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {topicsList.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => handleAskQuestion(t.key)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all ${
                    selectedTopic === t.key
                      ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500 font-bold shadow'
                      : 'bg-[#101713] text-slate-300 border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  {isMn ? t.labelMn : t.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Topic Answer Card */}
          <div className="rounded-3xl border border-emerald-500/20 bg-[#070b09] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-400" />
                <span>{isMn ? currentAdvice.questionMn : currentAdvice.questionEn}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 uppercase">
                {userLevel} Explanation
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {isMn ? currentAdvice.answerMn : currentAdvice.answerEn}
            </p>

            {/* Code Demonstration */}
            {currentAdvice.codeSnippet && (
              <div className="rounded-2xl border border-emerald-500/20 bg-[#030604] overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#090f0c] border-b border-emerald-500/15 text-[11px] font-mono text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5" />
                    <span>example.cpp</span>
                  </span>
                  <span className="text-[10px] text-slate-500">C++20</span>
                </div>
                <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  {currentAdvice.codeSnippet}
                </pre>
              </div>
            )}
          </div>

          {/* Dynamic Chat Stream */}
          {chatMessages.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl text-xs space-y-2 ${
                    msg.sender === 'user'
                      ? 'ml-auto max-w-[80%] bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                      : 'mr-auto max-w-[90%] bg-[#0e1612] text-slate-200 border border-emerald-500/20'
                  }`}
                >
                  <p className="leading-relaxed">{isMn ? msg.textMn : msg.textEn}</p>
                  {msg.code && (
                    <pre className="p-2.5 rounded-xl bg-black/60 text-emerald-300 font-mono text-[11px] overflow-x-auto">
                      {msg.code}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-emerald-500/20 p-4 bg-[#0d1612] flex items-center gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCustom()}
            placeholder={
              isMn
                ? 'Өөр асуулт асуух (жишээ: pointer яагаад хэрэгтэй вэ?)...'
                : 'Ask custom C++ question (e.g. why use RAII?)...'
            }
            className="flex-1 bg-[#050806] border border-emerald-500/20 rounded-2xl px-4 py-2.5 text-xs font-mono text-emerald-200 outline-none focus:border-emerald-500/60 transition-colors"
          />
          <button
            type="button"
            onClick={handleSendCustom}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 text-black font-mono font-bold text-xs hover:bg-emerald-400 transition-all shadow"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isMn ? 'Асуух' : 'Ask'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
