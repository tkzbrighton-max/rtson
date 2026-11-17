import React, { useState } from 'react';
import { 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  RefreshCw
} from 'lucide-react';
import { sound } from '../../lib/soundFx';
import { FilterPresetId } from '../../lib/imageProcessing';

export interface AdjustState {
  // Details & Clarity
  sharpness: number;
  clarity: number;
  smoothSkin: number;
  // Tone & Exposure
  brightness: number;
  contrast: number;
  highlights: number;
  shadows: number;
  saturation: number;
  // Color & White Balance
  temperature: number;
  tint: number;
  goldSkinGlow: number;
  // Filters
  selectedFilter: FilterPresetId | 'none';
  filterStrength: number;
  // Effects
  vignette: boolean;
  vignetteStrength: number;
  filmGrain: number;
  halation: number;
  rimLightColor: 'none' | 'gold' | 'cyan' | 'white' | 'lime' | 'orange';
  dropShadow: boolean;
  // Perspective & Crop
  aspectRatioPreset: 'original' | '1:1' | '4:5' | '9:16' | '16:9' | '3:4';
  rotation: number;
  skewX: number;
  skewY: number;
  isFlippedH: boolean;
  isFlippedV: boolean;
}

interface AdjustToolsPanelProps {
  adjustState: AdjustState;
  onUpdateAdjust: <K extends keyof AdjustState>(key: K, value: AdjustState[K]) => void;
  onResetAdjust: () => void;
  themeSwatchHex: string;
}

type CategorySection = 'preset' | 'tones' | 'clarity' | 'effects' | 'crop';

