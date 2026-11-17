import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Eye, 
  Award, 
  Users, 
  Sparkles,
  Zap,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';
import { sound } from '../lib/soundFx';

// Photorealistic assets
import teamCollabImg from '../assets/images/studio_team_collab_1792060940941.jpg';
import brightonImg from '../assets/images/brighton_founder_laptop_1790843148910.jpg';

const ROTATING_MISSIONS = [
  {
    title: 'Precision Pre-Press Mission',
    text: 'Delivering uncompromising high-resolution CMYK calibrated artwork that guarantees color precision and market dominance in print and digital feeds.'
  },
  {
    title: 'High-Impact Brand Strategy',
    text: 'Engineering sculpted 3D typography, luxury metallic gold accents, and bespoke visual hierarchy that commands industry respect.'
  },
  {
    title: 'Zero-Defect Print SLA',
    text: 'Testing every raster layer against physical FOGRA39 standards with full bleed margins to eliminate costly print shop reprints.'
  }
];

const ROTATING_VISIONS = [
  {
    title: 'African Creative Leadership',
    text: 'Empowering African and global ministries, enterprises, and startups with world-class visual creative standards that command respect.'
  },
  {
    title: 'Commercial Growth Engines',
    text: 'Architecting digital web systems and conversion-focused assets that generate measurable sales velocity and long-term brand equity.'
  },
  {
    title: 'Continuous Craft Innovation',
    text: 'Merging traditional artisanal design sensibilities with cutting-edge computational workflows and real-time client collaboration.'
  }
];

interface OptibizAboutSectionProps {
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onOpenVideo?: () => void;
}

