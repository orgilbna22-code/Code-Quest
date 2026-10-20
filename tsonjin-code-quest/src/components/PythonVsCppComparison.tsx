import React, { useState } from 'react';
import { ArrowLeftRight, Check, Zap, Cpu, Sparkles } from 'lucide-react';

interface PythonVsCppComparisonProps {
  language?: 'en' | 'mn';
}

export const PythonVsCppComparison: React.FC<PythonVsCppComparisonProps> = ({ language = 'mn' }) => {
  const isMn = language === 'mn';
  const [activeTopic, setActiveTopic] = useState<'hello' | 'variables' | 'loops' | 'memory'>('hello');

  const topics = {
    hello: {
      title: isMn ? '1. Хэвлэх үйлдэл (Printing)' : '1. Printing Output',
      pyCode: `print("Hello, Cyber Cadet!")`,
      cppCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Cyber Cadet!" << endl;
    return 0;
}`,
      explanation: isMn
        ? 'Python нь шууд 1 мөрөөр ажилладаг тайлбарлагч хэл (interpreted). C++ нь main() функц, толгой файл (#include), компиляци шаарддаг боловч шууд машины код болон ажилладаг тул илүү өндөр хурдтай.'
        : 'Python is concise and interpreted line-by-line. C++ requires boilerplate like main() and #include, but compiles directly to native CPU machine instructions for maximum speed.',
    },
    variables: {
      title: isMn ? '2. Хувьсагч ба Төрөл (Types)' : '2. Variables & Typing',
      pyCode: `age = 17
gpa = 3.9
# Dynamic typing: can reassign to any type`,
      cppCode: `int age = 17;
double gpa = 3.9;
// Static typing: checked at compile-time`,
      explanation: isMn
        ? 'Python нь динамик төрөлтэй тул хувьсагчийн төрлийг автоматаар танина. C++ нь статик төрөлтэй тул алдааг компиляцийн шатанд ажиллахаас нь өмнө илрүүлж чаддаг.'
        : 'Python uses dynamic typing for fast prototyping. C++ enforces static typing, catching type mismatches at compile time before execution.',
    },
    loops: {
      title: isMn ? '3. Давталт (Loops)' : '3. Iteration & Loops',
      pyCode: `for i in range(5):
    print(i)`,
      cppCode: `for (int i = 0; i < 5; ++i) {
    cout << i << " ";
}`,
      explanation: isMn
        ? 'Python-ий range() нь маш уншигдахуйц. C++-ийн for давталт нь тоолуурыг яг санах ойд бүртгэгч (CPU register) түвшинд маш нарийн удирдах боломж олгодог.'
        : 'Python range() is clean and Pythonic. C++ for loop gives complete micro-control over memory counters and can be optimized into CPU registers.',
    },
    memory: {
      title: isMn ? '4. Санах ойн удирдлага (Memory)' : '4. Memory Architecture',
      pyCode: `# Automatic Garbage Collection
user = {"name": "Orgil"}
# Python automatically reclaims memory`,
      cppCode: `// Stack (automatic) or Heap
auto user = make_unique<User>("Orgil");
// Modern C++ RAII cleans memory safely`,
      explanation: isMn
        ? 'Python нь Garbage Collector-оор санах ойг автоматаар цэвэрлэдэг. C++ нь санах ойн байршлыг програмист шууд заах боломжтой (RAII, smart pointers) тул тоглоом, үйлдлийн систем, сансрын төхөөрөмж зэрэгт сонгогддог.'
        : 'Python uses automated Garbage Collection. C++ provides direct deterministic memory control via Stack, Heap, and smart pointers, making it the industry standard for game engines, operating systems, and robotics.',
    },
  };

  const current = topics[activeTopic];

  return (
    <div className="rounded-3xl border border-emerald-500/25 bg-[#090d0b]/95 p-5 sm:p-6 backdrop-blur-xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/15 pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-cyan-500/15 p-2 text-cyan-400 border border-cyan-500/20">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{isMn ? 'Python vs C++ Зэрэгцүүлсэн шинжилгээ' : 'Python vs C++ Side-by-Side'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                COMPARISON
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isMn
                ? 'Нэг нь нөгөөгөөсөө "илүү" биш — аль алийг нь зорилгодоо тааруулан сурах нь мэргэжлийн инженер хүний ур чадвар'
                : 'Neither language is "better" — mastering both is the mark of a true software engineer'}
            </p>
          </div>
        </div>

        {/* Buttons for Topic Selection */}
        <div className="flex flex-wrap gap-1 bg-[#121a15] p-1 rounded-xl border border-emerald-500/20 text-xs font-mono">
          {(['hello', 'variables', 'loops', 'memory'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setActiveTopic(k)}
              className={`px-2.5 py-1 rounded-lg transition-all capitalize ${
                activeTopic === k ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Code Side-by-Side Comparison */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Python Column */}
        <div className="rounded-2xl border border-yellow-500/30 bg-[#16140c] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-yellow-500/20 pb-2 mb-3">
              <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                <span>🐍 PYTHON</span>
              </span>
              <span className="text-[10px] text-slate-400">Interpreted / Dynamic</span>
            </div>
            <pre className="text-yellow-200 bg-[#0c0a05] p-3 rounded-xl overflow-x-auto leading-relaxed border border-yellow-500/15">
              {current.pyCode}
            </pre>
          </div>
        </div>

        {/* C++ Column */}
        <div className="rounded-2xl border border-cyan-500/30 bg-[#0c1417] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <span>⚡ C++20</span>
              </span>
              <span className="text-[10px] text-slate-400">Compiled / Native CPU</span>
            </div>
            <pre className="text-cyan-200 bg-[#060a0c] p-3 rounded-xl overflow-x-auto leading-relaxed border border-cyan-500/15">
              {current.cppCode}
            </pre>
          </div>
        </div>
      </div>

      {/* Architectural Insight */}
      <div className="mt-4 rounded-2xl bg-[#070b09] p-4 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
        <strong className="text-emerald-400 font-mono block mb-1">
          💡 {isMn ? 'Инженерийн дүгнэлт:' : 'Engineering Insight:'}
        </strong>
        {current.explanation}
      </div>
    </div>
  );
};
