export interface Token {
  type: 'IDENTIFIER' | 'NUMBER' | 'OPERATOR' | 'EQUALS' | 'LPAREN' | 'RPAREN' | 'COMMENT' | 'UNKNOWN';
  value: string;
  line: number;
}

export type ASTExpression =
  | { type: 'Literal'; value: number; raw: string }
  | { type: 'Identifier'; name: string }
  | { type: 'BinaryExpression'; operator: string; left: ASTExpression; right: ASTExpression }
  | { type: 'FunctionCall'; name: string; args: ASTExpression[] }
  | { type: 'UnknownExpression'; raw: string };

export interface StatementAST {
  id: string;
  lineNum: number;
  variable: string;
  expression: ASTExpression;
  originalText: string;
}

export interface OptimizationStep {
  name: string; // "Original Code" | "Constant Folding" | "Constant Propagation" | "Common Subexpression Elimination"
  code: string;
  ast: StatementAST[];
  symbolTable: Record<string, string>;
  tac: string[];
}

export interface SimulationResult {
  lexerSteps: { line: number; tokens: Token[] }[];
  originalCode: string;
  phases: {
    lexical: string;
    syntax: string;
    semantic: string;
    intermediate: string;
    optimization: string;
    codegen: string;
  };
  steps: OptimizationStep[];
  finalCode: string;
  symbolTable: Record<string, string>;
  ast: StatementAST[];
  tac: string[];
  stats: {
    expressionsReduced: number;
    executionSpeedup: number;
    memorySavedBytes: number;
    redundantOpsRemoved: number;
  };
}

