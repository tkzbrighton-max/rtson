import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HomeSlide } from '../types';

interface BotBackgroundViewerProps {
  currentSlide: HomeSlide;
}

export const BotBackgroundViewer: React.FC<BotBackgroundViewerProps> = ({ 
  currentSlide
}) => {
  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 gpu-layer"
      aria-hidden="true"
    >
      {/* 1. Dynamic Ambient Radiant Halo that simultaneously shifts color with the slide */}
      <div 
        className="absolute top-1/4 right-1/4 sm:right-1/3 w-[65vw] sm:w-[50vw] h-[65vh] sm:h-[55vh] rounded-full blur-[130px] sm:blur-[180px] pointer-events-none transition-all duration-1000 opacity-40"
        style={{ 
          backgroundColor: currentSlide.haloColor 
        }}
      />
      <div className="absolute bottom-10 left-1/4 w-[45vw] h-[45vh] rounded-full blur-[160px] pointer-events-none bg-blue-600/[0.04]" />

      {/* 2. Background Image fitted in length and width, crossfading simultaneously */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center sm:object-right lg:object-center select-none"
            style={{
              filter: 'brightness(0.92) contrast(1.12) saturate(1.1)'
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* 3. Contrast Shield Overlays: Keep Text 100% Legible while Image Remains Fully Visible in Length and Width */}
      {/* Left-to-right gradient protecting text on the left and letting artwork shine on center/right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030814]/95 via-[#030814]/80 sm:via-[#030814]/65 to-[#030814]/35" />

      {/* Top and bottom subtle falloffs connecting with navbar and lower boundary */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030814]/80 via-transparent to-[#030814]/90" />

      {/* Subtle perimeter vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030814]/20 to-[#030814]/75" />
    </div>
  );
};
