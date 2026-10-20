import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Terminal,
  HelpCircle,
  AlertTriangle,
  Code2,
} from 'lucide-react';
import { soundFx } from '../utils/sound';

interface CppCodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  onOpenAiHelp: () => void;
  onToggleHint: () => void;
  hasHint?: boolean;
  showHint?: boolean;
  isSubmitting?: boolean;
  isPassed?: boolean;
  errorLine?: number;
  language?: 'en' | 'mn';
  soundEnabled?: boolean;
}

export const CppCodeEditor: React.FC<CppCodeEditorProps> = ({
  code,
  onChange,
  onRun,
  onSubmit,
  onReset,
  onOpenAiHelp,
  onToggleHint,
  hasHint = true,
  showHint = false,
  isSubmitting = false,
  isPassed = false,
  errorLine,
  language = 'mn',
  soundEnabled = true,
}) => {
  const isMn = language === 'mn';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 12);

  // Sync scroll between textarea and line numbers gutter
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Keyboard enhancements: Tab key indents 4 spaces, Auto-indent on Enter, bracket closing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 1. Tab key inserts 4 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
      return;
    }

    // 2. Enter key auto-indents matching current line + extra indent if ending with '{'
    if (e.key === 'Enter') {
      const lineStart = code.lastIndexOf('\n', start - 1) + 1;
      const currentLine = code.substring(lineStart, start);
      const indentMatch = currentLine.match(/^(\s*)/);
      let indent = indentMatch ? indentMatch[1] : '';

      if (currentLine.trim().endsWith('{')) {
        indent += '    ';
      }

      e.preventDefault();
      const newCode = code.substring(0, start) + '\n' + indent + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
      }, 0);
      return;
    }

    // 3. Auto-close brackets: (, {, [, ", '
    const pairMap: Record<string, string> = {
      '(': ')',
      '{': '}',
      '[': ']',
      '"': '"',
      "'": "'",
    };

    if (pairMap[e.key] && start === end) {
      e.preventDefault();
      const closing = pairMap[e.key];
      const newCode = code.substring(0, start) + e.key + closing + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-[#070b09] overflow-hidden shadow-2xl flex flex-col">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#0e1511] border-b border-emerald-500/20 gap-2">
        {/* Window controls & file tag */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400 ml-2">solution.cpp</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            C++20
          </span>
        </div>

        {/* Action Buttons: Reset, Hint, AI Help, Run, Submit */}
        <div className="flex items-center gap-2">
          {hasHint && (
            <button
              type="button"
              onClick={onToggleHint}
              title={isMn ? 'Зөвлөмж харах' : 'Toggle Hint'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                showHint
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isMn ? 'Зөвлөмж' : 'Hint'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAiHelp}
            title={isMn ? 'AI Багшаас тусламж авах' : 'Get AI Tutor Help'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI Help</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            title={isMn ? 'Эх код руу буцаах' : 'Reset to starter code'}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onRun}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-mono font-bold text-emerald-300 hover:bg-slate-700 transition-all border border-emerald-500/30 shadow-md"
          >
            <Play className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
            <span>{isMn ? 'Ажиллуулах' : 'Run'}</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting || isPassed}
            onClick={onSubmit}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 text-xs font-mono font-bold text-black hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-md"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isPassed ? (isMn ? 'Амжилттай!' : 'Passed!') : isMn ? 'Илгээх' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Line Numbers + Textarea */}
      <div className="relative font-mono text-xs bg-[#050806] flex min-h-[340px] max-h-[500px]">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="select-none py-3 pl-3 pr-2 bg-[#080d0a] text-slate-600 border-r border-emerald-500/15 text-right font-mono text-xs overflow-hidden leading-relaxed min-w-[42px]"
        >
          {Array.from({ length: lineCount }).map((_, idx) => {
            const lineNum = idx + 1;
            const isError = errorLine === lineNum;
            return (
              <div
                key={idx}
                className={`${isError ? 'text-rose-400 font-bold bg-rose-500/20 -mx-2 px-2 rounded' : ''}`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code Input Area */}
        <div className="relative flex-1 p-3">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="w-full h-full bg-transparent text-emerald-100 font-mono text-xs outline-none resize-none leading-relaxed min-h-[320px] selection:bg-emerald-500/30"
          />
        </div>
      </div>
    </div>
  );
};
