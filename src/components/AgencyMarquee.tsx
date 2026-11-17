import React from 'react';
import { motion } from 'motion/react';

interface AgencyMarqueeProps {
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
  theme?: 'dark' | 'lime' | 'orange' | 'white';
}

const MARQUEE_ITEMS = [
  '300 DPI PRE-PRESS MASTERY',
  'SCULPTED 3D FLYERS',
  'BESPOKE BRAND IDENTITIES',
  'FULL-STACK WEB ARCHITECTURE',
  'FREQUENCY SEPARATION RETOUCHING',
  '24H EXPRESS TURNAROUND',
  'HARARE MASTER ATELIER',
  'ZERO TEMPLATE DISPOSABILITY',
  'CMYK OFFSET CALIBRATION',
  'VOLUMETRIC STUDIO LIGHTING',
  'VECTOR IDENTITY SYSTEMS',
  'LIVE CLIENT PROOFING DESK'
];

export const AgencyMarquee: React.FC<AgencyMarqueeProps> = ({
  className = '',
  speed = 70,
  direction = 'left',
  theme = 'dark'
}) => {
  const isOrange = theme === 'lime' || theme === 'orange';
  const isWhite = theme === 'white';

  return (
    <div 
      className={`relative w-full overflow-hidden select-none py-3 border-y transition-colors duration-300 ${
        isOrange 
          ? 'bg-[#ff6b00] text-black border-black/20' 
          : isWhite
          ? 'bg-white text-black border-neutral-200'
          : 'bg-[#12151a] text-[#ff6b00] border-white/10'
      } ${className}`}
      role="region"
      aria-label="Agency Core Disciplines Marquee"
    >
      {/* Soft Gradient Mask for Edge Fade */}
      <div className={`absolute top-0 bottom-0 left-0 w-12 sm:w-24 z-10 pointer-events-none bg-gradient-to-r ${
        isOrange ? 'from-[#ff6b00] to-transparent' : isWhite ? 'from-white to-transparent' : 'from-[#12151a] to-transparent'
      }`} />
      <div className={`absolute top-0 bottom-0 right-0 w-12 sm:w-24 z-10 pointer-events-none bg-gradient-to-l ${
        isOrange ? 'from-[#ff6b00] to-transparent' : isWhite ? 'from-white to-transparent' : 'from-[#12151a] to-transparent'
      }`} />

      {/* Ticker Track */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{
            x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="flex items-center gap-6 sm:gap-8 shrink-0 hover:[animation-play-state:paused]"
        >
          {/* Double array for seamless infinite looping */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
            <div key={index} className="flex items-center gap-6 sm:gap-8 shrink-0">
              <span className={`text-[11px] sm:text-xs font-black tracking-widest uppercase font-mono ${
                isOrange ? 'text-black' : isWhite ? 'text-black' : 'text-white'
              }`}>
                {item}
              </span>
              <span 
                className={`text-xs select-none ${isOrange ? 'text-black/60' : isWhite ? 'text-[#ff6b00]' : 'text-[#ff6b00]'}`}
                aria-hidden="true"
              >
                ✦
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
