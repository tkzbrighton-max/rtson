import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Play, 
  Star, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Briefcase, 
  Compass, 
  Code2, 
  DollarSign, 
  Sparkles,
  Layers,
  ArrowUpRight,
  Clock,
  Zap,
  Cpu,
  Palette,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../lib/soundFx';

// Photorealistic assets
import teamCollabImg from '../assets/images/studio_team_collab_1792060940941.jpg';
import brightonImg from '../assets/images/brighton_founder_laptop_1790843148910.jpg';
import realChurchFlyerImg from '../assets/images/real_church_flyer_1787906566871.jpg';
import webShowcaseImg from '../assets/images/web_solutions_showcase_1791468102626.jpg';
import prepressCmykImg from '../assets/images/prepress_dominance_cmyk_1793786947690.jpg';
import brand3dGoldImg from '../assets/images/brand_strategy_3d_gold_1793786960181.jpg';
import { AgencyMarquee } from './AgencyMarquee';

interface OptibizStudioHeroProps {
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onOpenVideo: () => void;
  onOpenAdmin?: () => void;
  isAdminVisible?: boolean;
}

const ROTATING_HEADLINES = [
  'Excellence',
  'Pre-Press Mastery',
  'High-Speed Code',
  '3D Visual Power',
  'Market Dominance'
];

const ROTATING_SUBTITLES = [
  'We architect custom high-performance websites, conversion-driven e-commerce platforms, and calibrated pre-press brand identities for enterprises across Southern Africa.',
  'We engineer sculpted 3D gold typography, conference summit posters, and bleeding-edge CMYK print files calibrated for zero-defect printing.',
  'We deliver express turnaround, zero disposable templates, and direct atelier collaboration with Brighton and our engineering team.',
  'We integrate EcoCash, Zimswitch, Paynow, and global card checkouts with sub-second speeds and dedicated pre-press guarantees.'
];

const ROTATING_BADGES = [
  'Full-Service Digital & Pre-Press Agency • Harare',
  'Active Pan-African Brand Transformation Studio',
  'Express Pre-Press SLA • Zimbabwe',
  'FOGRA39 CMYK Press-Pass Calibration Standard'
];

