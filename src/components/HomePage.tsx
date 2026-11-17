import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Printer,
  Palette,
  Wand2,
  Briefcase,
  Play
} from 'lucide-react';
import { motion } from 'motion/react';
import { sound } from '../lib/soundFx';
import { PortfolioItem } from '../types';
import { StudioVideoModal } from './StudioVideoModal';

// Local high-fidelity assets matching the Figma editorial agency style
import agencyDesignerFocusImg from '../assets/images/agency_designer_focus_1792749504192.jpg';
import agencyTeamMeetingImg from '../assets/images/agency_team_meeting_1792749503417.jpg';
import agencyCreativeCollabImg from '../assets/images/agency_creative_collab_1792749505286.jpg';
import agencyStudioDeskImg from '../assets/images/agency_studio_desk_1792749505053.jpg';
import studioTeamCollabImg from '../assets/images/studio_team_collab_1792060940941.jpg';
import realChurchFlyerImg from '../assets/images/real_church_flyer_1787906566871.jpg';
import prepressCmykImg from '../assets/images/prepress_dominance_cmyk_1793786947690.jpg';
import graphicDesignShowcaseImg from '../assets/images/graphic_design_showcase_1791468112170.jpg';

interface HomePageProps {
  onNavigate: (page: 'home' | 'about' | 'products' | 'retouch' | 'contact' | 'order') => void;
  onNavigateToOrder?: (category?: string, title?: string, proposedAmount?: number) => void;
  onOpenAdmin?: () => void;
  customHeroImageUrl?: string;
  customCutoutUrl?: string;
  portfolioItems?: PortfolioItem[];
}

// Pixel-faithful signature twin-pill / twin-dot icon from Figma design
export const FigmaTwinDot: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-[#ff6b00]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="5" width="7" height="14" rx="3.5" />
    <path d="M14 5C17.866 5 21 8.13401 21 12C21 15.866 17.866 19 14 19V5Z" />
  </svg>
);

// Signature 8-point asterisk star divider from Figma marquee
export const FigmaAsterisk: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-[#ff6b00]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
  </svg>
);