// ----------------------------------------------------
// 1. Lexical Analysis
// ----------------------------------------------------
export function tokenize(code: string): { line: number; tokens: Token[] }[] {
  const lines = code.split('\n');
  return lines.map((lineText, idx) => {
    const lineNum = idx + 1;
    const tokens: Token[] = [];
    let i = 0;
    
    // Check for comment line
    const trimmedLine = lineText.trim();
    if (trimmedLine.startsWith('#') || trimmedLine.startsWith('//')) {
      tokens.push({ type: 'COMMENT', value: lineText, line: lineNum });
      return { line: lineNum, tokens };
    }

    while (i < lineText.length) {
      const char = lineText[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Check for operators
      if (['+', '-', '*', '/', '%', '='].includes(char)) {
        // Handle double operators like **
        if (char === '*' && lineText[i + 1] === '*') {
          tokens.push({ type: 'OPERATOR', value: '**', line: lineNum });
          i += 2;
        } else if (char === '=') {
          tokens.push({ type: 'EQUALS', value: '=', line: lineNum });
          i++;
        } else {
          tokens.push({ type: 'OPERATOR', value: char, line: lineNum });
          i++;
        }
        continue;
      }

      // Parentheses
      if (char === '(') {
        tokens.push({ type: 'LPAREN', value: '(', line: lineNum });
        i++;
        continue;
      }
      if (char === ')') {
        tokens.push({ type: 'RPAREN', value: ')', line: lineNum });
        i++;
        continue;
      }

      // Check for numbers (literals)
      if (/\d/.test(char) || (char === '.' && /\d/.test(lineText[i + 1] || ''))) {
        let numStr = '';
        while (i < lineText.length && (/\d/.test(lineText[i]) || lineText[i] === '.')) {
          numStr += lineText[i];
          i++;
        }
        tokens.push({ type: 'NUMBER', value: numStr, line: lineNum });
        continue;
      }

      // Check for Identifiers
      if (/[a-zA-Z_]/.test(char)) {
        let idStr = '';
        while (i < lineText.length && /[a-zA-Z0-9_]/.test(lineText[i])) {
          idStr += lineText[i];
          i++;
        }
        tokens.push({ type: 'IDENTIFIER', value: idStr, line: lineNum });
        continue;
      }

      // Unknown character
      tokens.push({ type: 'UNKNOWN', value: char, line: lineNum });
      i++;
    }

    return { line: lineNum, tokens };
  });
}

// ----------------------------------------------------
// 2. Syntax Analysis (Parser)
// ----------------------------------------------------
export function parseExpression(exprStr: string): ASTExpression {
  exprStr = exprStr.trim();
  if (!exprStr) {
    return { type: 'UnknownExpression', raw: '' };
  }

  // Check if it's a simple number
  if (/^\d+(\.\d+)?$/.test(exprStr)) {
    return { type: 'Literal', value: parseFloat(exprStr), raw: exprStr };
  }

  // Check if it's a simple identifier
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(exprStr)) {
    return { type: 'Identifier', name: exprStr };
  }

  // Precedence helper
  const operators = [
    { op: '+', prec: 1 },
    { op: '-', prec: 1 },
    { op: '*', prec: 2 },
    { op: '/', prec: 2 },
    { op: '%', prec: 2 },
    { op: '**', prec: 3 },
  ];

  // Scan operators outside of parentheses
  let bestOpIndex = -1;
  let bestPrec = Infinity;
  let parenDepth = 0;

  for (let i = exprStr.length - 1; i >= 0; i--) {
    const char = exprStr[i];
    if (char === ')') parenDepth++;
    else if (char === '(') parenDepth--;
    else if (parenDepth === 0) {
      // Check for double operator **
      if (char === '*' && i > 0 && exprStr[i - 1] === '*') {
        const matchingOp = operators.find(o => o.op === '**');
        if (matchingOp && matchingOp.prec <= bestPrec) {
          bestPrec = matchingOp.prec;
          bestOpIndex = i - 1;
        }
        i--; // Skip next character
      } else {
        const matchingOp = operators.find(o => o.op === char);
        if (matchingOp) {
          if (matchingOp.prec < bestPrec) {
            bestPrec = matchingOp.prec;
            bestOpIndex = i;
          }
        }
      }
    }
  }

  if (bestOpIndex !== -1) {
    const isDoubleStar = exprStr.substring(bestOpIndex, bestOpIndex + 2) === '**';
    const operator = isDoubleStar ? '**' : exprStr[bestOpIndex];
    const leftStr = exprStr.substring(0, bestOpIndex).trim();
    const rightStr = exprStr.substring(bestOpIndex + (isDoubleStar ? 2 : 1)).trim();
    return {
      type: 'BinaryExpression',
      operator,
      left: parseExpression(leftStr),
      right: parseExpression(rightStr)
    };
  }

  // Check if fully parenthesized
  if (exprStr.startsWith('(') && exprStr.endsWith(')')) {
    return parseExpression(exprStr.substring(1, exprStr.length - 1));
  }

  // Check for simple function calls: input(), rand()
  const funcMatch = exprStr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/);
  if (funcMatch) {
    const name = funcMatch[1];
    const argsStr = funcMatch[2].trim();
    const args = argsStr ? argsStr.split(',').map(arg => parseExpression(arg.trim())) : [];
    return { type: 'FunctionCall', name, args };
  }

  return { type: 'UnknownExpression', raw: exprStr };
}

export function parseProgram(code: string): StatementAST[] {
  const lines = code.split('\n');
  const ast: StatementAST[] = [];

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmed = lineText.trim();

    // Skip empty lines or comments
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
      return;
    }

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      // Just an expression statement or other statement
      ast.push({
        id: `stmt_${lineNum}_${Math.random().toString(36).substr(2, 4)}`,
        lineNum,
        variable: '_',
        expression: parseExpression(trimmed),
        originalText: lineText
      });
      return;
    }

    const variable = trimmed.substring(0, eqIndex).trim();
    const rhsStr = trimmed.substring(eqIndex + 1).trim();

    // Check if variable name is valid identifier
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable)) {
      ast.push({
        id: `stmt_${lineNum}_${Math.random().toString(36).substr(2, 4)}`,
        lineNum,
        variable,
        expression: parseExpression(rhsStr),
        originalText: lineText
      });
    } else {
      ast.push({
        id: `stmt_${lineNum}_${Math.random().toString(36).substr(2, 4)}`,
        lineNum,
        variable: '_',
        expression: parseExpression(trimmed),
        originalText: lineText
      });
    }
  });

  return ast;
}

