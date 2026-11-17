import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Layers, 
  Palette, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  CheckCircle2,
  Workflow,
  Terminal,
  Database,
  Clock,
  Activity,
  TrendingUp
} from 'lucide-react';

const TECH_CATEGORIES = [
  {
    category: 'Full-Stack Web & E-Commerce',
    icon: Code2,
    technologies: [
      { name: 'React & Next.js', role: 'High-performance SSR & SPA architectures' },
      { name: 'TypeScript', role: 'Strict enterprise type safety & reliable logic' },
      { name: 'Tailwind CSS', role: 'Zero-runtime utility styling & responsive layouts' },
      { name: 'EcoCash & Zimswitch', role: 'Seamless Zimbabwean & regional payment gateways' },
      { name: 'Paynow Gateway', role: 'Automated multi-currency billing and instant settlement' }
    ]
  },
  {
    category: '300 DPI Pre-Press & Graphic Design',
    icon: Palette,
    technologies: [
      { name: 'Adobe Photoshop', role: 'Frequency separation retouching & pixel compositing' },
      { name: 'Adobe Illustrator', role: 'Infinite-resolution vector curves & trademark glyphs' },
      { name: 'Adobe Lightroom', role: 'CMYK ink density calibration & skin lighting balance' },
      { name: 'Cinema 4D / 3D Typography', role: 'Sculpted metallic gold crests & volumetric lights' },
      { name: 'Figma Systems', role: 'Fluid breakpoint tokens & collaborative UI kits' }
    ]
  },
  {
    category: 'Mobile, Cloud & AI Systems',
    icon: Cpu,
    technologies: [
      { name: 'Flutter & React Native', role: 'Cross-platform native iOS & Android applications' },
      { name: 'Firebase Firestore', role: 'Real-time database sync & secure client states' },
      { name: 'Google AI Studio', role: 'Multimodal visual analysis & automated proofing heuristics' },
      { name: 'Node.js & Express', role: 'High-concurrency RESTful microservices' },
      { name: 'PostgreSQL & Cloud SQL', role: 'Relational transaction integrity & audit logs' }
    ]
  }
];

const ROTATING_TARGET_HEADLINES = [
  'Target: 1,000 High-Velocity Digital & Print Deliveries',
  'Target: Zero-Defect 300 DPI CMYK Offset Press Passes',
  'Target: Sub-Second 0.8s Headless Web Performance',
  'Target: Seamless EcoCash & Multi-Currency Settlement'
];

export const QuatroTechStackSection: React.FC = () => {
  const [targetHeadlineIdx, setTargetHeadlineIdx] = useState<number>(0);

  useEffect(() => {
    const hTimer = setInterval(() => {
      setTargetHeadlineIdx(prev => (prev + 1) % ROTATING_TARGET_HEADLINES.length);
    }, 3800);

    return () => clearInterval(hTimer);
  }, []);

  return (
    <section 
      id="quatro-tech-stack-section"
      className="relative w-full bg-[#04080c] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-teal-950 select-none overflow-hidden"
    >
      {/* Background Radial Glow in Electric Cyan and Lime */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-[#00f0ff]/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-[#d4f15d]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d222b] border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>ENGINEERING &amp; DESIGN CAPABILITIES</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            High-Velocity Technologies. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00f0ff] to-[#d4f15d]">
              Calibrated Pre-Press Craft.
            </span>
          </h2>

          {/* Animated Changing Target Headline */}
          <div className="h-7 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={targetHeadlineIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="text-xs sm:text-sm font-mono text-[#00f0ff] font-bold flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4f15d]" />
                <span>{ROTATING_TARGET_HEADLINES[targetHeadlineIdx]}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed max-w-xl mx-auto">
            We don't rely on cookie-cutter page builders. We write bespoke, optimized code and calibrate every raster pixel for high-volume conversion and flawless print press passes.
          </p>
        </div>

        {/* 3 Discipline Technology Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {TECH_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                className="p-7 rounded-3xl bg-[#08151c] border border-teal-900/60 hover:border-[#d4f15d]/40 space-y-6 shadow-2xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#d4f15d]/10 border border-[#d4f15d]/30 text-[#d4f15d] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-black text-white tracking-tight">
                      {cat.category}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-2">
                    {cat.technologies.map((tech, tIdx) => (
                      <div key={tIdx} className="p-3 rounded-2xl bg-[#040b10] border border-teal-950 space-y-0.5 text-left">
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span>{tech.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4f15d]" />
                        </div>
                        <div className="text-[10px] text-zinc-400 leading-tight">
                          {tech.role}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-teal-950 flex items-center justify-between text-[11px] font-mono text-[#d4f15d]">
                  <span>PRODUCTION READY</span>
                  <span>100% VERIFIED</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
