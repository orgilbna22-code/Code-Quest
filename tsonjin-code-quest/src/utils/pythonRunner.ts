/**
 * Lightweight safe Python execution simulator for educational coding challenges.
 * Designed to safely run beginner Python code (print, variables, arithmetic,
 * simple conditions, loops, lists, functions) and produce terminal output.
 */

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  variables: Record<string, unknown>;
}

export function executePythonCode(code: string): ExecutionResult {
  const outputLines: string[] = [];
  const scope: Record<string, unknown> = {};

  try {
    const rawLines = code.split('\n');

    // Basic syntax and safety checks
    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      // Check for unclosed quotes
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      if (singleQuotes % 2 !== 0 && !line.includes('"')) {
        return {
          success: false,
          output: '',
          error: `SyntaxError: EOL while scanning string literal (line ${i + 1})`,
          variables: scope,
        };
      }
      if (doubleQuotes % 2 !== 0 && !line.includes("'")) {
        return {
          success: false,
          output: '',
          error: `SyntaxError: EOL while scanning string literal (line ${i + 1})`,
          variables: scope,
        };
      }
    }

    // Step-by-step lightweight interpreter
    let i = 0;
    while (i < rawLines.length) {
      let line = rawLines[i].trim();
      i++;

      if (!line || line.startsWith('#')) {
        continue;
      }

      // 1. Check for print statement: print(...)
      const printMatch = line.match(/^print\s*\((.*)\)$/);
      if (printMatch) {
        const inner = printMatch[1].trim();
        const evaluated = evaluatePrintExpression(inner, scope);
        outputLines.push(evaluated);
        continue;
      }

      // 2. Check for variable assignment: var_name = expression
      const assignMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const valExpr = assignMatch[2].trim();
        const value = evaluateExpression(valExpr, scope);
        scope[varName] = value;
        continue;
      }

      // 3. Simple for loop: for x in range(N): or for item in list:
      const forRangeMatch = line.match(/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\(([^)]+)\):$/);
      if (forRangeMatch) {
        const loopVar = forRangeMatch[1];
        const rangeArgs = forRangeMatch[2].split(',').map((s) => Number(evaluateExpression(s.trim(), scope)));
        let start = 0;
        let end = 0;
        let step = 1;
        if (rangeArgs.length === 1) {
          end = rangeArgs[0];
        } else if (rangeArgs.length === 2) {
          start = rangeArgs[0];
          end = rangeArgs[1];
        } else if (rangeArgs.length >= 3) {
          start = rangeArgs[0];
          end = rangeArgs[1];
          step = rangeArgs[2];
        }

        // Collect indented block
        const block: string[] = [];
        while (i < rawLines.length && (rawLines[i].startsWith('    ') || rawLines[i].startsWith('\t'))) {
          block.push(rawLines[i].trim());
          i++;
        }

        const maxIters = 100;
        let iters = 0;
        for (let v = start; step > 0 ? v < end : v > end; v += step) {
          scope[loopVar] = v;
          for (const bLine of block) {
            const pMatch = bLine.match(/^print\s*\((.*)\)$/);
            if (pMatch) {
              outputLines.push(evaluatePrintExpression(pMatch[1].trim(), scope));
            }
          }
          iters++;
          if (iters > maxIters) break;
        }
        continue;
      }

      // 4. Simple if / else
      const ifMatch = line.match(/^if\s+(.+):$/);
      if (ifMatch) {
        const condition = ifMatch[1].trim();
        const condResult = evaluateCondition(condition, scope);

        // Collect if block
        const ifBlock: string[] = [];
        while (i < rawLines.length && (rawLines[i].startsWith('    ') || rawLines[i].startsWith('\t'))) {
          ifBlock.push(rawLines[i].trim());
          i++;
        }

        // Check for optional else block
        const elseBlock: string[] = [];
        if (i < rawLines.length && rawLines[i].trim() === 'else:') {
          i++; // skip 'else:'
          while (i < rawLines.length && (rawLines[i].startsWith('    ') || rawLines[i].startsWith('\t'))) {
            elseBlock.push(rawLines[i].trim());
            i++;
          }
        }

        const targetBlock = condResult ? ifBlock : elseBlock;
        for (const bLine of targetBlock) {
          const pMatch = bLine.match(/^print\s*\((.*)\)$/);
          if (pMatch) {
            outputLines.push(evaluatePrintExpression(pMatch[1].trim(), scope));
          }
        }
        continue;
      }

      // 5. List append or pop: var.append(...)
      const appendMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\.append\((.+)\)$/);
      if (appendMatch) {
        const listName = appendMatch[1];
        const itemVal = evaluateExpression(appendMatch[2].trim(), scope);
        if (Array.isArray(scope[listName])) {
          (scope[listName] as unknown[]).push(itemVal);
        }
        continue;
      }
    }

    return {
      success: true,
      output: outputLines.join('\n'),
      variables: scope,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      output: outputLines.join('\n'),
      error: `Error: ${errorMsg}`,
      variables: scope,
    };
  }
}

