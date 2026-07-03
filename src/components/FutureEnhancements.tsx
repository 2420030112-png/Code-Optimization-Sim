import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, IterationCw, ZapOff, Eye, Cpu, Compass, GitCommit, Bot } from 'lucide-react';

interface Enhancement {
  title: string;
  icon: React.ReactNode;
  desc: string;
  badge: string;
}

export const FutureEnhancements: React.FC = () => {
  const enhancements: Enhancement[] = [
    {
      title: 'Dead Code Elimination',
      icon: <Trash2 className="text-red-400" size={20} />,
      desc: 'Surgically purges variable declarations and calculations whose computed results are never referenced in active branches.',
      badge: 'Planned v1.2'
    },
    {
      title: 'Loop Optimization',
      icon: <IterationCw className="text-blue-400" size={20} />,
      desc: 'Applies Loop Unrolling and Loop-Invariant Code Motion (LICM) to pull stationary operations out of execution loops.',
      badge: 'Planned v1.2'
    },
    {
      title: 'Strength Reduction',
      icon: <ZapOff className="text-yellow-400" size={20} />,
      desc: 'Replaces CPU-intensive mathematical operations with cheaper CPU equivalents, such as replacing x * 2 with x << 1.',
      badge: 'Planned v1.3'
    },
    {
      title: 'Peephole Optimization',
      icon: <Eye className="text-cyan-400" size={20} />,
      desc: 'Employs a sliding micro-window over generated assembly instructions to replace adjacent redundant memory actions.',
      badge: 'Planned v1.3'
    },
    {
      title: 'LLVM IR Integration',
      icon: <Cpu className="text-purple-400" size={20} />,
      desc: 'Compiles the source code into native LLVM Intermediate Representation, running standard GCC/LLVM optimization passes.',
      badge: 'Under Review'
    },
    {
      title: 'GUI Compiler Grapher',
      icon: <Compass className="text-pink-400" size={20} />,
      desc: 'Enables an interactive GUI canvas that allows dragging and dropping compiler nodes directly to model intermediate code.',
      badge: 'Planned v1.4'
    },
    {
      title: 'Flow Graph Visualization',
      icon: <GitCommit className="text-amber-400" size={20} />,
      desc: 'Renders the program into a fully interactive Control Flow Graph (CFG), displaying basic blocks and branching links.',
      badge: 'Under Review'
    },
    {
      title: 'AI Optimization Advisor',
      icon: <Bot className="text-emerald-400" size={20} />,
      desc: 'Integrates local LLMs to evaluate user scripts and advise custom loop modifications and variable reduction ideas.',
      badge: 'Experimental'
    }
  ];

  return (
    <section id="enhancements" className="py-20 relative">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold mb-3">Future Enhancements Roadmap</h2>
          <p className="text-gray-400 text-sm font-light">
            Planned future passes and additions to extend the Code Optimization compiler simulator.
          </p>
        </div>

        {/* Enhancements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {enhancements.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 glass-panel glass-panel-hover text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
