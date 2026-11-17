import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  MessageSquare, 
  ArrowRight, 
  Zap, 
  Power
} from 'lucide-react';
import { sound } from '../lib/soundFx';

// Photorealistic cutouts (Bulb and Wall Switch Socket)
import realisticBulbCutout from '../assets/images/realistic_orange_bulb_cutout.png';
import realisticSwitchImg from '../assets/images/realistic_wall_switch_transparent.png';

export interface StudioMotto {
  id: string;
  leadBadge: string;
  word1: string;
  word2: string;
  accentWord: string; // Studio Orange
  subtitlePart1: string;
  subtitleAccent: string; // Studio Orange
  description: string;
}

export const STUDIO_MOTTOS: StudioMotto[] = [
  {
    id: 'motto-1',
    leadBadge: 'CREATIVE ATELIER',
    word1: 'Ideas',
    word2: 'Build',
    accentWord: 'Businesses.',
    subtitlePart1: 'Smart Software & Design',
    subtitleAccent: 'Builds Growth.',
    description: 'We turn your business vision into powerful, high-converting pre-press artwork, 3D flyers, and modern digital solutions.'
  },
  {
    id: 'motto-2',
    leadBadge: 'PRE-PRESS DOMINANCE',
    word1: 'Design',
    word2: 'Commands',
    accentWord: 'Attention.',
    subtitlePart1: 'Creative Precision',
    subtitleAccent: 'Drives Impact.',
    description: 'Every pixel, curve, and CMYK color profile calibrated for maximum visual dominance in print and digital feeds.'
  },
  {
    id: 'motto-3',
    leadBadge: '12 YEARS EXPERIENCE',
    word1: 'Vision',
    word2: 'Shapes',
    accentWord: 'Reality.',
    subtitlePart1: 'Uncompromising Studio Standards',
    subtitleAccent: 'Deliver Results.',
    description: 'From sacred gospel church posters to enterprise corporate identities, engineered with passion and precision.'
  },
  {
    id: 'motto-4',
    leadBadge: 'EXPRESS TURNAROUND',
    word1: 'Creativity',
    word2: 'Ignites',
    accentWord: 'Success.',
    subtitlePart1: 'Beyond The Ordinary',
    subtitleAccent: '12–24h Delivery.',
    description: 'Fast express turnaround with live 3D proofing, custom mockups, and direct collaboration with lead designer Brighton.'
  }
];

interface CrumpledPaperBulbMechanismProps {
  onNavigate?: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  className?: string;
}