// Signature 4-point sparkle star from Figma hero visual
export const FigmaSparkleStar: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-[#ff6b00]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

// Scalloped circular "HIRE US • HIRE US •" badge seal from Figma
export const FigmaHireUsBadge: React.FC<{ size?: number; onClick?: () => void }> = ({ size = 84, onClick }) => (
  <div 
    onClick={onClick}
    className="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 group select-none"
    style={{ width: size, height: size }}
    title="Hire R'tson Creations"
  >
    {/* Scalloped gear / stamp background */}
    <div className="absolute inset-0 rounded-full bg-[#141820] border-2 border-dashed border-[#ff6b00] group-hover:border-[#ff8800] transition-colors shadow-xl" />
    
    {/* Rotating SVG text around path */}
    <svg className="w-full h-full animate-[spin_18s_linear_infinite]" viewBox="0 0 100 100">
      <path 
        id="hirePath" 
        d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" 
        fill="none" 
      />
      <text className="text-[9.5px] uppercase tracking-[0.24em] font-black fill-[#ff6b00] group-hover:fill-white transition-colors">
        <textPath href="#hirePath" startOffset="0%">
          • HIRE US • HIRE US • HIRE US
        </textPath>
      </text>
    </svg>

    {/* Center arrow circle in Studio Orange */}
    <div className="absolute w-7 h-7 rounded-full bg-[#ff6b00] text-black flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
      <ArrowRight className="w-3.5 h-3.5 text-black stroke-[3]" />
    </div>
  </div>
);

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onNavigateToOrder 
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // Dynamic animated progress values (matching the 3 sliders in Figma About section)
  const [progressValues, setProgressValues] = useState({
    growth: 85,
    creativity: 80,
    management: 95
  });

  const handleStartOrder = (category?: string, title?: string) => {
    sound.playClick();
    if (onNavigateToOrder) {
      onNavigateToOrder(category || 'church_flyer', title || 'Event Flyer Commission');
    } else {
      onNavigate('order');
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden font-sans select-none bg-white text-neutral-900">
      
      {/* ========================================================================= */}
      {/* 0. TOP UTILITY BAR (Exact match to top bar in Figma Image 1)               */}
      {/* Contains phone, email, address, and right-aligned lime/orange social pill  */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#141820] text-zinc-300 text-xs border-b border-white/5 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left studio info (Zero personal contact number or personal email) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] sm:text-xs font-medium">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>Harare, Zimbabwe • Worldwide Pre-Press Delivery</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Studio Desk Active &bull; Commercial Print Clearance</span>
            </div>
          </div>

          {/* Right social media pill badge (In Studio Orange as per color requirement) */}
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#ff6b00] text-black font-bold text-[10px] shadow-sm">
            <span className="font-mono text-[9px] uppercase tracking-wider text-black">Studio Social:</span>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:scale-110 transition-transform font-bold text-black"
              title="Facebook"
            >
              FB
            </a>
            <span className="text-black/40">•</span>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:scale-110 transition-transform font-bold text-black"
              title="Instagram"
            >
              IG
            </a>
            <span className="text-black/40">•</span>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:scale-110 transition-transform font-bold text-black"
              title="X / Twitter"
            >
              X
            </a>
            <span className="text-black/40">•</span>
            <a 
              href="https://behance.net" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:scale-110 transition-transform font-bold text-black"
              title="Behance"
            >
              BE
            </a>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: DIGITAL MARKETING AGENCY LAYOUT (Figma Image 1)          */}
      {/* Left: Eyebrow + Huge Heading + Dual Buttons                               */}
      {/* Right: Asymmetric 3-card photo montage + Scalloped seal + 4-point stars   */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-white text-neutral-900 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle dot-grid pattern in background (faithful to Figma Image 1) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#141820 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
          
          {/* Left Column (5 to 6 cols): Typography and CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Tag Badge: Twin-dot icon + "Elevate Your Brand With Us" */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold tracking-wide">
              <FigmaTwinDot className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>Elevate Your Brand With Us</span>
            </div>

            {/* Huge Headline: "Empowering Your Success with Digital Expertise" */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-neutral-950 tracking-tight leading-[1.08]">
              Empowering Your <br className="hidden sm:inline" />
              Success with <br className="hidden sm:inline" />
              <span className="text-neutral-950">
                Creative Expertise
              </span>
            </h1>

            {/* Editorial Paragraph */}
            <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed max-w-lg">
              High-impact graphic design, sculpted 3D gospel event flyers, corporate visual identities, and press-ready pre-press engineering calibrated for print and digital dominance.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleStartOrder('church_flyer', 'General Studio Inquiry')}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-[#141820] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span>Explore More</span>
                <ArrowRight className="w-4 h-4 text-[#ff6b00] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigate('products');
                }}
                className="px-4 py-3 text-neutral-700 hover:text-black font-bold text-xs uppercase tracking-wider transition-colors underline underline-offset-4 decoration-neutral-300 hover:decoration-black cursor-pointer flex items-center gap-1.5"
              >
                <span>View All Services</span>
              </button>
            </div>

          </div>

          {/* Right Column (6 cols): Asymmetric 3-Card Montage + Rotating Seal + Stars */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            
            {/* The Asymmetric Photo Collage Container */}
            <div className="relative w-full max-w-[500px] h-[360px] sm:h-[440px]">
              
              {/* Card 1: Top Right Vertical Card with rounded corners */}
              <div className="absolute top-0 right-0 w-[55%] h-[68%] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white bg-neutral-200 z-10 group">
                <img 
                  src={agencyDesignerFocusImg} 
                  alt="Creative Design Lead" 
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>

              {/* Card 2: Left Middle Staggered Card */}
              <div className="absolute top-[22%] left-0 w-[50%] h-[56%] rounded-[24px] overflow-hidden shadow-xl border-4 border-white bg-neutral-300 z-20 group">
                <img 
                  src={agencyTeamMeetingImg} 
                  alt="Team Brainstorming Session" 
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>

              {/* Card 3: Bottom Right Landscape Card */}
              <div className="absolute bottom-0 right-[8%] w-[58%] h-[38%] rounded-[24px] overflow-hidden shadow-xl border-4 border-white bg-neutral-200 z-30 group">
                <img 
                  src={agencyStudioDeskImg} 
                  alt="Studio Digital Pre-Press Desk" 
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>

              {/* Overlapping Rotating "HIRE US" Scalloped Badge (Placed exactly like in Figma) */}
              <div className="absolute top-[48%] left-[36%] z-40 -translate-x-1/2 -translate-y-1/2">
                <FigmaHireUsBadge 
                  size={88} 
                  onClick={() => handleStartOrder('church_flyer', 'Direct Hire via Studio Badge')} 
                />
              </div>

              {/* 4-Point Sparkle Star Accents (Placed like in Figma Image 1) */}
              <div className="absolute -top-3 right-[45%] text-[#ff6b00] animate-pulse z-40">
                <FigmaSparkleStar className="w-6 h-6 text-[#ff6b00]" />
              </div>
              <div className="absolute bottom-6 right-0 text-[#ff6b00] z-40">
                <FigmaSparkleStar className="w-8 h-8 text-[#ff6b00]" />
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. MARQUEE TICKER BANNER (Exact match to Dark Ribbon in Figma Image 1)     */}
      {/* Dark charcoal background with bright 8-point asterisk star icons          */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#141820] text-white py-3.5 border-y border-white/10 overflow-hidden relative select-none">
        <div className="flex items-center whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {[
            'Content Marketing',
            '3D Church & Gospel Flyers',
            'Commercial Pre-Press Printing',
            'Brand Identity Systems',
            'High-End Portrait Retouching',
            'Social Media Creative Suite',
            'Event Posters & Summit Banners',
            'Packaging & Merchandise Design'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8 mx-4 sm:mx-6 shrink-0">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                {item}
              </span>
              <FigmaAsterisk className="w-4 h-4 text-[#ff6b00] shrink-0" />
            </div>
          ))}
          
          {/* Duplicate set for endless loop */}
          {[
            'Content Marketing',
            '3D Church & Gospel Flyers',
            'Commercial Pre-Press Printing',
            'Brand Identity Systems',
            'High-End Portrait Retouching',
            'Social Media Creative Suite',
            'Event Posters & Summit Banners',
            'Packaging & Merchandise Design'
          ].map((item, idx) => (
            <div key={`dup-${idx}`} className="flex items-center gap-6 sm:gap-8 mx-4 sm:mx-6 shrink-0">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                {item}
              </span>
              <FigmaAsterisk className="w-4 h-4 text-[#ff6b00] shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ABOUT SECTION (Exact match to Fold 2 in Figma Image 1)                  */}
      {/* Centered Eyebrow + Heading + 2-Column with Stacked Photos & Progress Bars  */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-white text-neutral-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* Centered Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold tracking-wide">
              <FigmaTwinDot className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>About Us</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-neutral-950 tracking-tight leading-tight">
              Empowering Your Success <br className="hidden sm:inline" />
              with Creative Expertise
            </h2>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column (6 cols): Stacked photo cards with scalloped badge & geometric arch */}
            <div className="lg:col-span-6 relative flex flex-col items-center">
              
              <div className="relative w-full max-w-[460px] space-y-4">
                
                {/* Top Landscape Photo Card */}
                <div className="w-full h-48 sm:h-56 rounded-[24px] overflow-hidden shadow-lg border-2 border-neutral-100 group">
                  <img 
                    src={agencyCreativeCollabImg} 
                    alt="Creative Direction Team" 
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>

                {/* Bottom Landscape Photo Card */}
                <div className="w-full h-48 sm:h-56 rounded-[24px] overflow-hidden shadow-lg border-2 border-neutral-100 group">
                  <img 
                    src={studioTeamCollabImg} 
                    alt="Brighton and Design Team" 
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>

                {/* Overlapping Badge and Arch geometry (Matching Figma Fold 2) */}
                <div className="absolute top-[48%] right-0 sm:-right-8 -translate-y-1/2 z-20">
                  <FigmaHireUsBadge 
                    size={72} 
                    onClick={() => handleStartOrder('simple_flyer', 'About Section Direct Hire')} 
                  />
                </div>

                {/* Geometric concentric arch outline (Figma decoration) */}
                <div className="hidden sm:block absolute top-[36%] -right-16 -translate-y-1/2 pointer-events-none opacity-40">
                  <svg className="w-20 h-20 text-neutral-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M 10 90 A 40 40 0 0 1 90 90" />
                    <path d="M 25 90 A 25 25 0 0 1 75 90" />
                    <path d="M 40 90 A 10 10 0 0 1 60 90" />
                    <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>

              </div>

            </div>

            {/* Right Column (6 cols): Description & 3 Interactive Progress Sliders */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
                At R'tson Creations, directed by Brighton, we combine uncompromising pre-press discipline with world-class graphic artistry. Every flyer, logo, and brand asset is engineered to convert viewers into loyal attendees, customers, and advocates.
              </p>

              {/* 3 Progress Bars (Exact match to sliders in Figma Image 1) */}
              <div className="space-y-5 pt-2">
                
                {/* 1. Marketing & Business Growth */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                    <span>Marketing &amp; Business Growth</span>
                    <span className="font-mono text-neutral-800">{progressValues.growth}%</span>
                  </div>
                  <div className="relative w-full h-2 rounded-full bg-neutral-200 overflow-visible">
                    <div 
                      className="h-full rounded-full bg-[#141820] relative"
                      style={{ width: `${progressValues.growth}%` }}
                    >
                      {/* Knob with vibrant accent border (like Figma slider) */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#ff6b00] border-2 border-white shadow-md" />
                    </div>
                  </div>
                </div>

                {/* 2. Creativity & Innovation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                    <span>Creativity &amp; Innovation</span>
                    <span className="font-mono text-neutral-800">{progressValues.creativity}%</span>
                  </div>
                  <div className="relative w-full h-2 rounded-full bg-neutral-200 overflow-visible">
                    <div 
                      className="h-full rounded-full bg-[#141820] relative"
                      style={{ width: `${progressValues.creativity}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#ff6b00] border-2 border-white shadow-md" />
                    </div>
                  </div>
                </div>

                {/* 3. Business & Financial Management */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                    <span>Business &amp; Financial Management</span>
                    <span className="font-mono text-neutral-800">{progressValues.management}%</span>
                  </div>
                  <div className="relative w-full h-2 rounded-full bg-neutral-200 overflow-visible">
                    <div 
                      className="h-full rounded-full bg-[#141820] relative"
                      style={{ width: `${progressValues.management}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#ff6b00] border-2 border-white shadow-md" />
                    </div>
                  </div>
                </div>

              </div>

              {/* CTA Button: About Us → */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onNavigate('about');
                  }}
                  className="px-7 py-3.5 rounded-full bg-[#141820] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>About Us</span>
                  <ArrowRight className="w-4 h-4 text-[#ff6b00]" />
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Stats Row: 4 metrics with TwinDot icons & vertical dividers (Figma Image 1) */}
          <div className="pt-8 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            
            {/* Stat 1 */}
            <div className="flex items-center justify-center gap-3">
              <div className="text-left">
                <div className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">3k+</div>
                <div className="text-xs text-neutral-500 font-semibold">Successful Projects</div>
              </div>
              <FigmaTwinDot className="hidden md:block w-4 h-4 text-[#ff6b00] ml-auto shrink-0" />
            </div>

            {/* Stat 2 */}
            <div className="flex items-center justify-center gap-3">
              <div className="text-left">
                <div className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">200+</div>
                <div className="text-xs text-neutral-500 font-semibold">Expert Team &bull; Clients</div>
              </div>
              <FigmaTwinDot className="hidden md:block w-4 h-4 text-[#ff6b00] ml-auto shrink-0" />
            </div>

            {/* Stat 3 */}
            <div className="flex items-center justify-center gap-3">
              <div className="text-left">
                <div className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">350+</div>
                <div className="text-xs text-neutral-500 font-semibold">Happy Customers</div>
              </div>
              <FigmaTwinDot className="hidden md:block w-4 h-4 text-[#ff6b00] ml-auto shrink-0" />
            </div>

            {/* Stat 4 */}
            <div className="flex items-center justify-center gap-3">
              <div className="text-left">
                <div className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">16+</div>
                <div className="text-xs text-neutral-500 font-semibold">Years of Experience</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OUR SERVICES SECTION (Exact match to Fold 3 in Figma Image 1)           */}
      {/* Deep slate container with diagonal lines + 3 Cards (Middle is featured)   */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#141820] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Diagonal stripe watermark texture (faithful to Figma Image 1) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 16px)'
          }}
        />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-zinc-200 text-xs font-bold tracking-wide">
                <FigmaTwinDot className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Our Services</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-tight">
                Boost Your Brand <br className="hidden sm:inline" />
                with Our Expertise
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigate('products');
              }}
              className="px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer shrink-0 self-start md:self-auto"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </div>

          {/* 3-Column Services Card Grid (Card 2 is the vibrant featured card from Figma!) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            
            {/* Card 1: Social Media Marketing */}
            <div className="rounded-[28px] bg-[#1a202c] border border-white/10 p-5 flex flex-col justify-between space-y-5 shadow-xl hover:border-white/20 transition-all text-left group">
              <div className="space-y-4">
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-neutral-800">
                  <img 
                    src={graphicDesignShowcaseImg} 
                    alt="Social Media and Flyer Showcase" 
                    className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white group-hover:text-[#ff6b00] transition-colors">
                    Social Media &amp; Posters
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    Conversion-driven event promotions, square Instagram feeds, story layouts, and promotional flyers engineered for viral attendance.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartOrder('simple_flyer', 'Social Media & Event Posters')}
                className="text-xs font-bold text-[#ff6b00] hover:text-white flex items-center gap-1.5 cursor-pointer pt-2"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 2: FEATURED HERO CARD (Vibrant Studio Orange matching the Lime Card in Figma) */}
            <div className="rounded-[28px] bg-[#ff6b00] text-black p-6 flex flex-col justify-between space-y-5 shadow-2xl transition-all text-left transform md:-translate-y-2 hover:scale-[1.02] duration-300">
              <div className="space-y-3">
                <h3 className="text-xl font-black text-black tracking-tight">
                  3D Church &amp; Event Art
                </h3>
                <p className="text-xs text-black/85 leading-relaxed font-semibold">
                  Sculpted 3D metallic gold typography, volumetric lighting effects, and non-destructive guest minister portrait cutouts designed for Sunday services, revivals, and international summits.
                </p>

                <button
                  type="button"
                  onClick={() => handleStartOrder('church_flyer', '3D Church & Event Art')}
                  className="text-xs font-black text-black hover:underline flex items-center gap-1.5 cursor-pointer pt-1"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>

              {/* Bottom Photo Inside Featured Card (Exact match to Figma Image 1 Card 2) */}
              <div className="w-full h-40 rounded-2xl overflow-hidden bg-black/10 border-2 border-black/10 shadow-inner">
                <img 
                  src={realChurchFlyerImg} 
                  alt="3D Church Flyer Production" 
                  className="w-full h-full object-cover contrast-105" 
                />
              </div>
            </div>

            {/* Card 3: Commercial Pre-Press & Print */}
            <div className="rounded-[28px] bg-[#1a202c] border border-white/10 p-5 flex flex-col justify-between space-y-5 shadow-xl hover:border-white/20 transition-all text-left group">
              <div className="space-y-4">
                <div className="w-full h-44 rounded-2xl overflow-hidden bg-neutral-800">
                  <img 
                    src={prepressCmykImg} 
                    alt="Pre-press CMYK Color Separation" 
                    className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white group-hover:text-[#ff6b00] transition-colors">
                    Commercial Pre-Press
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    FOGRA39 commercial offset press compliance, 300 DPI high-resolution CMYK color separation, bleed margins, and zero-defect print output.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartOrder('brochure', 'Commercial Pre-Press & Print')}
                className="text-xs font-bold text-[#ff6b00] hover:text-white flex items-center gap-1.5 cursor-pointer pt-2"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* Video Modal for Studio Showcase */}
      {isVideoModalOpen && (
        <StudioVideoModal 
          isOpen={isVideoModalOpen} 
          onClose={() => setIsVideoModalOpen(false)} 
        />
      )}

    </div>
  );
};
