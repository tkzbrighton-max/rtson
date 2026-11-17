import React, { useState } from 'react';
import { 
  ArrowRight, 
  Layers, 
  Printer, 
  Palette, 
  Wand2, 
  Briefcase, 
  Sparkles, 
  Clock, 
  Check, 
  Play, 
  ChevronRight, 
  ShieldCheck, 
  Calculator,
  Compass,
  ArrowUpRight,
  Send,
  Eye,
  Sliders,
  X
} from 'lucide-react';
import { PortfolioItem } from '../types';
import { sound } from '../lib/soundFx';
import { StudioVideoModal } from './StudioVideoModal';

// Local high-fidelity assets matching Save Nature design
import mountainSunsetImg from '../assets/images/sunset_mountain_peaks_1792060940363.jpg';
import prepressDominanceImg from '../assets/images/prepress_dominance_cmyk_1793786947690.jpg';
import studioTeamCollabImg from '../assets/images/studio_team_collab_1792060940941.jpg';
import realChurchFlyerImg from '../assets/images/real_church_flyer_1787906566871.jpg';
import realEventFlyerImg from '../assets/images/real_event_flyer_1787906580291.jpg';
import brandGoldImg from '../assets/images/brand_strategy_3d_gold_1793786960181.jpg';
import retouchSpeakerImg from '../assets/images/retouch_speaker_portrait_1793783365797.jpg';

interface ProductsPageProps {
  portfolioItems: PortfolioItem[];
  showcaseVideos?: unknown[];
  onSelectDesignForOrder: (item: PortfolioItem) => void;
  onPreviewItem: (item: PortfolioItem) => void;
  onNavigateToOrder: (category?: string, prefilledTitle?: string, proposedAmount?: number) => void;
}