export const CrumpledPaperBulbMechanism: React.FC<CrumpledPaperBulbMechanismProps> = ({
  onNavigate,
  className = ''
}) => {
  const [activeMottoIdx, setActiveMottoIdx] = useState<number>(0);
  
  // Real Wall Switch State: Physically toggled ON and OFF
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(true);
  
  // Smoothly animated effective brightness (0 to 100) for real optical dimming
  const [effectiveBrightness, setEffectiveBrightness] = useState<number>(100);
  
  const [cablePulseKey, setCablePulseKey] = useState<number>(0);
  const autoCycleRef = useRef<boolean>(true);
  const targetBrightnessRef = useRef<number>(100);

  const currentMotto = STUDIO_MOTTOS[activeMottoIdx];

  // Smooth continuous dimming loop: interpolates effectiveBrightness towards targetBrightness
  useEffect(() => {
    let animFrame: number;
    const updateBrightness = () => {
      setEffectiveBrightness((current) => {
        const target = targetBrightnessRef.current;
        const diff = target - current;
        if (Math.abs(diff) < 0.8) {
          return target;
        }
        // Smooth exponential filament approach (~350ms settle)
        return current + diff * 0.16;
      });
      animFrame = requestAnimationFrame(updateBrightness);
    };

    animFrame = requestAnimationFrame(updateBrightness);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Auto-cycle mottos: Bulb visibly dims as motto transitions, then flares with bright light!
  useEffect(() => {
    const interval = setInterval(() => {
      if (!autoCycleRef.current) return;

      // 1. Visibly dim the bulb down momentarily as old motto fades
      targetBrightnessRef.current = 20;

      setTimeout(() => {
        // 2. Lock in next motto and flare bulb back to 100% full illumination
        setActiveMottoIdx((prev) => (prev + 1) % STUDIO_MOTTOS.length);
        setIsSwitchOn(true);
        targetBrightnessRef.current = 100;
        setCablePulseKey((k) => k + 1);

        try {
          sound.playSwitch(true);
        } catch (e) {}
      }, 350);

    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Physically flip the wall switch ON / OFF
  // When turned OFF: light smoothly dims down to 0% with warm filament decay
  // When turned ON: light smoothly ramps up to 100% full illumination
  const handleToggleSwitch = () => {
    const nextState = !isSwitchOn;
    setIsSwitchOn(nextState);
    targetBrightnessRef.current = nextState ? 100 : 0;

    try {
      sound.playSwitch(nextState);
    } catch (e) {}

    if (nextState) {
      setCablePulseKey((k) => k + 1);
    }
  };

  // Manual motto selection with authentic dim & flare transition
  const handleSelectMotto = (idx: number) => {
    if (idx === activeMottoIdx) return;
    
    // Smoothly dip light then restore to show motto switch illumination
    targetBrightnessRef.current = 20;

    setTimeout(() => {
      setActiveMottoIdx(idx);
      setIsSwitchOn(true);
      targetBrightnessRef.current = 100;
      setCablePulseKey((k) => k + 1);
      try {
        sound.playSwitch(true);
      } catch (e) {}
    }, 280);
  };

  // Normalized brightness factor between 0.0 and 1.0
  const bFactor = effectiveBrightness / 100;

  return (
    <div className={`relative w-full max-w-7xl mx-auto select-none ${className}`}>
      
      {/* ========================================================================= */}
      {/* STRICTLY SIDE-BY-SIDE LAYOUT:                                             */}
      {/* - LEFT: The Motto ("Ideas Build Businesses.", Businesses in Studio Orange)*/}
      {/* - RIGHT: The Lamp & Previous Physical Circuit (Plug + Rocker Switch)      */}
      {/* Sitting on a pure, solid color studio canvas with shadow effects on light */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN (COL 1-6): THE MOTTO (SIDE-BY-SIDE WITH THE BULB)           */}
        {/* ======================================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5 sm:space-y-6 text-left p-2 sm:p-4">
          
          {/* Top Brand Monogram / Lead Badge */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl bg-[#d4f15d]/15 border border-[#d4f15d]/40 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
              style={{
                boxShadow: `0 0 ${Math.round(20 * bFactor)}px rgba(212, 241, 93, ${0.4 * bFactor})`
              }}
            >
              <svg viewBox="0 0 32 32" className="w-6 h-6 text-[#d4f15d] fill-current">
                <path d="M 6,24 L 14,8 L 19,8 L 13,20 L 26,20 L 26,24 Z" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[#bef264] font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
              <span 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  bFactor > 0.1 
                    ? 'bg-[#d4f15d] animate-pulse' 
                    : 'bg-zinc-600'
                }`}
                style={{
                  boxShadow: bFactor > 0.1 ? `0 0 8px rgba(212, 241, 93, ${bFactor})` : 'none'
                }}
              />
              <span>{currentMotto.leadBadge}</span>
            </div>
          </div>

          {/* Main 3-Line Headline: Ideas Build Businesses. (Businesses in Studio Orange) */}
          <div className="space-y-1 select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={`headline-${activeMottoIdx}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="space-y-0.5 sm:space-y-1"
              >
                <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-[62px] font-black text-white tracking-tight leading-[0.96]">
                  {currentMotto.word1}
                </h2>
                <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-[62px] font-black text-white tracking-tight leading-[0.96]">
                  {currentMotto.word2}
                </h2>
                {/* The Accent Word: Studio Lime instead of orange */}
                <h2 
                  className="text-4xl sm:text-5xl md:text-5xl lg:text-[62px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4f15d] via-lime-200 to-[#bef264] tracking-tight leading-[0.96] transition-all duration-300"
                  style={{
                    filter: bFactor > 0.05 
                      ? `drop-shadow(0 4px ${Math.round(30 * bFactor)}px rgba(212, 241, 93, ${0.9 * bFactor}))`
                      : 'none',
                    opacity: 0.45 + 0.55 * bFactor
                  }}
                >
                  {currentMotto.accentWord}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sub-headline & Studio Description */}
          <div className="space-y-3 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`sub-${activeMottoIdx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, delay: 0.06 }}
                className="space-y-2"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
                  {currentMotto.subtitlePart1}{' '}
                  <span className="text-[#bef264]">{currentMotto.subtitleAccent}</span>
                </h3>

                <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                  {currentMotto.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Accent Underline Bar in Studio Lime (illuminates with light) */}
            <div 
              className="w-20 h-1.5 rounded-full bg-gradient-to-r from-[#d4f15d] to-[#bef264] transition-all duration-300"
              style={{
                boxShadow: `0 0 ${Math.round(18 * bFactor)}px rgba(212, 241, 93, ${0.95 * bFactor})`,
                opacity: 0.35 + 0.65 * bFactor
              }}
            />
          </div>

          {/* Interactive Motto Switcher Tabs & Controls */}
          <div className="pt-2 space-y-4">
            
            {/* Motto selection pills: Clicking triggers light dim & flare */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase mr-1">
                Motto:
              </span>
              {STUDIO_MOTTOS.map((m, idx) => {
                const isActive = idx === activeMottoIdx;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMotto(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-sm ${
                      isActive
                        ? 'bg-[#d4f15d] text-slate-950 font-black shadow-[0_0_14px_rgba(212,241,93,0.6)] scale-105'
                        : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    }`}
                    title={`Select motto: ${m.word1} ${m.word2} ${m.accentWord}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-slate-950' : 'bg-[#d4f15d]/50'}`} />
                    <span>{m.word1}</span>
                  </button>
                );
              })}
            </div>

            {/* Primary Call To Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {onNavigate && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onNavigate('order');
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#d4f15d] hover:bg-[#bef264] active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-black/30 flex items-center gap-2 cursor-pointer hover:scale-105"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Start Order</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onNavigate('contact');
                    }}
                    className="px-5 py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-[#bef264] border border-zinc-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 text-[#bef264]" />
                    <span>Contact Desk</span>
                  </button>
                </>
              )}

              {/* Direct info email link */}
              <a
                href="mailto:info@rtsoncreations.co.zw?subject=Studio%20Inquiry%20from%20Website"
                onClick={() => sound.playClick()}
                className="px-4 py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-[#d4f15d]/50 text-[#bef264] text-xs font-mono font-bold transition-all shadow-md"
                title="Direct studio contact"
              >
                info@rtsoncreations.co.zw
              </a>
            </div>

            {/* Social handles matching reference image */}
            <div className="pt-2 flex items-center gap-3 text-zinc-300 text-xs">
              <a 
                href="https://facebook.com/rtsoncreations" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-7 h-7 rounded-full bg-zinc-900/90 hover:bg-[#d4f15d] hover:text-slate-950 border border-zinc-800 flex items-center justify-center font-black transition-colors"
                title="Facebook @rtsoncreations"
              >
                f
              </a>
              <a 
                href="https://instagram.com/rtsoncreations" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-7 h-7 rounded-full bg-zinc-900/90 hover:bg-[#d4f15d] hover:text-slate-950 border border-zinc-800 flex items-center justify-center font-black text-[11px] transition-colors"
                title="Instagram @rtsoncreations"
              >
                ig
              </a>
              <span className="font-mono text-[11px] text-zinc-400 tracking-wider">
                @rtsoncreations
              </span>
            </div>

          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (COL 7-12): THE LAMP & PREVIOUS PHYSICAL CIRCUIT           */}
        {/* Photorealistic Bulb + Wall Plug Socket + 3D Rocker Switch Unit          */}
        {/* ======================================================================= */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative select-none w-full">
          
          {/* ===================================================================== */}
          {/* 1. SOLID BACKGROUND RADIAL LIGHT POOL & SHADOW PENUMBRA               */}
          {/* Real physical light cone illuminating the solid dark wall             */}
          {/* ===================================================================== */}
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] flex flex-col items-center justify-center">
            
            {/* Dynamic Radial Light Pool: Illuminates the solid wall directly behind the bulb */}
            <div 
              className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-300 ease-out z-0"
              style={{
                width: `${Math.round(280 + 200 * bFactor)}px`,
                height: `${Math.round(280 + 200 * bFactor)}px`,
                opacity: bFactor,
                background: `radial-gradient(circle, rgba(255, 246, 225, ${0.9 * bFactor}) 0%, rgba(249, 115, 22, ${0.75 * bFactor}) 32%, rgba(217, 119, 6, ${0.35 * bFactor}) 55%, rgba(10, 11, 16, 0) 75%)`,
                filter: `blur(${Math.round(40 + 20 * bFactor)}px)`
              }}
            />

            {/* Surrounding Ambient Shadow Vignette: Darkens outer perimeter to enhance contrast */}
            <div 
              className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-300 z-0"
              style={{
                width: '520px',
                height: '520px',
                opacity: 0.65 * bFactor,
                background: 'radial-gradient(circle, transparent 40%, rgba(5, 6, 9, 0.75) 85%)'
              }}
            />

            {/* =================================================================== */}
            {/* 2. 10 RADIANT IDEA RAYS (Studio Orange)                              */}
            {/* Radiate outwards matching reference image, scaling with dimmer      */}
            {/* =================================================================== */}
            <svg 
              className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10 transition-opacity duration-300"
              viewBox="0 0 400 480"
              style={{ opacity: bFactor }}
            >
              <defs>
                <linearGradient id="rayRealOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="30%" stopColor="#ecfccb" stopOpacity="0.95" />
                  <stop offset="70%" stopColor="#d4f15d" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#bef264" stopOpacity="0.8" />
                </linearGradient>

                <filter id="rayGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation={3 + 2 * bFactor} result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 10 Radiant Idea Rays matching reference image */}
              <g filter="url(#rayGlowFilter)">
                <line x1="200" y1="42" x2="200" y2="8" stroke="url(#rayRealOrangeGrad)" strokeWidth={3.5 + 1.5 * bFactor} strokeLinecap="round" />
                <line x1="248" y1="62" x2="288" y2="30" stroke="url(#rayRealOrangeGrad)" strokeWidth={3.5 + 1.5 * bFactor} strokeLinecap="round" />
                <line x1="285" y1="102" x2="332" y2="78" stroke="url(#rayRealOrangeGrad)" strokeWidth={3.5 + 1.5 * bFactor} strokeLinecap="round" />
                <line x1="300" y1="152" x2="350" y2="152" stroke="url(#rayRealOrangeGrad)" strokeWidth={3.5 + 1.5 * bFactor} strokeLinecap="round" />
                <line x1="285" y1="208" x2="332" y2="230" stroke="url(#rayRealOrangeGrad)" strokeWidth={3.5 + 1.5 * bFactor} strokeLinecap="round" />
                <line x1="152" y1="62" x2="112" y2="30" stroke="url(#rayRealOrangeGrad)" strokeWidth={3.5 + 1.5 * bFactor} strokeLinecap="round" />
                <line x1="115" y1="102" x2="68" y2="78" stroke="url(#rayRealOrangeGrad)" strokeWidth={3.5 + 1.5 * bFactor} strokeLinecap="round" />
                <line x1="100" y1="152" x2="50" y2="152" stroke="url(#rayRealOrangeGrad)" strokeWidth={3.5 + 1.5 * bFactor} strokeLinecap="round" />
                <line x1="115" y1="208" x2="68" y2="230" stroke="url(#rayRealOrangeGrad)" strokeWidth={3.5 + 1.5 * bFactor} strokeLinecap="round" />
              </g>
            </svg>

            {/* =================================================================== */}
            {/* 3. THE BULB: Photorealistic Crumpled Paper on Solid Surface         */}
            {/* Dynamic Cast Shadows & Optical Dimming Filters                     */}
            {/* =================================================================== */}
            <div 
              onClick={handleToggleSwitch}
              className="relative z-20 w-full max-w-[270px] sm:max-w-[310px] cursor-pointer group/bulb transition-transform duration-200 hover:scale-[1.02]"
              title={isSwitchOn ? "Click to switch bulb OFF" : "Click to switch bulb ON"}
            >
              {/* Cast Directional Shadow onto Solid Wall (Umbra + Penumbra) */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none transition-all duration-300"
                style={{
                  transform: 'translate(18px, 32px)',
                  filter: `blur(${Math.round(20 + 20 * bFactor)}px)`,
                  background: `rgba(0, 0, 0, ${0.7 + 0.25 * bFactor})`,
                  opacity: 0.85
                }}
              />

              {/* Tight Contact Shadow directly beneath metal base */}
              <div 
                className="absolute bottom-[8%] left-[30%] right-[30%] h-8 rounded-full pointer-events-none transition-all duration-300"
                style={{
                  filter: 'blur(8px)',
                  background: 'rgba(0, 0, 0, 0.95)',
                  transform: 'translateY(12px)'
                }}
              />

              {/* The Photorealistic Bulb Image with dynamic optical dimming */}
              <img 
                src={realisticBulbCutout}
                alt="Photorealistic Crumpled Paper Lightbulb in Studio Orange"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain transition-all duration-300 relative z-10"
                style={{
                  // Authentic physical dimming:
                  // 100%: brilliant white-hot orange, deep crease contrast, intense glow
                  // 0%: matte dark charcoal kraft paper, zero glow, deep shadows
                  filter: `
                    brightness(${0.25 + 0.95 * bFactor}) 
                    contrast(${0.8 + 0.35 * bFactor}) 
                    saturate(${0.6 + 0.7 * bFactor}) 
                    grayscale(${0.7 * (1 - bFactor)})
                    drop-shadow(0 0 ${Math.round(45 * bFactor)}px rgba(249, 115, 22, ${0.95 * bFactor}))
                    drop-shadow(0 0 ${Math.round(15 * bFactor)}px rgba(255, 237, 213, ${0.85 * bFactor}))
                  `
                }}
              />

              {/* Internal Incandescent Luminescence overlay (light glowing through paper folds) */}
              <div 
                className="absolute top-[16%] left-[22%] right-[22%] h-[34%] rounded-full pointer-events-none mix-blend-screen transition-opacity duration-300 z-20"
                style={{
                  opacity: bFactor,
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(254, 215, 170, 0.8) 35%, rgba(249, 115, 22, 0.4) 65%, transparent 85%)',
                  filter: 'blur(8px)'
                }}
              />

            </div>

          </div>

          {/* ===================================================================== */}
          {/* 4. CONNECTED POWER CORD (Curving to Wall Switch Unit)                 */}
          {/* ===================================================================== */}
          <div className="relative w-full max-w-[340px] h-10 flex items-center justify-center z-10">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 40">
              {/* Smooth curved black cable path */}
              <path 
                d="M 150,0 C 150,20 100,20 100,40" 
                fill="none" 
                stroke="#121318" 
                strokeWidth="8" 
                strokeLinecap="round" 
              />
              <path 
                d="M 150,0 C 150,20 100,20 100,40" 
                fill="none" 
                stroke="#27272a" 
                strokeWidth="2" 
                strokeDasharray="4 4"
                strokeLinecap="round" 
                opacity="0.6" 
              />

              {/* Electric energy spark running along the cable when powered */}
              {bFactor > 0.05 && (
                <motion.circle
                  key={`pulse-${cablePulseKey}`}
                  initial={{ offsetDistance: '100%' }}
                  animate={{ offsetDistance: '0%' }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  r="4"
                  fill="#ffffff"
                  style={{
                    offsetPath: "path('M 100,40 C 100,20 150,20 150,0')",
                    filter: 'drop-shadow(0 0 8px #d4f15d)'
                  }}
                />
              )}
            </svg>
          </div>

          {/* ===================================================================== */}
          {/* 5. PREVIOUS CIRCUIT: WALL PLUG & ROCKER SWITCH UNIT                   */}
          {/* Restored cleanly: Wall Socket with Plug (Left) + Rocker Switch (Right)*/}
          {/* With smooth optical dimming on switch toggle and shadow depth          */}
          {/* ===================================================================== */}
          <div 
            className="relative z-20 w-full max-w-[340px] sm:max-w-[360px] p-3.5 rounded-2xl bg-black/85 border border-zinc-700/80 backdrop-blur-xl transition-all duration-300"
            style={{
              boxShadow: `0 18px 50px rgba(0, 0, 0, 0.95), 0 0 ${Math.round(20 * bFactor)}px rgba(249, 115, 22, ${0.12 * bFactor})`
            }}
          >
            
            {/* Header: Status Readout */}
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-300 uppercase pb-2 px-1 border-b border-zinc-800">
              <span className="flex items-center gap-1.5 font-bold">
                <Zap className={`w-3.5 h-3.5 ${bFactor > 0.1 ? 'text-[#bef264] animate-pulse' : 'text-zinc-600'}`} />
                <span>WALL PLUG &amp; SWITCH</span>
              </span>

              <span className={`px-2 py-0.5 rounded text-[9px] font-black transition-colors ${
                isSwitchOn && bFactor > 0.05 
                  ? 'bg-[#d4f15d]/20 text-[#bef264] border border-[#d4f15d]/40 shadow-[0_0_8px_rgba(212,241,93,0.4)]' 
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
              }`}>
                {isSwitchOn ? 'POWER: ON' : 'POWER: OFF'}
              </span>
            </div>

            {/* Main Faceplate: Wall Plug (Left) + Rocker Switch (Right) */}
            <div className="grid grid-cols-2 gap-3 pt-3 items-center">
              
              {/* 1. WALL PLUG OUTLET WITH CONNECTED POWER CORD */}
              <div className="relative p-2 rounded-xl bg-zinc-950/90 border border-zinc-800 flex flex-col items-center justify-center space-y-1.5 shadow-md">
                
                {/* Wall Plug Cutout Visual */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-700/80 shadow-inner flex items-center justify-center bg-black">
                  <img 
                    src={realisticSwitchImg}
                    alt="Wall socket with plugged cord"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-left"
                  />
                </div>

                <div className="text-[10px] font-mono text-zinc-300 text-center font-bold">
                  <span>Plugged in 240V</span>
                </div>
              </div>

              {/* 2. THE WALL ROCKER SWITCH BEING SWITCHED ON AND OFF */}
              <div 
                onClick={handleToggleSwitch}
                className="relative p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:border-[#d4f15d]/60 flex flex-col items-center justify-center space-y-2 cursor-pointer group/switch transition-all shadow-md active:scale-95"
                role="switch"
                aria-checked={isSwitchOn}
                tabIndex={0}
                title="Click to toggle switch ON and OFF"
              >
                
                {/* Rocker Switch 3D Body */}
                <div className="relative w-16 h-20 rounded-xl bg-black border-2 border-zinc-800 shadow-[inset_0_3px_10px_rgba(0,0,0,0.95)] flex items-center justify-center p-1.5">
                  
                  {/* The Tilting Rocker Paddle */}
                  <div 
                    className={`w-full h-full rounded-lg transition-all duration-150 flex flex-col items-center justify-between p-1.5 cursor-pointer shadow-md ${
                      isSwitchOn
                        ? 'bg-zinc-800 border-t-2 border-zinc-500 shadow-[0_5px_10px_rgba(0,0,0,0.9)] -translate-y-1'
                        : 'bg-zinc-900 border-b-2 border-zinc-700 shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] translate-y-1'
                    }`}
                  >
                    {/* ON Label at Top */}
                    <span className={`text-[8px] font-mono font-black tracking-widest ${
                      isSwitchOn ? 'text-zinc-200' : 'text-zinc-600'
                    }`}>
                      ON
                    </span>

                    {/* Glowing Lime Pilot Light Slot on the Switch Paddle */}
                    <div className={`w-6 h-1.5 rounded-full transition-all duration-200 ${
                      isSwitchOn 
                        ? 'bg-[#d4f15d] shadow-[0_0_10px_#d4f15d,0_0_18px_#bef264]' 
                        : 'bg-zinc-800 opacity-30'
                    }`} />

                    {/* OFF Label at Bottom */}
                    <span className={`text-[8px] font-mono font-black tracking-widest ${
                      !isSwitchOn ? 'text-zinc-300' : 'text-zinc-600'
                    }`}>
                      OFF
                    </span>
                  </div>

                </div>

                {/* Switch Action Button Prompt */}
                <div className="flex items-center gap-1.5">
                  <Power className={`w-3.5 h-3.5 ${isSwitchOn ? 'text-[#bef264]' : 'text-zinc-500'}`} />
                  <span className={`text-xs font-mono font-black tracking-wider uppercase ${
                    isSwitchOn ? 'text-[#bef264]' : 'text-zinc-400'
                  }`}>
                    {isSwitchOn ? 'SWITCH: ON' : 'SWITCH: OFF'}
                  </span>
                </div>

              </div>

            </div>

            {/* Status Hint */}
            <div className="pt-2 text-center">
              <span className="text-[10px] font-mono text-zinc-400">
                Click switch to toggle lamp power on / off
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
