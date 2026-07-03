import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldCheck } from 'lucide-react';

interface Member {
  name: string;
  role: string;
  sub: string;
  avatarInitials: string;
  email: string;
  github: string;
  linkedin: string;
  gradient: string;
}

export const Team: React.FC = () => {
  const members: Member[] = [
    {
      name: 'A. Sruti Vidya',
      role: 'Compiler Architect',
      sub: 'Algorithm Design & Compiler Logic',
      avatarInitials: 'SV',
      email: 'mailto:2420030640@gmail.com',
      github: 'https://github.com/2420030640',
      linkedin: 'https://www.linkedin.com/in/a-sruti-vidya-434235324',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      name: 'P. Bhavya Sree',
      role: 'Backend & Optimization Engineer',
      sub: 'AST Evaluation & Python Core Engine',
      avatarInitials: 'BS',
      email: 'mailto:bhavyasreepotnuru@gmail.com',
      github: 'https://github.com/BHAVYA-2257',
      linkedin: 'https://www.linkedin.com/in/bhavya-sree-potnuru-38b76435b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      gradient: 'from-purple-600 to-pink-500'
    }
  ];

  return (
    <section id="team" className="py-20 relative bg-slate-950/10 border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold mb-3">Project Development Team</h2>
          <p className="text-gray-400 text-sm font-light">
            Designed and developed as a Compiler Design academic project.
          </p>
        </div>

        {/* Team Cards Container */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center max-w-3xl mx-auto">
          {members.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="flex-1 glass-panel p-8 border-white/5 flex flex-col items-center justify-between text-center relative overflow-hidden group"
            >
              {/* Background accent hover glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex flex-col items-center w-full">
                
                {/* Avatar Initials Bubble */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-bold font-mono shadow-lg mb-6 group-hover:scale-105 transition-transform duration-300 relative`}>
                  <span>{member.avatarInitials}</span>
                  <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-1 border border-white/10">
                    <ShieldCheck size={12} className="text-cyan-400" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                  {member.name}
                </h3>
                <div className="text-xs font-semibold text-cyan-300 font-mono mb-2 uppercase tracking-wide">
                  {member.role}
                </div>
                <p className="text-xs text-gray-500 font-light mb-6">
                  {member.sub}
                </p>
              </div>

              {/* Social actions */}
              <div className="flex gap-4 mt-4 pt-6 border-t border-white/5 w-full justify-center">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a
                  href={member.email}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <Mail size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