function evaluatePrintExpression(expr: string, scope: Record<string, unknown>): string {
  if (!expr) return '';
  // Support comma-separated arguments: print("Hello", name, "!")
  const parts = splitTopLevelCommas(expr);
  return parts.map((part) => String(evaluateExpression(part.trim(), scope))).join(' ');
}

function splitTopLevelCommas(str: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inDouble = false;
  let inSingle = false;
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '(' && !inDouble && !inSingle) parenDepth++;
    else if (ch === ')' && !inDouble && !inSingle) parenDepth--;

    if (ch === ',' && !inDouble && !inSingle && parenDepth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function evaluateExpression(expr: string, scope: Record<string, unknown>): unknown {
  expr = expr.trim();

  // String literals
  if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.slice(1, -1);
  }

  // Numbers
  if (/^-?\d+$/.test(expr)) {
    return parseInt(expr, 10);
  }
  if (/^-?\d+\.\d+$/.test(expr)) {
    return parseFloat(expr);
  }

  // Booleans
  if (expr === 'True') return true;
  if (expr === 'False') return false;

  // Lists: [1, 2, 3] or ["a", "b"]
  if (expr.startsWith('[') && expr.endsWith(']')) {
    const inner = expr.slice(1, -1).trim();
    if (!inner) return [];
    return splitTopLevelCommas(inner).map((item) => evaluateExpression(item.trim(), scope));
  }

  // f-strings: f"Hello {name}"
  if (expr.startsWith('f"') && expr.endsWith('"')) {
    const inner = expr.slice(2, -1);
    return inner.replace(/\{([^}]+)\}/g, (_, varName) => {
      const v = evaluateExpression(varName.trim(), scope);
      return String(v !== undefined ? v : '');
    });
  }

  // len(x)
  const lenMatch = expr.match(/^len\((.*)\)$/);
  if (lenMatch) {
    const val = evaluateExpression(lenMatch[1].trim(), scope);
    if (Array.isArray(val) || typeof val === 'string') return val.length;
    return 0;
  }

  // List index: my_list[0]
  const indexMatch = expr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\[(\d+)\]$/);
  if (indexMatch) {
    const listVal = scope[indexMatch[1]];
    const idx = parseInt(indexMatch[2], 10);
    if (Array.isArray(listVal)) {
      return listVal[idx];
    }
  }

  // Variable lookup
  if (Object.prototype.hasOwnProperty.call(scope, expr)) {
    return scope[expr];
  }

  // Simple arithmetic / concatenation: e.g. 5 + 3 or "a" + "b"
  if (expr.includes('+')) {
    const parts = expr.split('+').map((p) => evaluateExpression(p.trim(), scope));
    if (typeof parts[0] === 'string' || typeof parts[1] === 'string') {
      return parts.map(String).join('');
    }
    return (parts[0] as number) + (parts[1] as number);
  }
  if (expr.includes('*')) {
    const parts = expr.split('*').map((p) => evaluateExpression(p.trim(), scope));
    if (typeof parts[0] === 'string' && typeof parts[1] === 'number') {
      return parts[0].repeat(parts[1]);
    }
    return (parts[0] as number) * (parts[1] as number);
  }
  if (expr.includes('-')) {
    const parts = expr.split('-').map((p) => evaluateExpression(p.trim(), scope));
    return (parts[0] as number) - (parts[1] as number);
  }

  return expr;
}

function evaluateCondition(cond: string, scope: Record<string, unknown>): boolean {
  cond = cond.trim();
  if (cond.includes('==')) {
    const [left, right] = cond.split('==').map((p) => evaluateExpression(p.trim(), scope));
    return left === right;
  }
  if (cond.includes('!=')) {
    const [left, right] = cond.split('!=').map((p) => evaluateExpression(p.trim(), scope));
    return left !== right;
  }
  if (cond.includes('>=')) {
    const [left, right] = cond.split('>=').map((p) => Number(evaluateExpression(p.trim(), scope)));
    return left >= right;
  }
  if (cond.includes('<=')) {
    const [left, right] = cond.split('<=').map((p) => Number(evaluateExpression(p.trim(), scope)));
    return left <= right;
  }
  if (cond.includes('>')) {
    const [left, right] = cond.split('>').map((p) => Number(evaluateExpression(p.trim(), scope)));
    return left > right;
  }
  if (cond.includes('<')) {
    const [left, right] = cond.split('<').map((p) => Number(evaluateExpression(p.trim(), scope)));
    return left < right;
  }
  return Boolean(evaluateExpression(cond, scope));
}