// Convert expression back to string representation
export function expressionToString(expr: ASTExpression): string {
  if (expr.type === 'Literal') return expr.raw;
  if (expr.type === 'Identifier') return expr.name;
  if (expr.type === 'BinaryExpression') {
    return `${expressionToString(expr.left)} ${expr.operator} ${expressionToString(expr.right)}`;
  }
  if (expr.type === 'FunctionCall') {
    return `${expr.name}(${expr.args.map(expressionToString).join(', ')})`;
  }
  return expr.raw;
}

export function astToCode(statements: StatementAST[]): string {
  return statements
    .map(st => {
      if (st.variable === '_') {
        return expressionToString(st.expression);
      }
      return `${st.variable} = ${expressionToString(st.expression)}`;
    })
    .join('\n');
}

// ----------------------------------------------------
// 3. Intermediate Code Generation (TAC)
// ----------------------------------------------------
export function generateTAC(statements: StatementAST[]): string[] {
  const tacLines: string[] = [];
  let tempCounter = 1;

  function processExpr(expr: ASTExpression): string {
    if (expr.type === 'Literal') return expr.raw;
    if (expr.type === 'Identifier') return expr.name;
    if (expr.type === 'BinaryExpression') {
      const leftTemp = processExpr(expr.left);
      const rightTemp = processExpr(expr.right);
      const newTemp = `t${tempCounter++}`;
      tacLines.push(`${newTemp} = ${leftTemp} ${expr.operator} ${rightTemp}`);
      return newTemp;
    }
    if (expr.type === 'FunctionCall') {
      const argTemps = expr.args.map(arg => processExpr(arg));
      argTemps.forEach(temp => {
        tacLines.push(`param ${temp}`);
      });
      const newTemp = `t${tempCounter++}`;
      tacLines.push(`${newTemp} = call ${expr.name}, ${expr.args.length}`);
      return newTemp;
    }
    return expr.raw;
  }

  statements.forEach(stmt => {
    if (stmt.variable === '_') {
      processExpr(stmt.expression);
    } else {
      const rhsTemp = processExpr(stmt.expression);
      tacLines.push(`${stmt.variable} = ${rhsTemp}`);
    }
  });

  return tacLines;
}

// ----------------------------------------------------
// 4. Optimization Passes
// ----------------------------------------------------

// A. Constant Folding
export function foldExpression(expr: ASTExpression, statsRef?: { foldingCount: number }): ASTExpression {
  if (expr.type === 'BinaryExpression') {
    const leftFolded = foldExpression(expr.left, statsRef);
    const rightFolded = foldExpression(expr.right, statsRef);

    if (leftFolded.type === 'Literal' && rightFolded.type === 'Literal') {
      const lVal = leftFolded.value;
      const rVal = rightFolded.value;
      let result = 0;
      switch (expr.operator) {
        case '+': result = lVal + rVal; break;
        case '-': result = lVal - rVal; break;
        case '*': result = lVal * rVal; break;
        case '/': result = rVal !== 0 ? lVal / rVal : 0; break;
        case '%': result = rVal !== 0 ? lVal % rVal : 0; break;
        case '**': result = Math.pow(lVal, rVal); break;
        default: return { type: 'BinaryExpression', operator: expr.operator, left: leftFolded, right: rightFolded };
      }
      if (statsRef) statsRef.foldingCount++;
      // Format number to clean output
      const rawVal = Number.isInteger(result) ? result.toString() : result.toFixed(4);
      return { type: 'Literal', value: result, raw: rawVal };
    }

    return { type: 'BinaryExpression', operator: expr.operator, left: leftFolded, right: rightFolded };
  }

  if (expr.type === 'FunctionCall') {
    return {
      type: 'FunctionCall',
      name: expr.name,
      args: expr.args.map(arg => foldExpression(arg, statsRef))
    };
  }

  return expr;
}

export function runConstantFolding(statements: StatementAST[], statsRef?: { foldingCount: number }): { ast: StatementAST[]; symbolTable: Record<string, string> } {
  const foldedAST = statements.map(stmt => {
    const foldedExpr = foldExpression(stmt.expression, statsRef);
    return {
      ...stmt,
      expression: foldedExpr
    };
  });

  // Re-build symbol table
  const symbolTable: Record<string, string> = {};
  foldedAST.forEach(stmt => {
    if (stmt.variable !== '_' && stmt.expression.type === 'Literal') {
      symbolTable[stmt.variable] = stmt.expression.raw;
    }
  });

  return { ast: foldedAST, symbolTable };
}

