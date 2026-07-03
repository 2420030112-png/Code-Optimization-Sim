import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Cpu, Sparkles, TrendingUp } from 'lucide-react';

export const About: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="text-primary" size={24} />,
      title: 'Educational Simulator',
      desc: 'Designed for academic exploration, explaining key techniques in intermediate code optimization passes.'
    },
    {
      icon: <Cpu className="text-secondary" size={24} />,
      title: 'Python Implementation',
      desc: 'Simulates optimizations modelled after standard compiler architectures (like GCC, LLVM, and Python AST).'
    },
    {
      icon: <Sparkles className="text-accent" size={24} />,
      title: 'Step-by-Step Visualization',
      desc: 'Watch intermediate code transform dynamically after each pass, explaining the underlying rule applied.'
    },
    {
      icon: <TrendingUp className="text-success" size={24} />,
      title: 'Performance Audits',
      desc: 'Get precise statistics on expression reductions, simulated speedup, and register/memory conservation.'
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold mb-4"
          >
            Optimizing Code Without Changing Semantics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 font-light"
          >
            A compiler optimizer transforms intermediate representations (IR) to execute faster, consume less memory, and occupy fewer machine registers, all while strictly preserving the program's original semantic behavior.
          </motion.p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="p-6 glass-panel glass-panel-hover text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center mb-4">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side: Graph/Flow Demonstration */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel p-8 text-left bg-slate-950/20 border-white/5 relative overflow-hidden"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Cpu size={20} className="text-cyan-400 animate-pulse" />
                The Compiler Pipeline
              </h3>
              
              <div className="space-y-6 relative">
                
                {/* Horizontal line for compiler timeline */}
                <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

                {/* Pipeline Block 1 */}
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    CF
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Constant Folding</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Evaluates arithmetic expressions containing constants at compile time rather than execution time.
                    </p>
                    <code className="block mt-2 text-[11px] bg-slate-950/80 text-cyan-300 rounded px-2 py-1.5 font-mono">
                      x = 5 * 4  &rarr;  x = 20
                    </code>
                  </div>
                </div>

                {/* Pipeline Block 2 */}
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary font-bold text-sm shrink-0">
                    CP
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Constant Propagation</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Replaces variable occurrences with their known constant values to unlock further folding opportunities.
                    </p>
                    <code className="block mt-2 text-[11px] bg-slate-950/80 text-cyan-300 rounded px-2 py-1.5 font-mono">
                      a = 10; b = a + 5  &rarr;  a = 10; b = 15
                    </code>
                  </div>
                </div>

                {/* Pipeline Block 3 */}
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                    CSE
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Common Subexpression Elimination</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Identifies identical subexpressions, computes them once, and references the stored result instead.
                    </p>
                    <code className="block mt-2 text-[11px] bg-slate-950/80 text-cyan-300 rounded px-2 py-1.5 font-mono">
                      c = y + 15; d = y + 15  &rarr;  c = y + 15; d = c
                    </code>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};
