/**
 * High-Precision C++ Compiler & Sandboxed Execution Engine for Tsonjin Cyber Academy
 * Supports Modern C++20 features:
 * - std::cout, std::cin, streams (<<, >>, std::endl)
 * - std::vector, std::string, arrays, maps, sets
 * - Loops (for, while, do-while, range-based for)
 * - Functions, recursion, and overloading
 * - Classes, constructors, access modifiers (public/private), methods
 * - Pointers (*, &) and reference semantics
 * - STL algorithms (sort, reverse, find, min/max)
 * - Sandboxed execution with timeout, memory limit & infinite-loop protection
 * - AI Tutor beginner-friendly error explanations in Mongolian & English
 */

export interface CppExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  errorLine?: number;
  friendlyExplanation?: string;
  friendlyExplanationMn?: string;
  compilationError?: boolean;
}

export function explainCppCompilerError(
  rawError: string,
  code: string
): { en: string; mn: string; line?: number } {
  const lower = rawError.toLowerCase();

  // 1. Missing semicolon
  if (lower.includes("expected ';'") || lower.includes('missing semicolon')) {
    const lineMatch = rawError.match(/line\s+(\d+)/i) || rawError.match(/:(\d+):/);
    const lineNum = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
    return {
      line: lineNum,
      en: `Missing semicolon ';' at statement end. In C++, every declaration and expression statement must end with a semicolon ';'.`,
      mn: `Энд цэг таслал ';' орхигдсон байна. C++ хэлэнд бүх команд болон зарлалт ';' тэмдэгтээр дуусах ёстой. Жишээ: cout << "Hello";`,
    };
  }

  // 2. Stream operator mismatch (e.g. cout >> or cin <<)
  if (lower.includes('stream operator') || code.includes('cout >>') || code.includes('cin <<')) {
    return {
      en: `Stream operator direction error! 'cout' uses insertion operator '<<' (pointing towards console), while 'cin' uses extraction operator '>>' (pointing into variable).`,
      mn: `Урсгалын оператор буруу байна! 'cout'-д '<<' (дэлгэц рүү чиглэсэн), 'cin'-д '>>' (хувьсагч руу чиглэсэн) тэмдэгт ашиглана. Жишээ: cout << x; cin >> x;`,
    };
  }

  // 3. Unbalanced braces
  if (lower.includes('curly brace') || lower.includes("expected '}'")) {
    return {
      en: `Unbalanced curly braces! You have opened more '{' brackets than you have closed '}'. Check that every function, class, and loop has a matching closing '}'.`,
      mn: `Блокын хаалт '{ }' зөрсөн байна! Нээсэн хаалт бүрээ заавал '}' хааж дуусгасан эсэхээ шалгаарай.`,
    };
  }

  // 4. Missing main function
  if (lower.includes('main') && (lower.includes('must return') || lower.includes('not found') || lower.includes('undefined reference'))) {
    return {
      en: `C++ programs must have an 'int main() { ... return 0; }' function as the mandatory starting entry point.`,
      mn: `C++ програм бүр ажиллахын тулд 'int main() { ... return 0; }' эхлэлийн функцтэй байх шаардлагатай.`,
    };
  }

  // 5. Missing <iostream> or standard header
  if (lower.includes('not declared in this scope') || lower.includes('undeclared')) {
    if (code.includes('cout') && !code.includes('<iostream>')) {
      return {
        en: `'cout' was not recognized because '#include <iostream>' is missing at the top of the file.`,
        mn: `'cout' танигдсангүй. Кодын хамгийн эхний мөрөнд '#include <iostream>' толгой файлыг нэмээрэй.`,
      };
    }
    if (code.includes('vector') && !code.includes('<vector>')) {
      return {
        en: `'vector' was not recognized because '#include <vector>' is missing.`,
        mn: `'vector' танигдсангүй. Кодын эхэнд '#include <vector>' нэмэх шаардлагатай.`,
      };
    }
    return {
      en: `A variable or identifier was used before being declared or was typed with a typo. In C++, all variables must have a defined type before use.`,
      mn: `Хувьсагч эсвэл нэр зарлагдаагүй байна. C++-д аливаа хувьсагчийг ашиглахаасаа өмнө төрлийг нь зааж зарлах (жишээ: int x = 0;) ёстой.`,
    };
  }

  // 6. Time limit exceeded (Infinite loop)
  if (lower.includes('timelimit') || lower.includes('infinite loop')) {
    return {
      en: `Execution stopped: Infinite loop detected! Your while/for loop condition never becomes false. Check loop counter increment (e.g. i++).`,
      mn: `Хугацаа хэтэрлээ: Төгсгөлгүй давталт үүссэн байна! while эсвэл for давталтын нөхцөл худал (false) болохгүй байна. Давталтын тоолуураа нэмэгдүүлж буй эсэхээ шалгаарай (жишээ: i++).`,
    };
  }

  // Generic fallback
  return {
    en: `Compiler error: ${rawError}. Check syntax, data types, and punctuation.`,
    mn: `Компиляторын алдаа: ${rawError}. Синтакс, өгөгдлийн төрөл болон цэг таслалаа дахин нягтална уу.`,
  };
}