// B. Constant Propagation
export function propagateExpression(expr: ASTExpression, constTable: Record<string, number>, statsRef?: { propagationCount: number }): ASTExpression {
  if (expr.type === 'Identifier') {
    if (expr.name in constTable) {
      if (statsRef) statsRef.propagationCount++;
      const val = constTable[expr.name];
      return { type: 'Literal', value: val, raw: val.toString() };
    }
    return expr;
  }

  if (expr.type === 'BinaryExpression') {
    const leftProp = propagateExpression(expr.left, constTable, statsRef);
    const rightProp = propagateExpression(expr.right, constTable, statsRef);
    // Also try folding immediately after propagation
    const folded = foldExpression({ type: 'BinaryExpression', operator: expr.operator, left: leftProp, right: rightProp });
    return folded;
  }

  if (expr.type === 'FunctionCall') {
    return {
      type: 'FunctionCall',
      name: expr.name,
      args: expr.args.map(arg => propagateExpression(arg, constTable, statsRef))
    };
  }

  return expr;
}

export function runConstantPropagation(statements: StatementAST[], statsRef?: { propagationCount: number; foldingCount: number }): { ast: StatementAST[]; symbolTable: Record<string, string> } {
  const propagatedAST: StatementAST[] = [];
  const constTable: Record<string, number> = {};

  statements.forEach(stmt => {
    // Propagate variables in expression
    const propExpr = propagateExpression(stmt.expression, constTable, statsRef);
    
    // Create new statement
    const newStmt = {
      ...stmt,
      expression: propExpr
    };
    propagatedAST.push(newStmt);

    // Track active constants
    if (stmt.variable !== '_') {
      if (propExpr.type === 'Literal') {
        constTable[stmt.variable] = propExpr.value;
      } else {
        // If variable is reassigned to something non-constant, remove it from active constants
        delete constTable[stmt.variable];
      }
    }
  });

  const symbolTable: Record<string, string> = {};
  Object.keys(constTable).forEach(key => {
    symbolTable[key] = constTable[key].toString();
  });

  return { ast: propagatedAST, symbolTable };
}

// C. Common Subexpression Elimination (CSE)
export function runCSE(statements: StatementAST[], statsRef?: { cseCount: number }): { ast: StatementAST[]; symbolTable: Record<string, string> } {
  const cseAST: StatementAST[] = [];
  // Maps serialized expression strings (e.g. "a + b") to the variable that holds its result (e.g. "c")
  let activeExpressions: Record<string, string> = {};
  const currentConstants: Record<string, string> = {};

  statements.forEach(stmt => {
    const expr = stmt.expression;

    // Check if the current expression is a candidate for CSE (e.g. has some operations)
    const canBeCSE = expr.type === 'BinaryExpression';
    const exprKey = canBeCSE ? expressionToString(expr) : '';

    let finalExpr = expr;
    let replaced = false;

    if (canBeCSE && exprKey && exprKey in activeExpressions) {
      // Eliminate subexpression
      const originalVar = activeExpressions[exprKey];
      finalExpr = { type: 'Identifier', name: originalVar };
      replaced = true;
      if (statsRef) statsRef.cseCount++;
    }

    const newStmt = {
      ...stmt,
      expression: finalExpr
    };
    cseAST.push(newStmt);

    // Kill any active expressions that depend on the variable we are reassigning
    const killedVar = stmt.variable;
    if (killedVar !== '_') {
      const nextActiveExpressions: Record<string, string> = {};
      Object.keys(activeExpressions).forEach(key => {
        const usesKilledVar = key.split(/\s+/).includes(killedVar);
        if (!usesKilledVar && activeExpressions[key] !== killedVar) {
          nextActiveExpressions[key] = activeExpressions[key];
        }
      });
      activeExpressions = nextActiveExpressions;
    }

    // Save this expression as active if it wasn't replaced and it's a binary expression
    if (canBeCSE && !replaced && stmt.variable !== '_') {
      activeExpressions[exprKey] = stmt.variable;
    }

    // Track symbol constants
    if (stmt.variable !== '_') {
      if (finalExpr.type === 'Literal') {
        currentConstants[stmt.variable] = finalExpr.raw;
      } else {
        delete currentConstants[stmt.variable];
      }
    }
  });

  return { ast: cseAST, symbolTable: currentConstants };
}

