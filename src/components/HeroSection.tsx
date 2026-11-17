import React from 'react';
import { ShieldCheck, Clock, ArrowRight, Layers } from 'lucide-react';
import studioWorkstationBg from '../assets/images/rtson_website_purple.svg';

interface HeroSectionProps {
  onOpenCalculator: () => void;
  onSelectCategory: (cat: string, subType?: string) => void;
  onSelectStudioView: (viewId: string) => void;
  customHeroImageUrl?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCalculator,
  onSelectCategory,
  onSelectStudioView,
  customHeroImageUrl
}) => {
  const activeHeroBg = customHeroImageUrl || studioWorkstationBg;

  return (
    <div id="hero-section" className="relative overflow-hidden bg-gradient-to-b from-[#050c18] via-[#081730] to-[#050e1d] border-b border-[#1e3a8a]/30 pt-8 pb-12 lg:pt-12 lg:pb-16 text-white">
      
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: `url(${activeHeroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#050c18]/95 via-[#081832]/90 to-[#050e1d]/80 pointer-events-none" />

      {/* Ambient Gradient Glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#d4f15d]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            {/* Studio Motto Ribbon */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#d4f15d]/15 via-lime-500/10 to-blue-500/15 border border-[#d4f15d]/30 text-xs text-[#d4f15d] shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#d4f15d]" />
              <span className="font-semibold text-lime-200">
                <strong className="text-[#d4f15d] font-bold uppercase tracking-wide">Studio Motto:</strong> "Transforming Visions into Vibrant Realities with Speed, Precision, and Creative Excellence."
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              High-Impact Graphic Design <br />
              <span className="bg-gradient-to-r from-[#d4f15d] via-[#bef264] to-[#a3e635] bg-clip-text text-transparent">
                With 12–24h Turnaround
              </span>
            </h1>

            {/* Studio Statement */}
            <div className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed space-y-2">
              <p>
                At R'tson Creations, we craft high-impact graphic design, 3D metallic typography, and pre-press perfected flyers engineered to command attention across print and digital media.
              </p>
              <p className="text-slate-400">
                From church revival posters and nightclub events to corporate brand identities, every design is delivered in 12–24 hours with guaranteed 300 DPI CMYK/RGB precision and transparent pricing.
              </p>
            </div>

            {/* Quick Category Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { id: 'church_flyer', name: 'Church 3D', badge: '3D Gold' },
                { id: 'simple_flyer', name: 'Business Flyers', badge: '12h Express' },
                { id: 'event_poster', name: 'Event Posters', badge: 'Neon FX' },
                { id: 'brochure', name: 'Brochures', badge: 'Bi/Tri-Fold' },
                { id: 'presentation', name: 'Pitch Decks', badge: 'Keynotes' },
                { id: 'social_media', name: 'Social Media', badge: 'IG & FB' },
                { id: 'branding', name: 'Vector Logos', badge: 'AI/SVG' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#091834] hover:bg-[#0e244d] border border-[#1e3a8a]/50 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] text-[#d4f15d] font-mono font-bold">
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCalculator}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-sm shadow-lg shadow-black/20 transition-all cursor-pointer"
              >
                <span>Start Order & Calculate Price</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

            {/* Features Row */}
            <div className="pt-3 flex items-center gap-4 text-xs text-slate-300 font-bold border-t border-[#1e3a8a]/30">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4f15d]" />
                <span>12-24h Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>300 DPI Print Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-white" />
                <span>Revisions Included</span>
              </div>
            </div>

          </div>

          {/* Right Highlight: Compact Live Deliverables & Specs Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#071329] border border-[#1e3a8a]/50 shadow-xl overflow-hidden">
              
              {/* Card Header */}
              <div className="px-4 py-2.5 bg-[#050c18] border-b border-[#1e3a8a]/40 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200">
                  DESIGN DELIVERABLES & SPECS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e3a8a] text-white font-bold">
                  2026 STUDIO
                </span>
              </div>

              {/* Deliverables List */}
              <div className="p-3 space-y-1.5 text-xs text-slate-200">
                {[
                  { name: 'Simple Business Flyers', desc: 'A4/Letter promos • Print & Social', badge: '12-24h Delivery' },
                  { name: 'Church & Gospel 3D', desc: '3D Gold Typography & Lighting', badge: '24h Express', highlight: true },
                  { name: 'Nightclub & DJ Posters', desc: 'VIP party flyers • High-energy flares', badge: '12-24h Delivery' },
                  { name: 'Corporate Brochures', desc: 'Bi-fold & tri-fold • Print PDF', badge: '24-48h Delivery' },
                  { name: 'Pitch Decks & Keynotes', desc: '10-15 master slides • PPTX & PDF', badge: '24-48h Delivery' },
                  { name: 'Vector Logo & Brand Suite', desc: 'AI/SVG vector source files', badge: '48h Studio' },
                ].map((row, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      row.highlight 
                        ? 'bg-[#0f1d38] border-[#d4f15d]/50' 
                        : 'bg-[#050c18] border-[#1e3a8a]/30'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white block">{row.name}</span>
                      <span className="text-[10px] text-slate-400">{row.desc}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#d4f15d] font-mono text-[11px]">{row.badge}</span>
                      <span className="block text-[9px] text-slate-400">300 DPI Ready</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="p-2.5 bg-[#050c18] border-t border-[#1e3a8a]/40">
                <button
                  onClick={onOpenCalculator}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] hover:from-[#2563eb] hover:to-[#3b82f6] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/40"
                >
                  <span>Start Order & Calculate Price</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
