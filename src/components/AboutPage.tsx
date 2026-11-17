import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft,
  Play, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Printer, 
  Palette, 
  Wand2, 
  Check, 
  Menu,
  Clock,
  Camera,
  Flame,
  Globe
} from 'lucide-react';
import { sound } from '../lib/soundFx';
import { StudioVideoModal } from './StudioVideoModal';

// Local high-fidelity photography assets for changing documentary backgrounds
import mountainSunsetImg from '../assets/images/sunset_mountain_peaks_1792060940363.jpg';
import studioTeamCollabImg from '../assets/images/studio_team_collab_1792060940941.jpg';
import prepressDominanceImg from '../assets/images/prepress_dominance_cmyk_1793786947690.jpg';
import agencyDesignerFocusImg from '../assets/images/agency_designer_focus_1792749504192.jpg';
import brightonFounderImg from '../assets/images/brighton_founder_laptop_1790843148910.jpg';

// Direct path to the uploaded Africa Documentary artwork
const AFRICA_DOCUMENTARY_HERO = '/assets/aistudio/Africa_-_Documentary_Series_Landing_Page_1f842867.jpeg';

interface AboutPageProps {
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
}

interface DocumentarySlide {
  id: string;
  label: string;
  kicker: string;
  giantTitle: string;
  image: string;
  tagline: string;
  location: string;
  quote: string;
  accentColor: string;
}

