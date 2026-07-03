import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Combine, Layers } from 'lucide-react';

interface TechniqueItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  before: string[];
  after: string[];
  highlight: string;
  color: string;
}

export const Techniques: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('folding');
  
  const techniques: TechniqueItem[] = [
    {
      id: 'folding',
      name: 'Constant Folding',
      icon: <Zap size={20} />,
      desc: 'Saves execution time by pre-computing constant expressions at compile-time instead of running them on the CPU at runtime.',
      before: [
        '# Compile Time',
        'x = 5 * 4',
        'y = x + 2'
      ],
      after: [
        '# Pre-calculated by Compiler',
        'x = 20',
        'y = x + 2'
      ],
      highlight: 'x = 20',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'propagation',
      name: 'Constant Propagation',
      icon: <Combine size={20} />,
      desc: 'Replaces variables with known constant values in subsequent expressions, exposing new expressions for constant folding.',
      before: [
        'a = 10',
        '# "a" is propagated',
        'b = a + 5'
      ],
      after: [
        'a = 10',
        '# Evaluated to 15',
        'b = 15'
      ],
      highlight: 'b = 15',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'cse',
      name: 'Common Subexpression Elimination',
      icon: <Layers size={20} />,
      desc: 'Searches for identical, redundant computations, stores the result, and replaces subsequent instances with a reference to that store.',
      before: [
        'c = a + b',
        '# Duplicate expression',
        'd = a + b'
      ],
      after: [
        'c = a + b',
        '# Replaced with "c"',
        'd = c'
      ],
      highlight: 'd = c',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const current = techniques.find(t => t.id === activeTab) || techniques[0];

  return (
    <section id="techniques" className="py-20 relative bg-slate-950/20">
      
      {/* Background glow blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold mb-3">Core Optimization Techniques</h2>
          <p className="text-gray-400 text-sm font-light">
            Toggle between the tabs to visualize the exact code structure transformation for each optimization pass.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 max-w-2xl mx-auto">
          {techniques.map(tech => {
            const isActive = activeTab === tech.id;
            return (
              <button
                key={tech.id}
                onClick={() => setActiveTab(tech.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 border text-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'bg-bgCard/40 border-white/5 hover:border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {tech.icon}
                <span>{tech.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Comparison Pane */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: -15, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              {/* Description Card */}
              <div className="md:col-span-4 text-left">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${current.color}`} />
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-mono">Algorithm Concept</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{current.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">{current.desc}</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md font-mono text-cyan-400">
                    AST Reducer
                  </span>
                  <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md font-mono text-accent">
                    Complexity: O(N)
                  </span>
                </div>
              </div>

              {/* Code Visual Comparison Cards */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
                
                {/* Before Card */}
                <div className="sm:col-span-5 glass-panel border-white/5 overflow-hidden">
                  <div className="bg-slate-950 px-4 py-2 border-b border-white/5 flex justify-between items-center text-[11px] font-mono text-gray-500">
                    <span>Input Code</span>
                    <span className="text-red-400/80">Unoptimized</span>
                  </div>
                  <div className="p-6 bg-slate-950/40 text-left font-mono text-sm leading-relaxed min-h-[140px]">
                    {current.before.map((line, idx) => (
                      <div key={idx} className="flex">
                        <span className="w-5 text-gray-600 text-xs select-none">{idx + 1}</span>
                        <span className={line.startsWith('#') ? 'text-gray-600' : 'text-gray-300'}>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transition Arrow */}
                <div className="sm:col-span-1 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 shadow-md">
                    <ArrowRight size={18} className="animate-pulse" />
                  </div>
                </div>

                {/* After Card */}
                <div className="sm:col-span-5 glass-panel border-white/5 overflow-hidden ring-1 ring-emerald-500/20 shadow-emerald-500/5">
                  <div className="bg-slate-950 px-4 py-2 border-b border-white/5 flex justify-between items-center text-[11px] font-mono text-gray-500">
                    <span>Target Code</span>
                    <span className="text-emerald-400">Optimized</span>
                  </div>
                  <div className="p-6 bg-slate-950/40 text-left font-mono text-sm leading-relaxed min-h-[140px]">
                    {current.after.map((line, idx) => {
                      const isHighlight = line.trim() === current.highlight;
                      return (
                        <div key={idx} className={`flex ${isHighlight ? 'bg-emerald-500/10 -mx-6 px-6 font-semibold border-l-2 border-emerald-500' : ''}`}>
                          <span className="w-5 text-gray-600 text-xs select-none">{idx + 1}</span>
                          <span className={line.startsWith('#') ? 'text-emerald-600/80' : isHighlight ? 'text-emerald-400' : 'text-gray-300'}>
                            {line}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
