import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Play, HelpCircle, Code } from 'lucide-react';

export const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'optimizing' | 'done'>('typing');

  const rawCode = [
    '# Unoptimized Code',
    'x = 5 * 4',
    'a = 10',
    'b = a + 5',
    'c = y + b',
    'd = y + b'
  ];

  const optimizedCode = [
    '# Optimized Code',
    'x = 20',
    'a = 10',
    'b = 15',
    'c = y + 15',
    'd = c'
  ];

  useEffect(() => {
    if (phase === 'typing') {
      const fullText = rawCode.join('\n');
      if (typingIndex < fullText.length) {
        const timeout = setTimeout(() => {
          setTypedText(prev => prev + fullText[typingIndex]);
          setTypingIndex(prev => prev + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setPhase('optimizing');
        }, 1500);
        return () => clearTimeout(timeout);
      }
    } else if (phase === 'optimizing') {
      const timeout = setTimeout(() => {
        setTypedText(optimizedCode.join('\n'));
        setPhase('done');
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedText('');
        setTypingIndex(0);
        setPhase('typing');
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, phase]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-secondary/15 blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left: Text & Info */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-300 tracking-wider uppercase">Compiler Optimization Project</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-slate-100 to-gray-400 bg-clip-text text-transparent">
              Code Optimization
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse-slow">
              Simulator
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 font-light mb-8 max-w-xl"
          >
            Visualize compiler optimization passes in real-time. Input source code and analyze AST, Symbol Table, TAC, and output side-by-side.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 w-full sm:w-auto"
          >
            <a
              href="#simulator"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-6 py-3.5 rounded-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Play size={18} className="fill-current" />
              <span>Start Simulation</span>
            </a>
            <a
              href="#algorithms"
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300"
            >
              <HelpCircle size={18} />
              <span>View Algorithms</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-gray-300 px-5 py-3.5 rounded-xl hover:text-white transition-colors duration-300"
            >
              <Code size={18} />
              <span>GitHub</span>
            </a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-6 border-t border-white/5 pt-8 w-full max-w-lg"
          >
            <div>
              <div className="text-2xl font-mono font-bold text-white">3+</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Core Passes</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-cyan-400">100%</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Client-Side</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-accent">0ms</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Latency</div>
            </div>
          </motion.div>
        </div>

        {/* Right: Interactive Terminal Display */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-md glass-panel glow-border border-white/10 overflow-hidden relative"
          >
            {/* Terminal Top Window Bar */}
            <div className="bg-slate-950/80 px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
                <Terminal size={10} /> compiler_core.py
              </span>
              <span className="w-4" /> {/* spacer */}
            </div>

            {/* Terminal Body */}
            <div className="p-6 bg-slate-950/40 min-h-[260px] text-left font-mono text-sm leading-relaxed relative flex flex-col justify-between">
              
              {/* Overlay optimization effect */}
              {phase === 'optimizing' && (
                <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] flex flex-col items-center justify-center transition-all duration-300">
                  <div className="flex flex-col items-center gap-3">
                    <Cpu className="text-cyan-400 animate-spin" size={32} />
                    <span className="text-xs font-mono text-cyan-400 tracking-widest animate-pulse">OPTIMIZING CODE AST...</span>
                  </div>
                </div>
              )}

              {/* Code print */}
              <div className="whitespace-pre-wrap font-mono text-sm">
                {typedText.split('\n').map((line, idx) => {
                  const isComment = line.startsWith('#');
                  const isOptimized = phase === 'done';
                  let textColor = 'text-gray-300';

                  if (isComment) {
                    textColor = isOptimized ? 'text-emerald-500/80' : 'text-slate-500';
                  } else if (isOptimized) {
                    if (line.includes('20') || line.includes('15') || line.includes('c') || line.includes('y + 15')) {
                      textColor = 'text-emerald-400 font-semibold';
                    }
                  } else {
                    if (line.includes('*') || line.includes('+')) {
                      textColor = 'text-cyan-300';
                    }
                  }

                  return (
                    <div key={idx} className={`${textColor} min-h-[1.5rem] flex items-center`}>
                      <span className="text-slate-600 text-xs w-6 select-none">{idx + 1}</span>
                      <span>{line}</span>
                    </div>
                  );
                })}
                {phase === 'typing' && (
                  <span className="w-1.5 h-4 bg-primary inline-block ml-1 animate-pulse" />
                )}
              </div>

              {/* Terminal Bottom Info */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  Status:{' '}
                  {phase === 'typing' && <span className="text-yellow-500">Typing input</span>}
                  {phase === 'optimizing' && <span className="text-cyan-400 animate-pulse">Running Passes</span>}
                  {phase === 'done' && <span className="text-emerald-500 font-bold">Optimization Complete</span>}
                </span>
                <span className="flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                  AST Nodes: {phase === 'done' ? 12 : 24}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
