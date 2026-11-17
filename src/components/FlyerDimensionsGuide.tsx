import React, { useState } from 'react';
import { 
  Layout, 
  Smartphone, 
  Instagram, 
  Facebook, 
  Printer, 
  Info, 
  Check, 
  MessageSquare, 
  Mail,
  Copy, 
  Sparkles, 
  Scissors, 
  Droplets, 
  Palette, 
  Stamp,
  Layers,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface DimensionPreset {
  id: string;
  name: string;
  category: 'social' | 'print' | 'banner';
  dimensions: string;
  aspectRatio: string;
  dpi: string;
  bestFor: string;
  bleed: string;
  aspectClass: string;
  icon: React.ReactNode;
}

interface PrintFinishPreset {
  id: string;
  name: string;
  finishType: 'mask' | 'finish' | 'die_cut' | 'color' | 'emboss';
  substrate: string;
  layerSetup: string;
  tolerance: string;
  specs: string;
  bestFor: string;
  technicalRule: string;
  richColor: string;
  icon: React.ReactNode;
}

const DIMENSION_PRESETS: DimensionPreset[] = [
  {
    id: 'whatsapp-story',
    name: 'WhatsApp Status & IG Story',
    category: 'social',
    dimensions: '1080 × 1920 px',
    aspectRatio: '9:16 Vertical Fullscreen',
    dpi: '72 - 150 DPI (RGB)',
    bestFor: 'WhatsApp Statuses, Instagram Stories, TikTok & Reels',
    bleed: 'Keep text 250px away from top/bottom',
    aspectClass: 'aspect-[9/16] max-h-64',
    icon: <Smartphone className="w-4 h-4 text-[#d4f15d]" />
  },
  {
    id: 'insta-square',
    name: 'Instagram & WhatsApp DP',
    category: 'social',
    dimensions: '1080 × 1080 px',
    aspectRatio: '1:1 Square',
    dpi: '72 - 300 DPI (RGB)',
    bestFor: 'Instagram Feed, WhatsApp Profile, Facebook Post',
    bleed: 'Centered composition with 50px safe margin',
    aspectClass: 'aspect-square max-h-56',
    icon: <Instagram className="w-4 h-4 text-blue-400" />
  },
  {
    id: 'fb-banner',
    name: 'Facebook Event & Landscape',
    category: 'social',
    dimensions: '1200 × 630 px',
    aspectRatio: '1.91:1 Landscape',
    dpi: '72 - 150 DPI (RGB)',
    bestFor: 'Facebook Events, Website Banners, Email Newsletters',
    bleed: 'Keep key text centered for mobile cropping',
    aspectClass: 'aspect-[1.91/1] max-h-40',
    icon: <Facebook className="w-4 h-4 text-blue-400" />
  },
  {
    id: 'print-a4-a3',
    name: 'A4 & A3 Church Posters',
    category: 'print',
    dimensions: '210 × 297 mm (A4) / 297 × 420 mm (A3)',
    aspectRatio: '1:1.414 Standard ISO Print',
    dpi: '300 DPI High-Res (CMYK)',
    bestFor: 'Church Wall Posters, Noticeboards, Event Handbills',
    bleed: '3mm Bleed on all 4 edges + 5mm Safe Margin',
    aspectClass: 'aspect-[1/1.414] max-h-64',
    icon: <Printer className="w-4 h-4 text-[#d4f15d]" />
  },
  {
    id: 'rollup-banner',
    name: 'Roll-Up / Pull-Up Banner',
    category: 'banner',
    dimensions: '850 × 2000 mm (2.8 × 6.5 ft)',
    aspectRatio: '1:2.35 Tall Banner',
    dpi: '150 - 300 DPI (CMYK)',
    bestFor: 'Church Stage Altars, Conference Entrances, Exhibitions',
    bleed: '50mm at bottom for cassette roller mechanism',
    aspectClass: 'aspect-[8.5/20] max-h-72',
    icon: <Layout className="w-4 h-4 text-blue-400" />
  }
];

const PRINT_FINISH_PRESETS: PrintFinishPreset[] = [
  {
    id: 'spot-uv',
    name: 'Spot UV Vector Mask (100% K)',
    finishType: 'mask',
    substrate: 'Matte Lamination 350-400gsm Board',
    layerSetup: 'Dedicated top vector layer named "SPOT_UV". Objects filled with 100% Solid Black (C:0 M:0 Y:0 K:100) on 0% background opacity.',
    tolerance: 'Minimum 0.5pt stroke thickness, 1.0mm registration shift buffer.',
    specs: 'High-gloss polymer liquid resin cured instantly under high-intensity ultraviolet lights.',
    bestFor: 'Luxury business cards, church flyer titles, metallic chrome typography highlights & book covers.',
    technicalRule: 'Never run Spot UV directly across structural crease or fold lines (varnish will crack). Keep away from trimming blades by at least 2mm.',
    richColor: 'from-[#d4f15d]/20 to-[#bef264]/30 border-[#d4f15d]/50 text-[#d4f15d]',
    icon: <Sparkles className="w-4 h-4 text-[#d4f15d]" />
  },
  {
    id: 'foil-stamp',
    name: 'Hot Foil Stamping (Gold / Chrome / Hologram)',
    finishType: 'finish',
    substrate: 'Coated Art Board, Soft-Touch Velvet, or Uncoated Cotton Stock',
    layerSetup: 'Separate vector layer named "FOIL_STAMP_PMS". Use 100% Spot Color swatch with "Overprint Fill" enabled to prevent CMYK knockouts.',
    tolerance: 'Minimum 0.35pt vector stroke. 0.75mm space between adjacent foil letters to prevent bridging.',
    specs: 'Precision-etched brass/magnesium heated metal die pressing pigment foil onto stock under pneumatic pressure.',
    bestFor: 'Majestic 3D Church Crests, Pastoral Anniversary seals, VIP Gala invitations & executive certificates.',
    technicalRule: 'Vector artwork strictly required. No photographic gradients or half-tone raster screens. Convert all text to outlined vectors (Cmd+Shift+O).',
    richColor: 'from-yellow-500/20 to-amber-600/30 border-yellow-500/50 text-yellow-300',
    icon: <Stamp className="w-4 h-4 text-yellow-400" />
  },
  {
    id: 'die-cut',
    name: 'Die-Cut Packaging Nets & Crease Lines',
    finishType: 'die_cut',
    substrate: '280-450gsm Folding Boxboard (FBB) or Rigid Kraft Card',
    layerSetup: 'Cut Lines = 100% Spot Magenta (0.5pt solid stroke) labeled "CUT". Crease/Fold Lines = 100% Spot Cyan (0.5pt dashed stroke) labeled "CREASE".',
    tolerance: '3mm to 5mm external bleed beyond cut edge. 4mm internal safe margin from all crease lines.',
    specs: 'Custom wooden rule die with razor-sharp steel cutting and rounded creasing rules.',
    bestFor: 'Custom packaging boxes, door-hanger flyers, die-cut church event passes & retail product tags.',
    technicalRule: 'Include 1.5x paper caliper score allowance on inner tuck flaps to ensure clean folding without paper buckling or tearing.',
    richColor: 'from-fuchsia-500/20 to-pink-600/30 border-fuchsia-500/50 text-pink-300',
    icon: <Scissors className="w-4 h-4 text-pink-400" />
  },
  {
    id: 'pantone-cmyk',
    name: 'Pantone (PMS) & CMYK Rich Black Profile',
    finishType: 'color',
    substrate: 'Coated (Pantone C) vs. Uncoated (Pantone U) paper formulations',
    layerSetup: 'Target CMYK Color Profile: "ISO Coated v2 300% (ECI)" or "GRACoL 2006". Large black fills: C:60 M:40 Y:40 K:100 (Rich Black).',
    tolerance: 'Total Area Coverage (TAC / Max Ink Density) ≤ 300% to prevent ink offsetting & smudging.',
    specs: 'Single-pigment calibrated spot ink formulations maintaining Delta-E ≤ 2.0 brand consistency.',
    bestFor: 'Corporate brand identity manuals, vibrant church neon posters, packaging, and commercial offset press.',
    technicalRule: 'Never set body text below 12pt in 4-color Rich Black; always use 100% K only for fine text to avoid CMYK misregistration ghosting.',
    richColor: 'from-blue-500/20 to-cyan-600/30 border-blue-500/50 text-blue-300',
    icon: <Palette className="w-4 h-4 text-blue-400" />
  },
  {
    id: 'emboss-deboss',
    name: 'Blind & Multi-Level Embossing / Debossing',
    finishType: 'emboss',
    substrate: 'Heavyweight 350-600gsm Long-Fiber Cotton or Duplexed Board',
    layerSetup: 'Vector path layer named "EMBOSS_3D" (raised relief) or "DEBOSS_3D" (sunken impression). 0.4pt minimum detail stroke.',
    tolerance: 'Depth matched to paper caliper (typically 0.2mm to 0.4mm depth). 1.5mm offset from outer trim.',
    specs: 'Counter-matched male and female brass dies that physically reform paper fibers without heat or foil.',
    bestFor: 'Presidential certificates, church consecration medallions, luxury business cards & seal stamps.',
    technicalRule: 'Requires long-grain cotton or recycled rag paper. Wood-pulp stocks can crack under high relief pressures.',
    richColor: 'from-emerald-500/20 to-teal-600/30 border-emerald-500/50 text-emerald-300',
    icon: <Layers className="w-4 h-4 text-emerald-400" />
  }
];

export const FlyerDimensionsGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'finishes'>('canvas');
  const [selectedId, setSelectedId] = useState<string>('whatsapp-story');
  const [selectedFinishId, setSelectedFinishId] = useState<string>('spot-uv');
  const [copied, setCopied] = useState<boolean>(false);

  const currentPreset = DIMENSION_PRESETS.find(p => p.id === selectedId) || DIMENSION_PRESETS[0];
  const currentFinish = PRINT_FINISH_PRESETS.find(f => f.id === selectedFinishId) || PRINT_FINISH_PRESETS[0];

  const handleCopy = () => {
    if (activeTab === 'canvas') {
      navigator.clipboard.writeText(`${currentPreset.name}: ${currentPreset.dimensions} (${currentPreset.aspectRatio}, ${currentPreset.dpi}) - Bleed: ${currentPreset.bleed}`);
    } else {
      navigator.clipboard.writeText(`R'tson Pre-Press Specs for ${currentFinish.name}:
- Layer Setup: ${currentFinish.layerSetup}
- Substrate: ${currentFinish.substrate}
- Tolerance: ${currentFinish.tolerance}
- Technical Rule: ${currentFinish.technicalRule}`);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="dimensions-guide-section" className="py-16 sm:py-20 bg-gradient-to-b from-[#050c18] via-[#081832] to-[#050c18] border-t border-[#1e3a8a]/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#08151c] to-[#0c1f24] border border-[#d4f15d]/40 text-[#d4f15d] text-xs font-bold shadow-md shadow-black/40">
            <Layout className="w-3.5 h-3.5 text-[#d4f15d]" />
            <span>Studio Production & Technical Cheat-Sheet</span>
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#d4f15d] to-[#bef264] inline-block"></span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Print Bleeds, Dimensions & Technical Finishes
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Review production tolerances, aspect ratios, Spot UV mask rules, foil stamp layers, and die-cut net guidelines calibrated for commercial printing.
          </p>

          {/* Tab Navigation Switcher */}
          <div className="flex items-center justify-center pt-3">
            <div className="inline-flex p-1 rounded-xl bg-[#040d1e] border border-[#1e3a8a]/60 shadow-lg">
              <button
                type="button"
                onClick={() => setActiveTab('canvas')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'canvas'
                    ? 'bg-[#d4f15d] text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Canvas Dimensions & Safe Margins</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('finishes')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'finishes'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Spot UV, Foil & Die-Cut Packaging Specs</span>
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'canvas' ? (
          <>
            {/* Preset Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {DIMENSION_PRESETS.map((preset) => {
                const isSelected = preset.id === selectedId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedId(preset.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#d4f15d] border-[#bef264] text-slate-950 font-black shadow-lg shadow-[#d4f15d]/20'
                        : 'bg-gradient-to-b from-[#091b38] to-[#061226] border-[#1e3a8a]/40 text-slate-300 hover:border-blue-400/60 hover:to-[#0e2754]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded bg-[#050c18] border border-[#1e3a8a]/40">
                        {preset.icon}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-black text-[#d4f15d] border border-black' : 'bg-[#050c18] text-slate-400 border border-[#1e3a8a]/30'
                      }`}>
                        {preset.category.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-slate-950 font-black' : 'text-white'}`}>{preset.name}</h4>
                      <p className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        {preset.dimensions}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detail Inspection Terminal Box */}
            <div className="rounded-2xl bg-gradient-to-b from-[#091b38] to-[#061124] border border-[#1e3a8a]/50 shadow-2xl shadow-blue-950/40 overflow-hidden max-w-4xl mx-auto">
              
              {/* Terminal Bar */}
              <div className="px-4 py-3 bg-gradient-to-r from-[#060f20] via-[#091730] to-[#0d2217] border-b border-[#1e3a8a]/40 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-[#d4f15d] inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
                  <span className="text-xs font-mono font-bold text-slate-200 ml-2">
                    TERMINAL // PRE-PRESS SPECIFICATION INSPECTOR
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-[#050c18] hover:bg-[#091834] text-slate-200 border border-[#1e3a8a]/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  {copied ? <Check className="w-3 h-3 text-[#d4f15d]" /> : <Copy className="w-3 h-3 text-blue-400" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Specs'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-center">
                
                {/* Visual Aspect Ratio Representation */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[#050c18] rounded-xl border border-[#1e3a8a]/30 min-h-[260px] shadow-inner">
                  <div className={`w-full max-w-[200px] border-2 border-dashed border-[#d4f15d]/80 rounded-lg p-3 flex flex-col items-center justify-center bg-gradient-to-b from-[#091834]/80 to-[#0e2316]/80 text-center ${currentPreset.aspectClass}`}>
                    <span className="text-xs font-bold text-white">{currentPreset.name}</span>
                    <span className="text-[10px] font-mono text-[#d4f15d] mt-1">{currentPreset.dimensions}</span>
                    <span className="text-[9px] font-mono text-slate-300 mt-0.5">{currentPreset.aspectRatio}</span>
                  </div>
                </div>

                {/* Spec Details */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{currentPreset.name}</span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-sm">
                        {currentPreset.dpi}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {currentPreset.bestFor}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-[#050c18] border border-[#1e3a8a]/30">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Canvas Resolution</span>
                      <span className="font-mono font-bold text-white text-xs">{currentPreset.dimensions}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#050c18] border border-[#1e3a8a]/30">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Aspect Ratio</span>
                      <span className="font-mono font-bold text-white text-xs">{currentPreset.aspectRatio}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-gradient-to-r from-[#050c18] to-[#0c1f14] border border-[#d4f15d]/50 text-xs text-slate-200 flex items-start gap-2 shadow-sm">
                    <Info className="w-4 h-4 text-[#d4f15d] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">Safe Zone & Bleed Instructions:</strong>
                      <span className="text-[11px] text-slate-300">{currentPreset.bleed}</span>
                    </div>
                  </div>

                  <a
                    href={`mailto:info@rtsoncreations.co.zw?subject=${encodeURIComponent(`Flyer Dimensions Request: ${currentPreset.name}`)}&body=${encodeURIComponent(`Hello R'tson Creations Studio Team,\n\nI need a flyer designed in ${currentPreset.name} (${currentPreset.dimensions}).\n\nPlease let me know the requirements and turnaround.\n\nThank you!`)}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4f15d] hover:bg-[#bef264] text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-[#d4f15d]/20"
                    title="Send inquiry to info@rtsoncreations.co.zw"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-950" />
                    <span>Inquire via <span className="lowercase font-mono">info@rtsoncreations.co.zw</span></span>
                  </a>
                </div>

              </div>

            </div>
          </>
        ) : (
          <>
            {/* Print Finishes Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
              {PRINT_FINISH_PRESETS.map((finish) => {
                const isSelected = finish.id === selectedFinishId;
                return (
                  <button
                    key={finish.id}
                    onClick={() => setSelectedFinishId(finish.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 border-blue-400 text-white shadow-xl shadow-blue-950/70'
                        : 'bg-gradient-to-b from-[#091b38] to-[#061226] border-[#1e3a8a]/40 text-slate-300 hover:border-blue-400/60 hover:to-[#0e2754]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded bg-[#050c18] border border-[#1e3a8a]/40">
                        {finish.icon}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-[#050c18] text-blue-300 border border-blue-500/50' : 'bg-[#050c18] text-slate-400 border border-[#1e3a8a]/30'
                      }`}>
                        PRE-PRESS
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{finish.name}</h4>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                        {finish.specs}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Print Finishes Technical Inspector Box */}
            <div className="rounded-2xl bg-gradient-to-b from-[#081734] to-[#050f22] border border-blue-500/40 shadow-2xl shadow-blue-950/60 overflow-hidden max-w-4xl mx-auto">
              
              {/* Terminal Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-[#051126] via-[#091b3c] to-[#030917] border-b border-[#1e3a8a]/50 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                  <span className="text-xs font-mono font-bold text-blue-200 ml-2">
                    TECHNICAL PRINT LAB // SPOT UV, FOIL & PACKAGING NET SPECS
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-[#040d1c] hover:bg-[#0c244f] text-slate-200 border border-blue-500/40 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
                  <span>{copied ? 'Copied Specs' : 'Copy Print Specs'}</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Title & Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#1e3a8a]/40">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-blue-950/80 border border-blue-500/40">
                        {currentFinish.icon}
                      </span>
                      <span>{currentFinish.name}</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {currentFinish.bestFor}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs font-mono px-3 py-1 rounded-lg bg-blue-900/60 border border-blue-400/50 text-blue-200 font-bold">
                      Handoff Ready
                    </span>
                  </div>
                </div>

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  <div className="p-4 rounded-xl bg-[#040d1e] border border-[#1e3a8a]/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px] uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Vector Layer Structure</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
                      {currentFinish.layerSetup}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#040d1e] border border-[#1e3a8a]/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Registration & Tolerance Limits</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      {currentFinish.tolerance}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#040d1e] border border-[#1e3a8a]/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Recommended Substrate / Stock</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      {currentFinish.substrate}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#040d1e] border border-[#1e3a8a]/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px] uppercase tracking-wider">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Production Physical Process</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      {currentFinish.specs}
                    </p>
                  </div>

                </div>

                {/* Critical Technical Rule Box */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-[#0a1c3b] to-[#040d1e] border border-amber-500/50 text-xs text-slate-200 flex items-start gap-3 shadow-md">
                  <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block mb-1 text-xs">
                      Critical Pre-Press Rule for Print Vendors:
                    </strong>
                    <span className="text-[11px] text-slate-200 leading-relaxed">
                      {currentFinish.technicalRule}
                    </span>
                  </div>
                </div>

                {/* Handoff Call to Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All R'tson Creations pre-press files are certified ready for commercial offset & digital print shops.</span>
                  </div>

                  <a
                    href={`mailto:info@rtsoncreations.co.zw?subject=${encodeURIComponent(`Pre-Press Print Preparation: ${currentFinish.name}`)}&body=${encodeURIComponent(`Hello R'tson Creations Studio Team,\n\nI need pre-press print preparation for ${currentFinish.name}.\n\nPlease provide specifications and quote.\n\nThank you!`)}`}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-blue-950/60"
                    title="Send inquiry to info@rtsoncreations.co.zw"
                  >
                    <Mail className="w-3.5 h-3.5 text-white" />
                    <span>Inquire Pre-Press File Preparation</span>
                  </a>
                </div>

              </div>

            </div>
          </>
        )}

      </div>
    </section>
  );
};