export const OptibizStudioHero: React.FC<OptibizStudioHeroProps> = ({
  onNavigate,
  onOpenVideo
}) => {
  // Animated Changing Texts states ("changing from now and then")
  const [headlineIdx, setHeadlineIdx] = useState<number>(0);
  const [subIdx, setSubIdx] = useState<number>(0);
  const [badgeIdx, setBadgeIdx] = useState<number>(0);

  // Changing phone display screen from now and then
  const [phoneScreenIdx, setPhoneScreenIdx] = useState<number>(0);

  // Timers for rotating texts changing from now and then
  useEffect(() => {
    const hTimer = setInterval(() => {
      setHeadlineIdx(prev => (prev + 1) % ROTATING_HEADLINES.length);
    }, 3200);

    const sTimer = setInterval(() => {
      setSubIdx(prev => (prev + 1) % ROTATING_SUBTITLES.length);
    }, 4800);

    const bTimer = setInterval(() => {
      setBadgeIdx(prev => (prev + 1) % ROTATING_BADGES.length);
    }, 3600);

    const pTimer = setInterval(() => {
      setPhoneScreenIdx(prev => (prev + 1) % 4);
    }, 5500);

    return () => {
      clearInterval(hTimer);
      clearInterval(sTimer);
      clearInterval(bTimer);
      clearInterval(pTimer);
    };
  }, []);

  return (
    <div className="relative w-full bg-[#12151a] text-white overflow-hidden select-none">
      
      {/* Ambient Radial Lighting Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#ff6b00]/5 blur-[160px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-white/[0.04] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full bg-[#ff6b00]/5 blur-[190px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* MAIN HERO SPLIT: QUATROHAUS FULL-SERVICE DIGITAL & PRE-PRESS ARCHITECTURE */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 lg:pb-24 relative z-10">
        
        {/* Top Atelier Status Badge */}
        <div className="flex items-center justify-start pb-4 sm:pb-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#181c24] border border-white/12 text-[9px] sm:text-[11px] font-mono text-zinc-300 shadow-sm max-w-full truncate">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff6b00] shrink-0" />
            <span className="text-[#ff6b00] font-bold shrink-0">R'TSON CREATIONS</span>
            <span className="text-zinc-600 shrink-0">|</span>
            <span className="truncate">HARARE ATELIER</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout: GUARANTEED SIDE-BY-SIDE on mobile and desktop */}
        <div className="flex flex-row items-center justify-between gap-2.5 sm:gap-6 lg:gap-12">
            
            {/* ===================================================================== */}
            {/* LEFT: ANIMATED CHANGING HEADLINE, SUBTITLE & CTA (SCALED FOR MOBILE)  */}
            {/* ===================================================================== */}
            <div className="flex-1 min-w-0 space-y-2 sm:space-y-4 lg:space-y-5 text-left">
              
              {/* Dynamic Animated Badge Changing from Now and Then */}
              <div className="h-5 sm:h-8 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={badgeIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-[#1c212a] border border-[#ff6b00]/40 text-[#ff6b00] font-mono text-[7.5px] sm:text-xs font-bold tracking-wide shadow-sm max-w-full truncate"
                  >
                    <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#ff6b00] shrink-0" />
                    <span className="truncate">{ROTATING_BADGES[badgeIdx]}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Main Headline with Animated Word Changing from Now and Then (Scaled for Mobile) */}
              <div className="space-y-0.5 sm:space-y-1 min-h-[52px] sm:min-h-[105px] md:min-h-[145px]">
                <h1 className="text-[13px] xs:text-[15px] sm:text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                  Where Strategy <br />
                  <span className="text-white">Meets Sculpted</span> <br />
                  <div className="relative inline-block overflow-hidden py-0.5 sm:py-1">
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={headlineIdx}
                        initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -16, filter: 'blur(3px)' }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] via-white to-[#ff6b00] block"
                      >
                        {ROTATING_HEADLINES[headlineIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </h1>
              </div>

              {/* Dynamic Supporting Copy Changing from Now and Then (Scaled for Mobile) */}
              <div className="min-h-[30px] sm:min-h-[55px] md:min-h-[65px]">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={subIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                    className="text-[8.5px] xs:text-[9.5px] sm:text-xs md:text-sm lg:text-base text-zinc-300 font-medium leading-tight sm:leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-3 md:line-clamp-none"
                  >
                    {ROTATING_SUBTITLES[subIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Action Buttons: Start A Project (Orange) + Watch Showreel */}
              <div className="flex items-center gap-1.5 sm:gap-4 pt-0.5 sm:pt-1">
                
                {/* 1. Start A Project Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onNavigate('order');
                  }}
                  className="px-2.5 xs:px-3 sm:px-6 py-1.5 sm:py-3.5 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] active:scale-95 text-black font-black text-[8.5px] xs:text-[9.5px] sm:text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#ff6b00]/25 flex items-center gap-1 xs:gap-1.5 sm:gap-3 cursor-pointer group hover:scale-[1.02] shrink-0"
                >
                  <span>Start A Project</span>
                  <div className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-6 sm:h-6 rounded-full bg-black text-[#ff6b00] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                </button>

                {/* 2. Play Video Circle Button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onOpenVideo();
                  }}
                  className="w-6 h-6 xs:w-7 xs:h-7 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer shadow-sm hover:scale-110 active:scale-95 group shrink-0"
                  title="Watch Studio Showreel"
                >
                  <Play className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-5 sm:h-5 fill-white translate-x-0.5 text-white" />
                </button>

              </div>

              {/* Studio Quality & Focus Standards (Compact & Single-Row on Mobile) */}
              <div className="pt-1.5 sm:pt-3 flex items-center gap-2 sm:gap-8 border-t border-white/10">
                
                {/* 1. Brand Transformations Focus */}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1 text-[7px] sm:text-[10px] text-white font-mono font-bold uppercase tracking-wider">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ff6b00] animate-pulse" />
                    <span>Brand Architecture</span>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="h-3 sm:h-6 w-px bg-white/10" />

                {/* 2. Print Quality Focus */}
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1 text-[7px] sm:text-[10px] text-[#ff6b00] font-mono font-bold uppercase tracking-wider">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ff6b00]" />
                    <span>Pre-Press Precision</span>
                  </div>
                </div>

              </div>

            </div>

            {/* ===================================================================== */}
            {/* RIGHT: SHRUNK COMPRESSED SMARTPHONE (ALWAYS SIDE BY SIDE ON MOBILE)   */}
            {/* Stationary frame, compact mobile footprint, internal screen cycle     */}
            {/* ===================================================================== */}
            <div className="w-[105px] xs:w-[120px] sm:w-[180px] md:w-[240px] lg:w-[280px] shrink-0 relative flex items-center justify-center">
              
              {/* Perspective Container scaled down for Mobile screens */}
              <div className="relative w-full h-[195px] xs:h-[220px] sm:h-[310px] md:h-[400px] lg:h-[460px] flex items-center justify-center">
                
                {/* Underglow Reflection */}
                <div 
                  className="absolute inset-0 bg-radial from-[#ff6b00]/15 via-white/[0.05] to-transparent blur-xl sm:blur-3xl rounded-full transform -rotate-12 pointer-events-none" 
                />

                {/* DEVICE 2 (Behind - hidden on mobile, visible on sm+) */}
                <div 
                  className="hidden sm:block absolute w-[160px] sm:w-[195px] lg:w-[245px] h-[310px] sm:h-[375px] lg:h-[455px] rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] bg-black p-2 sm:p-2.5 lg:p-3 border-2 sm:border-4 border-zinc-800 shadow-2xl overflow-hidden"
                  style={{
                    transform: 'perspective(1200px) rotateX(16deg) rotateY(-18deg) rotateZ(12deg) translate3d(-24px, 18px, -30px)',
                    boxShadow: '-15px 20px 40px rgba(0,0,0,0.9), 0 0 20px rgba(255,107,0,0.15)'
                  }}
                >
                  <div className="relative w-full h-full rounded-[22px] sm:rounded-[28px] overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img 
                      src={realChurchFlyerImg} 
                      alt="Pre-Press Master Flyer Artwork"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5 text-left">
                      <span className="text-[8px] font-mono text-[#ff6b00] font-black uppercase tracking-wider">
                        Target: 300 DPI Pre-Press
                      </span>
                      <span className="text-[10px] font-black text-white leading-tight mt-0.5">
                        Revival Summit 2026
                      </span>
                    </div>
                  </div>
                </div>

                {/* DEVICE 1 (Front - Shrunk to fit mobile side-by-side with moto text) */}
                <div 
                  className="relative z-20 w-[100px] xs:w-[115px] sm:w-[170px] md:w-[215px] lg:w-[245px] h-[195px] xs:h-[218px] sm:h-[305px] md:h-[390px] lg:h-[455px] rounded-[18px] xs:rounded-[22px] sm:rounded-[32px] lg:rounded-[40px] bg-black p-1 xs:p-1.5 sm:p-2.5 lg:p-3 border-2 sm:border-3 lg:border-4 border-zinc-800 shadow-2xl overflow-hidden"
                  style={{
                    boxShadow: '-10px 14px 35px rgba(0,0,0,0.95), 0 0 25px rgba(255,107,0,0.18)'
                  }}
                >
                  {/* DYNAMIC SCREEN CONTENT CHANGING FROM NOW AND THEN */}
                  <AnimatePresence mode="wait">
                    {/* SCREEN 0: Live Target Revenue & Velocity */}
                    {phoneScreenIdx === 0 && (
                      <motion.div 
                        key="screen-revenue"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full h-full rounded-[14px] xs:rounded-[18px] sm:rounded-[26px] lg:rounded-[32px] bg-[#0c0c0c] text-white p-1.5 xs:p-2 sm:p-3 lg:p-4 flex flex-col justify-between overflow-hidden shadow-inner text-left font-sans"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-zinc-400 font-mono">RADAR</span>
                          <div className="w-6 xs:w-8 sm:w-14 h-1.5 xs:h-2 sm:h-3.5 rounded-full bg-zinc-900" />
                          <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-[#ff6b00] font-mono">LIVE</span>
                        </div>

                        <div className="p-1 xs:p-1.5 sm:p-2.5 rounded-lg xs:rounded-xl bg-white text-black border border-neutral-200 shadow-md">
                          <div className="flex items-center justify-between text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-neutral-600">
                            <span>Milestone</span>
                            <TrendingUp className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3.5 sm:h-3.5 text-[#ff6b00]" />
                          </div>
                          <div className="text-[8px] xs:text-[9px] sm:text-sm md:text-base lg:text-xl font-black tracking-tight text-black font-mono my-0.5 truncate">
                            Brand Architecture
                          </div>
                          <div className="text-[5.5px] xs:text-[6.5px] sm:text-[8px] font-mono font-bold text-[#ff6b00]">
                            African Standard
                          </div>
                        </div>

                        {/* Curve Graph */}
                        <div className="relative h-7 xs:h-9 sm:h-16 lg:h-20 w-full flex items-center justify-center">
                          <svg viewBox="0 0 200 70" className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="chartLineGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#ff6b00" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d="M 10 50 Q 50 15 90 35 T 180 15" fill="none" stroke="#262626" strokeWidth="3" strokeLinecap="round" />
                            <path d="M 10 50 Q 50 15 90 35 T 180 15 L 180 70 L 10 70 Z" fill="url(#chartLineGrad)" />
                            <circle cx="90" cy="35" r="4" fill="#ff6b00" stroke="#000000" strokeWidth="2" />
                            <circle cx="180" cy="15" r="4" fill="#ff6b00" stroke="#000000" strokeWidth="2" />
                          </svg>
                        </div>

                        <div className="space-y-0.5">
                          <div className="p-0.5 xs:p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-zinc-900 border border-white/10 shadow-xs flex items-center justify-between">
                            <div className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-white">Pre-Press</div>
                            <span className="text-[5.5px] xs:text-[6px] sm:text-[8px] font-bold text-[#ff6b00] bg-[#ff6b00]/10 px-1 py-0.2 rounded">PASSED</span>
                          </div>
                        </div>

                        <div className="pt-0.5">
                          <button 
                            type="button"
                            onClick={() => onNavigate('order')}
                            className="w-full py-0.5 xs:py-1 rounded-md sm:rounded-lg bg-[#ff6b00] text-black font-black text-[6px] xs:text-[7px] sm:text-[9px] tracking-wide cursor-pointer hover:bg-[#ff7a00] transition-colors"
                          >
                            Commission Studio
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* SCREEN 1: Pre-Press Flight Check */}
                    {phoneScreenIdx === 1 && (
                      <motion.div 
                        key="screen-prepress"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full h-full rounded-[14px] xs:rounded-[18px] sm:rounded-[26px] lg:rounded-[32px] bg-[#0c0c0c] text-white p-1.5 xs:p-2 sm:p-3 lg:p-4 flex flex-col justify-between overflow-hidden shadow-inner text-left font-sans"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-[#ff6b00] font-mono">PRE-PRESS</span>
                          <div className="w-6 xs:w-8 sm:w-14 h-1.5 xs:h-2 sm:h-3.5 rounded-full bg-zinc-900" />
                          <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-white font-mono">OK</span>
                        </div>

                        <div className="p-1 xs:p-1.5 sm:p-2.5 rounded-lg xs:rounded-xl bg-white text-black border border-neutral-200 space-y-0.5 shadow-md">
                          <div className="text-[6px] xs:text-[7px] sm:text-[9px] font-mono text-neutral-600">Target Standard:</div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs md:text-base font-black text-black font-mono">CMYK Press</div>
                          <div className="text-[5.5px] xs:text-[6px] sm:text-[8px] font-bold text-[#ff6b00]">FOGRA Bleed Pass</div>
                        </div>

                        <div className="space-y-0.5 p-1 xs:p-1.5 rounded-md sm:rounded-lg bg-zinc-900 border border-white/10 font-mono text-[6px] xs:text-[7px] sm:text-[8px]">
                          <div className="flex justify-between text-zinc-400">
                            <span>Cyan:</span>
                            <span className="text-white font-bold">Optimal</span>
                          </div>
                          <div className="w-full bg-black h-0.5 xs:h-1 rounded-full overflow-hidden">
                            <div className="bg-[#ff6b00] h-full w-full" />
                          </div>
                          <div className="flex justify-between text-zinc-400">
                            <span>Magenta:</span>
                            <span className="text-white font-bold">Optimal</span>
                          </div>
                          <div className="w-full bg-black h-0.5 xs:h-1 rounded-full overflow-hidden">
                            <div className="bg-white h-full w-full" />
                          </div>
                        </div>

                        <div className="pt-0.5">
                          <button 
                            type="button"
                            onClick={() => onNavigate('products')}
                            className="w-full py-0.5 xs:py-1 rounded-md sm:rounded-lg bg-[#ff6b00] text-black font-black text-[6px] xs:text-[7px] sm:text-[9px] tracking-wide cursor-pointer hover:bg-[#ff7a00] transition-colors"
                          >
                            Explore Catalogue
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* SCREEN 2: Web Vitals & Payment Gateways */}
                    {phoneScreenIdx === 2 && (
                      <motion.div 
                        key="screen-webvitals"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full h-full rounded-[14px] xs:rounded-[18px] sm:rounded-[26px] lg:rounded-[32px] bg-[#0c0c0c] text-white p-1.5 xs:p-2 sm:p-3 lg:p-4 flex flex-col justify-between overflow-hidden shadow-inner text-left font-sans"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-zinc-400 font-mono">WEB UI</span>
                          <div className="w-6 xs:w-8 sm:w-14 h-1.5 xs:h-2 sm:h-3.5 rounded-full bg-zinc-900" />
                          <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-[#ff6b00] font-mono">FAST</span>
                        </div>

                        <div className="p-1 xs:p-1.5 sm:p-2.5 rounded-lg xs:rounded-xl bg-white text-black border border-neutral-200 shadow-md">
                          <div className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-neutral-600">Speed Target</div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs md:text-base font-black font-mono tracking-tight text-black">Sub-Second</div>
                        </div>

                        <div className="space-y-0.5">
                          <div className="p-1 rounded-md sm:rounded-lg bg-zinc-900 border border-white/10 text-[6px] xs:text-[7px] sm:text-[8px] space-y-0.5 font-mono">
                            <div className="flex justify-between">
                              <span>EcoCash:</span>
                              <span className="text-[#ff6b00] font-bold">ONLINE</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Paynow:</span>
                              <span className="text-white font-bold">ACTIVE</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-0.5">
                          <button 
                            type="button"
                            onClick={() => onNavigate('order')}
                            className="w-full py-0.5 xs:py-1 rounded-md sm:rounded-lg bg-[#ff6b00] text-black font-black text-[6px] xs:text-[7px] sm:text-[9px] tracking-wide cursor-pointer hover:bg-[#ff7a00] transition-colors"
                          >
                            Launch Web UI
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* SCREEN 3: Studio Frequency Separation Retouch */}
                    {phoneScreenIdx === 3 && (
                      <motion.div 
                        key="screen-retouch"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full h-full rounded-[14px] xs:rounded-[18px] sm:rounded-[26px] lg:rounded-[32px] bg-[#0c0c0c] text-white p-1.5 xs:p-2 sm:p-3 lg:p-4 flex flex-col justify-between overflow-hidden shadow-inner text-left font-sans"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-[#ff6b00] font-mono">RETOUCH</span>
                          <div className="w-6 xs:w-8 sm:w-14 h-1.5 xs:h-2 sm:h-3.5 rounded-full bg-zinc-900" />
                          <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-bold text-white font-mono">FREQ SEP</span>
                        </div>

                        <div className="p-1 xs:p-1.5 sm:p-2.5 rounded-lg xs:rounded-xl bg-white text-black border border-neutral-200 space-y-0.5 shadow-md">
                          <div className="text-[6px] xs:text-[7px] sm:text-[8px] font-mono text-neutral-600">Skin Texture:</div>
                          <div className="text-[8px] xs:text-[10px] sm:text-xs md:text-base font-black text-black font-mono">Pores Intact</div>
                        </div>

                        <div className="p-1 rounded-md sm:rounded-lg bg-zinc-900 border border-white/10 text-[6px] xs:text-[7px] sm:text-[8px] font-mono space-y-0.5">
                          <div className="flex justify-between text-zinc-400">
                            <span>Skin Lock:</span>
                            <span className="text-[#ff6b00] font-bold">PROTECTED</span>
                          </div>
                          <div className="flex justify-between text-zinc-400">
                            <span>Recoloring:</span>
                            <span className="text-white font-bold">ACTIVE</span>
                          </div>
                        </div>

                        <div className="pt-0.5">
                          <button 
                            type="button"
                            onClick={() => onNavigate('retouch')}
                            className="w-full py-0.5 xs:py-1 rounded-md sm:rounded-lg bg-[#ff6b00] text-black font-black text-[6px] xs:text-[7px] sm:text-[9px] tracking-wide cursor-pointer hover:bg-[#ff7a00] transition-colors"
                          >
                            Open Retouch Desk
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

              </div>

            </div>

          </div>

      </div>

      {/* ========================================================================= */}
      {/* BOTTOM HERO OVERLAP BENTO STRIP (CREATIVE ASYMMETRICAL SCULPTED GEOMETRY) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* BOTTOM HERO OVERLAP BENTO STRIP (COMPACT 2x2 ON MOBILE, SCULPTED GEOMETRY) */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 sm:-mt-14 pb-8 sm:pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-4 lg:gap-5">
          
          {/* Card 1: Photographic Asymmetrical Blade "How Does It Work?" */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => {
              sound.playPop();
              onOpenVideo();
            }}
            className={`lg:col-span-3 relative h-[135px] sm:h-[190px] lg:h-[230px] rounded-tl-[24px] sm:rounded-tl-[36px] rounded-br-[24px] sm:rounded-br-[36px] rounded-tr-[8px] rounded-bl-[8px] overflow-hidden shadow-2xl cursor-pointer group border transition-all ${
              phoneScreenIdx === 0 ? 'border-[#ff6b00] ring-2 ring-[#ff6b00]/40' : 'border-white/10 hover:border-[#ff6b00]/70'
            }`}
          >
            <img 
              src={teamCollabImg} 
              alt="Design consultation session"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12151a]/95 via-[#12151a]/50 to-transparent" />
            
            {/* Architectural Spec Tag */}
            <div className="absolute top-2 sm:top-3.5 left-2 sm:left-4 flex items-center gap-1 sm:gap-1.5 font-mono text-[7px] sm:text-[9px] font-bold text-[#ff6b00] bg-[#181c24]/90 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded border border-[#ff6b00]/30">
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#ff6b00]" />
              <span className="truncate">ATELIER SPEC</span>
            </div>

            <div className="absolute inset-0 p-2.5 sm:p-4 lg:p-5 flex flex-col justify-end text-left">
              <h3 className="text-xs sm:text-base lg:text-lg font-black text-white leading-tight group-hover:text-[#ff6b00] transition-colors">
                How It Works
              </h3>
              <p className="hidden sm:block text-[11px] text-zinc-300 font-medium leading-snug line-clamp-2 pt-1">
                Take a quick walkthrough of our studio workflow and proofing desk.
              </p>
              <div className="flex items-center gap-1 text-[9px] sm:text-xs text-[#ff6b00] font-bold pt-1 sm:pt-2 group-hover:translate-x-1 transition-transform">
                <span>Watch Video</span>
                <Play className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#ff6b00]" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Operational / Pre-Press Dominance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`lg:col-span-3 relative h-[135px] sm:h-[190px] lg:h-[230px] rounded-tl-[8px] rounded-br-[8px] rounded-tr-[24px] sm:rounded-tr-[36px] rounded-bl-[24px] sm:rounded-bl-[36px] overflow-hidden shadow-2xl transition-all group cursor-pointer border ${
              phoneScreenIdx === 1 ? 'border-[#ff6b00] ring-2 ring-[#ff6b00]/40' : 'border-white/10 hover:border-[#ff6b00]/70'
            }`}
            onClick={() => {
              sound.playClick();
              onNavigate('products');
            }}
          >
            <img 
              src={prepressCmykImg} 
              alt="High-resolution CMYK pre-press proofing"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent" />

            {/* Top Spec Header */}
            <div className="absolute top-2 sm:top-3.5 left-2 sm:left-4 flex items-center gap-1 sm:gap-1.5 font-mono text-[7px] sm:text-[9px] font-bold text-black bg-white/95 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded border border-neutral-300 shadow-sm">
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#ff6b00]" />
              <span className="truncate">PRE-PRESS</span>
            </div>

            <div className="absolute inset-0 p-2.5 sm:p-4 lg:p-5 flex flex-col justify-end text-left">
              <h4 className="text-xs sm:text-base lg:text-lg font-black text-black tracking-tight leading-tight group-hover:text-[#ff6b00] transition-colors">
                Pre-Press Mastery
              </h4>
              <p className="hidden sm:block text-[11px] text-neutral-800 font-medium leading-snug line-clamp-2 pt-1">
                Calibrated CMYK master files engineered for crisp bleeding-edge offset runs.
              </p>
              <div className="pt-1 sm:pt-2 flex items-center gap-1 text-[9px] sm:text-xs font-black text-[#ff6b00] group-hover:translate-x-1 transition-transform">
                <span>Explore Press</span>
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
          </motion.div>

          {/* Card 3: Brand & 3D Strategy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`lg:col-span-3 relative h-[135px] sm:h-[190px] lg:h-[230px] rounded-tl-[24px] sm:rounded-tl-[36px] rounded-br-[24px] sm:rounded-br-[36px] rounded-tr-[8px] rounded-bl-[8px] overflow-hidden shadow-2xl transition-all group cursor-pointer border ${
              phoneScreenIdx === 2 ? 'border-[#ff6b00] ring-2 ring-[#ff6b00]/40' : 'border-white/10 hover:border-[#ff6b00]/70'
            }`}
            onClick={() => {
              sound.playClick();
              onNavigate('order');
            }}
          >
            <img 
              src={brand3dGoldImg} 
              alt="Sculpted 3D metallic gold brand strategy emblem"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12151a]/95 via-[#12151a]/50 to-transparent" />

            {/* Top Spec Header */}
            <div className="absolute top-2 sm:top-3.5 left-2 sm:left-4 flex items-center gap-1 sm:gap-1.5 font-mono text-[7px] sm:text-[9px] font-bold text-[#ff6b00] bg-[#181c24]/90 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded border border-[#ff6b00]/30">
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#ff6b00]" />
              <span className="truncate">3D IDENTITY</span>
            </div>

            <div className="absolute inset-0 p-2.5 sm:p-4 lg:p-5 flex flex-col justify-end text-left">
              <h4 className="text-xs sm:text-base lg:text-lg font-black text-white tracking-tight leading-tight group-hover:text-[#ff6b00] transition-colors">
                3D Brand Strategy
              </h4>
              <p className="hidden sm:block text-[11px] text-zinc-300 font-medium leading-snug line-clamp-2 pt-1">
                Sculpted metallic typography and high-impact visual identities.
              </p>
              <div className="pt-1 sm:pt-2 flex items-center gap-1 text-[9px] sm:text-xs font-bold text-[#ff6b00] group-hover:translate-x-1 transition-transform">
                <span>Commission 3D</span>
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
          </motion.div>

          {/* Card 4: Web & Digital Consulting */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`lg:col-span-3 relative h-[135px] sm:h-[190px] lg:h-[230px] rounded-tl-[8px] rounded-br-[8px] rounded-tr-[24px] sm:rounded-tr-[36px] rounded-bl-[24px] sm:rounded-bl-[36px] overflow-hidden shadow-2xl transition-all group cursor-pointer border ${
              phoneScreenIdx === 3 ? 'border-[#ff6b00] ring-2 ring-[#ff6b00]/40' : 'border-white/10 hover:border-[#ff6b00]/70'
            }`}
            onClick={() => {
              sound.playClick();
              onNavigate('products');
            }}
          >
            <img 
              src={webShowcaseImg} 
              alt="Digital web solutions and responsive UI platform"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12151a]/95 via-[#12151a]/50 to-transparent" />

            {/* Top Spec Header */}
            <div className="absolute top-2 sm:top-3.5 left-2 sm:left-4 flex items-center gap-1 sm:gap-1.5 font-mono text-[7px] sm:text-[9px] font-bold text-[#ff6b00] bg-[#181c24]/90 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded border border-[#ff6b00]/30">
              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#ff6b00]" />
              <span className="truncate">WEB PLATFORM</span>
            </div>

            <div className="absolute inset-0 p-2.5 sm:p-4 lg:p-5 flex flex-col justify-end text-left">
              <h4 className="text-xs sm:text-base lg:text-lg font-black text-white tracking-tight leading-tight group-hover:text-[#ff6b00] transition-colors">
                Digital Web UI
              </h4>
              <p className="hidden sm:block text-[11px] text-zinc-300 font-medium leading-snug line-clamp-2 pt-1">
                Fast responsive websites and online client proofing desks.
              </p>
              <div className="pt-1 sm:pt-2 flex items-center gap-1 text-[9px] sm:text-xs font-bold text-[#ff6b00] group-hover:translate-x-1 transition-transform">
                <span>View Web UI</span>
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUATROHAUS-LEVEL INFINITE KINETIC MARQUEE RIBBON                          */}
      {/* ========================================================================= */}
      <AgencyMarquee speed={75} theme="white" />

    </div>
  );
};
