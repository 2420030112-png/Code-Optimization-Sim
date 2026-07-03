import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

interface AlgoStep {
  step: string;
  title: string;
  desc: string;
  pseudoCode: string;
}

export const Algorithms: React.FC = () => {
  const steps: AlgoStep[] = [
    {
      step: '01',
      title: 'Parse Code & Build AST',
      desc: 'Tokenizes and parses source statements into an Abstract Syntax Tree (AST) representing binary operation branches.',
      pseudoCode: 'tokens = lex(source_code)\nstatements = parse(tokens)\nast = build_ast(statements)'
    },
    {
      step: '02',
      title: 'Execute Constant Folding',
      desc: 'Recursively checks AST branches. If a binary operation has two constant literal children, pre-evaluates and replaces them.',
      pseudoCode: 'def fold(node):\n  if node.type == "BinaryExpression":\n    if node.left == Literal and node.right == Literal:\n      return Literal(evaluate(node.left, node.operator, node.right))\n  return node'
    },
    {
      step: '03',
      title: 'Propagate Constants',
      desc: 'Traverses statements line-by-line, updating the symbol table. Replaces variable identifiers with active constant values.',
      pseudoCode: 'symbol_table = {}\nfor stmt in statements:\n  stmt.expression = propagate(stmt.expression, symbol_table)\n  if stmt.expression == Literal:\n    symbol_table[stmt.var] = stmt.expression.value\n  else:\n    symbol_table.pop(stmt.var, None)'
    },
    {
      step: '04',
      title: 'Eliminate Common Subexpressions',
      desc: 'Identifies active expressions computed on the RHS. If seen again, replaces the expression with the variable holding the pre-calculated value.',
      pseudoCode: 'active_exprs = {}\nfor stmt in statements:\n  if stmt.expression in active_exprs:\n    stmt.expression = Identifier(active_exprs[stmt.expression])\n  else:\n    # Kill expressions using reassigned variables\n    kill_dependent(active_exprs, stmt.var)\n    active_exprs[stmt.expression] = stmt.var'
    }
  ];

  return (
    <section id="algorithms" className="py-20 relative bg-slate-950/20 border-t border-white/5">
      <div className="absolute top-1/4 right-1/2 w-80 h-80 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold mb-3">Optimization Algorithm Logic</h2>
          <p className="text-gray-400 text-sm font-light">
            An overview of the compiler design algorithms utilized to inspect, propagate, and reduce intermediate registers.
          </p>
        </div>

        {/* Algorithm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-panel border-white/5 flex flex-col justify-between overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-6 text-left">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-900 border border-slate-800 text-primary rounded-lg">
                    ALGORITHM STEP {item.step}
                  </span>
                  <Settings size={16} className="text-gray-500 group-hover:rotate-45 transition-transform duration-500" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">{item.desc}</p>
              </div>

              {/* Pseudo-Code Faux Terminal panel */}
              <div className="bg-slate-950 border-t border-white/5 px-6 py-4 text-left font-mono text-xs text-cyan-300 relative">
                <div className="absolute top-2 right-4 text-[10px] text-gray-600 font-bold select-none">PSEUDOCODE</div>
                <pre className="whitespace-pre overflow-x-auto leading-relaxed select-text font-mono">
                  {item.pseudoCode}
                </pre>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
