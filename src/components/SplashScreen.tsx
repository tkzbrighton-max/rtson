import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../lib/soundFx';
import { RtsonLogo } from './RtsonLogo';
import { RollingDice } from './RollingDice';

interface SplashScreenProps {
  onFinish: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinish, 
  minDurationMs = 3000 // Exactly 3.0s duration as requested
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const handleFinish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sound.playSuccess();
    } catch (e) {}
    onFinishRef.current();
  };

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / minDurationMs) * 100));
      setProgress(pct);

      if (elapsed >= minDurationMs) {
        clearInterval(interval);
        setTimeout(handleFinish, 80);
      }
    }, 20);

    // Guaranteed safety timeout: splash can NEVER hang
    const safetyTimeout = setTimeout(() => {
      if (!finishedRef.current) {
        clearInterval(interval);
        handleFinish();
      }
    }, minDurationMs + 200);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, [minDurationMs]);

  const toggleSound = () => {
    const active = sound.toggleMute();
    setIsMuted(!active);
  };

  const handleEnterStudio = () => {
    handleFinish();
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] overflow-hidden select-none bg-black text-white flex flex-col justify-between font-sans transition-all duration-500"
      role="dialog"
      aria-label="Welcome to R'tson Creations"
    >
      {/* Ambient Electric Lime Studio Glow in Background */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[650px] h-[50vh] rounded-full blur-[140px] pointer-events-none opacity-40 transition-colors duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(212, 241, 93, 0.25) 0%, transparent 70%)'
        }}
      />

      {/* Top Header: Audio & Skip Controls in Black, Lime & White */}
      <header className="relative z-30 w-full max-w-5xl mx-auto px-4 sm:px-8 pt-6 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={toggleSound}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center backdrop-blur-md ${
            isMuted 
              ? 'bg-neutral-900 text-slate-400 border-neutral-800' 
              : 'bg-black text-[#d4f15d] border-[#d4f15d]/50 shadow-[0_0_12px_rgba(212,241,93,0.25)]'
          }`}
          title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#d4f15d]" />}
        </button>

        <button
          type="button"
          id="splash-skip-btn"
          onClick={handleEnterStudio}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-[#d4f15d] hover:text-slate-950 border border-[#d4f15d]/40 hover:border-[#d4f15d] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all shadow-sm group font-mono"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </header>

      {/* Center Stage: Authentic Brand Logo & Exactly Three Words */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-xl mx-auto w-full space-y-6">
        
        {/* Dynamic Studio Brand Logo in Lime, White and Black */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center"
        >
          <RtsonLogo size="xl" textColor="light" showSubtitle={false} />
        </motion.div>

        {/* Exactly Three Words — Clean & Impactful */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-xl"
        >
          Crafting Your <span className="text-[#d4f15d]">Vision</span>
        </motion.h1>

      </main>

      {/* Bottom Area: Soft Loading Bar with Rolling Dice in Motion */}
      <footer className="relative z-30 w-full max-w-md mx-auto px-6 pb-12 space-y-4">
        
        <div className="relative pt-6">
          {/* Rolling Dice In Motion across top of loading bar */}
          <RollingDice 
            progress={progress}
            pipColor="#d4f15d"
            size={32}
            showTimerBadge={true}
            durationSec={3}
          />

          {/* Clean linear loading bar in Lime, Black & White */}
          <div className="w-full h-1.5 rounded-full bg-neutral-900 border border-[#d4f15d]/30 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full rounded-full transition-all duration-75"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, transparent, #a3e635 40%, #d4f15d 80%, #ffffff 100%)',
                boxShadow: '0 0 16px rgba(212, 241, 93, 0.6)'
              }}
            />
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between text-[11px] font-mono text-white px-1">
          <span className="font-medium text-slate-300">Studio Initializing</span>
          <span className="text-[#d4f15d] font-bold">{progress}%</span>
        </div>

      </footer>

    </div>
  );
};
