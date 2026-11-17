import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudioSlideBackground } from '../data/backgroundData';

interface StudioBackgroundSlideshowProps {
  currentSlide: StudioSlideBackground;
  overlayOpacity?: 'normal' | 'dark' | 'glass';
}

export const StudioBackgroundSlideshow: React.FC<StudioBackgroundSlideshowProps> = ({
  currentSlide,
  overlayOpacity = 'glass'
}) => {
  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 gpu-layer"
      aria-hidden="true"
    >
      {/* 1. Ambient radiant glow matching active slide palette */}
      <div 
        className="absolute top-1/4 right-1/4 sm:right-1/3 w-[60vw] sm:w-[45vw] h-[60vh] sm:h-[45vh] rounded-full blur-[140px] sm:blur-[190px] pointer-events-none transition-all duration-1000 opacity-40"
        style={{ 
          backgroundColor: currentSlide.haloColor 
        }}
      />
      <div className="absolute bottom-10 left-1/4 w-[40vw] h-[40vh] rounded-full blur-[160px] pointer-events-none bg-blue-600/[0.04]" />

      {/* 2. Crossfading background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center select-none"
            style={{
              filter: 'brightness(0.9) contrast(1.1) saturate(1.08)'
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* 3. Contrast Shield Overlays: Keeps transparent glass widgets 100% legible while the background is clearly visible */}
      {overlayOpacity === 'glass' && (
        <>
          {/* Subtle directional gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/90 via-[#030712]/75 to-[#030712]/60" />
          {/* Vertical falloff to dark navy */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/80 via-transparent to-[#030712]/92" />
          {/* Perimeter vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#030712_95%)] opacity-80" />
        </>
      )}

      {overlayOpacity === 'dark' && (
        <div className="absolute inset-0 bg-black/80" />
      )}
    </div>
  );
};