export const AdjustToolsPanel: React.FC<AdjustToolsPanelProps> = ({
  adjustState,
  onUpdateAdjust,
  onResetAdjust,
  themeSwatchHex
}) => {
  const [activeCategory, setActiveCategory] = useState<CategorySection>('preset');

  const categories: { id: CategorySection; label: string }[] = [
    { id: 'preset', label: 'Color Grade' },
    { id: 'tones', label: 'Exposure' },
    { id: 'clarity', label: 'Skin & Clarity' },
    { id: 'effects', label: 'Studio Effects' },
    { id: 'crop', label: 'Crop & Format' }
  ];

  const rimLightOptions = [
    { value: 'none', label: 'None (No Rim Light)' },
    { value: 'gold', label: '24K Royal Gold' },
    { value: 'cyan', label: 'Electric Cyan' },
    { value: 'white', label: 'Studio White' },
    { value: 'lime', label: 'Electric Lime' }
  ];

  const grainPresets = [
    { value: 0, label: 'Clean (No Grain)' },
    { value: 15, label: 'Subtle Film (15%)' },
    { value: 35, label: 'Analog 35mm (35%)' },
    { value: 60, label: 'Heavy Grain (60%)' }
  ];

  const halationPresets = [
    { value: 0, label: 'None (0%)' },
    { value: 20, label: 'Soft Halo (20%)' },
    { value: 45, label: 'Radiant Glow (45%)' }
  ];

  const aspectRatioOptions = [
    { value: 'original', label: 'Original Dimensions' },
    { value: '1:1', label: '1:1 Square (Instagram)' },
    { value: '4:5', label: '4:5 Portrait (IG / Print)' },
    { value: '9:16', label: '9:16 Story / Reel' },
    { value: '16:9', label: '16:9 Widescreen' },
    { value: '3:4', label: '3:4 Standard Poster' }
  ];

  return (
    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4 text-white">
      
      {/* Category Dropdown & Quick Reset */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="space-y-1 flex-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Adjustment Category</label>
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => {
                sound.playClick();
                setActiveCategory(e.target.value as CategorySection);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onResetAdjust();
          }}
          className="text-[11px] font-bold text-[#ff6b00] hover:underline flex items-center gap-1 cursor-pointer shrink-0 pt-4"
          title="Reset adjustments"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. COLOR GRADE PRESET CATEGORY */}
      {activeCategory === 'preset' && (
        <div className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-200">Color Grading Preset</label>
            <div className="relative">
              <select
                value={adjustState.selectedFilter}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateAdjust('selectedFilter', e.target.value as FilterPresetId | 'none');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer appearance-none min-h-[44px]"
              >
                <option value="none">Original (No Filter)</option>
                <optgroup label="Studio & Portraits">
                  <option value="studio_gold">Warm Amber Gold</option>
                  <option value="clean_portrait">Studio Clean High-Key</option>
                  <option value="gold_radiance">Cinematic Sunburst</option>
                </optgroup>
                <optgroup label="Cinematic & Dramatic">
                  <option value="moody_noir">Moody Obsidian Noir</option>
                  <option value="hdr_punch">3D HDR Contrast</option>
                  <option value="vintage_film">Analog Film Tone</option>
                  <option value="teal_orange">Teal & Amber Grade</option>
                </optgroup>
                <optgroup label="Creative Accents">
                  <option value="neon_cyber">Electric Cyber Violet</option>
                  <option value="soft_rose">Rose Champagne</option>
                  <option value="emerald_luxe">Emerald Luxury</option>
                </optgroup>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {adjustState.selectedFilter !== 'none' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Preset Strength</span>
                <span className="font-mono text-[#ff6b00]">{adjustState.filterStrength}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustState.filterStrength}
                onChange={(e) => onUpdateAdjust('filterStrength', Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff6b00]"
              />
            </div>
          )}
        </div>
      )}

      {/* 2. EXPOSURE & TONES CATEGORY */}
      {activeCategory === 'tones' && (
        <div className="space-y-3">
          {/* Exposure Preset Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Tone Preset</label>
            <div className="relative">
              <select
                onChange={(e) => {
                  sound.playClick();
                  const mode = e.target.value;
                  if (mode === 'standard') {
                    onUpdateAdjust('brightness', 100);
                    onUpdateAdjust('contrast', 100);
                    onUpdateAdjust('saturation', 100);
                  } else if (mode === 'brighten') {
                    onUpdateAdjust('brightness', 115);
                    onUpdateAdjust('contrast', 105);
                  } else if (mode === 'contrast') {
                    onUpdateAdjust('brightness', 102);
                    onUpdateAdjust('contrast', 125);
                    onUpdateAdjust('saturation', 110);
                  } else if (mode === 'shadow_lift') {
                    onUpdateAdjust('shadows', 30);
                    onUpdateAdjust('brightness', 108);
                  }
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
              >
                <option value="standard">Standard Balanced</option>
                <option value="brighten">Bright & Airy</option>
                <option value="contrast">Punchy Contrast</option>
                <option value="shadow_lift">Shadow Lift</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-2 pt-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Brightness</span>
                <span className="font-mono text-slate-400">{adjustState.brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={adjustState.brightness}
                onChange={(e) => onUpdateAdjust('brightness', Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff6b00]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-300">Contrast</span>
                <span className="font-mono text-zinc-400">{adjustState.contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={adjustState.contrast}
                onChange={(e) => onUpdateAdjust('contrast', Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff6b00]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-300">Saturation</span>
                <span className="font-mono text-zinc-400">{adjustState.saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={adjustState.saturation}
                onChange={(e) => onUpdateAdjust('saturation', Number(e.target.value))}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff6b00]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Warmth</span>
                <span className="font-mono text-slate-400">{adjustState.temperature > 0 ? `+${adjustState.temperature}` : adjustState.temperature}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={adjustState.temperature}
                onChange={(e) => onUpdateAdjust('temperature', Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. CLARITY & SKIN RETOUCH CATEGORY */}
      {activeCategory === 'clarity' && (
        <div className="space-y-3">
          {/* Retouch Preset Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400">Skin Preset</label>
            <div className="relative">
              <select
                onChange={(e) => {
                  sound.playClick();
                  const mode = e.target.value;
                  if (mode === 'natural') {
                    onUpdateAdjust('smoothSkin', 10);
                    onUpdateAdjust('clarity', 15);
                    onUpdateAdjust('sharpness', 45);
                  } else if (mode === 'studio') {
                    onUpdateAdjust('smoothSkin', 35);
                    onUpdateAdjust('clarity', 20);
                    onUpdateAdjust('sharpness', 60);
                  } else if (mode === 'smooth') {
                    onUpdateAdjust('smoothSkin', 60);
                    onUpdateAdjust('clarity', 10);
                    onUpdateAdjust('sharpness', 50);
                  }
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
              >
                <option value="natural">Natural Texture</option>
                <option value="studio">Studio Portrait</option>
                <option value="smooth">High Smoothing</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Skin Smoothing</span>
                <span className="font-mono text-amber-400">{adjustState.smoothSkin}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustState.smoothSkin}
                onChange={(e) => onUpdateAdjust('smoothSkin', Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Clarity</span>
                <span className="font-mono text-cyan-400">{adjustState.clarity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustState.clarity}
                onChange={(e) => onUpdateAdjust('clarity', Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Sharpness</span>
                <span className="font-mono text-cyan-400">{adjustState.sharpness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustState.sharpness}
                onChange={(e) => onUpdateAdjust('sharpness', Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. STUDIO EFFECTS & RIM LIGHTING */}
      {activeCategory === 'effects' && (
        <div className="space-y-3">
          {/* Rim Light Color Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-200">Studio Rim Lighting</label>
            <div className="relative">
              <select
                value={adjustState.rimLightColor}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateAdjust('rimLightColor', e.target.value as any);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
              >
                {rimLightOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Film Grain Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-200">Analog Film Grain</label>
            <div className="relative">
              <select
                value={adjustState.filmGrain}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateAdjust('filmGrain', Number(e.target.value));
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
              >
                {grainPresets.map(preset => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
                {!grainPresets.some(g => g.value === adjustState.filmGrain) && (
                  <option value={adjustState.filmGrain}>Custom ({adjustState.filmGrain}%)</option>
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Halation Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-200">Halation Glow</label>
            <div className="relative">
              <select
                value={adjustState.halation}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateAdjust('halation', Number(e.target.value));
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none"
              >
                {halationPresets.map(preset => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
                {!halationPresets.some(h => h.value === adjustState.halation) && (
                  <option value={adjustState.halation}>Custom ({adjustState.halation}%)</option>
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Vignette Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onUpdateAdjust('vignette', !adjustState.vignette);
              }}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                adjustState.vignette
                  ? 'bg-[#ff6b00]/15 border-[#ff6b00]/40 text-[#ff6b00]'
                  : 'bg-white/[0.03] border-white/10 text-zinc-400'
              }`}
            >
              <span>Vignette Edge Framing</span>
              <span className={`w-2.5 h-2.5 rounded-full ${adjustState.vignette ? 'bg-[#ff6b00]' : 'bg-neutral-600'}`} />
            </button>
          </div>
        </div>
      )}

      {/* 5. CROP & ASPECT RATIO CATEGORY */}
      {activeCategory === 'crop' && (
        <div className="space-y-3.5">
          {/* Aspect Ratio Preset Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-200">Aspect Ratio Crop</label>
            <div className="relative">
              <select
                value={adjustState.aspectRatioPreset}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateAdjust('aspectRatioPreset', e.target.value as any);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-[#ff6b00] cursor-pointer appearance-none min-h-[44px]"
              >
                {aspectRatioOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Orientation Actions */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <label className="text-[11px] font-bold text-zinc-400">Orientation</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onUpdateAdjust('rotation', (adjustState.rotation + 90) % 360);
                }}
                className="py-2.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                title="Rotate 90 degrees"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onUpdateAdjust('isFlippedH', !adjustState.isFlippedH);
                }}
                className={`py-2.5 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                  adjustState.isFlippedH ? 'bg-[#ff6b00]/20 border-[#ff6b00] text-[#ff6b00]' : 'bg-white/[0.04] border-white/10 text-zinc-300'
                }`}
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Flip H</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onUpdateAdjust('isFlippedV', !adjustState.isFlippedV);
                }}
                className={`py-2.5 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] ${
                  adjustState.isFlippedV ? 'bg-[#ff6b00]/20 border-[#ff6b00] text-[#ff6b00]' : 'bg-white/[0.04] border-white/10 text-zinc-300'
                }`}
                title="Flip Vertical"
              >
                <FlipVertical className="w-3.5 h-3.5" />
                <span>Flip V</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