// ----------------------------------------------------
// Core Optimizer Runner
// ----------------------------------------------------
export function optimizeCode(code: string): SimulationResult {
  const originalAST = parseProgram(code);
  const lexerSteps = tokenize(code);
  const originalTAC = generateTAC(originalAST);

  const stats = {
    foldingCount: 0,
    propagationCount: 0,
    cseCount: 0
  };

  const steps: OptimizationStep[] = [];

  // Step 0: Original State
  const initialSymbols: Record<string, string> = {};
  originalAST.forEach(s => {
    if (s.variable !== '_' && s.expression.type === 'Literal') {
      initialSymbols[s.variable] = s.expression.raw;
    }
  });
  steps.push({
    name: 'Original Code',
    code: astToCode(originalAST),
    ast: JSON.parse(JSON.stringify(originalAST)),
    symbolTable: initialSymbols,
    tac: [...originalTAC]
  });

  // Step 1: Constant Folding
  const foldingRes = runConstantFolding(originalAST, stats);
  const foldingTAC = generateTAC(foldingRes.ast);
  steps.push({
    name: 'Constant Folding',
    code: astToCode(foldingRes.ast),
    ast: JSON.parse(JSON.stringify(foldingRes.ast)),
    symbolTable: foldingRes.symbolTable,
    tac: foldingTAC
  });

  // Step 2: Constant Propagation (which also folds propagated nodes)
  const propRes = runConstantPropagation(foldingRes.ast, stats);
  const propTAC = generateTAC(propRes.ast);
  steps.push({
    name: 'Constant Propagation',
    code: astToCode(propRes.ast),
    ast: JSON.parse(JSON.stringify(propRes.ast)),
    symbolTable: propRes.symbolTable,
    tac: propTAC
  });

  // Step 3: Common Subexpression Elimination
  const cseRes = runCSE(propRes.ast, stats);
  const cseTAC = generateTAC(cseRes.ast);
  steps.push({
    name: 'Common Subexpression Elimination',
    code: astToCode(cseRes.ast),
    ast: JSON.parse(JSON.stringify(cseRes.ast)),
    symbolTable: cseRes.symbolTable,
    tac: cseTAC
  });

  const finalCode = astToCode(cseRes.ast);

  // Compile visual representation strings for phases
  const lexicalPhase = lexerSteps
    .map(ls => `Line ${ls.line}: [${ls.tokens.map(t => `${t.type}(${t.value})`).join(', ')}]`)
    .join('\n');

  const syntaxPhase = JSON.stringify(cseRes.ast, null, 2);
  const semanticPhase = JSON.stringify(cseRes.symbolTable, null, 2);
  const intermediatePhase = cseTAC.join('\n');
  const optimizationPhase = steps
    .map((step, idx) => `=== Pass ${idx}: ${step.name} ===\n${step.code}`)
    .join('\n\n');
  
  // Calculate execution stats
  const exprsReduced = stats.foldingCount + stats.propagationCount + stats.cseCount;
  const redundantOps = stats.cseCount;
  const speedup = Math.min(10 + exprsReduced * 8.5 + redundantOps * 15, 85); // Simulated relative speedup cap 85%
  const memorySaved = exprsReduced * 4; // Simulated 4 bytes per eliminated expression / register

  return {
    lexerSteps,
    originalCode: code,
    phases: {
      lexical: lexicalPhase,
      syntax: syntaxPhase,
      semantic: semanticPhase,
      intermediate: intermediatePhase,
      optimization: optimizationPhase,
      codegen: finalCode
    },
    steps,
    finalCode,
    symbolTable: cseRes.symbolTable,
    ast: cseRes.ast,
    tac: cseTAC,
    stats: {
      expressionsReduced: exprsReduced,
      executionSpeedup: Math.round(speedup * 10) / 10,
      memorySavedBytes: memorySaved,
      redundantOpsRemoved: redundantOps
    }
  };
}
