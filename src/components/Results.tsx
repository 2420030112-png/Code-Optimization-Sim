import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ArrowRightLeft, TrendingUp, Layers, HardDrive } from 'lucide-react';
import type { SimulationResult } from '../utils/compilerEngine';

interface ResultsProps {
  result: SimulationResult | null;
}

const AnimatedCounter: React.FC<{ value: number; suffix?: string; prefix?: string }> = ({ value, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    const duration = 1200; // ms
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quad
      const ease = progress * (2 - progress);
      const current = Math.floor(ease * (end - start) + start);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value]);

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export const Results: React.FC<ResultsProps> = ({ result }) => {
  if (!result) {
    return (
      <section id="results" className="py-12 border-t border-white/5 bg-slate-950/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto p-8 rounded-2xl border border-white/5 bg-bgCard/30 backdrop-blur-md">
            <BarChart3 className="text-gray-600 mx-auto mb-4 animate-bounce" size={44} />
            <h3 className="text-lg font-bold text-white mb-2">Simulated Audit Queue</h3>
            <p className="text-sm text-gray-500 font-light mb-4">
              Write some statements in the editor above and hit the "Optimize" button to run the compiler passes.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Split lines to map highlights
  const originalLines = result.originalCode.split('\n');
  const optimizedLines = result.finalCode.split('\n');

  // Highlight rules: if the optimized line differs from the original line at the same index, highlight it in green
  const isLineModified = (lineText: string, idx: number): boolean => {
    const trimmed = lineText.trim();
    if (!trimmed || trimmed.startsWith('#')) return false;
    
    const origLine = originalLines[idx];
    if (!origLine) return true; // new line
    return origLine.trim() !== trimmed;
  };

  return (
    <section id="results" className="py-20 border-t border-white/5 relative">
      
      {/* Background glow blobs */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-success/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold mb-3">Simulation Performance Audit</h2>
          <p className="text-gray-400 text-sm font-light">
            Analyze the final intermediate code optimization outcome, highlighting modified register assignments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-6 glass-panel border-white/5 text-left relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-cyan-500/20"><Layers size={36} /></div>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Expressions Folded</span>
            <span className="text-3xl md:text-4xl font-bold font-mono text-white block">
              <AnimatedCounter value={result.stats.expressionsReduced} />
            </span>
            <span className="text-[10px] text-gray-500 font-mono mt-2 block">Folding & Propagation runs</span>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 glass-panel border-white/5 text-left relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-success/20"><TrendingUp size={36} /></div>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Estimated Speedup</span>
            <span className="text-3xl md:text-4xl font-bold font-mono text-success block">
              <AnimatedCounter value={result.stats.executionSpeedup} suffix="%" />
            </span>
            <span className="text-[10px] text-gray-500 font-mono mt-2 block">Simulated latency decrease</span>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-6 glass-panel border-white/5 text-left relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-purple-500/20"><HardDrive size={36} /></div>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Memory Saved</span>
            <span className="text-3xl md:text-4xl font-bold font-mono text-accent block">
              <AnimatedCounter value={result.stats.memorySavedBytes} suffix=" B" />
            </span>
            <span className="text-[10px] text-gray-500 font-mono mt-2 block">Register allocations freed</span>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-6 glass-panel border-white/5 text-left relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-amber-500/20"><ArrowRightLeft size={36} /></div>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">CSE Eliminations</span>
            <span className="text-3xl md:text-4xl font-bold font-mono text-amber-400 block">
              <AnimatedCounter value={result.stats.redundantOpsRemoved} />
            </span>
            <span className="text-[10px] text-gray-500 font-mono mt-2 block">Redundant expressions killed</span>
          </motion.div>

        </div>

        {/* Comparison Code Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Original View */}
          <div className="glass-panel border-white/5 overflow-hidden">
            <div className="bg-slate-950 px-5 py-3 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Before Optimization</span>
              <span className="text-[10px] font-mono bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded-full font-semibold">
                Unoptimized IR
              </span>
            </div>
            <div className="p-6 bg-slate-950/40 font-mono text-sm leading-relaxed text-left min-h-[220px]">
              {originalLines.map((line, idx) => (
                <div key={idx} className="flex">
                  <span className="text-slate-600 text-xs w-6 select-none">{idx + 1}</span>
                  <span className={line.startsWith('#') ? 'text-slate-500' : 'text-gray-300'}>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optimized View */}
          <div className="glass-panel border-white/5 overflow-hidden">
            <div className="bg-slate-950 px-5 py-3 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">After Optimization</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-semibold">
                Optimized Output
              </span>
            </div>
            <div className="p-6 bg-slate-950/40 font-mono text-sm leading-relaxed text-left min-h-[220px]">
              {optimizedLines.map((line, idx) => {
                const modified = isLineModified(line, idx);
                return (
                  <motion.div
                    key={idx}
                    initial={modified ? { backgroundColor: 'rgba(16, 185, 129, 0)' } : false}
                    animate={modified ? { backgroundColor: 'rgba(16, 185, 129, 0.1)' } : false}
                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                    className={`flex -mx-6 px-6 ${
                      modified ? 'border-l-2 border-emerald-500 font-semibold' : ''
                    }`}
                  >
                    <span className="text-slate-600 text-xs w-6 select-none">{idx + 1}</span>
                    <span className={line.startsWith('#') ? 'text-emerald-600/80' : modified ? 'text-emerald-400 animate-pulse' : 'text-gray-300'}>
                      {line}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