// 4 Changing Documentary Background Scenes with Specialized Typography
const DOCUMENTARY_SLIDES: DocumentarySlide[] = [
  {
    id: 'africa',
    label: 'AFRICA',
    kicker: 'SEVEN WORLDS ONE PLANET',
    giantTitle: 'AFRICA',
    image: AFRICA_DOCUMENTARY_HERO,
    tagline: 'Home to the greatest wildlife gatherings and creative visual movements on Earth, where fearless artistry meets uncompromising print discipline.',
    location: 'Serengeti & Zambezi Plains',
    quote: 'The heart of world-class scale and majestic visual power.',
    accentColor: '#ff6b00'
  },
  {
    id: 'zimbabwe',
    label: 'ZIMBABWE',
    kicker: 'HERITAGE OF ARTISTIC COURAGE',
    giantTitle: 'ZIMBABWE',
    image: mountainSunsetImg,
    tagline: 'Born in Harare, engineering cultural emblems, gospel summit posters, and corporate brand systems that command continental respect.',
    location: 'Harare • Victoria Falls',
    quote: 'Artisan craftsmanship rooted in African resilience and precision.',
    accentColor: '#ff8800'
  },
  {
    id: 'atelier',
    label: 'ATELIER',
    kicker: 'THE MASTER WORKBENCH',
    giantTitle: 'ATELIER',
    image: studioTeamCollabImg,
    tagline: 'Led by Brighton, combining handcrafted typographic geometry, 3D gold shaders, and real-time client collaboration.',
    location: 'R\'tson Creations Studio',
    quote: 'Where raw ideas are sculpted into museum-grade digital assets.',
    accentColor: '#ffaa00'
  },
  {
    id: 'prepress',
    label: 'PRE-PRESS',
    kicker: 'FOGRA39 COMMERCIAL STANDARD',
    giantTitle: 'PRE-PRESS',
    image: prepressDominanceImg,
    tagline: '300 DPI high-resolution CMYK color separation, bleed margins, ink density auditing, and zero-defect commercial offset press passes.',
    location: 'Industrial Press Clearance',
    quote: 'Zero costly reprints. 100% true-to-life physical ink output.',
    accentColor: '#ff6b00'
  }
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const activeSlide = DOCUMENTARY_SLIDES[activeSlideIndex];

  // Automatic background change timer (cycles every 7 seconds like a documentary banner)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % DOCUMENTARY_SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNextSlide = () => {
    sound.playClick();
    setIsAutoPlaying(false);
    setActiveSlideIndex((prev) => (prev + 1) % DOCUMENTARY_SLIDES.length);
  };

  const handlePrevSlide = () => {
    sound.playClick();
    setIsAutoPlaying(false);
    setActiveSlideIndex((prev) => (prev - 1 + DOCUMENTARY_SLIDES.length) % DOCUMENTARY_SLIDES.length);
  };

  const handleSelectSlide = (idx: number) => {
    sound.playClick();
    setIsAutoPlaying(false);
    setActiveSlideIndex(idx);
  };

  return (
    <div className="relative w-full overflow-x-hidden font-sans select-none bg-neutral-950 text-white">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC DOCUMENTARY HERO: BBC EARTH / AFRICA LANDING (Figma Image 1) */}
      {/* Full-bleed cinematic hero with cycling backgrounds & giant typography     */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden select-none">
        
        {/* Dynamic Backgrounds with Smooth Cross-Fade and Subtle Cinematic Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img 
                src={activeSlide.image} 
                alt={activeSlide.label} 
                className="w-full h-full object-cover object-center filter brightness-90 contrast-110" 
              />
              
              {/* Atmospheric Vignette & Contrast Overlay so typography reads with documentary punch */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/80 pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top Documentary Navigation Header inside the frame (Exact BBC Earth Lockup) */}
        <div className="relative z-20 flex items-center justify-between border-b border-white/15 pb-4 sm:pb-6 text-xs font-bold tracking-widest text-white/90">
          
          {/* Left: Menu & Document Title */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 text-white" />
              <span className="hidden sm:inline uppercase">About Studio</span>
            </button>
            <span className="hidden md:inline text-white/40">•</span>
            <button 
              type="button"
              onClick={() => {
                sound.playClick();
                setIsVideoModalOpen(true);
              }}
              className="hidden md:inline hover:text-[#ff6b00] transition-colors cursor-pointer uppercase"
            >
              Where To Watch
            </button>
          </div>

          {/* Center: BBC Earth Style Logo Lockup for R'tson Creations */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-1.5 cursor-pointer group"
            title="R'tson Creations Studio"
          >
            <div className="flex items-center gap-1">
              <span className="bg-white text-black px-1.5 py-0.5 font-mono font-black text-xs sm:text-sm tracking-tight rounded-xs group-hover:bg-[#ff6b00] transition-colors">
                R
              </span>
              <span className="bg-white text-black px-1.5 py-0.5 font-mono font-black text-xs sm:text-sm tracking-tight rounded-xs group-hover:bg-[#ff6b00] transition-colors">
                T
              </span>
              <span className="bg-white text-black px-1.5 py-0.5 font-mono font-black text-xs sm:text-sm tracking-tight rounded-xs group-hover:bg-[#ff6b00] transition-colors">
                S
              </span>
            </div>
            <span className="text-white font-mono text-xs sm:text-sm tracking-wider font-light lowercase">
              studio
            </span>
          </div>

          {/* Right: Social Media Direct Links */}
          <div className="flex items-center gap-3 sm:gap-4 text-white/80">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#ff6b00] transition-colors text-[11px] font-bold">f</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#ff6b00] transition-colors text-[11px] font-bold">tw</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#ff6b00] transition-colors text-[11px] font-bold">ig</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#ff6b00] transition-colors text-[11px] font-bold">yt</a>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CENTERPIECE: HUGE CINEMATIC TYPOGRAPHY WITH WELL-EFFECTED BACKGROUND       */}
        {/* "SEVEN WORLDS ONE PLANET / AFRICA" style with drop shadow & blend depth    */}
        {/* ========================================================================= */}
        <div className="relative z-20 my-auto py-12 sm:py-20 text-center space-y-3 sm:space-y-4">
          
          {/* Eyebrow Kicker */}
          <motion.div
            key={`kicker-${activeSlide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] sm:tracking-[0.35em] uppercase text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
          >
            {activeSlide.kicker}
          </motion.div>

          {/* Giant Monumental Headline (AFRICA / ZIMBABWE / ATELIER / PRE-PRESS) */}
          <motion.h1
            key={`title-${activeSlide.id}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[130px] font-black tracking-[0.08em] sm:tracking-[0.18em] text-white drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] uppercase select-none leading-tight sm:leading-none break-words"
            style={{
              textShadow: '0 10px 40px rgba(0,0,0,0.85), 0 0 60px rgba(255,107,0,0.25)'
            }}
          >
            {activeSlide.giantTitle}
          </motion.h1>

          {/* Accent Location Pill */}
          <motion.div
            key={`loc-${activeSlide.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 border border-white/20 text-zinc-300 text-[11px] font-mono tracking-widest uppercase backdrop-blur-md"
          >
            <Compass className="w-3 h-3 text-[#ff6b00]" />
            <span>{activeSlide.location}</span>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM CONTROLS & CHAPTER SELECTOR (Exact match to BBC Earth landing)     */}
        {/* Left: Narrative text | Center: Bordered CTA | Right: Chapter selector      */}
        {/* ========================================================================= */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center md:items-end border-t border-white/15 pt-4 sm:pt-6 text-left">
          
          {/* Left (4 cols): Narrative Story Caption */}
          <div className="md:col-span-4 space-y-1">
            <p className="text-xs sm:text-[13px] text-zinc-300 font-medium leading-relaxed max-w-sm drop-shadow-md">
              {activeSlide.tagline}
            </p>
          </div>

          {/* Center (4 cols): Bordered "WATCH TRAILER" CTA Button (Exact match) */}
          <div className="md:col-span-4 flex items-center justify-start md:justify-center">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsVideoModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-none border border-white/80 hover:border-[#ff6b00] hover:bg-[#ff6b00] hover:text-black text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-xs flex items-center justify-center gap-2 group min-h-[44px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Trailer</span>
            </button>
          </div>

          {/* Right (4 cols): Interactive Chapter Switcher & Arrow Controls */}
          <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-2 text-xs font-mono font-bold tracking-wider">
            
            <button 
              type="button"
              onClick={handlePrevSlide}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-[#ff6b00] transition-colors cursor-pointer"
              title="Previous Background Scene"
              aria-label="Previous scene"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Clickable Chapter Names with horizontal scroll on small screens */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1">
              {DOCUMENTARY_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => handleSelectSlide(idx)}
                  className={`min-h-[44px] px-1.5 flex items-center transition-colors cursor-pointer uppercase whitespace-nowrap text-[11px] sm:text-xs ${
                    idx === activeSlideIndex 
                      ? 'text-[#ff6b00] font-black border-b-2 border-[#ff6b00]' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {slide.label}
                </button>
              ))}
            </div>

            <button 
              type="button"
              onClick={handleNextSlide}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-[#ff6b00] transition-colors cursor-pointer"
              title="Next Background Scene"
              aria-label="Next scene"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. DOCUMENTARY CHAPTERS: THE STORY OF BRIGHTON & R'TSON CREATIONS          */}
      {/* Editorial layout detailing origin, design philosophy, tools & standards    */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        
        {/* Chapter 01: The Founder's Odyssey */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-[#ff6b00] uppercase">
              Documentary Chapter 01
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              From Harare Streets to <br />
              Pan-African Command.
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-normal">
              Brighton established R'tson Creations with a solitary conviction: that African faith-based and commercial graphic design should rival the world's most sophisticated creative agencies.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed font-normal">
              By rejecting generic internet templates and embracing custom mathematical 3D gold extrusion, dramatic studio chiaroscuro lighting, and strict pre-press color separations, the studio grew into an international powerhouse serving clients across Zimbabwe, South Africa, Botswana, the UK, and the USA.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('order')}
                className="px-6 py-3 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ff6b00]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Commission Brighton</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors cursor-pointer"
              >
                <span>View Rate Cards</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#161a22] aspect-[16/10] relative group">
              <img 
                src={brightonFounderImg} 
                alt="Brighton Creative Director" 
                className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-left">
                <div>
                  <h3 className="text-lg font-black text-white">Brighton (Takudzwa)</h3>
                  <p className="text-xs text-zinc-300 font-mono">Founder &amp; Pre-Press Director &bull; R'tson Creations</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#ff6b00] text-black flex items-center justify-center font-black text-xs shadow-md">
                  RC
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Chapter 02: Core Pillars of Craft */}
        <section className="space-y-10 text-left">
          
          <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#ff6b00] uppercase">
                Documentary Chapter 02
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                The Anatomy of African Visual Power
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono max-w-xs">
              Engineered for maximum emotional reverence and commercial conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="rounded-3xl bg-[#141820] border border-white/10 p-6 space-y-4 shadow-xl text-left">
              <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Sculpted 3D Typography</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Every title letter is sculpted with volumetric beveling, chrome and gold shaders, and specular reflection highlights that leap off physical print boards.
              </p>
            </div>

            <div className="rounded-3xl bg-[#141820] border border-white/10 p-6 space-y-4 shadow-xl text-left">
              <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center font-bold">
                <Wand2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Frequency Separation Retouch</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Guest minister and executive portraits are isolated with hair-strand micro-detail, authentic skin pore retention, and directional rim lighting.
              </p>
            </div>

            <div className="rounded-3xl bg-[#141820] border border-white/10 p-6 space-y-4 shadow-xl text-left">
              <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/15 text-[#ff6b00] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">FOGRA39 Press Calibration</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Calibrated against international press standards with full bleed margins, total ink limit compliance, and zero pixelation on billboard scaling.
              </p>
            </div>

          </div>

        </section>

        {/* Chapter 03: Direct Call to Action */}
        <section className="rounded-3xl bg-gradient-to-r from-[#141820] via-[#1a202c] to-[#141820] border border-white/15 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b00]/10 rounded-full blur-3xl pointer-events-none" />
          
          <span className="text-xs font-mono font-bold tracking-widest text-[#ff6b00] uppercase">
            Documentary Series Final Chapter
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-2xl mx-auto">
            Ready to Experience the African Creative Standard?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Whether preparing for an international summit, a Sunday service crusade, or corporate rebrand, Brighton and our atelier are ready to bring your vision to life.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('order')}
              className="px-8 py-3.5 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#ff6b00]/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Commission Custom Artwork</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('retouch')}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors cursor-pointer"
            >
              <span>Explore AI Retouch Desk</span>
            </button>
          </div>
        </section>

      </div>

      {/* Video Modal for Studio Documentary Trailer */}
      {isVideoModalOpen && (
        <StudioVideoModal 
          isOpen={isVideoModalOpen} 
          onClose={() => setIsVideoModalOpen(false)} 
        />
      )}

    </div>
  );
};