export const OptibizAboutSection: React.FC<OptibizAboutSectionProps> = ({
  onNavigate,
  onOpenVideo
}) => {
  // Fast Target Aim Counters: All three two-figure numbers count fast and land with plus signs (85+, 99+, 50+)
  const [aboutAimCount, setAboutAimCount] = useState<number>(10);
  const [aboutSlaCount, setAboutSlaCount] = useState<number>(20);
  const [aboutPartnerCount, setAboutPartnerCount] = useState<number>(10);
  const [secondTick, setSecondTick] = useState<number>(1);

  // Rotating Mission & Vision highlights changing from now and then
  const [visionIdx, setVisionIdx] = useState<number>(0);

  useEffect(() => {
    let currentAim = 12;
    let currentSla = 20;
    let currentPartner = 10;

    const fastTimer = setInterval(() => {
      // 1. Aim Count to 85+
      if (currentAim < 85) {
        currentAim += 1;
        setAboutAimCount(currentAim);
      } else {
        setAboutAimCount(85);
      }

      // 2. SLA Count to 99+
      if (currentSla < 99) {
        currentSla += 1;
        setAboutSlaCount(currentSla);
      } else {
        setAboutSlaCount(99);
      }

      // 3. Partner Count to 50+
      if (currentPartner < 50) {
        currentPartner += 1;
        setAboutPartnerCount(currentPartner);
      } else {
        setAboutPartnerCount(50);
      }
    }, 32);

    // Refresh counting velocity every 8.5 seconds so numbers stay alive and actively count
    const cycleTimer = setInterval(() => {
      currentAim = 15;
      currentSla = 25;
      currentPartner = 12;
      setAboutAimCount(15);
      setAboutSlaCount(25);
      setAboutPartnerCount(12);
    }, 8500);

    const vTimer = setInterval(() => {
      setVisionIdx(prev => (prev + 1) % 3);
    }, 4200);

    const tickTimer = setInterval(() => {
      setSecondTick(prev => (prev % 60) + 1);
    }, 1000);

    return () => {
      clearInterval(fastTimer);
      clearInterval(cycleTimer);
      clearInterval(vTimer);
      clearInterval(tickTimer);
    };
  }, []);

  return (
    <section 
      id="about-optibiz-section"
      className="relative w-full bg-white text-black py-12 sm:py-20 px-3 sm:px-6 lg:px-8 border-y-2 border-neutral-200 select-none shadow-sm"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* ===================================================================== */}
        {/* 1. TWO-COLUMN SPLIT: PHOTOGRAPHY (LEFT) & STORY + PILLARS (RIGHT)     */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT 6 COLS: PHOTOGRAPHIC TEAM COLLAGE                                */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 group bg-neutral-100">
              <img 
                src={teamCollabImg} 
                alt="R'tson Creations design team reviewing pre-press proofs"
                referrerPolicy="no-referrer"
                className="w-full h-[280px] sm:h-[420px] lg:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Award Badge */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-xl flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#ff6b00] text-black flex items-center justify-center font-black shadow-xs">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <div className="text-left font-sans">
                  <div className="text-xs font-black text-black leading-tight">Master Atelier</div>
                  <div className="text-[10px] text-neutral-600 font-bold">Harare Pre-Press Hub</div>
                </div>
              </div>

              {/* Founder Overlay Card Bottom */}
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 left-3 sm:left-4 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/95 text-black backdrop-blur-md border border-neutral-200 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <img 
                    src={brightonImg} 
                    alt="Brighton Lead Designer"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#ff6b00]"
                  />
                  <div className="text-left">
                    <div className="text-xs font-black text-black">Brighton (Lead Designer)</div>
                    <div className="text-[9px] sm:text-[10px] text-[#ff6b00] font-mono font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] animate-ping" />
                      <span className="truncate">Directing Brand Transformations</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (onOpenVideo) onOpenVideo();
                  }}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#ff6b00] text-black font-black text-[9px] sm:text-[10px] uppercase tracking-wider hover:bg-[#ff7a00] transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Story
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT 6 COLS: ABOUT STORY, MISSION, VISION & CALLOUT BAR             */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
            
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-[#ff6b00]/40 text-[#ff6b00] font-mono text-[11px] font-bold tracking-wide">
              <span>About Atelier</span>
            </div>

            {/* Main Headline with Motion */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-2xl lg:text-4xl font-black text-black tracking-tight leading-[1.15]"
            >
              The Leading Design &amp; <br />
              <span className="text-[#ff6b00]">Pre-Press Atelier In Town</span>
            </motion.h2>

            {/* Two Pillars: Company Mission & Company Vision (Changing From Now and Then) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 pt-1">
              
              {/* Pillar 1: Rotating Company Mission */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 min-h-[110px] shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ff6b00]/15 border border-[#ff6b00] flex items-center justify-center text-[#ff6b00]">
                    <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff6b00]" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.h4 
                      key={`mission-title-${visionIdx}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35 }}
                      className="text-xs sm:text-sm font-black text-black"
                    >
                      {ROTATING_MISSIONS[visionIdx].title}
                    </motion.h4>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={`mission-text-${visionIdx}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-relaxed"
                  >
                    {ROTATING_MISSIONS[visionIdx].text}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Pillar 2: Rotating Company Vision */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 min-h-[110px] shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black border border-black flex items-center justify-center text-white">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.h4 
                      key={`vision-title-${visionIdx}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35 }}
                      className="text-xs sm:text-sm font-black text-black"
                    >
                      {ROTATING_VISIONS[visionIdx].title}
                    </motion.h4>
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={`vision-text-${visionIdx}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-relaxed"
                  >
                    {ROTATING_VISIONS[visionIdx].text}
                  </motion.p>
                </AnimatePresence>
              </div>

            </div>

            {/* Obsidian Capsule Callout Bar */}
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xl border border-black">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#ff6b00] text-black flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-200 leading-snug">
                  Achieve visual dominance and reach your brand target goals.
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigate('about');
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>

          </div>

        </div>

        {/* ===================================================================== */}
        {/* 2. UNBOXED STUDIO TARGET AIMS (TWO FIGURES WITH PLUS SIGN: 85+, 99+, 50+) */}
        {/* Bold outlined numbers in Orange, Black & White with compact mobile layout */}
        {/* ===================================================================== */}
        <div className="pt-6 sm:pt-8 border-t-2 border-neutral-200 space-y-6">
          
          <div className="flex items-center justify-between flex-wrap gap-2 text-left">
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#ff6b00] uppercase tracking-widest block mb-0.5">
                ACTIVE STUDIO AIMS
              </span>
              <h3 className="text-base sm:text-2xl font-black text-black tracking-tight">
                Target Milestones Under Active Progression
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff6b00] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono text-neutral-600 font-bold">
                Two-Figure Aims
              </span>
            </div>
          </div>

          {/* Clean Unboxed 3-Column Grid: Bold Outlined Numbers with Plus Signs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 lg:gap-12 text-left pt-1">
            
            {/* Target 1: Brands Aim (Electric Orange, e.g. 85+) */}
            <div className="space-y-1 sm:space-y-1.5 border-l-3 sm:border-l-4 border-[#ff6b00] pl-3 sm:pl-5">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#ff6b00] uppercase tracking-wider block">
                BRAND TRANSFORMATIONS
              </span>
              <div 
                className="text-3xl sm:text-5xl lg:text-6xl font-black font-mono text-transparent tracking-tight leading-none"
                style={{ WebkitTextStroke: '2.5px #ff6b00' }}
              >
                {aboutAimCount}+
              </div>
              <div className="text-xs sm:text-sm font-black text-black pt-0.5">
                Aimed Brands Target
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-relaxed">
                Active regional milestone for African corporate &amp; church brands.
              </p>
            </div>

            {/* Target 2: 99+ Pre-Press Precision SLA Aim (Jet Black Outlined in the Middle!) */}
            <div className="space-y-1 sm:space-y-1.5 border-l-3 sm:border-l-4 border-black pl-3 sm:pl-5">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-neutral-800 uppercase tracking-wider block">
                ZERO-DEFECT PRINT PASS
              </span>
              <div 
                className="text-3xl sm:text-5xl lg:text-6xl font-black font-mono text-transparent tracking-tight leading-none"
                style={{ WebkitTextStroke: '2.5px #000000' }}
              >
                {aboutSlaCount}+
              </div>
              <div className="text-xs sm:text-sm font-black text-black pt-0.5">
                Pre-Press Precision Target
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-relaxed">
                Calibrated CMYK press passes with full bleed tolerances.
              </p>
            </div>

            {/* Target 3: 50+ Regional Enterprise Partners Aim (Electric Orange) */}
            <div className="space-y-1 sm:space-y-1.5 border-l-3 sm:border-l-4 border-[#ff6b00] pl-3 sm:pl-5">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#ff6b00] uppercase tracking-wider block">
                ENTERPRISE ALLIANCES
              </span>
              <div 
                className="text-3xl sm:text-5xl lg:text-6xl font-black font-mono text-transparent tracking-tight leading-none"
                style={{ WebkitTextStroke: '2.5px #ff6b00' }}
              >
                {aboutPartnerCount}+
              </div>
              <div className="text-xs sm:text-sm font-black text-black pt-0.5">
                Strategic Partner Deployments
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-relaxed">
                Commercial and institutional platforms actively engineered.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
