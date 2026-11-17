import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { sound } from '../lib/soundFx';

export interface PageTransitionLoaderProps {
  targetPage: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order' | string;
  onComplete: () => void;
  durationMs?: number;
}

// Single, clean, creative phrase for each page — zero word clutter
const DESTINATION_PHRASES: Record<string, { phrase: string; accentColor: string }> = {
  home: {
    phrase: "Beyond the Ordinary",
    accentColor: "#d4f15d"
  },
  about: {
    phrase: "12 Years of Uncompromising Craft",
    accentColor: "#bef264"
  },
  products: {
    phrase: "Precision in Every Pixel",
    accentColor: "#a3e635"
  },
  retouch: {
    phrase: "Flawless Studio Clarity",
    accentColor: "#86efac"
  },
  contact: {
    phrase: "Let's Create Together",
    accentColor: "#d4f15d"
  },
  order: {
    phrase: "Bringing Your Vision to Life",
    accentColor: "#d4f15d"
  }
};

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  targetPage,
  onComplete,
  durationMs = 500 // Snappy, responsive 500ms duration
}) => {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const destination = DESTINATION_PHRASES[targetPage] || {
    phrase: "Beyond the Ordinary",
    accentColor: "#d4f15d"
  };

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFinishing(true);
    try {
      sound.playPop();
    } catch (e) {
      // Audio safety
    }
    setTimeout(() => {
      onCompleteRef.current();
    }, 120);
  };

  useEffect(() => {
    try {
      sound.playClick();
    } catch (e) {
      // Audio safety
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(pct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        handleFinish();
      }
    }, 16);

    // Guaranteed safety timeout: NEVER freeze or get stuck under any condition
    const safetyTimeout = setTimeout(() => {
      if (!completedRef.current) {
        clearInterval(interval);
        handleFinish();
      }
    }, durationMs + 180);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [durationMs]);

  return (
    <div 
      className="fixed inset-0 z-[9999] select-none overflow-hidden cursor-pointer bg-[#050608] flex items-center justify-center transition-opacity duration-150"
      onClick={handleFinish}
      role="status"
      aria-label={`Loading: ${destination.phrase}`}
    >
      {/* Background Radial Light Flare */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isFinishing ? 0 : [0.35, 0.6, 0.4],
          scale: isFinishing ? 1.4 : [0.95, 1.05, 1]
        }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-[110px]"
        style={{
          background: `radial-gradient(circle, ${destination.accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Iris Aperture Wipe when finishing */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isFinishing ? 35 : 0, 
          opacity: isFinishing ? 1 : 0 
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="absolute w-20 h-20 rounded-full bg-black pointer-events-none z-40 border-4 border-[#d4f15d]/50"
      />

      {/* Center Stage: Stunning Creative Monogram Core & Simple Phrase */}
      <div className="relative z-20 flex flex-col items-center justify-center px-6 max-w-lg mx-auto text-center space-y-6">
        
        {/* Creative Kinetic Light Core — Concentric Dual Precision Rings & Orbiting Light Photon */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          
          {/* Subtle Outer Precision Ring */}
          <div className="absolute inset-0 rounded-full border border-white/10" />

          {/* Clockwise Laser Arc */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid transparent`,
              borderTopColor: destination.accentColor,
              borderRightColor: `${destination.accentColor}60`
            }}
          />

          {/* Counter-Spinning Inner Precision Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2.5 rounded-full border border-dashed border-white/20"
          />

          {/* Center Glowing Monogram Core with Studio Lime Prism Glow */}
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-12 h-12 rounded-xl bg-black border border-[#d4f15d]/40 shadow-[0_0_30px_rgba(212,241,93,0.45)] flex items-center justify-center overflow-hidden"
          >
            {/* Shimmer sweep inside box */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
            <span className="font-serif italic font-black text-xl text-transparent bg-clip-text bg-gradient-to-br from-white via-lime-200 to-[#d4f15d]">
              R'
            </span>
          </motion.div>

          {/* Orbiting Radiant Photon Spark */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-3px] pointer-events-none"
          >
            <div 
              className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff,0_0_18px_#d4f15d]"
              style={{ transform: 'translate(50%, 0)' }}
            />
          </motion.div>
        </div>

        {/* The Simple Single Phrase (Clean, Bold, Zero Clutter) */}
        <div className="space-y-1">
          <motion.h2 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md"
          >
            {destination.phrase}
          </motion.h2>
        </div>

        {/* Minimalist Glowing Progress Ribbon */}
        <div className="w-40 sm:w-52 space-y-1.5">
          <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full transition-all duration-75 relative"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #a3e635 0%, ${destination.accentColor} 80%, #ffffff 100%)`,
                boxShadow: `0 0 12px ${destination.accentColor}`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-0.5">
            <span className="tracking-widest">STUDIO</span>
            <span className="font-bold text-[#d4f15d]">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
