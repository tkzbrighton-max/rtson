import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  ArrowRight, 
  Lock
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { 
  FigmaIcon, 
  HTML5Icon, 
  ReactIcon, 
  PHPIcon, 
  JavaScriptIcon, 
  IllustratorIcon, 
  PhotoshopIcon, 
  GoogleGeminiIcon 
} from './AppBrandIcons';
import { CrumpledPaperBulbMechanism } from './CrumpledPaperBulbMechanism';

interface RoboticHumanHandHeroProps {
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onOpenAdmin?: () => void;
  isAdminVisible?: boolean;
}

export const RoboticHumanHandHero: React.FC<RoboticHumanHandHeroProps> = ({
  onNavigate,
  onOpenAdmin,
  isAdminVisible = false
}) => {
  const [activeTechHover, setActiveTechHover] = useState<string | null>(null);

  const techIcons = [
    { id: 'figma', name: 'Figma', Icon: FigmaIcon, color: '#F24E1E' },
    { id: 'html5', name: 'HTML5', Icon: HTML5Icon, color: '#E44D26' },
    { id: 'react', name: 'React', Icon: ReactIcon, color: '#61DAFB' },
    { id: 'php', name: 'PHP', Icon: PHPIcon, color: '#777BB4' },
    { id: 'js', name: 'JavaScript', Icon: JavaScriptIcon, color: '#F7DF1E' },
    { id: 'ai', name: 'Illustrator', Icon: IllustratorIcon, color: '#FF9A00' },
    { id: 'ps', name: 'Photoshop', Icon: PhotoshopIcon, color: '#31A8FF' },
    { id: 'gemini', name: 'Gemini AI', Icon: GoogleGeminiIcon, color: '#9B51E0' }
  ];

  return (
    <div className="w-full relative flex flex-col items-center bg-[#090a0f] text-white">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO CANVAS: PRISTINE SOLID COLOR BACKGROUND                 */}
      {/* No background images, no noisy overlays.                                  */}
      {/* Pure solid color background where the lamp's light and shadows shine.     */}
      {/* - LEFT: The Motto ("Ideas Build Businesses.", Businesses in Studio Orange)*/}
      {/* - RIGHT: The Lamp with Real Dimming, Directional Cast Shadows & Rays      */}
      {/* ========================================================================= */}
      <section 
        id="creation-hero-canvas"
        className="w-full relative bg-[#090a0f] select-none pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 min-h-[680px] lg:min-h-[760px] flex flex-col justify-between"
      >
        {/* Top Control Bar: Studio Status */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 relative z-30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/90 border border-zinc-800 text-[11px] font-mono text-zinc-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#d4f15d] animate-pulse" />
            <span className="font-bold text-[#bef264]">R'TSON CREATIONS</span>
            <span className="text-zinc-600">|</span>
            <span>HARARE ATELIER</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/90 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span>STUDIO LIGHT ENGINE</span>
            <span className="text-[#bef264] font-bold">240V ACTIVE</span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* CENTER STAGE: STRICTLY SIDE-BY-SIDE (MOTTO LEFT, LAMP RIGHT)            */}
        {/* Solid color background allows shadow effects and light pool to show     */}
        {/* ======================================================================= */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex items-center justify-center my-auto py-2">
          <CrumpledPaperBulbMechanism onNavigate={onNavigate} />
        </div>

        {/* Floating Studio Tech HUD Strip at bottom of canvas */}
        <div className="max-w-7xl mx-auto w-full pt-8 flex items-center justify-center relative z-20">
          <div className="flex items-center gap-1 sm:gap-2 px-3.5 py-1.5 rounded-2xl bg-[#0e1017] border border-zinc-800 shadow-xl">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-2 hidden sm:inline">
              STUDIO SUITE
            </span>
            <div className="h-4 w-px bg-zinc-800 hidden sm:inline" />

            {techIcons.map((tech) => {
              const Icon = tech.Icon;
              const isHovered = activeTechHover === tech.id;
              return (
                <div
                  key={tech.id}
                  onMouseEnter={() => {
                    sound.playHover();
                    setActiveTechHover(tech.id);
                  }}
                  onMouseLeave={() => setActiveTechHover(null)}
                  className="relative group p-1 transition-transform cursor-pointer hover:scale-125"
                  title={tech.name}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-950/90 border border-zinc-800 group-hover:border-[#d4f15d] p-1 flex items-center justify-center transition-all shadow-sm">
                    <Icon className="w-full h-full" />
                  </div>

                  {isHovered && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/95 text-white text-[10px] font-mono font-bold whitespace-nowrap border border-[#d4f15d] shadow-xl z-40">
                      {tech.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. PROMINENT CONTACT AND ORDER BUTTONS DIRECTLY AFTER THE HERO CANVAS     */}
      {/* ========================================================================= */}
      <section 
        id="home-action-hub-after-image"
        className="w-full bg-[#090a0f] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 relative z-30"
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#0e1017] border border-zinc-800 relative overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Radial Accents */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d4f15d]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text Callout */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              Ready to Bring Your <span className="text-[#d4f15d]">Vision to Life?</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-medium">
              Commission your design project with custom pre-press specifications, or get in touch directly to discuss your requirements.
            </p>
          </div>

          {/* Right Action Buttons: START ORDER, CONTACT US & EMAIL */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            
            {/* 1. START ORDER BUTTON (Primary Vibrant Studio Lime) */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigate('order');
              }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#d4f15d] hover:bg-[#bef264] active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-black/25 flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-[1.02]"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Start Order</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* 2. CONTACT US BUTTON (Direct Studio Contact Page) */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigate('contact');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white hover:text-[#bef264] border border-zinc-700/60 hover:border-[#d4f15d]/50 font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-[#bef264]" />
              <span>Contact Us</span>
            </button>

            {/* 3. DIRECT EMAIL INFO DESK BUTTON */}
            <a
              href="mailto:info@rtsoncreations.co.zw?subject=Hello%20R%27tson%20Creations%20Studio%20-%20Design%20Project%20Inquiry"
              onClick={() => sound.playClick()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-[#bef264] hover:text-white border border-zinc-700/60 hover:border-[#d4f15d]/50 font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
              title="Send message to info@rtsoncreations.co.zw"
            >
              <Mail className="w-4 h-4 text-[#bef264]" />
              <span>info@rtsoncreations.co.zw</span>
            </a>

            {/* 4. OPTIONAL ADMIN TERMINAL SHORTCUT */}
            {isAdminVisible && onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenAdmin();
                }}
                className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-zinc-900 border border-[#d4f15d]/40 text-[#bef264] hover:bg-[#d4f15d]/20 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Open Designer Admin Terminal"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Suite</span>
              </button>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};
