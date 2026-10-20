import React, { useState } from 'react';
import { ArrowRight, Layers, Cpu, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface CppMemoryVisualizerProps {
  language?: 'en' | 'mn';
}

export const CppMemoryVisualizer: React.FC<CppMemoryVisualizerProps> = ({ language = 'mn' }) => {
  const isMn = language === 'mn';
  const [activeTab, setActiveTab] = useState<'pointers' | 'stack_heap'>('pointers');
  const [variableValue, setVariableValue] = useState(42);
  const [pointerAddress, setPointerAddress] = useState('0x7ffee12a');
  const [heapAllocations, setHeapAllocations] = useState<
    { id: string; address: string; type: string; value: string; smart: boolean }[]
  >([
    { id: '1', address: '0x10080', type: 'int', value: '250', smart: true },
    { id: '2', address: '0x10098', type: 'std::string', value: '"Cyber Quest"', smart: true },
  ]);

  const addHeapBlock = () => {
    const nextAddr = '0x10' + Math.floor(Math.random() * 899 + 100).toString(16);
    const newBlock = {
      id: Date.now().toString(),
      address: nextAddr,
      type: 'std::vector<int>',
      value: '{10, 20, 30}',
      smart: true,
    };
    setHeapAllocations((prev) => [...prev, newBlock]);
  };

  const removeHeapBlock = (id: string) => {
    setHeapAllocations((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="rounded-3xl border border-emerald-500/25 bg-[#090d0b]/95 p-5 sm:p-6 backdrop-blur-xl shadow-2xl text-white">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400 border border-emerald-500/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isMn ? 'C++ Санах ойн визуал загварчлал' : 'C++ Memory & Pointer Visualizer'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                INTERACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isMn
                ? 'Pointer, санах ойн хаяг болон Stack vs Heap-ийн ялгааг бодитоор харах'
                : 'Visually inspect pointers, memory addresses, and Stack vs Heap dynamics'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#121a15] p-1 rounded-xl border border-emerald-500/20 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('pointers')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'pointers'
                ? 'bg-emerald-500 text-black font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isMn ? 'Pointers (* &)' : 'Pointers (* &)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stack_heap')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'stack_heap'
                ? 'bg-emerald-500 text-black font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isMn ? 'Stack vs Heap' : 'Stack vs Heap'}
          </button>
        </div>
      </div>

      {/* VIEW 1: POINTERS & DEREFERENCING */}
      {activeTab === 'pointers' && (
        <div className="mt-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Box 1: The Pointer Variable */}
            <div className="rounded-2xl border border-emerald-500/30 bg-[#0e1612] p-4 text-center relative shadow-lg">
              <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                {isMn ? 'Pointer Хувьсагч' : 'Pointer Variable'}
              </span>
              <div className="my-2 font-mono text-sm font-bold text-white">int* ptr</div>
              <div className="rounded-xl bg-[#060a08] p-3 border border-emerald-500/20 font-mono">
                <div className="text-[10px] text-slate-500">Stored Value (Address):</div>
                <div className="text-emerald-400 font-bold text-sm">{pointerAddress}</div>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                {isMn ? 'Өөртөө target хувьсагчийн хаягийг хадгалж байна' : 'Holds the memory address of target variable'}
              </p>
            </div>

            {/* Arrow & Dereference Indicator */}
            <div className="flex flex-col items-center justify-center text-center py-2">
              <div className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
                *ptr (dereference)
              </div>
              <div className="flex items-center gap-1 text-emerald-400 animate-pulse">
                <span className="h-0.5 w-12 bg-emerald-500"></span>
                <ArrowRight className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                {isMn ? 'Хаяг руу хандаж утгыг унших / өөрчлөх' : 'Accesses value at address'}
              </span>
            </div>

            {/* Box 2: The Target Variable in RAM */}
            <div className="rounded-2xl border border-cyan-500/30 bg-[#0c1618] p-4 text-center relative shadow-lg">
              <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                {isMn ? 'Жинхэнэ Хувьсагч' : 'Target Variable (RAM Cell)'}
              </span>
              <div className="my-2 font-mono text-sm font-bold text-white">int x</div>
              <div className="rounded-xl bg-[#060a0c] p-3 border border-cyan-500/20 font-mono">
                <div className="text-[10px] text-slate-500">Address: {pointerAddress}</div>
                <div className="text-cyan-400 font-bold text-xl">{variableValue}</div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setVariableValue((v) => v + 10)}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
                >
                  *ptr += 10
                </button>
                <button
                  type="button"
                  onClick={() => setVariableValue(42)}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Code Demo */}
          <div className="rounded-2xl bg-[#060907] p-4 border border-emerald-500/15 font-mono text-xs">
            <div className="text-slate-400 mb-1">// {isMn ? 'Энэ кодын шууд тусгал:' : 'Live Code Equivalent:'}</div>
            <div className="text-emerald-400">int x = {variableValue};</div>
            <div className="text-emerald-300">int* ptr = &x; // &x gets address ({pointerAddress})</div>
            <div className="text-cyan-400">*ptr = {variableValue}; // modifies x through ptr</div>
          </div>
        </div>
      )}

      {/* VIEW 2: STACK VS HEAP INTERACTIVE ARCHITECTURE */}
      {activeTab === 'stack_heap' && (
        <div className="mt-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* STACK FRAME */}
            <div className="rounded-2xl border border-emerald-500/30 bg-[#0d1611] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono text-sm font-bold text-emerald-400">STACK (Call Frames)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{isMn ? 'Хурдан & Автомат' : 'Fast & Auto'}</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="rounded-xl bg-[#060c08] p-2.5 border border-emerald-500/20 text-xs font-mono flex justify-between items-center">
                    <div>
                      <span className="text-emerald-400">main()</span> frame
                      <div className="text-[10px] text-slate-500">int localA = 5; int localB = 10;</div>
                    </div>
                    <span className="text-[10px] text-slate-400">0x7ffd...</span>
                  </div>
                  <div className="rounded-xl bg-[#060c08] p-2.5 border border-emerald-500/20 text-xs font-mono flex justify-between items-center">
                    <div>
                      <span className="text-emerald-300">smartPtr</span> (owner)
                      <div className="text-[10px] text-slate-500">std::unique_ptr holding heap addr</div>
                    </div>
                    <span className="text-[10px] text-slate-400">0x7ffd...</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-slate-400 border-t border-emerald-500/10 pt-2">
                {isMn
                  ? 'Функц дуусахад стек санах ой автоматаар агшин зуур чөлөөлөгдөнө.'
                  : 'Stack variables are freed instantly and automatically when function scope ends.'}
              </p>
            </div>

            {/* HEAP POOL */}
            <div className="rounded-2xl border border-amber-500/30 bg-[#16120b] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-amber-500/15 pb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-amber-400" />
                    <span className="font-mono text-sm font-bold text-amber-400">HEAP (Dynamic Pool)</span>
                  </div>
                  <button
                    type="button"
                    onClick={addHeapBlock}
                    className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
                  >
                    + make_unique
                  </button>
                </div>
                <div className="mt-3 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {heapAllocations.map((block) => (
                    <div
                      key={block.id}
                      className="rounded-xl bg-[#0c0905] p-2 border border-amber-500/20 text-xs font-mono flex justify-between items-center"
                    >
                      <div>
                        <span className="text-amber-300">{block.type}</span>: {block.value}
                        <div className="text-[10px] text-slate-500">Addr: {block.address} (RAII Managed)</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHeapBlock(block.id)}
                        className="text-[10px] text-rose-400 hover:text-rose-300 underline"
                      >
                        free()
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-[11px] text-slate-400 border-t border-amber-500/10 pt-2">
                {isMn
                  ? 'Динамик санах ой. Modern C++ нь unique_ptr ашиглан leak-ээс бүрэн хамгаалдаг.'
                  : 'Dynamic heap memory managed safely using Modern C++ unique_ptr (RAII).'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
