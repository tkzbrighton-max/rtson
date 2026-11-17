import React from 'react';
import { motion } from 'motion/react';

interface RollingDiceProps {
  progress: number; // 0 to 100
  pipColor?: string;
  size?: number;
  showTimerBadge?: boolean;
  durationSec?: number;
}

export const RollingDice: React.FC<RollingDiceProps> = ({
  progress,
  pipColor = '#d4f15d', // Studio Electric Lime
  size = 32,
  showTimerBadge = true,
  durationSec = 3
}) => {
  const half = size / 2;
  // Calculate remaining seconds out of 3.0s splash screen duration
  const remainingSec = Math.max(0, (durationSec - (progress * (durationSec / 100)))).toFixed(1);

  // Clamp horizontal travel so the dice stays exactly on the loading bar track
  const clampedX = Math.min(96, Math.max(4, progress));

  // Forward roll rotation: 5 full 360-degree rolls across the 5-second track
  const rollRotZ = (progress / 100) * 1800; // 5 full 360° revolutions
  const rollRotX = (progress / 100) * 720;  // 2 full 360° 3D tumbling flips
  const rollRotY = 25 + Math.sin((progress / 100) * Math.PI * 6) * 15; // 3D perspective angle

  // Smooth tumbling without bounce displacement
  const bounceY = 0;

  // Pip helper: Studio Electric Lime glowing pip
  const Pip = ({ className = "" }: { className?: string }) => (
    <span 
      className={`rounded-full shrink-0 shadow-[0_0_5px_#d4f15d] ${className}`}
      style={{ 
        width: size * 0.22, 
        height: size * 0.22, 
        backgroundColor: pipColor 
      }} 
    />
  );

  const topOffset = showTimerBadge ? '-top-12' : '-top-9';

  // Common face styling: Deep Obsidian Black with crisp Studio Electric Lime border
  const faceStyle = "absolute inset-0 rounded-md border border-[#d4f15d] bg-neutral-950 shadow-[0_0_8px_rgba(212,241,93,0.35)]";

  return (
    <div 
      className={`absolute ${topOffset} pointer-events-none transition-all duration-75 ease-out z-30`}
      style={{ left: `calc(${clampedX}% - ${size / 2}px)` }}
    >
      <div className="flex flex-col items-center relative">
        
        {/* 5s Roll Countdown Tag in Studio Electric Lime, Black & White */}
        {showTimerBadge && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-1 px-2.5 py-0.5 rounded-md bg-black border border-[#d4f15d] text-[10px] font-mono font-black text-[#d4f15d] shadow-[0_0_10px_rgba(212,241,93,0.3)] flex items-center justify-center backdrop-blur-md whitespace-nowrap"
          >
            <span className="text-white font-bold tracking-tight">{remainingSec}s</span>
          </motion.div>
        )}

        {/* 3D Perspective Rolling Dice Container */}
        <div 
          className="relative"
          style={{
            width: size,
            height: size,
            perspective: '600px'
          }}
        >
          {/* Tumbling 3D Cube */}
          <div
            className="w-full h-full relative"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateY(${bounceY}px) rotateZ(${rollRotZ}deg) rotateX(${rollRotX}deg) rotateY(${rollRotY}deg)`,
              transition: 'transform 0.05s linear'
            }}
          >
            {/* FACE 1: Front (1 Pip) */}
            <div
              className={`${faceStyle} flex items-center justify-center`}
              style={{
                transform: `translateZ(${half}px)`,
                backfaceVisibility: 'hidden'
              }}
            >
              <Pip className="scale-125" />
            </div>

            {/* FACE 6: Back (6 Pips) */}
            <div
              className={`${faceStyle} p-1 flex flex-col justify-between`}
              style={{
                transform: `rotateY(180deg) translateZ(${half}px)`,
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="flex justify-between"><Pip /><Pip /></div>
              <div className="flex justify-between"><Pip /><Pip /></div>
              <div className="flex justify-between"><Pip /><Pip /></div>
            </div>

            {/* FACE 3: Right (3 Pips) */}
            <div
              className={`${faceStyle} p-1 flex flex-col justify-between`}
              style={{
                transform: `rotateY(90deg) translateZ(${half}px)`,
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="flex justify-start"><Pip /></div>
              <div className="flex justify-center"><Pip /></div>
              <div className="flex justify-end"><Pip /></div>
            </div>

            {/* FACE 4: Left (4 Pips) */}
            <div
              className={`${faceStyle} p-1 flex flex-col justify-between`}
              style={{
                transform: `rotateY(-90deg) translateZ(${half}px)`,
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="flex justify-between"><Pip /><Pip /></div>
              <div className="flex justify-between"><Pip /><Pip /></div>
            </div>

            {/* FACE 2: Top (2 Pips) */}
            <div
              className={`${faceStyle} p-1 flex flex-col justify-between`}
              style={{
                transform: `rotateX(90deg) translateZ(${half}px)`,
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="flex justify-start"><Pip /></div>
              <div className="flex justify-end"><Pip /></div>
            </div>

            {/* FACE 5: Bottom (5 Pips) */}
            <div
              className={`${faceStyle} p-1 flex flex-col justify-between`}
              style={{
                transform: `rotateX(-90deg) translateZ(${half}px)`,
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="flex justify-between"><Pip /><Pip /></div>
              <div className="flex justify-center"><Pip /></div>
              <div className="flex justify-between"><Pip /><Pip /></div>
            </div>
          </div>
        </div>

        {/* Dynamic Rolling Ground Shadow on Top of Loading Bar */}
        <div
          className="h-1 bg-black/80 rounded-full blur-[1.5px] mt-1 transition-all duration-75"
          style={{
            width: size * 0.8,
            transform: `scaleX(${1 + Math.abs(bounceY) * 0.05})`,
            opacity: 0.7 - Math.abs(bounceY) * 0.05
          }}
        />
      </div>
    </div>
  );
};