// Sprout / leaf icon from Save Nature design
const SaveNatureSproutIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4 text-[#ff6b00]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);

export const ProductsPage: React.FC<ProductsPageProps> = ({
  portfolioItems,
  onSelectDesignForOrder,
  onPreviewItem,
  onNavigateToOrder
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [quickInput, setQuickInput] = useState<string>('');
  const [newsletterInput, setNewsletterInput] = useState<string>('');
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string>('');
  const [newsletterSuccessMsg, setNewsletterSuccessMsg] = useState<string>('');

  // Interactive Pricing Calculator State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [calcQuantity, setCalcQuantity] = useState<number>(1);
  const [calcTier, setCalcTier] = useState<'standard' | 'pro' | 'vip'>('pro');
  const [calcRush, setCalcRush] = useState<boolean>(false);
  const [calcMotion, setCalcMotion] = useState<boolean>(false);
  const [calcSource, setCalcSource] = useState<boolean>(false);

  // Compute calculated price
  const basePrices = { standard: 10, pro: 15, vip: 25 };
  const calculatedTotal = (
    basePrices[calcTier] * calcQuantity +
    (calcRush ? 10 : 0) +
    (calcMotion ? 12 : 0) +
    (calcSource ? 8 : 0)
  );

  const handleQuickEstimateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    sound.playSuccess();
    setQuoteSuccessMsg(`Estimate initiated for ${quickInput}! Routing to checkout...`);
    setTimeout(() => {
      onNavigateToOrder('church_flyer', `Commission inquiry for ${quickInput}`, 15);
    }, 900);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterInput.trim()) return;
    sound.playSuccess();
    setNewsletterSuccessMsg('Thank you! You are subscribed for exclusive rate cards.');
    setTimeout(() => setNewsletterSuccessMsg(''), 4000);
    setNewsletterInput('');
  };

  const handleSelectPackage = (tier: 'standard' | 'pro' | 'vip', title: string, amount: number) => {
    sound.playClick();
    onNavigateToOrder(
      tier === 'standard' ? 'simple_flyer' : tier === 'pro' ? 'church_flyer' : 'branding',
      title,
      amount
    );
  };

  return (
    <div className="relative w-full overflow-x-hidden font-sans select-none bg-white text-neutral-900 pb-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24 pt-4 sm:pt-8">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: SAVE NATURE LAYOUT (Figma Image 2)                       */}
        {/* Left: Eyebrow + Huge Heading + Dual Input/Social proof + 4 Stat cards     */}
        {/* Right: Split screen visual + Watch story play button + 3 floating cards   */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-[32px] bg-[#f9fafb] border border-neutral-200/80 p-6 sm:p-10 lg:p-12 shadow-xs overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column (6 cols): Typography & Interactive Quick Estimate */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Eyebrow badge (Together For A Greener Planet -> Crafting Creative Excellence) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-bold tracking-wide shadow-xs">
                <SaveNatureSproutIcon className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span className="uppercase text-[11px] tracking-wider text-neutral-700 font-black">
                  Crafting Flawless Visual Impact
                </span>
              </div>

              {/* Huge Editorial Headline (Exact match to "Save Nature, Save Tomorrow") */}
              <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black text-neutral-950 tracking-tight leading-[1.08]">
                Save Time, <br />
                <span className="text-[#ff6b00]">
                  Print Flawlessly.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed max-w-lg">
                We unite high-impact graphic design, sculpted 3D typography, and strict commercial pre-press engineering to eliminate reprints and build a commanding brand presence.
              </p>

              {/* Quick Input Bar with Action Button (Exact match to Save Nature hero input) */}
              <form onSubmit={handleQuickEstimateSubmit} className="space-y-2 max-w-md">
                <div className="flex items-center rounded-full bg-white border border-neutral-300 p-1.5 shadow-sm focus-within:border-[#ff6b00] focus-within:ring-2 focus-within:ring-[#ff6b00]/20 transition-all">
                  <input 
                    type="text" 
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder="Enter your email or phone number..." 
                    className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#141820] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#ff6b00]" />
                  </button>
                </div>

                {quoteSuccessMsg && (
                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 px-2">
                    <Check className="w-3.5 h-3.5" />
                    <span>{quoteSuccessMsg}</span>
                  </p>
                )}
              </form>

              {/* Social Proof Row with 3 Avatars (Exact match to Save Nature) */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px] border-2 border-white shadow-xs">
                    R
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#ff6b00] text-black flex items-center justify-center font-black text-[10px] border-2 border-white shadow-xs">
                    B
                  </div>
                  <div className="w-7 h-7 rounded-full bg-neutral-700 text-white flex items-center justify-center font-bold text-[10px] border-2 border-white shadow-xs">
                    Z
                  </div>
                </div>
                <div className="text-xs font-semibold text-neutral-700">
                  <span className="font-bold text-neutral-950">Join 500+</span> church ministries, event organizers &amp; brands
                </div>
              </div>

            </div>

            {/* Right Column (6 cols): Split Visual Card + Video Play + 3 Overlapping Floating Badges */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              
              <div className="relative w-full max-w-[500px] h-[360px] sm:h-[420px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-neutral-900">
                
                {/* Split Visual Container: Left side concept art, Right side gold pre-press master */}
                <div className="absolute inset-0 grid grid-cols-2">
                  
                  {/* Left Side: Creative concept / wireframe / green landscape */}
                  <div className="relative h-full overflow-hidden border-r-2 border-white/30">
                    <img 
                      src={mountainSunsetImg} 
                      alt="Raw Creative Concept" 
                      className="w-full h-full object-cover grayscale contrast-125" 
                    />
                    <div className="absolute inset-0 bg-neutral-950/20" />
                    <span className="absolute bottom-4 left-4 text-[10px] font-mono font-bold uppercase tracking-widest text-white/80 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      1. Design Concept
                    </span>
                  </div>

                  {/* Right Side: Finished 3D Pre-Press Master */}
                  <div className="relative h-full overflow-hidden">
                    <img 
                      src={brandGoldImg} 
                      alt="Finished 3D Pre-Press Master" 
                      className="w-full h-full object-cover contrast-110" 
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <span className="absolute bottom-4 right-4 text-[10px] font-mono font-bold uppercase tracking-widest text-black bg-[#ff6b00] px-2 py-0.5 rounded-md font-black shadow-xs">
                      2. Press Master
                    </span>
                  </div>

                </div>

                {/* Center "Watch Our Story" Play Button (Exact match to Save Nature) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsVideoModalOpen(true);
                    }}
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-neutral-900 font-bold text-xs shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-neutral-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#ff6b00] text-black flex items-center justify-center">
                      <Play className="w-3 h-3 fill-black text-black ml-0.5" />
                    </div>
                    <span>Watch Our Story</span>
                  </button>
                </div>

                {/* 3 Overlapping Floating Badges on Right (Responsive across mobile & desktop) */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30 space-y-1.5 sm:space-y-2 pointer-events-auto">
                  
                  {/* Badge 1: Pre-Press Ready */}
                  <div className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-neutral-200/80 max-w-[160px] sm:max-w-[200px]">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                      <img src={prepressDominanceImg} alt="Pre-Press" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] sm:text-[11px] font-black text-neutral-900 leading-tight">Pre-Press Ready</div>
                      <div className="text-[8px] sm:text-[9px] text-neutral-500 font-medium">300 DPI CMYK</div>
                    </div>
                  </div>

                  {/* Badge 2: Photo Retouching (Responsive) */}
                  <div className="hidden xs:flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-neutral-200/80 max-w-[160px] sm:max-w-[200px]">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                      <img src={retouchSpeakerImg} alt="Retouching" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] sm:text-[11px] font-black text-neutral-900 leading-tight">Photo Retouching</div>
                      <div className="text-[8px] sm:text-[9px] text-neutral-500 font-medium">Hair isolation</div>
                    </div>
                  </div>

                  {/* Badge 3: Express Turnaround */}
                  <div className="hidden sm:flex items-center gap-2.5 p-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-neutral-200/80 max-w-[200px]">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                      <img src={realEventFlyerImg} alt="Express Turnaround" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] font-black text-neutral-900 leading-tight">Same-Day SLA</div>
                      <div className="text-[9px] text-neutral-500 font-medium">12 – 24hr delivery</div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* 4 Stat Cards in a row at bottom of hero (Exact match to Save Nature 4 cards) */}
          <div className="mt-10 pt-8 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="rounded-2xl bg-white border border-neutral-200 p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">520+</div>
              <div className="text-[11px] text-neutral-500 font-semibold mt-0.5">Posters Designed</div>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-200 p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">120+</div>
              <div className="text-[11px] text-neutral-500 font-semibold mt-0.5">Church Ministries</div>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-200 p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">350+</div>
              <div className="text-[11px] text-neutral-500 font-semibold mt-0.5">Projects Completed</div>
            </div>

            <div className="rounded-2xl bg-white border border-neutral-200 p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-[#ff6b00] tracking-tight">100%</div>
              <div className="text-[11px] text-neutral-500 font-semibold mt-0.5">Print-Ready SLA</div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 2. MIDDLE SECTION: "OUR MISSION / CORE TIERS" (Save Nature Fold 2)        */}
        {/* Left: Typography + Dual Buttons                                           */}
        {/* Right: 3 Tall Vertical Landscape Pillar Cards with circular icon badges    */}
        {/* ========================================================================= */}
        <section className="relative w-full space-y-10 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column (5 cols): Tag + Headline + Paragraph + Dual Buttons */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-wide">
                <SaveNatureSproutIcon className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span className="uppercase text-[10px] tracking-wider font-mono font-bold">Our Production Mission</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-neutral-950 tracking-tight leading-tight">
                We're Delivering <br />
                a <span className="text-[#ff6b00]">Bolder, Sharper,</span> <br />
                Stronger Standard.
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                Through uncompromising pre-press education, precision color separation, and 3D typography innovation, we empower churches, corporate organizations, and event creators to dominate physical and digital feeds.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                  className="px-6 py-3 rounded-full bg-[#141820] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>{isCalculatorOpen ? 'Close Calculator' : 'Pricing Calculator'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPackage('pro', 'Pro 3D Pre-Press Flyer', 15)}
                  className="px-6 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs uppercase tracking-wider border border-neutral-300 transition-colors cursor-pointer"
                >
                  <span>Custom Quote</span>
                </button>
              </div>

            </div>

            {/* Right Column (7 cols): 3 Tall Vertical Pillar Cards (Exact match to Save Nature) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
              
              {/* Pillar Card 1: Standard Event Flyer */}
              <div 
                onClick={() => handleSelectPackage('standard', 'Standard Event Flyer', 10)}
                className="group relative rounded-[28px] overflow-hidden bg-neutral-900 h-[380px] sm:h-[440px] flex flex-col justify-between p-5 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl text-left border border-neutral-200"
              >
                <img 
                  src={mountainSunsetImg} 
                  alt="Standard Event Tier" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Circular Icon Badge at top (Exact match to Save Nature) */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-lg group-hover:bg-[#ff6b00] group-hover:text-black transition-colors">
                  <Palette className="w-5 h-5" />
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-2 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white font-bold backdrop-blur-xs">
                      Standard Tier
                    </span>
                    <span className="text-sm font-black text-[#ff6b00]">$10</span>
                  </div>
                  <h3 className="text-lg font-black text-white leading-tight">
                    Event Promo Flyer
                  </h3>
                  <p className="text-xs text-zinc-300 leading-snug line-clamp-3">
                    Social media 1:1, vertical story format, high-res web exports &amp; quick turnaround.
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] group-hover:text-white transition-colors">
                    <span>Order Standard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Pillar Card 2: Pro 3D & Pre-Press (Highlighted) */}
              <div 
                onClick={() => handleSelectPackage('pro', 'Pro 3D Pre-Press Flyer', 15)}
                className="group relative rounded-[28px] overflow-hidden bg-neutral-900 h-[380px] sm:h-[440px] flex flex-col justify-between p-5 cursor-pointer shadow-2xl transition-all duration-300 hover:scale-[1.03] text-left border-2 border-[#ff6b00]"
              >
                <img 
                  src={prepressDominanceImg} 
                  alt="Pro 3D Pre-Press Tier" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                {/* Circular Icon Badge */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#ff6b00] text-black flex items-center justify-center shadow-lg">
                  <Printer className="w-5 h-5" />
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-2 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-[#ff6b00] text-black px-2 py-0.5 rounded-full font-black">
                      Most Popular
                    </span>
                    <span className="text-sm font-black text-white">$15</span>
                  </div>
                  <h3 className="text-lg font-black text-white leading-tight">
                    Pro 3D &amp; Pre-Press
                  </h3>
                  <p className="text-xs text-zinc-200 leading-snug line-clamp-3">
                    Sculpted 3D metallic typography, 300 DPI CMYK print master, bleed margins &amp; speaker retouch.
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] group-hover:text-white transition-colors">
                    <span>Order Pro Tier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Pillar Card 3: VIP Complete Suite */}
              <div 
                onClick={() => handleSelectPackage('vip', 'VIP Complete Event Suite', 25)}
                className="group relative rounded-[28px] overflow-hidden bg-neutral-900 h-[380px] sm:h-[440px] flex flex-col justify-between p-5 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.03] text-left border border-neutral-200"
              >
                <img 
                  src={studioTeamCollabImg} 
                  alt="VIP Complete Suite" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Circular Icon Badge */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-lg group-hover:bg-[#ff6b00] group-hover:text-black transition-colors">
                  <Layers className="w-5 h-5" />
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-2 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white font-bold backdrop-blur-xs">
                      VIP Suite
                    </span>
                    <span className="text-sm font-black text-[#ff6b00]">$25</span>
                  </div>
                  <h3 className="text-lg font-black text-white leading-tight">
                    Complete Campaign
                  </h3>
                  <p className="text-xs text-zinc-300 leading-snug line-clamp-3">
                    Flyer + physical banner adaptation + print-ready tickets + VIP badges + priority express queue.
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#ff6b00] group-hover:text-white transition-colors">
                    <span>Order VIP Suite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Pricing Calculator Drawer (Accessible when toggled) */}
          {isCalculatorOpen && (
            <div className="rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#ff6b00]" />
                    <span>Real-Time Production Cost Estimator</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Select tier, quantity, and add-ons to calculate exact upfront pricing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Select Tier */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Select Tier</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['standard', 'pro', 'vip'] as const).map((tierKey) => (
                      <button
                        key={tierKey}
                        type="button"
                        onClick={() => setCalcTier(tierKey)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                          calcTier === tierKey 
                            ? 'bg-[#ff6b00] text-black font-black' 
                            : 'bg-white/10 text-white hover:bg-white/15'
                        }`}
                      >
                        {tierKey} (${basePrices[tierKey]})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Flyer Variations: <span className="text-[#ff6b00] font-black">{calcQuantity}</span>
                  </label>
                  <input 
                    type="range" 
                    min={1} 
                    max={10} 
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                    className="w-full accent-[#ff6b00]"
                  />
                </div>

                {/* Add-ons */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Optional Add-ons</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcRush(!calcRush)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        calcRush ? 'bg-[#ff6b00] text-black border-[#ff6b00]' : 'border-white/20 text-zinc-300'
                      }`}
                    >
                      Rush SLA (+ $10)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcMotion(!calcMotion)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        calcMotion ? 'bg-[#ff6b00] text-black border-[#ff6b00]' : 'border-white/20 text-zinc-300'
                      }`}
                    >
                      Motion Reel (+ $12)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcSource(!calcSource)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        calcSource ? 'bg-[#ff6b00] text-black border-[#ff6b00]' : 'border-white/20 text-zinc-300'
                      }`}
                    >
                      PSD Master (+ $8)
                    </button>
                  </div>
                </div>

              </div>

              {/* Total Row */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-xs text-zinc-400 font-mono">Calculated Total:</span>
                  <div className="text-3xl font-black text-white">
                    ${calculatedTotal} <span className="text-xs font-normal text-zinc-400">/ ZWG equivalent</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPackage(calcTier, `Calculated ${calcTier.toUpperCase()} Package (${calcQuantity}x)`, calculatedTotal)}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#ff6b00] hover:bg-[#ff7a00] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ff6b00]/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Proceed to Commission</span>
                  <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
                </button>
              </div>

            </div>
          )}

        </section>

        {/* ========================================================================= */}
        {/* 3. PARTNER / TRUSTED BY LOGOS (Exact match to Save Nature banner)         */}
        {/* ========================================================================= */}
        <div className="py-6 border-y border-neutral-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
              TRUSTED BY
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <span>Grace Harvest Ministries</span>
              <span>Kingdom Embassy</span>
              <span>Apex Media Africa</span>
              <span>Harare Business Summit</span>
              <span>SoundCity Live</span>
              <span>ZimPrint Commercial</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. BOTTOM SECTION: "OUR INITIATIVES / REAL ACTIONS" (Save Nature Fold 3)  */}
        {/* Left: 3 Vertical Initiative Cards with tags & high-res artwork            */}
        {/* Right: Bold typography + Newsletter / Direct Booking Box                  */}
        {/* ========================================================================= */}
        <section className="relative w-full text-left space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column (7 cols): 3 Vertical Initiative Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Sacred Media */}
              <div className="rounded-3xl bg-[#f9fafb] border border-neutral-200/80 p-4 space-y-3 shadow-xs hover:border-neutral-300 transition-all text-left group">
                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-neutral-200">
                  <img 
                    src={realChurchFlyerImg} 
                    alt="3D Church Posters" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute bottom-2 left-2 text-[9px] font-mono font-bold uppercase tracking-wider bg-white/95 text-neutral-900 px-2 py-0.5 rounded-md shadow-xs">
                    3D Sacred Media
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-neutral-900 group-hover:text-[#ff6b00] transition-colors">
                    Commanding Event Flyers
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Sculpted 3D metallic typography, dramatic backlighting, and guest speaker isolation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectPackage('pro', '3D Sacred Media', 15)}
                  className="text-[11px] font-bold text-[#ff6b00] hover:text-black flex items-center gap-1 pt-1"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 2: Pre-Press CMYK */}
              <div className="rounded-3xl bg-[#f9fafb] border border-neutral-200/80 p-4 space-y-3 shadow-xs hover:border-neutral-300 transition-all text-left group">
                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-neutral-200">
                  <img 
                    src={prepressDominanceImg} 
                    alt="Commercial Pre-Press" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute bottom-2 left-2 text-[9px] font-mono font-bold uppercase tracking-wider bg-white/95 text-neutral-900 px-2 py-0.5 rounded-md shadow-xs">
                    Pre-Press CMYK
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-neutral-900 group-hover:text-[#ff6b00] transition-colors">
                    Commercial Press Mastery
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    300 DPI high-resolution CMYK color separation, bleed margins, and press clearance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectPackage('pro', 'Commercial Pre-Press', 15)}
                  className="text-[11px] font-bold text-[#ff6b00] hover:text-black flex items-center gap-1 pt-1"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Card 3: Retouch Desk */}
              <div className="rounded-3xl bg-[#f9fafb] border border-neutral-200/80 p-4 space-y-3 shadow-xs hover:border-neutral-300 transition-all text-left group">
                <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-neutral-200">
                  <img 
                    src={retouchSpeakerImg} 
                    alt="Photo Retouch Desk" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute bottom-2 left-2 text-[9px] font-mono font-bold uppercase tracking-wider bg-white/95 text-neutral-900 px-2 py-0.5 rounded-md shadow-xs">
                    Retouch Desk
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-neutral-900 group-hover:text-[#ff6b00] transition-colors">
                    Flawless Portrait Art
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Micro-pore skin texture retention, clothing recoloring, and hair extraction.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectPackage('standard', 'Photo Retouching & Isolation', 10)}
                  className="text-[11px] font-bold text-[#ff6b00] hover:text-black flex items-center gap-1 pt-1"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>

            {/* Right Column (5 cols): Typography + The Signature Yellow/Orange Tinted Card */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-tight">
                  Real Actions. Real Impact. <br />
                  A Better Standard.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                  Discover how we turn raw event ideas, speaker snapshots, and corporate briefs into pre-press masterpieces ready for immediate distribution across Southern Africa.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="text-xs font-bold text-neutral-900 hover:text-[#ff6b00] flex items-center gap-1.5 pt-1"
                >
                  <span>View All Package Specifications</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* The Signature Tinted Yellow-Green / Orange Card from Save Nature */}
              <div className="rounded-[28px] bg-[#ff6b00]/10 border border-[#ff6b00]/30 p-6 space-y-4 shadow-sm text-left">
                <div className="space-y-1">
                  <h4 className="text-base font-black text-neutral-950">
                    Stay Inspired. Stay Informed.
                  </h4>
                  <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                    Subscribe to our studio bulletin to receive verified pre-press guides, promotional rate cards, and priority express turnaround.
                  </p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="flex items-center rounded-full bg-white border border-neutral-300 p-1 focus-within:border-[#ff6b00] shadow-xs">
                    <input 
                      type="text" 
                      value={newsletterInput}
                      onChange={(e) => setNewsletterInput(e.target.value)}
                      placeholder="Enter your email or phone" 
                      className="w-full bg-transparent px-3.5 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-full bg-[#141820] hover:bg-black text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="w-3 h-3 text-[#ff6b00]" />
                    </button>
                  </div>

                  {newsletterSuccessMsg && (
                    <p className="text-xs font-bold text-emerald-700 flex items-center gap-1 px-1">
                      <Check className="w-3 h-3" />
                      <span>{newsletterSuccessMsg}</span>
                    </p>
                  )}
                </form>

                <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-neutral-700">
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-black">f</div>
                    <div className="w-5 h-5 rounded-full bg-[#ff6b00] text-black flex items-center justify-center text-[9px] font-black">ig</div>
                  </div>
                  <span>Join thousands of event organizers &amp; ministers</span>
                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* Video Showcase Modal */}
      {isVideoModalOpen && (
        <StudioVideoModal 
          isOpen={isVideoModalOpen} 
          onClose={() => setIsVideoModalOpen(false)} 
        />
      )}

    </div>
  );
};
