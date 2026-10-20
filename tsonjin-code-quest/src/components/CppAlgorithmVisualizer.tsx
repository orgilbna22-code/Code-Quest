import React, { useState } from 'react';
import { Play, RotateCcw, Zap, BarChart2, CheckCircle2, ChevronRight } from 'lucide-react';

interface CppAlgorithmVisualizerProps {
  language?: 'en' | 'mn';
}

export const CppAlgorithmVisualizer: React.FC<CppAlgorithmVisualizerProps> = ({ language = 'mn' }) => {
  const isMn = language === 'mn';

  // Binary Search Interactive State
  const initialArray = [3, 7, 12, 19, 24, 35, 48, 62, 77, 89];
  const [target, setTarget] = useState<number>(35);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(initialArray.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [stepCount, setStepCount] = useState<number>(0);
  const [isFound, setIsFound] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Time Complexity Simulator Slider
  const [nSize, setNSize] = useState<number>(100);

  const resetSearch = () => {
    setLow(0);
    setHigh(initialArray.length - 1);
    setMid(null);
    setStepCount(0);
    setIsFound(false);
    setSearchHistory([]);
  };

  const stepBinarySearch = () => {
    if (isFound || low > high) return;

    const currentMid = Math.floor(low + (high - low) / 2);
    setMid(currentMid);
    const newStep = stepCount + 1;
    setStepCount(newStep);

    const midVal = initialArray[currentMid];
    if (midVal === target) {
      setIsFound(true);
      setSearchHistory((prev) => [
        ...prev,
        `Step ${newStep}: array[${currentMid}] == ${target} (FOUND in ${newStep} steps!)`,
      ]);
    } else if (midVal < target) {
      setLow(currentMid + 1);
      setSearchHistory((prev) => [
        ...prev,
        `Step ${newStep}: array[${currentMid}] (${midVal}) < ${target} -> Discard left half, new low: ${currentMid + 1}`,
      ]);
    } else {
      setHigh(currentMid - 1);
      setSearchHistory((prev) => [
        ...prev,
        `Step ${newStep}: array[${currentMid}] (${midVal}) > ${target} -> Discard right half, new high: ${currentMid - 1}`,
      ]);
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-500/25 bg-[#090d0b]/95 p-5 sm:p-6 backdrop-blur-xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400 border border-emerald-500/20">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isMn ? 'C++ Алгоритм ба Хугацааны нарийвчлал' : 'C++ Algorithm & Big-O Visualizer'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STEP-BY-STEP
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isMn
                ? 'Хоёртын хайлт (O(log N)) болон хугацааны өсөлтийг бодитоор турших'
                : 'Interactive step-by-step execution of Binary Search and Big-O growth curves'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-700 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            disabled={isFound || low > high}
            onClick={stepBinarySearch}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-xs font-mono font-bold text-black hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-md"
          >
            <Play className="h-3.5 w-3.5" />
            <span>{isMn ? 'Дараах алхам' : 'Next Step'}</span>
          </button>
        </div>
      </div>

      {/* 1. BINARY SEARCH INTERACTIVE ARRAY */}
      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            {isMn ? 'Хайх утга:' : 'Target:'} <strong className="text-emerald-400 text-sm">{target}</strong>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{isMn ? 'Өөр зорилго сонгох:' : 'Choose Target:'}</span>
            <select
              value={target}
              onChange={(e) => {
                setTarget(Number(e.target.value));
                resetSearch();
              }}
              className="bg-[#121a15] border border-emerald-500/30 rounded px-2 py-1 text-emerald-300 text-xs"
            >
              {initialArray.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Array Bars */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 rounded-2xl bg-[#060a08] border border-emerald-500/20">
          {initialArray.map((val, idx) => {
            const isMid = mid === idx;
            const inRange = idx >= low && idx <= high;
            const isMatch = isFound && isMid;

            let bgClass = 'bg-[#101713] text-slate-400 border-slate-800';
            if (!inRange && mid !== null) {
              bgClass = 'bg-[#090d0b] text-slate-700 border-transparent opacity-40';
            } else if (isMatch) {
              bgClass = 'bg-emerald-500 text-black font-extrabold border-emerald-400 shadow-lg animate-bounce';
            } else if (isMid) {
              bgClass = 'bg-cyan-500/30 text-cyan-300 font-bold border-cyan-400';
            } else if (inRange) {
              bgClass = 'bg-[#142019] text-emerald-300 border-emerald-500/30';
            }

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-mono transition-all ${bgClass}`}
              >
                <span className="text-[9px] text-slate-500 mb-0.5">[{idx}]</span>
                <span className="text-sm font-bold">{val}</span>
                {isMid && (
                  <span className="text-[8px] font-mono mt-1 text-cyan-300 bg-cyan-900/50 px-1 rounded">
                    MID
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Search Log */}
        {searchHistory.length > 0 && (
          <div className="rounded-xl bg-[#060907] p-3 border border-emerald-500/15 font-mono text-xs space-y-1">
            {searchHistory.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300">
                <ChevronRight className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                <span>{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. BIG-O COMPLEXITY COMPARISON TABLE & SLIDER */}
      <div className="mt-6 border-t border-emerald-500/15 pt-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {isMn ? 'Хугацааны хурд харьцуулалт (Big-O Comparison)' : 'Big-O Growth Comparison'}
            </h4>
            <p className="text-[11px] text-slate-400">
              {isMn
                ? 'Өгөгдлийн хэмжээ N өсөхөд шаардагдах үйлдлийн тоо:'
                : 'Operations required as input size N scales:'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">N = {nSize}:</span>
            <input
              type="range"
              min="10"
              max="10000"
              step="100"
              value={nSize}
              onChange={(e) => setNSize(Number(e.target.value))}
              className="accent-emerald-400 w-28 sm:w-36"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="rounded-xl bg-[#0c1611] p-3 border border-emerald-500/20 text-center">
            <div className="text-[10px] text-slate-400">O(1) Constant</div>
            <div className="text-emerald-400 font-bold text-base mt-1">1 op</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Instant Array Lookup</div>
          </div>

          <div className="rounded-xl bg-[#0c1611] p-3 border border-emerald-500/20 text-center">
            <div className="text-[10px] text-slate-400">O(log N) Binary Search</div>
            <div className="text-emerald-300 font-bold text-base mt-1">
              ~{Math.ceil(Math.log2(nSize))} ops
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">Divide & Conquer</div>
          </div>

          <div className="rounded-xl bg-[#161a0d] p-3 border border-amber-500/20 text-center">
            <div className="text-[10px] text-slate-400">O(N) Linear Search</div>
            <div className="text-amber-300 font-bold text-base mt-1">{nSize} ops</div>
            <div className="text-[9px] text-slate-500 mt-0.5">Iterate entire list</div>
          </div>

          <div className="rounded-xl bg-[#1a0e0d] p-3 border border-rose-500/20 text-center">
            <div className="text-[10px] text-slate-400">O(N²) Bubble Sort</div>
            <div className="text-rose-400 font-bold text-base mt-1">
              {(nSize * nSize).toLocaleString()} ops
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">Nested loops</div>
          </div>
        </div>
      </div>
    </div>
  );
};
