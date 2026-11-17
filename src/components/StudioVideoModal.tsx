import React from 'react';
import { X, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../lib/soundFx';
import brightonPhoto from '../assets/images/brighton_founder_laptop_1790843148910.jpg';

interface StudioVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
}

export const StudioVideoModal: React.FC<StudioVideoModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-[#0c1a20] border border-zinc-700/80 shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#091418]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4f15d] animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
              R'tson Creations · Studio Showreel &amp; Process
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Close video reel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center group">
          <img 
            src={brightonPhoto} 
            alt="Brighton Lead Designer at Rtson Creations Studio"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a20] via-transparent to-black/40" />

          {/* Central Play Indicator */}
          <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#d4f15d] text-slate-950 flex items-center justify-center shadow-[0_0_40px_rgba(212,241,93,0.5)] transform group-hover:scale-110 transition-transform cursor-pointer">
              <Play className="w-8 h-8 fill-slate-950 translate-x-0.5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Crafting High-Converting 3D Pre-Press Artwork
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg font-medium">
                Watch how lead designer Brighton engineers CMYK-calibrated church posters, corporate brand identities, and custom web applications.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4f15d]" />
                300 DPI Pre-Press
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4f15d]" />
                Volumetric Lighting
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d4f15d]" />
                12–24h Turnaround
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#091418] border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            Ready to commission your design? Direct studio collaboration with Brighton.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
                if (onNavigate) onNavigate('order');
              }}
              className="px-5 py-2.5 rounded-full bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              Start Your Project
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all cursor-pointer"
            >
              Close Reel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