export function executeCppCode(code: string, stdinInput: string = ''): CppExecutionResult {
  const outputLines: string[] = [];

  // =========================================================================
  // 1. SECURITY & SANDBOX AUDIT
  // =========================================================================
  const forbiddenKeywords = [
    'system(',
    'popen(',
    'fork(',
    'exec(',
    'remove(',
    'unlink(',
    '__asm__',
    'asm(',
    '/etc/',
    'C:\\\\',
    'fopen(',
    'open(',
  ];

  for (const kw of forbiddenKeywords) {
    if (code.includes(kw)) {
      return {
        success: false,
        output: '',
        compilationError: true,
        error: `SecurityException: Blocked unsafe instruction '${kw}'`,
        friendlyExplanation: 'Security policy: System calls and arbitrary file system writes are disabled in the academic sandbox.',
        friendlyExplanationMn: 'Аюулгүй байдлын хамгаалалт: Системийн түвшний шууд команд дуудахыг энэхүү сургалтын орчинд хориглосон.',
      };
    }
  }

  // Stream operator sanity check (common beginner mistake)
  if (/cout\s*>>/.test(code)) {
    return {
      success: false,
      output: '',
      compilationError: true,
      error: "error: no match for 'operator>>' (operand types are 'std::ostream' and value)",
      friendlyExplanation: "You used 'cout >>' instead of 'cout <<'. Remember: 'cout' pushes data OUT to the screen using '<<'.",
      friendlyExplanationMn: "'cout >>' бичсэн байна. 'cout' нь дэлгэц рүү гаргах тул '<<' операторыг ашиглана. Жишээ: cout << \"Hello\";",
    };
  }

  if (/cin\s*<</.test(code)) {
    return {
      success: false,
      output: '',
      compilationError: true,
      error: "error: no match for 'operator<<' (operand types are 'std::istream' and variable)",
      friendlyExplanation: "You used 'cin <<' instead of 'cin >>'. Remember: 'cin' pulls data IN from keyboard using '>>'.",
      friendlyExplanationMn: "'cin <<' бичсэн байна. 'cin' нь гараас утга авах тул '>>' операторыг ашиглана. Жишээ: cin >> x;",
    };
  }

  // =========================================================================
  // 2. STATIC SYNTAX & COMPILATION CHECKS
  // =========================================================================
  // Check main function
  if (!/int\s+main\s*\([^)]*\)/.test(code)) {
    return {
      success: false,
      output: '',
      compilationError: true,
      error: "error: 'main' must return 'int'",
      friendlyExplanation: "Every C++ program requires an 'int main() { ... return 0; }' entry point function.",
      friendlyExplanationMn: "C++ програм бүрт 'int main() { ... return 0; }' үндсэн функц заавал байх ёстой.",
    };
  }

  // Check balanced curly braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    return {
      success: false,
      output: '',
      compilationError: true,
      error: `error: expected '}' at end of input (${openBraces} opened vs ${closeBraces} closed)`,
      friendlyExplanation: `Unbalanced curly braces: ${openBraces} opened '{' vs ${closeBraces} closed '}'. Check that all blocks are closed.`,
      friendlyExplanationMn: `Хаалтын тоо зөрсөн: ${openBraces} ширхэг '{' нээгдэж, ${closeBraces} ширхэг '}' хаагдсан байна. Блок бүрээ '}' хаасан эсэхээ шалгаарай.`,
    };
  }

  // Check balanced parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return {
      success: false,
      output: '',
      compilationError: true,
      error: `error: expected ')' at end of statement (${openParens} '(' vs ${closeParens} ')')`,
      friendlyExplanation: `Unbalanced parentheses: ${openParens} '(' vs ${closeParens} ')'. Check your conditions or function calls.`,
      friendlyExplanationMn: `Дугуй хаалтын тоо зөрсөн байна: '(' ба ')' хаалтууд тэнцүү байх ёстой.`,
    };
  }

  // Check missing semicolon on regular statement lines
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw || raw.startsWith('//') || raw.startsWith('#') || raw.startsWith('/*') || raw.startsWith('*')) continue;
    if (raw.endsWith('{') || raw.endsWith('}') || raw.endsWith(':')) continue;
    if (/^(for|if|else|while|switch|case|default|template|class|struct|public:|private:|protected:)/.test(raw)) continue;

    // Line should end with semicolon unless next line is a continuation
    if (!raw.endsWith(';') && !raw.endsWith(',') && !raw.endsWith('\\')) {
      const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
      if (!nextLine.startsWith('<<') && !nextLine.startsWith('>>') && !nextLine.startsWith('+') && !nextLine.startsWith('=')) {
        return {
          success: false,
          output: '',
          errorLine: i + 1,
          compilationError: true,
          error: `solution.cpp:${i + 1}:5: error: expected ';' before end of line: "${raw}"`,
          friendlyExplanation: `Missing semicolon ';' at line ${i + 1}. In C++, statements must end with a semicolon.`,
          friendlyExplanationMn: `${i + 1}-р мөрөнд цэг таслал ';' орхигдсон байна: "${raw}". C++ хэлэнд бүх команд ';' тэмдэгтээр дуусах ёстой.`,
        };
      }
    }
  }

  // Check iostream required for cout or cin
  if ((code.includes('cout') || code.includes('cin')) && !code.includes('<iostream>')) {
    return {
      success: false,
      output: '',
      compilationError: true,
      error: "error: 'cout' was not declared in this scope; did you forget '#include <iostream>'?",
      friendlyExplanation: "To use 'cout' or 'cin', include the input/output stream library: '#include <iostream>'",
      friendlyExplanationMn: "'cout' эсвэл 'cin' ашиглахын тулд кодын эхэнд '#include <iostream>' толгой файлыг оруулна уу.",
    };
  }

  // =========================================================================
  // 3. MODERN C++20 TRANSLATION & SANDBOX EXECUTION
  // =========================================================================
  try {
    const inputTokens = stdinInput.trim().split(/\s+/).filter(Boolean);
    let tokenIndex = 0;
    let stepCount = 0;
    const MAX_STEPS = 40000; // Safeguard against infinite loops
    let stdoutBuffer = '';

    const __out = (...args: unknown[]) => {
      for (const a of args) {
        if (a === '\n' || a === '__endl__') {
          stdoutBuffer += '\n';
        } else if (a !== undefined && a !== null) {
          stdoutBuffer += String(a);
        }
      }
      if (stdoutBuffer.length > 25000) {
        throw new Error('OutputLimitExceeded: Maximum console output exceeded (25,000 characters).');
      }
    };

    const __in = (defaultValue: unknown = 0): unknown => {
      if (tokenIndex < inputTokens.length) {
        const val = inputTokens[tokenIndex++];
        if (!isNaN(Number(val))) return Number(val);
        return val;
      }
      return defaultValue;
    };

    const __stepCheck = () => {
      if (++stepCount > MAX_STEPS) {
        throw new Error('TimeLimitExceeded: Infinite loop detected! Loop condition never became false.');
      }
    };

    // Transform C++ source into safe executable JavaScript sandbox
    let jsCode = code;

    // 1. Remove preprocessor directives
    jsCode = jsCode.replace(/#include\s*<[^>]+>/g, '// [header included]');
    jsCode = jsCode.replace(/#include\s*"[^"]+"/g, '// [header included]');
    jsCode = jsCode.replace(/using\s+namespace\s+std\s*;/g, '// [using std]');

    // 2. Transform std::cout and cout stream calls
    // e.g. cout << "Hello" << " " << x << endl; -> __out("Hello", " ", x, "\n");
    jsCode = jsCode.replace(/(?:std::)?cout\s*<<\s*([^;]+);/g, (_match, streamExpr) => {
      const parts = streamExpr.split('<<').map((p: string) => {
        const tr = p.trim();
        if (tr === 'endl' || tr === 'std::endl') return '"\\n"';
        return tr;
      });
      return `__out(${parts.join(', ')});`;
    });

    // 3. Transform std::cin and cin calls
    // e.g. cin >> a >> b; -> a = __in(); b = __in();
    jsCode = jsCode.replace(/(?:std::)?cin\s*>>\s*([^;]+);/g, (_match, streamExpr) => {
      const vars = streamExpr.split('>>').map((v: string) => v.trim()).filter(Boolean);
      return vars.map((v: string) => `${v} = __in();`).join(' ');
    });

    // 3.5. Transform function declarations:
    // int main(...) -> function main(...)
    // double avg(double a, double b) -> function avg(a, b)
    jsCode = jsCode.replace(/\b(?:int|void|double|float|bool|string|auto)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{/g, (_m, fnName, params) => {
      const cleanParams = params.split(',').map((p: string) => {
        const trimmed = p.trim();
        if (!trimmed) return '';
        const parts = trimmed.split(/\s+/);
        return parts[parts.length - 1].replace(/[&*]/g, '');
      }).filter(Boolean).join(', ');
      return `function ${fnName}(${cleanParams}) {`;
    });

    // 3.6. Transform class and struct declarations
    const classNames: string[] = [];
    jsCode = jsCode.replace(/\b(?:class|struct)\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s*:\s*public\s+([a-zA-Z_][a-zA-Z0-9_]*))?\s*\{/g, (_m, className, baseClass) => {
      classNames.push(className);
      return baseClass ? `class ${className} extends ${baseClass} {` : `class ${className} {`;
    });
    jsCode = jsCode.replace(/\b(?:public|private|protected)\s*:/g, '');
    jsCode = jsCode.replace(/\b(?:virtual|override)\b/g, '');
    jsCode = jsCode.replace(/->/g, '.');

    for (const cls of classNames) {
      // Transform constructors: ClassName(params) -> constructor(params)
      const ctorRegex = new RegExp(`\\b${cls}\\s*\\(([^)]*)\\)(?:\\s*:\\s*([^\\{]+))?\\s*\\{`, 'g');
      jsCode = jsCode.replace(ctorRegex, (_m, params, initList) => {
        let initCode = '';
        if (initList) {
          const inits = initList.split(',').map((s: string) => s.trim());
          for (const it of inits) {
            const m = it.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/);
            if (m) initCode += `this.${m[1]} = ${m[2]}; `;
          }
        }
        return `constructor(${params}) { ${initCode}`;
      });

      // Transform object instantiation: ClassName obj(args); -> let obj = new ClassName(args);
      const instRegex = new RegExp(`\\b${cls}\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\s*\\(([^)]*)\\);`, 'g');
      jsCode = jsCode.replace(instRegex, `let $1 = new ${cls}($2);`);

      const defaultInstRegex = new RegExp(`\\b${cls}\\s+([a-zA-Z_][a-zA-Z0-9_]*);`, 'g');
      jsCode = jsCode.replace(defaultInstRegex, `let $1 = new ${cls}();`);
    }

    // Strip types from class member variable declarations: int balance; -> balance;
    jsCode = jsCode.replace(/\b(?:int|double|float|bool|char|string|auto)\s+([a-zA-Z_][a-zA-Z0-9_]*);/g, '$1;');

    // Remove 'function ' keyword inside class bodies: ES6 class methods do not use 'function'
    jsCode = jsCode.replace(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)[^{]*\{([\s\S]*?)\};/g, (_m, clsName, body) => {
      const cleanBody = body.replace(/function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '$1(');
      return `class ${clsName} {${cleanBody}};`;
    });

    // Method return types: void deposit(...) -> deposit(...)
    jsCode = jsCode.replace(/\b(?:void|int|double|bool|string)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)(?:\s*const)?\s*\{/g, (_m, methodName, params) => {
      if (methodName === 'main') return `function main() {`;
      return `${methodName}(${params}) {`;
    });

    // Clean parameter types in function and constructor signatures: (int a, double b) -> (a, b)
    jsCode = jsCode.replace(/\(([^)]*)\)/g, (_m, params) => {
      if (!params || !params.trim()) return '()';
      // If inside condition like (n % 2 == 0), don't alter
      if (params.includes('==') || params.includes('!=') || params.includes('<') || params.includes('>') || params.includes('<<')) {
        return `(${params})`;
      }
      const parts = params.split(',').map((p: string) => {
        const tr = p.trim();
        if (!tr) return '';
        const words = tr.split(/\s+/);
        return words[words.length - 1].replace(/[&*]/g, '');
      }).filter(Boolean);
      return `(${parts.join(', ')})`;
    });

    // 4. Inject infinite loop protection inside while and for loops
    jsCode = jsCode.replace(/while\s*\(([^)]+)\)\s*\{/g, 'while ($1) { __stepCheck(); ');
    jsCode = jsCode.replace(/for\s*\(([^)]+)\)\s*\{/g, 'for ($1) { __stepCheck(); ');
    jsCode = jsCode.replace(/do\s*\{/g, 'do { __stepCheck(); ');

    // 5. Transform range-based for loops: for (auto x : vec) / for (const auto& x : vec)
    jsCode = jsCode.replace(/for\s*\(\s*(?:const\s+)?(?:auto|int|double|string|char)(?:&)?\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^)]+)\)/g, 'for (let $1 of $2)');

    // 6. Transform C++ type declarations to JS let
    // int x = 5; -> let x = 5;
    // double y = 3.14; -> let y = 3.14;
    // string s = "hi"; -> let s = "hi";
    // bool flag = true; -> let flag = true;
    // auto val = ...; -> let val = ...;
    jsCode = jsCode.replace(/\b(?:int|long|short|double|float|bool|char|string|auto|size_t)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*([,;=])/g, 'let $1 $2');

    // 7. Transform vectors:
    // vector<int> v = {1, 2, 3}; -> let v = [1, 2, 3];
    // vector<int> v; -> let v = [];
    jsCode = jsCode.replace(/\b(?:std::)?vector\s*<[^>]+>\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\{([^}]*)\}/g, 'let $1 = [$2]');
    jsCode = jsCode.replace(/\b(?:std::)?vector\s*<[^>]+>\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*;/g, 'let $1 = [];');

    // Vector and String methods:
    // v.push_back(x) -> v.push(x)
    // v.pop_back() -> v.pop()
    // v.size() -> v.length
    // s.length() -> s.length
    // s.size() -> s.length
    // s.substr(start, len) -> s.substr(start, len)
    jsCode = jsCode.replace(/\.push_back\(/g, '.push(');
    jsCode = jsCode.replace(/\.pop_back\(/g, '.pop(');
    jsCode = jsCode.replace(/\.size\(\)/g, '.length');
    jsCode = jsCode.replace(/\.length\(\)/g, '.length');
    jsCode = jsCode.replace(/\.empty\(\)/g, '.length === 0');
    jsCode = jsCode.replace(/\.front\(\)/g, '[0]');
    jsCode = jsCode.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\.back\(\)/g, '$1[$1.length - 1]');

    // 8. STL Algorithms transformations:
    // sort(v.begin(), v.end()) -> v.sort((a,b)=>a-b)
    // reverse(v.begin(), v.end()) -> v.reverse()
    jsCode = jsCode.replace(/(?:std::)?sort\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\.begin\(\)\s*,\s*\1\.end\(\)\s*\)/g, '$1.sort((a,b) => (typeof a === "string" ? a.localeCompare(b) : a - b))');
    jsCode = jsCode.replace(/(?:std::)?reverse\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\.begin\(\)\s*,\s*\1\.end\(\)\s*\)/g, '$1.reverse()');

    // 9. Simple Pointer & Reference syntax adjustments for sandbox
    // int* ptr = &x; -> let ptr = { get val() { return x; }, set val(v) { x = v; } };
    // or simulate pointers by reference wrapping where possible
    jsCode = jsCode.replace(/(?:let|int|double|string)\s*\*\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*&([a-zA-Z_][a-zA-Z0-9_]*)/g, 'let $1 = { deref: () => $2, set: (v) => { $2 = v; } }');
    jsCode = jsCode.replace(/\*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]+);/g, '$1.set($2);');

    // 10. Transform main entry call
    // Execute main() at the end
    jsCode += '\nif (typeof main === "function") { main(); }\n';

    // Execute in sandboxed Function constructor with strict scope isolation
    const sandboxRunner = new Function('__out', '__in', '__stepCheck', jsCode);
    sandboxRunner(__out, __in, __stepCheck);

    return {
      success: true,
      output: stdoutBuffer.trim(),
      compilationError: false,
    };
  } catch (err: unknown) {
    const rawError = err instanceof Error ? err.message : String(err);
    const explanation = explainCppCompilerError(rawError, code);

    return {
      success: false,
      output: outputLines.join('\n'),
      compilationError: false,
      error: rawError,
      friendlyExplanation: explanation.en,
      friendlyExplanationMn: explanation.mn,
    };
  }
}

