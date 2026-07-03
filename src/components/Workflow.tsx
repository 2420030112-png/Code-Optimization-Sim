import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, Binary, GitFork, ClipboardList, RefreshCw, Milestone, Sparkles } from 'lucide-react';

interface Stage {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  details: string;
  illustration: React.ReactNode;
}

export const Workflow: React.FC = () => {
  const stages: Stage[] = [
    {
      title: 'User Input',
      subtitle: 'Source Code',
      icon: <FileCode size={20} />,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      details: 'Developer writes raw programmer code (e.g. assignments and calculations).',
      illustration: (
        <div className="w-full text-[10px] text-left leading-relaxed font-mono">
          <span className="text-slate-500"># Input</span><br />
          <span className="text-cyan-300">x = 5 * 4</span><br />
          <span className="text-cyan-300">y = x + 3</span>
        </div>
      )
    },
    {
      title: 'Lexical Analysis',
      subtitle: 'Tokenization',
      icon: <Binary size={20} />,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      details: 'Scanner breaks string into discrete tokens (keywords, literals, identifiers).',
      illustration: (
        <div className="flex flex-wrap gap-1 items-center justify-start max-w-full font-mono text-[9px]">
          <span className="px-1 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/15">ID("x")</span>
          <span className="text-gray-500">=</span>
          <span className="px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">NUM(5)</span>
          <span className="text-purple-400">*</span>
          <span className="px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">NUM(4)</span>
        </div>
      )
    },
    {
      title: 'Syntax Analysis',
      subtitle: 'AST Generation',
      icon: <GitFork size={20} />,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      details: 'Parser evaluates language grammar and structures tokens into an AST tree.',
      illustration: (
        <div className="flex flex-col items-center justify-center text-slate-400 scale-90 w-full py-1">
          <div className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[8px] font-bold">Assign (=)</div>
          <div className="w-0.5 h-2 bg-slate-800" />
          <div className="flex justify-between w-24">
            <span className="px-1 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/15 text-[7px]">ID("x")</span>
            <div className="flex flex-col items-center">
              <span className="px-1 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/15 text-[7px]">BinOp(*)</span>
              <div className="flex gap-1.5 mt-1 text-[7px] text-emerald-400">
                <span>5</span>
                <span>4</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Semantic Analysis',
      subtitle: 'Symbol Validation',
      icon: <ClipboardList size={20} />,
      color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      details: 'Checker evaluates semantic bindings, variable scoping, and builds symbol table.',
      illustration: (
        <div className="w-full text-[9px] text-left font-mono leading-tight">
          <div className="grid grid-cols-2 border-b border-white/10 pb-0.5 mb-1 font-bold text-gray-500 text-[8px] uppercase">
            <span>Symbol</span>
            <span>Type</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-cyan-400 font-bold">x</span>
            <span className="text-slate-400">int</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-cyan-400 font-bold">y</span>
            <span className="text-slate-400">int</span>
          </div>
        </div>
      )
    },
    {
      title: 'Intermediate Code',
      subtitle: 'TAC Generation',
      icon: <Milestone size={20} />,
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      details: 'Generates linear Three-Address Code (TAC) as machine-independent IR.',
      illustration: (
        <div className="w-full text-[9px] text-left leading-relaxed font-mono">
          <span className="text-yellow-400">t1 = 5 * 4</span><br />
          <span className="text-cyan-300">x = t1</span><br />
          <span className="text-yellow-400">t2 = x + 3</span><br />
          <span className="text-cyan-300">y = t2</span>
        </div>
      )
    },
    {
      title: 'Code Optimization',
      subtitle: 'IR Reduction',
      icon: <RefreshCw size={20} />,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      details: 'Applies Constant Folding, Propagation, and CSE to minimize instruction counts.',
      illustration: (
        <div className="w-full text-[9px] text-left leading-relaxed font-mono text-emerald-400">
          <span>t1 = 20 </span><span className="text-slate-600 text-[8px]"># Folded</span><br />
          <span>x = 20 </span><span className="text-slate-600 text-[8px]"># Propagated</span><br />
          <span>t2 = 23 </span><span className="text-slate-600 text-[8px]"># Folded</span><br />
          <span>y = 23 </span><span className="text-slate-600 text-[8px]"># Propagated</span>
        </div>
      )
    },
    {
      title: 'Optimized Output',
      subtitle: 'Target Code',
      icon: <Sparkles size={20} />,
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      details: 'Compiler emits optimized target source code ready for runtime execution.',
      illustration: (
        <div className="w-full text-[10px] text-left leading-relaxed font-mono">
          <span className="text-slate-500"># Output</span><br />
          <span className="text-emerald-400 font-semibold">x = 20</span><br />
          <span className="text-emerald-400 font-semibold">y = 23</span>
        </div>
      )
    }
  ];

  return (
    <section id="workflow" className="py-20 relative overflow-hidden bg-slate-950/10 border-t border-white/5">
      {/* Glow Blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold mb-3">Compiler Frontend & Backend Workflow</h2>
          <p className="text-gray-400 text-sm font-light">
            An overview of the compiler phases illustrating the transformations of intermediate registers.
          </p>
        </div>

        {/* Workflow Component Container */}
        <div className="relative">
          
          {/* Connecting Line - Desktop (Horizontal) */}
          <div className="hidden lg:block absolute left-10 right-10 top-[28px] h-0.5 pointer-events-none z-0">
            <svg className="w-full h-full" overflow="visible">
              <line x1="0%" y1="0" x2="100%" y2="0" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
              <line x1="0%" y1="0" x2="100%" y2="0" stroke="url(#flow-gradient)" strokeWidth="2" strokeDasharray="6 8" className="animate-dash" />
              <defs>
                <linearGradient id="flow-gradient" x1="0%" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Connecting Line - Mobile/Tablet (Vertical) */}
          <div className="lg:hidden absolute left-10 top-8 bottom-8 w-0.5 pointer-events-none z-0">
            <div className="w-full h-full bg-gradient-to-b from-primary via-secondary to-accent opacity-30" />
          </div>

          {/* Grid Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 relative z-10">
            {stages.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ type: 'spring', stiffness: 150, damping: 18, delay: idx * 0.08 }}
                className="flex flex-col items-start lg:items-center text-left lg:text-center w-full pl-16 lg:pl-0 relative group"
              >
                {/* Connected Icon Bubble */}
                <div className={`absolute left-4 lg:static w-12 h-12 rounded-xl flex items-center justify-center border bg-slate-950/90 z-20 ${stage.color} group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300`}>
                  {stage.icon}
                </div>
                
                {/* Stage Body Card */}
                <div className="mt-0 lg:mt-6 w-full glass-panel p-5 border-white/5 flex flex-col justify-between items-stretch text-left hover:border-primary/20 hover:bg-slate-900/30 transition-all duration-300 min-h-[290px] shadow-lg shadow-black/40">
                  <div>
                    <div className="text-[9px] font-mono text-gray-500 mb-0.5">STAGE 0{idx + 1}</div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {stage.title}
                    </h3>
                    <div className="text-[10px] text-gray-400 font-mono mb-3">{stage.subtitle}</div>
                  </div>

                  {/* Micro-Illustration Block */}
                  <div className="my-3 p-3.5 bg-slate-950/80 border border-white/5 rounded-xl min-h-[92px] flex items-center justify-start overflow-hidden relative shadow-inner">
                    {stage.illustration}
                  </div>

                  <p className="text-[10px] text-gray-500 font-light leading-relaxed border-t border-white/5 pt-3 mt-1">
                    {stage.details}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
