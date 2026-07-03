import { useState, useEffect } from 'react';
import { ThreeBackground } from './components/ThreeBackground';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Techniques } from './components/Techniques';
import { Simulator } from './components/Simulator';
import { Workflow } from './components/Workflow';
import { Algorithms } from './components/Algorithms';
import { Results } from './components/Results';
import { FutureEnhancements } from './components/FutureEnhancements';
import { Team } from './components/Team';
import { Footer } from './components/Footer';
import type { SimulationResult } from './utils/compilerEngine';
import { Server, ServerOff, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

function App() {
  const [code, setCode] = useState<string>(`# Code Optimization Simulator Demo
# Try Constant Folding, Propagation, and CSE
x = 5 * 4
a = 10
b = a + 5
c = y + b
d = y + b`);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(-1);
  const [backendConnected, setBackendConnected] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(true);

  // Check if Python Flask server is active on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/status', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'online') {
            setBackendConnected(true);
          }
        }
      } catch (err) {
        // Backend is offline, fallback silently to client-side compiler
        setBackendConnected(false);
      } finally {
        setIsCheckingBackend(false);
      }
    };
    checkBackend();
  }, []);

  const handleOptimizeComplete = (stats: any) => {
    // If we reduced some expressions, burst confetti!
    if (stats.expressionsReduced > 0) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#06B6D4', '#8B5CF6', '#10B981']
      });
    }
  };

  return (
    <div className="relative min-h-screen text-gray-200">
      
      {/* 3D Space Particle Background Canvas */}
      <ThreeBackground />

      {/* Floating Status Bar */}
      <header className="sticky top-0 z-50 w-full bg-bgDark/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Cpu className="text-primary animate-pulse" size={20} />
            <span className="font-mono text-sm font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              OPTIMIZER_SIM
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation links */}
            <nav className="hidden md:flex gap-6 text-xs font-semibold font-mono text-gray-400">
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#techniques" className="hover:text-white transition-colors">Techniques</a>
              <a href="#simulator" className="hover:text-white transition-colors">Simulator</a>
              <a href="#algorithms" className="hover:text-white transition-colors">Algorithms</a>
              <a href="#team" className="hover:text-white transition-colors">Team</a>
            </nav>

            {/* Live Server Indicator badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[10px] font-mono select-none">
              {isCheckingBackend ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                  <span className="text-gray-400">Checking Live server...</span>
                </>
              ) : backendConnected ? (
                <>
                  <Server className="text-emerald-400" size={10} />
                  <span className="text-emerald-400 font-semibold">Python Live (Flask)</span>
                </>
              ) : (
                <>
                  <ServerOff className="text-slate-500" size={10} />
                  <span className="text-slate-400">Client Simulation Mode</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Layout Flow */}
      <main className="pb-12">
        <Hero />
        <About />
        <Techniques />
        
        {/* Core Workspace component */}
        <Simulator
          code={code}
          setCode={setCode}
          result={result}
          setResult={setResult}
          isSimulating={isSimulating}
          setIsSimulating={setIsSimulating}
          currentPhase={currentPhase}
          setCurrentPhase={setCurrentPhase}
          onOptimizeComplete={handleOptimizeComplete}
          backendConnected={backendConnected}
        />

        {/* Scroll-reveal compiler stages workflow */}
        <Workflow />

        {/* Pseudo-code and algorithms section */}
        <Algorithms />

        {/* Split comparison results panel */}
        <Results result={result} />

        {/* Future pipeline upgrades */}
        <FutureEnhancements />

        {/* Academic Authors team profiles */}
        <Team />
      </main>

      {/* Footer layout */}
      <Footer />
    </div>
  );
}

export default App;