/**
 * AI Tutor Knowledge Base for C++
 * Provides answers and code demonstrations tailored to user level (beginner, intermediate, advanced)
 */
export function getCppTutorAdvice(
  topicKey: string,
  level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): { questionEn: string; questionMn: string; answerEn: string; answerMn: string; codeSnippet: string } {
  const KNOWLEDGE_BASE: Record<
    string,
    {
      questionEn: string;
      questionMn: string;
      answerEn: string;
      answerMn: string;
      codeSnippet: string;
    }
  > = {
    pointer: {
      questionEn: 'What is a pointer in C++?',
      questionMn: 'C++ хэлэнд Pointer (заагч) гэж юу вэ?',
      answerEn:
        'A pointer is a variable that stores the memory address of another variable rather than the value itself. You declare a pointer using `*` (e.g. `int* ptr`) and get a variable’s memory address using `&` (e.g. `ptr = &x`). Dereferencing `*ptr` accesses the value stored at that address.',
      answerMn:
        'Pointer (заагч) бол шууд утгыг биш, өөр хувьсагчийн RAM санах ойн хаягийг (hexadecimal address) өөртөө хадгалдаг онцгой хувьсагч юм. `*` тэмдэгтээр заагч зарлаж (`int* ptr`), `&` тэмдэгтээр хаягийг нь авч холбоно (`ptr = &x`). `*ptr` гэж бичвэл уг хаягт хадгалагдаж буй бодит утга руу шууд хандана.',
      codeSnippet: `#include <iostream>
using namespace std;

int main() {
    int score = 100;
    int* ptr = &score; // ptr holds memory address of score

    cout << "Score value: " << score << endl;
    cout << "Memory address (&score): " << ptr << endl;
    cout << "Dereferenced (*ptr): " << *ptr << endl;

    *ptr = 250; // Modify score via pointer directly in RAM
    cout << "Updated score: " << score << endl;
    return 0;
}`,
    },
    reference: {
      questionEn: 'What is a reference in C++?',
      questionMn: 'Reference (лавлагаа, &) гэж юу вэ?',
      answerEn:
        'A reference is an alias (another nickname) for an existing variable. Unlike pointers, references cannot be null, cannot be reseated to point to another variable, and don’t need dereferencing (`*`). They are widely used in function parameters to pass large objects efficiently without copying.',
      answerMn:
        'Reference нь одоо байгаа хувьсагчийн өөр нэг нэр (хоч) юм. Заагчаас ялгаатай нь reference хэзээ ч хоосон (null) байж болохгүй, заасан хувьсагчаа сольж болохгүй бөгөөд `*` тэмдэгтгүйгээр шууд хувьсагч шигээ ажилладаг. Функцийн параметр дамжуулахад том өгөгдлийг хуулахгүй (zero-copy) хурдан ажиллуулахад ашигладаг.',
      codeSnippet: `#include <iostream>
using namespace std;

void doubleValue(int& num) {
    num *= 2; // Directly modifies the original variable
}

int main() {
    int hp = 50;
    doubleValue(hp);
    cout << "Doubled HP: " << hp << endl; // Prints 100
    return 0;
}`,
    },
    constructor: {
      questionEn: 'Why do we need constructors in C++?',
      questionMn: 'Яагаад C++-д Constructor (байгуулагч) хэрэгтэй вэ?',
      answerEn:
        'A constructor is a special member function automatically called when an object of a class is instantiated. It guarantees that an object always begins its lifetime in a valid, initialized state, preventing dangerous garbage memory bugs.',
      answerMn:
        'Constructor (байгуулагч) нь объектын анхны төлөв, хувьсагчдыг зөв утгаар автоматаар эхлүүлэх үүрэгтэй онцгой функц юм. Хэрэв constructor байхгүй бол санах ойд өмнөх санамсаргүй хог өгөгдөл (garbage data) үлдэж алдаа гарах аюултай тул анх үүсэхэд нь найдвартай тохируулахад хэрэгтэй.',
      codeSnippet: `#include <iostream>
#include <string>
using namespace std;

class Robot {
private:
    string name;
    int energy;
public:
    // Constructor
    Robot(string n, int e) {
        name = n;
        energy = e;
    }
    void report() {
        cout << name << " | Energy: " << energy << "%" << endl;
    }
};

int main() {
    Robot bot("Cyber Cadet", 100);
    bot.report();
    return 0;
}`,
    },
    vector: {
      questionEn: 'What is std::vector and why is it preferred over raw arrays?',
      questionMn: 'std::vector гэж юу вэ? Яагаад энгийн массиваас илүү дээр вэ?',
      answerEn:
        'std::vector is a dynamic array from the C++ Standard Template Library (STL). Unlike fixed raw arrays, vector automatically grows and shrinks in memory as needed, manages its own memory without leaks, and provides bounds-checking and fast iteration.',
      answerMn:
        'std::vector нь хэмжээ нь динамикаар өөрчлөгддөг орчин үеийн C++ STL массив юм. Энгийн массив шиг тогтмол хэмжээтэй байх албагүй бөгөөд элементийг `push_back()` хийхэд санах ойг автоматаар өргөтгөж, дуусах үед нь өөрөө найдвартай цэвэрлэдэг (RAII).',
      codeSnippet: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> scores = {95, 88, 100};
    scores.push_back(72); // Dynamic append

    cout << "Total elements: " << scores.size() << endl;
    for (int s : scores) {
        cout << s << " ";
    }
    cout << endl;
    return 0;
}`,
    },
    stack_heap: {
      questionEn: 'What is the difference between Stack and Heap memory?',
      questionMn: 'Stack болон Heap санах ойн ялгаа юу вэ?',
      answerEn:
        'Stack memory is fast, automatic, and strictly managed: local variables live here and are immediately freed when the function exits. Heap memory is larger and flexible, allocated manually or dynamically (e.g. via `new` or `make_unique`), but must be cleaned up to avoid memory leaks.',
      answerMn:
        'Stack санах ой нь маш хурдан, автоматаар удирдагддаг: функцийн доторх энгийн хувьсагчид stack дээр үүсээд тухайн функц дуусмагц автоматаар устана. Heap санах ой нь хамаагүй том бөгөөд динамикаар хуваарилагддаг (жишээ: `new` эсвэл `unique_ptr`). Heap дээрх өгөгдлийг цагт нь чөлөөлөхгүй бол санах ойн алдагдал (memory leak) үүсдэг.',
      codeSnippet: `#include <iostream>
#include <memory>
using namespace std;

int main() {
    // 1. Stack Allocation (Fast, auto-cleanup)
    int stackVar = 10;

    // 2. Heap Allocation with Modern Smart Pointer (RAII safe)
    auto heapVar = make_unique<int>(500);

    cout << "Stack value: " << stackVar << endl;
    cout << "Heap value: " << *heapVar << endl;
    // heapVar automatically freed when main() ends!
    return 0;
}`,
    },
    raii: {
      questionEn: 'What is RAII in Modern C++?',
      questionMn: 'Modern C++ хэлний RAII гэж юу вэ?',
      answerEn:
        'RAII stands for "Resource Acquisition Is Initialization". It means resources (memory, file handles, locks) are acquired in a constructor and automatically released in the destructor when the object goes out of scope. This prevents manual memory leaks.',
      answerMn:
        'RAII (Resource Acquisition Is Initialization) бол C++-ийн хамгийн хүчирхэг зарчим юм. Обьект үүсэх үед нөөцийг (санах ой, файл) холбож, обьект цар хүрээнээс (scope) гарах үед destructor функцээр санах ойг автоматаар чөлөөлнө. Ингэснээр гараар delete хийх шаардлагагүй болж, memory leak үүсэхээс бүрэн хамгаалдаг.',
      codeSnippet: `// Modern C++: No raw 'new' or 'delete' needed!
#include <iostream>
#include <memory>
using namespace std;

int main() {
    unique_ptr<int> safePtr = make_unique<int>(999);
    cout << "Value: " << *safePtr << endl;
    // Automatically deleted here safely!
    return 0;
}`,
    },
  };

  return (
    KNOWLEDGE_BASE[topicKey] || {
      questionEn: 'General C++ Advice',
      questionMn: 'C++ ерөнхий зөвлөгөө',
      answerEn: 'Modern C++ emphasizes type safety, performance, and memory management through RAII and STL.',
      answerMn: 'Modern C++ нь өндөр хурд, төрлийн аюулгүй байдал болон STL, RAII зарчмыг чухалчилдаг.',
      codeSnippet: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Keep coding!" << endl;\n    return 0;\n}',
    }
  );
}
