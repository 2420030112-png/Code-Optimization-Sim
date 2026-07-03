import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Table, Cpu, Network, FileText, ChevronRight } from 'lucide-react';
import { parseProgram, generateTAC, optimizeCode } from '../utils/compilerEngine';
import type { SimulationResult, ASTExpression } from '../utils/compilerEngine';

interface SimulatorProps {
  code: string;
  setCode: (code: string) => void;
  result: SimulationResult | null;
  setResult: (res: SimulationResult | null) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  currentPhase: number;
  setCurrentPhase: (phase: number) => void;
  onOptimizeComplete: (stats: any) => void;
  backendConnected: boolean;
}

const PRESETS = {
  basic: `# Preset: Constant Folding & Propagation
x = 5 * 4
a = 10
b = a + 5
c = a + b`,
  cse: `# Preset: Common Subexpression Elimination
y = input()
c = y + 15
d = y + 15
e = c * 2`,
  mixed: `# Preset: Full Optimization Chain
x = 2 * 3 * 5
a = 100
b = a / 2
c = x + b
d = x + b
f = c + d`
};

export const Simulator: React.FC<SimulatorProps> = ({
  code,
  setCode,
  result,
  setResult,
  isSimulating,
  setIsSimulating,
  currentPhase,
  setCurrentPhase,
  onOptimizeComplete,
  backendConnected
}) => {
  const [activeVizTab, setActiveVizTab] = useState<'ast' | 'symbols' | 'tac'>('ast');

  const phases = [
    { name: 'User Input', desc: 'Raw source code' },
    { name: 'Lexical Analysis', desc: 'Tokenizing identifiers & operators' },
    { name: 'Syntax Analysis', desc: 'Generating Abstract Syntax Tree' },
    { name: 'Semantic Analysis', desc: 'Binding symbols & verifying scope' },
    { name: 'Intermediate Code', desc: 'Generating Three-Address Code' },
    { name: 'Code Optimization', desc: 'Running Folding, Propagation, CSE' },
    { name: 'Optimized Output', desc: 'Emitting final compiled code' }
  ];

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentPhase(0);
    setResult(null);

    // Simulate compiler stages running with delay
    const runPhase = (phaseIdx: number) => {
      if (phaseIdx < phases.length) {
        setCurrentPhase(phaseIdx);
        setTimeout(() => {
          runPhase(phaseIdx + 1);
        }, 600);
      } else {
        // Complete simulation
        const finalizeSimulation = async () => {
          if (backendConnected) {
            try {
              const response = await fetch('http://localhost:5000/api/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
              });
              if (response.ok) {
                const serverData = await response.json();
                const localResult = optimizeCode(code);
                const mergedResult: SimulationResult = {
                  ...localResult,
                  finalCode: serverData.final_code,
                  symbolTable: serverData.symbol_table,
                  tac: serverData.tac,
                  stats: serverData.stats
                };
                setResult(mergedResult);
                setIsSimulating(false);
                onOptimizeComplete(serverData.stats);
                return;
              }
            } catch (err) {
              console.error('Backend optimization API failed, using fallback client mode', err);
            }
          }

          // Client-side fallback compilation
          const optRes = optimizeCode(code);
          setResult(optRes);
          setIsSimulating(false);
          onOptimizeComplete(optRes.stats);
        };

        finalizeSimulation();
      }
    };

    runPhase(0);
  };

  const handleReset = () => {
    setCode(PRESETS.basic);
    setResult(null);
    setIsSimulating(false);
    setCurrentPhase(-1);
  };

  // Helper to render recursively the AST Nodes in a clean UI format
  const renderASTNode = (expr: ASTExpression, index: string): React.ReactNode => {
    if (expr.type === 'Literal') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs">
          Literal: <span className="font-bold">{expr.value}</span>
        </span>
      );
    }
    if (expr.type === 'Identifier') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-xs">
          ID: <span className="font-bold">{expr.name}</span>
        </span>
      );
    }
    if (expr.type === 'BinaryExpression') {
      return (
        <div className="pl-4 border-l border-white/10 mt-1 flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs text-purple-400 font-mono">
            <span>Binary Op:</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
              {expr.operator}
            </span>
          </div>
          <div className="flex flex-col gap-1 mt-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-mono font-bold">L:</span>
              {renderASTNode(expr.left, `${index}-l`)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-mono font-bold">R:</span>
              {renderASTNode(expr.right, `${index}-r`)}
            </div>
          </div>
        </div>
      );
    }
    if (expr.type === 'FunctionCall') {
      return (
        <div className="pl-4 border-l border-white/10 mt-1 flex flex-col gap-1">
          <div className="text-xs text-amber-400 font-mono font-bold">Call: {expr.name}()</div>
          {expr.args.map((arg, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-mono">Arg {idx}:</span>
              {renderASTNode(arg, `${index}-arg-${idx}`)}
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-xs text-gray-500 font-mono">Unknown</span>;
  };

  const getASTDisplayData = () => {
    if (result) return result.ast;
    return parseProgram(code);
  };

  const getSymbolsDisplayData = () => {
    if (result) return result.symbolTable;
    // Simple mock parse symbol table for original state
    const symbols: Record<string, string> = {};
    const parsed = parseProgram(code);
    parsed.forEach(p => {
      if (p.variable !== '_' && p.expression.type === 'Literal') {
        symbols[p.variable] = p.expression.raw;
      }
    });
    return symbols;
  };

  const getTACDisplayData = () => {
    if (result) return result.tac;
    return generateTAC(parseProgram(code));
  };

  return (
    <section id="simulator" className="py-20 relative">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold mb-3">Interactive Optimization Simulator</h2>
          <p className="text-gray-400 text-sm font-light">
            Write custom code, choose compiler presets, and trigger the step-by-step compiler optimizer.
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="flex justify-center gap-3 mb-8">
          <span className="text-xs text-gray-500 self-center font-mono uppercase tracking-wider mr-2">Load Preset:</span>
          {Object.keys(PRESETS).map(key => (
            <button
              key={key}
              onClick={() => setCode(PRESETS[key as keyof typeof PRESETS])}
              className="text-xs bg-slate-900 border border-slate-800 hover:border-primary/40 px-3.5 py-2 rounded-lg text-gray-400 hover:text-white transition-all font-mono"
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Main Compiler Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left: Input Editor Panel */}
          <div className="lg:col-span-6 flex flex-col h-[500px]">
            <div className="glass-panel border-white/5 flex flex-col flex-1 overflow-hidden">
              {/* Header bar */}
              <div className="bg-slate-950 px-5 py-3.5 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-gray-300 flex items-center gap-2">
                  <Cpu size={14} className="text-cyan-400" />
                  source_code.py
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="flex items-center gap-1.5 text-xs text-white bg-gradient-to-r from-primary to-secondary px-4 py-1.5 rounded-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 transition-all font-semibold"
                  >
                    <Play size={12} className="fill-current" />
                    <span>{isSimulating ? 'Simulating...' : 'Optimize'}</span>
                  </button>
                </div>
              </div>

              {/* Editor wrapper */}
              <div className="flex-1 bg-slate-950/40 p-2">
                <Editor
                  height="100%"
                  language="python"
                  theme="vs-dark"
                  value={code}
                  onChange={val => setCode(val || '')}
                  options={{
                    minimap: { enabled: false },
                    scrollbar: { vertical: 'auto', horizontal: 'hidden' },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    lineNumbers: 'on',
                    lineDecorationsWidth: 8,
                    folding: false,
                    wordWrap: 'on',
                    renderLineHighlight: 'all',
                    cursorStyle: 'line',
                    automaticLayout: true
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right: Live Visualizer Panel */}
          <div className="lg:col-span-6 flex flex-col h-[500px]">
            <div className="glass-panel border-white/5 flex flex-col flex-1 overflow-hidden relative">
              
              {/* Tab Selector Header */}
              <div className="bg-slate-950 px-2 py-2 border-b border-white/5 flex justify-between items-center">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setActiveVizTab('ast')}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeVizTab === 'ast'
                        ? 'bg-primary/20 text-cyan-300 border border-primary/30'
                        : 'text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Network size={12} />
                    <span>AST Structure</span>
                  </button>
                  <button
                    onClick={() => setActiveVizTab('symbols')}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeVizTab === 'symbols'
                        ? 'bg-primary/20 text-cyan-300 border border-primary/30'
                        : 'text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <Table size={12} />
                    <span>Symbol Table</span>
                  </button>
                  <button
                    onClick={() => setActiveVizTab('tac')}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeVizTab === 'tac'
                        ? 'bg-primary/20 text-cyan-300 border border-primary/30'
                        : 'text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <FileText size={12} />
                    <span>Intermediate TAC</span>
                  </button>
                </div>

                <div className="pr-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Compiler Insights
                </div>
              </div>

              {/* Body Content of tabs */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20 text-left">
                
                {/* 1. AST View */}
                {activeVizTab === 'ast' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2 border-b border-white/5 pb-2 font-mono">
                      <span>Statement node</span>
                      <span>Expression AST tree branch</span>
                    </div>
                    {getASTDisplayData().length === 0 ? (
                      <div className="text-gray-500 text-xs font-mono">Empty AST. Add statements in editor.</div>
                    ) : (
                      getASTDisplayData().map((stmt, idx) => (
                        <div key={stmt.id || idx} className="p-3 bg-slate-900/60 rounded-xl border border-white/5 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1">
                            <span className="text-xs font-semibold text-white font-mono">
                              {stmt.variable === '_' ? 'Expression' : `Assign: ${stmt.variable}`}
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono">Line {stmt.lineNum}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-mono font-bold">RHS:</span>
                            {renderASTNode(stmt.expression, `ast-${idx}`)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 2. Symbols View */}
                {activeVizTab === 'symbols' && (
                  <div>
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider">
                          <th className="py-2.5 px-3">Variable</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Binding Value</th>
                          <th className="py-2.5 px-3 text-right">Scope</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(getSymbolsDisplayData()).length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-gray-500 font-light italic">
                              No constant symbols bound. Constants are identified during Constant Propagation.
                            </td>
                          </tr>
                        ) : (
                          Object.keys(getSymbolsDisplayData()).map(key => (
                            <tr key={key} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-3 text-cyan-300 font-bold">{key}</td>
                              <td className="py-3 px-3 text-purple-400">float / int</td>
                              <td className="py-3 px-3 text-emerald-400 font-semibold">{getSymbolsDisplayData()[key]}</td>
                              <td className="py-3 px-3 text-right text-slate-500">global</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. TAC View */}
                {activeVizTab === 'tac' && (
                  <div className="space-y-2.5 font-mono">
                    <div className="text-[11px] text-gray-500 border-b border-white/5 pb-2 uppercase tracking-wider">
                      Three-Address Code Instruction Stream:
                    </div>
                    {getTACDisplayData().length === 0 ? (
                      <div className="text-gray-500 text-xs">No instruction generated.</div>
                    ) : (
                      getTACDisplayData().map((tacLine, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm border-b border-white/5 py-1.5 hover:bg-slate-900/40 px-2 rounded transition-colors">
                          <span className="text-slate-600 text-xs w-6 select-none">i{idx + 1}</span>
                          <span className="text-cyan-200">{tacLine}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

        {/* Compiler Phase Workflow Timeline */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h3 className="text-sm uppercase font-mono text-gray-400 tracking-widest text-center mb-8">
            Compiler Compilation Pipeline
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3 justify-center relative">
            {phases.map((phase, idx) => {
              const isPassed = currentPhase >= idx;
              const isCurrent = currentPhase === idx;
              
              return (
                <div key={idx} className="flex flex-col items-center text-center group relative">
                  
                  {/* Phase Indicator Box */}
                  <motion.div
                    className={`w-full py-4 px-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-white'
                        : isPassed
                        ? 'bg-slate-900 border-primary/30 text-cyan-300'
                        : 'bg-slate-950/40 border-white/5 text-gray-500'
                    }`}
                    animate={isCurrent ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <span className="text-[10px] font-mono text-gray-500 mb-1">0{idx + 1}</span>
                    <span className="text-xs font-bold leading-tight font-mono">{phase.name}</span>
                    <span className="text-[9px] text-gray-500 font-light mt-1 hidden sm:block leading-tight line-clamp-1">
                      {phase.desc}
                    </span>
                  </motion.div>

                  {/* Horizontal arrow helper (hidden on mobile, last item) */}
                  {idx < phases.length - 1 && (
                    <div className="absolute top-[28px] -right-2 text-slate-700 hidden md:block z-20">
                      <ChevronRight size={16} className={isPassed && currentPhase > idx ? 'text-primary' : ''} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
